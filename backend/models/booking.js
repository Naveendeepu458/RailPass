
const mongoose = require('mongoose');
const { Schema } = mongoose;

const passengerSchema = new Schema({
  name: String,
  age: Number,
  gender: String,
  seat: String,
}, { _id: false });

const bookingSchema = new Schema({
  // Use mongoose.Schema.Types.ObjectId to reference another model
  train: { type: Schema.Types.ObjectId, ref: 'Train', required: true },
  passengers: [passengerSchema],
  totalFare: Number,
  bookingDate: { type: Date, default: Date.now },
});

// Mongoose automatically creates an `_id` field. We'll use a virtual `id` to match the frontend.
bookingSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
bookingSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('Booking', bookingSchema);
