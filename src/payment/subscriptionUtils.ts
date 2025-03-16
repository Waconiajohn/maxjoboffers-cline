import { User } from 'wasp/entities';

export enum SubscriptionStatus {
  PastDue = 'past_due',
  CancelAtPeriodEnd = 'cancel_at_period_end',
  Active = 'active',
  Deleted = 'deleted'
}

export enum PaymentPlanId {
  Basic = 'basic',
  Professional = 'professional',
  Enterprise = 'enterprise',
  Credits10 = 'credits10',
  Credits50 = 'credits50',
  Credits100 = 'credits100',
}

export interface PaymentPlan {
  getPaymentProcessorPlanId: () => string;
  effect: PaymentPlanEffect;
}

export type PaymentPlanEffect = { kind: 'subscription' } | { kind: 'credits'; amount: number };

export const paymentPlans: Record<PaymentPlanId, PaymentPlan> = {
  [PaymentPlanId.Basic]: {
    getPaymentProcessorPlanId: () => process.env.PAYMENTS_BASIC_SUBSCRIPTION_PLAN_ID || '',
    effect: { kind: 'subscription' }
  },
  [PaymentPlanId.Professional]: {
    getPaymentProcessorPlanId: () => process.env.PAYMENTS_PROFESSIONAL_SUBSCRIPTION_PLAN_ID || '',
    effect: { kind: 'subscription' }
  },
  [PaymentPlanId.Enterprise]: {
    getPaymentProcessorPlanId: () => process.env.PAYMENTS_ENTERPRISE_SUBSCRIPTION_PLAN_ID || '',
    effect: { kind: 'subscription' }
  },
  [PaymentPlanId.Credits10]: {
    getPaymentProcessorPlanId: () => process.env.PAYMENTS_CREDITS_10_PLAN_ID || '',
    effect: { kind: 'credits', amount: 10 }
  },
  [PaymentPlanId.Credits50]: {
    getPaymentProcessorPlanId: () => process.env.PAYMENTS_CREDITS_50_PLAN_ID || '',
    effect: { kind: 'credits', amount: 50 }
  },
  [PaymentPlanId.Credits100]: {
    getPaymentProcessorPlanId: () => process.env.PAYMENTS_CREDITS_100_PLAN_ID || '',
    effect: { kind: 'credits', amount: 100 }
  }
};

export function prettyPaymentPlanName(planId: PaymentPlanId): string {
  const planToName: Record<PaymentPlanId, string> = {
    [PaymentPlanId.Basic]: 'Basic',
    [PaymentPlanId.Professional]: 'Professional',
    [PaymentPlanId.Enterprise]: 'Enterprise',
    [PaymentPlanId.Credits10]: '10 Credits',
    [PaymentPlanId.Credits50]: '50 Credits',
    [PaymentPlanId.Credits100]: '100 Credits'
  };
  return planToName[planId];
}

export function parsePaymentPlanId(planId: string): PaymentPlanId {
  if ((Object.values(PaymentPlanId) as string[]).includes(planId)) {
    return planId as PaymentPlanId;
  } else {
    throw new Error(`Invalid PaymentPlanId: ${planId}`);
  }
}

export function getSubscriptionPaymentPlanIds(): PaymentPlanId[] {
  return Object.values(PaymentPlanId).filter((planId) => 
    paymentPlans[planId as PaymentPlanId].effect.kind === 'subscription'
  ) as PaymentPlanId[];
}

export function hasActiveSubscription(user: User): boolean {
  return (
    !!user.subscriptionStatus &&
    user.subscriptionStatus === SubscriptionStatus.Active
  );
}

export function isSubscriptionPlan(planId: PaymentPlanId): boolean {
  return paymentPlans[planId].effect.kind === 'subscription';
}

export function isCreditsPlan(planId: PaymentPlanId): boolean {
  return paymentPlans[planId].effect.kind === 'credits';
}

export function getCreditsAmount(planId: PaymentPlanId): number {
  const effect = paymentPlans[planId].effect;
  if (effect.kind === 'credits') {
    return effect.amount;
  }
  return 0;
}
