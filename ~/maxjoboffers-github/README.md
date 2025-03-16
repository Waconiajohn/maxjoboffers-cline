# MaxJobOffers

MaxJobOffers is a comprehensive job search application that helps users optimize their resumes, manage job applications, build professional networks, and prepare for interviews.

## Features

### Resume Management
- AI-powered resume optimization for specific job descriptions
- Multiple resume formats and templates
- ATS compatibility analysis
- Version control for tracking changes
- Resume comparison and improvement metrics

### Networking Strategy
- Connection analysis and path finding
- Campaign management for targeted outreach
- Message optimization for better response rates
- Content strategy for professional presence
- Group engagement recommendations

### Job Search
- Integration with Google Jobs API
- Job matching based on resume and skills
- Application tracking
- Company research

### Interview Preparation
- Mock interview sessions
- Question bank with AI-generated answers
- Company-specific research
- Interview coaching

## Technology Stack

### Frontend
- React with TypeScript
- Material-UI for component library
- React Router for navigation
- CSS animations and responsive design

### Backend
- Node.js with Express
- MongoDB for database
- AWS for cloud infrastructure
- Docker for containerization

### AI Integration
- OpenAI API for resume optimization and content generation
- Custom AI models for job matching and interview preparation

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose (for local development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/maxjoboffers.git
cd maxjoboffers
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

4. Start the development server:
```bash
npm start
```

5. For Docker setup:
```bash
docker-compose up -d
```

## Project Structure

```
maxjoboffers/
├── src/
│   ├── ai/                  # AI integration components
│   │   ├── resumePrompts.ts
│   │   ├── resumeReviewSystem.ts
│   │   ├── resumeVersionControl.ts
│   │   ├── atsSystemsAndNotifications.ts
│   │   ├── networkingPrompts.ts
│   │   └── networkingSystem.ts
│   ├── components/          # React components
│   │   ├── ui/              # UI components
│   │   │   ├── resume/      # Resume-related components
│   │   │   ├── networking/  # Networking-related components
│   │   │   ├── theme.ts     # Theme configuration
│   │   │   ├── Header.tsx   # Header component
│   │   │   ├── Sidebar.tsx  # Sidebar component
│   │   │   └── Dashboard.tsx # Dashboard component
│   │   └── App.tsx          # Main App component
│   ├── services/            # API and service integrations
│   ├── utils/               # Utility functions
│   ├── index.tsx            # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── docker/                  # Docker configuration
├── .env.example             # Example environment variables
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## AWS Integration

The application is deployed on AWS with the following services:
- EC2 for hosting the application
- RDS for database
- S3 for file storage
- Lambda for serverless functions
- API Gateway for API management
- CloudFront for content delivery

## Testing

Run tests with:
```bash
npm test
```

For end-to-end testing:
```bash
npm run test:e2e
```

## Deployment

The application can be deployed to AWS using:
```bash
npm run deploy
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI capabilities
- Material-UI for the component library
- The React team for the amazing framework
