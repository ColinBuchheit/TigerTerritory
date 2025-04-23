const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

let mongoServer;

// Setup in-memory MongoDB server
beforeAll(async () => {
  // Close any existing connection first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
  console.log('Connected to in-memory MongoDB server');
  
  // Create test users
  await createTestUsers();
});

// Disconnect and close MongoDB server
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log('Disconnected from in-memory MongoDB server');
});

// Clear all test data between tests
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});

// Create test users for auth tests
const createTestUsers = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await User.create([
      {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      }
    ]);
    console.log('Test users created successfully');
  } catch (error) {
    console.error('Error creating test users:', error);
  }
};

// Generate JWT token for auth
global.generateToken = (userId) => {
  return jwt.sign(
    { user: { id: userId } },
    config.jwtSecret || 'testsecret',
    { expiresIn: '1h' }
  );
};

module.exports = { mongoose };