# Resume Feature

This feature module provides resume-related functionality for the MaxJobOffers application, including AI-assisted resume creation, editing, and optimization.

## Overview

The Resume feature helps users with:

1. Creating and managing multiple resumes
2. Optimizing resumes for ATS (Applicant Tracking Systems)
3. Tailoring resumes for specific job descriptions
4. Tracking resume versions and changes
5. Analyzing resume effectiveness
6. Exporting resumes in various formats

## Directory Structure

```
resume/
├── ai/                  # AI prompts and utilities
│   └── resumePrompts.ts # Prompts for AI-assisted resume writing
├── components/          # UI components
│   ├── AIAssistant.tsx  # AI assistant component
│   ├── ResumeAnalytics.tsx # Resume analysis component
│   ├── ResumeEditor.tsx # Resume editing component
│   ├── ResumeManager.tsx # Main resume management component
│   ├── ResumePreview.tsx # Resume preview component
│   ├── ResumeTemplates.tsx # Resume templates component
│   └── ResumeVersionHistory.tsx # Version history component
├── services/            # Business logic
│   └── resumeService.ts # Service for resume operations
├── types/               # TypeScript interfaces and types
│   └── index.ts         # Resume-related types
├── index.ts             # Feature exports
└── README.md            # Documentation
```

## Usage

```tsx
// Import from the feature module
import { ResumeManager, resumeService } from 'src/features/resume';

// Example usage in a component
function ResumeFeature() {
  return (
    <ResumeManager userId="user-123" />
  );
}
```

## Components

### ResumeManager

The main component that orchestrates the resume feature. It provides:

- Resume list management
- Resume creation and editing
- Version history tracking
- Resume analysis
- Template application
- Export functionality
- AI assistance

### ResumeEditor

Component for editing resume content, including:

- Personal information
- Summary
- Experience
- Education
- Skills
- Projects
- Certifications
- Awards
- Publications
- Languages
- Interests
- References

### ResumeAnalytics

Component for analyzing resume effectiveness, including:

- ATS compatibility score
- Keyword analysis
- Section-by-section evaluation
- Improvement suggestions

### ResumeVersionHistory

Component for managing resume versions, including:

- Version comparison
- Version restoration
- Version deletion

### ResumeTemplates

Component for applying templates to resumes, including:

- Professional templates
- Modern templates
- Creative templates
- Executive templates
- ATS-optimized templates

### ResumePreview

Component for previewing how the resume will look when exported.

### AIAssistant

Component for providing AI-assisted resume writing, including:

- Section rewriting
- Content optimization
- ATS compatibility improvements
- Job-specific tailoring

## Services

### resumeService

Provides methods for managing resumes:

- `getResumes(userId)`: Get all resumes for a user
- `getResumeById(id)`: Get a resume by ID
- `createResume(userId, name, format, data)`: Create a new resume
- `updateResume(id, updates)`: Update a resume
- `deleteResume(id)`: Delete a resume
- `getResumeVersions(resumeId)`: Get all versions of a resume
- `getResumeVersion(versionId)`: Get a specific version of a resume
- `createVersion(resumeId, name, data)`: Create a new version of a resume
- `setActiveVersion(versionId)`: Set a version as the active version
- `deleteVersion(versionId)`: Delete a version
- `getResumeTemplates()`: Get all resume templates
- `getResumeTemplateById(id)`: Get a resume template by ID
- `applyTemplate(resumeId, templateId)`: Apply a template to a resume
- `exportResume(resumeId, options)`: Export a resume
- `importResume(userId, source, content, options)`: Import a resume
- `analyzeResume(resumeId, jobTitle, jobDescription)`: Analyze a resume
- `requestAIRewrite(request)`: Request AI rewrite
- `applyAIRewrite(resumeId, rewriteResponseId)`: Apply AI rewrite
- `generateAIPrompt(type, params)`: Generate AI prompts for resume-related tasks

## Types

The feature exports various TypeScript types:

- `ResumeData`: The main resume data structure
- `ResumeHeader`: Resume header information
- `ResumeExperienceItem`: Resume experience item
- `ResumeEducationItem`: Resume education item
- `ResumeSkillItem`: Resume skill item
- `ResumeProjectItem`: Resume project item
- `ResumeCertificationItem`: Resume certification item
- `ResumeAwardItem`: Resume award item
- `ResumePublicationItem`: Resume publication item
- `ResumeLanguageItem`: Resume language item
- `ResumeCustomSectionItem`: Resume custom section item
- `ResumeVersion`: Resume version
- `ResumeTemplate`: Resume template
- `ResumeFormat`: Resume format enum
- `ResumeSection`: Resume section enum
- `ResumeExportFormat`: Resume export format enum
- `ResumeExportOptions`: Resume export options
- `ResumeImportSource`: Resume import source enum
- `ResumeImportOptions`: Resume import options
- `ResumeParsingResult`: Resume parsing result
- `ResumeAnalysis`: Resume analysis
- `ATSScore`: ATS score
- `AIRewriteRequest`: AI rewrite request
- `AIRewriteResponse`: AI rewrite response

## AI Prompts

The feature exports various AI prompt generators:

- `generateResumeAnalysisPrompt`: Generate a resume analysis prompt
- `generateResumeSummaryRewritePrompt`: Generate a resume summary rewrite prompt
- `generateResumeExperienceBulletRewritePrompt`: Generate a resume experience bullet rewrite prompt
- `generateResumeSkillsRewritePrompt`: Generate a resume skills rewrite prompt
- `generateATSOptimizationPrompt`: Generate an ATS optimization prompt
- `generateJobTailoringPrompt`: Generate a job tailoring prompt
- `getSectionRewritePrompt`: Get a section-specific rewrite prompt
- `generateResumeImprovementSuggestionsPrompt`: Generate a resume improvement suggestions prompt
- `generateResumeComparisonPrompt`: Generate a resume comparison prompt
- `generateResumeGenerationPrompt`: Generate a resume generation prompt

## Integration with Other Features

The Resume feature integrates with:

- **Job Search**: Tailoring resumes for specific job listings
- **Interview Prep**: Using resume content to generate interview questions and answers
- **LinkedIn**: Syncing resume content with LinkedIn profile
- **Networking**: Using resume content to generate networking talking points
