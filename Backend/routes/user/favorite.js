const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Favorite = require('../../models/Favorite');
const authMiddleware = require('../../middleware/authMiddleware')
const ResponseService = require('../../services/responses');

// Create a new favorite
router.post('/create', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const { product_id } = req.body;

    //check if already added
    const fav = await Favorite.findOne({user_id: userId, product_id: product_id});
    if(fav){
        return ResponseService.badRequest(res, 'Already added to favorite');
    }
    
    try {
      const newFavorite = new Favorite({
        user_id: userId,
        product_id
      });
  
      await newFavorite.save();
      return ResponseService.success(res, newFavorite, 'Favorite added successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error adding favorite');
    }
  });

  // Get all favorites by user Id
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;  
    try {
      const favorites = await Favorite.find({user_id: userId})
        .sort({ createdAt: -1 })
.skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('product_id'); 
  
      const totalFavorites = await Favorite.countDocuments({user_id: userId});
      const totalPages = Math.ceil(totalFavorites / limit);
  
      return ResponseService.success(res, {
        favorites,
        currentPage: parseInt(page),
        totalPages,
        totalFavorites,
      }, 'Favorites fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching favorites');
    }
  });

  // Delete a favorite
router.delete('/:id', authMiddleware, async (req, res) => {
    const productId = req.params.id;
    const userId = req.user.userId;
    try {
      const favorite = await Favorite.findOne({product_id:productId, user_id: userId});
      if (!favorite) {
        return ResponseService.notFound(res, 'Favorite not found');
      }
  
      await Favorite.DeleteOne({product_id:productId, user_id: userId});
      return ResponseService.success(res, {}, 'Favorite removed successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error removing favorite');
    }
  });
  
  module.exports = router;