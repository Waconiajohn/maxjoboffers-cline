/**
 * Multi-Region S3 Client
 * 
 * This module provides S3 clients for different AWS regions to handle
 * cross-region access between RDS and S3 buckets.
 */

const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

// Environment variables
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const DEFAULT_REGION = process.env.AWS_REGION || 'us-east-1';
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284-us-east-1';

// RDS region (extracted from DATABASE_URL)
const DATABASE_URL = process.env.DATABASE_URL || '';
const RDS_REGION = DATABASE_URL.includes('us-east-1') ? 'us-east-1' : 
                  DATABASE_URL.includes('us-east-2') ? 'us-east-2' : 
                  DEFAULT_REGION;

// Create region-specific S3 clients
const s3Clients = {
  'us-east-1': new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
  }),
  'us-east-2': new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
  }),
  'us-west-2': new S3Client({
    region: 'us-west-2',
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
  })
};

// Get the appropriate S3 client for a region
const getS3Client = (region = DEFAULT_REGION) => {
  return s3Clients[region] || s3Clients[DEFAULT_REGION];
};

// Upload a file to S3 in the specified region
const uploadFileToRegion = async (params, region = DEFAULT_REGION) => {
  const client = getS3Client(region);
  
  const upload = new Upload({
    client,
    params: {
      Bucket: params.Bucket || S3_BUCKET_NAME,
      Key: params.Key,
      Body: params.Body,
      ContentType: params.ContentType || 'application/octet-stream',
      Metadata: params.Metadata
    }
  });
  
  return upload.done();
};

module.exports = {
  getS3Client,
  uploadFileToRegion,
  DEFAULT_REGION,
  RDS_REGION,
  S3_BUCKET_NAME
};
