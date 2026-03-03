import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function RequestPart() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [partName, setPart] = useState("");
  const [AdditionalInformation, setAdditionalInfo] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${firstName} ${lastName}`.trim();

    const newPartrequest = {
      name,
      email,
      phoneNumber,
      address,
      partName,
      AdditionalInformation,
    };

    const newErrors: Partial<Record<string, string>> = {};
    if (!firstName)
      newErrors.firstName = "First name is required";
    if (!lastName)
      newErrors.lastName = "Last name is required";
    if (!email)
      newErrors.email = "Email is required";
    if (!phoneNumber)
      newErrors.phoneNumber = "Phone is required";
    if (!address)
      newErrors.address = "Address is required";
    if (!partName)
      newErrors.partName   = "Part name is required";

    setErrors(newErrors as Record<string, string>);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/partrequests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPartrequest),
      });
      const result = await response.json();
      if (!response.ok) {
        // Show the backend error directly
        setResponseMsg(result.message || "Error creating part request.");
      } else {
        setResponseMsg(result.message || "Part request created successfully!");
        // Clear form fields after success
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setAddress("");
        setPart("");
        setAdditionalInfo("");
      }
    } catch (error) {
      setResponseMsg("Error connecting to server.");
      console.error(error);
    }
  };

  const navigate = useNavigate();

  
useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        const user = data.user;
        if (!user) {
          if (!cancelled) navigate("/userlogin");
          return;
        }

        // Prefill fields
        if (!cancelled) {
          const fullName = (user.name || "").trim();
          if (fullName) {
            const parts = fullName.split(" ");
            setFirstName(parts.shift() || "");
            setLastName(parts.join(" ") || "");
          }
          if (user.email) setEmail(user.email);
          if (user.phoneNumber) setPhoneNumber(user.phoneNumber);
          if (user.address) setAddress(user.address.street + ", " + user.address.city + ", " + user.address.state
                      + " " + user.address.zipcode)
        }
      } catch (err) {
        if (!cancelled) navigate("/userlogin");
      }
    };

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [navigate]);
  
return (
    <>
      <Navbar />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          backgroundColor: "#f5f6f8",
          padding: 4,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: "600px",
            padding: 5,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            align="center"
          >
            Part Request Form
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="First Name"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                fullWidth
              />

              <TextField
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                fullWidth
              />

              <TextField
                label="Phone Number"
                name="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                fullWidth
              />

              <TextField
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
              />

              <TextField
                label="Address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                fullWidth
              />

              <TextField
                label="Part Name"
                name="part"
                value={partName}
                onChange={(e) => setPart(e.target.value)}
                error={!!errors.partName}
                helperText={errors.partName}
                fullWidth
              />

              {/* Optional Field */}
              <TextField
                label="Additional Information (Optional)"
                name="additionalInformation"
                value={AdditionalInformation}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                multiline
                rows={4}
                fullWidth
              />

              <Button
                variant="contained"
                type="submit"
                size="large"
                sx={{
                  backgroundColor: "#1f2937",
                  padding: "12px",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "16px",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#111827",
                  },
                }}
              >
                Submit Request
              </Button>
            </Stack>
          </form>
          {responseMsg && (
          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            {responseMsg}
          </p>
        )}
        </Paper>
      </Box>
      <Footer />
    </>
  );
}

export default RequestPart;