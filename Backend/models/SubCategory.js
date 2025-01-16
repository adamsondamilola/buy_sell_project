const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubCategorySchema = new Schema({
  category_id: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
  name: { type: String, required: true },
  description: { type: String },
  properties: { type: [String] },
  image: { type: String },
  order: { type: Number } 
}, { timestamps: true });

const SubCategory = mongoose.model('sub_categories', SubCategorySchema);
module.exports = SubCategory;
