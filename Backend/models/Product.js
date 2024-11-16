const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  sub_category: { type: String },
  brand: { type: String },
  image: { type: String },
  images: { type: [String] },
  status: { type: Number, required: true },
  slug: { type: String, required: true }
}, {timestamps: true });

const Product = mongoose.model('products', ProductSchema);
module.exports = Product;