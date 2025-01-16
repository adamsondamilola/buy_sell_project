const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const adminAuthMiddleware = require('../../../middleware/adminAuthMiddleware');
const User = require('../../../models/User');
const VerificationDocument = require('../../../models/VerificationDocument');
const CurrentLocation = require('../../../models/CurrentLocation');
const Product = require('../../../models/Product');
const DeletedAccount = require('../../../models/DeletedAccount');
const ResponseService = require('../../../services/responses');
const fs = require('fs').promises;
const { Types } = require('mongoose');

// User details
router.get('/:id', adminAuthMiddleware, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return ResponseService.notFound(res, "User not found");
    }
    const docs = await VerificationDocument.findOne({user_id: userId});
    const location = await CurrentLocation.findOne({user_id: userId});
    ResponseService.success(res, {user, docs, location}, "User data");
  } catch (error) {
    ResponseService.error(res, error);
  }
});


// Update anything on user table
router.patch('/:id', adminAuthMiddleware, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!user) {
        return ResponseService.notFound(res, "User not found");
      }
      ResponseService.success(res, user, "User updated");
    } catch (error) {
      ResponseService.error(res, error);
    }
  });


  // Block user
router.get('/:id/block', adminAuthMiddleware, async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return ResponseService.notFound(res, "User not found");
      }
      
      //update
      user.is_account_blocked = true;
      await user.save();

      ResponseService.success(res, user, "User blocked");
    } catch (error) {
      ResponseService.error(res, error);
    }
  });

  //list users
  router.get('/', adminAuthMiddleware, async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
  
    try {
      const users = await User.find()
        .sort({ createdAt: -1 })
.skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const totalUsers = await User.countDocuments();
      const totalPages = Math.ceil(totalUsers / limit);
  
      return ResponseService.success(res, {
        users,
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
      }, 'Users fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching users');
    }
  });

  //list users with shop name
  router.get('/shops/list', adminAuthMiddleware, async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
  
    try {
        //check if shop name is not null
      const users = await User.find({shop_name: { $ne: null }})
        .sort({ createdAt: -1 })
.skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const totalUsers = await User.countDocuments({shop_name: { $ne: null }});
      const totalPages = Math.ceil(totalUsers / limit);
  
      return ResponseService.success(res, {
        users,
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
      }, 'Users fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching users');
    }
  });

// Get all blocked users
router.get('/blocked/list', adminAuthMiddleware, async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
  
    try {
      const users = await User.find({is_account_blocked: true})
        .sort({ createdAt: -1 })
.skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const totalUsers = await User.countDocuments({is_account_blocked: true});
      const totalPages = Math.ceil(totalUsers / limit);
  
      return ResponseService.success(res, {
        users,
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
      }, 'Users fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching users');
    }
  });

// Get all verified users
router.get('/verified/list', adminAuthMiddleware, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  try {
    const users = await User.find({is_user_verified: true})
      .sort({ createdAt: -1 })
.skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments({is_user_verified: true});
    const totalPages = Math.ceil(totalUsers / limit);

    return ResponseService.success(res, {
      users,
      currentPage: parseInt(page),
      totalPages,
      totalUsers,
    }, 'Users fetched successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error fetching users');
  }
});

// Get all unverified users
router.get('/not-verified/list', adminAuthMiddleware, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  try {
    const users = await User.find({is_user_verified: false})
      .sort({ createdAt: -1 })
.skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments({is_user_verified: false});
    const totalPages = Math.ceil(totalUsers / limit);

    return ResponseService.success(res, {
      users,
      currentPage: parseInt(page),
      totalPages,
      totalUsers,
    }, 'Users fetched successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error fetching users');
  }
});

