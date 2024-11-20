const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Ad = require('../../models/Ad');
const authMiddleware = require('../../middleware/authMiddleware');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');
const ResponseService = require('../../services/responses');
const daysBetweenDates = require('../../utils/days_from_dates');
const Product = require('../../models/Product');

// Create a new ad
router.post('/create', authMiddleware, async (req, res) => {
    const userId = req.user.userId
  
  const { product_id, duration_from, duration_to, country, state, city } = req.body;
  
  if(product_id == null){
    return ResponseService.badRequest(res, 'Invalid product');
  }
  if(duration_from == null){
    return ResponseService.badRequest(res, 'Date duration from is required');
  }
  if(duration_to == null){
    return ResponseService.badRequest(res, 'Date duration to is required');
  }
  if(country == null){
    return ResponseService.badRequest(res, 'Country is required');
  }

  //check product
  const product = await Product.findById(product_id)
  if(!product){
    return ResponseService.badRequest(res, 'Product not found');
  }
  if(product.status != 1){
    return ResponseService.badRequest(res, 'Only approved product can be used as advert');
  }


  const days_ = daysBetweenDates(duration_from, duration_to);
  const amount_ = 500*parseInt(days_);
  try {
    const newAd = new Ad({
      user_id: userId,
      product_id, 
      duration_from, 
      duration_to, 
      days: days_,
      country, 
      state, 
      city,
      amount: amount_
    });

    await newAd.save();
    return ResponseService.success(res, newAd, 'Ads created successfully but pending some actions');
  } catch (error) {
    return ResponseService.error(res, 'Error creating ads');
  }
});


// Get all ads by user
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;
  
    try {
      const ads = await Ad.find({ user_id: userId })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('product_id'); // Populate the ad data
  
      const totalAds = await Ad.countDocuments({ user_id: userId });
      const totalPages = Math.ceil(totalAds / limit);
  
      return ResponseService.success(res, {
        ads,
        currentPage: parseInt(page),
        totalPages,
        totalAds,
      }, 'Ads fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching ads');
    }
  });

// Get a single ad by ID
router.get('/:id', async (req, res) => {
    const adId = req.params.id;
  
    try {
      const ad = await Ad.findById(adId);
      if (!ad) {
        return ResponseService.notFound(res, 'Ad not found');
      }
  
      return ResponseService.success(res, ad, 'Ad fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching ad');
    }
  });

// Update an ad by ID. To approve, set status to 1, else 0. 2 to decline
router.patch('/:id/admin', adminAuthMiddleware, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ad) {
      return ResponseService.notFound(res, "Ad not found");
    }
    ResponseService.success(res, ad, "Ad updated");
  } catch (error) {
    ResponseService.error(res, error);
  }
});

// Delete an ad by ID
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const deletedAd = await Ad.findByIdAndDelete(req.params.id);
    if (!deletedAd) {
      return ResponseService.notFound(res, "Ad not found");
    }
    ResponseService.success(res, {}, "Ad deleted");
  } catch (error) {
    ResponseService.error(res, error);
  }
});

module.exports = router;
