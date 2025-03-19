# S3 Bucket Migration from West Coast to East Coast

## Overview

This PR updates all code references to use the new East Coast S3 bucket instead of the old West Coast bucket. The migration was necessary to reduce latency for users on the East Coast and to comply with data residency requirements.

## Changes

1. Updated hardcoded fallback values in the following files to use the new East Coast region and bucket name:
   - `src/utils/s3Uploader.ts`
   - `src/utils/multiRegionS3Client.js`
   - `scripts/test-file-upload.js`
   - `scripts/test-resume-upload.js`
   - `scripts/setup-cloudwatch-monitoring.js`
   - `scripts/setup-backup-procedures.js`

2. Created the new S3 bucket in the East Coast region using the `migrate-s3-bucket.js` script.

3. Verified that the file upload functionality works with the new bucket by successfully running the `test-file-upload.js` script.

## Testing

- Ran `test-file-upload.js` to verify that files can be uploaded to the new bucket.
- Verified that the CloudWatch monitoring and backup procedures are configured for the new bucket.

## Deployment

To deploy these changes to the EC2 instance, run the following command:

```bash
EC2_HOST=ec2-user@your-ec2-instance.amazonaws.com EC2_KEY_PATH=~/.ssh/your-key.pem node scripts/update-ec2-with-new-s3-config.js
```

This script will:
1. Update the `.env` file on the EC2 instance with the new S3 bucket configuration
2. Install the required dependencies
3. Restart the application

## Rollback Plan

If issues are encountered with the new East Coast bucket, we can revert to the West Coast bucket by:

1. Reverting the code changes in this PR
2. Updating the `.env` file on the EC2 instance to use the old West Coast bucket configuration
3. Restarting the application

Note: The old West Coast bucket has been deleted, so we would need to recreate it if a rollback is necessary.
