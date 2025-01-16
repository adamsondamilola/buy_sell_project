const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');
const ResponseService = require('../../services/responses');
const upload = require('../../middleware/imageUploadMiddleware'); 
const SubCategory = require('../../models/SubCategory');
const fs = require('fs');
const formatFilePath = require('../../utils/formatFilePath');
// Create a new category
router.post('/create', adminAuthMiddleware, upload.single('image'), async (req, res) => {
  const { name, description, order } = req.body;

  // Handle image file path
  const image = req.file ? formatFilePath(req.file.path) : null;

  const cat = await Category.findOne({name: name});
  if(cat){
    return ResponseService.badRequest(res, 'Category already exists');
  }

  try {
    const newCategory = new Category({
      name,
      description,
      order,
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
    // Fetch all categories and subcategories
    const categories = await Category.find().lean(); // Find all categories
    const subCategories = await SubCategory.find().lean(); // Find all sub-categories

    // Sort categories by their `order` field
    const sortedCategories = categories.sort((a, b) => a.order - b.order);

    // Map categories and associate sorted subcategories
    const result = sortedCategories.map(category => {
      // Filter and sort subcategories by `order` field
      //const categorySubCategories = subCategories.filter(sub => sub.category_id.toString() === category._id.toString()).sort((a, b) => a.order - b.order);
      const categorySubCategories = subCategories.filter(sub => sub.category_id.toString() === category._id.toString());

      return { ...category, subCategories: categorySubCategories };
    });

    // Send the result
    return ResponseService.success(res, result, 'Categories fetched successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error fetching categories');
  }
});


// Get all categories with pagination
router.get('/all/paginate', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters, with default values

    const categories = await Category.find()
      .sort({ createdAt: -1 })
.skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const subCategories = await SubCategory.find().lean();

    const result = categories.map(category => {
      const categorySubCategories = subCategories.filter(sub => sub.category_id.toString() === category._id.toString());
      return { ...category, subCategories: categorySubCategories };
    });

    // Get total number of categories for pagination metadata
    const totalCategories = await Category.countDocuments();

    const pagination = {
      totalItems: totalCategories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCategories / limit),
      itemsPerPage: parseInt(limit)
    };

    return ResponseService.success(res, { result, pagination }, 'Categories fetched successfully');
  } catch (error) {
    console.log('Error fetching categories:', error);
    return ResponseService.error(res, 'Error fetching categories');
  }
});

// Get a single category by ID
router.get('/:id', async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await Category.findById(categoryId).lean();
    if (!category) {
      return ResponseService.notFound(res, 'Category not found');
    }

    const subCategories = await SubCategory.find({ category_id: categoryId }).lean();
    
    // Combine category and subcategories
    const combinedCategory = {
      ...category,
      subCategories
    };

    return ResponseService.success(res, combinedCategory, 'Category fetched successfully');
  } catch (error) {
    console.log('Error fetching category:', error);
    return ResponseService.error(res, 'Error fetching category');
  }
});


// Update a category
router.put('/:id', adminAuthMiddleware, upload.single('image'), async (req, res) => {
  const categoryId = req.params.id;
  const { name, description, order } = req.body;

  // Handle image file path
  const image = req.file ? formatFilePath(req.file.path) : null;

  try {
    const categoryToUpdate = await Category.findById(categoryId);
    if (!categoryToUpdate) {
      return ResponseService.notFound(res, 'Category not found');
    }

    // Update category fields
    categoryToUpdate.name = name || categoryToUpdate.name;
    categoryToUpdate.description = description || categoryToUpdate.description;
    categoryToUpdate.order = order || categoryToUpdate.order;
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
          console.log(`Error deleting file ${category.image}:`, err.message);
        }
      });
    }
// Delete sub-categories associated with this category 
    await SubCategory.deleteMany({ category_id: categoryId }); 
    await category.remove();
    return ResponseService.success(res, {}, 'Category and associated image deleted successfully');
  } catch (error) {
    console.log(error)
    return ResponseService.error(res, 'Error deleting category');
  }
});

module.exports = router;
