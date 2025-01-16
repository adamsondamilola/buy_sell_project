const express = require('express');
const router = express.Router();
const SellerReview = require('../../models/SellerReview');
const authMiddleware = require('../../middleware/authMiddleware')
const ResponseService = require('../../services/responses');
const User = require('../../models/User');

// Create a new review
router.post('/create', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const { seller_id, star, review } = req.body;

    //check seller
    const seller = await User.findById({_id:seller_id});
    //const reviews = await SellerReview.Find(seller_id);
    const totalRating = seller.rating ?? 5;
    if(!seller){
        return ResponseService.badRequest(res, 'Seller not found');
    }
    if(review == null){
        return ResponseService.badRequest(res, 'Details of your review is required');
    }
    if(review.length > 1000){
        return ResponseService.badRequest(res, 'Details of your review too long');
    }

    //check star
    if(parseInt(star) < 1){
        return ResponseService.badRequest(res, 'Kindly rate seller between 1 to 5 stars');
    }
    if(parseInt(star) > 5){
        return ResponseService.badRequest(res, 'Kindly rate seller between 1 to 5 stars');
    }
    
    //Update rating
    let ratingAverage = parseInt(totalRating) + parseInt(star)
    ratingAverage = ratingAverage/2;
    
    seller.rating =ratingAverage;
    seller.updatedAt = new Date();
    await seller.save();
    
    try {
      const newSellerReview = new SellerReview({
        user_id: userId,
        seller_id,
        star,
        review
      });
  
      await newSellerReview.save();
      return ResponseService.success(res, newSellerReview, 'Review added successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error adding review');
    }
  });

  // Get all reviews by user Id
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;  
    try {
      const reviews = await SellerReview.find({user_id: userId})
        .sort({ createdAt: -1 })
.skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('seller_id'); 
  
      const totalSellerReviews = await SellerReview.countDocuments({user_id: userId});
      const totalPages = Math.ceil(totalSellerReviews / limit);
  
      return ResponseService.success(res, {
        reviews,
        currentPage: parseInt(page),
        totalPages,
        totalSellerReviews,
      }, 'Reviews fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching reviews');
    }
  });

  // Delete a review
router.delete('/:id', authMiddleware, async (req, res) => {
    const reviewId = req.params.id;
    const userId = req.user.userId;
    try {
      const review = await SellerReview.findById(reviewId);
      if (!review) {
        return ResponseService.notFound(res, 'Review not found');
      }

      //check if user own review
      if(review.user_id != userId){
        return ResponseService.notFound(res, 'You cannot delete a review you did not created');
      }
  
      await review.remove();
      return ResponseService.success(res, {}, 'Review removed successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error removing review');
    }
  });
  
  module.exports = router;