const mongoose = require('mongoose');

// Product schema
const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  added_by: {
    type: String,
    required: true,
  },
  tier: {
    type: Number,
    required: true,
  },
});

// User schema
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
  products: [ProductSchema],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
