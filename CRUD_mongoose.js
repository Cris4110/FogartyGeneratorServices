const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Admin = require('./models/admin.model');
const adminRoute = require("./routes/admin.route.js")
const Appointment = require('./models/appointment.model');
const appointmentRoute = require("./routes/appointment.route.js")
const Generator = require("./models/generator.model")
const generatorRoute = require("./routes/generator.route.js")
const Manufacturer = require("./models/manufacturer.model")
const manufacturerRoute = require("./routes/manufacturer.route.js")
const Part = require("./models/part.model")
const partRoute = require("./routes/part.route.js")
const Review = require("./models/review.model")
const reviewRoute = require("./routes/review.route.js")
const User = require("./models/user.model")
const userRoute = require("./routes/user.route.js")
const path = require('path');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();

//define cors options
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,  // allow cookies
}));
//middleware
app.use(express.json());
app.use(cookieParser());
// Serve static HTML file
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.urlencoded({extended: false}));

//routes
app.use('/api/admins', adminRoute);
app.use('/api/generators', generatorRoute);
app.use('/api/parts', partRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/users', userRoute);
app.use('/api/appointments', appointmentRoute);
app.use('/api/manufacturers', manufacturerRoute);

app.get('/', (req, res) => {
    res.send("Hello for Node API Server Updated");
});

const PORT = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;

// Fail fast if the env var is not set to avoid confusing Mongoose errors
if (!uri) {
    console.error('MONGODB_URI is not set. Please add it to your .env or environment variables.');
    console.error('Example .env: MONGODB_URI="mongodb+srv://user:pass@cluster0.mongodb.net/mydb?retryWrites=true&w=majority"');
    process.exit(1);
}

(async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB database!');
    } catch (err) {
        console.error('Connection FAILED:');
        // print the full error to aid debugging
        console.error(err);
        process.exit(1);
    }
})();

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});