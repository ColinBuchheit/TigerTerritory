const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 4200;

// Security middleware with CSP disabled for Angular
app.use(helmet({
  contentSecurityPolicy: false
}));

// Compression middleware
app.use(compression());

// Serve static files from the Angular app build directory
app.use(express.static(path.join(__dirname, 'client/dist/sports-website')));

// For all GET requests that aren't to static files, send back index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/sports-website/index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});