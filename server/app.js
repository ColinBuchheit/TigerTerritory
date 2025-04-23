const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const config = require('./config/config');

// Import database connection
const connectDB = require('./config/db');

// Import routes
const indexRoutes = require('./routes/index');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./middleware/logger');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [config.clientUrl] // Restrict to specific domains in production
    : '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  exposedHeaders: ['x-auth-token'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(logger);
}

// Rate limiting
app.use('/api/', apiLimiter);

// API Documentation with Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { 
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    docExpansion: 'none'
  }
}));

// Routes
app.use('/api', indexRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Any routes not handled by the API will be handled by React
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;