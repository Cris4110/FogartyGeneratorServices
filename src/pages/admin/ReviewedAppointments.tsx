import React, { useEffect, useState } from "react";
import { Box, Typography, Toolbar, CircularProgress, Alert, Chip } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import AdminNavbar from "./AdminNavbar";
import dayjs from "dayjs";

interface ReviewedAppointment {
  _id: string;
  appointmentDateTime: string;
  newAppointmentTime?: string | null;
  status: "accepted" | "denied" | "rescheduled";
  name: string;
  phone: string;
  email: string; 
  address: string;
  description: string;  
  rescheduledDateTime?: string | null;
}

const formatISO = (iso?: string | null) => {
  if (!iso) return "-";
  const dt = dayjs(iso);
  return dt.isValid() ? dt.format("MMM DD, YYYY @ h:mm A") : "-";
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

        // Ensure data is an array before setting state
        setRows(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns: GridColDef<ReviewedAppointment>[] = [
    {
      field: "appointmentDateTime", // Matched to the actual data key
      headerName: "Original Date",
      flex: 1.3,
      minWidth: 200,
      valueGetter: (value, row) => formatISO(row.appointmentDateTime)
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const s = params.value?.toLowerCase() ?? "unknown";
        const color =
          s === "accepted"
            ? "success"
            : s === "denied"
            ? "error"
            : s === "rescheduled"
            ? "warning"
            : "default";

        return <Chip label={s.toUpperCase()} color={color as any} size="small" />;
      }
    },
    {
      field: "rescheduledDateTime", // Matched to the actual data key
      headerName: "New Date (If Rescheduled)",
      flex: 1.4,
      minWidth: 200,
      valueGetter: (value, row) => {
        // Check both possible fields for the new date
        return formatISO(row.rescheduledDateTime || row.newAppointmentTime);
      }
    },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 130 },
    { field: "email", headerName: "Email", flex: 1.2, minWidth: 180 },
    { field: "address", headerName: "Address", flex: 1.5, minWidth: 200 },
    { 
      field: "description", 
      headerName: "Issue Description", 
      flex: 2, 
      minWidth: 250,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem', py: 1 }}>
          {params.value}
        </Typography>
      )
    }
  ];

  return (
    <>
      <AdminNavbar />
      {/* ml: "13vw" matches your sidebar width */}
      <Box sx={{ ml: "13vw", p: 4, width: "calc(100% - 13vw)" }}>
        <Toolbar />

        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Reviewed Appointments
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ 
          height: 700, 
          width: "100%", 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          boxShadow: 2,
          overflow: 'hidden' 
        }}>
          {loading ? (
            <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(r) => r._id}
              disableRowSelectionOnClick
              density="comfortable"
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } }
              }}
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
          )}
        </Box>
      </Box>
    </>
  );
}