// Using Mongoose to connect
const mongoose = require('mongoose');

// we need config package to bring in the string from the default.json
const config = require('config');

const db = config.get('mongoURI');

// mongoose.connect(db) with .then, BUT we want to use async await, newer standard
// asynchronous arrow function. try/catch in case of connection error (we would display an error msg)

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }); // await first, since mongoose.connect() returns a promise
        console.log('yo, MongoDB connected, fam...');
    } catch(err){
        console.log(err.message);
        // exit process with failure
        process.exit(1)
    }
}

// export this 
module.exports = connectDB;