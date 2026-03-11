// src/pages/admin/AppointmentRequest.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Toolbar, Alert, CircularProgress, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider,Paper, TextField} from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import AdminNavbar from "./AdminNavbar";
import dayjs from "dayjs";
import axios from "axios";
import { useAuth } from "../../context/Appcontext"; 
import { auth } from "../../firebase"; 

type AppointmentStatus = "pending" | "accepted" | "denied" | "rescheduled";

export type Appointment = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  appointmentDateTime: string; // stored as ISO string in DB
  createdAt: string; 
  description: string;
  generatorModel: string;
  serialNumber: string;
  status: AppointmentStatus;
  newAppointmentTime?: string | null;
};

type ActionState = {
  decision: "none" | "accept" | "deny" | "reschedule";
  newDateTime?: string;
  newEndDateTime?: string;
};

export default function AppointmentRequest() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [actions, setActions] = useState<Record<string, ActionState>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Appointment | null>(null);
  const [dialogDate, setDialogDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [dialogTime, setDialogTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [busyRanges, setBusyRanges] = useState<{ start: dayjs.Dayjs; end: dayjs.Dayjs }[]>([]);

  const api = useMemo(() => axios.create({ baseURL: "http://localhost:3000/api" }), []);


  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    let t = dayjs().hour(8).minute(0).second(0).millisecond(0);
    const end = dayjs().hour(20).minute(0).second(0).millisecond(0);

    while (t.isBefore(end) || t.isSame(end)) {
      slots.push(t.format("h:mm A"));
      t = t.add(30, "minute");
    }
    return slots;
  }, []);

  const isBookedAt = (dateStr: string, timeStr: string) => {
    const slotStart = dayjs(`${dateStr} ${timeStr}`, "YYYY-MM-DD h:mm A");
    return busyRanges.some((r) =>
      (slotStart.isSame(r.start) || slotStart.isAfter(r.start)) && slotStart.isBefore(r.end)
    );
  };
  const [dialogEndTime, setDialogEndTime] = useState(""); // "h:mm A" selected end slot

const startISOFromDialog = () =>
  dayjs(`${dialogDate} ${dialogTime}`, "YYYY-MM-DD h:mm A")
    .second(0)
    .millisecond(0)
    .toISOString();

