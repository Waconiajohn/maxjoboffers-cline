#!/usr/bin/env node

/**
 * Update EC2 Environment Variables
 * 
 * This script updates the EC2 instance's .env file with the correct configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to the PEM key file
const pemKeyPath = '/Users/johnschrup/Desktop/PEM/maxjoboffers-dev-key.pem';

// EC2 instance details
const ec2User = 'ec2-user';
const ec2Host = '18.233.6.175';
const ec2ProjectPath = '/home/ec2-user/maxjoboffers';

// Read the local .env file
const localEnvPath = path.join(__dirname, '..', '.env');
const localEnvContent = fs.readFileSync(localEnvPath, 'utf8');

// Create a temporary file with the .env content
const tempEnvPath = path.join(__dirname, 'temp.env');
fs.writeFileSync(tempEnvPath, localEnvContent);

try {
  // Upload the .env file to the EC2 instance
  console.log('Uploading .env file to EC2 instance...');
  execSync(`scp -i ${pemKeyPath} ${tempEnvPath} ${ec2User}@${ec2Host}:${ec2ProjectPath}/.env`);
  console.log('Successfully uploaded .env file to EC2 instance');

  // Test the file upload on the EC2 instance
  console.log('\nTesting file upload on EC2 instance...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "cd ${ec2ProjectPath} && node scripts/test-file-upload.js"`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error updating EC2 environment variables:', error.message);
  process.exit(1);
} finally {
  // Clean up the temporary file
  fs.unlinkSync(tempEnvPath);
  console.log('Cleaned up temporary files');
}

console.log('\nEC2 environment variables updated successfully');
