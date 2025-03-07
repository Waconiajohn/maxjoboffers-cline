// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Add better error messages for assertions
Cypress.Commands.overwrite('should', (originalFn, subject, expectation, ...args) => {
  const customMatchers = {
    'be.visible': () => 'Element should be visible, but it\'s not',
    'exist': () => 'Element should exist, but it doesn\'t',
    'have.length': (length) => `Element should have length ${length}, but it doesn't`,
    'have.value': (value) => `Element should have value "${value}", but it doesn't`,
    'contain': (text) => `Element should contain text "${text}", but it doesn't`,
    'include': (value) => `URL should include "${value}", but it doesn't`,
  };

  const message = customMatchers[expectation]
    ? customMatchers[expectation](...args)
    : `Assertion failed: ${expectation}`;

  try {
    return originalFn(subject, expectation, ...args);
  } catch (error) {
    error.message = `${message}\n${error.message}`;
    throw error;
  }
});

// Add visual testing support
if (Cypress.config('isVisualRegressionTest')) {
  require('@percy/cypress');
}

// Add file upload support
import 'cypress-file-upload';
