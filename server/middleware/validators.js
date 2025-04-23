const { check } = require('express-validator');

// User registration validation
exports.registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

// User login validation
exports.loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

// Post validation
exports.postValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('content', 'Content is required').not().isEmpty(),
  check('category', 'Category is required').not().isEmpty()
];

// Comment validation
exports.commentValidation = [
  check('text', 'Text is required').not().isEmpty()
];

// Schedule validation
exports.scheduleValidation = [
  check('sport', 'Sport is required').not().isEmpty(),
  check('league', 'League is required').not().isEmpty(),
  check('homeTeam', 'Home team is required').not().isEmpty(),
  check('awayTeam', 'Away team is required').not().isEmpty(),
  check('venue', 'Venue is required').not().isEmpty(),
  check('startTime', 'Start time is required').not().isEmpty().isISO8601().toDate(),
  check('status', 'Status is required').not().isEmpty()
];