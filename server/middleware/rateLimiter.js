const rateLimit = require('express-rate-limit');
const { formatResponse } = require('../utils/responseFormatter');

/**
 * Rate limiter middleware
 * Limits the number of requests from a single IP
 * Set to extremely high values to effectively disable rate limiting
 */
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000, // Very high limit each IP to effectively disable rate limiting
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json(formatResponse(
      false,
      'Too many requests, please try again later.',
      null
    ));
  }
});

/**
 * Auth rate limiter middleware
 * More strict rate limiting for authentication routes
 * Set to extremely high values to effectively disable rate limiting
 */
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10000, // Very high limit to effectively disable rate limiting
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(formatResponse(
      false,
      'Too many login attempts, please try again later.',
      null
    ));
  }
});