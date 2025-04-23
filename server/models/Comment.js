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
 *           description: ID of the post this comment belongs to
 *           pattern: ^[a-z]+-[a-z]+-\d+$
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
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: String,
    required: [true, 'Post ID is required'],
    // Add validation pattern to ensure consistent IDs
    match: [/^[a-z]+-[a-z]+-\d+$/, 'Post ID format should be category-type-number (e.g., basketball-news-1)']
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

// Virtual for formatted date
CommentSchema.virtual('formattedDate').get(function() {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return this.date.toLocaleDateString('en-US', options);
});

// Virtual for relative time
CommentSchema.virtual('relativeTime').get(function() {
  const now = new Date();
  const diff = Math.floor((now - this.date) / 1000); // difference in seconds
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  
  return this.formattedDate;
});

// Ensure virtuals are included when converting to JSON/Object
CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Comment', CommentSchema);