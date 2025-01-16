const express = require('express');
const router = express.Router();
const SellerReview = require('../../models/SellerReview');
const authMiddleware = require('../../middleware/authMiddleware')
const ResponseService = require('../../services/responses');
const User = require('../../models/User');

  // Get logged in user profile
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    try {

        const user = await User.findById(userId); 
        if(user){
            return ResponseService.success(res, {user}, 'User profile fetched successfully');
        }
        else{
            return ResponseService.badRequest(res, 'Profile not found');
        }
    
    } catch (error) {
      return ResponseService.error(res, 'Error fetching profile');
    }
  });
  
  router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({username}); 
        if(user){
            return ResponseService.success(res, {user}, 'User profile fetched successfully');
        }
        else{
            return ResponseService.badRequest(res, 'Account not found');
        }
    
    } catch (error) {
      return ResponseService.error(res, 'Error fetching profile');
    }
  });

  
  module.exports = router;