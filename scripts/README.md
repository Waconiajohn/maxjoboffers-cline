# MaxJobOffers Scripts

This directory contains scripts for managing the MaxJobOffers application.

## File Upload Scripts

### test-file-upload.js

Tests file uploads to S3 using the AWS SDK.

```bash
node scripts/test-file-upload.js
```

### test-resume-upload.js

Tests uploading a resume to S3 and simulates parsing and matching it to a job description.

```bash
node scripts/test-resume-upload.js path/to/resume.pdf
```

### update-ec2-test-file-upload.js

Updates the EC2 instance's test-file-upload.js script with the correct implementation.

```bash
node scripts/update-ec2-test-file-upload.js
```

## EC2 Deployment Scripts

### update-ec2-env.js

Updates the EC2 instance's .env file with the correct configuration.

```bash
node scripts/update-ec2-env.js
```

### install-ec2-dependencies.js

Installs the required dependencies on the EC2 instance.

```bash
node scripts/install-ec2-dependencies.js
```

### update-ec2-with-new-s3-config.js

Updates the EC2 instance with the new S3 bucket configuration, installs required dependencies, and restarts the application.

```bash
# Set the EC2 host and key path environment variables
export EC2_HOST=ec2-user@ec2-12-345-67-890.compute-1.amazonaws.com
export EC2_KEY_PATH=~/.ssh/your-key.pem

# Run the script
node scripts/update-ec2-with-new-s3-config.js
```

This script:
- Updates the .env file on the EC2 instance with the new AWS_REGION and AWS_S3_BUCKET values
- Installs the @aws-sdk/lib-storage package for handling file uploads
- Restarts the application using PM2 (if available) or npm scripts

## Monitoring and Backup Scripts

### setup-cloudwatch-monitoring.js

Sets up CloudWatch monitoring for S3 operations.

```bash
node scripts/setup-cloudwatch-monitoring.js
```

### setup-backup-procedures.js

Sets up backup procedures for important files.

```bash
node scripts/setup-backup-procedures.js
```

### verify-aws-regions.js

Verifies the AWS regions for different services and provides a summary of the configuration.

```bash
node scripts/verify-aws-regions.js
```

### migrate-s3-bucket.js

Migrates data from an S3 bucket in one region to a new bucket in another region.

```bash
# Migrate data from source bucket to target bucket
node scripts/migrate-s3-bucket.js

# Delete the source bucket after verification
node scripts/migrate-s3-bucket.js --delete-source
```

This script:
- Creates a new bucket in the target region (us-east-1)
- Copies all objects from the source bucket to the target bucket
- Verifies that all objects were copied successfully
- Provides instructions for updating the application configuration

## S3 Utilities

### S3 Uploader

The S3 uploader utility is located in `src/utils/s3Uploader.ts`. It provides a simple interface for uploading files to S3.

Example usage:

```typescript
import { uploadFile } from '../utils/s3Uploader';

// Upload a file to S3
const result = await uploadFile({
  file: fileObject,
  key: 'path/to/file.ext',
  contentType: 'application/octet-stream'
});

console.log('File uploaded successfully:', result.Location);
```

### Multi-Region S3 Client

The multi-region S3 client utility is located in `src/utils/multiRegionS3Client.js`. It provides S3 clients for different AWS regions to handle cross-region access between RDS and S3 buckets.

Example usage:

```javascript
const { 
  getS3Client, 
  uploadFileToRegion, 
  DEFAULT_REGION, 
  RDS_REGION 
} = require('./multiRegionS3Client');

// Get an S3 client for a specific region
const s3Client = getS3Client('us-east-1');

// Upload a file to S3 in a specific region
const result = await uploadFileToRegion({
  Key: 'path/to/file.ext',
  Body: fileBuffer,
  ContentType: 'application/octet-stream'
}, 'us-east-1');

console.log('File uploaded successfully:', result.Location);
```

## GitHub Integration

### update-github.sh

Updates the GitHub repository with the latest changes.

```bash
./scripts/update-github.sh
```

### sync-codebases.js

Synchronizes the codebases between cursor-tutor and maxjoboffers-github.

```bash
# Synchronize all codebases (automatically selects the source with the most files)
node scripts/sync-codebases.js

# Specify a source codebase to use
node scripts/sync-codebases.js --source=cursor-tutor
node scripts/sync-codebases.js --source=github

# Only verify if codebases are in sync without making changes
node scripts/sync-codebases.js --verify
```

### analyze-codebases.js

Analyzes the codebases to determine which one has the most updated code.

```bash
# Analyze all codebases and provide a recommendation
node scripts/analyze-codebases.js
```

This script:
- Counts the number of files in each codebase
- Identifies the most recently modified files
- Calculates average modification times
- Counts unique files in each codebase
- Provides a recommendation on which codebase to use as the source for synchronization

### compare-env-files.js

Compares the .env files across the different codebases to determine which one is the most up-to-date.

```bash
# Compare .env files and provide a recommendation
node scripts/compare-env-files.js
```

This script:
- Checks for the existence of .env files in each codebase
- Compares file sizes (number of lines)
- Compares last modified times
- Identifies the most recent .env file
- Compares environment variables across the files
- Shows which variables are present or missing in each file
- Provides a recommendation on which .env file to use as the source
- Suggests commands to synchronize .env files

## Database Scripts

### fix-migration.js

Fixes migration issues in the database.

```bash
node scripts/fix-migration.js
```
