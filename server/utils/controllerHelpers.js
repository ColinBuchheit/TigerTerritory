const { validationResult } = require('express-validator');
const { formatResponse } = require('./responseFormatter');

/**
 * Handles common controller validation pattern
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} callback - Function to execute if validation passes
 * @returns {*} Response or callback result
 */
exports.validateRequest = (req, res, callback) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(formatResponse(false, 'Validation error', errors.array()));
  }
  return callback();
};

/**
 * Handles common controller try/catch pattern
 * @param {Function} handler - Async function to execute
 * @returns {Function} Express middleware function
 */
exports.asyncHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      console.error(err.message);
      
      // Handle ObjectId casting errors
      if (err.kind === 'ObjectId') {
        return res.status(404).json(formatResponse(false, 'Resource not found', null));
      }
      
      // Handle validation errors
      if (err.name === 'ValidationError') {
        return res.status(400).json(formatResponse(false, 'Validation Error', err.errors));
      }
      
      // Handle generic server errors
      res.status(500).json(formatResponse(false, 'Server error', null));
    }
  };
};

/**
 * Handles resource not found pattern
 * @param {*} resource - Resource to check
 * @param {Response} res - Express response object
 * @param {string} resourceName - Name of resource for error message
 * @returns {boolean} True if resource not found and response sent
 */
exports.checkResourceNotFound = (resource, res, resourceName = 'Resource') => {
  if (!resource) {
    res.status(404).json(formatResponse(false, `${resourceName} not found`, null));
    return true;
  }
  return false;
};

/**
 * Handles resource authorization pattern
 * @param {*} resource - Resource with user property
 * @param {string} userId - User ID to check against
 * @param {Response} res - Express response object
 * @param {string} action - Action being performed (e.g., 'update', 'delete')
 * @returns {boolean} True if unauthorized and response sent
 */
exports.checkUnauthorized = (resource, userId, res, action = 'access') => {
  if (resource.user.toString() !== userId) {
    res.status(401).json(formatResponse(false, `Not authorized to ${action} this resource`, null));
    return true;
  }
  return false;
};