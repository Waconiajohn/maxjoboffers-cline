// This file is run before each test file
import '@testing-library/jest-dom';

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-openai-api-key';
process.env.AWS_ACCESS_KEY_ID = 'test-aws-access-key-id';
process.env.AWS_SECRET_ACCESS_KEY = 'test-aws-secret-access-key';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_S3_BUCKET = 'test-bucket';
process.env.STRIPE_SECRET_KEY = 'test-stripe-secret-key';
process.env.STRIPE_WEBHOOK_SECRET = 'test-stripe-webhook-secret';
process.env.STRIPE_PUBLISHABLE_KEY = 'test-stripe-publishable-key';
process.env.SENDGRID_API_KEY = 'test-sendgrid-api-key';
process.env.GOOGLE_JOBS_API_KEY = 'test-google-jobs-api-key';

// Mock console.error to keep test output clean
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out expected errors during tests
  if (
    args[0]?.includes?.('Warning:') ||
    args[0]?.includes?.('Error:') ||
    args[0]?.includes?.('Invalid hook call')
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Global test timeout
jest.setTimeout(10000);

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  })
) as jest.Mock;

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
