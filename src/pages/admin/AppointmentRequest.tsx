// src/pages/admin/AppointmentRequest.tsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Toolbar, Alert, CircularProgress, Button, Stack } from "@mui/material";
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
};

export default function AppointmentRequest() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [actions, setActions] = useState<Record<string, ActionState>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update appointment status on server
  const updateAppointmentOnServer = async (
    id: string,
    status: AppointmentStatus,
    newDateTime?: string
  ) => {
    const payload: any = { status };

    if (status === "rescheduled" && newDateTime) {
      const dt = dayjs(newDateTime);
      payload.newAppointmentTime = dt.toISOString();
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
    let active = true;

    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/appointments");
        const data: Appointment[] = await res.json();

        const sorted = data.sort(
          (a, b) =>
            dayjs(a.appointmentDateTime).valueOf() -
            dayjs(b.appointmentDateTime).valueOf()
        );

        if (active) setRows(sorted);
      } catch (err) {
        if (active)
          setError(
            err instanceof Error ? err.message : "Could not load appointments"
          );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleAction = (id: string, decision: ActionState["decision"]) => {
    setActions((prev) => ({
      ...prev,
      [id]: { ...prev[id], decision }
    }));
  };

  // -------------------------------
  // DATAGRID COLUMNS
  // -------------------------------
  const columns: GridColDef<Appointment>[] = [
  {
  field: "appointmentDate",
  headerName: "Requested Date",
  flex: 1,
  minWidth: 150,
  valueGetter: (_v, row) =>
    dayjs(row.appointmentDateTime).format("MMM DD, YYYY")
},
{
  field: "appointmentTimeFormatted",
  headerName: "Requested Time",
  flex: 1,
  minWidth: 150,
  valueGetter: (_v, row) =>
    dayjs(row.appointmentDateTime).format("h:mm A")
},
    {
       field: "createdDate",
       headerName: "Created At",
       flex: 1,
       minWidth: 160,
        valueGetter: (_v, row) =>
        dayjs(row.createdAt).isValid()
          ? dayjs(row.createdAt).format("MMM DD, YYYY @ h:mm A")
          : "-",
    },
    { field: "name", headerName: "Name", flex: 1, minWidth: 200, },
    { field: "phone", headerName: "Phone", flex: 1,  },
    { field: "email", headerName: "Email", flex: 1.3, minWidth: 220, },
    { field: "address", headerName: "Address", flex: 1.4, minWidth: 200, },
    { field: "generatorModel", headerName: "Model", flex: 1, minWidth: 120, },
    { field: "serialNumber", headerName: "Serial", flex: 1, minWidth: 120, },
    { field: "description", headerName: "Issue Description", flex: 2, minWidth:260, },

    // ACTION BUTTONS
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.2,
      minWidth: 280,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Appointment>) => {
        const id = params.row._id;
        const state = actions[id]?.decision ?? "none";

        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant={state === "accept" ? "contained" : "outlined"}
              color="success"
              size="small"
              onClick={() => handleAction(id, "accept")}
            >
              Accept
            </Button>

            <Button
              variant={state === "deny" ? "contained" : "outlined"}
              color="error"
              size="small"
              onClick={() => handleAction(id, "deny")}
            >
              Deny
            </Button>

            <Button
              variant={state === "reschedule" ? "contained" : "outlined"}
              color="warning"
              size="small"
              onClick={() => handleAction(id, "reschedule")}
            >
              Reschedule
            </Button>
          </Stack>
        );
      }
    },

    // RESCHEDULE PICKER
    {
      field: "newDateTime",
      headerName: "New Date & Time",
      flex: 1.4,
      minWidth: 280,
      sortable: false,
      renderCell: (params) => {
        const id = params.row._id;
        const actionState = actions[id];

        if (actionState?.decision !== "reschedule") return <>-</>;

        const dt = actionState.newDateTime
          ? dayjs(actionState.newDateTime)
          : null;

        return (
          <DateTimePicker
            value={dt}
            onChange={(val) =>
              setActions((prev) => ({
                ...prev,
                [id]: {
                  ...prev[id],
                  newDateTime: val ? val.toISOString() : undefined
                }
              }))
            }
          />
        );
      }
    },

    // UPDATE BUTTON
    {
      field: "update",
      headerName: "Update",
      flex: 1,
      minWidth: 140,
      sortable: false,
      renderCell: (params) => {
        const id = params.row._id;
        const state = actions[id];

        return (
          <Button
            size="small"
            variant="contained"
            disabled={!state || state.decision === "none"}
            onClick={() => {
              if (!state) return;

              if (state.decision === "accept")
                updateAppointmentOnServer(id, "accepted");
              else if (state.decision === "deny")
                updateAppointmentOnServer(id, "denied");
              else if (state.decision === "reschedule") {
                if (!state.newDateTime) return alert("Select a new date/time");
                updateAppointmentOnServer(id, "rescheduled", state.newDateTime);
              }
            }}
          >
            Update
          </Button>
        );
      }
    }
  ];

return (
  <>
    <AdminNavbar />
    <Box sx={{ ml: "13vw", px: 4, overflowX: "hidden" }}>
      <Toolbar />

      <Typography variant="h4" gutterBottom>
        Reviewed Appointments
      </Typography>

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
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 25 } }
            }}
            sx={{
              minWidth: 1600
            }}
          />
        )}
      </Box>
    </Box>
  </>
);
}
