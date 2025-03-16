/**
 * Script to initialize the database schema using direct SQL
 * 
 * This script:
 * 1. Uses the create-tables.sql file to create all tables directly
 * 2. Bypasses Prisma's shadow database requirement
 * 
 * Usage:
 * node scripts/init-database-sql.js
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Client } = require('pg');
require('dotenv').config();

// Path to the SQL file
const sqlFilePath = path.join(__dirname, 'create-tables.sql');

// Check if the SQL file exists
if (!fs.existsSync(sqlFilePath)) {
  console.error(`SQL file not found at: ${sqlFilePath}`);
  process.exit(1);
}

console.log('=== MaxJobOffers Database Initialization (SQL) ===');
console.log('This script will create the database schema using direct SQL.');
console.log(`Using SQL file: ${sqlFilePath}`);

// Function to run SQL file
async function runSqlFile() {
  console.log('\nConnecting to database...');
  
  // Get database connection string from environment variable
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  // Create a new PostgreSQL client
  const client = new Client({
    connectionString: databaseUrl,
  });
  
  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to database successfully');
    
    // Read the SQL file
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Executing SQL script...');
    // Execute the SQL script
    await client.query(sql);
    
    console.log('SQL script executed successfully');
    return true;
  } catch (error) {
    console.error('Error executing SQL script:', error);
    throw error;
  } finally {
    // Close the database connection
    await client.end();
    console.log('Database connection closed');
  }
}

// Alternative function to use psql command
async function runPsqlCommand() {
  console.log('\nRunning SQL script using psql...');
  
  return new Promise((resolve, reject) => {
    // Get database connection string from environment variable
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      reject(new Error('DATABASE_URL environment variable is not set'));
      return;
    }
    
    // Use psql to execute the SQL file
    const psqlCommand = spawn('psql', [
      databaseUrl,
      '-f', sqlFilePath
    ], { 
      stdio: 'inherit',
      shell: true
    });
    
    psqlCommand.on('close', (code) => {
      if (code === 0) {
        console.log('\nDatabase schema created successfully!');
        resolve();
      } else {
        console.error(`\npsql command failed with code ${code}`);
        reject(new Error(`psql command failed with code ${code}`));
      }
    });
    
    psqlCommand.on('error', (err) => {
      console.error('Failed to start psql process:', err);
      reject(err);
    });
  });
}

// Main function
async function main() {
  try {
    // Try using the pg client first
    try {
      await runSqlFile();
    } catch (error) {
      console.log('Failed to execute SQL using pg client, trying psql command...');
      await runPsqlCommand();
    }
    
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
