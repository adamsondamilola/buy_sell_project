const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  title: { type: String, required: true },
  description: {
    type: String,
    required: true
  },
  details: {
    type: Object,
    required: false
  },  
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  sub_category: { type: String },
  brand: { type: String },
  image: { type: String },
  images: { type: [String] },
  colors: { type: [String] },
  video: { type: String },
  status: { type: Number, required: true, default: 0 },
  condition: {
    type: String,
    required: true,
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
  slug: { type: String, required: true }
}, {timestamps: true });

const Product = mongoose.model('products', ProductSchema);
module.exports = Product;
