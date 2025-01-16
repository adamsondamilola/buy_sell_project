const express = require('express');
const router = express.Router();
const SellerReview = require('../../models/SellerReview');
const ResponseService = require('../../services/responses');

  //Get all reviews by seller Id
  router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { page = 1, limit = 20 } = req.query;  
    try {
      const reviews = await SellerReview.find({seller_id: userId})
        .sort({ createdAt: -1 })
.skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('user_id'); 
  
        const totalStars_ = await SellerReview.aggregate([
            { $match: { seller_id: userId } },
            { $group: { _id: null, total: { $sum: "$stars" } } }
          ]);
        const totalStars = totalStars_[0] ? totalStars_[0].total : 0;

      const totalSellerReviews = await SellerReview.countDocuments({seller_id: userId});
      const totalPages = Math.ceil(totalSellerReviews / limit);
      let averageStar = parseFloat(totalStars)/parseFloat(totalSellerReviews)
  
      return ResponseService.success(res, {
        reviews,
        averageStar,
        currentPage: parseInt(page),
        totalPages,
        totalSellerReviews,
      }, 'Reviews fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching reviews');
    }
  });

  module.exports = router;