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
      console.error('Controller error:', err.message);
      
      // Handle ObjectId casting errors
      if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(404).json(formatResponse(false, 'Resource not found', null));
      }
      
      // Handle validation errors
      if (err.name === 'ValidationError') {
        return res.status(400).json(formatResponse(false, 'Validation Error', err.errors));
      }
      
      // Handle duplicate key errors
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        return res.status(400).json(formatResponse(
          false,
          `Duplicate value: ${field} with value '${value}' already exists`,
          null
        ));
      }
      
      // Pass to global error handler
      next(err);
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
 * Handles resource authorization pattern with admin override
 * @param {*} resource - Resource with user property
 * @param {string} userId - User ID to check against
 * @param {Response} res - Express response object
 * @param {string} userRole - Role of the user (admin or user)
 * @param {string} action - Action being performed (e.g., 'update', 'delete')
 * @returns {boolean} True if unauthorized and response sent
 */
exports.checkUnauthorized = (resource, userId, res, userRole = 'user', action = 'access') => {
  // Admin users can perform any action
  if (userRole === 'admin') {
    return false;
  }
  
  // For regular users, check if they own the resource
  // Handle both string IDs and object IDs
  const resourceUserId = resource.user.toString ? resource.user.toString() : resource.user;
  
  if (resourceUserId !== userId) {
    res.status(403).json(formatResponse(false, `Not authorized to ${action} this resource`, null));
    return true;
  }
  return false;
};