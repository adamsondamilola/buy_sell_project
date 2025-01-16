const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: true });
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

const app = express();

const limiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, // 15 minutes 
    max: 100 // limit each IP to 100 requests per windowMs 
});

//app.use(limiter); //uncomment to apply api call limits
app.use(helmet());
app.use(bodyParser.json()); 

// Import env 
require('dotenv').config();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/files", express.static(path.join(__dirname, "uploads")));

//app.use(cors(corsConfig)); // Use CORS with the specified configuration
app.use(cors()); // enable all routes
const server = http.createServer(app);

// Configure Passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Save user information (e.g., to the database)
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware
app.use(
  session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Import Routes 
const loginRoute = require('./routes/auth/login');
const signupRoute = require('./routes/auth/signup');
const passwordRequestRoute = require('./routes/auth/password_reset');
const verifyEmailRequestRoute = require('./routes/auth/verify_email');
const userUpdateRequestRoute = require('./routes/user/update');
const userProfileRoute = require('./routes/user/profile');
const userFavoriteRoute = require('./routes/user/favorite');
const reportSellerRoute = require('./routes/user/report_seller');
const reviewSellerRoute = require('./routes/user/review_seller');
const locationRoute = require('./routes/user/location');
const productRoute = require('./routes/sell/product');
const categoryRoute = require('./routes/sell/category');
const subCategoryRoute = require('./routes/sell/sub_category');
const brandRoute = require('./routes/sell/brand');
const storeFrontRoute = require('./routes/store-front/store');
const searchRoute = require('./routes/search/index');
const sellerReviewRoute = require('./routes/seller/review');
const verificationRoute = require('./routes/seller/verification');

const adminProductRoute = require('./routes/admin/products/index');
const adminUserRoute = require('./routes/admin/users/index');
const adminStatisticsRoute = require('./routes/admin/statistics/index');

app.use('/api/auth', loginRoute); 
app.use('/api/auth', signupRoute);
app.use('/api/auth', verifyEmailRequestRoute);
app.use('/api/auth', passwordRequestRoute);
app.use('/api/user/update', userUpdateRequestRoute);
app.use('/api/user/profile', userProfileRoute);
app.use('/api/user/favorite', userFavoriteRoute);
app.use('/api/user/report', reportSellerRoute);
app.use('/api/user/review', reviewSellerRoute);
app.use('/api/user/location', locationRoute);
app.use('/api/sell/product', productRoute);
app.use('/api/sell/category', categoryRoute);
app.use('/api/sell/sub-category', subCategoryRoute);
app.use('/api/sell/brand', brandRoute);
app.use('/api/store', storeFrontRoute);
app.use('/api/search', searchRoute);
app.use('/api/seller/review', sellerReviewRoute);
app.use('/api/seller/verification', verificationRoute);
app.use('/api/admin/product', adminProductRoute);
app.use('/api/admin/user', adminUserRoute);
app.use('/api/admin/statistics', adminStatisticsRoute);

const dbUri = process.env.CONNECTION_STRING;
mongoose.connect(dbUri, { serverSelectionTimeoutMS: 30000 })
    .then(() => { 
    console.log('DB Connected'); 
    }).catch((err) => {
    console.log('DB Connection error', err); 
    });

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
