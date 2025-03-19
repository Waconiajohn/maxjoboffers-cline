/**
 * Payment Feature Types
 */

import { PaymentPlanId, SubscriptionStatus } from '../../../payment/subscriptionUtils';

export interface Subscription {
  id: string;
  userId: string;
  planId: PaymentPlanId;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingTransaction {
  id: string;
  userId: string;
  planId?: PaymentPlanId;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  description: string;
  date: string;
  invoiceUrl?: string;
  paymentMethod?: PaymentMethod;
  metadata?: Record<string, any>;
}

export interface PaymentMethod {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'diners' | 'unionpay' | 'unknown';
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface CheckoutSessionRequest {
  planId: PaymentPlanId;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

export interface SubscriptionUpdateRequest {
  subscriptionId: string;
  planId?: PaymentPlanId;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionCancellationRequest {
  subscriptionId: string;
  reason?: string;
  feedback?: string;
}

export interface SubscriptionReactivationRequest {
  subscriptionId: string;
}

export interface PaymentMethodUpdateRequest {
  paymentMethodId: string;
  isDefault?: boolean;
}

export interface PaymentMethodDeleteRequest {
  paymentMethodId: string;
}

export interface CreditsAddRequest {
  amount: number;
  reason?: string;
}

export interface CreditsUseRequest {
  amount: number;
  feature: 'job' | 'interview' | 'linkedin' | 'financial';
  resourceId?: string;
}
