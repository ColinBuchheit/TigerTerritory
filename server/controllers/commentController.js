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
    
    // Create new comment
    const newComment = new Comment({
      text,
      postId: postId,
      user: req.user.id
    });
    
    const comment = await newComment.save();
    await comment.populate('user', ['name']);
    
    res.status(201).json(formatResponse(true, 'Comment added successfully', comment));
  });
});

/**
 * @desc    Get comments for a post
 * @route   GET /api/comments/:postId
 * @access  Public
 */
exports.getCommentsByPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  
  const comments = await Comment.find({ postId: postId })
    .sort({ date: -1 })
    .populate('user', ['name']);
  
  res.json(formatResponse(true, 'Comments retrieved successfully', comments));
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
    
    if (checkUnauthorized(comment, req.user.id, res, 'update')) return;
    
    // Update comment
    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    ).populate('user', ['name']);
    
    res.json(formatResponse(true, 'Comment updated successfully', comment));
  });
});

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
exports.deleteComment = asyncHandler(async (req, res) => {
  // Find comment
  const comment = await Comment.findById(req.params.id);
  
  if (checkResourceNotFound(comment, res, 'Comment')) return;
  
  if (checkUnauthorized(comment, req.user.id, res, 'delete')) return;
  
  await Comment.deleteOne({ _id: comment._id });
  
  res.json(formatResponse(true, 'Comment deleted successfully', {}));
});