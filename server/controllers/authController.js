const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { formatResponse } = require('../utils/responseFormatter');
const { validationResult } = require('express-validator');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, 'Validation error', errors.array()));
    }

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
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, 'Validation error', errors.array()));
    }

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
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json(formatResponse(false, 'User not found', null));
    }
    res.json(formatResponse(true, 'User retrieved successfully', user));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};