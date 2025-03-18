#!/usr/bin/env node

/**
 * Update EC2 with New S3 Configuration
 * 
 * This script updates the EC2 instance with the new S3 bucket configuration.
 * It performs the following steps:
 * 1. Updates the .env file on the EC2 instance
 * 2. Installs the required dependencies (@aws-sdk/lib-storage)
 * 3. Restarts the application
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// EC2 instance details
const EC2_HOST = process.env.EC2_HOST || 'ec2-user@your-ec2-instance.amazonaws.com';
const EC2_KEY_PATH = process.env.EC2_KEY_PATH || '~/.ssh/your-key.pem';
const EC2_APP_PATH = process.env.EC2_APP_PATH || '/home/ec2-user/maxjoboffers';

// AWS S3 configuration
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284-us-east-1';

// Function to execute SSH commands on the EC2 instance
const executeSSHCommand = (command) => {
  try {
    console.log(`Executing command on EC2: ${command}`);
    const result = execSync(`ssh -i ${EC2_KEY_PATH} ${EC2_HOST} "${command}"`).toString();
    console.log(result);
    return result;
  } catch (error) {
    console.error(`Error executing SSH command: ${error.message}`);
    throw error;
  }
};

// Function to update the .env file on the EC2 instance
const updateEnvFile = () => {
  try {
    console.log('Updating .env file on EC2 instance...');
    
    // Create a temporary file with the updated AWS configuration
    const tempFilePath = path.join(__dirname, 'temp-env-update.sh');
    const updateScript = `
#!/bin/bash
# Update AWS configuration in .env file
cd ${EC2_APP_PATH}
sed -i 's/AWS_REGION=.*/AWS_REGION=${AWS_REGION}/' .env
sed -i 's/AWS_S3_BUCKET=.*/AWS_S3_BUCKET=${AWS_S3_BUCKET}/' .env
cat .env | grep AWS_
    `;
    
    fs.writeFileSync(tempFilePath, updateScript);
    fs.chmodSync(tempFilePath, '755');
    
    // Copy the script to the EC2 instance and execute it
    execSync(`scp -i ${EC2_KEY_PATH} ${tempFilePath} ${EC2_HOST}:/tmp/update-env.sh`);
    executeSSHCommand('bash /tmp/update-env.sh');
    
    // Clean up
    fs.unlinkSync(tempFilePath);
    executeSSHCommand('rm /tmp/update-env.sh');
    
    console.log('✅ .env file updated successfully!');
    return true;
  } catch (error) {
    console.error(`❌ Error updating .env file: ${error.message}`);
    return false;
  }
};

// Function to install required dependencies on the EC2 instance
const installDependencies = () => {
  try {
    console.log('Installing required dependencies on EC2 instance...');
    
    // Install @aws-sdk/lib-storage
    executeSSHCommand(`cd ${EC2_APP_PATH} && npm install @aws-sdk/lib-storage`);
    
    console.log('✅ Dependencies installed successfully!');
    return true;
  } catch (error) {
    console.error(`❌ Error installing dependencies: ${error.message}`);
    return false;
  }
};

// Function to restart the application on the EC2 instance
const restartApplication = () => {
  try {
    console.log('Restarting application on EC2 instance...');
    
    // Check if PM2 is being used
    const pm2Check = executeSSHCommand(`cd ${EC2_APP_PATH} && command -v pm2 || echo "PM2 not found"`);
    
    if (!pm2Check.includes('PM2 not found')) {
      // Restart the application using PM2
      executeSSHCommand(`cd ${EC2_APP_PATH} && pm2 restart all`);
    } else {
      // Restart the application using the start script
      executeSSHCommand(`cd ${EC2_APP_PATH} && npm run stop || true`);
      executeSSHCommand(`cd ${EC2_APP_PATH} && npm run start`);
    }
    
    console.log('✅ Application restarted successfully!');
    return true;
  } catch (error) {
    console.error(`❌ Error restarting application: ${error.message}`);
    return false;
  }
};

// Main function
const main = async () => {
  console.log('=== Updating EC2 with New S3 Configuration ===');
  
  // Check if EC2 host is provided
  if (EC2_HOST.includes('your-ec2-instance.amazonaws.com')) {
    console.error('❌ EC2_HOST is not set. Please set the EC2_HOST environment variable.');
    console.log('Example: EC2_HOST=ec2-user@ec2-12-345-67-890.compute-1.amazonaws.com node scripts/update-ec2-with-new-s3-config.js');
    process.exit(1);
  }
  
  // Check if EC2 key path is provided
  if (EC2_KEY_PATH.includes('your-key.pem')) {
    console.error('❌ EC2_KEY_PATH is not set. Please set the EC2_KEY_PATH environment variable.');
    console.log('Example: EC2_KEY_PATH=~/.ssh/your-key.pem node scripts/update-ec2-with-new-s3-config.js');
    process.exit(1);
  }
  
  // Update the .env file
  const envUpdated = updateEnvFile();
  if (!envUpdated) {
    console.error('❌ Failed to update .env file. Aborting.');
    process.exit(1);
  }
  
  // Install required dependencies
  const dependenciesInstalled = installDependencies();
  if (!dependenciesInstalled) {
    console.error('❌ Failed to install dependencies. Aborting.');
    process.exit(1);
  }
  
  // Restart the application
  const applicationRestarted = restartApplication();
  if (!applicationRestarted) {
    console.error('❌ Failed to restart application. Aborting.');
    process.exit(1);
  }
  
  console.log('');
  console.log('=== EC2 Update Complete ===');
  console.log('The EC2 instance has been updated with the new S3 configuration:');
  console.log(`- AWS_REGION: ${AWS_REGION}`);
  console.log(`- AWS_S3_BUCKET: ${AWS_S3_BUCKET}`);
  console.log('');
  console.log('To verify the update, you can run:');
  console.log(`ssh -i ${EC2_KEY_PATH} ${EC2_HOST} "cd ${EC2_APP_PATH} && cat .env | grep AWS_"`);
};

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
