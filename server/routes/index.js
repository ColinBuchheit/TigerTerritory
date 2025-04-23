const express = require('express');
const router = express.Router();

// Import individual route files
const authRoutes = require('./authRoutes');
const commentRoutes = require('./commentRoutes');
const scheduleRoutes = require('./scheduleRoutes');

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication
 *   - name: Comments
 *     description: Post comments
 *   - name: Schedules
 *     description: Sports game schedules
 */

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API base route
 *     tags: [API]
 *     responses:
 *       200:
 *         description: Welcome message
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Sports Website API',
    version: '1.0.0'
  });
});

// Define API routes
router.use('/auth', authRoutes);
router.use('/comments', commentRoutes);
router.use('/schedules', scheduleRoutes);

module.exports = router;