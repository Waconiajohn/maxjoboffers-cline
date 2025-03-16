#!/usr/bin/env node

/**
 * Test script for S3 file uploads
 * 
 * This script tests the S3 file upload functionality using the AWS SDK.
 * It creates a test file and uploads it to the S3 bucket.
 */

const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// S3 configuration from environment variables
const s3Config = {
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};

// S3 bucket name from environment variable
const S3_BUCKET = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284';

// Create S3 client
const s3Client = new S3Client(s3Config);

// Create a test file
const createTestFile = () => {
  const testFilePath = path.join(__dirname, 'test-file.txt');
  const content = `Test file created at ${new Date().toISOString()}`;
  fs.writeFileSync(testFilePath, content);
  return testFilePath;
};

// Upload a file to S3
const uploadFileToS3 = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const fileName = path.basename(filePath);
  const key = `test-uploads/${Date.now()}-${fileName}`;

  try {
    // Create upload parameters
    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Body: fileStream,
      ContentType: 'text/plain'
    };

    // Upload file to S3 using multipart upload
    const upload = new Upload({
      client: s3Client,
      params
    });

    // Add event listeners for progress
    upload.on('httpUploadProgress', (progress) => {
      console.log(`Upload progress: ${progress.loaded}/${progress.total}`);
    });

    // Complete the upload
    await upload.done();

    // Generate the URL for the uploaded file
    const url = `https://${S3_BUCKET}.s3.${s3Config.region}.amazonaws.com/${key}`;

    return { url, key };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  console.log('Creating test file...');
  const testFilePath = createTestFile();
  console.log(`Test file created at: ${testFilePath}`);

  console.log('Uploading test file to S3...');
  try {
    const result = await uploadFileToS3(testFilePath);
    console.log('File uploaded successfully!');
    console.log(`URL: ${result.url}`);
    console.log(`Key: ${result.key}`);

    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log('Test file cleaned up.');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

// Run the main function
main().catch(console.error);
