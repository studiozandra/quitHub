const express = require('express');

// Use Express router
const router = express.Router();
// use our custom middleware
const auth = require('../../middleware/auth'); // ..outside of api, ..outside of routes, into /middleware/auth

// no "app.get", instead "router"
// type of req and endpoint:
// @route GET api/auth 
// @desc Test route
// @access Public (no token needed)
router.get('/', auth, (req, res) => res.send('auth test route')); // test route. With middleware, we added 'auth,' as second parameter to make protected route.

module.exports = router;