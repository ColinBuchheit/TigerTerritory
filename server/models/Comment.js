const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - text
 *         - user
 *         - postId
 *       properties:
 *         text:
 *           type: string
 *           description: Comment text
 *         user:
 *           type: string
 *           description: ID of the user who created the comment
 *         postId:
 *           type: string
 *           description: ID of the hardcoded post this comment belongs to
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who liked the comment
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date when comment was created
 */
const CommentSchema = new Schema({
  text: {
    type: String,
    required: [true, 'Text is required'],
    trim: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Change from ObjectId reference to simple string ID
  postId: {
    type: String,
    required: [true, 'Post ID is required']
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

// Virtual for like count
CommentSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Ensure virtuals are included when converting to JSON/Object
CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Comment', CommentSchema);