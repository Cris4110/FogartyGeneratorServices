import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Container, Box, Typography, Button, TextField } from "@mui/material";
import { useAuth } from "../../context/Appcontext"; // 1. Import your global context
import { auth } from "../../firebase"; // 2. Needed to get the fresh token
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import axios from "axios";

function Appointment() {
  // 3. Pull user and readiness state from Context
  const { currentUser, authReady } = useAuth();
  
  const [dateTime, setDateTime] = useState<Dayjs>(dayjs());
  const [generatorModel, setGeneratorNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  // 4. Handle Submission with the Firebase Token
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setResponseMsg("You must be logged in to create an appointment.");
      return;
    }

    try {
      // Get the fresh ID Token to pass through your middleware
      const token = await auth.currentUser?.getIdToken();

      const appointmentDateTime = dateTime.toISOString();
      const createdAt = new Date().toISOString();

      const response = await axios.post("http://localhost:3000/api/appointments", {
        userID: currentUser.userID,
        generatorModel,
        serialNumber,
        description,
        appointmentDateTime, 
        createdAt
      }, {
        headers: { 
          Authorization: `Bearer ${token}` // 5. This stops the 401 error
        }
      });

      setResponseMsg(response.data.message || "Appointment created successfully!");
      setGeneratorNumber("");
      setSerialNumber("");
      setDescription("");
    } catch (err: any) {
      setResponseMsg(err.response?.data?.message || "Error connecting to server.");
    }
  };

  // 6. Handle the Loading State
  if (!authReady) {
    return (
      <Container sx={{ mt: 15, textAlign: "center" }}>
        <Typography>Checking authentication...</Typography>
      </Container>
    );
  }

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
          {/* LEFT SIDE - FORM */}
          <Box>
            <Typography variant="h3" fontWeight={700} gutterBottom align="center">
              Book An Appointment
            </Typography>

            {!currentUser ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" color="error">
                  Please log in to book an appointment.
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }} href="/userlogin">
                  Go to Login
                </Button>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField label="Name" value={currentUser.name || ""} fullWidth sx={{ mb: 2 }} disabled />
                <TextField label="Email" value={currentUser.email} fullWidth sx={{ mb: 3 }} disabled />

                <TextField
                  label="Address"
                  value={
                    currentUser.address
                      ? `${currentUser.address.street}, ${currentUser.address.city}, ${currentUser.address.state} ${currentUser.address.zipcode}`
                      : "No address on file"
                  }
                  fullWidth
                  sx={{ mb: 3 }}
                  disabled
                />

                <TextField label="Phone Number" value={currentUser.phoneNumber || ""} fullWidth sx={{ mb: 3 }} disabled />

                <TextField
                  label="Generator Model"
                  value={generatorModel}
                  onChange={(e) => setGeneratorNumber(e.target.value)}
                  fullWidth
                  sx={{ mb: 3 }}
                  required
                />

                <TextField
                  label="Serial Number"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  fullWidth
                  sx={{ mb: 3 }}
                  required
                />

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

                <Button variant="contained" color="primary" size="large" type="submit" fullWidth>
                  Request Appointment
                </Button>
              </form>
            )}

            {responseMsg && (
              <Typography sx={{ mt: 2, fontWeight: 'bold' }} color={responseMsg.includes("Error") ? "error" : "primary"}>
                {responseMsg}
              </Typography>
            )}
          </Box>

          {/* RIGHT SIDE - CALENDAR */}
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom align="center">
              Select A Date & Time
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateTimePicker
                displayStaticWrapperAs="desktop"
                value={dateTime}
                onChange={(newValue) => {
                  if (newValue) setDateTime(newValue);
                }}
                views={["year", "month", "day", "hours", "minutes"]}
                minDateTime={dayjs()}
                maxDateTime={dayjs().add(2, "month")}
                ampm
                shouldDisableTime={(value, view) =>
                  view === "hours" && (value.hour() < 8 || value.hour() > 20)
                }
              />
            </LocalizationProvider>

            <Typography variant="h6" sx={{ mt: 2 }} align="center">
              Selected: {dateTime.format("YYYY-MM-DD @ h:mm A")}
            </Typography>
          </Box>
        </Box>
      </Container>

      <Footer />
    </>
  );
}

export default Appointment;