import Navbar from "./Navbar";
import Footer from "./Footer";
import { Container, Box, Typography, Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";  
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import axios from "axios";


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

function Appointment() {
  const [dateTime, setDateTime] = useState(dayjs());
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [generatorModel, setGeneratorNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
    withCredentials: true,
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // ---------------------------
  // LOAD USER INFO
  // ---------------------------
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

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------------------
  // SUBMIT APPOINTMENT REQUEST
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setResponseMsg("You must be logged in to create an appointment.");
      return;
    }

    try {
      const response = await api.post("/appointments", {
        userID: currentUser.userID,
        generatorModel,
        serialNumber,
        description,
        appointmentDate,
        appointmentTime,
      });

      setResponseMsg(response.data.message || "Appointment created successfully!");

      setGeneratorNumber("");
      setSerialNumber("");
      setDescription("");
      setAppointmentDate("");
      setAppointmentTime("");
    } catch (err: any) {
      setResponseMsg(err.response?.data?.message || "Error connecting to server.");
    }
  };

  // ---------------------------
  // RENDER COMPONENT
  // ---------------------------
return (
  <>
    <Navbar />

    <Container maxWidth="lg" sx={{ mt: 15, mb: 10 }}>
      
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
          alignItems: "flex-start",
        }}
      >

        {/* LEFT SIDE */}
        <Box>
          <Typography variant="h3" fontWeight={700} gutterBottom align="center">
            Book An Appointment
          </Typography>

          {!authReady ? (
            <Typography align="center" sx={{ mt: 3 }}>
              Loading authentication...
            </Typography>
          ) : !currentUser ? (
            <Typography align="center" sx={{ mt: 3 }}>
              Please log in to book an appointment.
            </Typography>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField label="User ID" value={currentUser.userID} fullWidth sx={{ mb: 3 }} disabled />
              <TextField label="Name" value={currentUser.name || ""} fullWidth sx={{ mb: 2 }} disabled />
              <TextField label="Email" value={currentUser.email} fullWidth sx={{ mb: 3 }} disabled />
              
              <TextField
                label="Address"
                value={
                  currentUser.address
                    ? `${currentUser.address.street}, ${currentUser.address.city}, ${currentUser.address.state} ${currentUser.address.zipcode}`
                    : ""
                }
                fullWidth
                sx={{ mb: 3 }}
                disabled
              />

              <TextField label="Phone Number" value={currentUser.phoneNumber || ""} fullWidth sx={{ mb: 3 }} disabled />

              <TextField label="Generator Model" value={generatorModel} onChange={(e) => setGeneratorNumber(e.target.value)} fullWidth sx={{ mb: 3 }} />
              <TextField label="Serial Number" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} fullWidth sx={{ mb: 3 }} />

              <TextField
                required
                label="Description of service required"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 3 }}
              />

              <Button variant="contained" color="primary" size="large" type="submit">
                Request Appointment
              </Button>
            </form>
          )}

          {responseMsg && (
            <Typography sx={{ mt: 2 }} color="primary">
              {responseMsg}
            </Typography>
          )}
        </Box>

        {/* RIGHT SIDE */}
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom align="center">
            Select A Date & Time
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDateTimePicker
              displayStaticWrapperAs="desktop"
              value={dateTime}
              onChange={(newValue) => {
                if (!newValue) return;
                const rounded = newValue.minute(0).second(0);
                setDateTime(rounded);
                setAppointmentDate(rounded.format("YYYY-MM-DD"));
                setAppointmentTime(rounded.format("h:mm A"));
              }}
              views={["month", "day", "hours"]}
              minDateTime={dayjs()}
              maxDateTime={dayjs().add(2, "month")}
              ampm
              shouldDisableTime={(v, view) =>
                view === "hours" && (v.hour() < 8 || v.hour() > 20)
              }
            />
          </LocalizationProvider>

          <Typography variant="h6" sx={{ mt: 2 }} align="center">
            Selected: {appointmentDate && appointmentTime ? `${appointmentDate} @ ${appointmentTime}` : "None"}
          </Typography>
        </Box>

      </Box>
    </Container>

    <Footer />
  </>
);


}

export default Appointment;
