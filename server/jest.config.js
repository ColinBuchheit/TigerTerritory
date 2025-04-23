module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    testTimeout: 30000,
    setupFilesAfterEnv: ['./tests/setup.js'],
    // Set NODE_ENV to test for all tests
    testEnvironment: 'node',
    testEnvironmentOptions: {
      NODE_ENV: 'test'
    }
  };