/**
 * Standardizes API response format across the application
 * @param {boolean} success - Whether the request was successful
 * @param {string} message - Response message
 * @param {*} data - Response data (object, array, etc.)
 * @returns {Object} Formatted response object
 */
exports.formatResponse = (success, message, data) => {
    return {
      success,
      message,
      data,
      timestamp: new Date()
    };
  };