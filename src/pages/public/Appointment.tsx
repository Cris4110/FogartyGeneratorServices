import Navbar from "./Navbar";
import Footer from "./Footer";
import { Container, Grid, Box, Typography, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

function Appointment() {
  {/* Variable to hold date and time */}
  const [dateTime, setDateTime] = React.useState<dayjs.Dayjs | null>(dayjs());

  const Appointment: React.FC = () => {
    const [name, setName] = useState("");
    const [address, setAdress] = useState("");
    const [generatorModel, setGeneratorNumber] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [responseMsg, setResponseMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        const response = await fetch("http://localhost:3000/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            address,
            generatorModel,
            serialNumber,
            description,
            time
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          // Show the backend error directly
          setResponseMsg(result.message || "Error creating user.");
        } else {
          setResponseMsg(result.message || "User created successfully!");

          // Clear form fields after success
          setName("");
          setAdress("");
          setGeneratorNumber("");
          setSerialNumber("");
          setDescription("");
          setTime("");
        }
      } catch (error) {
        setResponseMsg("Error connecting to server.");
        console.error(error);
      }
    };

    return (
      <>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 15, mb: 10 }}>
          {/* Main Grid */}
          <Grid container spacing={4} alignItems="flex-start">
            {/* Left Grid with text fields and request appointment button */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h3"
                fontWeight={700}
                gutterBottom
                align="center"
              >
                Book An Appointment
              </Typography>

              <TextField
                required
                label="Name"
                value={name}
                fullWidth
                sx={{ mb: 3 }}
              />

              <TextField
                required
                label="Address"
                value={address}
                fullWidth
                sx={{ mb: 3 }}
              />

              <TextField
                required
                label="Generator Model"
                value={generatorModel}
                fullWidth
                sx={{ mb: 3 }}
              />

              <TextField
                label="Serial Number"
                value={serialNumber}
                fullWidth
                sx={{ mb: 3 }}
              />

              <TextField
                required
                label="Description of service required"
                value={description}
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 3 }}
              />

              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button variant="contained" color="primary" size="large">
                  Request Appointment
                </Button>
              </Box>
            </Grid>

            {/* Right side with date and time picker */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 12 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                align="center"
              >
                Select A Date & Time
              </Typography>

              {/* Date and time picker */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDateTimePicker
                  displayStaticWrapperAs="desktop"
                  value={dateTime}
                  onChange={(newValue) => {
                    if (newValue) {
                      const rounded = newValue.minute(0).second(0);
                      setDateTime(rounded);
                      setTimeout(rounded.format("MMMM D, YYYY h:mm A"));
                    }
                  }}
                  views={["month", "day", "hours"]} // Only allows selection of month, day, and hours
                  minDateTime={dayjs()} // Cannot pick previous dates
                  maxDateTime={dayjs().add(2, "month")} // Limits selection to 2 months
                  ampm
                  shouldDisableTime={(value, view) => {
                    if (view === "hours") {
                      const hour = value.hour();
                      return hour < 8 || hour > 22;
                    }
                    return false;
                  }}
                  sx={{
                    mt: 2,
                    width: "100%",
                    "& .MuiPickerStaticWrapper-root": {
                      width: "100%",
                    },
                  }}
                />
              </LocalizationProvider>

              {/* Confirmation text */}
              <Typography variant="h6" sx={{ mt: 2 }} align="center">
                Selected: {time || "None"}
              </Typography>
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </>
    );
  };
}

export default Appointment;