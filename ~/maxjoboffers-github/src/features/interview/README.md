# Interview Feature

This feature module provides interview preparation functionality for the MaxJobOffers application.

## Overview

The Interview feature helps users prepare for job interviews by:

1. Generating comprehensive interview preparation guides
2. Providing company research and insights
3. Creating tailored interview questions and answers
4. Offering interview tips and strategies

## Directory Structure

```
interview/
├── components/           # UI components
│   ├── InterviewDashboard.tsx
│   ├── InterviewViewer.tsx
│   └── InterviewGenerator.tsx
├── services/             # Business logic
│   └── interviewPrep.ts
├── types/                # TypeScript interfaces and types
│   └── interviewPrep.ts
├── ai/                   # AI prompts and utilities
│   └── interviewPrompts.ts
├── index.ts              # Feature exports
└── README.md             # Documentation
```

## Usage

### Interview Preparation

The interview preparation functionality allows users to:

- Generate comprehensive interview guides for specific job applications
- View company research and competitor analysis
- Practice with tailored interview questions
- Get tips and strategies for successful interviews

```tsx
import { InterviewDashboard, interviewPrepService } from 'src/features/interview';

// In your component
const MyComponent = () => {
  return <InterviewDashboard />;
};

// Or use the service directly
const generateGuide = async () => {
  const guide = await interviewPrepService.generateGuide({
    jobId: 'job-id-123',
    resumeId: 'resume-id-456',
    jobTitle: 'Senior Frontend Developer',
    companyName: 'TechCorp',
    jobDescription: 'We are looking for a Senior Frontend Developer...',
    resumeContent: 'Resume content here...'
  });
  
  console.log(guide);
};
```

## Types

The feature exports various TypeScript types for interview preparation:

- `InterviewPrepGuide`: The complete interview preparation guide
- `CompanyResearch`: Company information and insights
- `Competitor`: Competitor analysis
- `GrowthArea`: Company growth areas
- `Risk`: Company risks and challenges
- `RoleImpact`: How the role impacts the company
- `InterviewQuestion`: Interview question with answer
- `InterviewTip`: Interview tip or strategy
- `InterviewPrepGenerationParams`: Parameters for generating a guide

## Services

### interviewPrepService

Provides methods for generating and managing interview preparation guides:

- `generateGuide(params)`: Generate a new interview preparation guide
- `getAllGuides()`: Get all guides for a user
- `getGuideById(id)`: Get a specific guide by ID
- `getGuidesByJobId(jobId)`: Get guides for a specific job
- `deleteGuide(id)`: Delete a guide

## Components

- `InterviewDashboard`: Main component for viewing all interview guides
- `InterviewViewer`: Component for viewing a specific interview guide
- `InterviewGenerator`: Component for generating a new interview guide

## AI Integration

The interview feature uses AI to generate personalized interview preparation content:

- Company research based on the job description and company name
- Competitor analysis
- Growth areas and risks
- Role impact analysis
- Tailored interview questions and answers
- Interview tips and strategies

The AI prompts are defined in `interviewPrompts.ts` and used by the `interviewPrepService` to generate content.
