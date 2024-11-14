const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json()); 

//Import Routes 
const loginRoute = require('./routes/auth/login');
const signupRoute = require('./routes/auth/signup');
app.use('/api/auth', loginRoute); 
app.use('/api/auth', signupRoute);

const dbName = 'BuyerSeller';
const dbUri = `mongodb+srv://qwertydB:xVysF3AXRiftcGOo@cluster0.pikg5.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
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