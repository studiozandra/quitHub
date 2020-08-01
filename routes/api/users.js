const express = require('express');

// Use Express router
const router = express.Router();

// bring in Gravatar package
const gravatar = require('gravatar');

// bring in encryption module
const bcrypt = require('bcryptjs');

// Validate user's entered data (rules on express-validator at github)
const { check, validationResult } = require('express-validator');

// bring in jsonwebtoken and config file with secret
const jwt = require('jsonwebtoken');
const config = require('config');

// bring in the model, ../ up one level
const User = require('../../models/User'); 

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
    async (req, res) => {
    const errors = validationResult(req);
    // console.log(req.body);
    // if there are errors
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // a 400 is bad request
    }
    console.log(req.body);

    const { name, email, password } = req.body;

    // instead of User.findOne().then().catch, we will use async(req, res) await, with try catch:
    try {  
        // See if user exists
        let user = await User.findOne({ email });

        if (user){
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] }); // bad request, email already exists. returns arr of errors
        }

        // Get user's gravatar (runs if user is not already existing)
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        }) // s: default size, r: rating -- no nudity, etc, d: default gravatar icon

        // create an instance of a user (we will call user.save to save to db later)
        user = new User({
            name,
            email,
            avatar,
            password

        });


        // Encrypt password -- first create (generate) a salt, passing in 10 'rounds'
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // save new user, promise (again, await looks cleaner than .then())
        await user.save();


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