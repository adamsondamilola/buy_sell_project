const express = require('express');
const User = require('../../models/User');
const router = express.Router();

router.post('/verify', async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email: email });
      if (user) {
        return res.status(200).json({ message: 'User exists' });
      }
      
        return res.status(400).json({ message: 'User do not exist' });      
  
    } catch (err) {
    return  res.status(500).json({ message: 'Internal server error' });
    }
  });


module.exports = router;