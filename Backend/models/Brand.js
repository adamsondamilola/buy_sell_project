const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  category_id: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
  category_name: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String }
}, { timestamps: true });

const Brand = mongoose.model('brands', BrandSchema);
module.exports = Brand;