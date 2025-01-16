const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const authMiddleware = require('../../middleware/authMiddleware')
const ResponseService = require('../../services/responses');
const upload = require('../../middleware/imageUploadMiddleware');
const isUsernameValid = require('../../utils/validate_username');
const formatFilePath = require('../../utils/formatFilePath');
const bcrypt = require('bcryptjs');
// Update user profile
router.put('/profile', authMiddleware, upload.single('profile_picture'), async (req, res) => {
  const userId = req.user.userId;
  const { first_name, last_name, phone, whatsapp, country, state, city, dob } = req.body;
  try {

    if (first_name == "" || first_name.length < 3) {
      return ResponseService.badRequest(res, 'First name must not be empty and should be at least 3 characters long');
    }
    if (first_name.length > 50) {
      return ResponseService.badRequest(res, 'First name too long');
    }
    if (last_name == "" || last_name.length < 3) {
      return ResponseService.badRequest(res, 'Last name must not be empty and should be at least 3 characters long');
    }
    if (last_name.length > 50) {
      return ResponseService.badRequest(res, 'Last name too long');
    }
    if (phone != null && phone[0] != "+") {
      return ResponseService.badRequest(res, 'Phone number must be international format. E.g. +123456780');
    }
    if (phone != null && phone[0] != "+") {
      return ResponseService.badRequest(res, 'Phone number must be international format. E.g. +123456780');
    }
    if (phone != null && phone.length > 15) {
      return ResponseService.badRequest(res, 'Phone number too long');
    }
    if (whatsapp != null && whatsapp[0] != "+") {
      return ResponseService.badRequest(res, 'WhatsApp number must be international format. E.g. +123456780');
    }
    if (whatsapp != null && whatsapp.length > 15) {
      return ResponseService.badRequest(res, 'WhatsApp number too long');
    }
    if (country != null && country.length > 25) {
      return ResponseService.badRequest(res, 'Country Name too long');
    }
    if (city != null && city.length > 25) {
      return ResponseService.badRequest(res, 'City Name too long');
    }
    if (state != null && state.length > 25) {
      return ResponseService.badRequest(res, 'State name too long');
    }

    //find if user exists
    const user = await User.findById(userId);
    if (!user) {
      return ResponseService.notFound(res, 'User not found');
    }



    const updateData = { first_name, last_name, phone, whatsapp, country, state, city, dob };
    if (req.file) {
      updateData.picture = formatFilePath(req.file.path); // Save the file path to the user's profile picture 
    }

    Object.keys(updateData).forEach(key => {
      user[key] = updateData[key];
    });
    user.updatedAt = new Date();

    await user.save();
    ResponseService.success(res, user, 'Profile updated successfully');
  } catch (error) {
    ResponseService.error(res, 'Error updating profile');
  }
});

