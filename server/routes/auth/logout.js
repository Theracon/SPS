const router = require('express').Router();

// @title User Logout Route
// @route POST /auth/logout/
// @desc Log user out
// @access Public
router.get('/', async (req, res) => {
  try {
    // Clear the token cookie or empty it
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) }).send({
      success: true,
      message: 'You have logged out.',
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
