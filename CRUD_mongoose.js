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
import reviewRoute from "./routes/review.route.js";
import userRoute from "./routes/user.route.js";
import quoteRoute from "./routes/quote.route.js";
import pagecontentRoute from "./routes/pagecontent.route.js";

dotenv.config();

dotenv.config();

const app = express();
// Serve static HTML file
//app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

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