// Simple Express server (connection logic is inside db.js)
const express = require('express');
// add in database connection config
const connectDB = require('./config/db');

// Initialize app variable with Express
const app = express();

// Connect to database
connectDB();

// Init Middleware -- now included w/express. so no more app.use(bodyParser.json())
// gets the data from users.js in req.body . In Postman software, we can send data (POST req) content type raw json.
app.use(express.json({ extended: false }))

// test endpoint
app.get('/', (req, res) => res.send('API running'));

// Define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

// listen on a port (put port in a variable) Heroku will look here for env variable (default to 5000 for local dev)
const PORT = process.env.PORT || 5000;

// listen on a port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); // call back just to "do sth" on connection. backticks for template literal
