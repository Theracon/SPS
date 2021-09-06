const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');

// @title Admin/User Login Route
// @route POST /auth/login/
// @desc Log user in
// @access Public
router.post('/', async (req, res) => {
  try {
    // Fetch user details from form
    const { email, password } = req.body;
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Incorrect email or password.',
      });
    }
    // Check if the password is correct
    const passwordsMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordsMatch) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Incorrect email or password.',
      });
    }
    // Create a token for the user
    const token = jwt.sign({ user: existingUser._id }, process.env.JWT_SECRET);
    // Send the token securely in a cookie
    res.cookie('token', token, { httpOnly: true }).send({
      success: true,
      data: existingUser._id,
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
