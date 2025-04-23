const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { formatResponse } = require('../utils/responseFormatter');
const { validateRequest, asyncHandler, checkResourceNotFound } = require('../utils/controllerHelpers');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  return validateRequest(req, res, async () => {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json(formatResponse(false, 'User already exists', null));
    }

    // Create user
    user = new User({
      name,
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
      (err, token) => {
        if (err) throw err;
        res.status(201).json(formatResponse(true, 'User registered successfully', { token }));
      }
    );
  });
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  return validateRequest(req, res, async () => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json(formatResponse(false, 'Invalid credentials', null));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(formatResponse(false, 'Invalid credentials', null));
    }

    // Create token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
      (err, token) => {
        if (err) throw err;
        res.json(formatResponse(true, 'Login successful', { token }));
      }
    );
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (checkResourceNotFound(user, res, 'User')) return;
  
  res.json(formatResponse(true, 'User retrieved successfully', user));
});