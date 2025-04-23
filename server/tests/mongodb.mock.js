// Mock MongoDB memory server
jest.mock('mongodb-memory-server', () => {
    const { EventEmitter } = require('events');
    
    class MockMemoryServer extends EventEmitter {
      constructor() {
        super();
        this.uri = 'mongodb://localhost:27017/test-db';
      }
      
      async start() {
        return this;
      }
      
      async stop() {
        return true;
      }
      
      getUri() {
        return this.uri;
      }
    }
    
    return { MongoMemoryServer: MockMemoryServer };
  });
  
  // Mock mongoose
  jest.mock('mongoose', () => {
    const originalMongoose = jest.requireActual('mongoose');
    
    return {
      ...originalMongoose,
      connect: jest.fn().mockResolvedValue({
        connection: {
          host: 'localhost',
          on: jest.fn(),
          once: jest.fn(),
          close: jest.fn().mockResolvedValue(true)
        }
      }),
      disconnect: jest.fn().mockResolvedValue(true),
      connection: {
        ...originalMongoose.connection,
        collections: {},
        on: jest.fn(),
        close: jest.fn().mockResolvedValue(true)
      }
    };
  });