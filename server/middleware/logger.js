const winston = require('winston');
const { format, transports } = winston;
const path = require('path');

// Define the log directory
const logDir = path.join(__dirname, '../logs');

// Define log formats
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    return `[${timestamp}] ${level}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.json()
);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Create the logger
const logger = winston.createLogger({
  levels,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    // Console transport for all environments
    new transports.Console({
      format: consoleFormat,
    }),
    
    // File transports for production
    ...(process.env.NODE_ENV === 'production'
      ? [
          // Error log
          new transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            format: fileFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          
          // Combined log
          new transports.File({
            filename: path.join(logDir, 'combined.log'),
            format: fileFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
        ]
      : []),
  ],
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Express middleware function
const middleware = (req, res, next) => {
  const start = new Date();
  
  // Log request
  logger.http(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  
  // Log request body in development
  if (process.env.NODE_ENV === 'development' && req.body) {
    logger.debug('Request Body:', { body: req.body });
  }
  
  // Capture original end method
  const originalEnd = res.end;
  
  // Override end method with try/finally to ensure original is always called
  res.end = function(chunk, encoding) {
    try {
      // Calculate response time
      const duration = new Date() - start;
      
      // Log response
      logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
      
      // Log error responses
      if (res.statusCode >= 400) {
        logger.warn(`Error Response: ${res.statusCode}`, {
          method: req.method,
          url: req.originalUrl,
          duration,
          body: req.body,
        });
      }
    } finally {
      // Always call original end method
      originalEnd.call(this, chunk, encoding);
    }
  };
  
  next();
};

// Export both the logger and middleware function
module.exports = {
  logger,
  middleware
};