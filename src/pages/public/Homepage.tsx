import Navbar from "./Navbar";
import Footer from "./Footer";
import { Container, Grid, Box, Typography, Button } from "@mui/material";
import logo from "../../assets/Kohler_Gen.jpg";
import { Link } from "react-router-dom";

function Homepage() {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 15, mb: 30 }}>
        <Grid container spacing={4} alignItems="center">
          {/* LEFT SIDE — text and buttons */}
          <Grid size={{ xs: 12, md: 6}}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Welcome to Fogarty Onsite Generator Service
            </Typography>

            <Typography variant="h6" color="text.secondary">
              Reliable generator installation, maintenance, and repair services you can trust.
            </Typography>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                component={Link}
                to="/Appointment"
                variant="contained"
                color="primary"
                size="large"
              >
                Request Appointment
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="large"
              >
                Request Free Quote
              </Button>
            </Box>
          </Grid>

          {/* RIGHT SIDE — image */}
          <Grid size={{ xs: 12, md: 6}}>
            <Box
              component="img"
              src={logo}
              alt="Generator Service"
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Homepage;