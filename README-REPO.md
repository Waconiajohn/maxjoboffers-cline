# MaxJobOffers

MaxJobOffers is a comprehensive job search application with advanced AI features for job seekers, particularly focused on executive-level positions.

## Features

- **AI Resume Optimization**: Analyze and optimize your resume for specific job descriptions
- **Cover Letter Generation**: Create tailored cover letters with AI
- **Job Search & Application**: Search for jobs and track your applications
- **Interview Preparation**: Practice with AI-generated interview questions and get feedback
- **LinkedIn Tools**: Optimize your LinkedIn profile and create content
- **Financial Planning**: Plan your career finances and salary negotiations

## Tech Stack

- **Frontend**: React, Material UI, TailwindCSS
- **Backend**: Node.js, Express, Prisma
- **Framework**: Wasp (Full-stack React/Node.js framework)
- **Database**: PostgreSQL
- **AI**: OpenAI API
- **File Storage**: AWS S3
- **Authentication**: JWT, Google, LinkedIn OAuth
- **Payments**: Stripe
- **Email**: SendGrid
- **Testing**: Jest, Playwright

## Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL
- Wasp CLI
- API keys for external services (OpenAI, AWS, etc.)

### Installation

1. Install Wasp CLI:
   ```bash
   curl -sSL https://get.wasp-lang.dev/installer.sh | sh
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/maxjoboffers.git
   cd maxjoboffers
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example` and fill in your API keys and configuration.

5. Start the development server:
   ```bash
   wasp start
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Database Setup

The database schema is defined in the `main.wasp` file and managed by Prisma. To set up the database:

1. Make sure PostgreSQL is running
2. Update the `DATABASE_URL` in your `.env` file
3. Run migrations:
   ```bash
   wasp db migrate-dev
   ```

## Project Structure

- `main.wasp` - Main configuration file for the Wasp application
- `src/` - Source code
  - `actions/` - Backend actions (API endpoints)
  - `queries/` - Backend queries
  - `pages/` - Frontend pages
  - `components/` - Reusable React components
  - `utils/` - Utility functions
  - `payment/` - Payment processing logic
  - `auth/` - Authentication logic

## Development

### Running Tests

```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run test:e2e
```

### Database Management

```bash
# Open Prisma Studio to manage your database
wasp db studio
```

### Building for Production

```bash
# Build the application
wasp build

# Deploy the application
wasp deploy
```

## Environment Variables

The following environment variables are required:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT authentication
- `OPENAI_API_KEY` - OpenAI API key
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region
- `AWS_S3_BUCKET` - AWS S3 bucket name
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `SENDGRID_API_KEY` - SendGrid API key

See `.env.example` for a complete list of environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Wasp](https://wasp-lang.dev/) - The full-stack framework used
- [OpenAI](https://openai.com/) - For the AI capabilities
- [Open SaaS](https://github.com/wasp-lang/open-saas) - For the SaaS template
