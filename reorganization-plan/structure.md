# MaxJobOffers Project Reorganization Plan

## Current Issues
1. Too many nested subdirectories in components (e.g., components/ui/networking)
2. Fragmented types across multiple files
3. Scattered AI-related files
4. Many small service files that could be consolidated
5. Numerous test files spread across different directories

## Proposed Structure

```
maxjoboffers/
├── prisma/                  # Database schema and migrations (unchanged)
├── scripts/                 # Consolidated deployment and utility scripts
├── src/
│   ├── assets/              # Static assets, images, etc.
│   ├── components/          # Flattened component structure by feature
│   │   ├── common/          # Shared UI components (buttons, inputs, etc.)
│   │   ├── dashboard/       # Dashboard components
│   │   ├── job/             # Job search and tracking components
│   │   ├── resume/          # Resume components
│   │   ├── interview/       # Interview prep components
│   │   ├── linkedin/        # LinkedIn profile components
│   │   ├── networking/      # Networking components
│   │   ├── resources/       # Resource library components
│   │   ├── retirement/      # Retirement planning components
│   │   └── layout/          # Layout components (header, sidebar, etc.)
│   ├── features/            # Feature-specific logic and services
│   │   ├── auth/            # Authentication logic
│   │   ├── job/             # Job search and tracking logic
│   │   ├── resume/          # Resume generation and management
│   │   ├── interview/       # Interview preparation
│   │   ├── linkedin/        # LinkedIn profile optimization
│   │   ├── networking/      # Networking strategies
│   │   ├── resources/       # Resource library
│   │   ├── retirement/      # Retirement planning
│   │   └── payment/         # Payment processing
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── api/                 # API client and endpoints
│   ├── ai/                  # AI services and prompts (consolidated)
│   ├── types/               # Consolidated type definitions
│   ├── config/              # App configuration
│   ├── styles/              # Global styles
│   ├── App.tsx              # Main App component
│   └── index.tsx            # Entry point
└── tests/                   # Consolidated tests by feature
    ├── unit/                # Unit tests
    ├── integration/         # Integration tests
    └── e2e/                 # End-to-end tests
```

## Directories to Remove or Consolidate

1. **Remove/Consolidate**:
   - `src/components/ui` - Move to `src/components/common` and `src/components/layout`
   - `src/components/ui/networking` - Move to `src/components/networking`
   - `src/components/ui/resume` - Move to `src/components/resume`
   - `src/components/dashboard` - Flatten structure
   - `src/mocks` - Move mock data to respective feature directories or a dedicated `src/mocks` directory
   - `src/tests` - Move to top-level `tests` directory with better organization

2. **Consolidate Types**:
   - Merge fragmented type files (`src/types/jobTracking.ts`, `src/types/jobSearch.ts`, etc.) into feature-specific type files
   - Keep only shared/common types in `src/types`

3. **Consolidate AI Files**:
   - Merge related AI prompt files into feature-specific files
   - Move AI logic to respective feature directories

4. **Consolidate Services**:
   - Group related services into feature-specific service files
   - Move business logic from services to feature directories

## Migration Strategy

1. Create the new directory structure
2. Move files to their new locations, starting with the least dependent files
3. Update imports in all files to reflect new paths
4. Test the application to ensure everything works correctly
5. Remove empty directories

## Benefits of New Structure

1. **Feature-Centric Organization**: Code is organized by feature rather than technical role, making it easier to understand and maintain
2. **Reduced Nesting**: Flatter directory structure with fewer levels of nesting
3. **Improved Discoverability**: Easier to find related code since it's grouped by feature
4. **Better Scalability**: New features can be added without creating deep nesting
5. **Clearer Boundaries**: Clear separation between UI components and business logic
