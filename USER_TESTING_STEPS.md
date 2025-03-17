# User Testing Steps

This document outlines the steps needed to run the MaxJobOffers web application for live testing with real data and functional APIs.

## Prerequisites

1. Make sure you have the following installed:
   - Node.js (v16 or higher)
   - npm (v7 or higher)
   - Git

2. Ensure you have the following API keys and credentials:
   - AWS credentials (Access Key ID and Secret Access Key)
   - OpenAI API key
   - SendGrid API key
   - Google API credentials
   - Stripe API keys

## Step 1: Clone and Set Up the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/maxjoboffers.git
cd maxjoboffers

# Install dependencies
npm install
```

### Synchronizing Multiple Codebases (if applicable)

If you're working with multiple copies of the codebase (e.g., cursor-tutor and maxjoboffers-github), you can use these scripts to analyze and synchronize them:

#### 1. Analyze Codebases

First, analyze the codebases to determine which one has the most updated code:

```bash
node scripts/analyze-codebases.js
```

This script will:
- Count the number of files in each codebase
- Identify the most recently modified files
- Calculate average modification times
- Count unique files in each codebase
- Provide a recommendation on which codebase to use as the source for synchronization

#### 2. Compare Environment Files

Next, compare the .env files across the different codebases to determine which one is the most up-to-date:

```bash
node scripts/compare-env-files.js
```

This script will:
- Check for the existence of .env files in each codebase
- Compare file sizes and last modified times
- Identify the most recent .env file
- Compare environment variables across the files
- Provide a recommendation on which .env file to use as the source

#### 2. Synchronize Codebases

Then, synchronize the codebases using the recommended source:

```bash
# Synchronize all codebases (automatically selects the source with the most files)
node scripts/sync-codebases.js

# Specify a source codebase to use (based on the analysis recommendation)
node scripts/sync-codebases.js --source=cursor-tutor  # Use cursor-tutor as the source
node scripts/sync-codebases.js --source=github        # Use maxjoboffers-github as the source

# Only verify if codebases are in sync without making changes
node scripts/sync-codebases.js --verify
```

The sync-codebases.js script will:
1. Count the number of files in each codebase (if no source is specified)
2. Use the codebase with the most files as the source (or use the specified source)
3. Copy all files from the source to the other codebases
4. Verify that all codebases are in sync

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/maxjoboffers

# Authentication
JWT_SECRET=your-jwt-secret-key-here
SESSION_SECRET=your-session-secret-key-here

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@maxjoboffers.com

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-west-2
AWS_S3_BUCKET=your-s3-bucket-name

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_JOBS_API_KEY=your-google-jobs-api-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Application
PORT=3000
NODE_ENV=development
```

Replace all placeholder values with your actual API keys and credentials.

## Step 3: Set Up the Database

### Option 1: Local PostgreSQL Database

```bash
# Create a PostgreSQL database
createdb maxjoboffers

# Run database migrations
npm run db:migrate:dev
```

### Option 2: AWS RDS Database

1. Create an RDS PostgreSQL instance in us-west-2 region (follow AWS_RDS_SETUP_GUIDE.md)
2. Update the DATABASE_URL in your .env file to point to the RDS instance
3. Run database migrations:
   ```bash
   npm run db:migrate:dev
   ```

## Step 4: Test AWS S3 Configuration

```bash
# Test S3 credentials and access
node scripts/test-aws-credentials.js

# Test S3 bucket access
node scripts/test-s3-access.js

# Test file uploads to S3
node scripts/test-file-upload.js
```

## Step 5: Start the Development Server

```bash
# Start the development server
npm run dev
```

The application should now be running at http://localhost:3000

## Step 6: Test Resume Upload Functionality

1. Navigate to the Resume Manager section
2. Upload a real resume (PDF or DOCX format)
3. Verify that the resume is uploaded to S3
4. Check that the resume is parsed correctly

```bash
# You can also test resume uploads from the command line
node scripts/test-resume-upload.js path/to/your/resume.pdf
```

## Step 7: Test Job Search Functionality

1. Navigate to the Job Search section
2. Enter real job search criteria
3. Verify that job listings are fetched from the Google Jobs API
4. Test saving jobs to your dashboard

## Step 8: Test Interview Preparation

1. Navigate to the Interview Prep section
2. Generate interview questions based on a real job description
3. Test the mock interview simulator
4. Verify that OpenAI integration is working correctly

## Step 9: Test Networking Features

1. Navigate to the Networking section
2. Test LinkedIn profile analysis
3. Generate networking prompts for real companies
4. Verify email template generation

## Step 10: Test User Authentication

1. Test user registration
2. Test login functionality
3. Test Google OAuth integration
4. Verify JWT authentication is working

## Troubleshooting

If you encounter any issues:

1. Check the console for error messages
2. Verify that all API keys are correct in the .env file
3. Ensure the database is properly set up and migrations have run
4. Check that AWS S3 bucket permissions are configured correctly
5. Verify network connectivity to external APIs

## Running Tests

```bash
# Run all tests
npm test

# Run specific test files
npm test -- src/tests/services/resumeParser.test.ts
```

## Monitoring

You can monitor AWS resources using:

```bash
# Verify AWS regions
node scripts/verify-aws-regions.js

# Set up CloudWatch monitoring
node scripts/setup-cloudwatch-monitoring.js
```

## Deployment to EC2 (Optional)

If you want to deploy the application to EC2 for testing in a production-like environment:

```bash
# Update the EC2 instance with the latest code
./scripts/update-ec2.sh

# Update the EC2 environment variables
node scripts/update-ec2-env.js

# Install dependencies on EC2
node scripts/install-ec2-dependencies.js
```

The application should then be accessible at the EC2 instance's public IP address or domain name.
