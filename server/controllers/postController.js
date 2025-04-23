const Post = require('../models/Post');
const { formatResponse } = require('../utils/responseFormatter');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
exports.getPosts = async (req, res) => {
  try {
    // Get query parameters for pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Get category filter if provided
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    const posts = await Post.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', ['name']);
    
    // Get total count for pagination info
    const total = await Post.countDocuments(filter);
    
    const paginationInfo = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
    
    res.json(formatResponse(true, 'Posts retrieved successfully', { posts, pagination: paginationInfo }));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Get post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', ['name'])
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name'
        }
      });
    
    if (!post) {
      return res.status(404).json(formatResponse(false, 'Post not found', null));
    }
    
    res.json(formatResponse(true, 'Post retrieved successfully', post));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json(formatResponse(false, 'Post not found', null));
    }
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Create a post
 * @route   POST /api/posts
 * @access  Private
 */
exports.createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, 'Validation error', errors.array()));
    }
    
    const { title, content, category, imageUrl } = req.body;
    
    const newPost = new Post({
      title,
      content,
      category,
      imageUrl,
      user: req.user.id
    });
    
    const post = await newPost.save();
    
    res.status(201).json(formatResponse(true, 'Post created successfully', post));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
exports.updatePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, 'Validation error', errors.array()));
    }
    
    const { title, content, category, imageUrl } = req.body;
    
    // Find post
    let post = await Post.findById(req.params.id);
    
    // Check if post exists
    if (!post) {
      return res.status(404).json(formatResponse(false, 'Post not found', null));
    }
    
    // Check user is post owner
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json(formatResponse(false, 'Not authorized to update this post', null));
    }
    
    // Update post
    post = await Post.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        content, 
        category, 
        imageUrl
      },
      { new: true }
    );
    
    res.json(formatResponse(true, 'Post updated successfully', post));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json(formatResponse(false, 'Post not found', null));
    }
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
exports.deletePost = async (req, res) => {
  try {
    // Find post
    const post = await Post.findById(req.params.id);
    
    // Check if post exists
    if (!post) {
      return res.status(404).json(formatResponse(false, 'Post not found', null));
    }
    
    // Check user is post owner
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json(formatResponse(false, 'Not authorized to delete this post', null));
    }
    
    // Delete post - using deleteOne instead of deprecated remove()
    await Post.deleteOne({ _id: post._id });
    
    res.json(formatResponse(true, 'Post deleted successfully', {}));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json(formatResponse(false, 'Post not found', null));
    }
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};