const endISOFromDialog = () =>
  dayjs(`${dialogDate} ${dialogEndTime}`, "YYYY-MM-DD h:mm A")
    .second(0)
    .millisecond(0)
    .toISOString();
  // checks if [start,end) overlaps any busy range
  const rangeConflicts = (startISO: string, endISO: string) => {
    const s = dayjs(startISO);
    const e = dayjs(endISO);
    if (!s.isValid() || !e.isValid() || !e.isAfter(s)) return true;

    return busyRanges.some((r) => s.isBefore(r.end) && e.isAfter(r.start));
  };
  const endSlots = useMemo(() => {
    const slots: string[] = [];
    let t = dayjs().hour(8).minute(0).second(0).millisecond(0);
    const end = dayjs().hour(20).minute(0).second(0).millisecond(0);

    while (t.isBefore(end) || t.isSame(end)) {
      slots.push(t.format("h:mm A"));
      t = t.add(30, "minute");
    }
    return slots;
  }, []);
  // fetch busy ranges for the selected day
  const fetchBusyForDate = async (dateStr: string) => {
    setLoadingSlots(true);
    try {
      const from = dayjs(dateStr).startOf("day").toISOString();
      const to = dayjs(dateStr).endOf("day").toISOString();

      const res = await api.get(`/appointments/busy?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);

      const mapped = (res.data ?? [])
        .map((r: any) => ({ start: dayjs(r.start), end: dayjs(r.end) }))
        .filter((r: any) => r.start.isValid() && r.end.isValid());

      setBusyRanges(mapped);
    } catch (err: any) {
      console.error("busy fetch failed:", err?.response?.status, err?.response?.data || err.message);
      setBusyRanges([]);
    } finally {
      setLoadingSlots(false);
    }
  };
  
  const requestedRangeConflicts = (row: Appointment) => {
    const start = dayjs(row.appointmentDateTime);
    const end = start.add(1, "hour"); // or use stored end if you have it
    if (!start.isValid() || !end.isValid()) return false;
    return busyRanges.some((r) => start.isBefore(r.end) && end.isAfter(r.start));
  };
  const validateRescheduleBeforeSubmit = async () => {
    // must have date/start/end
    if (!dialogDate || !dialogTime || !dialogEndTime) {
      return { ok: false, message: "Pick a date, start time, and end time." };
    }

    // get the latest busy ranges for that date (admins may have changed things)
    await fetchBusyForDate(dialogDate);

    const startISO = startISOFromDialog();
    const endISO = dayjs(`${dialogDate} ${dialogEndTime}`, "YYYY-MM-DD h:mm A")
      .second(0)
      .millisecond(0)
      .toISOString();

    if (!dayjs(endISO).isAfter(dayjs(startISO))) {
      return { ok: false, message: "End time must be after start time." };
    }

    const filteredBusy = active?._id ? busyRanges.filter((r: any) => (r as any)._id !== active._id) : busyRanges;
    const conflicts = filteredBusy.some((r) => dayjs(startISO).isBefore(r.end) && dayjs(endISO).isAfter(r.start));

    if (conflicts) {
      return { ok: false, message: "That time is no longer available. Please pick another slot." };
    }

    return { ok: true, startISO, endISO };
  };

  const openDialog = async (row: Appointment) => {
    setActive(row);
    setOpen(true);

    const initialStart = dayjs(row.appointmentDateTime);
    const initialDate = initialStart.format("YYYY-MM-DD");
    const initialTime = initialStart.format("h:mm A");

    setDialogDate(initialDate);
    setDialogTime(initialTime);

    const start = dayjs(row.appointmentDateTime);
    const defaultEnd = start.add(1, "hour");

    setDialogEndTime(defaultEnd.format("h:mm A"));
    // default end = +1 hour from the current start (or use existing end if you have it in row)
    const startISO = initialStart.toISOString();
    setDialogEndISO(computeDefaultEnd(startISO));

    await fetchBusyForDate(initialDate);
  };

  const closeDialog = () => {
    setActive(null);
    setOpen(false);
    setDialogTime("");
    setDialogEndISO("");
  };

  const [dialogEndISO, setDialogEndISO] = useState<string>(""); // end datetime ISO for accept/reschedule

  const computeDefaultEnd = (startISO: string) =>
  dayjs(startISO).add(1, "hour").second(0).millisecond(0).toISOString();

  const makeStartISOFromDialog = () =>
  dayjs(`${dialogDate} ${dialogTime}`, "YYYY-MM-DD h:mm A")
    .second(0)
    .millisecond(0)
    .toISOString();
  
  const getActionState = (id: string): ActionState =>
    actions[id] ?? { decision: "none" };

  const setDecision = (id: string, decision: ActionState["decision"]) => {
    setActions((prev) => ({
      ...prev,
      [id]: { ...prev[id], decision },
    }));
  };

  const canUpdate = useMemo(() => {
    if (!active) return false;
    const st = getActionState(active._id);
    if (!st || st.decision === "none") return false;

    if (st.decision === "deny") return true;

    // ACCEPT: no start selection required; just need valid end > locked start
    if (st.decision === "accept") {
      const start = dayjs(active.appointmentDateTime);
      const end = dayjs(dialogEndISO);
      return start.isValid() && end.isValid() && end.isAfter(start);
    }

    // RESCHEDULE: need chosen start slot + valid end > start + start not booked
    if (st.decision === "reschedule") {
      if (!dialogTime) return false;
      if (isBookedAt(dialogDate, dialogTime)) return false;

      const startISO = makeStartISOFromDialog();
      const start = dayjs(startISO);
      const end = dayjs(dialogEndISO);
      return start.isValid() && end.isValid() && end.isAfter(start);
    }

    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [active, actions, dialogDate, dialogTime, dialogEndISO, busyRanges]);

useEffect(() => {
  if (!open) return;
  if (!dialogTime) return;
  
  const start = dayjs(`${dialogDate} ${dialogTime}`, "YYYY-MM-DD h:mm A");
  const end = start.add(1, "hour");

  // only auto-set if current end is missing or invalid
  if (!dialogEndTime) setDialogEndTime(end.format("h:mm A"));
}, [open, dialogDate, dialogTime]);
  
useEffect(() => {
  if (!open) return;
  if (!dialogTime) return;

  const startISO = makeStartISOFromDialog();
  const curEnd = dayjs(dialogEndISO);

  if (!curEnd.isValid() || !curEnd.isAfter(dayjs(startISO))) {
    setDialogEndISO(computeDefaultEnd(startISO));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [open, dialogDate, dialogTime]);
useEffect(() => {
  if (!open) return;

  //  re-load busy ranges for the newly selected day
  fetchBusyForDate(dialogDate);

  // If previously selected times are now invalid, clear them
  if (dialogTime && isBookedAt(dialogDate, dialogTime)) {
    setDialogTime("");
  }
  if (dialogEndTime) {
    const startISO = dialogTime ? startISOFromDialog() : null;
    const endISO = dayjs(`${dialogDate} ${dialogEndTime}`, "YYYY-MM-DD h:mm A").toISOString();

    // If we don't have a start yet, or end is not after start, clear end
    if (!startISO || !dayjs(endISO).isAfter(dayjs(startISO))) {
      setDialogEndTime("");
    } else if (rangeConflicts(startISO, endISO)) {
      setDialogEndTime("");
    }
  }
}, [open, dialogDate]);


  const deleteAppointmentOnServer = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/appointments/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);

  // remove from table + clear any local action state
  setRows((prev) => prev.filter((r) => r._id !== id));
  setActions((prev) => {
    const next = { ...prev };
    delete next[id];
    return next;
  });

  // if it was open in the dialog, close it
  if (active?._id === id) closeDialog();
};
useEffect(() => {
  if (!open) return;
  if (!dialogTime) return;
  setDialogEndTime(dayjs(`${dialogDate} ${dialogTime}`, "YYYY-MM-DD h:mm A").add(1, "hour").format("h:mm A"));
}, [open, dialogDate, dialogTime]);

  //for admin creating appointments  
  const [createOpen, setCreateOpen] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createDetails, setCreateDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    generatorModel: "",
    serialNumber: "",
    problem: "",
  });

useEffect(() => {
  if (!open) return;
  if (!dialogTime) return;

  const startISO = makeStartISOFromDialog();
  const curEnd = dayjs(dialogEndISO);

  if (!curEnd.isValid() || !curEnd.isAfter(dayjs(startISO))) {
    setDialogEndISO(computeDefaultEnd(startISO));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [open, dialogDate, dialogTime]);

const inputSx: React.CSSProperties = {
  width: "100%",
  height: 40,
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.23)",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
};

const textareaSx: React.CSSProperties = {
  width: "100%",
  minHeight: 140,
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.23)",
  fontSize: 16,
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
  lineHeight: 1.4,
};

  // Update appointment status on server
  const updateAppointmentOnServer = async (
    id: string,
    status: AppointmentStatus,
    newDateTime?: string,
    endIso?: string
  ) => {
    const payload: any = { status };

    if (status === "rescheduled") {
      const dt = dayjs(newDateTime);
      payload.newAppointmentTime = dt.toISOString();
      payload.newEndAppointmentTime = endIso;
    }
    if(status === "accepted") {
      payload.appointmentEndDateTime = endIso;
    }

    await fetch(`http://localhost:3000/api/appointments/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // remove handled appointment from table
    setRows((prev) => prev.filter((r) => r._id !== id));

    setActions((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Load appointments
  useEffect(() => {
    let activeFlag = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:3000/api/appointments", {
          credentials: "include",
        });

        const text = await res.text();
        let data: Appointment[] = [];
        try{
          data = JSON.parse(text);
        } catch (err) {
          setError(`Expected JSON, got ${res.headers.get("content-type") || "unknown"} (HTTP ${res.status})`
          );
        }

        if (!res.ok) throw new Error('HTTP ${res.status}');

        const sorted = data.sort(
          (a, b) =>
            dayjs(a.appointmentDateTime).valueOf() -
            dayjs(b.appointmentDateTime).valueOf()
        );

        if (activeFlag) setRows(sorted);
       } catch (err: any) {
        if (activeFlag) setError(err.message || "Could not load appointments");
       } finally {
        if (activeFlag) setLoading(false);
      }
    })();

    return () => {
      activeFlag = false;
    };
  }, []);


  // -------------------------------
  // DATAGRID COLUMNS
  // -------------------------------
  const columns: GridColDef<Appointment>[] = useMemo(
    () => [
      {
        field: "requestedDate",
        headerName: "Requested Date",
        flex: 0.9,
        minWidth: 150,
        valueGetter: (_v, row) =>
          dayjs(row.appointmentDateTime).isValid()
            ? dayjs(row.appointmentDateTime).format("MMM DD, YYYY")
            : "-",
        sortable: false,
      },
      {
        field: "requestedTime",
        headerName: "Requested Time",
        flex: 0.75,
        minWidth: 130,
        valueGetter: (_v, row) =>
          dayjs(row.appointmentDateTime).isValid()
            ? dayjs(row.appointmentDateTime).format("h:mm A")
            : "-",
        sortable: false,
      },
      {
        field: "createdAt",
        headerName: "Created At",
        flex: 1.1,
        minWidth: 180,
        valueGetter: (_v, row) =>
          dayjs(row.createdAt).isValid()
            ? dayjs(row.createdAt).format("MMM DD, YYYY @ h:mm A")
            : "-",
        sortable: false,
      },
      { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
      {
        field: "description",
        headerName: "Issue (Preview)",
        flex: 1.6,
        minWidth: 260,
        sortable: false,
        valueGetter: (_v, row) => row.description ?? "",
      },
      {
        field: "view",
        headerName: "View",
        width: 110,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            size="small"
            variant="outlined"
            onClick={() => openDialog(params.row)}
          >
            View
          </Button>
        ),
      },
    ],
    []
  );

  const activeAction = active ? getActionState(active._id) : { decision: "none" as const };
  const acceptBlocked = active ? requestedRangeConflicts(active) : false;
  const statusChip = (decision: ActionState["decision"]) => {
    if (decision === "accept")
      return <Chip label="Accept" color="success" size="small" />;
    if (decision === "deny")
      return <Chip label="Deny" color="error" size="small" />;
    if (decision === "reschedule")
      return <Chip label="Reschedule" color="warning" size="small" />;
    return <Chip label="No action" size="small" />;
  };

  const handleUpdateClick = async () => {
    if (!active) return;
    const id = active._id;
    const state = getActionState(id);

    try {
      if (!state || state.decision === "none") return;

      if (state.decision === "deny") {
        await deleteAppointmentOnServer(id);
        return;
      }

      if (state.decision === "accept") {
        const startISO = dayjs(active.appointmentDateTime).toISOString(); // locked
        const endISO = dialogEndISO || computeDefaultEnd(startISO);

        await updateAppointmentOnServer(id, "accepted", undefined, endISO);
        closeDialog();
        return;
      }

      if (state.decision === "reschedule") {
        const check = await validateRescheduleBeforeSubmit();
        if (!check.ok) {
          alert(check.message);
          return;
        }

        await updateAppointmentOnServer(id, "rescheduled", check.startISO, check.endISO);

        await fetchBusyForDate(dialogDate);

        closeDialog();
        return;
      }
    } catch (err: any) {
      console.error("Update failed:", err);
      setError(err.message || "Update failed");
    }
  };

