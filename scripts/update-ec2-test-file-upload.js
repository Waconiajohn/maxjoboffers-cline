#!/usr/bin/env node

/**
 * Update EC2 and Test File Upload
 *
 * This script updates the EC2 instance with the file upload code and tests it
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// Function to copy a directory to the EC2 instance
const copyDirToEC2 = (localDir, remoteDir) => {
  try {
    console.log(`Copying directory ${localDir} to EC2:${remoteDir}`);
    const output = execSync(`scp -i ${SSH_KEY} -r ${localDir} ${EC2_HOST}:${remoteDir}`).toString();
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error copying directory to EC2: ${localDir} -> ${remoteDir}`);
    console.error(error.stdout ? error.stdout.toString() : error.message);
    throw error;
  }
};

// Function to update the S3 uploader code on EC2
const updateS3UploaderCode = () => {
  try {
    console.log('Updating S3 uploader code on EC2...');
    
    // Create the utils directory if it doesn't exist
    executeOnEC2(`mkdir -p ${APP_DIR}/src/utils`);
    
    // Copy the S3 uploader file
    copyToEC2('src/utils/s3Uploader.ts', `${APP_DIR}/src/utils/s3Uploader.ts`);
    
    console.log('S3 uploader code updated successfully!');
  } catch (error) {
    console.error('Error updating S3 uploader code:', error);
    throw error;
  }
};

// Function to update the test scripts on EC2
const updateTestScripts = () => {
  try {
    console.log('Updating test scripts on EC2...');
    
    // Create the scripts directory if it doesn't exist
    executeOnEC2(`mkdir -p ${APP_DIR}/scripts`);
    
    // Copy the test scripts
    copyToEC2('scripts/test-file-upload.js', `${APP_DIR}/scripts/test-file-upload.js`);
    copyToEC2('scripts/test-resume-upload.js', `${APP_DIR}/scripts/test-resume-upload.js`);
    
    // Make the scripts executable
    executeOnEC2(`chmod +x ${APP_DIR}/scripts/test-file-upload.js ${APP_DIR}/scripts/test-resume-upload.js`);
    
    console.log('Test scripts updated successfully!');
  } catch (error) {
    console.error('Error updating test scripts:', error);
    throw error;
  }
};

// Function to install dependencies on EC2
const installDependencies = () => {
  try {
    console.log('Installing dependencies on EC2...');
    
    // Install AWS SDK for S3 operations
    executeOnEC2(`cd ${APP_DIR} && npm install @aws-sdk/client-s3 @aws-sdk/lib-storage --save`);
    
    console.log('Dependencies installed successfully!');
  } catch (error) {
    console.error('Error installing dependencies:', error);
    throw error;
  }
};

// Function to create a test file on EC2
const createTestFile = () => {
  try {
    console.log('Creating test file on EC2...');
    
    // Create a test directory
    executeOnEC2(`mkdir -p ${APP_DIR}/test-files`);
    
    // Create a test file
    const testContent = `This is a test file created at ${new Date().toISOString()}`;
    executeOnEC2(`echo "${testContent}" > ${APP_DIR}/test-files/test-file.txt`);
    
    console.log('Test file created successfully!');
    return `${APP_DIR}/test-files/test-file.txt`;
  } catch (error) {
    console.error('Error creating test file:', error);
    throw error;
  }
};

// Function to test file upload on EC2
const testFileUpload = (testFilePath) => {
  try {
    console.log('Testing file upload on EC2...');
    
    // Run the test-file-upload.js script
    executeOnEC2(`cd ${APP_DIR} && node scripts/test-file-upload.js`);
    
    console.log('File upload test completed successfully!');
  } catch (error) {
    console.error('Error testing file upload:', error);
    throw error;
  }
};

// Function to test resume upload on EC2
const testResumeUpload = (testFilePath) => {
  try {
    console.log('Testing resume upload on EC2...');
    
    // Run the test-resume-upload.js script with the test file
    executeOnEC2(`cd ${APP_DIR} && node scripts/test-resume-upload.js ${testFilePath}`);
    
    console.log('Resume upload test completed successfully!');
  } catch (error) {
    console.error('Error testing resume upload:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    // Check if required environment variables are set
    if (!process.env.EC2_HOST) {
      console.error('EC2_HOST environment variable is not set.');
      console.error('Usage: EC2_HOST=ec2-user@ec2-xx-xx-xx-xx.us-west-2.compute.amazonaws.com node scripts/update-ec2-test-file-upload.js');
      process.exit(1);
    }
    
    console.log(`Updating EC2 instance and testing file upload: ${EC2_HOST}`);
    
    // Update S3 uploader code
    updateS3UploaderCode();
    
    // Update test scripts
    updateTestScripts();
    
    // Install dependencies
    installDependencies();
    
    // Create a test file
    const testFilePath = createTestFile();
    
    // Test file upload
    testFileUpload(testFilePath);
    
    // Test resume upload
    testResumeUpload(testFilePath);
    
    console.log('\nEC2 update and file upload tests completed successfully!');
  } catch (error) {
    console.error('Update and test failed:', error);
    process.exit(1);
  }
};

// Run the main function
main();