//shop
router.put('/shop', authMiddleware, upload.single('profile_picture'), async (req, res) => {
  const userId = req.user.userId;
  const { username, shop_name, shop_description, shop_address, phone, whatsapp, country, state, city } = req.body;

  if (username == null) {
    return ResponseService.badRequest(res, 'Username cannot be empty');
  }
  if (!isUsernameValid(username)) {
    return ResponseService.badRequest(res, 'Username should not have space');
  }
  if (username.length > 50) {
    return ResponseService.badRequest(res, 'Username too long');
  }
  if (shop_name == null) {
    return ResponseService.badRequest(res, 'Business name cannot be empty');
  }
  if (shop_name.length > 100) {
    return ResponseService.badRequest(res, 'Business name too long');
  }
  if (shop_address != null && shop_address.length > 150) {
    return ResponseService.badRequest(res, 'Address too long');
  }
  if (shop_description != null && shop_description.length > 500) {
    return ResponseService.badRequest(res, 'Business description is too long');
  }
  if (phone == null) {
    return ResponseService.badRequest(res, 'Phone number required');
  }
  if (phone != null && phone[0] != "+") {
    return ResponseService.badRequest(res, 'Phone number must be international format. E.g. +123456780');
  }
  if (phone != null && phone[0] != "+") {
    return ResponseService.badRequest(res, 'Phone number must be international format. E.g. +123456780');
  }
  if (phone != null && phone.length > 15) {
    return ResponseService.badRequest(res, 'Phone number too long');
  }
  if (whatsapp != null && whatsapp[0] != "+") {
    return ResponseService.badRequest(res, 'WhatsApp number must be international format. E.g. +123456780');
  }
  if (whatsapp != null && whatsapp.length > 15) {
    return ResponseService.badRequest(res, 'WhatsApp number too long');
  }
  if (country == null) {
    return ResponseService.badRequest(res, 'Country name cannot be empty');
  }
  if (country.length > 25) {
    return ResponseService.badRequest(res, 'Country name too long');
  }
  if (city == null) {
    return ResponseService.badRequest(res, 'City name is required');
  }
  if (city.length > 25) {
    return ResponseService.badRequest(res, 'City Name too long');
  }
  if (state == null && state.length > 25) {
    return ResponseService.badRequest(res, 'State name required');
  }
  if (state.length > 25) {
    return ResponseService.badRequest(res, 'State name too long');
  }

  try {
    //check if username exists
    const checkUsername = await User.findOne({username: username});
    if(checkUsername) return ResponseService.badRequest(res, 'Username already in use');
    const user = await User.findById(userId);
    if (!user) {
      return ResponseService.notFound(res, 'User not found');
    }

    const updateData = {username, shop_name, shop_description, shop_address, phone, whatsapp, country, state, city };
    if (req.file) {
      updateData.picture = formatFilePath(req.file.path); // Save the file path to the user's profile picture 
    }
    Object.keys(updateData).forEach(key => {
      user[key] = updateData[key];
    });
    user.updatedAt = new Date();

    await user.save();
    ResponseService.success(res, user, 'Business details updated successfully');
  } catch (error) {
    ResponseService.error(res, 'Error updating business details');
  }
});


// Upload profile picture
router.put('/upload_profile_picture', authMiddleware, upload.single('profile_picture'), async (req, res) => {
  const userId = req.user.userId;

  if (!req.file) {
    return ResponseService.badRequest(res, 'No file uploaded');
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return ResponseService.notFound(res, 'User not found');
    }

    user.picture = formatFilePath(req.file.path); // Save the file path to the user's profile picture
    user.updatedAt = new Date();

    await user.save();
    return ResponseService.success(res, user, 'Profile picture uploaded successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error uploading profile picture');
  }
});

// Upload cover picture
router.put('/upload_cover_picture', authMiddleware, upload.single('cover_picture'), async (req, res) => {
  const userId = req.user.userId;

  if (!req.file) {
    return ResponseService.badRequest(res, 'No file uploaded');
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return ResponseService.notFound(res, 'User not found');
    }

    user.cover_picture = formatFilePath(req.file.path); // Save the file path to the user's profile picture
    user.updatedAt = new Date();

    await user.save();
    return ResponseService.success(res, user, 'Cover picture uploaded successfully');
  } catch (error) {
    return ResponseService.error(res, 'Error uploading cover picture');
  }
});

router.post('/password', authMiddleware, async (req, res) => {
  try {
    const { current_password, password, confirm_password } = req.body;
    const userId = req.user.userId; 

    // Check if the current password matches
    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(current_password, user.password);
      if (!isMatch) {
        return ResponseService.badRequest(res, 'You entered wrong password');
      }

    // Check password length
    if (password.length < 6) {
      return ResponseService.badRequest(res, 'Password should be at least 6 characters long');
    }

    // Check if passwords match
    if (password !== confirm_password) {
      return ResponseService.badRequest(res, 'Passwords do not match');
    }
    
    if (current_password === password) {
      return ResponseService.badRequest(res, 'No changes made');
    }

    // Update password
    user.password = password  //we already implemented password hash in the User Model
    user.updatedAt = new Date();
    await user.save();

    return ResponseService.success(res, [], 'Password update was successful');
  } catch (err) {
    console.error('Error updating password:', err);
    return ResponseService.error(res, 'Internal server error');
  }
});


module.exports = router;
