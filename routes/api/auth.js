const express = require('express');

// Use Express router
const router = express.Router();

// no "app.get", instead "router"
// type of req and endpoint:
// @route GET api/auth 
// @desc Test route
// @access Public (no token needed)
router.get('/', (req, res) => res.send('auth test route')); // test route

module.exports = router;