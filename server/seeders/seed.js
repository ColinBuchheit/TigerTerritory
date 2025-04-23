const mongoose = require('mongoose');
const config = require('../config/config');
const { exec } = require('child_process');
const path = require('path');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected for seeding...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

// Run all seeders in sequence
const runAllSeeders = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding process...');
    
    // Run seeders in order
    await runSeeder('userSeeder.js');
    await runSeeder('postSeeder.js');
    await runSeeder('commentSeeder.js');
    await runSeeder('scheduleSeeder.js');
    
    console.log('All data seeded successfully! 🎉');
    process.exit(0);
  } catch (err) {
    console.error('Error running seeders:', err.message);
    process.exit(1);
  }
};

// Helper function to run a seeder file
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

// Start seeding process
runAllSeeders();