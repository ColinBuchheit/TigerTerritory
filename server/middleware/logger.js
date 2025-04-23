/**
 * Custom logger middleware
 * Logs HTTP requests and responses
 */
module.exports = (req, res, next) => {
    const start = new Date();
    
    // Log request
    console.log(`[${start.toISOString()}] ${req.method} ${req.originalUrl}`);
    
    // Log request body in development
    if (process.env.NODE_ENV === 'development' && req.body) {
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
    
    // Capture original end method
    const originalEnd = res.end;
    
    // Override end method
    res.end = function(chunk, encoding) {
      // Calculate response time
      const duration = new Date() - start;
      
      // Log response
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
      
      // Call original end method
      originalEnd.call(this, chunk, encoding);
    };
    
    next();
  };