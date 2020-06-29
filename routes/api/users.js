const express = require('express');

// Use Express router
const router = express.Router();

// no "app.get", instead "router"
// type of req and endpoint:
// @route GET api/users 
// @desc Test route
// @access Public (no token needed)
router.get('/', (req, res) => res.send('User route')); // test route, set up in server.js (defined routes section). We will POST req to create new users


module.exports = router;