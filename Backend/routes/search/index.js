const express = require('express');
const router = express.Router();
const Ad= require('../../models/Ad');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Brand = require('../../models/Brand');
const authMiddleware = require('../../middleware/authMiddleware');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');
const ResponseService = require('../../services/responses');

// Search for products based on various criteria with pagination
router.get('/search_products', async (req, res) => {
  const { title, description, minPrice, maxPrice, country, state, city, category, sub_category, brand, page = 1, limit = 20 } = req.query;

  // Build the query object
  let query = {};
  
  if (title) {
    query.title = { $regex: title, $options: 'i' }; // Case-insensitive regex search
  }
  
  if (description) {
    query.description = { $regex: description, $options: 'i' }; // Case-insensitive regex search
  }
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = parseFloat(minPrice); // Minimum price
    }
    if (maxPrice) {
      query.price.$lte = parseFloat(maxPrice); // Maximum price
    }
  }
  
  if (country) {
    query.country = country;
  }
  
  if (state) {
    query.state = state;
  }

  if (city) {
    query.city = city;
  }

  if (category) {
    query.category = category;
  }
  
  if (sub_category) {
    query.sub_category = sub_category;
  }

  if (brand) {
    query.brand = brand;
  }

  try {
    // Calculate pagination parameters
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

      return ResponseService.success(res, { 
        products, 
        currentPage: parseInt(page), 
        totalPages, 
        totalProducts 
    }, 'Products fetched successfully');

  } catch (error) {
    return ResponseService.error(res, 'Error fetching products');
  }
});


// Search for sellers
router.get('/search_sellers', async (req, res) => {
  const { first_name, last_name, shop_name, phone, country, city, state, shop_description } = req.query;

  // Build the query object
  let query = {};
  
  if (first_name) {
    query.first_name = { $regex: first_name, $options: 'i' }; // Case-insensitive regex search
  }
  
  if (last_name) {
    query.last_name = { $regex: last_name, $options: 'i' }; // Case-insensitive regex search
  }
  
  if (shop_name) {
    query.shop_name = { $regex: shop_name, $options: 'i' }; // Case-insensitive regex search
  }
  
  if (phone) {
    query.phone = { $regex: phone, $options: 'i' }; // Case-insensitive regex search
  }
  
  if (country) {
    query.country = { $regex: country, $options: 'i' }; // Case-insensitive regex search
  }
  
  if (state) {
    query.state = { $regex: state, $options: 'i' }; // Case-insensitive regex search
  }
  
  if (city) {
    query.city = { $regex: city, $options: 'i' }; // Case-insensitive regex search
  }
  
  if (shop_description) {
    query.shop_description = { $regex: shop_description, $options: 'i' }; // Case-insensitive regex search
  }

  try {

    const users = await User.find(query);
    return ResponseService.success(res, { 
        users, 
        currentPage: parseInt(page), 
        totalPages, 
        totalProducts 
    }, 'Users fetched successfully');

  } catch (error) {
    return ResponseService.error(res, 'Error fetching users');
  }
});

module.exports = router;

