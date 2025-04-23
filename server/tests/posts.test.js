const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

describe('Posts Endpoints', () => {
  let userToken;
  let adminToken;
  let postId;
  
  beforeEach(async () => {
    // Create a regular user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Post User',
        email: 'posts@example.com',
        password: 'password123'
      });
    
    userToken = userRes.body.data.token;
    
    // Create an admin user manually
    const user = await User.findOne({ email: 'admin@example.com' });
    if (!user) {
      const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      newAdmin.password = await bcrypt.hash('password123', salt);
      
      await newAdmin.save();
    }
    
    // Login admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });
    
    adminToken = loginRes.body.data.token;
  });
  
  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('x-auth-token', userToken)
        .send({
          title: 'Test Post Title',
          content: 'This is a test post content',
          category: 'Announcements'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toEqual('Test Post Title');
      
      postId = res.body.data._id;
    });
  });
  
  describe('GET /api/posts', () => {
    it('should get all posts', async () => {
      // Create a post first
      await request(app)
        .post('/api/posts')
        .set('x-auth-token', userToken)
        .send({
          title: 'List Test Post',
          content: 'This is content for testing the list endpoint',
          category: 'Events'
        });
      
      // Get all posts
      const res = await request(app)
        .get('/api/posts');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.posts)).toBe(true);
      expect(res.body.data.posts.length).toBeGreaterThan(0);
    });
    
    it('should filter posts by category', async () => {
      // Create posts with different categories
      await request(app)
        .post('/api/posts')
        .set('x-auth-token', userToken)
        .send({
          title: 'Announcement Post',
          content: 'This is an announcement post',
          category: 'Announcements'
        });
      
      await request(app)
        .post('/api/posts')
        .set('x-auth-token', userToken)
        .send({
          title: 'Event Post',
          content: 'This is an event post',
          category: 'Events'
        });
      
      // Get posts filtered by category
      const res = await request(app)
        .get('/api/posts?category=Announcements');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.posts)).toBe(true);
      expect(res.body.data.posts.length).toBeGreaterThan(0);
      expect(res.body.data.posts.every(post => post.category === 'Announcements')).toBe(true);
    });
  });
  
  describe('GET /api/posts/:id', () => {
    it('should get post by ID', async () => {
      // Create a post first
      const postRes = await request(app)
        .post('/api/posts')
        .set('x-auth-token', userToken)
        .send({
          title: 'Single Post Test',
          content: 'This is content for testing getting a single post',
          category: 'Announcements'
        });
      
      const postId = postRes.body.data._id;
      
      // Get post by ID
      const res = await request(app)
        .get(`/api/posts/${postId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toEqual(postId);
    });
  });
  
  describe('PUT /api/posts/:id', () => {
    it('should update post by the owner', async () => {
      // Create a post first
      const postRes = await request(app)
        .post('/api/posts')
        .set('x-auth-token', userToken)
        .send({
          title: 'Update Test Post',
          content: 'This is content for testing update',
          category: 'Announcements'
        });
      
      const postId = postRes.body.data._id;
      
      // Update post
      const res = await request(app)
        .put(`/api/posts/${postId}`)
        .set('x-auth-token', userToken)
        .send({
          title: 'Updated Post Title',
          content: 'Updated content for the post',
          category: 'Announcements'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toEqual('Updated Post Title');
      expect(res.body.data.content).toEqual('Updated content for the post');
    });
    
    it('should not allow a non-owner to update a post', async () => {
      // Create an admin post
      const postRes = await request(app)
        .post('/api/posts')
        .set('x-auth-token', adminToken)
        .send({
          title: 'Admin Post',
          content: 'This is content created by admin',
          category: 'Announcements'
        });
      
      const postId = postRes.body.data._id;
      
      // Try to update with a different user
      const res = await request(app)
        .put(`/api/posts/${postId}`)
        .set('x-auth-token', userToken)
        .send({
          title: 'Unauthorized Update',
          content: 'This update should fail',
          category: 'Announcements'
        });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('DELETE /api/posts/:id', () => {
    it('should delete post by the owner', async () => {
      // Create a post first
      const postRes = await request(app)
        .post('/api/posts')
        .set('x-auth-token', userToken)
        .send({
          title: 'Delete Test Post',
          content: 'This is content for testing delete',
          category: 'Announcements'
        });
      
      const postId = postRes.body.data._id;
      
      // Delete post
      const res = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('x-auth-token', userToken);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      
      // Verify post is deleted
      const getRes = await request(app)
        .get(`/api/posts/${postId}`);
      
      expect(getRes.statusCode).toEqual(404);
    });
    
    it('should not allow a non-owner to delete a post', async () => {
      // Create an admin post
      const postRes = await request(app)
        .post('/api/posts')
        .set('x-auth-token', adminToken)
        .send({
          title: 'Admin Post for Delete',
          content: 'This is content created by admin',
          category: 'Announcements'
        });
      
      const postId = postRes.body.data._id;
      
      // Try to delete with a different user
      const res = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('x-auth-token', userToken);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('GET /api/posts/user/:userId', () => {
    it('should get posts by a specific user', async () => {
      // Create a post
      const userPostRes = await request(app)
        .post('/api/posts')
        .set('x-auth-token', userToken)
        .send({
          title: 'User Specific Post',
          content: 'This is content for testing user-specific posts',
          category: 'Announcements'
        });
      
      const userId = userPostRes.body.data.user;
      
      // Get posts by user
      const res = await request(app)
        .get(`/api/posts/user/${userId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.posts)).toBe(true);
      expect(res.body.data.posts.length).toBeGreaterThan(0);
      expect(res.body.data.posts.every(post => post.user === userId)).toBe(true);
    });
  });
  
  describe('POST /api/posts/:id/like', () => {
    it('should like a post', async () => {
      // Create a post first
      const postRes = await request(app)
        .post('/api/posts')
        .set('x-auth-token', adminToken)
        .send({
          title: 'Like Test Post',
          content: 'This is content for testing likes',
          category: 'Announcements'
        });
      
      const postId = postRes.body.data._id;
      
      // Like the post
      const res = await request(app)
        .post(`/api/posts/${postId}/like`)
        .set('x-auth-token', userToken);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.likes.length).toBeGreaterThan(0);
    });
    
    it('should not allow liking a post twice', async () => {
      // Create a post first
      const postRes = await request(app)
        .post('/api/posts')
        .set('x-auth-token', adminToken)
        .send({
          title: 'Double Like Test',
          content: 'This is content for testing double like',
          category: 'Announcements'
        });
      
      const postId = postRes.body.data._id;
      
      // Like the post once
      await request(app)
        .post(`/api/posts/${postId}/like`)
        .set('x-auth-token', userToken);
      
      // Try to like again
      const res = await request(app)
        .post(`/api/posts/${postId}/like`)
        .set('x-auth-token', userToken);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });
});