//delete user verification docs
router.delete('/:id/docs', adminAuthMiddleware, async (req, res) => {
  const userId = req.params.id;

  if (!Types.ObjectId.isValid(userId)) {
    return ResponseService.badRequest(res, 'Invalid user ID');
  }

  const session = await User.startSession(); // Start a session for transactions
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      return ResponseService.notFound(res, 'User not found');
    }

    // Delete associated docs
    const doc = await VerificationDocument.findOne({ user_id: userId }).session(session);
    if (doc) {
      // Delete images
    if (Array.isArray(doc.id_back)) {
      await Promise.all(
        doc.id_back.map(async (imagePath) => {
          try {
            await fs.unlink(imagePath);
          } catch (err) {
            console.error(`Error deleting file ${imagePath}:`, err.message);
          }
        })
      );
    }
    if (Array.isArray(doc.id_front)) {
      await Promise.all(
        doc.id_front.map(async (imagePath) => {
          try {
            await fs.unlink(imagePath);
          } catch (err) {
            console.error(`Error deleting file ${imagePath}:`, err.message);
          }
        })
      );
    }
    if (Array.isArray(doc.face_image)) {
      await Promise.all(
        doc.face_image.map(async (imagePath) => {
          try {
            await fs.unlink(imagePath);
          } catch (err) {
            console.error(`Error deleting file ${imagePath}:`, err.message);
          }
        })
      );
    }
    if (Array.isArray(doc.face_smile_image)) {
      await Promise.all(
        doc.face_smile_image.map(async (imagePath) => {
          try {
            await fs.unlink(imagePath);
          } catch (err) {
            console.error(`Error deleting file ${imagePath}:`, err.message);
          }
        })
      );
    }
      await VerificationDocument.deleteOne({ user_id: userId }).session(session);
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return ResponseService.success(res, {}, 'Document deleted successfully');
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    console.error('Error deleting documents:', error.message);
    return ResponseService.error(res, 'Error deleting documents');
  }
});

//delete user by id
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
  const userId = req.params.id;

  if (!Types.ObjectId.isValid(userId)) {
    return ResponseService.badRequest(res, 'Invalid user ID');
  }

  const session = await User.startSession(); // Start a session for transactions
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      return ResponseService.notFound(res, 'User not found');
    }

    // Delete profile pictures
    if (Array.isArray(user.picture)) {
      await Promise.all(
        user.picture.map(async (imagePath) => {
          try {
            await fs.unlink(imagePath);
          } catch (err) {
            console.error(`Error deleting file ${imagePath}:`, err.message);
          }
        })
      );
    }

    // Delete cover pictures
    if (Array.isArray(user.cover_picture)) {
      await Promise.all(
        user.cover_picture.map(async (imagePath) => {
          try {
            await fs.unlink(imagePath);
          } catch (err) {
            console.error(`Error deleting file ${imagePath}:`, err.message);
          }
        })
      );
    }

    // Delete associated products
    const products = await Product.find({ user_id: userId }).session(session);
    if (products.length > 0) {
      await Promise.all(
        products.map(async (product) => {
          // Delete product images
          if (Array.isArray(product.images)) {
            await Promise.all(
              product.images.map(async (imagePath) => {
                try {
                  await fs.unlink(imagePath);
                } catch (err) {
                  console.error(`Error deleting file ${imagePath}:`, err.message);
                }
              })
            );
          }
          await product.deleteOne({ session });
        })
      );
    }


    // Delete associated docs
    const doc = await VerificationDocument.findOne({ user_id: userId }).session(session);
    if (doc) {
      // Delete images
    if (Array.isArray(doc.id_back)) {
      await Promise.all(
        doc.id_back.map(async (imagePath) => {
          try {
            await fs.unlink(imagePath);
          } catch (err) {
            console.error(`Error deleting file ${imagePath}:`, err.message);
          }
        })
      );
    }
    if (Array.isArray(doc.id_front)) {
      await Promise.all(
        doc.id_front.map(async (imagePath) => {
          try {
            await fs.unlink(imagePath);
          } catch (err) {
            console.error(`Error deleting file ${imagePath}:`, err.message);
          }
        })
      );
    }
    if (Array.isArray(doc.face_image)) {
      await Promise.all(
        doc.face_image.map(async (imagePath) => {
          try {
            await fs.unlink(imagePath);
          } catch (err) {
            console.error(`Error deleting file ${imagePath}:`, err.message);
          }
        })
      );
    }
    if (Array.isArray(doc.face_smile_image)) {
      await Promise.all(
        doc.face_smile_image.map(async (imagePath) => {
          try {
            await fs.unlink(imagePath);
          } catch (err) {
            console.error(`Error deleting file ${imagePath}:`, err.message);
          }
        })
      );
    }
      await VerificationDocument.deleteOne({ user_id: userId }).session(session);
    }

    // Log the deleted account
    await DeletedAccount.create(
      [
        {
          user_id: user._id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          reason: req.body.reason,
        },
      ],
      { session }
    );

    // Delete the user account
    await user.deleteOne({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return ResponseService.success(res, {}, 'Account deleted successfully');
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    console.error('Error deleting user:', error.message);
    return ResponseService.error(res, 'Error deleting user');
  }
});
  
  module.exports = router;