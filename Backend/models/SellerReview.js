const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SellerReviewSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    seller_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  star: { type: Number, required: true },
  review: { type: String, required: true }
}, { timestamps: true });

const SellerReview = mongoose.model('seller_reviews', SellerReviewSchema);
module.exports = SellerReview;
