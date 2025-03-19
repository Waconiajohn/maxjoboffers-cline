# Financial Feature

This feature module provides financial planning and career growth functionality for the MaxJobOffers application.

## Overview

The financial feature helps users make informed financial decisions by:

1. Generating comprehensive financial plans based on current and target salaries
2. Providing salary negotiation strategies with opening offers and walk-away points
3. Creating budget plans with expense breakdowns and recommendations
4. Mapping career growth plans with milestones and skill requirements

## Directory Structure

```
financial/
├── actions/         # Financial-related actions
├── components/      # UI components
├── pages/           # Page components
├── services/        # Business logic
├── types/           # TypeScript interfaces and types
├── index.ts         # Feature exports
└── README.md        # Documentation
```

## Components

- **FinancialPlanForm**: Component for generating and displaying financial plans
- **RetirementCalculator**: Component for retirement planning (to be implemented)
- **SalaryComparison**: Component for comparing salaries across industries and locations (to be implemented)

## Actions

- **generateFinancialPlan**: Action for generating comprehensive financial plans

## Usage

```tsx
// Import components
import { FinancialPlanForm } from 'src/features/financial';

// Import actions
import { generateFinancialPlan } from 'src/features/financial';

// Import types
import { FinancialPlanResult, GenerateFinancialPlanInput } from 'src/features/financial';

// Use in a component
const MyComponent = () => {
  return <FinancialPlanForm />;
};
```

## Future Enhancements

- Retirement planning calculator
- Investment portfolio recommendations
- Tax optimization strategies
- Debt repayment planning
- Financial goal tracking
