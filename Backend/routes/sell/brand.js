const express = require('express');
const router = express.Router();
const Brand = require('../../models/Brand');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');
const ResponseService = require('../../services/responses');
const upload = require('../../middleware/imageUploadMiddleware'); 
const fs = require('fs');
const formatFilePath = require('../../utils/formatFilePath');
// Create a new brand
router.post('/create', adminAuthMiddleware, upload.single('image'), async (req, res) => {
  const { category_id, category_name, name } = req.body;

  // Handle image file path
  const image = req.file ? formatFilePath(req.file.path) : null;

  const cat = await Brand.findOne({name: name, category_id: category_id});
  if(cat){
    return ResponseService.badRequest(res, 'Brand name already exists for category');
  }

  try {
    const newBrand = new Brand({
      category_id,
      category_name,
      name,
      image
    });

    await newBrand.save();
    return ResponseService.success(res, newBrand, 'Brand created successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error creating brand');
  }
});

// Get all brands
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find();
    return ResponseService.success(res, brands, 'Brands fetched successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error fetching brands');
  }
});

// Get brands by category ID
router.get('/category/:id', async (req, res) => {
  const catId = req.params.id;

  try {
    const brand = await Brand.find({category_id: catId});
    if (!brand) {
      return ResponseService.notFound(res, 'Brand not found');
    }
    return ResponseService.success(res, brand, 'Brand fetched successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error fetching brand');
  }
});

// Get a single brand by ID
router.get('/:id', async (req, res) => {
  const brandId = req.params.id;

  try {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return ResponseService.notFound(res, 'Brand not found');
    }

    return ResponseService.success(res, brand, 'Brand fetched successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error fetching brand');
  }
});

// Update a brand
router.put('/:id', adminAuthMiddleware, upload.single('image'), async (req, res) => {
  const brandId = req.params.id;
  const { category_id, category_name, name } = req.body;

  // Handle image file path
  const image = req.file ? formatFilePath(req.file.path) : null;

  try {
    const brandToUpdate = await Brand.findById(brandId);
    if (!brandToUpdate) {
      return ResponseService.notFound(res, 'Brand not found');
    }

    // Update brand fields
    brandToUpdate.category_id = category_id || brandToUpdate.category_id;
    brandToUpdate.category_name = category_name || brandToUpdate.category_name;
    brandToUpdate.name = name || brandToUpdate.name;
    brandToUpdate.image = image || brandToUpdate.image;
    brandToUpdate.updatedAt = new Date();

    await brandToUpdate.save();
    return ResponseService.success(res, brandToUpdate, 'Brand updated successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error updating brand');
  }
});

// Delete a brand and its image
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
  const brandId = req.params.id;

  try {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return ResponseService.notFound(res, 'Brand not found');
    }

    // Remove associated image if exists
    if (brand.image) {
      fs.unlink(brand.image, (err) => {
        if (err) {
          console.log(`Error deleting file ${brand.image}:`, err.message);
        }
      });
    }

    await Brand.deleteOne({_id: brandId});
    return ResponseService.success(res, {}, 'Brand and associated image deleted successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error deleting brand');
  }
});

module.exports = router;
