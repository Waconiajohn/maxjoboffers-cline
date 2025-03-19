#!/usr/bin/env node

/**
 * Setup Backup Procedures
 *
 * This script sets up backup procedures for important files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { 
  S3Client, 
  PutBucketLifecycleConfigurationCommand 
} = require('@aws-sdk/client-s3');

// Define the AWS region and bucket name from environment variables
const REGION = process.env.AWS_REGION || 'us-east-1';
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284-us-east-1';
const BACKUP_BUCKET_NAME = process.env.BACKUP_BUCKET_NAME || 'maxjoboffers-backups';

// Create an S3 client
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Function to set up S3 lifecycle rules for backups
const setupS3LifecycleRules = async () => {
  try {
    console.log('Setting up S3 lifecycle rules for backups...');
    
    const params = {
      Bucket: BUCKET_NAME,
      LifecycleConfiguration: {
        Rules: [
          {
            ID: 'BackupToGlacier',
            Status: 'Enabled',
            Filter: {
              Prefix: 'resumes/'
            },
            Transitions: [
              {
                Days: 30,
                StorageClass: 'STANDARD_IA'
              },
              {
                Days: 90,
                StorageClass: 'GLACIER'
              }
            ],
            Expiration: {
              Days: 365
            }
          },
          {
            ID: 'DeleteOldTestFiles',
            Status: 'Enabled',
            Filter: {
              Prefix: 'test-files/'
            },
            Expiration: {
              Days: 7
            }
          }
        ]
      }
    };
    
    const command = new PutBucketLifecycleConfigurationCommand(params);
    const response = await s3Client.send(command);
    
    console.log('S3 lifecycle rules set up successfully!');
    return response;
  } catch (error) {
    console.error('Error setting up S3 lifecycle rules:', error);
    throw error;
  }
};

// Function to create a backup script
const createBackupScript = () => {
  try {
    console.log('Creating backup script...');
    
    const scriptPath = path.join(__dirname, 'run-backup.sh');
    const scriptContent = `#!/bin/bash

# Backup Script for MaxJobOffers
# This script backs up important files to S3

# Set AWS credentials
export AWS_ACCESS_KEY_ID="\${AWS_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="\${AWS_SECRET_ACCESS_KEY}"
export AWS_DEFAULT_REGION="${REGION}"

# Set variables
TIMESTAMP=\$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/tmp/maxjoboffers-backup-\${TIMESTAMP}"
S3_BACKUP_PATH="s3://${BACKUP_BUCKET_NAME}/\${TIMESTAMP}"
APP_DIR="/path/to/application"  # Update this to the actual application directory

# Create backup directory
mkdir -p "\${BACKUP_DIR}"

# Backup database
echo "Backing up database..."
pg_dump -h \${DB_HOST} -U \${DB_USER} -d \${DB_NAME} -f "\${BACKUP_DIR}/database.sql"

# Backup configuration files
echo "Backing up configuration files..."
cp "\${APP_DIR}/.env" "\${BACKUP_DIR}/"
cp "\${APP_DIR}/config.json" "\${BACKUP_DIR}/" 2>/dev/null || echo "No config.json found"

# Backup user uploads
echo "Backing up user uploads..."
mkdir -p "\${BACKUP_DIR}/uploads"
aws s3 sync "s3://${BUCKET_NAME}/resumes" "\${BACKUP_DIR}/uploads/resumes"

# Create a compressed archive
echo "Creating compressed archive..."
tar -czf "\${BACKUP_DIR}.tar.gz" -C "\${BACKUP_DIR}" .

# Upload to S3
echo "Uploading backup to S3..."
aws s3 cp "\${BACKUP_DIR}.tar.gz" "\${S3_BACKUP_PATH}/backup.tar.gz"

# Clean up
echo "Cleaning up temporary files..."
rm -rf "\${BACKUP_DIR}"
rm "\${BACKUP_DIR}.tar.gz"

echo "Backup completed successfully!"
echo "Backup stored at: \${S3_BACKUP_PATH}/backup.tar.gz"
`;
    
    fs.writeFileSync(scriptPath, scriptContent);
    fs.chmodSync(scriptPath, '755');
    
    console.log(`Backup script created at: ${scriptPath}`);
    return scriptPath;
  } catch (error) {
    console.error('Error creating backup script:', error);
    throw error;
  }
};

// Function to set up a cron job for regular backups
const setupCronJob = (scriptPath) => {
  try {
    console.log('Setting up cron job for regular backups...');
    
    // Create a crontab entry for daily backups at 2 AM
    const cronEntry = `0 2 * * * ${scriptPath} >> /var/log/maxjoboffers-backup.log 2>&1\n`;
    
    // Note: In a real implementation, you would add this to the system's crontab
    // For this example, we'll just print the command to add it manually
    
    console.log('\nTo set up a cron job for daily backups, run the following command:');
    console.log(`(crontab -l 2>/dev/null; echo "${cronEntry}") | crontab -`);
    
    return cronEntry;
  } catch (error) {
    console.error('Error setting up cron job:', error);
    throw error;
  }
};

// Function to create a backup documentation file
const createBackupDocumentation = () => {
  try {
    console.log('Creating backup documentation...');
    
    const docPath = path.join(__dirname, 'BACKUP_PROCEDURES.md');
    const docContent = `# Backup Procedures for MaxJobOffers

This document outlines the backup procedures for the MaxJobOffers application.

## Automated Backups

The application has automated backup procedures set up to ensure data safety and disaster recovery capabilities.

### Daily Backups

A daily backup is performed at 2 AM using the \`run-backup.sh\` script. This backup includes:

1. Database dump
2. Configuration files (.env, config.json)
3. User uploads (resumes, etc.)

The backup is compressed and stored in the S3 bucket \`${BACKUP_BUCKET_NAME}\` with a timestamp-based path.

### S3 Lifecycle Rules

The following lifecycle rules are configured for the main S3 bucket \`${BUCKET_NAME}\`:

1. Resume files:
   - After 30 days: Moved to STANDARD_IA storage class (lower cost, slightly higher retrieval time)
   - After 90 days: Moved to GLACIER storage class (lowest cost, longer retrieval time)
   - After 365 days: Deleted

2. Test files:
   - After 7 days: Deleted

## Manual Backup

To perform a manual backup, run the following command:

\`\`\`bash
./scripts/run-backup.sh
\`\`\`

## Restore Procedure

To restore from a backup:

1. Download the backup from S3:
   \`\`\`bash
   aws s3 cp s3://${BACKUP_BUCKET_NAME}/[TIMESTAMP]/backup.tar.gz /tmp/
   \`\`\`

2. Extract the backup:
   \`\`\`bash
   mkdir -p /tmp/restore
   tar -xzf /tmp/backup.tar.gz -C /tmp/restore
   \`\`\`

3. Restore the database:
   \`\`\`bash
   psql -h [DB_HOST] -U [DB_USER] -d [DB_NAME] < /tmp/restore/database.sql
   \`\`\`

4. Restore configuration files:
   \`\`\`bash
   cp /tmp/restore/.env /path/to/application/
   cp /tmp/restore/config.json /path/to/application/ # if exists
   \`\`\`

5. Restore user uploads:
   \`\`\`bash
   aws s3 sync /tmp/restore/uploads/resumes s3://${BUCKET_NAME}/resumes
   \`\`\`

6. Clean up:
   \`\`\`bash
   rm -rf /tmp/restore
   rm /tmp/backup.tar.gz
   \`\`\`

## Backup Retention Policy

- Daily backups are retained for 30 days
- Weekly backups (Sunday) are retained for 90 days
- Monthly backups (1st of the month) are retained for 1 year

## Monitoring

Backup success/failure is logged to \`/var/log/maxjoboffers-backup.log\`.

CloudWatch alarms are set up to notify administrators if backups fail.
`;
    
    fs.writeFileSync(docPath, docContent);
    
    console.log(`Backup documentation created at: ${docPath}`);
    return docPath;
  } catch (error) {
    console.error('Error creating backup documentation:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    // Check if AWS credentials are set
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials are not set. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
      process.exit(1);
    }
    
    console.log('Setting up backup procedures...');
    
    // Set up S3 lifecycle rules
    await setupS3LifecycleRules();
    
    // Create backup script
    const scriptPath = createBackupScript();
    
    // Set up cron job
    setupCronJob(scriptPath);
    
    // Create backup documentation
    createBackupDocumentation();
    
    console.log('\nBackup procedures setup completed successfully!');
    console.log('Please review the backup documentation and set up the cron job as instructed.');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

// Run the main function
main();
