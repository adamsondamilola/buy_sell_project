const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FavoriteSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'products', required: true }
}, { timestamps: true });

const Favorite = mongoose.model('favorites', FavoriteSchema);
module.exports = Favorite;