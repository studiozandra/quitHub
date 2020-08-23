const express = require('express');

// Use Express router
const router = express.Router();

// bring in encryption module
const bcrypt = require('bcryptjs');

// use our custom middleware
const auth = require('../../middleware/auth'); // ..outside of api, ..outside of routes, into /middleware/auth
// Validate user's entered data (rules on express-validator at github)
const { check, validationResult } = require('express-validator');

// bring in jsonwebtoken and config file with secret
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');


// no "app.get", instead "router"
// type of req and endpoint:
// @route GET api/auth 
// @desc Test route
// @access Public (no token needed)
// router.get('/', auth, (req, res) => res.send('auth test route'));  Test route. With middleware, we added 'auth,' as second parameter to make protected route.

// the real route which returns user's data from the db
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // we already set this req.user in our middleware. we don't want to return the password, tho!
        res.json(user);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('server error, my bad');

    }
});

// To log in users slready in the database (copied similar Register New User code from users.js):
// no "app.get", instead "router"
// type of req and endpoint:
// @route POST api/auth 
// @desc Authenticate user and get token
// @access Public (no token needed -- they are getting a token here)
router.post('/', [ 
    check('email', 'Please include a valid email').isEmail(), 
    check('password', 'Password required, fam').exists()
    ], 
    async (req, res) => {
    const errors = validationResult(req);
    // console.log(req.body);
    // if there are errors
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // a 400 is bad request
    }
    console.log(req.body);

    const { email, password } = req.body;

    // instead of User.findOne().then().catch, we will use async(req, res) await, with try catch:
    try {  
        // See if user exists, MongoDB .findOne method takes an object
        let user = await User.findOne({ email });

        if (!user){
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] }); // bad request, usr doesn't exist. returns arr of errors
        }

        // bcrypt method .compare(plaintextEntry, encryptedDbEntry) -- compares plaintext and encrypted passwords to see if match; it returns a promise
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] }); // bad request, password doesn't match. returns arr of errors
        }

    
        // Return json webtoken -- sign it, pass in payload (check at jwt.io)
        // res.send('User registered Postman test message!')
        const payload = {
            user: {
                id: user.id
            }
        } // mongoose automatically handles MongoDB's _id to our .id

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
            if(err) throw err;
            res.json({ token });
        }); // expire is optional: 3600 is one hour, longer for testing; callback takes in a possible error then the token itself. if no error, send token back to client

    } catch(err) {
        console.log(err.message); // server errors logged out here
        res.status(500).send('Server error');  // all but the very last one need a return statement

    }

    
    }
); // test route, set up in server.js (defined routes section). We will POST req to create new users


module.exports = router;