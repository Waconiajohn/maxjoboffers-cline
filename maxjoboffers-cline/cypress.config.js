const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
  },
  env: {
    // Environment variables for tests
    testUserEmail: 'test@example.com',
    testUserPassword: 'Password123!',
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
