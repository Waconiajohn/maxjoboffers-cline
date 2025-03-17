#!/usr/bin/env node

/**
 * Fix Database Migration Script
 * 
 * This script fixes the database migration script by:
 * 1. Adding proper error handling for database backups
 * 2. Ensuring the backup directory exists
 * 3. Fixing the split function error
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get project root directory
const projectRoot = process.cwd();
console.log(`Project root: ${projectRoot}`);

// Path to the run-migration.js script
const migrationScriptPath = path.join(projectRoot, 'scripts', 'run-migration.js');

// Check if the migration script exists
if (!fs.existsSync(migrationScriptPath)) {
  console.error(`Migration script not found at: ${migrationScriptPath}`);
  process.exit(1);
}

// Read the migration script
console.log(`Reading migration script: ${migrationScriptPath}`);
const migrationScript = fs.readFileSync(migrationScriptPath, 'utf8');

// Fix the backup function
console.log('Fixing backup function...');
const fixedScript = migrationScript.replace(
  /async function backupDatabase\(\) \{[\s\S]*?try \{[\s\S]*?const dbConfig = \{[\s\S]*?host: process\.env\.DB_HOST\.split\(':'\)\[0\],/g,
  `async function backupDatabase() {
  console.log('Creating database backup...');
  
  // Create backups directory if it doesn't exist
  const backupDir = path.join(__dirname, '..', 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  try {
    // Check if DB_HOST is defined
    if (!process.env.DB_HOST) {
      throw new Error('DB_HOST environment variable is not defined');
    }
    
    const dbConfig = {
      host: process.env.DB_HOST.includes(':') ? process.env.DB_HOST.split(':')[0] : process.env.DB_HOST,`
);

// Write the fixed script back to the file
console.log('Writing fixed migration script...');
fs.writeFileSync(migrationScriptPath, fixedScript);

console.log('Migration script fixed successfully!');
console.log('You can now run the migration with: node scripts/run-migration.js');
