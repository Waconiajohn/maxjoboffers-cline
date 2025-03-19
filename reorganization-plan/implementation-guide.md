# Implementation Guide for Project Reorganization

This guide outlines the step-by-step process to reorganize the MaxJobOffers project structure according to the proposed plan.

## Prerequisites

Before starting the reorganization:

1. Ensure all tests are passing in the current structure
2. Create a backup of the entire project
3. Create a new branch for the reorganization
4. Have the file mapping document ready for reference

## Implementation Steps

### 1. Create New Directory Structure

First, create the new directory structure without moving any files:

```bash
# Create top-level directories
mkdir -p tests/unit tests/integration tests/e2e

# Create src directories
mkdir -p src/assets src/components/common src/components/dashboard src/components/job \
  src/components/resume src/components/interview src/components/linkedin \
  src/components/networking src/components/resources src/components/retirement \
  src/components/layout src/features/auth src/features/job src/features/resume \
  src/features/interview src/features/linkedin src/features/networking \
  src/features/resources src/features/retirement src/features/payment \
  src/hooks src/utils src/api src/ai src/types src/config src/styles src/mocks

# Create script directories
mkdir -p scripts/deployment scripts/database scripts/aws scripts/utils
```

### 2. Move Files in Phases

#### Phase 1: Move Non-Component Files

Start with files that have fewer dependencies:

```bash
# Move utility files
cp src/utils/* src/utils/
cp src/utils/multiRegionS3Client.js src/utils/multiRegionS3Client.ts  # Convert to TypeScript

# Move type definitions
cp src/types/index.ts src/types/
cp src/types/jobTracking.ts src/features/job/types.ts
cp src/types/jobSearch.ts src/features/job/  # Will merge later
cp src/types/resume.ts src/features/resume/types.ts
cp src/types/coverLetter.ts src/features/job/  # Will merge later
cp src/types/interviewPrep.ts src/features/interview/types.ts
cp src/types/retirement.ts src/features/retirement/types.ts

# Move mock files
cp src/mocks/resourcesAndEvents.ts src/features/resources/mocks.ts
cp src/mocks/wasp-server-fileUploads.ts src/mocks/fileUploads.ts
cp src/mocks/wasp-server.ts src/mocks/server.ts

# Move test files
cp src/tests/setup.ts tests/
cp src/tests/services/jobSearch.test.ts tests/unit/job/jobSearch.test.ts
cp src/tests/services/jobTracking.test.ts tests/unit/job/jobTracking.test.ts
cp src/tests/services/resumeGenerator.test.ts tests/unit/resume/resumeGenerator.test.ts
cp src/tests/services/coverLetterGenerator.test.ts tests/unit/job/coverLetterGenerator.test.ts
cp src/tests/services/interviewPrep.test.ts tests/unit/interview/interviewPrep.test.ts
cp src/tests/services/resumeParser.test.ts tests/unit/resume/resumeParser.test.ts
cp src/tests/services/retirement.test.ts tests/unit/retirement/retirement.test.ts
cp src/tests/components/interview/InterviewPrepGenerator.test.tsx tests/unit/interview/InterviewGenerator.test.tsx
cp src/tests/components/retirement/IncentiveCalculator.test.tsx tests/unit/retirement/IncentiveCalculator.test.tsx
cp src/tests/api/retirement.test.ts tests/unit/retirement/retirementApi.test.ts
cp src/tests/integration/retirementFlow.test.tsx tests/integration/retirement/retirementFlow.test.tsx

# Move action files
cp src/actions/resume.ts src/features/resume/actions.ts
cp src/actions/interview.ts src/features/interview/actions.ts
```

#### Phase 2: Move Service Files

```bash
# Move service files
cp src/services/jobSearch.ts src/features/job/jobSearchService.ts
cp src/services/jobTracking.ts src/features/job/jobTrackingService.ts
cp src/services/coverLetterGenerator.ts src/features/job/coverLetterService.ts
cp src/services/resumeGenerator.ts src/features/resume/resumeGeneratorService.ts
cp src/services/resumeParser.ts src/features/resume/resumeParserService.ts
cp src/services/interviewPrep.ts src/features/interview/interviewService.ts
cp src/services/resourcesAndEvents.ts src/features/resources/resourcesService.ts
cp src/services/retirement.ts src/features/retirement/retirementService.ts
cp src/api/retirement.ts src/features/retirement/retirementApi.ts
```

#### Phase 3: Move AI Files

