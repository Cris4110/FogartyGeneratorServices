import Navbar from "./Navbar";
import Footer from "./Footer";
import { Container, Grid, Box, Typography, Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import axios from "axios";

type Address = { street: string; city: string; state: string; zipcode: string}
type User = {  userID: string; name?: string; email: string, address?: Address, phoneNumber?: string };

function Appointment() {
  const [dateTime, setDateTime] = useState<dayjs.Dayjs | null>(dayjs());
  const [userID, setUserID] = useState("");
  const [phone, setPhone] = useState("");
  const [generatorModel, setGeneratorNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");
  const [appointmentTime, setTime] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
    withCredentials: true, // sends cookie automatically
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

   useEffect(() => {
  let cancelled = false;
  api.get("/users/me")
    .then(res => {
      if (!cancelled && res.data.user) {
        const user = res.data.user as User;
        setCurrentUser(user);
        setUserID(user.userID);
        setPhone(user.phoneNumber ?? "Issue with getting phone");
      }
    })
    .catch(() => !cancelled && setCurrentUser(null))
    .finally(() => !cancelled && setAuthReady(true));
  return () => { cancelled = true; };
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setResponseMsg("You must be logged in to create an appointment.");
      return;
    }

    try {
      const response = await api.post("/appointments", {
        userID,
        generatorModel,
        serialNumber,
        description,
        appointmentTime,
      });

      const result = response.data;

      setResponseMsg(result.message || "Appointment created successfully!");
      setGeneratorNumber("");
      setSerialNumber("");
      setDescription("");
      setTime("");
    } catch (error: any) {
      console.error(error);
      setResponseMsg(
        error.response?.data?.message || "Error connecting to server."
      );
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 15, mb: 10 }}>
        <Grid container spacing={4} alignItems="flex-start">
          {/* Left Form Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              align="center"
            >
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
                {/* UserID automatically filled */}
                <TextField
                  label="User ID"
                  value={currentUser.userID? currentUser.userID : "Issue with getting userID"}
                  fullWidth
                  sx={{ mb: 3 }}
                  disabled
                />

                {/* Name automatically filled */}
                <TextField
                  label="Name"
                  value={currentUser.name? currentUser.name : "Issue with getting name"}
                  fullWidth
                  sx={{ mb: 2 }}
                  disabled
                />

                {/* Email automatically filled */}
                <TextField
                  label="Email"
                  value={currentUser.email? currentUser.email : "Issue with getting email"}
                  fullWidth
                  sx={{ mb: 3 }}
                  disabled
                />

                {/* Address automatically filled */}
                <TextField
                  label="Address"
                  value={
                    currentUser?.address
                      ? `${currentUser.address.street}, ${currentUser.address.city}, ${currentUser.address.state} ${currentUser.address.zipcode}` : "Issue with getting address"
                  }
                  fullWidth
                  sx={{ mb: 3 }}
                  disabled
                />

                {/* Phone number automatically filled */}
                <TextField
                  label="Phone Number"
                  value={currentUser.phoneNumber? currentUser.phoneNumber : "Issue with getting phone number"}
                  fullWidth
                  sx={{ mb: 3 }}
                  disabled
                />

                <TextField
                  label="Generator Model"
                  value={generatorModel}
                  onChange={(e) => setGeneratorNumber(e.target.value)}
                  fullWidth
                  sx={{ mb: 3 }}
                />
                <TextField
                  label="Serial Number"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  fullWidth
                  sx={{ mb: 3 }}
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

                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                  >
                    Request Appointment
                  </Button>
                </Box>
              </form>
            )}

            {responseMsg && (
              <Typography sx={{ mt: 2 }} color="primary">
                {responseMsg}
              </Typography>
            )}
          </Grid>

          {/* Right side Date & Time Picker */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              align="center"
            >
              Select A Date & Time
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateTimePicker
                displayStaticWrapperAs="desktop"
                value={dateTime}
                onChange={(newValue) => {
                  if (newValue) {
                    const rounded = newValue.minute(0).second(0);
                    setDateTime(rounded);
                    setTime(rounded.format("MMMM D, YYYY h:mm A"));
                  }
                }}
                views={["month", "day", "hours"]}
                minDateTime={dayjs()}
                maxDateTime={dayjs().add(2, "month")}
                ampm
                shouldDisableTime={(value, view) => {
                  if (view === "hours") {
                    const hour = value.hour();
                    return hour < 8 || hour > 20;
                  }
                  return false;
                }}
              />
            </LocalizationProvider>

            <Typography variant="h6" sx={{ mt: 2 }} align="center">
              Selected: {appointmentTime || "None"}
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Appointment;
