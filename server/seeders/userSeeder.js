const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Changed to lowercase
const config = require('../config/config');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('MongoDB connected for seeding users...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

// Sample user data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Sports Blogger',
    email: 'blogger@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Tiger Fan',
    email: 'tiger@example.com',
    password: 'password123',
    role: 'user'
  }
];

// Seed users
const seedUsers = async () => {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    console.log('All users removed');
    
    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return user;
      })
    );
    
    // Insert users
    await User.insertMany(hashedUsers);
    console.log('Users seeded successfully');
    
    // Get and log the created users (without passwords)
    const seededUsers = await User.find().select('-password');
    console.log(`${seededUsers.length} users created:`);
    seededUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });
    
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error seeding users:', err.message);
    process.exit(1);
  }
};

// Run seeder
seedUsers();