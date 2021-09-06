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
router.get('/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    User.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          res.status(200).json({
            success: true,
            data: user,
          });
        } else {
          res.status(404).json({
            success: false,
            status: 404,
            message: 'User not found.',
          });
        }
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Server error.',
    });
  }
});

// @title Fetch All Products Route
// @route GET /api/USER_ID/products/all
// @desc Fetch all products from database
// @access Public
router.get('/:id/products/all', async (req, res) => {
  try {
    Product.find()
      .exec()
      .then((products) => {
        if (products.length >= 0) {
          return res.status(200).json({
            success: true,
            data: products,
          });
        }
        res.status(404).json({
          success: false,
          status: 404,
          message: 'User not found.',
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Server error.',
    });
  }
});

// @title Fetch User Products Route
// @route GET /api/USER_ID/products
// @desc Fetch all products added by a particular user
// @access Public
router.get('/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    Product.find({ added_by: id })
      .exec()
      .then((products) => {
        if (products.length >= 0) {
          return res.status(200).json({
            success: true,
            data: products,
          });
        }
        res.status(404).json({
          success: false,
          status: 404,
          message: 'User not found.',
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Server error.',
    });
  }
});

// @title Get Product By ID Route
// @route GET /api/USER_ID/products/PRODUCT_ID
// @desc Fetch product by product id
// @access Public
router.get('/:id/products/:productId', async (req, res) => {
  try {
    const { id, productId } = req.params;
    User.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          Product.find({ _id: productId })
            .exec()
            .then((product) => {
              if (product) {
                return res.status(200).json({
                  success: true,
                  data: product,
                });
              }
              res.status(404).json({
                success: false,
                status: 404,
                message: 'Product not found.',
              });
            });
        } else {
          res.status(404).json({
            success: false,
            status: 404,
            message: 'User not found.',
          });
        }
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Server error.',
    });
  }
});

// @title Add Product Route
// @route POST /api/USER_ID/products/new
// @desc Add a new product
// @access Public
router.post('/:id/products/new', upload.single('image'), async (req, res) => {
  try {
    // Fetch product details from form
    const { name, price, description, image } = req.body;
    // Find requesting user in the database
    User.findById(req.params.id)
      .exec()
      .then((user) => {
        if (user) {
          // Create new product
          const newProduct = new Product({
            name,
            price,
            description,
            image,
            added_by: req.params.id,
          });
          // Save product to database
          newProduct.save().then((product) => {
            res.status(200).json({
              success: true,
              data: product._id,
            });
          });
        } else {
          res.status(404).json({
            success: false,
            status: 404,
            message: 'User not found.',
          });
        }
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Server error.',
    });
  }
});

module.exports = router;
