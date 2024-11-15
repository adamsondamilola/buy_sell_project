const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const PasswordReset = require('../../models/PasswordReset');
const mailer = require('../../services/mailer')
const router = express.Router();


function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function maskEmail(email) { 
    const [username, domain] = email.split('@'); 
    const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]; 
    return `${maskedUsername}@${domain}`; 
}


router.post('/password_request_code', async (req, res) => {
    try {
      const code = generateRandomNumber(11111, 99999); //5-digits
      //add 1 hour to date
      const expiry = new Date();
      expiry.setHours( expiry.getHours() + 1 );

      const { email } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Create new password reset code
    const p_reset = new PasswordReset({
        email,
        code,
        expiry
      });

      await p_reset.save();
      mailer(email, 'Password Reset Code', `Your password reset verification code is <b>${code}</b>`)
      res.status(200).json({ message: `Verification code has been sent to your email ${maskEmail(email)}` });
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.post('/password_request_code_verification', async (req, res) => {
  try {

    const { email, code } = req.body;

    const user_code = await PasswordReset.findOne({ email, code, status : 0 });
    if (!user_code) {
      return res.status(400).json({ message: 'Code is invalid' });
    }
    else if(user_code.expiry <= new Date()){
      return res.status(400).json({message: 'Invalid or expired code'});
    }
      
    res.status(200).json({ message: `Verification successful` });
  } catch (err) {
      console.log(err)
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/password_reset', async (req, res) => {
  try {

    const { email, code, password, confirm_password } = req.body;

    //check password length
    if(password.length < 6){
     return res.status(400).json({message: 'Password should be at least 6 characters long'});
    }

    //check if password match
    if(password != confirm_password){
      return res.status(400).json({message: 'Passwords do not match'});
    }

    //check if code is still valid
    const user_code = await PasswordReset.findOne({ email, code, status : 0 });
    if (!user_code) {
      return res.status(400).json({ message: 'Expired or invalid session' });
    }
    else if(user_code.expiry <= new Date()){
      return res.status(400).json({message: 'Invalid or expired code. Reset your password again'});
    }

    // Update password reset code. status changes from 0 to 1
    user_code.status = 1;
    user_code.updatedAt = new Date();
    await user_code.save();

    //hash password
   //let newPassword = await bcrypt.hash(password, 10)
      // Update User password
    const user = await User.findOne({email});
    user.password = password  //we already implemented password hash in the User Model
    user.updatedAt = new Date();
    await user.save();

    mailer(req.body.email, 'Password Reset Successful', `Your password reset was successful`)
    res.status(200).json({ message: `Password reset was successful` });
  } catch (err) {
      console.log(err)
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;