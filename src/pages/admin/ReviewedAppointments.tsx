// src/pages/admin/ReviewedAppointments.tsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Toolbar, CircularProgress, Alert, Chip } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import AdminNavbar from "./AdminNavbar";
import dayjs from "dayjs";

interface ReviewedAppointment {
  _id: string;

  appointmentDateTime: string;
  appointmentEndDateTime: string;

  newAppointmentTime?: string | null;
  newAppointmentEndTime?: string | null;

  status: "accepted" | "denied" | "rescheduled";
  name: string;
  phone: string;
  email: string; 
  address: string;
  description: string;  
  createdBy: string;
  rescheduledDateTime?: string | null;
  rescheduledEndDateTime?: string | null;
}

const formatISO = (iso?: string | null) => {
  if (!iso) return "-";
  const dt = dayjs(iso);
  return dt.isValid() ? dt.format("MMM DD, YYYY @ h:mm A") : "-";
};
const formatRange = (start?: string | null, end?: string | null) => {
  if (!start) return "-";
  const s = dayjs(start);
  if (!s.isValid()) return "-";

  // fallback end = start + 1 hour (in case older rows don’t have end stored)
  const e = end ? dayjs(end) : s.add(1, "hour");
  const endToUse = e.isValid() && e.isAfter(s) ? e : s.add(1, "hour");


  return `${s.format("MMM DD, YYYY")} @ ${s.format("h:mm A")} - ${endToUse.format("h:mm A")}`;
};

const getEffectiveStartEnd = (row: ReviewedAppointment) => {
  const scheduledStart =
    row.status === "rescheduled" ? row.rescheduledDateTime : row.appointmentDateTime;

  const scheduledEnd =
    row.status === "rescheduled"
      ? row.rescheduledEndDateTime ?? row.appointmentEndDateTime
      : row.appointmentEndDateTime;

  return { scheduledStart, scheduledEnd };
};

export default function ReviewedAppointments() {
  const [rows, setRows] = useState<ReviewedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/appointments/reviewed");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load appointments");

        setRows(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

 const columns: GridColDef<ReviewedAppointment>[] = [
  {
    field: "scheduledDate",
    headerName: "Scheduled Date",
    flex: 1.3,
    minWidth: 270,
    sortable: false,
    valueGetter: (_v, row) => {
      const { scheduledStart, scheduledEnd } = getEffectiveStartEnd(row);
      return formatRange(scheduledStart, scheduledEnd);
    },
  },

  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => {
      const s = params.row?.status ?? "unknown";
      const color =
        s === "accepted"
          ? "success"
          : s === "denied"
          ? "error"
          : s === "rescheduled"
          ? "warning"
          : "default";

      return <Chip label={s.toUpperCase()} color={color} />;
    }
  },

  {
    field: "orginalDate",
    headerName: "Orignal Date (If Rescheduled)",
    flex: 1.4,
    minWidth: 200,
    sortable: false,
    valueGetter: (_value, row) => formatISO(row.status === "rescheduled" ? row.appointmentDateTime : "-"),
    },

    { field: "name", headerName: "Name", flex: 1, minWidth:200, },
    { field: "phone", headerName: "Phone", flex: 1, minWidth:140,  },
    { field: "email", headerName: "Email", flex: 1.3, minWidth:200,  },
    { field: "address", headerName: "Address", flex: 1.6,minWidth:200,  },
    { field: "description", headerName: "Issue Description", flex: 2, minWidth:280,  }
  ];

  return (
    <>
      <AdminNavbar />
      <Box sx={{ ml: "13vw", px: 4 }}>
        <Toolbar />

        <Typography variant="h4" gutterBottom>
          Reviewed Appointments
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ height: 650, width: "100%" }}>
          {loading ? (
            <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid<ReviewedAppointment>
              rows={rows}
              columns={columns}
              getRowId={(r: ReviewedAppointment) => r._id}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 25 } }
              }}
            />
          )}
        </Box>
      </Box>
    </>
  );
}

