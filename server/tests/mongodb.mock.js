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
    
    // Create a mock connection object
    const mockConnection = {
      host: 'localhost',
      collections: {},
      readyState: 1,
      on: jest.fn(),
      once: jest.fn(),
      close: jest.fn().mockResolvedValue(true)
    };
    
    return {
      ...originalMongoose,
      connect: jest.fn().mockResolvedValue({
        connection: mockConnection
      }),
      disconnect: jest.fn().mockResolvedValue(true),
      connection: {
        ...originalMongoose.connection,
        ...mockConnection
      }
    };
  });