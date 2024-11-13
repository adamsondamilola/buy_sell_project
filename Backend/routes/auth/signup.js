const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const router = express.Router();

// Signup route (existing)
router.post('/signup', async (req, res) => {
  try {
	//restricting what can be posted
    const { first_name, last_name, email, password } = req.body;

    //check password length
    if(req.body.password.length < 6){
        return res.status(400).json({message: 'Password should be at least 6 characters long'});
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      first_name,
      last_name,
      email,
      password
    });

    await user.save();

    res.status(200).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
