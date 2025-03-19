# Payment Feature

This feature module provides payment and subscription functionality for the MaxJobOffers application.

## Overview

The payment feature enables users to:

1. Subscribe to different pricing plans (Basic, Professional, Enterprise)
2. Purchase credit packs for pay-as-you-go usage
3. View and manage their subscription status
4. Access billing history and payment methods
5. Upgrade, downgrade, or cancel subscriptions

## Directory Structure

```
payment/
├── actions/         # Payment-related actions
├── components/      # UI components
├── pages/           # Page components
├── services/        # Business logic
├── types/           # TypeScript interfaces and types
├── index.ts         # Feature exports
└── README.md        # Documentation
```

## Components

- **SubscriptionPlans**: Component for displaying and selecting subscription plans
- **BillingHistory**: Component for viewing billing history and payment methods

## Pages

- **SubscriptionPlansPage**: Page component that renders the SubscriptionPlans component
- **BillingHistoryPage**: Page component that renders the BillingHistory component

## Services

The payment service provides utility functions for:

- Formatting currency and dates
- Getting subscription status text and colors
- Calculating proration amounts
- Formatting subscription details

## Usage

```tsx
// Import components
import { SubscriptionPlans, BillingHistory } from 'src/features/payment';

// Import pages
import { SubscriptionPlansPage, BillingHistoryPage } from 'src/features/payment';

// Import actions
import { 
  createCheckoutSession, 
  updateSubscription, 
  cancelSubscription 
} from 'src/features/payment';

// Import services
import { 
  formatCurrency, 
  getSubscriptionStatusText, 
  calculateProrationAmount 
} from 'src/features/payment';

// Import types
import { 
  Subscription, 
  BillingTransaction, 
  PaymentMethod 
} from 'src/features/payment';

// Import subscription utils
import {
  PaymentPlanId,
  SubscriptionStatus,
  hasActiveSubscription
} from 'src/features/payment';

// Use in a component
const MyComponent = () => {
  return <SubscriptionPlansPage />;
};
```

## Integration with Payment Providers

The payment feature is designed to work with Stripe as the payment processor. It handles:

- Creating checkout sessions for new subscriptions
- Processing subscription updates and cancellations
- Managing payment methods
- Tracking billing history

## Future Enhancements

- Custom enterprise pricing
- Team/organization billing
- Invoice generation and download
- Subscription usage analytics
- Promotional codes and discounts
- Referral program
