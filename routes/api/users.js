const express = require('express');

// Use Express router
const router = express.Router();

// no "app.get", instead "router"
// type of req and endpoint:
// @route POST api/users 
// @desc Register user -- we need to send name, email ,and password
// @access Public (no token needed)
router.post('/', (req, res) => {
    console.log(req.body);
    res.send('User route')
}); // test route, set up in server.js (defined routes section). We will POST req to create new users


module.exports = router;