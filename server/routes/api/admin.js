const router = require('express').Router();
const Product = require('../../models/product.model');

// @title Update Product Route
// @route PUT /api/admin/USER_ID/products/PRODUCT_ID
// @desc Update product data
// @access Public

// @title Delete Product Route
// @route DELETE /api/admin/USER_ID/products/PRODUCT_ID
// @desc Delete a product from the database
// @access Public

module.exports = router;
