import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Toolbar, CircularProgress, Alert, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack 
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AdminNavbar from "./AdminNavbar";
import dayjs, { Dayjs } from "dayjs";


interface AppointmentRequest {
  _id: string;
  appointmentDateTime: string;
  name: string;
  phone: string;
  email: string; 
  address: string;
  description: string;
}

export default function IncomingAppointments() {
  const [rows, setRows] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [selectedAppt, setSelectedAppt] = useState<AppointmentRequest | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Dayjs | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/appointments"); 
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

const handleAction = async (status: "accepted" | "denied" | "rescheduled") => {
  if (!selectedAppt) return;
  setActionLoading(true); // Start loading spinner

  const payload = {
    status, // "accepted", "denied", or "rescheduled"
    // Send the new time if rescheduling, otherwise send original or null
    newAppointmentTime: status === "rescheduled" ? rescheduleDate?.toISOString() : null,
    // Add a default end time (1 hour later) if accepting
    appointmentEndDateTime: status === "accepted" 
      ? dayjs(selectedAppt.appointmentDateTime).add(1, 'hour').toISOString() 
      : null
  };

  try {
    // UPDATED URL: Added "/status" to the end
    const res = await fetch(`http://localhost:3000/api/appointments/${selectedAppt._id}/status`, {
      method: "PATCH", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setOpenModal(false);
      setRescheduleDate(null); // Reset date picker
      fetchRequests(); // Refresh the list
    } else {
      const errorData = await res.json();
      setActionError(errorData.message || "Failed to update status");
    }
  } catch (err) {
    setActionError("Network error. Please try again.");
  } finally {
    setActionLoading(false);
  }
};

  const columns: GridColDef<AppointmentRequest>[] = [
    {
      field: "appointmentDateTime",
      headerName: "Requested Date",
      flex: 1.2,
      minWidth: 180,
      valueGetter: (_, row) => dayjs(row.appointmentDateTime).format("MMM DD, YYYY @ h:mm A")
    },
    { field: "name", headerName: "Customer", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 0.8 },
    { field: "address", headerName: "Address", flex: 1.5 },
    {
      field: "actions",
      headerName: "Action",
      sortable: false,
      flex: 0.8,
      renderCell: (params) => (
        <Button 
          variant="contained" 
          size="small" 
          onClick={() => {
            setSelectedAppt(params.row);
            setOpenModal(true);
          }}
        >
          Review
        </Button>
      )
    }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AdminNavbar />
      <Box sx={{ ml: "13vw", p: 4, width: "calc(100% - 13vw)" }}>
        <Toolbar />
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Incoming Requests</Typography>

        <Box sx={{ height: 600, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
          <DataGrid rows={rows} columns={columns} getRowId={(r) => r._id} loading={loading} />
        </Box>

        {/* --- REVIEW MODAL --- */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Review Appointment: {selectedAppt?.name}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Current Request:</Typography>
                <Typography variant="body1">
                  {dayjs(selectedAppt?.appointmentDateTime).format("MMMM DD, YYYY [at] h:mm A")}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Issue Description:</Typography>
                <Typography variant="body2">{selectedAppt?.description}</Typography>
              </Box>

              <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Reschedule Option
                </Typography>
                <DateTimePicker
                  label="Select New Date & Time"
                  value={rescheduleDate}
                  onChange={(newValue) => setRescheduleDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <Button 
                  fullWidth 
                  variant="outlined" 
                  color="warning" 
                  sx={{ mt: 2 }}
                  disabled={!rescheduleDate}
                  onClick={() => handleAction("rescheduled")}
                >
                  Confirm Reschedule
                </Button>
              </Box>
            </Stack>
          </DialogContent>
          
<DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
  <Button
    color="inherit"
    onClick={() => setOpenModal(false)}
    disabled={actionLoading}
  >
    Cancel
  </Button>

  <Stack direction="row" spacing={2}>
    <Button
      color="error"
      variant="outlined"
      onClick={() => handleAction("denied")}
      disabled={actionLoading}
      startIcon={actionLoading ? <CircularProgress size={16} /> : null}
    >
      Deny
    </Button>

    <Button
      color="success"
      variant="contained"
      onClick={() => handleAction("accepted")}
      disabled={actionLoading}
      startIcon={actionLoading ? <CircularProgress size={16} /> : null}
    >
      Approve
    </Button>
  </Stack>
</DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}