import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Stack,
  IconButton,
} from "@mui/material";

function LeaveReview() {
  // Form state
  const [name, setName] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [error, setError] = useState<string>("");

  // Autofill name
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setName(parsedUser.name || "Heer");
    } else {
      setName("Heer"); // default for testing
    }
  }, []);

  // Handle submit
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
        <Box mt={4} mb={4}>
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
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                style={{
                  cursor: "pointer",
                  fontSize: "24px",
                  color: num <= rating ? "#ffb400" : "#ccc",
                }}
                onClick={() => setRating(num)}
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