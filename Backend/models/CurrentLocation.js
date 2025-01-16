const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CurrentLocationSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  //country: { type: String, required: true },
  //state: { type: String, required: true },
  //city: { type: String, required: false },
  //neighborhood: { type: String, required: false },
  //address: { type: String, required: false }
}, { timestamps: true });

const CurrentLocation = mongoose.model('current_locations', CurrentLocationSchema);
module.exports = CurrentLocation;