import Navbar from "./Navbar";
import Footer from "./Footer";
import { Container, Box, Typography, Button, TextField, Divider, Paper, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";  
import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import axios from "axios";


// Types
type Address = {
  street: string;
  city: string;
  state: string;
  zipcode: string;
};

type User = {
  userID: string;
  name?: string;
  email: string;
  address?: Address;
  phoneNumber?: string;
};

type ReviewedAppointment = {
  _id: string;
  status: string;
  appointmentDateTime: string;
  appointmentEndDateTime?: string;
  rescheduledDateTime?: string;
  rescheduledEndDateTime?: string;
};

function Appointment() {
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, 'day').format("YYYY-MM-DD"));
  const [selectedTime, setSelectedTime] = useState("");
  const [generatorModel, setGeneratorNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [busyRanges, setBusyRanges] = useState<{start: dayjs.Dayjs, end: dayjs.Dayjs}[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const getBaseURL = () => {
    try {
      // @ts-ignore
      const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_BASE_URL : null;
      return envUrl ?? "http://localhost:3000/api";
    } catch (e) {
      return "http://localhost:3000/api";
    }
  };

  const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const timeSlots = useMemo(() => {
    const slots = [];
    let start = dayjs().set('hour', 8).set('minute', 0);
    const end = dayjs().set('hour', 20).set('minute', 0);
    
    while (start.isBefore(end) || start.isSame(end)) {
      slots.push(start.format("h:mm A"));
      start = start.add(30, 'minute');
    }
    return slots;
  }, []);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/users/me")
      .then((res) => {
        if (!cancelled && res.data.user) {
          setCurrentUser(res.data.user);
        }
      })
      .catch(() => !cancelled && setCurrentUser(null))
      .finally(() => !cancelled && setAuthReady(true));

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const fetchBusySlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await api.get(`/appointments/reviewed`);
        const appointments: ReviewedAppointment[] = res.data;

        const mappedRanges = appointments
          .filter(appt => appt.status === "accepted" || appt.status === "rescheduled")
          .map(appt => {
            const startStr = (appt.status === "rescheduled" && appt.rescheduledDateTime) 
              ? appt.rescheduledDateTime 
              : appt.appointmentDateTime;

            const endStr = (appt.status === "rescheduled" && appt.rescheduledEndDateTime)
              ? appt.rescheduledEndDateTime
              : appt.appointmentEndDateTime;

            const start = dayjs(startStr);
            const end = endStr ? dayjs(endStr) : start.add(1, 'hour');

            return { start, end };
          })
          .filter(range => range.start.isValid());

        setBusyRanges(mappedRanges);
        
        if (selectedTime) {
          const checkTime = dayjs(`${selectedDate} ${selectedTime}`, "YYYY-MM-DD h:mm A");
          const isNowBusy = mappedRanges.some(range => 
            (checkTime.isSame(range.start) || checkTime.isAfter(range.start)) && checkTime.isBefore(range.end)
          );
          if (isNowBusy) setSelectedTime("");
        }
      } catch (err) {
        console.error("Error fetching reviewed appointments:", err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBusySlots();
  }, [selectedDate]);

  const isTimeSlotBooked = (timeStr: string) => {
    const slotStart = dayjs(`${selectedDate} ${timeStr}`, "YYYY-MM-DD h:mm A");
    return busyRanges.some(range => 
      (slotStart.isSame(range.start) || slotStart.isAfter(range.start)) && slotStart.isBefore(range.end)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) { setResponseMsg("Please log in."); return; }
    if (!selectedTime) { setResponseMsg("Select a time."); return; }

    try {
      const appointmentDateTime = dayjs(`${selectedDate} ${selectedTime}`, "YYYY-MM-DD h:mm A").toISOString();
      const appointmentEndDateTime = dayjs(appointmentDateTime).add(1, 'hour').toISOString();

      const response = await api.post("/appointments", {
        userID: currentUser.userID,
        generatorModel,
        serialNumber,
        description,
        appointmentDateTime, 
        appointmentEndDateTime,
      });

      setResponseMsg(response.data.message || "Request submitted successfully!");
      setGeneratorNumber("");
      setSerialNumber("");
      setDescription("");
      setSelectedTime("");
    } catch (err: any) {
      setResponseMsg(err.response?.data?.message || "Error submitting request.");
    }
  };

  if (!authReady) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fff' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4, alignItems: "flex-start" }}>
          <Box>
            <Typography variant="h3" fontWeight={700} gutterBottom align="center">Book Appointment</Typography>
            {!currentUser ? (
              <Typography align="center" sx={{ mt: 3 }}>Please log in to book.</Typography>
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField label="User ID" value={currentUser.userID} fullWidth sx={{ mb: 3 }} disabled />
                <TextField label="Name" value={currentUser.name || ""} fullWidth sx={{ mb: 2 }} disabled />
                <TextField label="Generator Model" value={generatorModel} onChange={(e) => setGeneratorNumber(e.target.value)} fullWidth sx={{ mb: 3 }} />
                <TextField label="Serial Number" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} fullWidth sx={{ mb: 3 }} />
                <TextField required label="Problem Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} fullWidth sx={{ mb: 3 }} />
                <Button variant="contained" color="primary" size="large" type="submit" disabled={!selectedTime}>Submit Request</Button>
              </form>
            )}
            {responseMsg && <Typography sx={{ mt: 2 }} color="primary" align="center">{responseMsg}</Typography>}
          </Box>

          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom align="center">Select Date & Time</Typography>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 4 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>1. Choose Date</Typography>
                <TextField 
                  type="date" 
                  fullWidth 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  inputProps={{ min: dayjs().format("YYYY-MM-DD"), max: dayjs().add(2 , 'month').format("YYYY-MM-DD")}} 
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Divider sx={{ mb: 4 }} />
              <Box sx={{ position: 'relative' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>2. Select Available Time</Typography>
                {loadingSlots && <Box sx={{ position: 'absolute', right: 0, top: 0 }}><CircularProgress size={20} /></Box>}
                <Box sx={{ maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
                  <Grid container spacing={1.5}>
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time;
                      const isBooked = isTimeSlotBooked(time);
                      return (
                        <Grid size={4} key={time}>
                          <Button
                            fullWidth
                            variant={isSelected ? "contained" : "outlined"}
                            onClick={() => setSelectedTime(time)}
                            disabled={isBooked}
                            sx={{
                              py: 1.5,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              borderColor: isSelected ? 'primary.main' : isBooked ? '#f1f5f9' : '#e0e0e0',
                              color: isSelected ? '#fff' : isBooked ? '#cbd5e1' : 'text.secondary',
                              bgcolor: isSelected ? 'primary.main' : isBooked ? '#f8fafc' : 'transparent',
                              '&.Mui-disabled': { color: '#cbd5e1', borderColor: '#f1f5f9', bgcolor: '#f8fafc', textDecoration: 'line-through' },
                            }}
                          >
                            {time}
                          </Button>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}

export default Appointment;