const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const User = require('../../models/User');
const ResponseService = require('../../services/responses');
const geoip = require('geoip-lite');
const axios = require('axios');
const os = require('os');

// Get all products
router.get('/', async (req, res) => {
  const { page = 1, limit = 20, search, title, city, state, country, category, sub_category, condition, brand } = req.query;

  try {
    const searchQuery = {
      status: 1,
      ...(search && {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { sub_category: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { state: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { condition: { $regex: search, $options: 'i' } },
        ],
      }),
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(city && { city: { $regex: city, $options: 'i' } }),
      ...(state && { state: { $regex: state, $options: 'i' } }),
      ...(country && { country: { $regex: country, $options: 'i' } }),
      ...(category && { category: { $regex: category, $options: 'i' } }),
      ...(sub_category && { sub_category: { $regex: sub_category, $options: 'i' } }),
      ...(condition && { condition: { $regex: condition, $options: 'i' } }),
      ...(brand && { brand: { $regex: brand, $options: 'i' } }),
    };

    const products = await Product.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .populate('user_id');

    const totalProducts = await Product.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalProducts / limit);

    return ResponseService.success(
      res,
      {
        products,
        currentPage: parseInt(page, 10),
        totalPages,
        totalProducts,
      },
      'Products fetched successfully'
    );

  } catch (error) {
    console.error('Error fetching products:', error);
    return ResponseService.error(res, 'Error fetching products');
  }
});

// Get all products by username
router.get('/:username/get-products-by-username', async (req, res) => {
    const username = req.params.username
  const { page = 1, limit = 20, search, title, city, state, country, category, sub_category, condition, brand } = req.query;
  
  const user = await User.findOne({username: username});
  if(!user) return ResponseService.error(res, 'Page not found');

  try {
    const searchQuery = {
      status: 1,
      user_id: user._id,
      ...(search && {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { sub_category: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { state: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { condition: { $regex: search, $options: 'i' } },
        ],
      }),
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(city && { city: { $regex: city, $options: 'i' } }),
      ...(state && { state: { $regex: state, $options: 'i' } }),
      ...(country && { country: { $regex: country, $options: 'i' } }),
      ...(category && { category: { $regex: category, $options: 'i' } }),
      ...(sub_category && { sub_category: { $regex: sub_category, $options: 'i' } }),
      ...(condition && { condition: { $regex: condition, $options: 'i' } }),
      ...(brand && { brand: { $regex: brand, $options: 'i' } }),
    }; 
    /*const searchQuery = {
          status: 1,
          user_id: user._id
        
    };*/

    const products = await Product.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .populate('user_id');

    const totalProducts = await Product.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalProducts / limit);

    return ResponseService.success(
      res,
      {
        products,
        currentPage: parseInt(page, 10),
        totalPages,
        totalProducts,
      },
      'Products fetched successfully'
    );

  } catch (error) {
    console.error('Error fetching products:', error);
    return ResponseService.error(res, 'Error fetching products');
  }
});




// Search products
router.get('/q/products', async (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query;
  const trimmedSearch = search.trim();
  
  try {
    let searchRegex = [];
    if (trimmedSearch) {
      const searchTokens = trimmedSearch.split(/\s+/); // Split search string into words
      searchRegex = searchTokens.map(token => new RegExp(token, 'i')); // Create regex for each word
    }

    // Build the search query
    const searchQuery = {
      status: 1, // Always filter products with `status: 1`
      ...(searchRegex.length > 0 && {
        $or: searchRegex.map(regex => ({
          $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
            { category: { $regex: regex } },
            { sub_category: { $regex: regex } },
            { brand: { $regex: regex } },
            { city: { $regex: regex } },
            { state: { $regex: regex } },
            { country: { $regex: regex } },
            { condition: { $regex: regex } },
          ],
        })),
      }),
    };

    // Fetch paginated products
    const products = await Product.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .populate('user_id');

    // Total count for pagination
    const totalProducts = await Product.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalProducts / limit);

    // Respond with products and pagination info
    return ResponseService.success(
      res,
      {
        products,
        currentPage: parseInt(page, 10),
        totalPages,
        totalProducts,
      },
      'Products fetched successfully'
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return ResponseService.error(res, 'Error fetching products');
  }
});


// Get a single product by ID
router.get('/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.find({_id: productId, status: 1}).populate('user_id');
    if (!product) {
      return ResponseService.notFound(res, 'Product not found');
    }

    return ResponseService.success(res, product, 'Product fetched successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error fetching product');
  }
});


// Endpoint to get location from IP
router.get('/get/geo', async (req, res) => {
  try {
      // Get the IP address (either from request or an external service)
      let ip = req.ip || (await axios.get('https://api.ipify.org?format=json')).data.ip;
      //const ip = networkInterfaces['eth0'] ? networkInterfaces['eth0'][0].address : 'IP not found';
      const networkInterfaces = os.networkInterfaces()
      // Lookup the country information using geoip-lite
      const geo = geoip.lookup(ip);

      if (geo) {
  return ResponseService.success(res,{ geo },"Geo location details");
      } else {
          return ResponseService.notFound(res, 'Country information not found');
      }
  } catch (error) {
      return ResponseService.error(res, 'Error fetching product');
  }
});

module.exports = router;