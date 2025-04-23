const Post = require('../models/Post');
const { formatResponse } = require('../utils/responseFormatter');
const { validateRequest, asyncHandler, checkResourceNotFound, checkUnauthorized } = require('../utils/controllerHelpers');

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
exports.getPosts = asyncHandler(async (req, res) => {
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
});

/**
 * @desc    Get post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('user', ['name'])
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name'
      }
    });
  
  if (checkResourceNotFound(post, res, 'Post')) return;
  
  res.json(formatResponse(true, 'Post retrieved successfully', post));
});

/**
 * @desc    Create a post
 * @route   POST /api/posts
 * @access  Private
 */
exports.createPost = asyncHandler(async (req, res) => {
  return validateRequest(req, res, async () => {
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
  });
});

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
exports.updatePost = asyncHandler(async (req, res) => {
  return validateRequest(req, res, async () => {
    const { title, content, category, imageUrl } = req.body;
    
    // Find post
    let post = await Post.findById(req.params.id);
    
    if (checkResourceNotFound(post, res, 'Post')) return;
    
    // Check user is post owner
    if (checkUnauthorized(post, req.user.id, res, 'update')) return;
    
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
  });
});

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
exports.deletePost = asyncHandler(async (req, res) => {
  // Find post
  const post = await Post.findById(req.params.id);
  
  if (checkResourceNotFound(post, res, 'Post')) return;
  
  // Check user is post owner
  if (checkUnauthorized(post, req.user.id, res, 'delete')) return;
  
  // Delete post - using deleteOne instead of deprecated remove()
  await Post.deleteOne({ _id: post._id });
  
  res.json(formatResponse(true, 'Post deleted successfully', {}));
});