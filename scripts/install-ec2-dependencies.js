#!/usr/bin/env node

/**
 * Install EC2 Dependencies
 * 
 * This script installs the required dependencies on the EC2 instance
 */

const { execSync } = require('child_process');

// Path to the PEM key file
const pemKeyPath = '/Users/johnschrup/Desktop/PEM/maxjoboffers-dev-key.pem';

// EC2 instance details
const ec2User = 'ec2-user';
const ec2Host = '18.233.6.175';
const ec2ProjectPath = '/home/ec2-user/maxjoboffers';

try {
  // Install dependencies on the EC2 instance
  console.log('Installing dependencies on EC2 instance...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "cd ${ec2ProjectPath} && npm install pg @aws-sdk/client-s3 @aws-sdk/lib-storage"`, { stdio: 'inherit' });
  console.log('Successfully installed dependencies on EC2 instance');

  // Configure PM2 to handle application crashes
  console.log('\nConfiguring PM2 on EC2 instance...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "cd ${ec2ProjectPath} && npm install pm2 -g && pm2 startup && pm2 save"`, { stdio: 'inherit' });
  console.log('Successfully configured PM2 on EC2 instance');

  // Restart the application with PM2
  console.log('\nRestarting application with PM2...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "cd ${ec2ProjectPath} && pm2 restart all || pm2 start npm --name 'maxjoboffers' -- start"`, { stdio: 'inherit' });
  console.log('Successfully restarted application with PM2');
} catch (error) {
  console.error('Error installing dependencies on EC2 instance:', error.message);
  process.exit(1);
}

console.log('\nEC2 dependencies installed successfully');
