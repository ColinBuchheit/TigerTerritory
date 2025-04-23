const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

describe('Comments Endpoints', () => {
  let userToken;
  let userId;
  const postId = 'basketball-news-1'; // Using hardcoded post ID that matches frontend
  
  beforeEach(async () => {
    // Create a test user
    const testUser = new User({
      name: 'Comment Test User',
      email: 'commenttest@example.com',
      password: 'password123'
    });
    await testUser.save();
    userId = testUser._id.toString();
    
    // Generate token for the user
    const payload = {
      user: {
        id: userId
      }
    };
    
    userToken = jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: '1h' }
    );
  });
  
  afterEach(async () => {
    // Clean up test data
    await User.deleteMany();
    await Comment.deleteMany();
  });
  
  describe('POST /api/comments/:postId', () => {
    it('should add a comment to a post', async () => {
      const res = await request(app)
        .post(`/api/comments/${postId}`)
        .set('x-auth-token', userToken)
        .send({
          text: 'This is a test comment'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.text).toEqual('This is a test comment');
      expect(res.body.data.postId).toEqual(postId);
      expect(res.body.data.user._id).toEqual(userId);
    });
    
    it('should require authentication', async () => {
      const res = await request(app)
        .post(`/api/comments/${postId}`)
        .send({
          text: 'This should fail without auth'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
    
    it('should validate comment content', async () => {
      const res = await request(app)
        .post(`/api/comments/${postId}`)
        .set('x-auth-token', userToken)
        .send({
          text: ''
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('GET /api/comments/:postId', () => {
    it('should get all comments for a post', async () => {
      // Add a comment first
      await Comment.create({
        text: 'Comment for get all test',
        postId: postId,
        user: userId
      });
      
      // Get comments
      const res = await request(app)
        .get(`/api/comments/${postId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].postId).toEqual(postId);
    });
    
    it('should return empty array for non-existent postId', async () => {
      const res = await request(app)
        .get('/api/comments/nonexistent-post-id');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });
  });
  
  describe('PUT /api/comments/:id', () => {
    it('should update a comment', async () => {
      // Create a comment
      const comment = await Comment.create({
        text: 'Original comment',
        postId: postId,
        user: userId
      });
      
      // Update comment
      const res = await request(app)
        .put(`/api/comments/${comment._id}`)
        .set('x-auth-token', userToken)
        .send({
          text: 'Updated comment'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.text).toEqual('Updated comment');
    });
    
    it('should not update comment created by another user', async () => {
      // Create another user
      const anotherUser = new User({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123'
      });
      await anotherUser.save();
      
      // Create a comment as the first user
      const comment = await Comment.create({
        text: 'Comment by first user',
        postId: postId,
        user: userId
      });
      
      // Generate token for the second user
      const anotherUserToken = jwt.sign(
        { user: { id: anotherUser._id.toString() } },
        config.jwtSecret,
        { expiresIn: '1h' }
      );
      
      // Attempt to update with second user
      const res = await request(app)
        .put(`/api/comments/${comment._id}`)
        .set('x-auth-token', anotherUserToken)
        .send({
          text: 'Unauthorized update'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('DELETE /api/comments/:id', () => {
    it('should delete a comment', async () => {
      // Create a comment
      const comment = await Comment.create({
        text: 'Comment to delete',
        postId: postId,
        user: userId
      });
      
      // Delete comment
      const res = await request(app)
        .delete(`/api/comments/${comment._id}`)
        .set('x-auth-token', userToken);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      
      // Verify deletion
      const deletedComment = await Comment.findById(comment._id);
      expect(deletedComment).toBeNull();
    });
    
    it('should not delete comment created by another user', async () => {
      // Create another user
      const anotherUser = new User({
        name: 'Another Delete User',
        email: 'anotherdelete@example.com',
        password: 'password123'
      });
      await anotherUser.save();
      
      // Create a comment as the first user
      const comment = await Comment.create({
        text: 'Comment for delete test',
        postId: postId,
        user: userId
      });
      
      // Generate token for the second user
      const anotherUserToken = jwt.sign(
        { user: { id: anotherUser._id.toString() } },
        config.jwtSecret,
        { expiresIn: '1h' }
      );
      
      // Attempt to delete with second user
      const res = await request(app)
        .delete(`/api/comments/${comment._id}`)
        .set('x-auth-token', anotherUserToken);
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
      
      // Verify comment still exists
      const existingComment = await Comment.findById(comment._id);
      expect(existingComment).not.toBeNull();
    });
  });
});