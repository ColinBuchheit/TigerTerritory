const dotenv = require('dotenv');
const path = require('path');

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : process.env.NODE_ENV === 'test' 
    ? '.env.test' 
    : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Check for required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(
  envVar => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

module.exports = {
  // Server settings
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB settings
  mongoURI: process.env.MONGO_URI,
  
  // JWT settings
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  
  // API settings
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200'
};