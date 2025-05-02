const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 4200;

// Add proxy-middleware
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

// Security middleware with CSP disabled for Angular
app.use(helmet({
  contentSecurityPolicy: false
}));

// Compression middleware
app.use(compression());

// Check if we're in production mode with backend server available
if (process.env.NODE_ENV === 'production') {
  // API routes are served by the server/app.js
  app.use('/api', require('./server/app'));
  console.log('Using built-in API server in production mode');
} else {
  // In development, proxy API requests to the backend server
  app.use('/api', apiProxy);
  console.log('Proxying API requests to backend server in development mode');
}

// Serve static files from the Angular app build directory
app.use(express.static(path.join(__dirname, 'client/dist/sports-website')));

// For all GET requests that aren't to API or static files, send back index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/sports-website/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
