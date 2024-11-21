const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocationSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  longitute: { type: String, required: true },
  latitude: { type: String, required: true },
  country: { type: String, required: true },
  location: { type: String, required: true },
}, { timestamps: true });

const Location = mongoose.model('locations', LocationSchema);
module.exports = Location;