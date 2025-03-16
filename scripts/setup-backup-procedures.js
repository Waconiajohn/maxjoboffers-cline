#!/usr/bin/env node

/**
 * Setup backup procedures for important files
 * 
 * This script sets up backup procedures for important files.
 * It configures S3 lifecycle rules for backups and creates a backup script.
 */

const { S3Client, PutBucketLifecycleConfigurationCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// S3 configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// S3 bucket name from environment variable
const S3_BUCKET = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284';

// Configure S3 lifecycle rules for backups
const configureS3Lifecycle = async () => {
  try {
    const command = new PutBucketLifecycleConfigurationCommand({
      Bucket: S3_BUCKET,
      LifecycleConfiguration: {
        Rules: [
          {
            ID: 'Daily-Backups-Rule',
            Status: 'Enabled',
            Prefix: 'backups/daily/',
            ExpirationInDays: 7, // Keep daily backups for 7 days
          },
          {
            ID: 'Weekly-Backups-Rule',
            Status: 'Enabled',
            Prefix: 'backups/weekly/',
            ExpirationInDays: 30, // Keep weekly backups for 30 days
          },
          {
            ID: 'Monthly-Backups-Rule',
            Status: 'Enabled',
            Prefix: 'backups/monthly/',
            ExpirationInDays: 365, // Keep monthly backups for 1 year
          }
        ]
      }
    });
    await s3Client.send(command);
    console.log('S3 lifecycle rules configured successfully');
  } catch (error) {
    console.error('Error configuring S3 lifecycle rules:', error);
    throw error;
  }
};

// Create backup script
const createBackupScript = () => {
  const scriptPath = path.join(__dirname, 'run-backup.sh');
  const scriptContent = `#!/bin/bash

# Backup script for important files
# This script creates backups of important files and uploads them to S3

set -e

# Log function
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Application directory
APP_DIR="/home/ec2-user/maxjoboffers"
BACKUP_DIR="/home/ec2-user/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Determine backup type (daily, weekly, monthly)
DAY_OF_WEEK=$(date +"%u")
DAY_OF_MONTH=$(date +"%d")

if [ "$DAY_OF_MONTH" = "01" ]; then
  # First day of the month - monthly backup
  BACKUP_TYPE="monthly"
elif [ "$DAY_OF_WEEK" = "7" ]; then
  # Sunday - weekly backup
  BACKUP_TYPE="weekly"
else
  # Other days - daily backup
  BACKUP_TYPE="daily"
fi

log "Starting $BACKUP_TYPE backup..."

# Create backup of database
log "Backing up database..."
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -f $BACKUP_DIR/db_backup_$TIMESTAMP.sql

# Create backup of uploads
log "Backing up uploads..."
tar -czf $BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz -C $APP_DIR/uploads .

# Create backup of .env file
log "Backing up .env file..."
cp $APP_DIR/.env $BACKUP_DIR/.env_backup_$TIMESTAMP

# Upload backups to S3
log "Uploading backups to S3..."
aws s3 cp $BACKUP_DIR/db_backup_$TIMESTAMP.sql s3://$S3_BUCKET/backups/$BACKUP_TYPE/db_backup_$TIMESTAMP.sql
aws s3 cp $BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz s3://$S3_BUCKET/backups/$BACKUP_TYPE/uploads_backup_$TIMESTAMP.tar.gz
aws s3 cp $BACKUP_DIR/.env_backup_$TIMESTAMP s3://$S3_BUCKET/backups/$BACKUP_TYPE/.env_backup_$TIMESTAMP

# Clean up local backups
log "Cleaning up local backups..."
find $BACKUP_DIR -type f -name "db_backup_*" -mtime +7 -delete
find $BACKUP_DIR -type f -name "uploads_backup_*" -mtime +7 -delete
find $BACKUP_DIR -type f -name ".env_backup_*" -mtime +7 -delete

log "Backup completed successfully!"
`;

  fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 });
  console.log(`Backup script created at ${scriptPath}`);
};

// Main function
const main = async () => {
  try {
    console.log('Setting up backup procedures...');
    
    // Configure S3 lifecycle rules
    await configureS3Lifecycle();
    
    // Create backup script
    createBackupScript();
    
    console.log('Backup procedures setup completed successfully!');
  } catch (error) {
    console.error('Error setting up backup procedures:', error);
    process.exit(1);
  }
};

// Run the main function
main().catch(console.error);
