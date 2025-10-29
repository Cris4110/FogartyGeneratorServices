import Navbar from "./Navbar";
import Footer from "./Footer";
import { Container, Grid, Box, Typography, Button, TextField } from "@mui/material";
import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

function Appointment() {
  {/* Variable to hold date and time */}
  const [dateTime, setDateTime] = React.useState<dayjs.Dayjs | null>(dayjs());

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 15, mb: 10 }}>
        {/* Main Grid  */}
        <Grid container spacing={4} alignItems="flex-start">
          {/* Left Grid with text fields and request appointment button */}
          <Grid size={{ xs: 12, md: 6}}>
            <Typography variant="h3" fontWeight={700} gutterBottom align="center">
              Book An Appointment
            </Typography>

            <TextField
              required
              label="Name"
              fullWidth
              sx={{mb: 3}}
            />
            <TextField
              required
              label="Address"
              fullWidth
              sx={{mb: 3}}
            />
            <TextField
              required
              label="Generator Model"
              fullWidth
              sx={{mb: 3}}
            />
            <TextField
              label="Serial Number"
              fullWidth
              sx={{ mb: 3 }}
            />
            <TextField
              required
              label="Description of service required"
              multiline
              rows={4}
              fullWidth
              sx={{mb: 3}}
            />

            <Box sx={{mt: 3, display: "flex", gap: 2}}>
              <Button variant="contained" color="primary" size="large">
                Request Appointment
              </Button>
            </Box>
          </Grid>

          {/* Right side with date and time picker as well as confirmation text */}
          <Grid size={{ xs: 12, md: 6}} sx={{mt:12}}>
            <Typography variant="h4" fontWeight={700} gutterBottom align="center">
              Select A Date & Time
            </Typography>

            {/* Date and time picker */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateTimePicker
                displayStaticWrapperAs="desktop"
                value={dateTime}
                onChange={(newValue) => setDateTime(newValue)}
                sx={{
                  mt: 2,
                  width: "100%",
                  "& .MuiPickerStaticWrapper-root": {
                    width: "100%",
                  },
                }}
              />
            </LocalizationProvider>

            {/* Confirmation text for date and time */}
            <Typography variant="h6" sx={{ mt: 2 }} align="center">
                Selected: {dateTime ? dateTime.format("MMMM D, YYYY h:mm A") : "None"}
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Appointment;