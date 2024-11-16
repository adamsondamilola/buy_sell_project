const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  category: { type: String, required: true },
  sub_categories: { type: [String] },
  description: { type: String },
  image: { type: String }
}, { timestamps: true });

const Category = mongoose.model('categories', CategorySchema);
module.exports = Category;
