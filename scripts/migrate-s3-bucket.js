#!/usr/bin/env node

/**
 * Migrate S3 Bucket
 * 
 * This script migrates data from an S3 bucket in one region to a new bucket in another region.
 * It performs the following steps:
 * 1. Creates a new bucket in the target region
 * 2. Copies all objects from the source bucket to the target bucket
 * 3. Verifies that all objects were copied successfully
 * 4. Provides instructions for updating the application configuration
 */

const { 
  S3Client, 
  CreateBucketCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteBucketCommand
} = require('@aws-sdk/client-s3');
require('dotenv').config();

// Source bucket configuration
const SOURCE_REGION = 'us-west-2';
const SOURCE_BUCKET = 'executive-lms-backups-266735837284';

// Target bucket configuration
const TARGET_REGION = 'us-east-1'; // N. Virginia region
const TARGET_BUCKET = `${SOURCE_BUCKET}-${TARGET_REGION}`;

// AWS credentials
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

// Create S3 clients for source and target regions
const sourceClient = new S3Client({
  region: SOURCE_REGION,
  credentials
});

const targetClient = new S3Client({
  region: TARGET_REGION,
  credentials
});

// Function to create a new bucket in the target region
async function createTargetBucket() {
  try {
    console.log(`Creating new bucket '${TARGET_BUCKET}' in region '${TARGET_REGION}'...`);
    
    // For us-east-1 (N. Virginia), do not specify LocationConstraint
    // as it's the default region in AWS S3
    const params = {
      Bucket: TARGET_BUCKET
    };
    
    // Only add LocationConstraint for non-us-east-1 regions
    if (TARGET_REGION !== 'us-east-1') {
      params.CreateBucketConfiguration = {
        LocationConstraint: TARGET_REGION
      };
    }
    
    const command = new CreateBucketCommand(params);
    await targetClient.send(command);
    console.log(`✅ Bucket '${TARGET_BUCKET}' created successfully!`);
    return true;
  } catch (error) {
    if (error.name === 'BucketAlreadyExists' || error.name === 'BucketAlreadyOwnedByYou') {
      console.log(`⚠️ Bucket '${TARGET_BUCKET}' already exists.`);
      return true;
    }
    
    console.error(`❌ Error creating bucket: ${error.message}`);
    return false;
  }
}

// Function to list all objects in the source bucket
async function listSourceObjects() {
  try {
    console.log(`Listing objects in source bucket '${SOURCE_BUCKET}'...`);
    
    const objects = [];
    let continuationToken = undefined;
    
    do {
      const command = new ListObjectsV2Command({
        Bucket: SOURCE_BUCKET,
        ContinuationToken: continuationToken
      });
      
      const response = await sourceClient.send(command);
      
      if (response.Contents) {
        objects.push(...response.Contents);
      }
      
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);
    
    console.log(`Found ${objects.length} objects in source bucket.`);
    return objects;
  } catch (error) {
    console.error(`❌ Error listing objects: ${error.message}`);
    return [];
  }
}

// Function to copy an object from source to target bucket
async function copyObject(key) {
  try {
    console.log(`Copying object '${key}'...`);
    
    const command = new CopyObjectCommand({
      CopySource: `/${SOURCE_BUCKET}/${encodeURIComponent(key)}`,
      Bucket: TARGET_BUCKET,
      Key: key
    });
    
    await targetClient.send(command);
    console.log(`✅ Object '${key}' copied successfully!`);
    return true;
  } catch (error) {
    console.error(`❌ Error copying object '${key}': ${error.message}`);
    return false;
  }
}

