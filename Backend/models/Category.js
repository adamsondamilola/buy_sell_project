const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  order: { type: Number }
}, { timestamps: true });


const Category = mongoose.model('categories', CategorySchema);
module.exports = Category;
