import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LeaveReview() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");

  // Check login + autofill name
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (user) {
      const parsedUser = JSON.parse(user);
      setName(parsedUser.name || "");
    }
  }, [navigate]);

  const handleSubmit = () => {
    if (!service || !comments || rating === 0) {
      setError("Please fill out all required fields.");
      return;
    }

    setError("");
    console.log({ name, service, rating, comments });
    alert("Review submitted!");
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Leave a Review
          </Typography>

          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            disabled
          />

          <TextField
            select
            label="Service"
            fullWidth
            margin="normal"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <MenuItem value="">Select a service</MenuItem>
            <MenuItem value="repair">Repair</MenuItem>
            <MenuItem value="installation">Installation</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </TextField>

          <Typography mt={2}>Rating</Typography>
          <Box sx={{ fontSize: "2rem", mb: 2 }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                onClick={() => setRating(num)}
                style={{
                  cursor: "pointer",
                  color: num <= rating ? "#fbc02d" : "#ccc",
                  marginRight: "6px",
                }}
              >
                ★
              </span>
            ))}
          </Box>

          <TextField
            label="Comments"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            Submit Review
          </Button>
        </Box>
      </Container>

      <Footer />
    </>
  );
}

export default LeaveReview;
