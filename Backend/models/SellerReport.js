const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SellerReportSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    seller_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  subject: { type: String, required: false },
  message: { type: String, required: true }
}, { timestamps: true });

const SellerReport = mongoose.model('seller_reports', SellerReportSchema);
module.exports = SellerReport;
