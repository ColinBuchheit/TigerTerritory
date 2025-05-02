const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Determine Angular build path
const angularBuildPath = path.join(__dirname, 'client/dist/sports-website');
console.log(`Angular build path: ${angularBuildPath}`);
console.log(`Directory exists: ${fs.existsSync(angularBuildPath)}`);

// Connect to MongoDB in production
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');
  
  // Connect to MongoDB
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('MONGO_URI environment variable is not set');
    process.exit(1);
  }
  
  // Connect without the connectDB helper to simplify
  mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
      // Don't exit on MongoDB error, still serve static files
    });
  
  // Import and use routes
  try {
    const indexRoutes = require('./server/routes/index');
    app.use('/api', indexRoutes);
    console.log('API routes mounted successfully');
  } catch (error) {
    console.error('Error mounting API routes:', error);
  }
} else {
  // Development mode - not used in Render
  console.log('Running in development mode');
}

// Serve static files from Angular build
if (fs.existsSync(angularBuildPath)) {
  app.use(express.static(angularBuildPath));
  console.log('Serving Angular static files');
  
  // For any route that doesn't match an API route or static file
  // serve the Angular index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(angularBuildPath, 'index.html'));
  });
} else {
  console.error('Angular build directory not found');
  app.get('/', (req, res) => {
    res.send('Angular build not found');
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});