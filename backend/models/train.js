
const mongoose = require('mongoose');
const { Schema } = mongoose;

const trainSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  number: String,
  departureTime: String,
  arrivalTime: String,
  duration: String,
  price: Number,
  seatsAvailable: Number,
  totalSeats: Number,
  bookedSeats: [String],
});

module.exports = mongoose.model('Train', trainSchema);
