const { formatResponse } = require('../utils/responseFormatter');

/**
 * Global error handling middleware
 * Catches all errors from routes and controllers
 */
module.exports = (err, req, res, next) => {
  // Log error for debugging
  console.error(err.stack);
  
  // Default to 500 server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Server Error';
  
  // Handle different types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json(formatResponse(false, 'Validation Error', err.errors));
  }
  
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(404).json(formatResponse(false, 'Resource not found', null));
  }
  
  res.status(statusCode).json(formatResponse(false, message, null));
};