```bash
# Move AI files
cp src/ai/resumePrompts.ts src/features/resume/resumePrompts.ts
cp src/ai/resumeReviewSystem.ts src/features/resume/resumeReviewSystem.ts
cp src/ai/resumeVersionControl.ts src/features/resume/resumeVersionControl.ts
cp src/ai/atsSystemsAndNotifications.ts src/features/resume/atsSystem.ts
cp src/ai/resumeManager.ts src/features/resume/resumeAiManager.ts
cp src/ai/networkingPrompts.ts src/features/networking/networkingPrompts.ts
cp src/ai/networkingSystem.ts src/features/networking/networkingSystem.ts
cp src/ai/interviewPrompts.ts src/features/interview/interviewPrompts.ts
cp src/ai/index.ts src/ai/index.ts  # Will update later
```

#### Phase 4: Move Component Files

```bash
# Move UI components
cp src/components/ui/theme.ts src/styles/theme.ts
cp src/components/ui/Header.tsx src/components/layout/Header.tsx
cp src/components/ui/Layout.tsx src/components/layout/Layout.tsx
cp src/components/ui/Sidebar.tsx src/components/layout/Sidebar.tsx
cp src/components/ui/Dashboard.tsx src/components/dashboard/Dashboard.tsx
cp src/components/ui/networking/NetworkingManager.tsx src/components/networking/NetworkingManager.tsx
cp src/components/ui/resume/ResumeManager.tsx src/components/resume/ResumeManager.tsx

# Move dashboard components
cp src/components/dashboard/DashboardContainer.tsx src/components/dashboard/DashboardContainer.tsx
cp src/components/dashboard/ResourcesAndEventsContainer.tsx src/components/dashboard/ResourcesEventsContainer.tsx

# Move job components
cp src/components/jobSearch/JobSearchBoard.tsx src/components/job/JobSearchBoard.tsx
cp src/components/jobSearch/JobCard.tsx src/components/job/JobCard.tsx
cp src/components/jobSearch/JobSearchFilters.tsx src/components/job/JobSearchFilters.tsx
cp src/components/jobTracking/JobTrackingCard.tsx src/components/job/JobTrackingCard.tsx
cp src/components/jobTracking/JobTrackingDashboard.tsx src/components/job/JobTrackingDashboard.tsx

# Move LinkedIn components
cp src/components/linkedin/LinkedInProfileEditor.tsx src/components/linkedin/ProfileEditor.tsx
cp src/components/linkedin/SectionSelector.tsx src/components/linkedin/SectionSelector.tsx
cp src/components/linkedin/ContentEditor.tsx src/components/linkedin/ContentEditor.tsx
cp src/components/linkedin/PromptWindow.tsx src/components/linkedin/PromptWindow.tsx
cp src/components/linkedin/JobTitleInput.tsx src/components/linkedin/JobTitleInput.tsx
cp src/components/linkedin/IndustryInput.tsx src/components/linkedin/IndustryInput.tsx
cp src/components/linkedin/UploadArea.tsx src/components/common/UploadArea.tsx

# Move interview components
cp src/components/interview/InterviewPrepDashboard.tsx src/components/interview/InterviewDashboard.tsx
cp src/components/interview/InterviewPrepViewer.tsx src/components/interview/InterviewViewer.tsx
cp src/components/interview/InterviewPrepGenerator.tsx src/components/interview/InterviewGenerator.tsx

# Move resource components
cp src/components/resources/FilterChips.tsx src/components/common/FilterChips.tsx
cp src/components/resources/ResourceLibrary.tsx src/components/resources/ResourceLibrary.tsx
cp src/components/events/UpcomingEvents.tsx src/components/resources/UpcomingEvents.tsx

# Move retirement components
cp src/components/retirement/RetirementDashboard.tsx src/components/retirement/RetirementDashboard.tsx
cp src/components/retirement/IncentiveCalculator.tsx src/components/retirement/IncentiveCalculator.tsx
cp src/components/retirement/OnboardingForm.tsx src/components/retirement/OnboardingForm.tsx

# Move App component
cp src/components/App.tsx src/App.tsx
```

#### Phase 5: Organize Scripts

