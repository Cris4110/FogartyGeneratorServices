require('dotenv').config()              // Load environment variables from a .env file into process.env
const express = require('express')      // Import Express (web framework)
const app = express()                   // Create an Express application instance
const path = require('path')            // Read PORT from environment; fallback to 3500 if not set
const cors = require('cors');            // Added: to allow frontend requests
const fs = require('fs');              // Added: to read quotes from a file
const PORT = process.env.PORT || 3000

app.use(cors()); // Enable CORS for all routes
app.use(express.json());                 // Enable JSON body parsing
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Created uploads directory at:", uploadDir);
}

app.use('/', express.static(path.join(__dirname, '/public')))   //allow app use use resources from public folder

app.use('/api/generators', require('./routes/generator.route'));
app.use('/api/parts', require('./routes/part.route'));

app.get("/", (req,res) => {                                     //when someone visits, respond with testing quote
    res.send("Server is ready");
    })

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  //start server and listen on port
app.use((req, res) => res.status(404).json({ error: '404 Not Found' }));    //catch 404 issues
