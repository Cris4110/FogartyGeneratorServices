import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";

function LeaveReview() {
  const [name, setName] = useState(""); // free input name
  const [service, setService] = useState("");
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState(0); // can be 0.5, 1, 1.5, ...
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name || !service || !comments || rating === 0) {
      setError("Please fill out all required fields.");
      return;
    }
    setError("");
    console.log({ name, service, rating, comments });
    alert("Review submitted!");
  };

  const handleStarClick = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const half = x < rect.width / 2 ? 0.5 : 1;
    setRating(index + half);
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
        <Box>
          <Typography variant="h4" gutterBottom align="center">
            Leave a Review
          </Typography>

          {/* Name input */}
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Service select */}
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

          {/* Star rating */}
          <Typography mt={2} mb={1}>
            Rating
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                onClick={(e) => handleStarClick(e, i)}
                style={{
                  position: "relative",
                  fontSize: "32px",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  display: "inline-block",
                }}
              >
                {/* Empty star */}
                <div
                  style={{
                    color: "#ccc",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  ★
                </div>
                {/* Fill star */}
                <div
                  style={{
                    color: "#ffb400",
                    overflow: "hidden",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width:
                      rating > i
                        ? rating >= i + 1
                          ? "100%"
                          : "50%"
                        : "0%",
                    whiteSpace: "nowrap",
                  }}
                >
                  ★
                </div>
              </div>
            ))}
            <Typography ml={2}>{rating.toFixed(1)}</Typography>
          </Box>

          {/* Comments field */}
          <TextField
            label="Comments"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />

          {/* Error message */}
          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          {/* Submit button */}
          <Button
            variant="contained"
            fullWidth
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
