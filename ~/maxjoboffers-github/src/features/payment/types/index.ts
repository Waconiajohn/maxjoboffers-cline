/**
 * Payment Feature Types
 * 
 * This file contains all types related to payment functionality.
 */

/**
 * Payment method type
 */
export enum PaymentMethodType {
  CreditCard = 'credit_card',
  BankAccount = 'bank_account',
  PayPal = 'paypal'
}

/**
 * Payment status
 */
export enum PaymentStatus {
  Pending = 'pending',
  Processing = 'processing',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Refunded = 'refunded',
  Canceled = 'canceled'
}

/**
 * Subscription status
 */
export enum SubscriptionStatus {
  Active = 'active',
  PastDue = 'past_due',
  Unpaid = 'unpaid',
  Canceled = 'canceled',
  Incomplete = 'incomplete',
  IncompleteExpired = 'incomplete_expired',
  Trialing = 'trialing'
}

/**
 * Subscription plan
 */
export enum SubscriptionPlan {
  Free = 'free',
  Basic = 'basic',
  Premium = 'premium',
  Enterprise = 'enterprise'
}

/**
 * Billing interval
 */
export enum BillingInterval {
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Annual = 'annual'
}

/**
 * Currency
 */
export enum Currency {
  USD = 'usd',
  EUR = 'eur',
  GBP = 'gbp',
  CAD = 'cad',
  AUD = 'aud',
  JPY = 'jpy'
}

/**
 * Discount type
 */
export enum DiscountType {
  Percentage = 'percentage',
  FixedAmount = 'fixed_amount'
}

/**
 * Affiliate status
 */
export enum AffiliateStatus {
  Pending = 'pending',
  Active = 'active',
  Suspended = 'suspended',
  Terminated = 'terminated'
}

/**
 * Commission type
 */
export enum CommissionType {
  Percentage = 'percentage',
  FixedAmount = 'fixed_amount',
  Tiered = 'tiered'
}

/**
 * Payment method
 */
export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  // Credit card specific fields
  cardBrand?: string;
  cardLast4?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  // Bank account specific fields
  bankName?: string;
  bankLast4?: string;
  // PayPal specific fields
  paypalEmail?: string;
}

/**
 * Payment
 */
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  paymentMethodId: string;
  description: string;
  metadata?: Record<string, string>;
  receiptUrl?: string;
  refundedAmount?: number;
  discountId?: string;
  affiliateId?: string;
  commissionAmount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Subscription
 */
export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  interval: BillingInterval;
  amount: number;
  currency: Currency;
  paymentMethodId: string;
  discountId?: string;
  affiliateId?: string;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Invoice
 */
export interface Invoice {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  currency: Currency;
  status: PaymentStatus;
  description: string;
  pdfUrl?: string;
  hostedInvoiceUrl?: string;
  paymentMethodId?: string;
  discountId?: string;
  discountAmount?: number;
  affiliateId?: string;
  commissionAmount?: number;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Plan
 */
export interface Plan {
  id: string;
  name: string;
  description: string;
  plan: SubscriptionPlan;
  amount: number;
  currency: Currency;
  interval: BillingInterval;
  features: string[];
  isPopular?: boolean;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Discount code
 */
export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  type: DiscountType;
  amount: number; // Percentage or fixed amount
  currency?: Currency; // Required for fixed amount
  maxUses?: number;
  usesCount: number;
  isActive: boolean;
  expiresAt?: string;
  applicablePlans?: SubscriptionPlan[];
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  isFirstTimeOnly?: boolean;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Discount
 */
export interface Discount {
  id: string;
  userId: string;
  discountCodeId: string;
  type: DiscountType;
  amount: number;
  currency?: Currency;
  appliedTo: 'payment' | 'subscription';
  paymentId?: string;
  subscriptionId?: string;
  createdAt: string;
}

/**
 * Affiliate
 */
export interface Affiliate {
  id: string;
  userId: string;
  status: AffiliateStatus;
  referralCode: string;
  commissionType: CommissionType;
  commissionRate: number; // Percentage or fixed amount
  commissionCurrency?: Currency; // Required for fixed amount
  minimumPayout: number;
  payoutMethod: 'bank_transfer' | 'paypal' | 'check';
  payoutDetails?: Record<string, string>;
  totalEarnings: number;
  totalPaid: number;
  balanceDue: number;
  taxInformation?: Record<string, string>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Affiliate tier
 */
export interface AffiliateTier {
  id: string;
  name: string;
  description: string;
  minimumReferrals: number;
  commissionType: CommissionType;
  commissionRate: number;
  commissionCurrency?: Currency;
  bonusAmount?: number;
  bonusCurrency?: Currency;
  createdAt: string;
  updatedAt: string;
}

/**
 * Referral
 */
export interface Referral {
  id: string;
  affiliateId: string;
  referredUserId: string;
  status: 'pending' | 'registered' | 'subscribed' | 'expired';
  referralUrl: string;
  referralSource?: string;
  referralMedium?: string;
  referralCampaign?: string;
  conversionDate?: string;
  conversionValue?: number;
  commissionAmount?: number;
  commissionStatus: 'pending' | 'approved' | 'paid' | 'rejected';
  commissionPaidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Commission
 */
export interface Commission {
  id: string;
  affiliateId: string;
  referralId: string;
  paymentId?: string;
  subscriptionId?: string;
  amount: number;
  currency: Currency;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payout
 */
export interface Payout {
  id: string;
  affiliateId: string;
  amount: number;
  currency: Currency;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payoutMethod: 'bank_transfer' | 'paypal' | 'check';
  payoutDetails: Record<string, string>;
  commissionIds: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Affiliate campaign
 */
export interface AffiliateCampaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  commissionType: CommissionType;
  commissionRate: number;
  commissionCurrency?: Currency;
  targetUrl: string;
  trackingCode: string;
  marketingMaterials: string[];
  eligibleAffiliates?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payment intent
 */
export interface PaymentIntent {
  id: string;
  userId: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  paymentMethodId?: string;
  description: string;
  metadata?: Record<string, string>;
  clientSecret: string;
  discountId?: string;
  affiliateId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Setup intent
 */
export interface SetupIntent {
  id: string;
  userId: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'canceled' | 'succeeded';
  paymentMethodId?: string;
  description: string;
  metadata?: Record<string, string>;
  clientSecret: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Stripe customer
 */
export interface StripeCustomer {
  id: string;
  userId: string;
  stripeCustomerId: string;
  email: string;
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Stripe webhook event
 */
export interface StripeWebhookEvent {
  id: string;
  stripeEventId: string;
  type: string;
  data: any;
  createdAt: string;
  processedAt?: string;
  error?: string;
}
