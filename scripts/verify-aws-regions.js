#!/usr/bin/env node

/**
 * Verify AWS Regions
 *
 * This script verifies the AWS regions for different services and provides
 * a summary of the configuration.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Extract region information from environment variables
const s3Region = process.env.AWS_REGION || 'us-west-2';
const s3Bucket = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284';
const databaseUrl = process.env.DATABASE_URL || '';

// Extract RDS region from the database URL
let rdsRegion = 'unknown';
if (databaseUrl.includes('us-east-1')) {
  rdsRegion = 'us-east-1';
} else if (databaseUrl.includes('us-east-2')) {
  rdsRegion = 'us-east-2';
} else if (databaseUrl.includes('us-west-1')) {
  rdsRegion = 'us-west-1';
} else if (databaseUrl.includes('us-west-2')) {
  rdsRegion = 'us-west-2';
}

console.log('=== AWS Region Configuration ===');
console.log(`S3 Bucket: ${s3Bucket}`);
console.log(`S3 Region (from .env): ${s3Region}`);
console.log(`RDS Region (from DATABASE_URL): ${rdsRegion}`);
console.log('\nNOTE: The actual regions in your AWS account may differ from what is configured in the .env file.');

// Check if regions are different
if (s3Region !== rdsRegion && rdsRegion !== 'unknown') {
  console.log('\n⚠️ Cross-Region Configuration Detected ⚠️');
  console.log(`Your RDS database is in ${rdsRegion} while your S3 configuration is set to ${s3Region}.`);
  console.log('This cross-region setup can cause:');
  console.log('1. Increased latency for operations involving both services');
  console.log('2. Higher data transfer costs between regions');
  console.log('3. Potential consistency issues during cross-region operations');
  
  console.log('\n=== Recommended Solutions ===');
  console.log('Option 1: Update your .env file to use consistent regions');
  console.log(`- If your S3 bucket is actually in ${s3Region}, but your RDS is in ${rdsRegion}:`);
  console.log('  - Create a new S3 bucket in the same region as your RDS');
  console.log('  - Update AWS_S3_BUCKET and AWS_REGION in .env file');
  console.log(`- If your RDS is actually in ${rdsRegion}, but your S3 bucket is in ${s3Region}:`);
  console.log('  - Update AWS_REGION in .env file to match your RDS region');
  console.log('  - Implement region-specific S3 clients in your code');
  
  console.log('\nOption 2: Implement region-specific AWS clients');
  console.log('- Create separate AWS clients for each region');
  console.log('- Use the appropriate client based on the service you are accessing');
  
  // Example implementation for multi-region AWS clients
  console.log('\n=== Example Multi-Region Implementation ===');
  console.log('Create a file src/utils/awsClients.js with:');
  console.log(`
const { S3Client } = require('@aws-sdk/client-s3');
const { RDSClient } = require('@aws-sdk/client-rds');

// AWS credentials
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

// Create region-specific S3 clients
const s3Clients = {
  'us-east-1': new S3Client({
    region: 'us-east-1',
    credentials
  }),
  'us-east-2': new S3Client({
    region: 'us-east-2',
    credentials
  }),
  'us-west-2': new S3Client({
    region: 'us-west-2',
    credentials
  })
};

// Create region-specific RDS clients
const rdsClients = {
  'us-east-1': new RDSClient({
    region: 'us-east-1',
    credentials
  }),
  'us-east-2': new RDSClient({
    region: 'us-east-2',
    credentials
  }),
  'us-west-2': new RDSClient({
    region: 'us-west-2',
    credentials
  })
};

// Get the appropriate S3 client for a region
const getS3Client = (region = process.env.AWS_REGION) => {
  return s3Clients[region] || s3Clients[process.env.AWS_REGION];
};

// Get the appropriate RDS client for a region
const getRDSClient = (region = '${rdsRegion}') => {
  return rdsClients[region] || rdsClients['${rdsRegion}'];
};

module.exports = {
  getS3Client,
  getRDSClient,
  s3Clients,
  rdsClients
};
`);
} else {
  console.log('\n✅ Your AWS services are configured to use the same region.');
  console.log('This is the optimal configuration for performance and cost.');
}

// Verify the actual S3 bucket region
console.log('\n=== Verifying Actual S3 Bucket Region ===');
console.log('To verify the actual region of your S3 bucket, run:');
console.log(`node scripts/find-bucket-region.js`);

// Verify EC2 region
console.log('\n=== Verifying EC2 Region ===');
console.log('To verify the region of your EC2 instances, check the AWS Management Console or run:');
console.log('aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,Placement.AvailabilityZone]" --output table');

console.log('\n=== Verification Complete ===');
console.log('Make sure all your AWS services are in the same region for optimal performance and cost.');
