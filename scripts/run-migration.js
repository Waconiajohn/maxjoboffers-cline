/**
 * Script to run the database migration and verify the schema updates
 * 
 * This script:
 * 1. Backs up the database
 * 2. Runs the migration script
 * 3. Verifies the schema has been updated correctly
 * 
 * Usage:
 * node scripts/run-migration.js
 */

const { spawn, execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const prisma = new PrismaClient();
const migrationPath = path.join(__dirname, '..', 'migrations', '20250307_schema_update.js');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Backup the database
 */
async function backupDatabase() {
  console.log('Creating database backup...');
  
  try {
    // Get database URL from environment or .env file
    const dbUrl = process.env.DATABASE_URL || require('dotenv').config().parsed.DATABASE_URL;
    
    // Extract database name from URL
    const dbName = dbUrl.split('/').pop().split('?')[0];
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '..', 'backups'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'backups'));
    }
    
    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(__dirname, '..', 'backups', `${dbName}_${timestamp}.sql`);
    
    // Determine if we're using PostgreSQL or SQLite
    if (dbUrl.startsWith('postgresql://')) {
      // PostgreSQL backup
      const pgDumpCmd = `pg_dump "${dbUrl}" > "${backupFile}"`;
      execSync(pgDumpCmd, { stdio: 'inherit' });
    } else if (dbUrl.startsWith('file:') || dbUrl.includes('.db')) {
      // SQLite backup
      const sqliteFile = dbUrl.replace('file:', '').split('?')[0];
      fs.copyFileSync(sqliteFile, backupFile);
    } else {
      throw new Error('Unsupported database type. Only PostgreSQL and SQLite are supported for backup.');
    }
    
    console.log(`Database backup created at: ${backupFile}`);
    return backupFile;
  } catch (error) {
    console.error('Error creating database backup:', error);
    throw error;
  }
}

/**
 * Run the migration script
 */
async function runMigration() {
  console.log('Running migration script...');
  
  return new Promise((resolve, reject) => {
    const migration = spawn('node', [migrationPath], { stdio: 'inherit' });
    
    migration.on('close', (code) => {
      if (code === 0) {
        console.log('Migration completed successfully.');
        resolve();
      } else {
        console.error(`Migration failed with code ${code}`);
        reject(new Error(`Migration failed with code ${code}`));
      }
    });
    
    migration.on('error', (err) => {
      console.error('Failed to start migration process:', err);
      reject(err);
    });
  });
}

/**
 * Verify the schema has been updated correctly
 */
