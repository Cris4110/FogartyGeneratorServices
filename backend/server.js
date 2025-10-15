require('dotenv').config()              // Load environment variables from a .env file into process.env
const express = require('express')      // Import Express (web framework)
const app = express()                   // Create an Express application instance
const path = require('path')            // Read PORT from environment; fallback to 3500 if not set
const PORT = process.env.PORT || 3500

app.use('/', express.static(path.join(__dirname, '/public')))   //allow app use use resources from public folder


app.get("/", (req,res) => {                                     //when someone visits, respond with testing quote
    res.send("Server is ready");
    })

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  //start server and listen on port
app.use((req, res) => res.status(404).json({ error: '404 Not Found' }));    //catch 404 issues
