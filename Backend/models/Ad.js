const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'products', required: true },
  status: { type: Number, default: 0 },
  duration_from: { type: Date, required: true },
  duration_to: { type: Date, required: true },
  days: { type: Number, required: true },
  amount: { type: Number, required: true },
  country: { type: String, required: true },
  state: { type: String, required: false },
  city: { type: String, required: false }
}, { timestamps: true });

const Ad = mongoose.model('ads', AdSchema);
module.exports = Ad;