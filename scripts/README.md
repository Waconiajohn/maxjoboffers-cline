# MaxJobOffers Scripts

This directory contains utility scripts for the MaxJobOffers application.

## File Upload Scripts

### test-file-upload.js

Tests the S3 file upload functionality using the AWS SDK. It creates a test file and uploads it to the S3 bucket.

```bash
node scripts/test-file-upload.js
```

## Deployment Scripts

### update-ec2.sh

Updates the EC2 instance with the latest changes from GitHub, installs dependencies, and restarts the application.

```bash
./scripts/update-ec2.sh
```

## Monitoring Scripts

### setup-cloudwatch-monitoring.js

Sets up CloudWatch monitoring for S3 operations. It creates CloudWatch alarms for S3 operations and configures notifications.

```bash
node scripts/setup-cloudwatch-monitoring.js
```

## Backup Scripts

### setup-backup-procedures.js

Sets up backup procedures for important files. It configures S3 lifecycle rules for backups and creates a backup script.

```bash
node scripts/setup-backup-procedures.js
```

### run-backup.sh

Creates backups of important files and uploads them to S3. This script is automatically created by the setup-backup-procedures.js script.

```bash
./scripts/run-backup.sh
```

## Database Scripts

### init-database.js

Initializes the database with the required tables and initial data.

```bash
node scripts/init-database.js
```

### run-migration.js

Runs database migrations to update the database schema.

```bash
node scripts/run-migration.js
```

### verify-database.js

Verifies the database connection and schema.

```bash
node scripts/verify-database.js
```

## GitHub Scripts

### update-github.sh

Updates the GitHub repository with the latest changes.

```bash
./scripts/update-github.sh
```

## AWS Configuration

The scripts use the following environment variables for AWS configuration:

- `AWS_REGION`: The AWS region (default: us-west-2)
- `AWS_ACCESS_KEY_ID`: The AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: The AWS secret access key
- `AWS_S3_BUCKET`: The S3 bucket name (default: executive-lms-backups-266735837284)

These environment variables should be set in the .env file.
