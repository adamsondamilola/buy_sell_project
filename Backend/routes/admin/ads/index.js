const express = require('express');
const router = express.Router();
const Ad = require('../../../models/Ad');
const adminAuthMiddleware = require('../../../middleware/adminAuthMiddleware');
const ResponseService = require('../../../services/responses');
const daysBetweenDates = require('../../../utils/days_from_dates');

// Create a new ad
router.post('/create', adminAuthMiddleware, async (req, res) => {
  
  const {user_id, product_id, duration_from, duration_to, country, state, city } = req.body;
  
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

  const days_ = daysBetweenDates(duration_from, duration_to);
  const amount_ = 500*parseInt(days_);
  try {
    const newAd = new Ad({
      user_id,
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


// Get all ads
router.get('/', adminAuthMiddleware, async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
  
    try {
      const ads = await Ad.find()
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('product_id'); // Populate the ad data
  
      const totalAds = await Ad.countDocuments();
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

// Get all pending ads
router.get('/pending', adminAuthMiddleware, async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
  
    try {
      const ads = await Ad.find({status: 0})
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('product_id'); // Populate the ad data
  
      const totalAds = await Ad.countDocuments({status: 0});
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

// Get all approved ads
router.get('/approved', adminAuthMiddleware, async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
  
    try {
      const ads = await Ad.find({status: 1})
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('product_id'); // Populate the ad data
  
      const totalAds = await Ad.countDocuments({status: 1});
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

// Get all declined ads
router.get('/declined', adminAuthMiddleware, async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
  
    try {
      const ads = await Ad.find({status: 2})
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('product_id'); // Populate the ad data
  
      const totalAds = await Ad.countDocuments({status: 2});
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

// Get all ads by user
router.get('/:userId/user', adminAuthMiddleware, async (req, res) => {
    const userId = req.params.userId;
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
