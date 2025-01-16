const express = require('express');
const router = express.Router();
const SubCategory = require('../../models/SubCategory');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');
const ResponseService = require('../../services/responses');
const upload = require('../../middleware/imageUploadMiddleware'); 
const fs = require('fs');
const formatFilePath = require('../../utils/formatFilePath');
// Create a new category
router.post('/create', adminAuthMiddleware, upload.single('image'), async (req, res) => {
  const {category_id, name, description, properties } = req.body;

  // Handle image file path
  const image = req.file ? formatFilePath(req.file.path) : null;

  const cat = await SubCategory.findOne({name: name, category_id: category_id});
  if(cat){
    return ResponseService.badRequest(res, 'Sub-category already exists for selected category');
  }

  try {
    const newSubCategory = new SubCategory({
      category_id,
      name,
      description,
      properties,
      image
    });

    await newSubCategory.save();
    return ResponseService.success(res, newSubCategory, 'Category created successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error creating category');
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await SubCategory.find();
    return ResponseService.success(res, categories, 'Categories fetched successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error fetching categories');
  }
});

// Get a single category by ID
router.get('/:id', async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await SubCategory.findById(categoryId);
    if (!category) {
      return ResponseService.notFound(res, 'Category not found');
    }

    return ResponseService.success(res, category, 'Category fetched successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error fetching category');
  }
});

// Update a category
router.put('/:id', adminAuthMiddleware, upload.single('image'), async (req, res) => {
  const categoryId = req.params.id;
  const { name, description, properties } = req.body;

  // Handle image file path
  const image = req.file ? formatFilePath(req.file.path) : null;

  try {
    const categoryToUpdate = await SubCategory.findById(categoryId);
    if (!categoryToUpdate) {
      return ResponseService.notFound(res, 'Category not found');
    }

    // Update category fields
    categoryToUpdate.name = name || categoryToUpdate.name;
    categoryToUpdate.description = description || categoryToUpdate.description;
    categoryToUpdate.properties = properties || categoryToUpdate.properties;
    categoryToUpdate.image = image || categoryToUpdate.image;
    categoryToUpdate.updatedAt = new Date();

    await categoryToUpdate.save();
    return ResponseService.success(res, categoryToUpdate, 'Category updated successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error updating category');
  }
});

// Delete a category and its image
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await SubCategory.findById(categoryId);
    if (!category) {
      return ResponseService.notFound(res, 'Category not found');
    }

    // Remove associated image if exists
    if (SubCategory.image) {
      fs.unlink(SubCategory.image, (err) => {
        if (err) {
          console.log(`Error deleting file ${SubCategory.image}:`, err.message);
        }
      });
    }

    await SubCategory.remove();
    return ResponseService.success(res, {}, 'Category and associated image deleted successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error deleting category');
  }
});

module.exports = router;
