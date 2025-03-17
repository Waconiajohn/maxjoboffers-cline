# MaxJobOffers Scripts

This directory contains scripts for managing the MaxJobOffers application.

## File Upload Scripts

### test-file-upload.js

Tests file uploads to S3 using the AWS SDK.

```bash
node scripts/test-file-upload.js
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

Verifies that all AWS resources are in the correct region (us-west-2).

```bash
node scripts/verify-aws-regions.js
```

## S3 Uploader Utility

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

## GitHub Integration

### update-github.sh

Updates the GitHub repository with the latest changes.

```bash
./scripts/update-github.sh
```

## Database Scripts

### fix-migration.js

Fixes migration issues in the database.

```bash
node scripts/fix-migration.js
```
