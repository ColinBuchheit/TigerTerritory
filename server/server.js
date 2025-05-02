const http = require('http');
const app = require('./app');
const config = require('./config/config');

// Port normalization
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  
  if (isNaN(port)) {
    return val;
  }
  
  if (port >= 0) {
    return port;
  }
  
  return false;
};

// Get port from environment or use default
const port = normalizePort(process.env.PORT || config.port || '5000');
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Error handling listeners
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    console.error('Server error not related to listening:', error);
    throw error;
  }
  
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  
  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      console.error('Try using a different port by setting the PORT environment variable');
      process.exit(1);
      break;
    default:
      console.error('Unhandled server error:', error);
      throw error;
  }
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on ${bind}`);
  console.log(`API available at http://localhost:${port}/api`);
  console.log(`API documentation at http://localhost:${port}/api-docs`);
});

// Start the server
server.listen(port);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  console.log(err.stack);
  
  // Close server & exit process gracefully
  server.close(() => {
    process.exit(1);
  });
  
  // If server doesn't close in 5 seconds, force exit
  setTimeout(() => {
    console.error('Forcing process exit after timeout');
    process.exit(1);
  }, 5000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
});