const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');

// @title Admin Signup Route
// @route POST /auth/signup/USER_MODE
// @desc Register a new admin
// @access Public
router.post('/:userMode', async (req, res) => {
  try {
    // Fetch user details from form
    const { name, email, password } = req.body;
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'An account with this email already exists.',
      });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const user = new User({
      name,
      email,
      tier: req.params.userMode === 'admin' ? 1 : 2,
      password: hashedPassword,
    });
    // Save new user to the database
    const newUser = await user.save();
    // Create a token for the new user
    const token = jwt.sign({ user: newUser._id }, process.env.JWT_SECRET);
    // Send the token securely in a cookie
    res.cookie('token', token, { httpOnly: true }).send({
      success: true,
      data: newUser._id,
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