// Function to verify that an object was copied correctly
async function verifyObject(key) {
  try {
    console.log(`Verifying object '${key}'...`);
    
    // Get source object metadata
    const sourceCommand = new HeadObjectCommand({
      Bucket: SOURCE_BUCKET,
      Key: key
    });
    
    const sourceResponse = await sourceClient.send(sourceCommand);
    
    // Get target object metadata
    const targetCommand = new HeadObjectCommand({
      Bucket: TARGET_BUCKET,
      Key: key
    });
    
    const targetResponse = await targetClient.send(targetCommand);
    
    // Compare ETag (MD5 hash)
    if (sourceResponse.ETag === targetResponse.ETag) {
      console.log(`✅ Object '${key}' verified successfully!`);
      return true;
    } else {
      console.error(`❌ Object '${key}' verification failed: ETag mismatch`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error verifying object '${key}': ${error.message}`);
    return false;
  }
}

// Function to delete the source bucket (optional)
async function deleteSourceBucket(deleteObjects = false) {
  try {
    if (deleteObjects) {
      console.log(`Deleting objects in source bucket '${SOURCE_BUCKET}'...`);
      
      const objects = await listSourceObjects();
      
      for (const object of objects) {
        const command = new DeleteObjectCommand({
          Bucket: SOURCE_BUCKET,
          Key: object.Key
        });
        
        await sourceClient.send(command);
        console.log(`✅ Object '${object.Key}' deleted from source bucket.`);
      }
    }
    
    console.log(`Deleting source bucket '${SOURCE_BUCKET}'...`);
    
    const command = new DeleteBucketCommand({
      Bucket: SOURCE_BUCKET
    });
    
    await sourceClient.send(command);
    console.log(`✅ Source bucket '${SOURCE_BUCKET}' deleted successfully!`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting source bucket: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('=== S3 Bucket Migration Tool ===');
  console.log(`Source bucket: ${SOURCE_BUCKET} (${SOURCE_REGION})`);
  console.log(`Target bucket: ${TARGET_BUCKET} (${TARGET_REGION})`);
  console.log('');
  
  // Create target bucket
  const bucketCreated = await createTargetBucket();
  if (!bucketCreated) {
    console.error('❌ Migration failed: Could not create target bucket.');
    process.exit(1);
  }
  
  // List objects in source bucket
  const objects = await listSourceObjects();
  if (objects.length === 0) {
    console.log('⚠️ Source bucket is empty. Nothing to migrate.');
  } else {
    console.log(`Migrating ${objects.length} objects...`);
    
    // Copy each object
    const copyResults = [];
    for (const object of objects) {
      const success = await copyObject(object.Key);
      copyResults.push({ key: object.Key, success });
    }
    
    // Verify each object
    const verifyResults = [];
    for (const object of objects) {
      const success = await verifyObject(object.Key);
      verifyResults.push({ key: object.Key, success });
    }
    
    // Print summary
    const copySuccessCount = copyResults.filter(r => r.success).length;
    const verifySuccessCount = verifyResults.filter(r => r.success).length;
    
    console.log('');
    console.log('=== Migration Summary ===');
    console.log(`Total objects: ${objects.length}`);
    console.log(`Successfully copied: ${copySuccessCount}`);
    console.log(`Successfully verified: ${verifySuccessCount}`);
    
    if (copySuccessCount === objects.length && verifySuccessCount === objects.length) {
      console.log('✅ All objects migrated successfully!');
    } else {
      console.log('⚠️ Some objects failed to migrate. See above for details.');
    }
  }
  
  // Provide instructions for updating configuration
  console.log('');
  console.log('=== Next Steps ===');
  console.log('1. Update your .env file with the following:');
  console.log(`   AWS_REGION=${TARGET_REGION}`);
  console.log(`   AWS_S3_BUCKET=${TARGET_BUCKET}`);
  console.log('2. Update any hardcoded references to the bucket name in your code.');
  console.log('3. Deploy the updated configuration to your EC2 instance.');
  
  // Ask if the user wants to delete the source bucket
  console.log('');
  console.log('⚠️ IMPORTANT: Do not delete the source bucket until you have verified that the application works with the new bucket.');
  console.log('To delete the source bucket after verification, run:');
  console.log(`node scripts/migrate-s3-bucket.js --delete-source`);
}

// Check if the --delete-source flag is provided
if (process.argv.includes('--delete-source')) {
  console.log('=== Deleting Source Bucket ===');
  deleteSourceBucket(true)
    .then(() => {
      console.log('Source bucket deletion completed.');
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
} else {
  // Run the main migration function
  main()
    .then(() => {
      console.log('Migration completed.');
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}
