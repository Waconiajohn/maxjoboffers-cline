# Resume Feature

This feature module provides resume management functionality for the MaxJobOffers application.

## Overview

The resume feature helps users manage their resumes by:

1. Uploading and storing resumes
2. Optimizing resumes for ATS systems
3. Analyzing resumes against job descriptions
4. Managing multiple resume versions

## Directory Structure

```
resume/
├── actions/         # Resume-related actions
├── components/      # UI components
├── pages/           # Page components
├── services/        # Business logic
├── types/           # TypeScript interfaces and types
├── index.ts         # Feature exports
└── README.md        # Documentation
```

## Components

- **ResumeUpload**: Component for uploading resumes
- **ResumeManager**: Modern Material-UI based component for managing resume versions with:
  - Resume version management with status indicators
  - Section-based resume editor with drag-and-drop reordering
  - Real-time validation and error checking
  - Job requirements analysis
  - Auto-save functionality
- **ResumeList**: Component for displaying a list of resumes (to be implemented)
- **ResumeDetail**: Component for displaying resume details (to be implemented)

## Actions

- **uploadResume**: Action for uploading a resume
- **analyzeResume**: Action for analyzing a resume against a job description (to be implemented)
- **changeResumeFormat**: Action for changing the format of a resume (to be implemented)

## Usage

```tsx
// Import components
import { ResumeUpload, ResumeManager } from 'src/features/resume';

// Import pages
import { ResumeUploadPage, ResumeManagerPage } from 'src/features/resume';

// Import actions
import { uploadResume, analyzeResume } from 'src/features/resume';

// Import services
import { 
  fetchResumeVersions, 
  fetchJobRequirements, 
  createResumeVersion 
} from 'src/features/resume';

// Use the ResumeUpload component
const UploadComponent = () => {
  return <ResumeUpload />;
};

// Use the ResumeManager component
const ManagerComponent = () => {
  return <ResumeManager />;
};

// Use the ResumeManagerPage component
const ManagerPageComponent = () => {
  return <ResumeManagerPage />;
};
```

## Future Enhancements

- Resume comparison with side-by-side view
- AI-powered resume optimization suggestions
- Resume templates with industry-specific formats
- Export to multiple formats (PDF, DOCX, TXT, JSON)
- Resume analytics with heatmap of recruiter attention
- Keyword density analysis
- Integration with job application tracking
