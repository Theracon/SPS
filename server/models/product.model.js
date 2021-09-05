// Dependency
const mongoose = require('mongoose');

// Define product schema
const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  added_by: {
    type: String,
    required: true,
  },
  added_on: {
    type: Date,
    default: Date.now,
  },
});

// Export product model
module.exports = mongoose.model('Product', ProductSchema);
