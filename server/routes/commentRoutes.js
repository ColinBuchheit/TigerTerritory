const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');
const { commentValidation } = require('../middleware/validators');
const { apiLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * /api/comments/{postId}:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[a-z]+-[a-z]+-\d+$
 *         description: Post ID (format category-type-number, e.g. basketball-news-1)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of comments with pagination
 *       500:
 *         description: Server error
 */
router.get('/:postId', commentController.getCommentsByPost);

/**
 * @swagger
 * /api/comments/{postId}:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[a-z]+-[a-z]+-\d+$
 *         description: Post ID (format category-type-number, e.g. basketball-news-1)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/:postId', [auth, commentValidation, apiLimiter], commentController.addComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [auth, commentValidation], commentController.updateComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, commentController.deleteComment);

/**
 * @swagger
 * /api/comments/{id}/like:
 *   put:
 *     summary: Like a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment liked successfully
 *       400:
 *         description: Comment already liked
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put('/:id/like', auth, commentController.likeComment);

/**
 * @swagger
 * /api/comments/{id}/unlike:
 *   put:
 *     summary: Unlike a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment unliked successfully
 *       400:
 *         description: Comment has not yet been liked
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put('/:id/unlike', auth, commentController.unlikeComment);

module.exports = router;