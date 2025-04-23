/**
 * Validates an email address format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
exports.isValidEmail = (email) => {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates a URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if URL is valid
   */
  exports.isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  /**
   * Sanitizes input for storage
   * @param {string} input - String to sanitize
   * @returns {string} Sanitized string
   */
  exports.sanitize = (input) => {
    if (!input) return '';
    return input
      .toString()
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  /**
   * Checks if a string is empty after trimming
   * @param {string} str - String to check
   * @returns {boolean} True if string is empty or contains only whitespace
   */
  exports.isEmpty = (str) => {
    return (!str || str.trim() === '');
  };