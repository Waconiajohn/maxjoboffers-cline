#!/usr/bin/env node

/**
 * Update EC2 Test File Upload Script
 * 
 * This script updates the EC2 instance's test-file-upload.js script with the correct implementation
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

// Create the test-file-upload.js content
const testFileUploadContent = `#!/usr/bin/env node

/**
 * Test File Upload to S3
 *
 * This script tests file uploads to S3 using the AWS SDK
 */

const fs = require('fs');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
require('dotenv').config();

// Get AWS credentials from environment variables
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || 'us-east-1';
const bucket = process.env.AWS_S3_BUCKET || 'maxjoboffers-uploads';

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

// Create a test file
const testFileName = \`test-file-\${Date.now()}.txt\`;
const testFilePath = path.join(__dirname, testFileName);
const testFileContent = \`This is a test file created at \${new Date().toISOString()}\`;

fs.writeFileSync(testFilePath, testFileContent);
console.log(\`Created test file: \${testFilePath}\`);

// Upload the file to S3
const upload = async () => {
  try {
    // Generate a random key for the file
    const key = \`test-uploads/\${Date.now()}-\${testFileName}\`;
    
    // Create upload parameters
    const params = {
      Bucket: bucket,
      Key: key,
      Body: fs.createReadStream(testFilePath),
      ContentType: 'text/plain'
    };

    // Upload the file
    console.log(\`Uploading file to S3 bucket: \${bucket} with key: \${key}\`);
    const uploader = new Upload({
      client: s3Client,
      params
    });

    uploader.on('httpUploadProgress', (progress) => {
      console.log(\`Upload progress: \${progress.loaded}/\${progress.total} bytes\`);
    });

    const result = await uploader.done();
    console.log(\`File uploaded successfully to \${result.Location}\`);
    
    // Clean up the test file
    fs.unlinkSync(testFilePath);
    console.log(\`Deleted test file: \${testFilePath}\`);
    
    return result;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    
    // Clean up the test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log(\`Deleted test file: \${testFilePath}\`);
    }
    
    process.exit(1);
  }
};

// Run the upload function
upload();
`;

// Create a temporary file with the test-file-upload.js content
const tempFilePath = path.join(__dirname, 'temp-test-file-upload.js');
fs.writeFileSync(tempFilePath, testFileUploadContent);

try {
  // Upload the test-file-upload.js file to the EC2 instance
  console.log('Uploading test-file-upload.js file to EC2 instance...');
  execSync(`scp -i ${pemKeyPath} ${tempFilePath} ${ec2User}@${ec2Host}:${ec2ProjectPath}/scripts/test-file-upload.js`);
  console.log('Successfully uploaded test-file-upload.js file to EC2 instance');

  // Test the file upload on the EC2 instance
  console.log('\nTesting file upload on EC2 instance...');
  execSync(`ssh -i ${pemKeyPath} ${ec2User}@${ec2Host} "cd ${ec2ProjectPath} && node scripts/test-file-upload.js"`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error updating EC2 test-file-upload.js:', error.message);
  process.exit(1);
} finally {
  // Clean up the temporary file
  fs.unlinkSync(tempFilePath);
  console.log('Cleaned up temporary files');
}

console.log('\nEC2 test-file-upload.js updated successfully');
