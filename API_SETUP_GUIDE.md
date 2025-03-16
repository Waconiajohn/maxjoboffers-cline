# API Setup Guide for MaxJobOffers

This guide provides instructions for setting up all the external APIs and services required by the MaxJobOffers application.

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [OpenAI API](#openai-api)
3. [AWS S3](#aws-s3)
4. [Stripe](#stripe)
5. [SendGrid](#sendgrid)
6. [Google APIs](#google-apis)
7. [Testing Without APIs](#testing-without-apis)

## Environment Variables

The application uses environment variables to store API keys and credentials. These are referenced in the docker-compose.yml file. You should create a `.env` file in the root directory of the project with the following variables:

```
# JWT and Session
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# AWS
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_aws_s3_bucket

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_JOBS_API_KEY=your_google_jobs_api_key

# Subscription Plans
PAYMENTS_BASIC_SUBSCRIPTION_PLAN_ID=your_basic_subscription_plan_id
PAYMENTS_PROFESSIONAL_SUBSCRIPTION_PLAN_ID=your_professional_subscription_plan_id
PAYMENTS_ENTERPRISE_SUBSCRIPTION_PLAN_ID=your_enterprise_subscription_plan_id
PAYMENTS_CREDITS_10_PLAN_ID=your_credits_10_plan_id
PAYMENTS_CREDITS_50_PLAN_ID=your_credits_50_plan_id
PAYMENTS_CREDITS_100_PLAN_ID=your_credits_100_plan_id
```

## OpenAI API

The application uses OpenAI's API for AI-powered features like resume optimization, cover letter generation, and interview preparation.

1. Go to [OpenAI's website](https://openai.com/) and create an account
2. Navigate to the API section and create an API key
3. Copy the API key and add it to your `.env` file as `OPENAI_API_KEY`

## AWS S3

AWS S3 is used for file storage, particularly for storing resumes and other documents.

1. Create an AWS account if you don't have one
2. Go to the AWS Management Console and navigate to the IAM service
3. Create a new user with programmatic access
4. Attach the `AmazonS3FullAccess` policy to the user
5. Copy the Access Key ID and Secret Access Key
6. Add them to your `.env` file as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
7. Go to the S3 service and create a new bucket
8. Configure the bucket for public access if needed
9. Add the bucket name and region to your `.env` file as `AWS_S3_BUCKET` and `AWS_REGION`

## Stripe

Stripe is used for payment processing, including subscriptions and one-time purchases.

1. Create a Stripe account if you don't have one
2. Go to the Stripe Dashboard and navigate to the Developers section
3. Get your API keys (both publishable and secret)
4. Add them to your `.env` file as `STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`
5. Set up webhook endpoints and get the webhook secret
6. Add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`
7. Create subscription products and plans in the Stripe Dashboard
8. Add the plan IDs to your `.env` file as the corresponding subscription plan variables

## SendGrid

SendGrid is used for sending emails, including verification emails, password reset emails, and notifications.

1. Create a SendGrid account if you don't have one
2. Go to the SendGrid Dashboard and navigate to the API Keys section
3. Create a new API key with full access
4. Add it to your `.env` file as `SENDGRID_API_KEY`
5. Set up sender authentication for your domain
6. Update the email sender configuration in the `main.wasp` file if needed

## Google APIs

Google APIs are used for authentication (Google Sign-In) and job search (Google Jobs API).

### Google Sign-In

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to the APIs & Services > Credentials section
4. Create OAuth 2.0 Client IDs for web application
5. Configure the authorized redirect URIs (e.g., `http://localhost:3000/auth/google/callback` for development)
6. Copy the Client ID and Client Secret
7. Add them to your `.env` file as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### Google Jobs API

1. In the same Google Cloud project, navigate to the APIs & Services > Library section
2. Search for and enable the "Cloud Talent Solution API"
3. Create an API key
4. Add it to your `.env` file as `GOOGLE_JOBS_API_KEY`

## Testing Without APIs

During development and testing, you may want to use mock APIs instead of the real ones. Here's how to set up mock APIs for testing:

### Mock OpenAI API

The tests already include mock implementations of the OpenAI API. These mocks are defined in the test files and simulate the responses from the OpenAI API.

### Mock AWS S3

For testing file uploads without using the real AWS S3 service, you can use the mock implementation in `src/__mocks__/wasp/server/fileUploads.ts`.

### Mock Stripe

For testing payments without using the real Stripe service, you can create mock implementations of the Stripe API in your test files.

### Running Tests with Mocks

When running tests, the mock implementations will be used automatically. You don't need to set up the real APIs for the tests to pass.

However, for end-to-end testing with Cypress, you'll need to have the application running with the real APIs or with mock servers that simulate the API responses.

## AWS Infrastructure Setup

The application uses AWS infrastructure for both the database and compute resources. For detailed instructions, please refer to the [AWS RDS Setup Guide](./AWS_RDS_SETUP_GUIDE.md).

### Database Setup (AWS RDS)

1. Create an AWS RDS PostgreSQL instance (version 14 recommended)
2. Configure security groups to allow access from your application
3. Create a database user and schema for the application
4. Update your `.env` file with the RDS connection string
5. Run database migrations to create the necessary tables

### Compute Resources (AWS EC2)

1. Launch EC2 instances to host your application
2. Configure networking between EC2 and RDS
3. Deploy your application to EC2
4. Set up a process manager (PM2) and reverse proxy (Nginx)
5. Optional: Configure auto scaling and load balancing for production

### Networking

1. Place EC2 and RDS in the same VPC
2. Configure security groups to allow communication
3. Use private subnets for RDS and public subnets for EC2
4. Set up proper network ACLs for additional security

## Development Environment

Your development environment is set up using Docker Compose. The `docker-compose.yml` file defines the following services:

1. `app`: The main application container
2. `stripe-cli`: Stripe CLI for forwarding webhook events to your local environment

To start the development environment:

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d
```

To stop the development environment:

```bash
# Stop all services
docker-compose down
```

## Next Steps

After setting up the APIs and environment variables:

1. Start the development environment
2. Run the database migration
3. Run the tests to ensure everything works correctly
4. Begin development or deployment
