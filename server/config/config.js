const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  // Server settings
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB settings
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/sports_website',
  
  // JWT settings
  jwtSecret: process.env.JWT_SECRET || 'your_default_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  
  // API settings
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200'
};