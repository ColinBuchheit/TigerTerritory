const { formatResponse } = require('../utils/responseFormatter');

/**
 * Global error handling middleware
 * Catches all errors from routes and controllers
 */
module.exports = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error encountered:', err);
  console.error(err.stack);
  
  // Only set status code to 500 if it's not already an error code
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
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