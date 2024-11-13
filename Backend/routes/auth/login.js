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
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      //JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        'Y35Fr-=4427HFe2r1534@!45573gfedgdegHFDFERR%6gtegH^^rfesfrf',
        { expiresIn: '72h' }
      );
  
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;