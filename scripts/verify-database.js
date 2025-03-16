/**
 * Script to verify the database schema
 * 
 * This script:
 * 1. Connects to the database
 * 2. Lists all tables
 * 3. Verifies that the expected tables exist
 * 
 * Usage:
 * node scripts/verify-database.js
 */

const { Client } = require('pg');
require('dotenv').config();

// Expected tables
const expectedTables = [
  'User',
  'Resume',
  'Job',
  'JobApplication',
  'CoverLetter',
  'Interview',
  'LinkedInProfile',
  'LinkedInPost',
  'NetworkingStrategy',
  'SavedJob',
  'ApplicationStatusHistory',
  'PaymentHistory'
];

// Function to verify database schema
async function verifyDatabaseSchema() {
  console.log('=== MaxJobOffers Database Verification ===');
  console.log('This script will verify that all expected tables exist in the database.');
  
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
    
    // Query to list all tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    // Get the list of tables
    const tables = result.rows.map(row => row.table_name);
    
    console.log('\nTables found in database:');
    tables.forEach(table => console.log(`- ${table}`));
    
    // Check if all expected tables exist
    const missingTables = expectedTables.filter(table => !tables.includes(table));
    
    if (missingTables.length === 0) {
      console.log('\nAll expected tables exist in the database!');
    } else {
      console.log('\nMissing tables:');
      missingTables.forEach(table => console.log(`- ${table}`));
      throw new Error('Some expected tables are missing from the database');
    }
    
    // For each table, count the number of rows
    console.log('\nTable row counts:');
    for (const table of tables) {
      const countResult = await client.query(`SELECT COUNT(*) FROM "${table}"`);
      const count = countResult.rows[0].count;
      console.log(`- ${table}: ${count} rows`);
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying database schema:', error);
    throw error;
  } finally {
    // Close the database connection
    await client.end();
    console.log('\nDatabase connection closed');
  }
}

// Main function
async function main() {
  try {
    await verifyDatabaseSchema();
    console.log('\n=== Database Verification Complete ===');
    console.log('The database schema has been verified successfully.');
  } catch (error) {
    console.error('\n=== Database Verification Failed ===');
    console.error(error);
    process.exit(1);
  }
}

// Run the main function
main();
