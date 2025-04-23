const User = require('../models/user');
const { formatResponse } = require('../utils/responseFormatter');

/**
 * Admin authentication middleware
 * Checks if the authenticated user has admin role
 * Note: This middleware should be used after the auth middleware
 */
module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json(formatResponse(false, 'User not found', null));
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json(formatResponse(false, 'Access denied. Admin role required', null));
    }
    
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};
