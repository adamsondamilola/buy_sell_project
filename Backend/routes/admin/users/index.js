const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const adminAuthMiddleware = require('../../../middleware/adminAuthMiddleware');
const User = require('../../../models/User');
const Product = require('../../../models/Product');
const DeletedAccount = require('../../../models/DeletedAccount');
const Ad = require('../../../models/Ad');

// Update anything on user table
router.patch('/:id', adminAuthMiddleware, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!user) {
        return ResponseService.notFound(res, "User not found");
      }
      ResponseService.success(res, product, "User updated");
    } catch (error) {
      ResponseService.error(res, error);
    }
  });


  // Block user
router.get('/:id/block', adminAuthMiddleware, async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return ResponseService.notFound(res, "User not found");
      }
      
      //update
      user.is_account_blocked = true;
      await user.save();

      //clear cookies
      res.clearCookie('token');

      ResponseService.success(res, product, "User blocked");
    } catch (error) {
      ResponseService.error(res, error);
    }
  });

  //list users
  router.get('/', adminAuthMiddleware, async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
  
    try {
      const users = await User.find()
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const totalUsers = await User.countDocuments();
      const totalPages = Math.ceil(totalUsers / limit);
  
      return ResponseService.success(res, {
        users,
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
      }, 'Users fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching users');
    }
  });

  //list users with shop name
  router.get('/shops', adminAuthMiddleware, async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
  
    try {
        //check if shop name is not null
      const users = await User.find({shop_name: { $ne: null }})
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const totalUsers = await User.countDocuments({shop_name: { $ne: null }});
      const totalPages = Math.ceil(totalUsers / limit);
  
      return ResponseService.success(res, {
        users,
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
      }, 'Users fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching users');
    }
  });

// Get all blocked users
router.get('/blocked', adminAuthMiddleware, async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
  
    try {
      const users = await User.find({is_account_blocked: true})
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const totalUsers = await User.countDocuments({is_account_blocked: true});
      const totalPages = Math.ceil(totalUsers / limit);
  
      return ResponseService.success(res, {
        users,
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
      }, 'Users fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching users');
    }
  });

//delete users
router.delete('/:id/user/delete', adminAuthMiddleware, async (req, res) => {
    const userId = req.params.id;
    try {

        const user = await User.findById(userId);
        if(!user){
            return ResponseService.notFound(res, 'User not found');
        }

        //delete picture
        user.picture.forEach((imagePath) => { 
            fs.unlink(imagePath, (err) => { 
                if (err) { 
                console.error(`Error deleting file ${imagePath}:`, err.message); 
            } 
            }); 
            }); 

            //delete cover picture
        user.cover_picture.forEach((imagePath) => { 
            fs.unlink(imagePath, (err) => { 
                if (err) { 
                console.error(`Error deleting file ${imagePath}:`, err.message); 
            } 
            }); 
            }); 


      //delete products      
      const products = await Product.find({user_id: userId});
      if (products.length > 0) {        

      // Loop through each product and delete it 
      for (const product of products) { 
        // Remove images associated with the product 
        product.images.forEach((imagePath) => { 
            fs.unlink(imagePath, (err) => { 
                if (err) { 
                console.error(`Error deleting file ${imagePath}:`, err.message); 
            } 
            }); 
            }); 
            // Delete the product from the database 
            await product.remove(); 
      }
    }

    //delete Ads
    const ads = await Ad.find({user_id: userId});
    if(ads.length > 0){
        for (const ad of ads){
            await ad.remove();
        }
    }

    // Create a record in DeletedAccount model 
    await DeletedAccount.create({ 
        user_id: user._id, 
        email: user.email, 
        name: `${user.first_name} ${user.last_name}`, 
        reason: req.body.reason 
        });

        // Delete the user account 
    await user.remove();

      return ResponseService.success(res, {}, 'Account deleted successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error deleting product');
    }
  });
  
  module.exports = router;