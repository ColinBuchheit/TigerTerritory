const mongoose = require('mongoose');
const config = require('./config');

require('dotenv').config();

const connectDB = async () => {
  try {
    // Better connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };
    
    console.log(`Attempting to connect to MongoDB at: ${config.mongoURI.replace(/:[^@]+@/, ':*****@')}`);
    
    const conn = await mongoose.connect(config.mongoURI, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
    return conn;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    if (err.name === 'MongooseServerSelectionError') {
      console.error('Could not connect to any MongoDB servers. Check your connection string and ensure your MongoDB server is running.');
    }
    
    // Only exit if called directly - allow error handling elsewhere if imported
    if (require.main === module) {
      process.exit(1);
    } else {
      throw err;
    }
  }
};

module.exports = connectDB;