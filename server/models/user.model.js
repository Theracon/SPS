// Dependency
const mongoose = require('mongoose');

// Define user schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date_joined: {
    type: Date,
    default: Date.now,
  },
  tier: {
    type: Number,
    required: true,
  },
});

// Export user model
module.exports = mongoose.model('User', UserSchema);
