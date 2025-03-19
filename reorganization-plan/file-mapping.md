# File Mapping for Reorganization

This document maps current files to their new locations in the reorganized structure.

## Components

### Current → New

```
# UI Components
src/components/ui/theme.ts → src/styles/theme.ts
src/components/ui/Header.tsx → src/components/layout/Header.tsx
src/components/ui/Layout.tsx → src/components/layout/Layout.tsx
src/components/ui/Sidebar.tsx → src/components/layout/Sidebar.tsx
src/components/ui/Dashboard.tsx → src/components/dashboard/Dashboard.tsx
src/components/ui/networking/NetworkingManager.tsx → src/components/networking/NetworkingManager.tsx
src/components/ui/resume/ResumeManager.tsx → src/components/resume/ResumeManager.tsx

# Dashboard Components
src/components/dashboard/DashboardContainer.tsx → src/components/dashboard/DashboardContainer.tsx
src/components/dashboard/ResourcesAndEventsContainer.tsx → src/components/dashboard/ResourcesEventsContainer.tsx

# Job Components
src/components/jobSearch/JobSearchBoard.tsx → src/components/job/JobSearchBoard.tsx
src/components/jobSearch/JobCard.tsx → src/components/job/JobCard.tsx
src/components/jobSearch/JobSearchFilters.tsx → src/components/job/JobSearchFilters.tsx
src/components/jobTracking/JobTrackingCard.tsx → src/components/job/JobTrackingCard.tsx
src/components/jobTracking/JobTrackingDashboard.tsx → src/components/job/JobTrackingDashboard.tsx

# LinkedIn Components
src/components/linkedin/LinkedInProfileEditor.tsx → src/components/linkedin/ProfileEditor.tsx
src/components/linkedin/SectionSelector.tsx → src/components/linkedin/SectionSelector.tsx
src/components/linkedin/ContentEditor.tsx → src/components/linkedin/ContentEditor.tsx
src/components/linkedin/PromptWindow.tsx → src/components/linkedin/PromptWindow.tsx
src/components/linkedin/JobTitleInput.tsx → src/components/linkedin/JobTitleInput.tsx
src/components/linkedin/IndustryInput.tsx → src/components/linkedin/IndustryInput.tsx
src/components/linkedin/UploadArea.tsx → src/components/common/UploadArea.tsx

# Interview Components
src/components/interview/InterviewPrepDashboard.tsx → src/components/interview/InterviewDashboard.tsx
src/components/interview/InterviewPrepViewer.tsx → src/components/interview/InterviewViewer.tsx
src/components/interview/InterviewPrepGenerator.tsx → src/components/interview/InterviewGenerator.tsx

# Resource Components
src/components/resources/FilterChips.tsx → src/components/common/FilterChips.tsx
src/components/resources/ResourceLibrary.tsx → src/components/resources/ResourceLibrary.tsx
src/components/events/UpcomingEvents.tsx → src/components/resources/UpcomingEvents.tsx

# Retirement Components
src/components/retirement/RetirementDashboard.tsx → src/components/retirement/RetirementDashboard.tsx
src/components/retirement/IncentiveCalculator.tsx → src/components/retirement/IncentiveCalculator.tsx
src/components/retirement/OnboardingForm.tsx → src/components/retirement/OnboardingForm.tsx

# App Component
src/components/App.tsx → src/App.tsx
```

## Services and Logic

### Current → New

```
# Job Services
src/services/jobSearch.ts → src/features/job/jobSearchService.ts
src/services/jobTracking.ts → src/features/job/jobTrackingService.ts
src/services/coverLetterGenerator.ts → src/features/job/coverLetterService.ts

# Resume Services
src/services/resumeGenerator.ts → src/features/resume/resumeGeneratorService.ts
src/services/resumeParser.ts → src/features/resume/resumeParserService.ts

# Interview Services
src/services/interviewPrep.ts → src/features/interview/interviewService.ts

# Resource Services
src/services/resourcesAndEvents.ts → src/features/resources/resourcesService.ts

# Retirement Services
src/services/retirement.ts → src/features/retirement/retirementService.ts
src/api/retirement.ts → src/features/retirement/retirementApi.ts
```

