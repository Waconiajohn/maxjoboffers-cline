/**
 * Payment Service
 * 
 * This service provides functions for managing payments, subscriptions, and billing.
 */

import { 
  Subscription, 
  BillingTransaction, 
  PaymentMethod,
  CheckoutSessionRequest,
  SubscriptionUpdateRequest,
  SubscriptionCancellationRequest,
  SubscriptionReactivationRequest
} from '../types';
import { 
  PaymentPlanId, 
  SubscriptionStatus, 
  prettyPaymentPlanName, 
  isSubscriptionPlan, 
  isCreditsPlan, 
  getCreditsAmount 
} from '../../../payment/subscriptionUtils';

/**
 * Format currency for display
 * @param amount Number to format as currency
 * @param currency Currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100); // Assuming amount is in cents
};

/**
 * Format date for display
 * @param dateString Date string
 * @returns Formatted date
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Get subscription status display text
 * @param status Subscription status
 * @returns Formatted status text
 */
export const getSubscriptionStatusText = (status: SubscriptionStatus): string => {
  switch (status) {
    case SubscriptionStatus.Active:
      return 'Active';
    case SubscriptionStatus.PastDue:
      return 'Past Due';
    case SubscriptionStatus.CancelAtPeriodEnd:
      return 'Cancels at End of Period';
    case SubscriptionStatus.Deleted:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

/**
 * Get subscription status color
 * @param status Subscription status
 * @returns CSS color class
 */
export const getSubscriptionStatusColor = (status: SubscriptionStatus): string => {
  switch (status) {
    case SubscriptionStatus.Active:
      return 'bg-green-100 text-green-800';
    case SubscriptionStatus.PastDue:
      return 'bg-red-100 text-red-800';
    case SubscriptionStatus.CancelAtPeriodEnd:
      return 'bg-yellow-100 text-yellow-800';
    case SubscriptionStatus.Deleted:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get transaction status color
 * @param status Transaction status
 * @returns CSS color class
 */
export const getTransactionStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get payment method icon class based on brand
 * @param brand Payment method brand
 * @returns CSS class for the icon
 */
export const getPaymentMethodIconClass = (brand: string): string => {
  switch (brand.toLowerCase()) {
    case 'visa':
      return 'text-blue-600';
    case 'mastercard':
      return 'text-red-600';
    case 'amex':
      return 'text-blue-800';
    case 'discover':
      return 'text-orange-600';
    case 'jcb':
      return 'text-green-600';
    case 'diners':
      return 'text-blue-400';
    case 'unionpay':
      return 'text-red-800';
    default:
      return 'text-gray-600';
  }
};

/**
 * Calculate proration amount for subscription change
 * @param currentPlan Current plan ID
 * @param newPlan New plan ID
 * @param daysRemaining Days remaining in current billing period
 * @returns Proration amount in cents
 */
export const calculateProrationAmount = (
  currentPlan: PaymentPlanId,
  newPlan: PaymentPlanId,
  daysRemaining: number
): number => {
  // This is a simplified calculation and would need to be replaced
  // with actual logic based on your pricing model
  const planPrices: Record<PaymentPlanId, number> = {
    [PaymentPlanId.Basic]: 999, // $9.99
    [PaymentPlanId.Professional]: 1999, // $19.99
    [PaymentPlanId.Enterprise]: 4999, // $49.99
    [PaymentPlanId.Credits10]: 499, // $4.99
    [PaymentPlanId.Credits50]: 1999, // $19.99
    [PaymentPlanId.Credits100]: 3499, // $34.99
  };

  // If switching between subscription plans
  if (isSubscriptionPlan(currentPlan) && isSubscriptionPlan(newPlan)) {
    const currentPlanPrice = planPrices[currentPlan];
    const newPlanPrice = planPrices[newPlan];
    const daysInMonth = 30; // Simplified
    
    const currentPlanRefund = (currentPlanPrice * daysRemaining) / daysInMonth;
    const newPlanCharge = (newPlanPrice * daysRemaining) / daysInMonth;
    
    return Math.round(newPlanCharge - currentPlanRefund);
  }
  
  // If switching from subscription to credits or vice versa,
  // or between credit plans, no proration applies
  return 0;
};

/**
 * Format subscription details for display
 * @param subscription Subscription object
 * @returns Formatted subscription details
 */
export const formatSubscriptionDetails = (subscription: Subscription): string => {
  return `
    Plan: ${prettyPaymentPlanName(subscription.planId)}
    Status: ${getSubscriptionStatusText(subscription.status)}
    Current Period: ${formatDate(subscription.currentPeriodStart)} to ${formatDate(subscription.currentPeriodEnd)}
    ${subscription.cancelAtPeriodEnd ? 'Cancels at end of current period' : ''}
  `;
};
