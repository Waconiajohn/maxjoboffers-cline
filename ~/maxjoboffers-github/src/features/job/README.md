# Job Feature

This feature module provides job search and job application tracking functionality for the MaxJobOffers application.

## Overview

The Job feature is divided into two main parts:

1. **Job Search**: Allows users to search for job listings, filter results, and save jobs of interest.
2. **Job Tracking**: Helps users track their job applications, including status, contacts, interviews, follow-ups, and tasks.

## Directory Structure

```
job/
├── components/           # UI components
│   ├── JobSearchBoard.tsx
│   ├── JobSearchFilters.tsx
│   ├── JobCard.tsx
│   ├── JobTrackingDashboard.tsx
│   └── JobTrackingCard.tsx
├── services/             # Business logic
│   ├── jobSearchService.ts
│   └── jobTrackingService.ts
├── types/                # TypeScript interfaces and types
│   └── index.ts
├── index.ts              # Feature exports
└── README.md             # Documentation
```

## Usage

### Job Search

The job search functionality allows users to:

- Search for jobs using keywords and location
- Filter jobs by various criteria (remote, job type, experience level, etc.)
- Save jobs to favorites
- Mark jobs as applied

```tsx
import { JobSearchBoard, jobSearchService } from 'src/features/job';

// In your component
const MyComponent = () => {
  return <JobSearchBoard />;
};

// Or use the service directly
const searchJobs = async () => {
  const results = await jobSearchService.searchJobs({
    query: 'frontend developer',
    location: 'San Francisco',
    remote: true,
    jobType: [JobType.FullTime],
    experienceLevel: [ExperienceLevel.Mid, ExperienceLevel.Senior],
    salary: [100000, 150000],
    datePosted: 30, // last 30 days
    tags: ['React', 'TypeScript'],
    favorite: null,
    applied: false
  });
  
  console.log(results);
};
```

### Job Tracking

The job tracking functionality allows users to:

- Create and manage job applications
- Track application status (saved, applied, interview, offer, etc.)
- Manage contacts associated with applications
- Schedule and track interviews
- Create follow-up tasks and reminders

```tsx
import { JobTrackingDashboard, jobTrackingService } from 'src/features/job';

// In your component
const MyComponent = () => {
  return <JobTrackingDashboard />;
};

// Or use the service directly
const createApplication = async () => {
  const application = await jobTrackingService.createApplication(
    'job-id-123',
    'resume-id-456',
    'cover-letter-id-789'
  );
  
  console.log(application);
};
```

## Types

The feature exports various TypeScript types for job search and tracking:

- `Job`: Represents a job listing
- `JobSearchFilters`: Filters for job search
- `JobSearchResults`: Results from a job search
- `JobApplication`: Represents a job application
- `ApplicationStatus`: Enum for application status
- `ContactPerson`: Contact associated with an application
- `Interview`: Interview for a job application
- `FollowUp`: Follow-up action for an application
- `ApplicationTask`: Task related to an application

## Services

### jobSearchService

Provides methods for searching and interacting with job listings:

- `searchJobs(filters, page, pageSize)`: Search for jobs with filters
- `getJobById(id)`: Get a job by ID
- `saveJob(jobId, favorite)`: Mark a job as favorite
- `markJobAsApplied(jobId)`: Mark a job as applied
- `addJobNotes(jobId, notes)`: Add notes to a job

### jobTrackingService

Provides methods for managing job applications:

- `getApplications()`: Get all applications
- `getApplicationById(id)`: Get an application by ID
- `getApplicationsByStatus(status)`: Get applications by status
- `createApplication(jobId, resumeId, coverLetterId)`: Create a new application
- `updateApplication(id, updates)`: Update an application
- `updateStatus(id, status)`: Update application status
- `addContact(applicationId, contact)`: Add a contact to an application
- `addInterview(applicationId, interview)`: Add an interview to an application
- `addFollowUp(applicationId, followUp)`: Add a follow-up to an application
- `addTask(applicationId, task)`: Add a task to an application
- `deleteApplication(id)`: Delete an application

## Components

- `JobSearchBoard`: Main component for job search
- `JobSearchFilters`: Filters for job search
- `JobCard`: Card component for displaying a job
- `JobTrackingDashboard`: Main component for job tracking
- `JobTrackingCard`: Card component for displaying a job application
