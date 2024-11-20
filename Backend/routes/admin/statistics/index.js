const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../../../middleware/adminAuthMiddleware');
const User = require('../../../models/User');
const Product = require('../../../models/Product');
const DeletedAccount = require('../../../models/DeletedAccount');
const Ad = require('../../../models/Ad');
const Transaction = require('../../../models/Transaction');
const Category = require('../../../models/Category');
const Brand = require('../../../models/Brand');
const ResponseService = require('../../../services/responses');

//Transactions 
router.get('/transactions', adminAuthMiddleware, async (req, res) => {
    try {
      const totalTransactions = await Transaction.countDocuments();
      const pendingTransactions = await Transaction.countDocuments({ status: 0 });
      const approvedTransactions = await Transaction.countDocuments({ status: 1 });
      const declinedTransactions = await Transaction.countDocuments({ status: 2 });
  
      // Calculate totals
      const amountTotal = await Transaction.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      const amountPaid = await Transaction.aggregate([
        { $match: { status: 1 } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      const amountDeclined = await Transaction.aggregate([
        { $match: { status: 2 } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      const amountPending = await Transaction.aggregate([
        { $match: { status: 0 } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
  
      return ResponseService.success(res, {
        totalTransactions,
        pendingTransactions,
        approvedTransactions,
        declinedTransactions,
        amountTotal: amountTotal[0] ? amountTotal[0].total : 0,
        amountPaid: amountPaid[0] ? amountPaid[0].total : 0,
        amountDeclined: amountDeclined[0] ? amountDeclined[0].total : 0,
        amountPending: amountPending[0] ? amountPending[0].total : 0,
      }, 'Transactions statistics fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching transactions');
    }
  });

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


  //Adverts 
router.get('/ads', adminAuthMiddleware, async (req, res) => {
    try {
      const totalAds = await Ad.countDocuments();
      const pendingAds = await Ad.countDocuments({ status: 0 });
      const approvedAds = await Ad.countDocuments({ status: 1 });
      const declinedAds = await Ad.countDocuments({ status: 2 });
  
      return ResponseService.success(res, {
        totalAds,
        pendingAds,
        approvedAds,
        declinedAds
      }, 'Ads statistics fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching ads');
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
