// Dependencies
const router = require('express').Router();
const multer = require('multer');
const User = require('../../models/user.model');
const Product = require('../../models/product.model');

// Configure multer to store image, and set file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + file.originalname.toLocaleLowerCase().replace(/\s/g, '-')
    );
  },
});
// File type filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// Configure multer to use storage and fileFilter
// File size limit: 5MB
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// @title Profile Route
// @route GET /api/USER_ID/profile
// @desc Fetch user profile data from database
// @access Public

// @title Get Products Route
// @route GET /api/USER_ID/products
// @desc Fetch all products
// @access Public

// @title Get Product By ID Route
// @route GET /api/USER_ID/products/PRODUCT_ID
// @desc Fetch product by product id
// @access Public

// @title Add Product Route
// @route POST /api/USER_ID/products/new
// @desc Add a new product
// @access Public
router.post('/products/new', upload.single('image'), async (req, res) => {
  try {
    // Fetch product details from form
    const { name, price, description } = req.body;
    // Find requesting user in the database
    const user = User.findById(req.params.id);
    // Create new product
    const product = new Product({
      name,
      price,
      description,
      image: req.file.path,
      added_by: user.id,
    });
    // Save new product to database
    await product.save().then((result) => {
      res.status(201).json({
        success: true,
        data: result._id,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Server error.',
    });
  }
});

module.exports = router;