```bash
# Organize scripts by purpose
cp scripts/run-migration.js scripts/database/
cp scripts/init-database.js scripts/database/
cp scripts/create-tables.sql scripts/database/
cp scripts/init-database-sql.js scripts/database/
cp scripts/verify-database.js scripts/database/
cp scripts/fix-migration.js scripts/database/

cp scripts/update-github.sh scripts/deployment/
cp scripts/update-ec2.sh scripts/deployment/
cp scripts/deploy-with-ssm.js scripts/deployment/

cp scripts/test-s3-access.js scripts/aws/
cp scripts/find-bucket-region.js scripts/aws/
cp scripts/list-s3-buckets.js scripts/aws/
cp scripts/test-aws-credentials.js scripts/aws/
cp scripts/migrate-s3-bucket.js scripts/aws/
cp scripts/test-file-upload.js scripts/aws/
cp scripts/test-resume-upload.js scripts/aws/

cp scripts/setup-cloudwatch-monitoring.js scripts/aws/
cp scripts/setup-backup-procedures.js scripts/aws/
cp scripts/run-backup.sh scripts/aws/
cp scripts/setup-ssm.js scripts/aws/

cp scripts/fix-wasp-project.js scripts/utils/
cp scripts/compare-env-files.js scripts/utils/
cp scripts/analyze-codebases.js scripts/utils/
cp scripts/sync-codebases.js scripts/utils/
cp scripts/install-ec2-dependencies.js scripts/utils/
cp scripts/update-ec2-env.js scripts/utils/
cp scripts/update-ec2-test-file-upload.js scripts/utils/
cp scripts/verify-aws-regions.js scripts/utils/
cp scripts/migrate-tests-to-vitest.js scripts/utils/
```

### 3. Update Imports and Merge Files

After moving files, you need to update imports in all files to reflect the new paths. This is a critical step that requires careful attention.

#### Merge Type Files

1. Merge job-related type files:

```typescript
// src/features/job/types.ts
// Merge content from:
// - src/types/jobTracking.ts
// - src/types/jobSearch.ts
// - src/types/coverLetter.ts

export interface Job {
  // ... merged from jobSearch.ts
}

export interface JobApplication {
  // ... merged from jobTracking.ts
}

export interface CoverLetter {
  // ... merged from coverLetter.ts
}

// ... other types
```

2. Update the AI index file to import from feature directories:

```typescript
// src/ai/index.ts
import { generateResume } from '../features/resume/resumeAiManager';
import { generateNetworkingStrategy } from '../features/networking/networkingSystem';
import { generateInterviewPrep } from '../features/interview/interviewPrompts';

// Export consolidated AI utilities
export {
  generateResume,
  generateNetworkingStrategy,
  generateInterviewPrep,
  // ... other exports
};
```

#### Update Import Paths

For each file in the new structure, update import paths to reflect the new locations. Here's an example for a component:

```typescript
// Before (src/components/job/JobSearchBoard.tsx)
import { JobCard } from '../jobSearch/JobCard';
import { JobSearchFilters } from '../jobSearch/JobSearchFilters';
import { searchJobs } from '../../services/jobSearch';
import { Job } from '../../types/jobSearch';

// After
import { JobCard } from './JobCard';
import { JobSearchFilters } from './JobSearchFilters';
import { searchJobs } from '../../features/job/jobSearchService';
import { Job } from '../../features/job/types';
```

### 4. Testing and Validation

After completing the reorganization:

1. Run the build process to check for any compilation errors:
   ```bash
   npm run build
   ```

2. Run tests to ensure everything still works:
   ```bash
   npm test
   ```

3. Start the application and manually test key features:
   ```bash
   npm start
   ```

4. Fix any issues that arise during testing.

### 5. Clean Up

Once everything is working correctly:

1. Remove empty directories:
   ```bash
   # Example - adjust as needed
   rm -rf src/components/ui
   rm -rf src/components/jobSearch
   rm -rf src/components/jobTracking
   rm -rf src/components/events
   rm -rf src/services
   rm -rf src/ai
   rm -rf src/tests
   ```

2. Update the README.md to reflect the new project structure.

3. Commit the changes with a descriptive message:
   ```bash
   git add .
   git commit -m "Reorganize project structure for better maintainability"
   ```

## Troubleshooting Common Issues

### Import Path Issues

If you encounter import path errors:

1. Check for absolute imports that might be using path aliases
2. Look for imports that use index files
3. Verify that all file extensions are correct (.ts vs .tsx)

### Test Failures

If tests fail after reorganization:

1. Check for hardcoded paths in test files
2. Verify that mock imports are correctly updated
3. Look for test setup files that might need path updates

### Build Errors

If the build process fails:

1. Check for circular dependencies that might have been introduced
2. Verify that all required files are included in the build
3. Look for case sensitivity issues in import paths

## Conclusion

This reorganization will significantly improve the maintainability and scalability of the MaxJobOffers project. The feature-centric approach makes it easier to understand the codebase and add new features in the future.
