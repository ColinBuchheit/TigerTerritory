const swaggerJsDoc = require('swagger-jsdoc');
const config = require('./config');
const path = require('path');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sports Website API',
      version: '1.0.0',
      description: 'API documentation for a sports news and schedule tracking website',
      contact: {
        name: 'Sports Website Team',
        email: 'support@sportswebsite.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `${config.apiUrl}/api`,
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'User authentication endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Posts',
        description: 'Sports news and blog posts'
      },
      {
        name: 'Comments',
        description: 'Post comments'
      },
      {
        name: 'Schedules',
        description: 'Sports game schedules'
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
    path.join(__dirname, '../models/*.js'),     // Path to Models
    path.join(__dirname, '../routes/*.js'),     // Path to Routes
    path.join(__dirname, '../docs/components/schemas/*.yaml'), // Path to Swagger components
    path.join(__dirname, '../docs/components/parameters/*.yaml'), // Path to Swagger parameters
    path.join(__dirname, '../docs/components/responses/*.yaml')  // Path to Swagger responses
  ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;