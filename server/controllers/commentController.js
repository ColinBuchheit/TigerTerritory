const Comment = require('../models/Comment');
const { formatResponse } = require('../utils/responseFormatter');
const { validateRequest, asyncHandler, checkResourceNotFound, checkUnauthorized } = require('../utils/controllerHelpers');

/**
 * @desc    Add comment to a post
 * @route   POST /api/comments/:postId
 * @access  Private
 */
exports.addComment = asyncHandler(async (req, res) => {
  return validateRequest(req, res, async () => {
    const { text } = req.body;
    const postId = req.params.postId;
    
    // Validate postId format
    const postIdPattern = /^[a-z]+-[a-z]+-\d+$/;
    if (!postIdPattern.test(postId)) {
      return res.status(400).json(formatResponse(
        false, 
        'Invalid post ID format. Must be in format: category-type-number (e.g., basketball-news-1)', 
        null
      ));
    }
    
    // Create new comment
    const newComment = new Comment({
      text,
      postId: postId,
      user: req.user.id
    });
    
    const comment = await newComment.save();
    
    // Populate the user field to include name and email
    await comment.populate('user', ['name', 'email', 'avatar']);
    
    // Format comment for frontend
    const formattedComment = {
      id: comment._id,
      text: comment.text,
      postId: comment.postId,
      author: comment.user.name,
      authorEmail: comment.user.email,
      date: comment.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      user: comment.user._id,
      likes: comment.likes
    };
    
    res.status(201).json(formatResponse(true, 'Comment added successfully', formattedComment));
  });
});

/**
 * @desc    Get comments for a post
 * @route   GET /api/comments/:postId
 * @access  Public
 */
exports.getCommentsByPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  const total = await Comment.countDocuments({ postId });
  
  // Get comments with pagination and populate user
  const comments = await Comment.find({ postId })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', ['name', 'email', 'avatar']);
  
  // Format comments for frontend
  const formattedComments = comments.map(comment => ({
    id: comment._id,
    text: comment.text,
    postId: comment.postId,
    author: comment.user.name,
    authorEmail: comment.user.email,
    date: comment.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    user: comment.user._id,
    likes: comment.likes.length
  }));
  
  const paginationInfo = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
  
  res.json(formatResponse(true, 'Comments retrieved successfully', { 
    comments: formattedComments, 
    pagination: paginationInfo 
  }));
});

/**
 * @desc    Update a comment
 * @route   PUT /api/comments/:id
 * @access  Private
 */
exports.updateComment = asyncHandler(async (req, res) => {
  return validateRequest(req, res, async () => {
    const { text } = req.body;
    
    let comment = await Comment.findById(req.params.id);
    
    if (checkResourceNotFound(comment, res, 'Comment')) return;
    
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && checkUnauthorized(comment, req.user.id, res, 'update')) return;
    
    // Update comment
    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text, updatedAt: Date.now() },
      { new: true }
    ).populate('user', ['name', 'email', 'avatar']);
    
    // Format updated comment for frontend
    const formattedComment = {
      id: comment._id,
      text: comment.text,
      postId: comment.postId,
      author: comment.user.name,
      authorEmail: comment.user.email,
      date: comment.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      user: comment.user._id,
      likes: comment.likes.length
    };
    
    res.json(formatResponse(true, 'Comment updated successfully', formattedComment));
  });
});

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  
  if (checkResourceNotFound(comment, res, 'Comment')) return;
  
  // Check if user owns the comment or is an admin
  const isAdmin = req.user.role === 'admin';
  if (!isAdmin && checkUnauthorized(comment, req.user.id, res, 'delete')) return;
  
  await Comment.deleteOne({ _id: comment._id });
  
  res.json(formatResponse(true, 'Comment deleted successfully', {}));
});

/**
 * @desc    Like a comment
 * @route   PUT /api/comments/:id/like
 * @access  Private
 */
exports.likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  
  if (checkResourceNotFound(comment, res, 'Comment')) return;
  
  // Check if comment has already been liked by this user
  if (comment.likes.some(like => like.toString() === req.user.id)) {
    return res.status(400).json(formatResponse(false, 'Comment already liked', null));
  }
  
  comment.likes.unshift(req.user.id);
  await comment.save();
  
  res.json(formatResponse(true, 'Comment liked successfully', { likeCount: comment.likes.length }));
});

/**
 * @desc    Unlike a comment
 * @route   PUT /api/comments/:id/unlike
 * @access  Private
 */
exports.unlikeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  
  if (checkResourceNotFound(comment, res, 'Comment')) return;
  
  // Check if comment has been liked by this user
  if (!comment.likes.some(like => like.toString() === req.user.id)) {
    return res.status(400).json(formatResponse(false, 'Comment has not yet been liked', null));
  }
  
  // Remove user from likes array
  comment.likes = comment.likes.filter(like => like.toString() !== req.user.id);
  await comment.save();
  
  res.json(formatResponse(true, 'Comment unliked successfully', { likeCount: comment.likes.length }));
});