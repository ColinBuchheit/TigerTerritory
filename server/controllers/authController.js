import User, { findOne, findById } from '../models/user';
import { genSalt, hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { jwtSecret, jwtExpiresIn } from '../config/config';
import { formatResponse } from '../utils/responseFormatter';
import { validationResult } from 'express-validator';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, 'Validation error', errors.array()));
    }

    const { name, email, password } = req.body;

    // Check if user exists
    let user = await findOne({ email });
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
    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    await user.save();

    // Create token
    const payload = {
      user: {
        id: user.id
      }
    };

    sign(
      payload,
      jwtSecret,
      { expiresIn: jwtExpiresIn },
      (err, token) => {
        if (err) throw err;
        res.status(201).json(formatResponse(true, 'User registered successfully', { token }));
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
}

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, 'Validation error', errors.array()));
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await findOne({ email });
    if (!user) {
      return res.status(400).json(formatResponse(false, 'Invalid credentials', null));
    }

    // Check password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(formatResponse(false, 'Invalid credentials', null));
    }

    // Create token
    const payload = {
      user: {
        id: user.id
      }
    };

    sign(
      payload,
      jwtSecret,
      { expiresIn: jwtExpiresIn },
      (err, token) => {
        if (err) throw err;
        res.json(formatResponse(true, 'Login successful', { token }));
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
}

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export async function getCurrentUser(req, res) {
  try {
    const user = await findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json(formatResponse(false, 'User not found', null));
    }
    res.json(formatResponse(true, 'User retrieved successfully', user));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
}
