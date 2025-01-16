const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      if (user.is_account_blocked) {
        return res.status(400).json({ message: 'Account blocked!' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      //JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.HASH_KEY,
        { expiresIn: '72h' }
      );
  
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });


// Middleware to verify token and extract user info
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Authentication failed' });

  jwt.verify(token.split(' ')[1], process.env.HASH_KEY, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate login token' });
    req.userId = decoded.id;
    next();
  });
};

// Logout route
router.post('/logout', verifyToken, (req, res) => {
  res.clearCookie('token');
  // Invalidate the token - client should handle removing the token
  res.status(200).json({ message: 'Logout successful' });
});


module.exports = router;