const { JsonWebTokenError } = require('jsonwebtoken');

const jwt = require('jsonwebtoken');
const config = require('config'); // bring in our config bc we need the secret

// exporting a middleware function which accesses request & response objects. next is a callback which will move us on when we are done
module.exports = function(req, res, next){
    // gets token from header of request object
    const token = req.header('x-auth-token'); // request obj has a header property

    // check if no token
    if(!token){
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }

    // Verify token if there is one
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); // jwt will decode the token which we get from our config
        if(typeof(decoded) === 'object'){
            console.log("you were right, type of decoded is " + typeof(decoded));

        } else {
            console.log("type of decoded is " + typeof(decoded));
        };
        console.log("default value of req.user is " + req.user);

        req.user = decoded.user; // assign a value to request obj's user. we set this in the payload (routes dir, users.js w/MongoDB id).
        console.log("new value of req.user is " + req.user);
        next();
    } catch (err){
        res.status(401).json({ msg: 'Token is not valid' }); // runs if the token is not valid
    }

};