# LinkedIn Feature

This feature module provides LinkedIn profile optimization functionality for the MaxJobOffers application.

## Overview

The LinkedIn feature helps users optimize their LinkedIn profiles to increase visibility and attract recruiters by:

1. Editing and optimizing LinkedIn profile sections
2. Generating keyword-rich content tailored to specific industries and job titles
3. Analyzing profile strength and providing improvement recommendations
4. Applying optimized templates for different roles and industries

## Directory Structure

```
linkedin/
├── components/           # UI components
│   └── LinkedInProfileEditor.tsx
├── services/             # Business logic
│   └── linkedInService.ts
├── types/                # TypeScript interfaces and types
│   └── index.ts
├── ai/                   # AI prompts and utilities
│   └── linkedInPrompts.ts
├── index.ts              # Feature exports
└── README.md             # Documentation
```

## Usage

### LinkedIn Profile Optimization

The LinkedIn profile optimization functionality allows users to:

- Create and edit LinkedIn profiles
- Optimize individual profile sections using AI
- Apply pre-built templates for specific roles and industries
- Analyze profile strength and get recommendations

```tsx
import { LinkedInProfileEditor, linkedInService } from 'src/features/linkedin';

// In your component
const MyComponent = () => {
  return <LinkedInProfileEditor />;
};

// Or use the service directly
const optimizeProfile = async () => {
  // Get user profile
  const profile = await linkedInService.getProfile('user-id');
  
  // Optimize a section
  const result = await linkedInService.optimizeSection(
    profile.id,
    sectionId,
    {
      jobTitle: 'Software Engineer',
      industry: 'Technology',
      sectionType: LinkedInSectionType.Summary,
      tone: OptimizationTone.Professional,
      length: OptimizationLength.Moderate,
      focus: [OptimizationFocus.Keywords, OptimizationFocus.Achievements]
    }
  );
  
  console.log(result);
};
```

## Types

The feature exports various TypeScript types for LinkedIn profile optimization:

- `LinkedInProfile`: Represents a LinkedIn profile
- `LinkedInSection`: Represents a section of a LinkedIn profile
- `LinkedInSectionType`: Enum for section types (headline, summary, experience, etc.)
- `LinkedInOptimizationParams`: Parameters for optimizing a section
- `OptimizationResult`: Result of an optimization operation
- `ProfileAnalysis`: Analysis of a LinkedIn profile
- `ProfileTemplate`: Template for a LinkedIn profile

## Services

### linkedInService

Provides methods for managing and optimizing LinkedIn profiles:

- `getProfile(userId)`: Get a user's LinkedIn profile
- `createProfile(userId, jobTitle, industry)`: Create a new LinkedIn profile
- `updateProfile(profileId, updates)`: Update a LinkedIn profile
- `addSection(profileId, type, title, content)`: Add a section to a profile
- `updateSection(profileId, sectionId, updates)`: Update a profile section
- `deleteSection(profileId, sectionId)`: Delete a profile section
- `optimizeSection(profileId, sectionId, params)`: Optimize a profile section
- `analyzeProfile(profileId)`: Analyze a LinkedIn profile
- `getTemplates(industry, jobTitle)`: Get LinkedIn profile templates
- `applyTemplate(profileId, templateId)`: Apply a template to a profile

## Components

- `LinkedInProfileEditor`: Main component for editing and optimizing LinkedIn profiles

## AI Integration

The LinkedIn feature uses AI to generate optimized content for LinkedIn profiles:

- Headline optimization
- Summary optimization
- Experience section optimization
- Skills optimization
- Profile analysis and recommendations

The AI prompts are defined in `linkedInPrompts.ts` and used by the `linkedInService` to generate content.
