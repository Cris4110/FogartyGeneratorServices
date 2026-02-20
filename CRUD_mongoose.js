import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import adminRoute from "./routes/admin.route.js";
import appointmentRoute from "./routes/appointment.route.js";
import generatorRoute from "./routes/generator.route.js";
import manufacturerRoute from "./routes/manufacturer.route.js";
import partRoute from "./routes/part.route.js";
import reviewRoutes from "./routes/review.route.js";
import userRoute from "./routes/user.route.js";
import quoteRoute from "./routes/quote.route.js";

dotenv.config();

const app = express();

// middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/admins", adminRoute);
app.use("/api/generators", generatorRoute);
app.use("/api/parts", partRoute);
app.use("/api/reviews", reviewRoutes); // ✅ FIXED (correct variable)
app.use("/api/users", userRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/manufacturers", manufacturerRoute);
app.use("/api/quotes", quoteRoute);

app.get("/", (req, res) => {
  res.send("Hello for Node API Server Updated");
});

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not set. Add it to your .env');
  process.exit(1);
}

try {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB database!");
} catch (err) {
  console.error("Connection FAILED:", err);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});