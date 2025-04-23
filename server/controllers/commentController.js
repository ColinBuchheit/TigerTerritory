const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { formatResponse } = require('../utils/responseFormatter');
const { validationResult } = require('express-validator');

/**
 * @desc    Add comment to a post
 * @route   POST /api/comments/:postId
 * @access  Private
 */
exports.addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, 'Validation error', errors.array()));
    }
    
    const { text } = req.body;
    const postId = req.params.postId;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json(formatResponse(false, 'Post not found', null));
    }
    
    // Create new comment
    const newComment = new Comment({
      text,
      post: postId,
      user: req.user.id
    });
    
    // Save comment
    const comment = await newComment.save();
    
    // Add comment to post's comments array
    post.comments.push(comment._id);
    await post.save();
    
    // Populate user info
    await comment.populate('user', ['name']).execPopulate();
    
    res.status(201).json(formatResponse(true, 'Comment added successfully', comment));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json(formatResponse(false, 'Post not found', null));
    }
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Get comments for a post
 * @route   GET /api/comments/:postId
 * @access  Public
 */
exports.getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json(formatResponse(false, 'Post not found', null));
    }
    
    // Get comments
    const comments = await Comment.find({ post: postId })
      .sort({ date: -1 })
      .populate('user', ['name']);
    
    res.json(formatResponse(true, 'Comments retrieved successfully', comments));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json(formatResponse(false, 'Post not found', null));
    }
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Update a comment
 * @route   PUT /api/comments/:id
 * @access  Private
 */
exports.updateComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, 'Validation error', errors.array()));
    }
    
    const { text } = req.body;
    
    // Find comment
    let comment = await Comment.findById(req.params.id);
    
    // Check if comment exists
    if (!comment) {
      return res.status(404).json(formatResponse(false, 'Comment not found', null));
    }
    
    // Check user is comment owner
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json(formatResponse(false, 'Not authorized to update this comment', null));
    }
    
    // Update comment
    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    ).populate('user', ['name']);
    
    res.json(formatResponse(true, 'Comment updated successfully', comment));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json(formatResponse(false, 'Comment not found', null));
    }
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
exports.deleteComment = async (req, res) => {
  try {
    // Find comment
    const comment = await Comment.findById(req.params.id);
    
    // Check if comment exists
    if (!comment) {
      return res.status(404).json(formatResponse(false, 'Comment not found', null));
    }
    
    // Check user is comment owner
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json(formatResponse(false, 'Not authorized to delete this comment', null));
    }
    
    // Remove comment from post's comments array
    await Post.findByIdAndUpdate(
      comment.post,
      { $pull: { comments: comment._id } }
    );
    
    // Delete comment
    await comment.remove();
    
    res.json(formatResponse(true, 'Comment deleted successfully', {}));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json(formatResponse(false, 'Comment not found', null));
    }
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};