// src/pages/admin/AppointmentRequest.tsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Toolbar, Alert, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from '@mui/x-data-grid';
import AdminNavbar from "./AdminNavbar";

type Appointment = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  appointmentDate: string; // keep as raw string for now
};

export default function AppointmentRequest() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:3000/api/appointments", {
          credentials: "include", 
        });


        const text = await res.text();
        let data: Appointment[];
        try {
          data = JSON.parse(text);
        } catch {
          console.error("Non-JSON response:", text);
          throw new Error(`Expected JSON, got ${res.headers.get("content-type") || "unknown"} (HTTP ${res.status})`);
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (mounted) setRows(data);
      } catch (e: any) {
        if (mounted) setError(e.message || "Failed to load appointments");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
//include address later.
  const columns: GridColDef<Appointment>[] = [
 { field: "appointmentDate", headerName: "Appointment Date", flex: 1, minWidth: 180 },
  { field: "name",            headerName: "Name",            flex: 1, minWidth: 160 },
  { field: "phone",           headerName: "Phone",           flex: 1, minWidth: 140 },
  { field: "email",           headerName: "Email",           flex: 1, minWidth: 220 },
  ];

  return (
    <>
      <AdminNavbar />
      <Box sx={{ ml: "13vw", px: 4 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>Admin Appointment</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ height: 600, width: "100%", position: "relative" }}>
          {loading && (
            <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", zIndex: 1 }}>
              <CircularProgress />
            </Box>
          )}

          <DataGrid
            rows={rows}
            getRowId={(r) => r._id}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            checkboxSelection={false}
            // no sorting state, no value formatters — raw DB values only
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 25 } } }}
          />
        </Box>
      </Box>
    </>
  );
}
