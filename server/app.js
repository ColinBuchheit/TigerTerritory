const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');

// Import database connection
const connectDB = require('./config/db');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging in development
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Rate limiting in production
if (process.env.NODE_ENV === 'production') {
  const { apiLimiter } = require('./middleware/rateLimiter');
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

// Base route with info
app.get('/', (req, res) => {
  res.json({
    message: 'API server running',
    documentation: '/api-docs'
  });
});

// Connect to database before setting up routes
const setupRoutes = async () => {
  try {
    // Import routes
    const indexRoutes = require('./routes/index');
    
    // Routes
    app.use('/api', indexRoutes);
    
    console.log('Routes initialized successfully');
  } catch (err) {
    console.error('Error initializing routes:', err.message);
  }
};

// Connect to database if running directly
if (require.main === module) {
  connectDB()
    .then(() => {
      console.log('MongoDB connected');
      return setupRoutes();
    })
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
} else {
  // When imported as a module (e.g., for testing)
  connectDB()
    .then(() => {
      console.log('MongoDB connected');
      return setupRoutes();
    })
    .catch(err => {
      console.error('MongoDB connection error when imported as module:', err.message);
    });
}

// Error handling middleware - must be after routes
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server if running directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}

// Export for use as a module
module.exports = app;