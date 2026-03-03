// src/pages/admin/AppointmentRequest.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Toolbar, Alert, CircularProgress, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider, } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import AdminNavbar from "./AdminNavbar";
import dayjs from "dayjs";

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

  const openDialog = (row: Appointment) => {
    setActive(row);
    setOpen(true);
  }
  const closeDialog = () => {
    setActive(null);
    setOpen(false);
  }
  const getActionState = (id: string): ActionState =>
    actions[id] ?? { decision: "none" };

  const setDecision = (id: string, decision: ActionState["decision"]) => {
    setActions((prev) => ({
      ...prev,
      [id]: { ...prev[id], decision },
    }));
  };
  const setRescheduleTime = (id: string, iso?: string) => {
    setActions((prev) => ({
      ...prev,
      [id]: { ...prev[id], newDateTime: iso },
    }));
  };
  const setStart = (id: string, iso?: string) => {
    setActions((prev) => {
      const next = { ...prev };
      const start = iso ? dayjs(iso) : null;

      next[id] = { ...next[id], newDateTime: iso };

      // auto default end = start + 1 hour
      if (start) {
        const end = start.add(1, "hour");
        next[id].newEndDateTime = end.toISOString();
      }
      return next;
    });
  };
  const canUpdate = (() => {
    if (!active) return false;
    const st = getActionState(active._id);
    if (!st || st.decision === "none") return false;
    if (st.decision === "deny") return true;

    const startISO = st.newDateTime ?? active.appointmentDateTime;
    const endISO = st.newEndDateTime ?? dayjs(startISO).add(1, "hour").toISOString();

    const start = dayjs(startISO);
    const end = dayjs(endISO);

    return start.isValid() && end.isValid() && end.isAfter(start);
  })();

  //for admin creating appointments
  type BusyRange = { start: string; end: string };

  const overlaps = (aStart: dayjs.Dayjs, aEnd: dayjs.Dayjs, bStart: dayjs.Dayjs, bEnd: dayjs.Dayjs) =>
    aStart.isBefore(bEnd) && aEnd.isAfter(bStart);

  const wouldConflict = (startISO: string, endISO: string) => {
    const s = dayjs(startISO);
    const e = dayjs(endISO);
    if (!s.isValid() || !e.isValid() || !e.isAfter(s)) return true;

    return busy.some((r) => overlaps(s, e, dayjs(r.start), dayjs(r.end)));
  };
  const shouldDisableStart = (value: any, view: "hours" | "minutes" | "seconds") => {
    if (view !== "minutes") return false; 
    const candidateStart = value; // dayjs
    const end = dayjs(createEnd);
    const start = candidateStart;

    // if end isn't valid yet, assume +1 hour
    const candidateEnd = end.isValid() && end.isAfter(start) ? end : start.add(1, "hour");

    return wouldConflict(start.toISOString(), candidateEnd.toISOString());
  };
  const shouldDisableEnd = (value: any, view: "hours" | "minutes" | "seconds") => {
    if (view !== "minutes") return false;
    const start = dayjs(createStart);
    const end = value;

    if (!start.isValid()) return true;
    if (!end.isAfter(start)) return true;

    return wouldConflict(start.toISOString(), end.toISOString());
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [busy, setBusy] = useState<BusyRange[]>([]);
  const [createStart, setCreateStart] = useState<string>(() => dayjs().minute(0).second(0).millisecond(0).toISOString());
  const [createEnd, setCreateEnd] = useState<string>(() => dayjs().add(1, "hour").minute(0).second(0).millisecond(0).toISOString());
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

  const fetchBusy = async () => {
  const from = dayjs().startOf("day").toISOString();
  const to = dayjs().add(2, "month").endOf("day").toISOString();

  const res = await fetch(`http://localhost:3000/api/appointments/busy?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Failed to load busy ranges (HTTP ${res.status})`);
  const data = await res.json();
  setBusy(Array.isArray(data) ? data : []);
};

useEffect(() => {
  fetchBusy().catch((e) => setError(e.message));
}, []);

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

  // only compute start/end values when an appointment is active
  const effectiveStartISO = active ? activeAction.decision === "reschedule"
      ? activeAction.newDateTime ?? active.appointmentDateTime
      : active.appointmentDateTime // accept uses original start
    : "";

  const effectiveEndISO = active
    ? activeAction.newEndDateTime ??
      dayjs(effectiveStartISO).add(1, "hour").toISOString()
    : "";

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

      if (state.decision === "accept") {
        await updateAppointmentOnServer(id, "accepted",undefined, effectiveEndISO);
      } else if (state.decision === "deny") {
        await updateAppointmentOnServer(id, "denied");
      } else if (state.decision === "reschedule") {
        if (!state.newDateTime) {
          return alert("Please select a new date and time for rescheduling.");
        }
        await updateAppointmentOnServer(id, "rescheduled", effectiveStartISO, effectiveEndISO);
      }
    } catch (e: any) {
      setError(e.message || "Failed to update appointment");
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
        onClick={() => {
          setCreateErr(null);

          const s = dayjs().add(1, "hour").minute(0).second(0).millisecond(0);
          setCreateStart(s.toISOString());
          setCreateEnd(s.add(1, "hour").toISOString());

          setCreateOpen(true);
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
       <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>Create Appointment</DialogTitle>

          <DialogContent dividers>
            {createErr && <Alert severity="error" sx={{ mb: 2 }}>{createErr}</Alert>}

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
              <DateTimePicker
                label="Start"
                value={dayjs(createStart)}
                onChange={(val) => {
                  if (!val) return;
                  const s = val.second(0).millisecond(0);
                  setCreateStart(s.toISOString());
                  // default end = +1 hour
                  setCreateEnd(s.add(1, "hour").toISOString());
                }}
                timeSteps = {{ minutes: 30  }}

              />

              <DateTimePicker
                label="End"
                value={dayjs(createEnd)}
                onChange={(val) => val && setCreateEnd(val.second(0).millisecond(0).toISOString())}
                timeSteps = {{ minutes: 30  }}
              />

              <Alert severity={wouldConflict(createStart, createEnd) ? "warning" : "success"}>
                {wouldConflict(createStart, createEnd)
                  ? "This time conflicts with an existing accepted/rescheduled appointment."
                  : "Time is available."}
              </Alert>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              disabled={creating || wouldConflict(createStart, createEnd)}
              onClick={async () => {
                setCreating(true);
                setCreateErr(null);
                try {
                  const res = await fetch("http://localhost:3000/api/appointments/admin-create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                      createdBy: "admin",
                      start: createStart,
                      end: createEnd,
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

                  // refresh busy + refresh list
                  await fetchBusy();
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
        <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="md">
          <DialogTitle>Appointment Summary</DialogTitle>

          <DialogContent dividers>
            {!active ? (
              <Typography>Loading...</Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Header */}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {active.name || "Unknown"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Requested:{" "}
                      <b>
                        {dayjs(active.appointmentDateTime).format(
                          "MMM DD, YYYY @ h:mm A"
                        )}
                      </b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created:{" "}
                      <b>
                        {dayjs(active.createdAt).format(
                          "MMM DD, YYYY @ h:mm A"
                        )}
                      </b>
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    {statusChip(activeAction.decision as ActionState["decision"])}
                  </Stack>
                </Stack>

                <Divider />

                {/* Details grid-ish */}
                <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Contact
                    </Typography>
                    <Typography variant="body2">
                      Email: <b>{active.email}</b>
                    </Typography>
                    <Typography variant="body2">
                      Phone: <b>{active.phone}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Address: <b>{active.address}</b>
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Generator
                    </Typography>
                    <Typography variant="body2">
                      Model: <b>{active.generatorModel || "-"}</b>
                    </Typography>
                    <Typography variant="body2">
                      Serial: <b>{active.serialNumber || "-"}</b>
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

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

                <Divider />

                {/* Actions */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                    Actions
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Button
                      variant={activeAction.decision === "accept" ? "contained" : "outlined"}
                      color="success"
                      onClick={() => setDecision(active._id, "accept")}
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

                  {activeAction.decision === "reschedule" && (
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 1 }}>
                      <DateTimePicker
                        label="Start"
                        value={dayjs(effectiveStartISO)}
                        onChange={(val) => setStart(active._id, val ? val.toISOString() : undefined)}
                        timeSteps = {{ minutes: 30  }}
                      />

                      <DateTimePicker
                        label="End"
                        value={dayjs(effectiveEndISO)}
                        onChange={(val) =>
                          setActions((prev) => ({
                            ...prev,
                            [active._id]: {
                              ...prev[active._id],
                              newEndDateTime: val ? val.toISOString() : undefined,
                            },
                          }))
                        }
                        timeSteps = {{ minutes: 30  }}
                      />
                    </Stack>
                  )}
                  {activeAction.decision === "accept" && (
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 1 }}>
                      {/* Start is shown but locked */}
                      <DateTimePicker
                        label="Start (locked)"
                        value={dayjs(active.appointmentDateTime)}
                        readOnly
                        timeSteps = {{ minutes: 30  }}
                      />

                      {/* End is editable */}
                      <DateTimePicker
                        label="End"
                        value={dayjs(effectiveEndISO)}
                        onChange={(val) =>
                          setActions((prev) => ({
                            ...prev,
                            [active._id]: {
                              ...prev[active._id],
                              newEndDateTime: val ? val.toISOString() : undefined,
                            },
                          }))
                        }
                        timeSteps = {{ minutes: 30  }}
                      />
                    </Stack>
                  )}
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
