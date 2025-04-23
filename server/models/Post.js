const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - category
 *         - user
 *       properties:
 *         title:
 *           type: string
 *           description: Post title
 *         content:
 *           type: string
 *           description: Post content
 *         category:
 *           type: string
 *           description: Sports category (e.g., Football, Basketball)
 *         imageUrl:
 *           type: string
 *           description: Featured image URL
 *         user:
 *           type: string
 *           description: ID of the user who created the post
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who liked the post
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of comment IDs
 *         views:
 *           type: number
 *           description: Number of post views
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date when post was created
 */
const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Football', 'Basketball', 'Baseball', 'Hockey', 'Soccer', 'Tennis', 'Golf', 'Other'],
    index: true // Add index for category lookups
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/800x400'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for user lookups
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  views: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now,
    index: true // Add index for date sorting
  }
}, {
  timestamps: true // Add createdAt and updatedAt timestamps
});

// Compound index for category + date for common post listing queries
PostSchema.index({ category: 1, date: -1 });

// Method to increase view count
PostSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Virtual for like count
PostSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
PostSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for excerpt (for previews)
PostSchema.virtual('excerpt').get(function() {
  if (!this.content) return '';
  return this.content.length > 200 
    ? `${this.content.substring(0, 200)}...` 
    : this.content;
});

// Virtual for formatted date
PostSchema.virtual('formattedDate').get(function() {
  return new Date(this.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Ensure virtuals are included when converting to JSON/Object
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', PostSchema);