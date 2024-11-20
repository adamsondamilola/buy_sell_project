const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeletedAccountSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  deletedAt: { type: Date, default: Date.now },
  reason: { type: String, required: false }
});

const DeletedAccount = mongoose.model('deleted_accounts', DeletedAccountSchema);
module.exports = DeletedAccount;
