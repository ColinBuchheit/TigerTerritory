const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');

// Import database connection
const connectDB = require('./config/db');

// Import routes
const indexRoutes = require('./routes/index');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./middleware/logger');

// Create standalone server if running directly
if (require.main === module) {
  const app = express();
  
  // Connect to MongoDB
  connectDB();
  
  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(logger.middleware);
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
  
  // Basic info for direct API access
  app.get('/', (req, res) => {
    res.json({
      message: 'API server running standalone',
      endpoints: '/api/*',
      documentation: '/api-docs'
    });
  });
  
  // Error handling middleware
  app.use(errorHandler);
  
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
} else {
  // Just export the routes when imported as a module
  module.exports = indexRoutes;
}