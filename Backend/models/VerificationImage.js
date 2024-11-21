const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VerificationImageSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  face_iamge: { type: String, required: false },
  face_open_mouth_image: { type: String, required: false },
  face_smile_image: { type: String, required: false },
  id_front: { type: String, required: false },
  id_back: { type: String, required: false },
  id_type: { type: String, required: false }
}, { timestamps: true });

const VerificationImage = mongoose.model('locations', VerificationImageSchema);
module.exports = VerificationImage;