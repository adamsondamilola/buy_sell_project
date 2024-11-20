const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: true });
const helmet = require('helmet');

const app = express()

const limiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, // 15 minutes 
    max: 100 // limit each IP to 100 requests per windowMs 
    });

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json()); 
app.use(csrfProtection);

//import env 
require('dotenv').config();

//Import Routes 
const loginRoute = require('./routes/auth/login');
const signupRoute = require('./routes/auth/signup');
const passwordRequestRoute = require('./routes/auth/password_reset')
const userUpdateRequestRoute = require('./routes/user/update')
const productRoute = require('./routes/sell/product')
const categoryRoute = require('./routes/sell/category')
const brandRoute = require('./routes/sell/brand')
const storeFrontRoute = require('./routes/store-front/store')
const transactionRoute = require('./routes/wallet/transaction')
const adsRoute = require('./routes/ad/ads')
const searchRoute = require('./routes/search/index')

const adminProductRoute = require('./routes/admin/products/index')
const adminAdRoute = require('./routes/admin/ads/index')
const adminTransactionRoute = require('./routes/admin/transactions/index')
const adminUserRoute = require('./routes/admin/users/index')
const adminStatisticsRoute = require('./routes/admin/statistics/index')

app.use('/api/auth', loginRoute); 
app.use('/api/auth', signupRoute);
app.use('/api/auth', passwordRequestRoute);
app.use('/api/user/update', userUpdateRequestRoute);
app.use('/api/sell/product', productRoute);
app.use('/api/sell/category', categoryRoute);
app.use('/api/sell/brand', brandRoute);
app.use('/api/store', storeFrontRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/ad', adsRoute);
app.use('/api/search', searchRoute);
app.use('/api/admin/product', adminProductRoute);
app.use('/api/admin/ad', adminAdRoute);
app.use('/api/admin/transaction', adminTransactionRoute);
app.use('/api/admin/user', adminUserRoute);
app.use('/api/admin/statistics', adminStatisticsRoute);

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