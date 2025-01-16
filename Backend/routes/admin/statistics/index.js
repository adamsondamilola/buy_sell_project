const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../../../middleware/adminAuthMiddleware');
const User = require('../../../models/User');
const Product = require('../../../models/Product');
const DeletedAccount = require('../../../models/DeletedAccount');
const Category = require('../../../models/Category');
const Brand = require('../../../models/Brand');
const ResponseService = require('../../../services/responses');


//Products 
router.get('/products', adminAuthMiddleware, async (req, res) => {
    try {
      const totalProducts = await Product.countDocuments();
      const pendingProducts = await Product.countDocuments({ status: 0 });
      const approvedProducts = await Product.countDocuments({ status: 1 });
      const declinedProducts = await Product.countDocuments({ status: 2 });
  
      return ResponseService.success(res, {
        totalProducts,
        pendingProducts,
        approvedProducts,
        declinedProducts
      }, 'Products statistics fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching products');
    }
  });


//Users 
router.get('/users', adminAuthMiddleware, async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const blockedUsers = await User.countDocuments({ is_account_blocked: true });
      const activeUsers = await User.countDocuments({ is_account_blocked: false });
      const deletedUsers = await DeletedAccount.countDocuments();
  
      return ResponseService.success(res, {
        totalUsers,
        blockedUsers,
        activeUsers,
        deletedUsers
      }, 'Users statistics fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching users');
    }
  });

  //Shops 
router.get('/Shops', adminAuthMiddleware, async (req, res) => {
    try {
      const totalShops = await User.countDocuments({shop_name: {$ne: null}});  
      return ResponseService.success(res, {
        totalShops
      }, 'Shops statistics fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching shops');
    }
  });

  //Categories 
  router.get('/categories', adminAuthMiddleware, async (req, res) => {
    try {
      const totalCategories = await Category.countDocuments();  
      return ResponseService.success(res, {
        totalCategories
      }, 'Categories statistics fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching categories');
    }
  });

  //Brand 
  router.get('/brands', adminAuthMiddleware, async (req, res) => {
    try {
      const totalBrands = await Brand.countDocuments();  
      return ResponseService.success(res, {
        totalBrands
      }, 'Brands statistics fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching brands');
    }
  });


  module.exports = router;
