const express = require('express');
const router = express.Router();

// Import individual route files
const authRoutes = require('./authRoutes');
const commentRoutes = require('./commentRoutes');

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication
 *   - name: Posts
 *     description: Sports news and blog posts (read-only)
 *   - name: Comments
 *     description: Post comments
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

module.exports = router;