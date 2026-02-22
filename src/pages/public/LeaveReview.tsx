import React, { useState } from "react";
import {
 Container,
 Box,
 Typography,
 Button,
 TextField,
 MenuItem,
 Alert,
 CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";


function LeaveReview() {
 const navigate = useNavigate();


 const [name, setName] = useState("");
 const [service, setService] = useState("");
 const [comments, setComments] = useState("");
 const [rating, setRating] = useState(0);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");
 const [loading, setLoading] = useState(false);


 // ⭐ Half / Full Star Click
 const handleStarClick = (
   event: React.MouseEvent<HTMLDivElement>,
   index: number
 ) => {
   const rect = event.currentTarget.getBoundingClientRect();
   const clickX = event.clientX - rect.left;
   const isHalf = clickX < rect.width / 2;
   setRating(index + (isHalf ? 0.5 : 1));
 };


 // 🚀 Submit Review
 const handleSubmit = async () => {
   setError("");
   setSuccess("");


   if (!name.trim() || !service || !comments.trim()) {
     setError("All fields are required.");
     return;
   }


   if (rating === 0) {
     setError("Please select a rating.");
     return;
   }


   setLoading(true);


   try {
     const response = await fetch("http://localhost:3000/api/reviews", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         reviewID: Date.now().toString(), // simple unique ID
         name: name.trim(),
         service: service,
         rating,
         comment: comments.trim(),
         createdAt: new Date(),
         verified: false,
       }),
     });


     const data = await response.json().catch(() => null);


     if (!response.ok) {
       throw new Error(data?.message || "Failed to submit review.");
     }


     setSuccess("Review submitted successfully!");


     // Reset form
     setName("");
     setService("");
     setComments("");
     setRating(0);
   } catch (err: any) {
     setError(err.message || "Error submitting review.");
   } finally {
     setLoading(false);
   }
 };


 return (
   <>
     <Navbar />


     <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
       <Box
         sx={{
           p: 4,
           borderRadius: 3,
           boxShadow: 3,
           backgroundColor: "#fff",
         }}
       >
         <Typography variant="h4" align="center" gutterBottom>
           Leave a Review
         </Typography>


         {/* Success Message + View Button */}
         {success && (
           <>
             <Alert severity="success" sx={{ mb: 2 }}>
               {success}
             </Alert>


             <Button
               variant="outlined"
               fullWidth
               sx={{ mb: 2 }}
               onClick={() => navigate("/viewreviews")}
             >
               View Reviews
             </Button>
           </>
         )}


         {/* Error Message */}
         {error && (
           <Alert severity="error" sx={{ mb: 2 }}>
             {error}
           </Alert>
         )}


         {/* Name */}
         <TextField
           label="Your Name"
           fullWidth
           margin="normal"
           value={name}
           onChange={(e) => setName(e.target.value)}
         />


         {/* Service Dropdown */}
         <TextField
           select
           label="Select Service"
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


         {/* Star Rating */}
         <Typography mt={3} mb={1}>
           Rating
         </Typography>


         <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
           {[0, 1, 2, 3, 4].map((i) => (
             <Box
               key={i}
               onClick={(e) => handleStarClick(e, i)}
               sx={{
                 position: "relative",
                 fontSize: 36,
                 cursor: "pointer",
                 width: 36,
                 height: 36,
                 display: "inline-block",
                 mr: 0.5,
               }}
             >
               {/* Empty Star */}
               <Box sx={{ position: "absolute", color: "#ddd" }}>★</Box>


               {/* Filled Star */}
               <Box
                 sx={{
                   position: "absolute",
                   color: "#ffb400",
                   overflow: "hidden",
                   width:
                     rating > i
                       ? rating >= i + 1
                         ? "100%"
                         : "50%"
                       : "0%",
                 }}
               >
                 ★
               </Box>
             </Box>
           ))}


           <Typography ml={2}>{rating.toFixed(1)}</Typography>
         </Box>


         {/* Comments */}
         <TextField
           label="Comments"
           fullWidth
           multiline
           rows={4}
           margin="normal"
           value={comments}
           onChange={(e) => setComments(e.target.value)}
         />


         {/* Submit Button */}
         <Button
           variant="contained"
           fullWidth
           sx={{ mt: 3 }}
           onClick={handleSubmit}
           disabled={loading}
         >
           {loading ? (
             <CircularProgress size={24} color="inherit" />
           ) : (
             "Submit Review"
           )}
         </Button>
       </Box>
     </Container>


     <Footer />
   </>
 );
}


export default LeaveReview;