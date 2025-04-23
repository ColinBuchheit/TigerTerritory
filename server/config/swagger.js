const swaggerJsDoc = require('swagger-jsdoc');
const config = require('./config');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sports Updates API',
      version: '1.0.0',
      description: 'API documentation for Sports Updates Website',
      contact: {
        name: 'API Support',
        email: 'support@sportswebsite.com'
      }
    },
    servers: [
      {
        url: config.apiUrl,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // Path to the API docs
  apis: [
    './server/models/*.js',   // Path to Models
    './server/routes/*.js',   // Path to Routes
    './server/docs/components/schemas/*.yaml', // Path to Swagger components
    './server/docs/components/parameters/*.yaml', // Path to Swagger parameters
    './server/docs/components/responses/*.yaml'  // Path to Swagger responses
  ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;