const router = require('express').Router();
const multer = require('multer');
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

// @title Update Product Route
// @route PUT /api/admin/USER_ID/products/PRODUCT_ID
// @desc Update product data
// @access Public
router.patch('/:productId', upload.single('image'), async (req, res) => {
  try {
    const { productId } = req.params;
    const updateOps = {};
    for (const ops of Object.entries(req.body)) {
      updateOps[ops.propName] = ops.value;
    }
    // Find product in database
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, status: 404, message: 'Product not found' });
    }
    // Update product data
    Product.update(
      { _id: productId },
      {
        $set: {
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: req.body.image,
        },
      }
    )
      .exec()
      .then((result) => {
        res.status(200).json({
          success: true,
          data: result._id,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          success: false,
          status: 400,
          message: 'Invalid request.',
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

// @title Delete Product Route
// @route DELETE /api/admin/USER_ID/products/PRODUCT_ID
// @desc Delete a product from the database
// @access Public
router.delete('/:productId', async (req, res) => {
  try {
    // Find product in database
    Product.findById(req.params.productId)
      .exec()
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            success: false,
            status: 404,
            message: 'Product not found.',
          });
        }
        // Delete product from database
        product
          .remove()
          .then(() => res.json({ success: true, data: 'Product removed.' }));
      })
      .catch((err) => {
        console.error(err);
        res.status(404).json({
          success: false,
          status: 404,
          message: 'Product not found.',
        });
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Server error.',
    });
  }
});

module.exports = router;
