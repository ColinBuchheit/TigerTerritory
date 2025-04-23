const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { formatResponse } = require('../utils/responseFormatter');

/**
 * Authentication middleware for protecting routes
 * Verifies the JWT token in the request header
 */
module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json(formatResponse(false, 'No token, authorization denied', null));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json(formatResponse(false, 'Token is not valid', null));
  }
};