## AI Files

### Current → New

```
# Resume AI
src/ai/resumePrompts.ts → src/features/resume/resumePrompts.ts
src/ai/resumeReviewSystem.ts → src/features/resume/resumeReviewSystem.ts
src/ai/resumeVersionControl.ts → src/features/resume/resumeVersionControl.ts
src/ai/atsSystemsAndNotifications.ts → src/features/resume/atsSystem.ts
src/ai/resumeManager.ts → src/features/resume/resumeAiManager.ts

# Networking AI
src/ai/networkingPrompts.ts → src/features/networking/networkingPrompts.ts
src/ai/networkingSystem.ts → src/features/networking/networkingSystem.ts

# Interview AI
src/ai/interviewPrompts.ts → src/features/interview/interviewPrompts.ts

# AI Index
src/ai/index.ts → src/ai/index.ts (consolidated AI utilities)
```

## Types

### Current → New

```
# Common Types
src/types/index.ts → src/types/index.ts

# Feature-specific Types
src/types/jobTracking.ts → src/features/job/types.ts
src/types/jobSearch.ts → src/features/job/types.ts (merged)
src/types/resume.ts → src/features/resume/types.ts
src/types/coverLetter.ts → src/features/job/types.ts (merged)
src/types/interviewPrep.ts → src/features/interview/types.ts
src/types/retirement.ts → src/features/retirement/types.ts
```

## Tests

### Current → New

```
# Test Setup
src/tests/setup.ts → tests/setup.ts
vitest.config.ts → vitest.config.ts (unchanged)

# Service Tests
src/tests/services/jobSearch.test.ts → tests/unit/job/jobSearch.test.ts
src/tests/services/jobTracking.test.ts → tests/unit/job/jobTracking.test.ts
src/tests/services/resumeGenerator.test.ts → tests/unit/resume/resumeGenerator.test.ts
src/tests/services/coverLetterGenerator.test.ts → tests/unit/job/coverLetterGenerator.test.ts
src/tests/services/interviewPrep.test.ts → tests/unit/interview/interviewPrep.test.ts
src/tests/services/resumeParser.test.ts → tests/unit/resume/resumeParser.test.ts
src/tests/services/retirement.test.ts → tests/unit/retirement/retirement.test.ts

# Component Tests
src/tests/components/interview/InterviewPrepGenerator.test.tsx → tests/unit/interview/InterviewGenerator.test.tsx
src/tests/components/retirement/IncentiveCalculator.test.tsx → tests/unit/retirement/IncentiveCalculator.test.tsx

# API Tests
src/tests/api/retirement.test.ts → tests/unit/retirement/retirementApi.test.ts

# Integration Tests
src/tests/integration/retirementFlow.test.tsx → tests/integration/retirement/retirementFlow.test.tsx
```

## Utils and Mocks

### Current → New

```
# Utils
src/utils/s3Uploader.ts → src/utils/s3Uploader.ts
src/utils/multiRegionS3Client.js → src/utils/multiRegionS3Client.ts (convert to TypeScript)

# Mocks
src/mocks/resourcesAndEvents.ts → src/features/resources/mocks.ts
src/mocks/wasp-server-fileUploads.ts → src/mocks/fileUploads.ts
src/mocks/wasp-server.ts → src/mocks/server.ts
```

## Actions

### Current → New

```
src/actions/resume.ts → src/features/resume/actions.ts
src/actions/interview.ts → src/features/interview/actions.ts
```

## Scripts

Scripts directory remains largely unchanged, but can be better organized by purpose:

```
scripts/
├── deployment/           # Deployment-related scripts
├── database/             # Database-related scripts
├── aws/                  # AWS-specific scripts
└── utils/                # Utility scripts
```

## Directories to Delete (After Migration)

These directories will be empty after migration and can be deleted:

1. `src/components/ui`
2. `src/components/jobSearch`
3. `src/components/jobTracking`
4. `src/components/events`
5. `src/services`
6. `src/ai` (after consolidation)
7. `src/tests` (after moving to top-level)
