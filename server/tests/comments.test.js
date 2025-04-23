const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('Comments Endpoints', () => {
  let userToken;
  let userId;
  let postId;
  let commentId;
  
  beforeEach(async () => {
    // Create a user and get token
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Comment User',
        email: 'comments@example.com',
        password: 'password123'
      });
    
    userToken = registerRes.body.data.token;
    
    // Get user ID
    const user = await User.findOne({ email: 'comments@example.com' });
    userId = user._id.toString();
    
    // Create a post for comments
    const postRes = await request(app)
      .post('/api/posts')
      .set('x-auth-token', userToken)
      .send({
        title: 'Post for Comments',
        content: 'This post will have comments',
        category: 'Basketball'
      });
    
    postId = postRes.body.data._id;
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
      expect(res.body.data.post).toEqual(postId);
      expect(res.body.data.user._id).toEqual(userId);
      
      commentId = res.body.data._id;
    });
    
    it('should not add comment to non-existent post', async () => {
      const res = await request(app)
        .post('/api/comments/61d23b4667d0d8992e610c85') // Non-existent ID
        .set('x-auth-token', userToken)
        .send({
          text: 'This should fail'
        });
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('GET /api/comments/:postId', () => {
    it('should get all comments for a post', async () => {
      // Add a comment first
      await request(app)
        .post(`/api/comments/${postId}`)
        .set('x-auth-token', userToken)
        .send({
          text: 'Comment for get all test'
        });
      
      // Get comments
      const res = await request(app)
        .get(`/api/comments/${postId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].post).toEqual(postId);
    });
  });
  
  describe('PUT /api/comments/:id', () => {
    it('should update a comment', async () => {
      // Add a comment first
      const commentRes = await request(app)
        .post(`/api/comments/${postId}`)
        .set('x-auth-token', userToken)
        .send({
          text: 'Original comment'
        });
      
      const commentId = commentRes.body.data._id;
      
      // Update comment
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .set('x-auth-token', userToken)
        .send({
          text: 'Updated comment'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.text).toEqual('Updated comment');
    });
    
    it('should not update comment created by another user', async () => {
      // Create first user and comment
      const firstUserRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'First Comment User',
          email: 'first.comment@example.com',
          password: 'password123'
        });
      
      const firstUserToken = firstUserRes.body.data.token;
      
      const commentRes = await request(app)
        .post(`/api/comments/${postId}`)
        .set('x-auth-token', firstUserToken)
        .send({
          text: 'First user comment'
        });
      
      const commentId = commentRes.body.data._id;
      
      // Try to update with second user
      const secondUserRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Second Comment User',
          email: 'second.comment@example.com',
          password: 'password123'
        });
      
      const secondUserToken = secondUserRes.body.data.token;
      
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .set('x-auth-token', secondUserToken)
        .send({
          text: 'Unauthorized update'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('DELETE /api/comments/:id', () => {
    it('should delete a comment', async () => {
      // Add a comment first
      const commentRes = await request(app)
        .post(`/api/comments/${postId}`)
        .set('x-auth-token', userToken)
        .send({
          text: 'Comment to delete'
        });
      
      const commentId = commentRes.body.data._id;
      
      // Delete comment
      const res = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('x-auth-token', userToken);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });
});