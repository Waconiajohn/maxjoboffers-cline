#!/usr/bin/env node

/**
 * Test File Upload
 *
 * This script tests file uploads to S3 using the AWS SDK
 */

const fs = require('fs');
const path = require('path');
const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Define the AWS region and bucket name from environment variables
const REGION = process.env.AWS_REGION || 'us-east-1';
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284-us-east-1';

// Create an S3 client
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Function to upload a file to S3
const uploadFile = async (filePath, key, contentType) => {
  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath);
    
    // Create the upload parameters
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: contentType || 'application/octet-stream'
    };
    
    console.log(`Uploading file ${filePath} to S3 bucket ${BUCKET_NAME} with key ${key}...`);
    
    // Create a managed upload
    const upload = new Upload({
      client: s3Client,
      params: uploadParams
    });
    
    // Add event listeners for progress
    upload.on('httpUploadProgress', (progress) => {
      console.log(`Upload progress: ${Math.round((progress.loaded || 0) / (progress.total || 1) * 100)}%`);
    });
    
    // Execute the upload
    const result = await upload.done();
    console.log('File uploaded successfully:', result.Location);
    return result;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

// Function to generate a random file name
const generateRandomFileName = (extension) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const random = Math.random().toString(36).substring(2, 8);
  return `test-${timestamp}-${random}.${extension}`;
};

// Main function
const main = async () => {
  try {
    // Check if AWS credentials are set
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials are not set. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
      process.exit(1);
    }
    
    // Create a test file
    const testFilePath = path.join(__dirname, 'test-file.txt');
    const testFileContent = `This is a test file created at ${new Date().toISOString()}\n`;
    fs.writeFileSync(testFilePath, testFileContent);
    
    // Upload the test file
    const key = `test-files/${generateRandomFileName('txt')}`;
    const result = await uploadFile(testFilePath, key, 'text/plain');
    
    // Clean up
    fs.unlinkSync(testFilePath);
    
    console.log('\nTest completed successfully!');
    console.log(`File uploaded to: ${result.Location}`);
    console.log(`S3 URI: s3://${BUCKET_NAME}/${key}`);
    console.log(`Direct URL: https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

// Run the main function
main();
