
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userProfileSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
