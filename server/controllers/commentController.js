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
    author: comment.user ? comment.user.name : 'Anonymous',
    authorEmail: comment.user ? comment.user.email : '',
    date: comment.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    user: comment.user ? comment.user._id : null,
    likes: comment.likes && Array.isArray(comment.likes) ? comment.likes.length : 0
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
    
    // Check if user is authorized (admin or owner)
    if (checkUnauthorized(comment, req.user.id, res, req.user.role, 'update')) return;
    
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
      user: comment.user._id
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
  
  // Check if user is authorized (admin or owner)
  if (checkUnauthorized(comment, req.user.id, res, req.user.role, 'delete')) return;
  
  await Comment.deleteOne({ _id: comment._id });
  
  res.json(formatResponse(true, 'Comment deleted successfully', {}));
});

/**
 * @desc    Get all comments (admin only)
 * @route   GET /api/comments
 * @access  Admin
 */
exports.getAllComments = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json(formatResponse(false, 'Access denied. Admin role required', null));
  }
  
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  
  const total = await Comment.countDocuments();
  
  // Get all comments with pagination and populate user
  const comments = await Comment.find()
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', ['name', 'email', 'avatar']);
  
  // Format comments for frontend
  const formattedComments = comments.map(comment => ({
    id: comment._id,
    text: comment.text,
    postId: comment.postId,
    author: comment.user ? comment.user.name : 'Anonymous',
    authorEmail: comment.user ? comment.user.email : '',
    date: comment.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    user: comment.user ? comment.user._id : null
  }));
  
  const paginationInfo = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
  
  res.json(formatResponse(true, 'All comments retrieved successfully', { 
    comments: formattedComments, 
    pagination: paginationInfo 
  }));
});