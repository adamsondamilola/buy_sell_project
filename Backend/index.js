const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json()); 

//import env 
require('dotenv').config();

//Import Routes 
const loginRoute = require('./routes/auth/login');
const signupRoute = require('./routes/auth/signup');
const passwordRequestRoute = require('./routes/auth/password_reset')
app.use('/api/auth', loginRoute); 
app.use('/api/auth', signupRoute);
app.use('/api/auth', passwordRequestRoute);

const dbUri = process.env.CONNECTION_STRING;
mongoose.connect(dbUri)
    .then(() => { 
    console.log('DB Connected'); 
    }).catch((err) => { 
    console.error('DB Connection error', err); 
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Running on port ${process.env.PORT}`)
})