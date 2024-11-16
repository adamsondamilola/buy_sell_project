const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const ResponseService = require('../../services/responses');

// Get all products
router.get('/goods', async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
  try {
    const products = await Product.find({status: 1})
    .skip((page - 1) * limit) 
    .limit(parseInt(limit));
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    return ResponseService.success(res, { products, 
        currentPage: parseInt(page), 
        totalPages, 
        totalProducts 
    }, 'Products fetched successfully');

  } catch (error) {
    return ResponseService.error(res, 'Error fetching products');
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return ResponseService.notFound(res, 'Product not found');
    }

    return ResponseService.success(res, product, 'Product fetched successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error fetching product');
  }
});