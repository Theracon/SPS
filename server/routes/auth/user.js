const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');

// @title User Signup Route
// @route POST /auth/users/signup
// @desc Register a new user
// @access Public
router.post('/signup', async (req, res) => {
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
      tier: 2,
      password: hashedPassword,
    });
    // Save new user to the database
    const newUser = await user.save();
    // Create a token for the new user
    const token = jwt.sign({ user: newUser._id }, process.env.JWT_SECRET);
    // Send the token securely in a cookie
    res.cookie('token', token, { httpOnly: true }).send({
      success: true,
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Server error.',
    });
  }
});

// @title User Login Route
// @route POST /auth/users/login
// @desc Log user in
// @access Public
router.post('/login', async (req, res) => {
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
      data: existingUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Server error.',
    });
  }
});

// @title User Logout Route
// @route POST /auth/users/logout
// @desc Log user out
// @access Public
router.get('/logout', async (req, res) => {
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
