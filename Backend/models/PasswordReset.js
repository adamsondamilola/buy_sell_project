const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: Number,
    required: true,
    default: 0
  },
  expiry: {
    type: Date,
    required: true
  }
}, { timestamps: true }); 

const PasswordReset = mongoose.model('password_reset', passwordResetSchema);

module.exports = PasswordReset;
