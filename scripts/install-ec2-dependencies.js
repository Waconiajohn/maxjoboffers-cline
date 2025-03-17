#!/usr/bin/env node

/**
 * Install EC2 Dependencies
 *
 * This script installs the required dependencies on the EC2 instance
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

// Function to check if a package is installed on the EC2 instance
const isPackageInstalled = (packageName) => {
  try {
    const output = executeOnEC2(`npm list ${packageName} --json || echo "not-installed"`);
    return !output.includes('not-installed');
  } catch (error) {
    return false;
  }
};

// Function to install Node.js dependencies
const installNodeDependencies = () => {
  console.log('Installing Node.js dependencies...');
  
  // Install AWS SDK for S3 operations
  if (!isPackageInstalled('@aws-sdk/client-s3')) {
    executeOnEC2(`cd ${APP_DIR} && npm install @aws-sdk/client-s3 @aws-sdk/lib-storage --save`);
  } else {
    console.log('@aws-sdk/client-s3 is already installed');
  }
  
  // Install pg for PostgreSQL database operations
  if (!isPackageInstalled('pg')) {
    executeOnEC2(`cd ${APP_DIR} && npm install pg --save`);
  } else {
    console.log('pg is already installed');
  }
  
  console.log('Node.js dependencies installed successfully!');
};

// Function to install and configure PM2
const installAndConfigurePM2 = () => {
  console.log('Installing and configuring PM2...');
  
  // Check if PM2 is installed
  const isPM2Installed = executeOnEC2('command -v pm2 || echo "not-installed"');
  
  if (isPM2Installed.includes('not-installed')) {
    // Install PM2 globally
    executeOnEC2('npm install -g pm2');
  } else {
    console.log('PM2 is already installed');
  }
  
  // Configure PM2 to start on boot
  executeOnEC2('pm2 startup | grep -v PM2 | tail -n 1 | bash');
  
  // Create PM2 ecosystem file
  const ecosystemContent = `
module.exports = {
  apps: [{
    name: 'maxjoboffers',
    script: 'npm',
    args: 'start',
    cwd: '${APP_DIR}',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
`;
  
  // Create a temporary ecosystem file
  const tempEcosystemPath = path.join(__dirname, 'ecosystem.config.js');
  fs.writeFileSync(tempEcosystemPath, ecosystemContent);
  
  // Copy the ecosystem file to the EC2 instance
  copyToEC2(tempEcosystemPath, `${APP_DIR}/ecosystem.config.js`);
  
  // Remove the temporary file
  fs.unlinkSync(tempEcosystemPath);
  
  // Start the application with PM2
  executeOnEC2(`cd ${APP_DIR} && pm2 start ecosystem.config.js`);
  
  // Save the PM2 configuration
  executeOnEC2('pm2 save');
  
  console.log('PM2 installed and configured successfully!');
};

// Function to install and configure CloudWatch agent
const installAndConfigureCloudWatch = () => {
  console.log('Installing and configuring CloudWatch agent...');
  
  // Check if CloudWatch agent is installed
  const isCloudWatchInstalled = executeOnEC2('command -v amazon-cloudwatch-agent-ctl || echo "not-installed"');
  
  if (isCloudWatchInstalled.includes('not-installed')) {
    // Install CloudWatch agent
    executeOnEC2('sudo yum install -y amazon-cloudwatch-agent');
  } else {
    console.log('CloudWatch agent is already installed');
  }
  
  // Create CloudWatch agent configuration
  const cloudWatchConfig = {
    agent: {
      metrics_collection_interval: 60,
      run_as_user: 'ec2-user'
    },
    logs: {
      logs_collected: {
        files: {
          collect_list: [
            {
              file_path: '/var/log/maxjoboffers-backup.log',
              log_group_name: 'maxjoboffers-backup',
              log_stream_name: '{instance_id}',
              timezone: 'UTC'
            },
            {
              file_path: `${APP_DIR}/logs/app.log`,
              log_group_name: 'maxjoboffers-app',
              log_stream_name: '{instance_id}',
              timezone: 'UTC'
            }
          ]
        }
      }
    },
    metrics: {
      metrics_collected: {
        disk: {
          measurement: [
            'used_percent'
          ],
          resources: [
            '/'
          ],
          ignore_file_system_types: [
            'sysfs', 'devtmpfs'
          ]
        },
        mem: {
          measurement: [
            'mem_used_percent'
          ]
        }
      },
      append_dimensions: {
        InstanceId: '${aws:InstanceId}'
      }
    }
  };
  
  // Create a temporary CloudWatch config file
  const tempCloudWatchConfigPath = path.join(__dirname, 'cloudwatch-config.json');
  fs.writeFileSync(tempCloudWatchConfigPath, JSON.stringify(cloudWatchConfig, null, 2));
  
  // Copy the CloudWatch config file to the EC2 instance
  copyToEC2(tempCloudWatchConfigPath, '/tmp/cloudwatch-config.json');
  
  // Remove the temporary file
  fs.unlinkSync(tempCloudWatchConfigPath);
  
  // Configure CloudWatch agent
  executeOnEC2('sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/tmp/cloudwatch-config.json -s');
  
  console.log('CloudWatch agent installed and configured successfully!');
};

// Main function
const main = () => {
  try {
    // Check if required environment variables are set
    if (!process.env.EC2_HOST) {
      console.error('EC2_HOST environment variable is not set.');
      console.error('Usage: EC2_HOST=ec2-user@ec2-xx-xx-xx-xx.us-west-2.compute.amazonaws.com node scripts/install-ec2-dependencies.js');
      process.exit(1);
    }
    
    console.log(`Installing dependencies on EC2 instance: ${EC2_HOST}`);
    
    // Create logs directory if it doesn't exist
    executeOnEC2(`mkdir -p ${APP_DIR}/logs`);
    
    // Install Node.js dependencies
    installNodeDependencies();
    
    // Install and configure PM2
    installAndConfigurePM2();
    
    // Install and configure CloudWatch agent
    installAndConfigureCloudWatch();
    
    console.log('\nDependencies installed successfully!');
    console.log(`Application is running at: http://${EC2_HOST.split('@')[1]}:3001`);
  } catch (error) {
    console.error('Installation failed:', error);
    process.exit(1);
  }
};

// Run the main function
main();
