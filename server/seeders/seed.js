const mongoose = require('mongoose');
const config = require('../config/config');
const { exec } = require('child_process');
const path = require('path');
const User = require('../models/user'); // Changed to lowercase
const Comment = require('../models/Comment');

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`Connection string: ${config.mongoURI.replace(/:[^@]+@/, ':****@')}`);
    
    await mongoose.connect(config.mongoURI);
    
    console.log('MongoDB connected for seeding...');
    return true;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    return false;
  }
};

// Clear all collections before seeding
const clearCollections = async () => {
  try {
    console.log('Clearing existing collections...');
    
    // Get all collections
    const collections = mongoose.connection.collections;
    
    // Drop each collection
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
      console.log(`Collection ${key} cleared`);
    }
    
    console.log('All collections cleared successfully');
    return true;
  } catch (err) {
    console.error('Error clearing collections:', err.message);
    return false;
  }
};

// Run a seeder file
const runSeeder = (seederFile) => {
  return new Promise((resolve, reject) => {
    const seederPath = path.join(__dirname, seederFile);
    console.log(`Running ${seederFile}...`);
    
    exec(`node ${seederPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${seederFile}:`, error);
        return reject(error);
      }
      
      console.log(stdout);
      if (stderr) console.error(stderr);
      
      resolve();
    });
  });
};

// Run all seeders in sequence
const runAllSeeders = async () => {
  try {
    // Connect to MongoDB
    const connected = await connectDB();
    if (!connected) {
      console.error('Failed to connect to MongoDB. Exiting...');
      process.exit(1);
    }
    
    // Clear all collections
    const cleared = await clearCollections();
    if (!cleared) {
      console.error('Failed to clear collections. Exiting...');
      process.exit(1);
    }
    
    console.log('Starting database seeding process...');
    
    // Run seeders in order
    await runSeeder('userSeeder.js');
    await runSeeder('commentSeeder.js');
    
    console.log('All data seeded successfully! 🎉');
    
    // Display summary of seeded data
    const userCount = await User.countDocuments();
    const commentCount = await Comment.countDocuments();
    
    console.log(`Summary of seeded data:`);
    console.log(`- Users: ${userCount}`);
    console.log(`- Comments: ${commentCount}`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (err) {
    console.error('Error running seeders:', err.message);
    process.exit(1);
  }
};

// Start seeding process
runAllSeeders();