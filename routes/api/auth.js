const express = require('express');

// Use Express router
const router = express.Router();
// use our custom middleware
const auth = require('../../middleware/auth'); // ..outside of api, ..outside of routes, into /middleware/auth
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

module.exports = router;