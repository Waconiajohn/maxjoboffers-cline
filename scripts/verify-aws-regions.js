#!/usr/bin/env node

/**
 * Verify AWS Regions
 *
 * This script verifies that all AWS resources are in the correct region (us-west-2)
 */

const { 
  S3Client, 
  ListBucketsCommand, 
  GetBucketLocationCommand 
} = require('@aws-sdk/client-s3');
const { 
  EC2Client, 
  DescribeInstancesCommand 
} = require('@aws-sdk/client-ec2');
const { 
  CloudWatchClient, 
  ListMetricsCommand 
} = require('@aws-sdk/client-cloudwatch');
const { 
  RDSClient, 
  DescribeDBInstancesCommand 
} = require('@aws-sdk/client-rds');
require('dotenv').config();

// Get AWS credentials from environment variables
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const expectedRegion = process.env.AWS_REGION || 'us-west-2';

// Check if AWS credentials are available
if (!accessKeyId || !secretAccessKey) {
  console.error('AWS credentials not found in environment variables');
  process.exit(1);
}

// Create clients for different AWS services
const s3Client = new S3Client({
  region: expectedRegion,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

const ec2Client = new EC2Client({
  region: expectedRegion,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

const cloudWatchClient = new CloudWatchClient({
  region: expectedRegion,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

const rdsClient = new RDSClient({
  region: expectedRegion,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

// Function to get S3 bucket region
const getBucketRegion = async (bucketName) => {
  try {
    const command = new GetBucketLocationCommand({ Bucket: bucketName });
    const response = await s3Client.send(command);
    
    // AWS returns null for us-east-1
    let region = response.LocationConstraint || 'us-east-1';
    
    return region;
  } catch (error) {
    console.error(`Error getting region for bucket ${bucketName}:`, error);
    return 'unknown';
  }
};

// Function to verify specific S3 bucket
const verifyS3Buckets = async () => {
  try {
    console.log('\n=== Verifying S3 Buckets ===');
    
    const bucketName = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284';
    
    console.log(`Verifying S3 bucket: ${bucketName}`);
    
    try {
      const region = await getBucketRegion(bucketName);
      const isCorrectRegion = region === expectedRegion;
      
      console.log(`Bucket: ${bucketName}`);
      console.log(`  Region: ${region}`);
      console.log(`  Correct Region: ${isCorrectRegion ? '✅ Yes' : '❌ No'}`);
      
      if (!isCorrectRegion) {
        console.log(`  WARNING: Bucket ${bucketName} is in ${region} instead of ${expectedRegion}`);
        console.log(`  To fix this, you need to create a new bucket in ${expectedRegion} and migrate the data`);
      }
    } catch (error) {
      if (error.name === 'NoSuchBucket') {
        console.log(`Bucket ${bucketName} does not exist`);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error verifying S3 buckets:', error);
  }
};

// Function to verify EC2 instances
const verifyEC2Instances = async () => {
  try {
    console.log('\n=== Verifying EC2 Instances ===');
    
    const command = new DescribeInstancesCommand({});
    const response = await ec2Client.send(command);
    
    if (!response.Reservations || response.Reservations.length === 0) {
      console.log('No EC2 instances found');
      return;
    }
    
    let instanceCount = 0;
    
    for (const reservation of response.Reservations) {
      for (const instance of reservation.Instances) {
        instanceCount++;
        
        console.log(`Instance: ${instance.InstanceId}`);
        console.log(`  State: ${instance.State.Name}`);
        console.log(`  Type: ${instance.InstanceType}`);
        console.log(`  Region: ${expectedRegion}`);
        
        if (instance.Tags) {
          const nameTag = instance.Tags.find(tag => tag.Key === 'Name');
          if (nameTag) {
            console.log(`  Name: ${nameTag.Value}`);
          }
        }
      }
    }
    
    console.log(`Found ${instanceCount} EC2 instances in ${expectedRegion}`);
  } catch (error) {
    console.error('Error verifying EC2 instances:', error);
  }
};

// Function to verify CloudWatch metrics
const verifyCloudWatchMetrics = async () => {
  try {
    console.log('\n=== Verifying CloudWatch Metrics ===');
    
    const command = new ListMetricsCommand({
      Namespace: 'MaxJobOffers/S3'
    });
    
    const response = await cloudWatchClient.send(command);
    
    if (!response.Metrics || response.Metrics.length === 0) {
      console.log('No CloudWatch metrics found for MaxJobOffers/S3 namespace');
      return;
    }
    
    console.log(`Found ${response.Metrics.length} CloudWatch metrics in ${expectedRegion}`);
    
    for (const metric of response.Metrics) {
      console.log(`Metric: ${metric.MetricName}`);
      console.log(`  Namespace: ${metric.Namespace}`);
      console.log(`  Region: ${expectedRegion}`);
      
      if (metric.Dimensions) {
        console.log('  Dimensions:');
        for (const dimension of metric.Dimensions) {
          console.log(`    ${dimension.Name}: ${dimension.Value}`);
        }
      }
    }
  } catch (error) {
    console.error('Error verifying CloudWatch metrics:', error);
  }
};

// Function to verify RDS instances
const verifyRDSInstances = async () => {
  try {
    console.log('\n=== Verifying RDS Instances ===');
    
    const command = new DescribeDBInstancesCommand({});
    const response = await rdsClient.send(command);
    
    if (!response.DBInstances || response.DBInstances.length === 0) {
      console.log('No RDS instances found');
      return;
    }
    
    console.log(`Found ${response.DBInstances.length} RDS instances in ${expectedRegion}`);
    
    for (const instance of response.DBInstances) {
      console.log(`Instance: ${instance.DBInstanceIdentifier}`);
      console.log(`  Engine: ${instance.Engine} ${instance.EngineVersion}`);
      console.log(`  Status: ${instance.DBInstanceStatus}`);
      console.log(`  Region: ${expectedRegion}`);
      console.log(`  Endpoint: ${instance.Endpoint?.Address}`);
    }
  } catch (error) {
    console.error('Error verifying RDS instances:', error);
  }
};

// Main function
const main = async () => {
  console.log(`Verifying AWS resources in region: ${expectedRegion}`);
  
  await verifyS3Buckets();
  await verifyEC2Instances();
  await verifyCloudWatchMetrics();
  await verifyRDSInstances();
  
  console.log('\nVerification complete!');
};

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
