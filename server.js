// Simple Express server (connection logic is inside db.js)
const express = require('express');
// add in database connection config
const connectDB = require('./config/db');

// Initialize app variable with Express
const app = express();

// Connect to database
connectDB();

// test endpoint
app.get('/', (req, res) => res.send('API running'));

// listen on a port (put port in a variable) Heroku will look here for env variable (default to 5000 for local dev)
const PORT = process.env.PORT || 5000;

// listen on a port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); // call back just to "do sth" on connection. backticks for template literal
