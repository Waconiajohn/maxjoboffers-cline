#!/usr/bin/env node

/**
 * Setup Backup Procedures for Important Files
 * 
 * This script sets up backup procedures for important files
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the PEM key file
const pemKeyPath = '/Users/johnschrup/Desktop/PEM/maxjoboffers-dev-key.pem';

// EC2 instance details
const ec2User = 'ec2-user';
const ec2Host = '18.233.6.175';
const ec2ProjectPath = '/home/ec2-user/maxjoboffers';

// Create the backup script content
const backupScriptContent = `#!/usr/bin/env node

/**
 * Backup Important Files to S3
 *
 * This script backs up important files to S3
 */

const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

// Get AWS credentials from environment variables
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || 'us-west-2';
const bucket = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284';

// Check if AWS credentials are available
if (!accessKeyId || !secretAccessKey) {
  console.error('AWS credentials not found in environment variables');
  process.exit(1);
}

// Create S3 client
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

// Directories to backup
const directoriesToBackup = [
  'src',
  'scripts',
  'logs',
  'public',
  'prisma'
];

// Files to backup
const filesToBackup = [
  '.env',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'README.md'
];

// Create a timestamp for the backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(__dirname, '..', 'backups', timestamp);

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Function to backup a directory
const backupDirectory = async (directory) => {
  try {
    const sourcePath = path.join(__dirname, '..', directory);
    
    // Skip if directory doesn't exist
    if (!fs.existsSync(sourcePath)) {
      console.log(\`Directory \${directory} doesn't exist, skipping...\`);
      return;
    }
    
    // Create a zip file of the directory
    const zipFilePath = path.join(backupDir, \`\${directory}.zip\`);
    console.log(\`Creating zip file for \${directory}...\`);
    execSync(\`zip -r \${zipFilePath} \${sourcePath}\`);
    
    // Upload the zip file to S3
    const key = \`backups/\${timestamp}/\${directory}.zip\`;
    console.log(\`Uploading \${directory} to S3 bucket: \${bucket} with key: \${key}\`);
    
    const params = {
      Bucket: bucket,
      Key: key,
      Body: fs.createReadStream(zipFilePath),
      ContentType: 'application/zip'
    };
    
    const uploader = new Upload({
      client: s3Client,
      params
    });
    
    uploader.on('httpUploadProgress', (progress) => {
      console.log(\`Upload progress for \${directory}: \${progress.loaded}/\${progress.total} bytes\`);
    });
    
    const result = await uploader.done();
    console.log(\`Successfully uploaded \${directory} to \${result.Location}\`);
    
    // Clean up the zip file
    fs.unlinkSync(zipFilePath);
    console.log(\`Cleaned up zip file for \${directory}\`);
  } catch (error) {
    console.error(\`Error backing up \${directory}:\`, error);
  }
};

// Function to backup a file
const backupFile = async (file) => {
  try {
    const sourcePath = path.join(__dirname, '..', file);
    
    // Skip if file doesn't exist
    if (!fs.existsSync(sourcePath)) {
      console.log(\`File \${file} doesn't exist, skipping...\`);
      return;
    }
    
    // Copy the file to the backup directory
    const backupFilePath = path.join(backupDir, path.basename(file));
    fs.copyFileSync(sourcePath, backupFilePath);
    
    // Upload the file to S3
    const key = \`backups/\${timestamp}/\${path.basename(file)}\`;
    console.log(\`Uploading \${file} to S3 bucket: \${bucket} with key: \${key}\`);
    
    const params = {
      Bucket: bucket,
      Key: key,
      Body: fs.createReadStream(backupFilePath),
      ContentType: 'application/octet-stream'
    };
    
    const uploader = new Upload({
      client: s3Client,
      params
    });
    
    uploader.on('httpUploadProgress', (progress) => {
      console.log(\`Upload progress for \${file}: \${progress.loaded}/\${progress.total} bytes\`);
    });
    
    const result = await uploader.done();
    console.log(\`Successfully uploaded \${file} to \${result.Location}\`);
    
    // Clean up the backup file
    fs.unlinkSync(backupFilePath);
    console.log(\`Cleaned up backup file for \${file}\`);
  } catch (error) {
    console.error(\`Error backing up \${file}:\`, error);
  }
};

// Backup all directories and files
const runBackup = async () => {
  try {
    console.log(\`Starting backup at \${new Date().toISOString()}...\`);
    
    // Backup directories
    for (const directory of directoriesToBackup) {
      await backupDirectory(directory);
    }
    
    // Backup files
    for (const file of filesToBackup) {
      await backupFile(file);
    }
    
    console.log(\`Backup completed at \${new Date().toISOString()}\`);
    
    // Clean up the backup directory
    fs.rmdirSync(backupDir, { recursive: true });
    console.log(\`Cleaned up backup directory\`);
  } catch (error) {
    console.error('Error running backup:', error);
  }
};

// Run the backup
runBackup();
`;

// Create the cron job script content
const cronJobScriptContent = `#!/bin/bash

# Run the backup script daily at 2 AM
cd /home/ec2-user/maxjoboffers
node scripts/run-backup.js >> logs/backup.log 2>&1
`;

// Create temporary files with the script contents
const tempBackupScriptPath = path.join(__dirname, 'temp-run-backup.js');
const tempCronJobScriptPath = path.join(__dirname, 'temp-backup-cron.sh');
fs.writeFileSync(tempBackupScriptPath, backupScriptContent);
fs.writeFileSync(tempCronJobScriptPath, cronJobScriptContent);

try {
  // Create the scripts and logs directories on the EC2 instance if they don't exist
  console.log('Creating scripts and logs directories on EC2 instance...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "mkdir -p ${ec2ProjectPath}/scripts ${ec2ProjectPath}/logs"`, { stdio: 'inherit' });

  // Upload the backup script to the EC2 instance
  console.log('Uploading backup script to EC2 instance...');
  execSync(`scp -i ${pemKeyPath} ${tempBackupScriptPath} ${ec2User}@${ec2Host}:${ec2ProjectPath}/scripts/run-backup.js`);
  console.log('Successfully uploaded backup script to EC2 instance');

  // Make the backup script executable
  console.log('Making the backup script executable...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "chmod +x ${ec2ProjectPath}/scripts/run-backup.js"`, { stdio: 'inherit' });
  console.log('Successfully made the backup script executable');

  // Upload the cron job script to the EC2 instance
  console.log('Uploading cron job script to EC2 instance...');
  execSync(`scp -i ${pemKeyPath} ${tempCronJobScriptPath} ${ec2User}@${ec2Host}:${ec2ProjectPath}/scripts/backup-cron.sh`);
  console.log('Successfully uploaded cron job script to EC2 instance');

  // Make the cron job script executable
  console.log('Making the cron job script executable...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "chmod +x ${ec2ProjectPath}/scripts/backup-cron.sh"`, { stdio: 'inherit' });
  console.log('Successfully made the cron job script executable');

  // Set up the cron job
  console.log('Setting up the cron job...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "(crontab -l 2>/dev/null || echo '') | grep -v '${ec2ProjectPath}/scripts/backup-cron.sh' | { cat; echo '0 2 * * * ${ec2ProjectPath}/scripts/backup-cron.sh'; } | crontab -"`, { stdio: 'inherit' });
  console.log('Successfully set up the cron job');

  // Install the required dependencies on the EC2 instance
  console.log('Installing required dependencies on EC2 instance...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "cd ${ec2ProjectPath} && npm install @aws-sdk/client-s3 @aws-sdk/lib-storage"`, { stdio: 'inherit' });
  console.log('Successfully installed required dependencies on EC2 instance');

  // Test the backup script
  console.log('\nTesting backup script...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "cd ${ec2ProjectPath} && node scripts/run-backup.js"`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error setting up backup procedures:', error.message);
  process.exit(1);
} finally {
  // Clean up the temporary files
  fs.unlinkSync(tempBackupScriptPath);
  fs.unlinkSync(tempCronJobScriptPath);
  console.log('Cleaned up temporary files');
}

console.log('\nBackup procedures for important files set up successfully');
