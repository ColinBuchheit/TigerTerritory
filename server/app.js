const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
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

// Connect to database if running directly
if (require.main === module) {
  connectDB()
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err.message));
}

// Routes
app.use('/api', indexRoutes);

// Base route with info
app.get('/', (req, res) => {
  res.json({
    message: 'API server running',
    documentation: '/api-docs'
  });
});

// Error handling middleware
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