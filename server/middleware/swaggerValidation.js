const { formatResponse } = require('../utils/responseFormatter');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerValidator = require('swagger-express-validator');
const swaggerDocs = require('../config/swagger');

/**
 * Middleware to validate requests against Swagger schema
 */
module.exports = swaggerValidator({
  schema: swaggerDocs,
  validateRequest: true,
  validateResponse: false, // Set to true in development for response validation
  requestValidationFn: (req, data, errors) => {
    if (errors) {
      req.swagger = { errors: errors };
    }
  },
  responseValidationFn: (req, data, errors) => {
    if (errors) {
      console.error('Response validation errors:', errors);
    }
  },
  middlewareOptions: {
    responseOpts: {
      onError: (req, res, data, errors) => {
        res.status(400).json(formatResponse(
          false,
          'Request validation error',
          errors
        ));
      }
    }
  }
});