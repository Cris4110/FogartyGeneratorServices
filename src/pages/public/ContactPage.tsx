import Navbar from "../Navbar";
import Footer from "../Footer";
import {AppBar, Toolbar, Box, Button, Typography, Container} from "@mui/material";
import logo from "../../assets/logo.png";

function ContactPage() {
  return (
    <>
      {/* ===== Navbar Section ===== */}
      <Navbar />

      {/* ===== Top Bar with Logo + Buttons ===== */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Left: Logo + Site Name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src={logo}
              alt="Fogarty Logo"
              sx={{ height: 45, width: 45, borderRadius: "50%" }}
            />
            <Typography variant="h6" fontWeight={700} color="text.primary">
              Fogarty Online Generator Services
            </Typography>
          </Box>

          {/* Right: Sign In + Cart */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" color="primary">
              Sign-In
            </Button>
            <Button variant="contained" color="primary">
              Cart
            </Button>
          </Box>
        </Toolbar>

        {/* Navigation Buttons */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
          }}
        >
          {["Home", "About", "Service", "Contact", "FAQ"].map((item) => (
            <Button key={item} color="inherit" sx={{ fontWeight: 600 }}>
              {item}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      {/* ===== Main Content ===== */}
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          mt: 8,
          mb: 12,
        }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Phone: (971) 244-2450
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Email: 
        </Typography>
      </Container>

      {/* ===== Footer Info ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          gap: 8,
          px: 8,
          pb: 6,
        }}
      >
        {/* Contact Info */}
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Contact Info
          </Typography>
          <Typography>Phone: (971) 244-2450</Typography>
        </Box>

        {/* Contact Hours */}
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Contact Hours
          </Typography>
          <Typography>Monday:</Typography>
          <Typography>Tuesday:</Typography>
          <Typography>Wednesday:</Typography>
          <Typography>Thursday:</Typography>
          <Typography>Friday:</Typography>
          <Typography>Saturday:</Typography>
          <Typography>Sunday:</Typography>
        </Box>
      </Box>

      <Footer />
    </>
  );
}

export default ContactPage;
