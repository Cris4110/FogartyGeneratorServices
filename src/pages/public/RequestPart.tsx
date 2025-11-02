import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PartRequestData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  part: string;
}

function RequestPart() {
  const [formData, setFormData] = useState<PartRequestData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    part: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PartRequestData, string>>
  >({});

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  //handles form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevents page from refreshing when pressing submit
    // valdiates inputs and shows errors
    const newErrors: Partial<Record<keyof PartRequestData, string>> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.part.trim()) newErrors.part = "Part is required";

    setErrors(newErrors); // sets new errors

    // prevents form from submitting if there are errors
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    alert("Quote request submitted!");
    // navigates to homepage once form is submitted
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 15,
          mb: 30,
          textAlign: "center",
          backgroundColor: "lightgray",
          width: "70%",
          height: "350px",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "150px",
          padding: "20px",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          align="center"
          gutterBottom
          marginBottom="50px"
        >
          Request Part
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            fullWidth
          />
          <TextField
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            fullWidth
          />
          <TextField
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
          />
          <TextField
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />
          <TextField
            placeholder="Part"
            name="part"
            value={formData.part}
            onChange={handleChange}
            error={!!errors.part}
            helperText={errors.part}
            fullWidth
          />
          <Box sx={{ textAlign: "center", mb: 10, height: "10px" }}>
            <Button
              variant="contained"
              type="submit"
              style={{
                backgroundColor: "#000000ff",
                color: "white",
                fontWeight: "bold",
                padding: "10px 20px",
                textTransform: "none",
                marginTop: "75px",
                marginBottom: "0px",
                width: "200px",
              }}
            >
              Submit Request
            </Button>
          </Box>
        </form>
      </Box>
      <Footer />
    </>
  );
}

export default RequestPart;
