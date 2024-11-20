const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  ad_id: { type: Schema.Types.ObjectId, ref: 'ads' },
  product_id: { type: Schema.Types.ObjectId, ref: 'products' },
  transaction_id: { type: Schema.Types.ObjectId, required: true },
  status: { type: Number, default: 0},
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const Transaction = mongoose.model('transactions', TransactionSchema);
module.exports = Transaction;