async function verifySchema() {
  console.log('Verifying schema updates...');
  
  try {
    // Check for new tables
    const tables = [
      'LinkedInPost',
      'NetworkingStrategy',
      'SavedJob',
      'ApplicationStatusHistory',
      'PaymentHistory'
    ];
    
    for (const table of tables) {
      try {
        // Try to query each new table
        const count = await prisma.$executeRawUnsafe(`SELECT COUNT(*) FROM "${table}"`);
        console.log(`✅ Table "${table}" exists`);
      } catch (error) {
        console.error(`❌ Table "${table}" does not exist or cannot be queried:`, error.message);
        throw new Error(`Schema verification failed: Table "${table}" not found`);
      }
    }
    
    // Check for new columns in existing tables
    const columnChecks = [
      { table: 'User', column: 'lastLoginAt' },
      { table: 'User', column: 'profilePictureUrl' },
      { table: 'Resume', column: 'matchScore' },
      { table: 'Resume', column: 'keywords' },
      { table: 'Resume', column: 'parentResumeId' },
      { table: 'Job', column: 'jobType' },
      { table: 'Job', column: 'experienceLevel' },
      { table: 'Job', column: 'industry' },
      { table: 'Job', column: 'skills' },
      { table: 'Job', column: 'benefits' },
      { table: 'JobApplication', column: 'appliedDate' },
      { table: 'JobApplication', column: 'followUpDate' },
      { table: 'JobApplication', column: 'notes' },
      { table: 'JobApplication', column: 'rejectionReason' },
      { table: 'CoverLetter', column: 'jobId' },
      { table: 'CoverLetter', column: 'resumeId' },
      { table: 'CoverLetter', column: 'format' },
      { table: 'CoverLetter', column: 'version' },
      { table: 'Interview', column: 'round' },
      { table: 'Interview', column: 'interviewers' },
      { table: 'Interview', column: 'duration' },
      { table: 'Interview', column: 'location' },
      { table: 'Interview', column: 'feedback' },
      { table: 'Interview', column: 'status' },
      { table: 'LinkedInProfile', column: 'profileUrl' },
      { table: 'LinkedInProfile', column: 'connections' },
      { table: 'LinkedInProfile', column: 'recommendations' }
    ];
    
    for (const { table, column } of columnChecks) {
      try {
        // Check if column exists by querying table information schema
        const result = await prisma.$queryRawUnsafe(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = '${table}' AND column_name = '${column}'
        `);
        
        if (result && result.length > 0) {
          console.log(`✅ Column "${column}" exists in table "${table}"`);
        } else {
          console.error(`❌ Column "${column}" does not exist in table "${table}"`);
          throw new Error(`Schema verification failed: Column "${column}" not found in table "${table}"`);
        }
      } catch (error) {
        console.error(`❌ Error checking column "${column}" in table "${table}":`, error.message);
        throw new Error(`Schema verification failed: Error checking column "${column}" in table "${table}"`);
      }
    }
    
    // Check for indexes
    const indexChecks = [
      { table: 'Resume', index: 'Resume_userId_idx' },
      { table: 'Resume', index: 'Resume_parentResumeId_idx' },
      { table: 'JobApplication', index: 'JobApplication_userId_idx' },
      { table: 'JobApplication', index: 'JobApplication_jobId_idx' },
      { table: 'Job', index: 'Job_title_idx' },
      { table: 'Job', index: 'Job_company_idx' },
      { table: 'Job', index: 'Job_location_idx' }
    ];
    
    for (const { table, index } of indexChecks) {
      try {
        // Check if index exists by querying pg_indexes
        const result = await prisma.$queryRawUnsafe(`
          SELECT indexname 
          FROM pg_indexes 
          WHERE tablename = '${table}' AND indexname = '${index}'
        `);
        
        if (result && result.length > 0) {
          console.log(`✅ Index "${index}" exists on table "${table}"`);
        } else {
          console.error(`❌ Index "${index}" does not exist on table "${table}"`);
          throw new Error(`Schema verification failed: Index "${index}" not found on table "${table}"`);
        }
      } catch (error) {
        console.error(`❌ Error checking index "${index}" on table "${table}":`, error.message);
        throw new Error(`Schema verification failed: Error checking index "${index}" on table "${table}"`);
      }
    }
    
    console.log('✅ Schema verification completed successfully!');
  } catch (error) {
    console.error('Schema verification failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Restore database from backup if migration fails
 */
async function restoreBackup(backupFile) {
  console.log(`Restoring database from backup: ${backupFile}`);
  
  try {
    // Get database URL from environment or .env file
    const dbUrl = process.env.DATABASE_URL || require('dotenv').config().parsed.DATABASE_URL;
    
    // Determine if we're using PostgreSQL or SQLite
    if (dbUrl.startsWith('postgresql://')) {
      // PostgreSQL restore
      const pgRestoreCmd = `psql "${dbUrl}" < "${backupFile}"`;
      execSync(pgRestoreCmd, { stdio: 'inherit' });
    } else if (dbUrl.startsWith('file:') || dbUrl.includes('.db')) {
      // SQLite restore
      const sqliteFile = dbUrl.replace('file:', '').split('?')[0];
      fs.copyFileSync(backupFile, sqliteFile);
    } else {
      throw new Error('Unsupported database type. Only PostgreSQL and SQLite are supported for restore.');
    }
    
    console.log('Database restored successfully.');
  } catch (error) {
    console.error('Error restoring database:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('=== MaxJobOffers Database Migration ===');
  console.log('This script will migrate your database to the latest schema.');
  console.log('It is recommended to run this in a development or staging environment first.');
  
  rl.question('Do you want to proceed with the migration? (y/n) ', async (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('Migration cancelled.');
      rl.close();
      return;
    }
    
    let backupFile;
    
    try {
      // Step 1: Backup the database
      backupFile = await backupDatabase();
      
      // Step 2: Run the migration
      await runMigration();
      
      // Step 3: Verify the schema
      await verifySchema();
      
      console.log('\n=== Migration Summary ===');
      console.log('✅ Database backup created');
      console.log('✅ Migration script executed successfully');
      console.log('✅ Schema verification passed');
      console.log('\nMigration completed successfully!');
    } catch (error) {
      console.error('\n=== Migration Failed ===');
      console.error(error);
      
      if (backupFile) {
        rl.question('Do you want to restore the database from backup? (y/n) ', async (answer) => {
          if (answer.toLowerCase() === 'y') {
            try {
              await restoreBackup(backupFile);
              console.log('Database restored to pre-migration state.');
            } catch (restoreError) {
              console.error('Failed to restore database:', restoreError);
            }
            rl.close();
          } else {
            console.log('Database not restored. It may be in an inconsistent state.');
            rl.close();
          }
        });
      } else {
        console.error('No backup was created. Database may be in an inconsistent state.');
        rl.close();
      }
      
      return;
    }
    
    rl.close();
  });
}

// Run the main function
main();
