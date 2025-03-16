/**
 * Script to initialize the database schema using Prisma
 * 
 * This script:
 * 1. Uses the schema.prisma file to create the initial database schema
 * 2. Creates all the tables needed for the application
 * 
 * Usage:
 * node scripts/init-database.js
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to the schema.prisma file
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

// Check if the schema.prisma file exists
if (!fs.existsSync(schemaPath)) {
  console.error(`Schema file not found at: ${schemaPath}`);
  process.exit(1);
}

console.log('=== MaxJobOffers Database Initialization ===');
console.log('This script will create the initial database schema.');
console.log(`Using schema file: ${schemaPath}`);

// Function to run Prisma migration
async function runPrismaMigration() {
  console.log('\nRunning Prisma migration...');
  
  return new Promise((resolve, reject) => {
    // Use Prisma migrate to create the initial schema
    const migrationName = 'initial_schema';
    const prismaCommand = spawn('npx', ['prisma', 'migrate', 'dev', '--name', migrationName, '--schema', schemaPath], { 
      stdio: 'inherit',
      shell: true
    });
    
    prismaCommand.on('close', (code) => {
      if (code === 0) {
        console.log('\nDatabase schema created successfully!');
        resolve();
      } else {
        console.error(`\nPrisma migration failed with code ${code}`);
        reject(new Error(`Prisma migration failed with code ${code}`));
      }
    });
    
    prismaCommand.on('error', (err) => {
      console.error('Failed to start Prisma migration process:', err);
      reject(err);
    });
  });
}

// Main function
async function main() {
  try {
    await runPrismaMigration();
    console.log('\n=== Database Initialization Complete ===');
    console.log('You can now run the migration script to add additional fields and tables.');
  } catch (error) {
    console.error('\n=== Database Initialization Failed ===');
    console.error(error);
    process.exit(1);
  }
}

// Run the main function
main();
