# MaxJobOffers - AI-Powered Job Search & Application Platform

MaxJobOffers is a comprehensive job search and application platform that leverages AI to help users find jobs, optimize their resumes, create cover letters, prepare for interviews, and more.

## Features

- **Job Search**: Search for jobs using the Google Jobs API
- **Resume Management**: Upload, analyze, and optimize resumes for specific job descriptions
- **Cover Letter Generation**: Create tailored cover letters using AI
- **Interview Preparation**: Mock interviews with AI feedback and recording capabilities
- **LinkedIn Profile Optimization**: Generate and optimize LinkedIn profiles
- **Financial Planning**: Salary negotiation strategies and career growth planning
- **Company Research**: AI-powered company research for interview preparation
- **Subscription Plans**: Various subscription plans and credit-based payment options

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Wasp Framework
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4 API
- **File Storage**: AWS S3
- **Payments**: Stripe
- **Authentication**: JWT, OAuth (Google, LinkedIn)
- **Containerization**: Docker
- **Deployment**: AWS

## Prerequisites

- Node.js (v18+)
- Docker and Docker Compose
- Wasp CLI
- PostgreSQL (or use the Docker container)
- AWS Account (for S3 file storage)
- Stripe Account (for payments)
- OpenAI API Key
- Google Jobs API Key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/maxjoboffers

# Authentication
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=your-aws-region
AWS_S3_BUCKET=your-aws-s3-bucket

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key

# Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_JOBS_API_KEY=your-google-jobs-api-key

# LinkedIn
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Payment Plans
PAYMENTS_BASIC_SUBSCRIPTION_PLAN_ID=your-basic-subscription-plan-id
PAYMENTS_PROFESSIONAL_SUBSCRIPTION_PLAN_ID=your-professional-subscription-plan-id
PAYMENTS_ENTERPRISE_SUBSCRIPTION_PLAN_ID=your-enterprise-subscription-plan-id
PAYMENTS_CREDITS_10_PLAN_ID=your-credits-10-plan-id
PAYMENTS_CREDITS_50_PLAN_ID=your-credits-50-plan-id
PAYMENTS_CREDITS_100_PLAN_ID=your-credits-100-plan-id
```

## Installation

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/maxjoboffers.git
   cd maxjoboffers
   ```

2. Create a `.env` file with the required environment variables (see above).

3. Build and start the Docker containers:
   ```bash
   docker-compose up -d
   ```

4. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - pgAdmin: http://localhost:5050 (email: admin@maxjoboffers.com, password: admin)

### Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/maxjoboffers.git
   cd maxjoboffers
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the required environment variables (see above).

4. Start the development server:
   ```bash
   wasp start
   ```

5. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Development

### Project Structure

- `main.wasp`: Wasp configuration file
- `src/`: Source code
  - `actions/`: Server-side actions
  - `queries/`: Server-side queries
  - `pages/`: React pages
  - `components/`: React components
  - `utils/`: Utility functions
  - `payment/`: Payment-related code
  - `auth/`: Authentication-related code
  - `__mocks__/`: Mock files for testing

### Running Tests

```bash
npm test
```

### Building for Production

```bash
wasp build
```

The built application will be in the `.wasp/build` directory.

## Deployment

### AWS Deployment

1. Build the Docker image:
   ```bash
   docker build -t maxjoboffers .
   ```

2. Push the image to Amazon ECR:
   ```bash
   aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com
   docker tag maxjoboffers:latest your-account-id.dkr.ecr.your-region.amazonaws.com/maxjoboffers:latest
   docker push your-account-id.dkr.ecr.your-region.amazonaws.com/maxjoboffers:latest
   ```

3. Deploy using AWS ECS or Elastic Beanstalk.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Wasp Framework](https://wasp-lang.dev/)
- [OpenAI](https://openai.com/)
- [Google Jobs API](https://developers.google.com/jobs)
- [Stripe](https://stripe.com/)
- [AWS](https://aws.amazon.com/)
