const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

describe('Schedules Endpoints', () => {
  let userToken;
  let adminToken;
  let scheduleId;
  
  beforeEach(async () => {
    // Create a regular user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Schedule User',
        email: 'schedules@example.com',
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
  
  describe('POST /api/schedules', () => {
    it('should create a new schedule (admin only)', async () => {
      const res = await request(app)
        .post('/api/schedules')
        .set('x-auth-token', adminToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Staples Center, Los Angeles',
          startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          status: 'Scheduled'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sport).toEqual('Basketball');
      
      scheduleId = res.body.data._id;
    });
    
    it('should not allow regular users to create schedules', async () => {
      const res = await request(app)
        .post('/api/schedules')
        .set('x-auth-token', userToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Staples Center, Los Angeles',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          status: 'Scheduled'
        });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('GET /api/schedules', () => {
    it('should get all schedules', async () => {
      // Create a schedule first
      await request(app)
        .post('/api/schedules')
        .set('x-auth-token', adminToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Staples Center, Los Angeles',
          startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          status: 'Scheduled'
        });
      
      // Get all schedules
      const res = await request(app)
        .get('/api/schedules');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.schedules)).toBe(true);
      expect(res.body.data.schedules.length).toBeGreaterThan(0);
    });
    
    it('should filter schedules by sport', async () => {
      // Create basketball schedule
      await request(app)
        .post('/api/schedules')
        .set('x-auth-token', adminToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Staples Center, Los Angeles',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          status: 'Scheduled'
        });
      
      // Create football schedule
      await request(app)
        .post('/api/schedules')
        .set('x-auth-token', adminToken)
        .send({
          sport: 'Football',
          league: 'NFL',
          homeTeam: {
            name: 'Kansas City Chiefs',
            logo: 'https://via.placeholder.com/100?text=Chiefs'
          },
          awayTeam: {
            name: 'Buffalo Bills',
            logo: 'https://via.placeholder.com/100?text=Bills'
          },
          venue: 'Arrowhead Stadium, Kansas City',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          status: 'Scheduled'
        });
      
      // Get basketball schedules
      const res = await request(app)
        .get('/api/schedules?sport=Basketball');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.schedules)).toBe(true);
      expect(res.body.data.schedules.length).toBeGreaterThan(0);
      expect(res.body.data.schedules.every(schedule => schedule.sport === 'Basketball')).toBe(true);
    });
  });
  
  describe('GET /api/schedules/:id', () => {
    it('should get schedule by ID', async () => {
      // Create a schedule first
      const scheduleRes = await request(app)
        .post('/api/schedules')
        .set('x-auth-token', adminToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Staples Center, Los Angeles',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          status: 'Scheduled'
        });
      
      const scheduleId = scheduleRes.body.data._id;
      
      // Get schedule by ID
      const res = await request(app)
        .get(`/api/schedules/${scheduleId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toEqual(scheduleId);
    });
  });
  
  describe('PUT /api/schedules/:id', () => {
    it('should update schedule (admin only)', async () => {
      // Create a schedule first
      const scheduleRes = await request(app)
        .post('/api/schedules')
        .set('x-auth-token', adminToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Staples Center, Los Angeles',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          status: 'Scheduled'
        });
      
      const scheduleId = scheduleRes.body.data._id;
      
      // Update schedule
      const res = await request(app)
        .put(`/api/schedules/${scheduleId}`)
        .set('x-auth-token', adminToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Updated Venue',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          status: 'Scheduled'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.venue).toEqual('Updated Venue');
    });
    
    it('should not allow regular users to update schedules', async () => {
      // Create a schedule first
      const scheduleRes = await request(app)
        .post('/api/schedules')
        .set('x-auth-token', adminToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Staples Center, Los Angeles',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          status: 'Scheduled'
        });
      
      const scheduleId = scheduleRes.body.data._id;
      
      // Try to update with regular user
      const res = await request(app)
        .put(`/api/schedules/${scheduleId}`)
        .set('x-auth-token', userToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Unauthorized Update',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          status: 'Scheduled'
        });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('DELETE /api/schedules/:id', () => {
    it('should delete schedule (admin only)', async () => {
      // Create a schedule first
      const scheduleRes = await request(app)
        .post('/api/schedules')
        .set('x-auth-token', adminToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Staples Center, Los Angeles',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          status: 'Scheduled'
        });
      
      const scheduleId = scheduleRes.body.data._id;
      
      // Delete schedule
      const res = await request(app)
        .delete(`/api/schedules/${scheduleId}`)
        .set('x-auth-token', adminToken);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      
      // Verify schedule is deleted
      const getRes = await request(app)
        .get(`/api/schedules/${scheduleId}`);
      
      expect(getRes.statusCode).toEqual(404);
    });
    
    it('should not allow regular users to delete schedules', async () => {
      // Create a schedule first
      const scheduleRes = await request(app)
        .post('/api/schedules')
        .set('x-auth-token', adminToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Staples Center, Los Angeles',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          status: 'Scheduled'
        });
      
      const scheduleId = scheduleRes.body.data._id;
      
      // Try to delete with regular user
      const res = await request(app)
        .delete(`/api/schedules/${scheduleId}`)
        .set('x-auth-token', userToken);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('GET /api/schedules/upcoming', () => {
    it('should get upcoming schedules', async () => {
      // Create a scheduled game
      await request(app)
        .post('/api/schedules')
        .set('x-auth-token', adminToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Staples Center, Los Angeles',
          startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          status: 'Scheduled'
        });
      
      // Get upcoming schedules
      const res = await request(app)
        .get('/api/schedules/upcoming');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data.every(schedule => schedule.status === 'Scheduled')).toBe(true);
    });
  });
  
  describe('GET /api/schedules/live', () => {
    it('should get live schedules', async () => {
      // Create a live game
      await request(app)
        .post('/api/schedules')
        .set('x-auth-token', adminToken)
        .send({
          sport: 'Basketball',
          league: 'NBA',
          homeTeam: {
            name: 'Los Angeles Lakers',
            logo: 'https://via.placeholder.com/100?text=Lakers'
          },
          awayTeam: {
            name: 'Golden State Warriors',
            logo: 'https://via.placeholder.com/100?text=Warriors'
          },
          venue: 'Staples Center, Los Angeles',
          startTime: new Date().toISOString(),
          status: 'Live',
          score: {
            home: 54,
            away: 48
          }
        });
      
      // Get live schedules
      const res = await request(app)
        .get('/api/schedules/live');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.every(schedule => schedule.status === 'Live')).toBe(true);
    });
  });
});