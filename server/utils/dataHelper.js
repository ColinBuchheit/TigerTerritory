const moment = require('moment');

/**
 * Formats date for display
 * @param {Date} date - Date to format
 * @param {string} format - Format string (default: 'MMMM D, YYYY h:mm A')
 * @returns {string} Formatted date string
 */
exports.formatDate = (date, format = 'MMMM D, YYYY h:mm A') => {
  return moment(date).format(format);
};

/**
 * Gets relative time (e.g., "2 hours ago", "in 3 days")
 * @param {Date} date - Date to get relative time for
 * @returns {string} Relative time string
 */
exports.getRelativeTime = (date) => {
  return moment(date).fromNow();
};

/**
 * Checks if date is in the past
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
exports.isPast = (date) => {
  return moment(date).isBefore(moment());
};

/**
 * Checks if date is in the future
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in the future
 */
exports.isFuture = (date) => {
  return moment(date).isAfter(moment());
};

/**
 * Adds duration to date
 * @param {Date} date - Base date
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit (day, hour, minute, etc.)
 * @returns {Date} New date
 */
exports.addTime = (date, amount, unit) => {
  return moment(date).add(amount, unit).toDate();
};

/**
 * Gets start and end of day for a date
 * @param {Date|string} date - Date to get day range for
 * @returns {Object} Object with start and end properties
 */
exports.getDayRange = (date) => {
  const momentDate = moment(date);
  return {
    start: momentDate.startOf('day').toDate(),
    end: momentDate.endOf('day').toDate()
  };
};