return (
  <>
    <AdminNavbar />
    <Box sx={{ ml: "13vw", px: 4, overflowX: "hidden" }}>
      <Toolbar />

     <Stack sx={{ mb: 2 }} spacing={1}>
      <Typography variant="h4">Appointment Requests</Typography>

      <Button
        variant="contained"
        sx={{ alignSelf: "flex-start" }} // keeps it left under the title
       onClick={async () => {
        setCreateErr(null);
        
        const d = dayjs().format("YYYY-MM-DD");
        setDialogDate(d);

        const next = dayjs().add(1, "hour").minute(0).second(0).millisecond(0);
        setDialogTime(next.format("h:mm A"));

        setDialogEndTime(next.add(1, "hour").format("h:mm A"));

        setCreateOpen(true);

        await fetchBusyForDate(d);
      }}
      >
        Create Appointment
      </Button>
    </Stack>
      {error && <Alert severity="error">{error}</Alert>}

     <Box>  
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid<Appointment>
            rows={rows}
            columns={columns}
            getRowId={(r: Appointment) => r._id}
            disableRowSelectionOnClick
            hideFooterPagination
            sx={{
              minWidth: 1600
            }}
          />
        )}
      </Box>
       {/* Summary Dialog */}
       <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="xl">
        <DialogTitle>Create Appointment</DialogTitle>

        <DialogContent dividers>
          {createErr && <Alert severity="error" sx={{ mb: 2 }}>{createErr}</Alert>}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
              gap: 2,
              alignItems: "start",
            }}
          >
            {/* LEFT COLUMN: DETAILS */}
            <Paper
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: 3, p: 2 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                Customer / Job Details (optional)
              </Typography>

              <Stack spacing={2}>
                <input
                  style={inputSx}
                  type="text"
                  placeholder="Name"
                  value={createDetails.name}
                  onChange={(e) => setCreateDetails({ ...createDetails, name: e.target.value })}
                />
                <input
                  style={inputSx}
                  type="text"
                  placeholder="Phone"
                  value={createDetails.phone}
                  onChange={(e) => setCreateDetails({ ...createDetails, phone: e.target.value })}
                />
                <input
                  style={inputSx}
                  type="email"
                  placeholder="Email"
                  value={createDetails.email}
                  onChange={(e) => setCreateDetails({ ...createDetails, email: e.target.value })}
                />
                <input
                  style={inputSx}
                  type="text"
                  placeholder="Address"
                  value={createDetails.address}
                  onChange={(e) => setCreateDetails({ ...createDetails, address: e.target.value })}
                />
                <input
                  style={inputSx}
                  type="text"
                  placeholder="Generator Model"
                  value={createDetails.generatorModel}
                  onChange={(e) => setCreateDetails({ ...createDetails, generatorModel: e.target.value })}
                />
                <input
                  style={inputSx}
                  type="text"
                  placeholder="Serial Number"
                  value={createDetails.serialNumber}
                  onChange={(e) => setCreateDetails({ ...createDetails, serialNumber: e.target.value })}
                />
                <textarea
                  style={textareaSx}
                  placeholder="Problem Description"
                  value={createDetails.problem}
                  onChange={(e) => setCreateDetails({ ...createDetails, problem: e.target.value })}
                />
              </Stack>
            </Paper>

            {/* RIGHT COLUMN: SCHEDULING UI */}
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 3,
                p: 2,
                maxHeight: { xs: "60vh", md: "70vh" },
                overflowY: "auto",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                Schedule Appointment
              </Typography>

              {/* 1) Choose Date */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  1) Choose Date
                </Typography>

                <TextField
                  type="date"
                  fullWidth
                  value={dialogDate}
                  onChange={async (e) => {
                    const nextDate = e.target.value;
                    setDialogDate(nextDate);

                    // reload busy ranges for this date
                    await fetchBusyForDate(nextDate);

                    // clear selections if now invalid
                    if (dialogTime && isBookedAt(nextDate, dialogTime)) setDialogTime("");

                    if (dialogEndTime && dialogTime) {
                      const startISO = dayjs(`${nextDate} ${dialogTime}`, "YYYY-MM-DD h:mm A").toISOString();
                      const endISO = dayjs(`${nextDate} ${dialogEndTime}`, "YYYY-MM-DD h:mm A").toISOString();

                      if (!dayjs(endISO).isAfter(dayjs(startISO)) || rangeConflicts(startISO, endISO)) {
                        setDialogEndTime("");
                      }
                    }
                  }}
                  inputProps={{
                    min: dayjs().format("YYYY-MM-DD"),
                    max: dayjs().add(2, "month").format("YYYY-MM-DD"),
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* 2) Choose Start Time */}
              <Box sx={{ position: "relative" }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  2) Choose Start Time
                </Typography>

                {loadingSlots && (
                  <Box sx={{ position: "absolute", right: 0, top: 0 }}>
                    <CircularProgress size={18} />
                  </Box>
                )}

                <Box sx={{ maxHeight: 220, overflowY: "auto", pr: 1 }}>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.5 }}>
                    {timeSlots.map((t) => {
                      const isSelected = dialogTime === t;
                      const disabled = isBookedAt(dialogDate, t);                    

                      return (
                        <Button
                          key={t}
                          fullWidth
                          variant={isSelected ? "contained" : "outlined"}
                          disabled={disabled}
                          onClick={() => {
                            setDialogTime(t);

                            const startISO = dayjs(`${dialogDate} ${t}`, "YYYY-MM-DD h:mm A").toISOString();
                            const defaultEndISO = dayjs(startISO).add(1, "hour").toISOString();
                            if (rangeConflicts(startISO, defaultEndISO)) {
                              setDialogEndTime("");
                              setDialogEndISO("");
                            } else {
                              setDialogEndTime(dayjs(defaultEndISO).format("h:mm A"));
                              setDialogEndISO(defaultEndISO);
                            }
                          }}
                          sx={{
                            py: 1.2,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            borderColor: isSelected ? "primary.main" : disabled ? "#f1f5f9" : "#e0e0e0",
                            color: isSelected ? "#fff" : disabled ? "#cbd5e1" : "text.secondary",
                            bgcolor: isSelected ? "primary.main" : disabled ? "#f8fafc" : "transparent",
                            "&.Mui-disabled": {
                              color: "#cbd5e1",
                              borderColor: "#f1f5f9",
                              bgcolor: "#f8fafc",
                              textDecoration: "line-through",
                            },
                          }}
                        >
                          {t}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* 3) Choose End Time */}
              <Box sx={{ position: "relative" }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  3) Choose End Time (defaults to +1 hour)
                </Typography>

                <Box sx={{ maxHeight: 220, overflowY: "auto", pr: 1 }}>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.5 }}>
                    {timeSlots.map((t) => {
                      if (!dialogTime) {
                        return (
                          <Button
                            key={t}
                            fullWidth
                            variant="outlined"
                            disabled
                            sx={{ py: 1.2, borderRadius: 2, textTransform: "none" }}
                          >
                            {t}
                          </Button>
                        );
                      }

                      const startISO = startISOFromDialog();
                      const endISO = dayjs(`${dialogDate} ${t}`, "YYYY-MM-DD h:mm A")
                        .second(0)
                        .millisecond(0)
                        .toISOString();

                      const invalid = !dayjs(endISO).isAfter(dayjs(startISO));
                      const conflicts = !invalid && rangeConflicts(startISO, endISO);
                      const disabled = invalid || conflicts;

                      const isSelected = dialogEndTime === t;

                      return (
                        <Button
                          key={t}
                          fullWidth
                          variant={isSelected ? "contained" : "outlined"}
                          disabled={disabled}
                          onClick={() => setDialogEndTime(t)}
                          sx={{
                            py: 1.2,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            borderColor: isSelected ? "primary.main" : disabled ? "#f1f5f9" : "#e0e0e0",
                            color: isSelected ? "#fff" : disabled ? "#cbd5e1" : "text.secondary",
                            bgcolor: isSelected ? "primary.main" : disabled ? "#f8fafc" : "transparent",
                            "&.Mui-disabled": {
                              color: "#cbd5e1",
                              borderColor: "#f1f5f9",
                              bgcolor: "#f8fafc",
                              textDecoration: "line-through",
                            },
                          }}
                        >
                          {t}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Availability Message */}
              <Alert
                severity={
                  !dialogTime || !dialogEndTime
                    ? "info"
                    : rangeConflicts(startISOFromDialog(), endISOFromDialog())
                    ? "warning"
                    : "success"
                }
              >
                {!dialogTime || !dialogEndTime
                  ? "Pick a start and end time."
                  : rangeConflicts(startISOFromDialog(), endISOFromDialog())
                  ? "This time conflicts with an existing accepted/rescheduled appointment."
                  : "Time is available."}
              </Alert>
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            disabled={
              creating ||
              !dialogTime ||
              !dialogEndTime ||
              rangeConflicts(startISOFromDialog(), endISOFromDialog())
            }
            onClick={async () => {
              setCreating(true);
              setCreateErr(null);
              try {
                const startISO = startISOFromDialog();
                const endISO = endISOFromDialog();

                if (!dayjs(endISO).isAfter(dayjs(startISO))) {
                  throw new Error("End must be after start.");
                }
                if (rangeConflicts(startISO, endISO)) {
                  throw new Error("Time conflicts with an existing schedule.");
                }

                const res = await fetch("http://localhost:3000/api/appointments/admin-create", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    createdBy: "admin",
                    start: startISO,
                    end: endISO,

                    name: createDetails.name,
                    phone: createDetails.phone,
                    email: createDetails.email,
                    address: createDetails.address,
                    generatorModel: createDetails.generatorModel,
                    serialNumber: createDetails.serialNumber,
                    description: createDetails.problem,
                  }),
                });

                if (!res.ok) {
                  const text = await res.text();
                  throw new Error(`Failed to create (HTTP ${res.status}): ${text}`);
                }

                setCreateOpen(false);

                // optional: refresh busy + refresh rows
                await fetchBusyForDate(dialogDate);
                // await reloadAppointments();
              } catch (e: any) {
                setCreateErr(e.message || "Failed to create appointment");
              } finally {
                setCreating(false);
              }
            }}
          >
            {creating ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
        <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="xl">
          <DialogTitle>Appointment Summary</DialogTitle>

          <DialogContent dividers>
          {!active ? (
            <Typography>Loading...</Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
                gap: 2,
                alignItems: "start",
              }}
            >
              {/* LEFT COLUMN */}
              <Box sx={{ minWidth: 0 }}>
                {/* Header */}
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {active.name || "Unknown"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Requested:{" "}
                      <b>{dayjs(active.appointmentDateTime).format("MMM DD, YYYY @ h:mm A")}</b>
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Created:{" "}
                      <b>{dayjs(active.createdAt).format("MMM DD, YYYY @ h:mm A")}</b>
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    {statusChip(activeAction.decision as ActionState["decision"])}
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Details grid-ish */}
                <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Contact
                    </Typography>
                    <Typography variant="body2">Email: <b>{active.email}</b></Typography>
                    <Typography variant="body2">Phone: <b>{active.phone}</b></Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>Address: <b>{active.address}</b></Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Generator
                    </Typography>
                    <Typography variant="body2">Model: <b>{active.generatorModel || "-"}</b></Typography>
                    <Typography variant="body2">Serial: <b>{active.serialNumber || "-"}</b></Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    Issue Description
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "rgba(0,0,0,0.03)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      lineHeight: 1.6,
                    }}
                  >
                    {active.description || "(no description)"}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Action buttons stay on LEFT */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                    Actions
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant={activeAction.decision === "accept" ? "contained" : "outlined"}
                      color="success"
                      onClick={() => setDecision(active._id, "accept")}
                      disabled={acceptBlocked}
                    >
                      Accept
                    </Button>

                    <Button
                      variant={activeAction.decision === "deny" ? "contained" : "outlined"}
                      color="error"
                      onClick={() => setDecision(active._id, "deny")}
                    >
                      Deny
                    </Button>

                    <Button
                      variant={activeAction.decision === "reschedule" ? "contained" : "outlined"}
                      color="warning"
                      onClick={() => setDecision(active._id, "reschedule")}
                    >
                      Reschedule
                    </Button>
                  </Stack>
                </Box>
              </Box>

              {/* RIGHT COLUMN */}
              <Box sx={{ minWidth: 0 }}>
                <Paper
                  elevation={0}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                    p: 2,
                    maxHeight: { xs: "60vh", md: "70vh" },
                    overflowY: "auto",
                  }}
                >
                  {/* Accept Block*/}
                  {activeAction.decision === "accept" && active && (
                    <>                                    
                    {activeAction.decision === "accept" && active && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                          Adjust End Time
                        </Typography>

                        <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 3 }}>
                          {/* Start locked display */}
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Start (locked)
                            </Typography>
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                border: "1px solid #e0e0e0",
                                bgcolor: "#fafafa",
                                fontWeight: 700,
                              }}
                            >
                              {dayjs(active.appointmentDateTime).format("MMM DD, YYYY @ h:mm A")}
                            </Box>
                          </Box>

                          <Divider sx={{ mb: 2 }} />

                          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                            Select End Time
                          </Typography>

                          <Box sx={{ maxHeight: 240, overflowY: "auto", pr: 1 }}>
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.5 }}>
                              {endSlots.map((t) => {
                                const startISO = dayjs(active.appointmentDateTime).toISOString();
                                const endISO = dayjs(`${dayjs(active.appointmentDateTime).format("YYYY-MM-DD")} ${t}`, "YYYY-MM-DD h:mm A")
                                  .second(0)
                                  .millisecond(0)
                                  .toISOString();

                                const isSelected = dialogEndTime === t;
                                const invalid = !dayjs(endISO).isAfter(dayjs(startISO));
                                const conflicts = !invalid && rangeConflicts(startISO, endISO);

                                const disabled = invalid || conflicts;

                                return (
                                  <Button
                                    key={t}
                                    fullWidth
                                    variant={isSelected ? "contained" : "outlined"}
                                    onClick={() => setDialogEndTime(t)}
                                    disabled={disabled}
                                    sx={{
                                      py: 1.2,
                                      borderRadius: 2,
                                      textTransform: "none",
                                      fontSize: "0.8rem",
                                      fontWeight: 600,
                                      borderColor: isSelected ? "primary.main" : disabled ? "#f1f5f9" : "#e0e0e0",
                                      color: isSelected ? "#fff" : disabled ? "#cbd5e1" : "text.secondary",
                                      bgcolor: isSelected ? "primary.main" : disabled ? "#f8fafc" : "transparent",
                                      "&.Mui-disabled": {
                                        color: "#cbd5e1",
                                        borderColor: "#f1f5f9",
                                        bgcolor: "#f8fafc",
                                        textDecoration: "line-through",
                                      },
                                    }}
                                  >
                                    {t}
                                  </Button>
                                );
                              })}
                            </Box>
                          </Box>
                        </Paper>
                      </Box>
                    )}
                    </>
                  )}
                

                  {/* Reschedule Block*/}
                  {activeAction.decision === "reschedule" && active && (
                    <>
                    {activeAction.decision === "reschedule" && active && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                        Reschedule (pick any date + time)
                      </Typography>

                      <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 3 }}>
                        {/* Date */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            1) Choose Date
                          </Typography>
                            <TextField
                              type="date"
                              fullWidth
                              value={dialogDate}
                              onChange={(e) => setDialogDate(e.target.value)}
                              inputProps={{
                                min: dayjs().format("YYYY-MM-DD"),
                                max: dayjs().add(2, "month").format("YYYY-MM-DD"),
                              }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Start slots */}
                        <Box sx={{ position: "relative" }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            2) Choose Start Time
                          </Typography>

                          {loadingSlots && (
                            <Box sx={{ position: "absolute", right: 0, top: 0 }}>
                              <CircularProgress size={18} />
                            </Box>
                          )}

                          <Box sx={{ maxHeight: 220, overflowY: "auto", pr: 1 }}>
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.5 }}>
                              {timeSlots.map((t) => {
                                // candidate start/end: end defaults to +1 hr for conflict check
                                const disabled = isBookedAt(dialogDate, t);
                                const isSelected = dialogTime === t;

                                return (
                                  <Button
                                    key={t}
                                    fullWidth
                                    variant={isSelected ? "contained" : "outlined"}
                                    disabled={disabled}
                                    onClick={() => setDialogTime(t)}
                                    sx={{
                                      py: 1.2,
                                      borderRadius: 2,
                                      textTransform: "none",
                                      fontSize: "0.8rem",
                                      fontWeight: 600,
                                      borderColor: isSelected ? "primary.main" : disabled ? "#f1f5f9" : "#e0e0e0",
                                      color: isSelected ? "#fff" : disabled ? "#cbd5e1" : "text.secondary",
                                      bgcolor: isSelected ? "primary.main" : disabled ? "#f8fafc" : "transparent",
                                      "&.Mui-disabled": {
                                        color: "#cbd5e1",
                                        borderColor: "#f1f5f9",
                                        bgcolor: "#f8fafc",
                                        textDecoration: "line-through",
                                      },
                                    }}
                                  >
                                    {t}
                                  </Button>
                                );
                              })}
                            </Box>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* End slots */}
                        <Box sx={{ position: "relative" }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            3) Choose End Time (defaults to +1 hour)
                          </Typography>

                          <Box sx={{ maxHeight: 220, overflowY: "auto", pr: 1 }}>
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.5 }}>
                              {timeSlots.map((t) => {
                                if (!dialogTime) {
                                  return (
                                    <Button
                                      key={t}
                                      fullWidth
                                      variant="outlined"
                                      disabled
                                      sx={{ py: 1.2, borderRadius: 2, textTransform: "none" }}
                                    >
                                      {t}
                                    </Button>
                                  );
                                }

                                const startISO = startISOFromDialog();
                                const endISO = dayjs(`${dialogDate} ${t}`, "YYYY-MM-DD h:mm A").toISOString();

                                const invalid = !dayjs(endISO).isAfter(dayjs(startISO));
                                const conflicts = !invalid && rangeConflicts(startISO, endISO);
                                const disabled = invalid || conflicts;

                                const isSelected = dialogEndTime === t;

                                return (
                                  <Button
                                    key={t}
                                    fullWidth
                                    variant={isSelected ? "contained" : "outlined"}
                                    disabled={disabled}
                                    onClick={() => setDialogEndTime(t)}
                                    sx={{
                                      py: 1.2,
                                      borderRadius: 2,
                                      textTransform: "none",
                                      fontSize: "0.8rem",
                                      fontWeight: 600,
                                      borderColor: isSelected ? "primary.main" : disabled ? "#f1f5f9" : "#e0e0e0",
                                      color: isSelected ? "#fff" : disabled ? "#cbd5e1" : "text.secondary",
                                      bgcolor: isSelected ? "primary.main" : disabled ? "#f8fafc" : "transparent",
                                      "&.Mui-disabled": {
                                        color: "#cbd5e1",
                                        borderColor: "#f1f5f9",
                                        bgcolor: "#f8fafc",
                                        textDecoration: "line-through",
                                      },
                                    }}
                                  >
                                    {t}
                                  </Button>
                                );
                              })}
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  )}
                    </>
                  )}

                  {activeAction.decision === "none" && (
                    <Typography variant="body2" color="text.secondary">
                      Choose an action to schedule this request.
                    </Typography>
                  )}
                    {activeAction.decision === "none" && acceptBlocked && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      This requested time is already booked. Please reschedule instead.
                    </Alert>
                  )}
                  {activeAction.decision === "deny" && (
                    <Typography variant="body2" color="text.secondary">
                      Deny will delete this request when you press Update.
                    </Typography>
                  )}
                    {activeAction.decision === "deny" && acceptBlocked && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      This requested time is already booked. Please reschedule instead.
                    </Alert>
                  )}
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>

          <DialogActions>
            <Button onClick={closeDialog}>Close</Button>
            <Button
              variant="contained"
              disabled={!canUpdate}
              onClick={handleUpdateClick}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  </>
);
}