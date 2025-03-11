/**
 * Script to run all tests for the MaxJobOffers application
 * 
 * This script:
 * 1. Runs unit tests
 * 2. Runs integration tests
 * 3. Runs end-to-end tests
 * 
 * Usage:
 * node scripts/run-tests.js [--unit] [--integration] [--e2e] [--all]
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);
const runUnit = args.includes('--unit') || args.includes('--all') || args.length === 0;
const runIntegration = args.includes('--integration') || args.includes('--all') || args.length === 0;
const runE2E = args.includes('--e2e') || args.includes('--all');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Run a command and return a promise
 */
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`${colors.bright}${colors.blue}Running command:${colors.reset} ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Run unit tests
 */
async function runUnitTests() {
  console.log(`\n${colors.bright}${colors.magenta}=== Running Unit Tests ===${colors.reset}`);
  
  try {
    // Find all test files
    const testFiles = [
      'src/actions/job.test.ts',
      'src/actions/coverLetter.test.ts',
      // Add more test files as they are created
    ];
    
    // Check if files exist
    const existingTestFiles = testFiles.filter(file => 
      fs.existsSync(path.join(process.cwd(), file))
    );
    
    if (existingTestFiles.length === 0) {
      console.log(`${colors.yellow}No unit test files found.${colors.reset}`);
      return;
    }
    
    // Run Jest with the test files
    await runCommand('npx', ['jest', '--config', 'jest.config.js', ...existingTestFiles]);
    
    console.log(`${colors.green}✅ Unit tests completed successfully.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}❌ Unit tests failed:${colors.reset}`, error.message);
    throw error;
  }
}

/**
 * Run integration tests
 */
async function runIntegrationTests() {
  console.log(`\n${colors.bright}${colors.magenta}=== Running Integration Tests ===${colors.reset}`);
  
  try {
    // Find all integration test files
    const testFiles = [
      'src/tests/integration/jobApplication.test.ts',
      // Add more integration test files as they are created
    ];
    
    // Check if files exist
    const existingTestFiles = testFiles.filter(file => 
      fs.existsSync(path.join(process.cwd(), file))
    );
    
    if (existingTestFiles.length === 0) {
      console.log(`${colors.yellow}No integration test files found.${colors.reset}`);
      return;
    }
    
    // Run Jest with the integration test files
    await runCommand('npx', ['jest', '--config', 'jest.config.js', ...existingTestFiles]);
    
    console.log(`${colors.green}✅ Integration tests completed successfully.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}❌ Integration tests failed:${colors.reset}`, error.message);
    throw error;
  }
}

/**
 * Run end-to-end tests
 */
async function runE2ETests() {
  console.log(`\n${colors.bright}${colors.magenta}=== Running End-to-End Tests ===${colors.reset}`);
  
  try {
    // Check if Cypress is installed
    try {
      await runCommand('npx', ['cypress', 'version']);
    } catch (error) {
      console.log(`${colors.yellow}Cypress not found. Installing Cypress and dependencies...${colors.reset}`);
      await runCommand('npm', ['install', 'cypress', 'cypress-file-upload', '@percy/cypress', '--save-dev']);
    }
    
    // Check if the application is running
    console.log(`${colors.cyan}Checking if the application is running...${colors.reset}`);
    
    try {
      const isRunning = await new Promise((resolve) => {
        const req = require('http').request({
          hostname: 'localhost',
          port: 3001,
          path: '/',
          method: 'HEAD',
          timeout: 3000
        }, (res) => {
          resolve(res.statusCode < 400);
        });
        
        req.on('error', () => {
          resolve(false);
        });
        
        req.end();
      });
      
      if (!isRunning) {
        console.log(`${colors.yellow}Application is not running. Please start the application before running E2E tests.${colors.reset}`);
        console.log(`${colors.cyan}You can start the application with:${colors.reset} npm run start`);
        return;
      }
    } catch (error) {
      console.log(`${colors.yellow}Error checking if application is running:${colors.reset}`, error.message);
      console.log(`${colors.yellow}Please start the application before running E2E tests.${colors.reset}`);
      return;
    }
    
    // Run Cypress tests
    console.log(`${colors.cyan}Running Cypress tests...${colors.reset}`);
    await runCommand('npx', ['cypress', 'run']);
    
    console.log(`${colors.green}✅ End-to-end tests completed successfully.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}❌ End-to-end tests failed:${colors.reset}`, error.message);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  console.log(`${colors.bright}${colors.cyan}=== MaxJobOffers Test Runner ===${colors.reset}`);
  
  try {
    // Run unit tests
    if (runUnit) {
      await runUnitTests();
    }
    
    // Run integration tests
    if (runIntegration) {
      await runIntegrationTests();
    }
    
    // Run end-to-end tests
    if (runE2E) {
      await runE2ETests();
    }
    
    console.log(`\n${colors.bright}${colors.green}=== All tests completed successfully ===${colors.reset}`);
  } catch (error) {
    console.error(`\n${colors.bright}${colors.red}=== Tests failed ===${colors.reset}`);
    process.exit(1);
  }
}

// Run the main function
main();
