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

// Connect to MongoDB only in non-test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}


// Adjust CORS based on whether we're running in an integrated server or standalone
const corsConfig = () => {
  // If running as part of the unified server (production), allow same-origin requests
  if (process.env.NODE_ENV === 'production') {
    return cors({
      // In production when integrated in server.js, this allows same-origin requests
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'x-auth-token'],
      exposedHeaders: ['x-auth-token'],
      credentials: true
    });
  } else {
    // In development when running as separate servers, allow specific origins
    const allowedOrigins = [
      'http://localhost:4200' // local angular dev
    ];
    
    return cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('CORS not allowed for this origin: ' + origin));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'x-auth-token'],
      exposedHeaders: ['x-auth-token'],
      credentials: true
    });
  }
};

app.use(corsConfig());
app.options('*', corsConfig()); // Handle preflight requests



// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    const { middleware } = require('./middleware/logger');
    app.use(middleware);
  }
  
// Rate limiting - disable in test environment
if (process.env.NODE_ENV !== 'test') {
  app.use('/api/', apiLimiter);
}

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

// Note: Static file serving is handled by the parent server.js in production
// This is only used when running the API server standalone
if (process.env.NODE_ENV === 'development') {
  // In development, provide some basic info for direct API access
  app.get('/', (req, res) => {
    res.json({
      message: 'API server running',
      endpoints: '/api/*'
    });
  });
}

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;
