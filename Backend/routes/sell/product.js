const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const User = require('../../models/User');
const authMiddleware = require('../../middleware/authMiddleware');
const ResponseService = require('../../services/responses');
const stringToSlug = require('../../utils/string_to_slug')
const upload = require('../../middleware/productImagesUploadMiddleware');
const fs = require('fs'); 
const path = require('path');

// Create a new product
router.post('/create', authMiddleware, upload.array('images', 5), async (req, res) => {
    const userId = req.user.userId

    //before posting products, a user must meet some conditions
    //conditions includes having a profile picture, shop name, and shop address
    const user = await User.findById(userId);
    if(user.picture == null){
        return ResponseService.badRequest(res, 'You must have a profile picture to start selling');
    }
    if(user.shop_name == null){
        return ResponseService.badRequest(res, 'You must have a shop name to start selling');
    }
    if(user.shop_address == null){
        return ResponseService.badRequest(res, 'You must have an address to start selling');
    }
  
  const { title, description, price, stock, category, sub_category, brand } = req.body;
  
  if(title == null){
    return ResponseService.badRequest(res, 'Title is required');
  }
  if(title.length > 150){
    return ResponseService.badRequest(res, 'Title too long. Should not be more than 150 characters');
  }
  if(description == null){
    return ResponseService.badRequest(res, 'Description is required');
  }
  if(description.length > 1500){
    return ResponseService.badRequest(res, 'Description too long. Should not be more than 1500 characters');
  }
  if(stock == null){
    return ResponseService.badRequest(res, 'Stock is required');
  }
  if(stock.length > 100){
    return ResponseService.badRequest(res, 'Invalid stock');
  }
  if(!isNaN(stock)){
    return ResponseService.badRequest(res, 'Invalid stock. Enter a valid number');
  }
  if(price == null){
    return ResponseService.badRequest(res, 'Price is required');
  }
  if(price.length > 100){
    return ResponseService.badRequest(res, 'Invalid price');
  }
  if(!isNaN(price)){
    return ResponseService.badRequest(res, 'Invalid price. Enter a valid amount');
  }
  if(category == null){
    return ResponseService.badRequest(res, 'Select a category');
  }
  if(category.length > 100){
    return ResponseService.badRequest(res, 'Invalid category');
  }
  if(sub_category != null && sub_category.length > 100){
    return ResponseService.badRequest(res, 'Invalid sub category');
  }
  if(sub_category != null && sub_category.length > 100){
    return ResponseService.badRequest(res, 'Invalid sub category');
  }
  if(brand != null && brand.length > 100){
    return ResponseService.badRequest(res, 'Invalid brand name');
  }
  // Check if images are uploaded 
  if (!req.files || req.files.length === 0) { 
    return ResponseService.badRequest(res, 'No images uploaded'); 
  }
  if (req.files.length < 2) { 
    return ResponseService.badRequest(res, 'Minimum of 2 images is required'); 
  }
  
  const slugGenerated = stringToSlug(title)
  
  const images = req.files.map(file => file.path);
  const image = images[0];
  try {
    const newProduct = new Product({
      user_id: userId,
      title,
      description,
      price,
      stock,
      category,
      sub_category,
      brand, 
      image,
      images,
      status: 0, //product must be approved before it goes life
      slug: slugGenerated
    });

    await newProduct.save();
    return ResponseService.success(res, newProduct, 'Product created successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error creating product');
  }
});

// Get all products by user
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.userId
    const { page = 1, limit = 20 } = req.query;
  try {
    const products = await Product.find({user_id: userId})
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

// Update a product
router.put('/:id', authMiddleware, async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.userId;
  const { title, description, price, stock, category, sub_category, brand } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return ResponseService.notFound(res, 'Product not found');
    }

    //check if user own product
    if(product.user_id != userId){
        return ResponseService.badRequest(res, 'Unauthorized');
    }

    if(title == null){
        return ResponseService.badRequest(res, 'Title is required');
      }
      if(title.length > 150){
        return ResponseService.badRequest(res, 'Title too long. Should not be more than 150 characters');
      }
      if(description == null){
        return ResponseService.badRequest(res, 'Description is required');
      }
      if(description.length > 1500){
        return ResponseService.badRequest(res, 'Description too long. Should not be more than 1500 characters');
      }
      if(stock == null){
        return ResponseService.badRequest(res, 'Stock is required');
      }
      if(stock.length > 100){
        return ResponseService.badRequest(res, 'Invalid stock');
      }
      if(!isNaN(stock)){
        return ResponseService.badRequest(res, 'Invalid stock. Enter a valid number');
      }
      if(price == null){
        return ResponseService.badRequest(res, 'Price is required');
      }
      if(price.length > 100){
        return ResponseService.badRequest(res, 'Invalid price');
      }
      if(!isNaN(price)){
        return ResponseService.badRequest(res, 'Invalid price. Enter a valid amount');
      }
      if(category == null){
        return ResponseService.badRequest(res, 'Select a category');
      }
      if(category.length > 100){
        return ResponseService.badRequest(res, 'Invalid category');
      }
      if(sub_category != null && sub_category.length > 100){
        return ResponseService.badRequest(res, 'Invalid sub category');
      }
      if(sub_category != null && sub_category.length > 100){
        return ResponseService.badRequest(res, 'Invalid sub category');
      }
      if(brand != null && brand.length > 100){
        return ResponseService.badRequest(res, 'Invalid brand name');
      }


    // Update product fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.sub_category = sub_category || product.sub_category;
    product.brand = brand || product.brand; 
    product.updatedAt = new Date();

    await product.save();
    return ResponseService.success(res, product, 'Product updated successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error updating product');
  }
});

// Delete a product
router.delete('/:id', authMiddleware, async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.userId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return ResponseService.notFound(res, 'Product not found');
    }
    //check if user own product
    if(product.user_id != userId){
        return ResponseService.badRequest(res, 'Unauthorized');
    }

    // Remove images associated with product 
    product.images.forEach((imagePath) => 
        { fs.unlink(imagePath, (err) => { 
            if (err) { 
                console.error(`Error deleting file ${imagePath}:`, err.message); 
            } 
        }); 
    });

    await product.remove();
    return ResponseService.success(res, {}, 'Product deleted successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error deleting product');
  }
});

module.exports = router;
