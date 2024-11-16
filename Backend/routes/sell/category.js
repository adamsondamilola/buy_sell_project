const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');
const ResponseService = require('../../services/responses');
const upload = require('../../middleware/imageUploadMiddleware'); 

// Create a new category
router.post('/create', adminAuthMiddleware, upload.single('image'), async (req, res) => {
  const { category, sub_categories, description } = req.body;

  // Handle image file path
  const image = req.file ? req.file.path : null;

  try {
    const newCategory = new Category({
      category,
      sub_categories,
      description,
      image
    });

    await newCategory.save();
    return ResponseService.success(res, newCategory, 'Category created successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error creating category');
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    return ResponseService.success(res, categories, 'Categories fetched successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error fetching categories');
  }
});

// Get a single category by ID
router.get('/:id', async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await Category.findById(categoryId);
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
  const { category, sub_categories, description } = req.body;

  // Handle image file path
  const image = req.file ? req.file.path : null;

  try {
    const categoryToUpdate = await Category.findById(categoryId);
    if (!categoryToUpdate) {
      return ResponseService.notFound(res, 'Category not found');
    }

    // Update category fields
    categoryToUpdate.category = category || categoryToUpdate.category;
    categoryToUpdate.sub_categories = sub_categories || categoryToUpdate.sub_categories;
    categoryToUpdate.description = description || categoryToUpdate.description;
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
    const category = await Category.findById(categoryId);
    if (!category) {
      return ResponseService.notFound(res, 'Category not found');
    }

    // Remove associated image if exists
    if (category.image) {
      fs.unlink(category.image, (err) => {
        if (err) {
          console.error(`Error deleting file ${category.image}:`, err.message);
        }
      });
    }

    await category.remove();
    return ResponseService.success(res, {}, 'Category and associated image deleted successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error deleting category');
  }
});

module.exports = router;
