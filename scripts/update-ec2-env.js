#!/usr/bin/env node

/**
 * Update EC2 Environment Variables
 *
 * This script updates the environment variables on the EC2 instance
 * specifically for the file upload functionality
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Set variables
const EC2_HOST = process.env.EC2_HOST || 'ec2-user@ec2-xx-xx-xx-xx.us-west-2.compute.amazonaws.com';
const SSH_KEY = process.env.SSH_KEY || '~/.ssh/maxjoboffers-ec2.pem';
const APP_DIR = '/home/ec2-user/maxjoboffers';

// Function to execute a command on the EC2 instance
const executeOnEC2 = (command) => {
  try {
    console.log(`Executing on EC2: ${command}`);
    const output = execSync(`ssh -i ${SSH_KEY} ${EC2_HOST} "${command}"`).toString();
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error executing command on EC2: ${command}`);
    console.error(error.stdout ? error.stdout.toString() : error.message);
    throw error;
  }
};

// Function to copy a file to the EC2 instance
const copyToEC2 = (localPath, remotePath) => {
  try {
    console.log(`Copying ${localPath} to EC2:${remotePath}`);
    const output = execSync(`scp -i ${SSH_KEY} ${localPath} ${EC2_HOST}:${remotePath}`).toString();
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error copying file to EC2: ${localPath} -> ${remotePath}`);
    console.error(error.stdout ? error.stdout.toString() : error.message);
    throw error;
  }
};

// Function to get the current environment variables from the EC2 instance
const getCurrentEnvVars = async () => {
  try {
    console.log('Getting current environment variables from EC2...');
    
    // Check if .env file exists on EC2
    const checkEnvFile = executeOnEC2(`test -f ${APP_DIR}/.env && echo "exists" || echo "not-exists"`);
    
    if (checkEnvFile.trim() === 'not-exists') {
      console.log('No .env file found on EC2');
      return {};
    }
    
    // Create a temporary file to store the .env file
    const tempEnvPath = path.join(__dirname, 'temp-ec2.env');
    
    // Copy the .env file from EC2
    execSync(`scp -i ${SSH_KEY} ${EC2_HOST}:${APP_DIR}/.env ${tempEnvPath}`);
    
    // Read the .env file
    const envContent = fs.readFileSync(tempEnvPath, 'utf8');
    
    // Parse the .env file
    const envVars = dotenv.parse(envContent);
    
    // Remove the temporary file
    fs.unlinkSync(tempEnvPath);
    
    return envVars;
  } catch (error) {
    console.error('Error getting current environment variables:', error);
    return {};
  }
};

// Function to read local .env file
const readLocalEnvFile = () => {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      console.error('Local .env file not found');
      return {};
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    return dotenv.parse(envContent);
  } catch (error) {
    console.error('Error reading local .env file:', error);
    return {};
  }
};

// Function to update the environment variables on the EC2 instance
const updateEnvVars = async (currentEnvVars, newEnvVars) => {
  try {
    console.log('Updating environment variables on EC2...');
    
    // Merge the current and new environment variables
    const mergedEnvVars = { ...currentEnvVars, ...newEnvVars };
    
    // Create the .env file content
    let envContent = '';
    Object.entries(mergedEnvVars).forEach(([key, value]) => {
      envContent += `${key}=${value}\n`;
    });
    
    // Create a temporary file to store the .env file
    const tempEnvPath = path.join(__dirname, 'temp-ec2.env');
    fs.writeFileSync(tempEnvPath, envContent);
    
    // Copy the .env file to EC2
    copyToEC2(tempEnvPath, `${APP_DIR}/.env`);
    
    // Remove the temporary file
    fs.unlinkSync(tempEnvPath);
    
    console.log('Environment variables updated successfully!');
  } catch (error) {
    console.error('Error updating environment variables:', error);
    throw error;
  }
};

// Function to restart the application on EC2
const restartApplication = () => {
  try {
    console.log('Restarting the application on EC2...');
    
    // Check if PM2 is installed
    const isPM2Installed = executeOnEC2('command -v pm2 || echo "not-installed"');
    
    if (isPM2Installed.includes('not-installed')) {
      console.log('PM2 is not installed. Skipping application restart.');
      return;
    }
    
    // Restart the application
    executeOnEC2(`cd ${APP_DIR} && pm2 restart maxjoboffers || pm2 start npm --name maxjoboffers -- start`);
    
    console.log('Application restarted successfully!');
  } catch (error) {
    console.error('Error restarting application:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    // Check if required environment variables are set
    if (!process.env.EC2_HOST) {
      console.error('EC2_HOST environment variable is not set.');
      console.error('Usage: EC2_HOST=ec2-user@ec2-xx-xx-xx-xx.us-west-2.compute.amazonaws.com node scripts/update-ec2-env.js');
      process.exit(1);
    }
    
    console.log(`Updating environment variables on EC2 instance: ${EC2_HOST}`);
    
    // Get the current environment variables from EC2
    const currentEnvVars = await getCurrentEnvVars();
    
    // Read local .env file
    const localEnvVars = readLocalEnvFile();
    
    // Extract AWS credentials and S3 bucket information
    const awsCredentials = {
      AWS_ACCESS_KEY_ID: localEnvVars.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: localEnvVars.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: localEnvVars.AWS_REGION,
      S3_BUCKET_NAME: localEnvVars.AWS_S3_BUCKET
    };
    
    // Validate AWS credentials
    if (!awsCredentials.AWS_ACCESS_KEY_ID || !awsCredentials.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials not found in local .env file');
      process.exit(1);
    }
    
    console.log('Using AWS credentials from local .env file:');
    console.log(`- AWS_ACCESS_KEY_ID: ${awsCredentials.AWS_ACCESS_KEY_ID}`);
    console.log(`- AWS_REGION: ${awsCredentials.AWS_REGION}`);
    console.log(`- S3_BUCKET_NAME: ${awsCredentials.S3_BUCKET_NAME}`);
    
    // Update the environment variables
    await updateEnvVars(currentEnvVars, {
      AWS_ACCESS_KEY_ID: awsCredentials.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: awsCredentials.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: awsCredentials.AWS_REGION,
      S3_BUCKET_NAME: awsCredentials.S3_BUCKET_NAME,
      FILE_UPLOAD_ENABLED: 'true',
      MAX_FILE_SIZE: '10485760', // 10MB in bytes
      ALLOWED_FILE_TYPES: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png'
    });
    
    // Restart the application
    restartApplication();
    
    console.log('\nEnvironment variables updated successfully!');
    console.log(`Application is running at: http://${EC2_HOST.split('@')[1]}:3001`);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
};

// Run the main function
main();
