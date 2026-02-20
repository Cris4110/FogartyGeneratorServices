const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Admin = require('./models/admin.model');
const adminRoute = require("./routes/admin.route.js");
const Appointment = require('./models/appointment.model');
const appointmentRoute = require("./routes/appointment.route.js");
const Generator = require("./models/generator.model");
const generatorRoute = require("./routes/generator.route.js");
const Manufacturer = require("./models/manufacturer.model");
const manufacturerRoute = require("./routes/manufacturer.route.js");
const Part = require("./models/part.model");
const partRoute = require("./routes/part.route.js");
const Review = require("./models/review.model");
const reviewRoute = require("./routes/review.route.js");
const User = require("./models/user.model");
const userRoute = require("./routes/user.route.js");
const Quote = require("./models/quote.model.js");
const quoteRoute = require("./routes/quote.route.js")
const pagecontentRoute = require("./routes/aboutpagecontent.route.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();

// middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());


//app.use(express.urlencoded({extended: false}));

//routes
app.use('/api/admins', adminRoute);
app.use('/api/generators', generatorRoute);
app.use('/api/parts', partRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/users', userRoute);
app.use('/api/appointments', appointmentRoute);
app.use('/api/manufacturers', manufacturerRoute);
app.use('/api/quotes', quoteRoute);
app.use('/api/pagecontent', pagecontentRoute);

app.get('/', (req, res) => {
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