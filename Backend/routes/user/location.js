const express = require('express');
const router = express.Router();
const CurrentLocation = require('../../models/CurrentLocation');
const ResponseService = require('../../services/responses');
const authMiddleware = require('../../middleware/authMiddleware');

// Create a new location for user
router.post('/create', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
  try {
//    const { longitude, latitude, country, state, city, neighborhood, address } = req.body;
    const { longitude, latitude } = req.body;
    const newLocation = new CurrentLocation({
      user_id: userId,
      longitude,
      latitude
    });
    const savedLocation = await newLocation.save();
    return ResponseService.success(res, { savedLocation }, 'Location saved successfully');
  } catch (err) {
    return ResponseService.error(res, 'Internal server error');
  }
});

// Get all locations for a user
router.get('/:user_id', async (req, res) => {
  try {
    const locations = await CurrentLocation.find({ user_id: req.params.user_id }).sort({ createdAt: -1 });
    return ResponseService.success(res, { locations }, 'Locations retrieved successfully');
  } catch (err) {
    return ResponseService.error(res, 'Internal server error');
  }
});

module.exports = router;
