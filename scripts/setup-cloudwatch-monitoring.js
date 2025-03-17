#!/usr/bin/env node

/**
 * Setup CloudWatch Monitoring for S3 Operations
 * 
 * This script sets up CloudWatch monitoring for S3 operations
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

// Create the CloudWatch monitoring script content
const cloudWatchMonitoringContent = `#!/usr/bin/env node

/**
 * CloudWatch Monitoring for S3 Operations
 *
 * This script sets up CloudWatch monitoring for S3 operations
 */

const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get AWS credentials from environment variables
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || 'us-west-2';

// Check if AWS credentials are available
if (!accessKeyId || !secretAccessKey) {
  console.error('AWS credentials not found in environment variables');
  process.exit(1);
}

// Create CloudWatch client
const cloudWatchClient = new CloudWatchClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

// Log file path
const logFilePath = path.join(__dirname, '..', 'logs', 's3-operations.log');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Function to log S3 operations
const logS3Operation = async (operation, bucket, key, success) => {
  try {
    // Log to file
    const timestamp = new Date().toISOString();
    const logEntry = \`\${timestamp} - \${operation} - Bucket: \${bucket} - Key: \${key} - Success: \${success}\n\`;
    fs.appendFileSync(logFilePath, logEntry);

    // Send metric to CloudWatch
    const params = {
      MetricData: [
        {
          MetricName: 'S3Operations',
          Dimensions: [
            {
              Name: 'Operation',
              Value: operation
            },
            {
              Name: 'Bucket',
              Value: bucket
            },
            {
              Name: 'Success',
              Value: success.toString()
            }
          ],
          Unit: 'Count',
          Value: 1
        }
      ],
      Namespace: 'MaxJobOffers/S3'
    };

    const command = new PutMetricDataCommand(params);
    await cloudWatchClient.send(command);
    console.log(\`Sent metric to CloudWatch for \${operation} operation on \${bucket}/\${key}\`);
  } catch (error) {
    console.error('Error sending metric to CloudWatch:', error);
  }
};

// Export the function
module.exports = {
  logS3Operation
};

// If this script is run directly, log a test operation
if (require.main === module) {
  console.log('Testing CloudWatch monitoring for S3 operations...');
  logS3Operation('TEST', 'test-bucket', 'test-key', true)
    .then(() => console.log('Test completed successfully'))
    .catch(error => console.error('Test failed:', error));
}
`;

// Create a temporary file with the CloudWatch monitoring script content
const tempFilePath = path.join(__dirname, 'temp-cloudwatch-monitoring.js');
fs.writeFileSync(tempFilePath, cloudWatchMonitoringContent);

try {
  // Create the scripts directory on the EC2 instance if it doesn't exist
  console.log('Creating scripts directory on EC2 instance...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "mkdir -p ${ec2ProjectPath}/scripts"`, { stdio: 'inherit' });

  // Upload the CloudWatch monitoring script to the EC2 instance
  console.log('Uploading CloudWatch monitoring script to EC2 instance...');
  execSync(`scp -i ${pemKeyPath} ${tempFilePath} ${ec2User}@${ec2Host}:${ec2ProjectPath}/scripts/cloudwatch-monitoring.js`);
  console.log('Successfully uploaded CloudWatch monitoring script to EC2 instance');

  // Make the script executable
  console.log('Making the script executable...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "chmod +x ${ec2ProjectPath}/scripts/cloudwatch-monitoring.js"`, { stdio: 'inherit' });
  console.log('Successfully made the script executable');

  // Test the CloudWatch monitoring script
  console.log('\nTesting CloudWatch monitoring script...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "cd ${ec2ProjectPath} && node scripts/cloudwatch-monitoring.js"`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error setting up CloudWatch monitoring:', error.message);
  process.exit(1);
} finally {
  // Clean up the temporary file
  fs.unlinkSync(tempFilePath);
  console.log('Cleaned up temporary files');
}

console.log('\nCloudWatch monitoring for S3 operations set up successfully');
