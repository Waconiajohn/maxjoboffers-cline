# Retirement Feature

This feature module provides retirement planning functionality for the MaxJobOffers application.

## Overview

The retirement feature helps users plan for their financial future by:

1. Creating and managing retirement profiles
2. Generating retirement projections based on current savings, contributions, and investment allocations
3. Calculating retirement readiness scores and providing personalized recommendations
4. Visualizing retirement scenarios and asset allocations
5. Managing retirement accounts and incentives

## Directory Structure

```
retirement/
├── components/           # UI components
│   └── RetirementDashboard.tsx
├── services/             # Business logic
│   └── retirementService.ts
├── types/                # TypeScript interfaces and types
│   └── index.ts
├── api/                  # API integration
│   └── retirementApi.ts  # (to be implemented)
├── index.ts              # Feature exports
└── README.md             # Documentation
```

## Usage

### Retirement Planning Dashboard

The retirement planning dashboard provides a comprehensive view of a user's retirement status:

```tsx
import { RetirementDashboard } from 'src/features/retirement';

// In your component
const MyComponent = () => {
  return <RetirementDashboard />;
};
```

### Retirement Service

The retirement service provides methods for managing retirement profiles and calculations:

```tsx
import { retirementService } from 'src/features/retirement';

// Get a user's retirement profile
const getProfile = async (userId) => {
  const profile = await retirementService.getProfile(userId);
  console.log(profile);
};

// Generate retirement projection
const generateProjection = async (profileId) => {
  const projection = await retirementService.generateProjection(profileId);
  console.log(projection);
};

// Calculate retirement readiness
const calculateReadiness = async (profileId) => {
  const readiness = await retirementService.calculateRetirementReadiness(profileId);
  console.log(readiness);
};

// Generate retirement recommendations
const generateRecommendations = async (profileId) => {
  const recommendations = await retirementService.generateRecommendations(profileId);
  console.log(recommendations);
};
```

## Types

The feature exports various TypeScript types for retirement planning:

- `RetirementProfile`: Represents a user's retirement profile
- `RetirementAccount`: Represents a retirement account (401(k), IRA, etc.)
- `InvestmentAllocation`: Represents an asset allocation
- `RetirementProjection`: Represents a retirement projection
- `RetirementReadiness`: Represents a retirement readiness assessment
- `RetirementRecommendation`: Represents a retirement recommendation
- `RetirementIncentive`: Represents a retirement incentive (employer match, etc.)
- `RetirementCalculatorParams`: Parameters for retirement calculations
- `RetirementCalculatorResult`: Results of retirement calculations

## Components

- `RetirementDashboard`: Main component for viewing retirement information
  - `RetirementSummaryCard`: Displays summary of retirement status
  - `RecommendationsCard`: Displays retirement recommendations
  - `ProjectionChart`: Displays retirement projection chart
  - `AssetAllocationCard`: Displays asset allocation

## Services

### retirementService

Provides methods for managing retirement profiles and calculations:

- `getProfile(userId)`: Get a user's retirement profile
- `createProfile(userId, onboardingData)`: Create a new retirement profile
- `updateProfile(profileId, updates)`: Update a retirement profile
- `addRetirementAccount(profileId, accountType, balance, annualContribution)`: Add a retirement account
- `updateRetirementAccount(profileId, accountId, updates)`: Update a retirement account
- `removeRetirementAccount(profileId, accountId)`: Remove a retirement account
- `updateInvestmentAllocations(profileId, allocations)`: Update investment allocations
- `generateProjection(profileId)`: Generate retirement projection
- `calculateRetirementReadiness(profileId)`: Calculate retirement readiness
- `generateRecommendations(profileId)`: Generate retirement recommendations
- `calculateRetirement(params)`: Calculate retirement using custom parameters
- `getIncentives()`: Get retirement incentives
- `getIncentiveById(id)`: Get a retirement incentive by ID
- `createIncentive(...)`: Create a retirement incentive
- `updateIncentive(id, updates)`: Update a retirement incentive
- `deleteIncentive(id)`: Delete a retirement incentive

## Future Enhancements

- Integration with financial data providers for real-time market data
- Tax optimization strategies
- Social Security benefit calculations
- Retirement withdrawal strategies
- Monte Carlo simulations for risk analysis
- Integration with financial advisors
