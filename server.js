const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 4200;

// Security middleware with CSP disabled for Angular
app.use(helmet({
  contentSecurityPolicy: false
}));

// Compression middleware
app.use(compression());

// Import API routes in production mode
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');
  
  // Import and connect to database
  const connectDB = require('./server/config/db');
  connectDB()
    .then(() => console.log('MongoDB connected in production mode'))
    .catch(err => console.error('MongoDB connection error:', err.message));
  
  // Import API routes
  const apiRoutes = require('./server/routes/index');
  
  // Mount API routes
  app.use('/api', apiRoutes);
} else {
  // In development, proxy API requests to the backend server
  console.log('Running in development mode - proxying API requests to backend server');
  
  const apiProxy = createProxyMiddleware('/api', {
    target: 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api'
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).send('Proxy Error');
    }
  });
  
  app.use('/api', apiProxy);
}

// Debug - check Angular build path
const angularBuildPath = path.join(__dirname, 'client/dist/sports-website/browser');
console.log(`Checking for Angular build at: ${angularBuildPath}`);
console.log(`Directory exists: ${require('fs').existsSync(angularBuildPath)}`);

// Serve static files from the Angular app build directory
app.use(express.static(angularBuildPath));

// For all GET requests that aren't to API or static files, send back index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(angularBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});