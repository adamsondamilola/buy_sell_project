const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  whatsapp: {
    type: String,
    required: false,
    trim: true
  },
  role: {
    type: String,
    required: false,
    trim: true,
    default: "User"
  },
  picture: {
    type: String,
    required: false,
    trim: true
  },
  cover_picture: {
    type: String,
    required: false,
    trim: true
  },
  country: {
    type: String,
    required: false,
    trim: true
  },
  state: {
    type: String,
    required: false,
    trim: true
  },
  city: {
    type: String,
    required: false,
    trim: true
  },
  shop_name: {
    type: String,
    required: false,
    trim: true
  },
  shop_description: {
    type: String,
    required: false,
    trim: true
  },
  shop_address: {
    type: String,
    required: false,
    trim: true
  },
  is_user_verified: {
    type: Boolean,
    required: false,
    trim: true
  },
  is_email_verified: {
    type: Boolean,
    required: false,
    trim: true
  },
  is_account_blocked: {
    type: Boolean,
    required: false,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true }); 

// Hash user password before saving to db
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('users', userSchema);

module.exports = User;
