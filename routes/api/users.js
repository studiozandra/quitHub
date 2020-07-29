const express = require('express');

// Use Express router
const router = express.Router();

// Validate user's entered data (rules on express-validator at github)
const { check, validationResult } = require('express-validator');

// no "app.get", instead "router"
// type of req and endpoint:
// @route POST api/users 
// @desc Register user -- we need to send name, email, and password in order to register users
// @access Public (no token needed)
router.post('/', [
    check('name', 'Name is required').not().isEmpty(), 
    check('email', 'Please include a valid email').isEmail(), 
    check('password', 'Please enter a password with 6 or more chars').isLength({ min: 6 })
    ], 
    (req, res) => {
    const errors = validationResult(req);
    // console.log(req.body);
    // if there are errors
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }) // a 400 is bad request
    }
    console.log(req.body);
    res.send('User route')
}); // test route, set up in server.js (defined routes section). We will POST req to create new users


module.exports = router;