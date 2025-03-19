import { v4 as uuidv4 } from 'uuid';
import {
  PaymentMethod,
  PaymentMethodType,
  Payment,
  PaymentStatus,
  Subscription,
  SubscriptionStatus,
  SubscriptionPlan,
  BillingInterval,
  Currency,
  Invoice,
  Plan,
  DiscountCode,
  DiscountType,
  Discount,
  Affiliate,
  AffiliateStatus,
  CommissionType,
  AffiliateTier,
  Referral,
  Commission,
  Payout,
  AffiliateCampaign,
  PaymentIntent,
  SetupIntent,
  StripeCustomer,
  StripeWebhookEvent
} from '../types';

// Mock Stripe API
const mockStripeAPI = {
  customers: {
    create: async (params: any) => ({
      id: `cus_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
      ...params
    }),
    update: async (customerId: string, params: any) => ({
      id: customerId,
      ...params
    }),
    retrieve: async (customerId: string) => ({
      id: customerId,
      name: 'Test Customer',
      email: 'test@example.com'
    })
  },
  paymentMethods: {
    create: async (params: any) => ({
      id: `pm_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
      type: params.type,
      card: params.card ? {
        brand: params.card.brand || 'visa',
        last4: params.card.last4 || '4242',
        exp_month: params.card.exp_month || 12,
        exp_year: params.card.exp_year || 2030
      } : undefined,
      bank_account: params.bank_account ? {
        bank_name: params.bank_account.bank_name || 'Test Bank',
        last4: params.bank_account.last4 || '6789'
      } : undefined
    }),
    attach: async (paymentMethodId: string, params: any) => ({
      id: paymentMethodId,
      customer: params.customer
    }),
    detach: async (paymentMethodId: string) => ({
      id: paymentMethodId,
      customer: null
    }),
    list: async (params: any) => ({
      data: []
    })
  },
  subscriptions: {
    create: async (params: any) => ({
      id: `sub_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
      customer: params.customer,
      status: 'active',
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      items: {
        data: [{
          id: `si_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
          price: params.items[0].price
        }]
      }
    }),
    update: async (subscriptionId: string, params: any) => ({
      id: subscriptionId,
      ...params
    }),
    cancel: async (subscriptionId: string, params: any) => ({
      id: subscriptionId,
      status: 'canceled',
      cancel_at_period_end: params.cancel_at_period_end
    })
  },
  invoices: {
    create: async (params: any) => ({
      id: `in_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
      customer: params.customer,
      subscription: params.subscription,
      status: 'draft',
      amount_due: params.amount_due || 1000,
      amount_paid: 0,
      amount_remaining: params.amount_due || 1000,
      currency: params.currency || 'usd',
      hosted_invoice_url: `https://example.com/invoice/${uuidv4()}`,
      invoice_pdf: `https://example.com/invoice/${uuidv4()}.pdf`
    }),
    pay: async (invoiceId: string) => ({
      id: invoiceId,
      status: 'paid',
      amount_paid: 1000,
      amount_remaining: 0
    })
  },
  paymentIntents: {
    create: async (params: any) => ({
      id: `pi_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
      amount: params.amount,
      currency: params.currency,
      customer: params.customer,
      payment_method: params.payment_method,
      status: 'requires_confirmation',
      client_secret: `${uuidv4()}_secret_${uuidv4()}`
    }),
    confirm: async (paymentIntentId: string, params: any) => ({
      id: paymentIntentId,
      status: 'succeeded',
      payment_method: params.payment_method
    })
  },
  setupIntents: {
    create: async (params: any) => ({
      id: `seti_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
      customer: params.customer,
      payment_method: params.payment_method,
      status: 'requires_confirmation',
      client_secret: `${uuidv4()}_secret_${uuidv4()}`
    }),
    confirm: async (setupIntentId: string, params: any) => ({
      id: setupIntentId,
      status: 'succeeded',
      payment_method: params.payment_method
    })
  },
  prices: {
    create: async (params: any) => ({
      id: `price_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
      product: params.product,
      unit_amount: params.unit_amount,
      currency: params.currency,
      recurring: params.recurring
    })
  },
  products: {
    create: async (params: any) => ({
      id: `prod_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
      name: params.name,
      description: params.description
    })
  },
  coupons: {
    create: async (params: any) => ({
      id: `coup_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
      percent_off: params.percent_off,
      amount_off: params.amount_off,
      currency: params.currency,
      duration: params.duration,
      duration_in_months: params.duration_in_months,
      max_redemptions: params.max_redemptions,
      times_redeemed: 0
    })
  },
  promotionCodes: {
    create: async (params: any) => ({
      id: `promo_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
      code: params.code,
      coupon: params.coupon
    }),
    list: async (params: any) => ({
      data: []
    })
  }
};

/**
 * Service for handling payment functionality
 */
class PaymentService {
  private paymentMethods: PaymentMethod[] = [];
  private payments: Payment[] = [];
  private subscriptions: Subscription[] = [];
  private invoices: Invoice[] = [];
  private plans: Plan[] = [];
  private discountCodes: DiscountCode[] = [];
  private discounts: Discount[] = [];
  private affiliates: Affiliate[] = [];
  private affiliateTiers: AffiliateTier[] = [];
  private referrals: Referral[] = [];
  private commissions: Commission[] = [];
  private payouts: Payout[] = [];
  private affiliateCampaigns: AffiliateCampaign[] = [];
  private paymentIntents: PaymentIntent[] = [];
  private setupIntents: SetupIntent[] = [];
  private stripeCustomers: StripeCustomer[] = [];
  private stripeWebhookEvents: StripeWebhookEvent[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize mock data for development and testing
   */
  private initializeMockData(): void {
    // Create mock plans
    this.plans = [
      {
        id: uuidv4(),
        name: 'Basic Plan',
        description: 'Basic features for job seekers',
        plan: SubscriptionPlan.Basic,
        amount: 9.99,
        currency: Currency.USD,
        interval: BillingInterval.Monthly,
        features: [
          'Resume Builder',
          'Job Search',
          'Application Tracking'
        ],
        isPopular: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Premium Plan',
        description: 'Advanced features for serious job seekers',
        plan: SubscriptionPlan.Premium,
        amount: 19.99,
        currency: Currency.USD,
        interval: BillingInterval.Monthly,
        features: [
          'Resume Builder',
          'Job Search',
          'Application Tracking',
          'AI Resume Review',
          'Interview Preparation',
          'LinkedIn Profile Optimization'
        ],
        isPopular: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Enterprise Plan',
        description: 'Complete solution for professionals',
        plan: SubscriptionPlan.Enterprise,
        amount: 39.99,
        currency: Currency.USD,
        interval: BillingInterval.Monthly,
        features: [
          'Resume Builder',
          'Job Search',
          'Application Tracking',
          'AI Resume Review',
          'Interview Preparation',
          'LinkedIn Profile Optimization',
          'Career Coaching',
          'Priority Support',
          'Retirement Planning'
        ],
        isPopular: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Create mock discount codes
    this.discountCodes = [
      {
        id: uuidv4(),
        code: 'WELCOME10',
        description: '10% off for new users',
        type: DiscountType.Percentage,
        amount: 10,
        usesCount: 0,
        isActive: true,
        isFirstTimeOnly: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        code: 'SUMMER2025',
        description: '20% off summer promotion',
        type: DiscountType.Percentage,
        amount: 20,
        maxUses: 1000,
        usesCount: 0,
        isActive: true,
        expiresAt: new Date(2025, 8, 31).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        code: 'PREMIUM5',
        description: '$5 off Premium plan',
        type: DiscountType.FixedAmount,
        amount: 5,
        currency: Currency.USD,
        applicablePlans: [SubscriptionPlan.Premium],
        usesCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Create mock affiliate tiers
    this.affiliateTiers = [
      {
        id: uuidv4(),
        name: 'Bronze',
        description: 'Entry-level affiliate tier',
        minimumReferrals: 0,
        commissionType: CommissionType.Percentage,
        commissionRate: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Silver',
        description: 'Mid-level affiliate tier',
        minimumReferrals: 10,
        commissionType: CommissionType.Percentage,
        commissionRate: 15,
        bonusAmount: 50,
        bonusCurrency: Currency.USD,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Gold',
        description: 'Top-level affiliate tier',
        minimumReferrals: 50,
        commissionType: CommissionType.Percentage,
        commissionRate: 20,
        bonusAmount: 200,
        bonusCurrency: Currency.USD,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Create mock affiliate campaigns
    this.affiliateCampaigns = [
      {
        id: uuidv4(),
        name: 'Summer Referral Program',
        description: 'Refer friends during summer for extra rewards',
        startDate: new Date(2025, 5, 1).toISOString(),
        endDate: new Date(2025, 8, 31).toISOString(),
        isActive: true,
        commissionType: CommissionType.Percentage,
        commissionRate: 25,
        targetUrl: 'https://maxjoboffers.com/summer-referral',
        trackingCode: 'SUMMER2025REF',
        marketingMaterials: [
          'https://maxjoboffers.com/assets/banners/summer-referral-1.jpg',
          'https://maxjoboffers.com/assets/banners/summer-referral-2.jpg'
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Content Creator Program',
        description: 'Special program for content creators and influencers',
        startDate: new Date(2025, 0, 1).toISOString(),
        isActive: true,
        commissionType: CommissionType.Percentage,
        commissionRate: 30,
        targetUrl: 'https://maxjoboffers.com/creator',
        trackingCode: 'CREATOR2025',
        marketingMaterials: [
          'https://maxjoboffers.com/assets/banners/creator-1.jpg',
          'https://maxjoboffers.com/assets/banners/creator-2.jpg'
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Get a Stripe customer for a user, creating one if it doesn't exist
   */
  async getOrCreateStripeCustomer(userId: string, email: string, name?: string): Promise<StripeCustomer> {
    const existingCustomer = this.stripeCustomers.find(c => c.userId === userId);
    if (existingCustomer) {
      return existingCustomer;
    }

    // Create a new Stripe customer
    const stripeCustomer = await mockStripeAPI.customers.create({
      email,
      name,
      metadata: {
        userId
      }
    });

    const newCustomer: StripeCustomer = {
      id: uuidv4(),
      userId,
      stripeCustomerId: stripeCustomer.id,
      email,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.stripeCustomers.push(newCustomer);
    return newCustomer;
  }

  /**
   * Get all payment methods for a user
   */
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return this.paymentMethods.filter(pm => pm.userId === userId);
  }

  /**
   * Get a payment method by ID
   */
  async getPaymentMethodById(id: string): Promise<PaymentMethod | null> {
    const paymentMethod = this.paymentMethods.find(pm => pm.id === id);
    return paymentMethod || null;
  }

  /**
   * Create a payment method
   */
  async createPaymentMethod(
    userId: string,
    type: PaymentMethodType,
    data: {
      cardBrand?: string;
      cardLast4?: string;
      cardExpMonth?: number;
      cardExpYear?: number;
      bankName?: string;
      bankLast4?: string;
      paypalEmail?: string;
    }
  ): Promise<PaymentMethod> {
    // Get or create Stripe customer
    const customer = await this.getOrCreateStripeCustomer(userId, 'user@example.com');

    // Create payment method in Stripe
    let stripePaymentMethod;
    if (type === PaymentMethodType.CreditCard) {
      stripePaymentMethod = await mockStripeAPI.paymentMethods.create({
        type: 'card',
        card: {
          brand: data.cardBrand,
          last4: data.cardLast4,
          exp_month: data.cardExpMonth,
          exp_year: data.cardExpYear
        }
      });
    } else if (type === PaymentMethodType.BankAccount) {
      stripePaymentMethod = await mockStripeAPI.paymentMethods.create({
        type: 'bank_account',
        bank_account: {
          bank_name: data.bankName,
          last4: data.bankLast4
        }
      });
    }

    // Attach payment method to customer
    if (stripePaymentMethod) {
      await mockStripeAPI.paymentMethods.attach(stripePaymentMethod.id, {
        customer: customer.stripeCustomerId
      });
    }

    // Create payment method in our database
    const now = new Date().toISOString();
    const isDefault = this.paymentMethods.filter(pm => pm.userId === userId).length === 0;

    const paymentMethod: PaymentMethod = {
      id: uuidv4(),
      userId,
      type,
      isDefault,
      createdAt: now,
      updatedAt: now,
      ...data
    };

    this.paymentMethods.push(paymentMethod);

    return paymentMethod;
  }

  /**
   * Update a payment method
   */
  async updatePaymentMethod(
    id: string,
    updates: Partial<Omit<PaymentMethod, 'id' | 'userId' | 'type' | 'createdAt'>>
  ): Promise<PaymentMethod | null> {
    const index = this.paymentMethods.findIndex(pm => pm.id === id);
    if (index === -1) return null;

    this.paymentMethods[index] = {
      ...this.paymentMethods[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.paymentMethods[index];
  }

  /**
   * Delete a payment method
   */
  async deletePaymentMethod(id: string): Promise<boolean> {
    const paymentMethod = this.paymentMethods.find(pm => pm.id === id);
    if (!paymentMethod) return false;

    // Delete from Stripe (mock)
    // In a real implementation, we would detach the payment method from the customer

    // Delete from our database
    this.paymentMethods = this.paymentMethods.filter(pm => pm.id !== id);

    // If this was the default payment method, set another one as default
    if (paymentMethod.isDefault) {
      const userPaymentMethods = this.paymentMethods.filter(pm => pm.userId === paymentMethod.userId);
      if (userPaymentMethods.length > 0) {
        userPaymentMethods[0].isDefault = true;
      }
    }

    return true;
  }

  /**
   * Set a payment method as default
   */
  async setDefaultPaymentMethod(id: string): Promise<PaymentMethod | null> {
    const paymentMethod = this.paymentMethods.find(pm => pm.id === id);
    if (!paymentMethod) return null;

    // Update all payment methods for this user
    this.paymentMethods.forEach(pm => {
      if (pm.userId === paymentMethod.userId) {
        pm.isDefault = pm.id === id;
        pm.updatedAt = new Date().toISOString();
      }
    });

    return paymentMethod;
  }

  /**
   * Get all payments for a user
   */
  async getPayments(userId: string): Promise<Payment[]> {
    return this.payments.filter(p => p.userId === userId);
  }

  /**
   * Get a payment by ID
   */
  async getPaymentById(id: string): Promise<Payment | null> {
    const payment = this.payments.find(p => p.id === id);
    return payment || null;
  }

  /**
   * Get a discount code by ID
   */
  async getDiscountCodeById(id: string): Promise<DiscountCode | null> {
    const discountCode = this.discountCodes.find(dc => dc.id === id);
    return discountCode || null;
  }

  /**
   * Get a discount code by code
   */
  async getDiscountCodeByCode(code: string): Promise<DiscountCode | null> {
    const discountCode = this.discountCodes.find(dc => dc.code === code);
    return discountCode || null;
  }

  /**
   * Get an affiliate by ID
   */
  async getAffiliateById(id: string): Promise<Affiliate | null> {
    const affiliate = this.affiliates.find(a => a.id === id);
    return affiliate || null;
  }

  /**
   * Get an affiliate by user ID
   */
  async getAffiliateByUserId(userId: string): Promise<Affiliate | null> {
    const affiliate = this.affiliates.find(a => a.userId === userId);
    return affiliate || null;
  }

  /**
   * Get a plan by ID
   */
  async getPlanById(id: string): Promise<Plan | null> {
    const plan = this.plans.find(p => p.id === id);
    return plan || null;
  }

  /**
   * Get all plans
   */
  async getPlans(): Promise<Plan[]> {
    return this.plans;
  }

  /**
   * Create a commission
   */
  async createCommission(
    affiliateId: string,
    paymentId?: string,
    subscriptionId?: string,
    amount?: number,
    currency?: Currency
  ): Promise<Commission> {
    const affiliate = await this.getAffiliateById(affiliateId);
    if (!affiliate) {
      throw new Error('Affiliate not found');
    }

    // Find the payment or subscription
    let payment: Payment | undefined;
    let subscription: Subscription | undefined;

    if (paymentId) {
      payment = this.payments.find(p => p.id === paymentId) as Payment;
      if (!payment) {
        throw new Error('Payment not found');
      }
    } else if (subscriptionId) {
      subscription = this.subscriptions.find(s => s.id === subscriptionId) as Subscription;
      if (!subscription) {
        throw new Error('Subscription not found');
      }
    }

    // Create commission
    const commission: Commission = {
      id: uuidv4(),
      affiliateId,
      referralId: '', // This would be set in a real implementation
      paymentId,
      subscriptionId,
      amount: amount || (payment ? payment.amount : subscription!.amount) * (affiliate.commissionRate / 100),
      currency: currency || (payment ? payment.currency : subscription!.currency),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.commissions.push(commission);

    // Update affiliate earnings
    affiliate.totalEarnings += commission.amount;
    affiliate.balanceDue += commission.amount;

    return commission;
  }

  /**
   * Create a payment
   */
  async createPayment(
    userId: string,
    amount: number,
    currency: Currency,
    paymentMethodId: string,
    description: string,
    metadata?: Record<string, string>,
    discountCodeId?: string,
    affiliateId?: string
  ): Promise<Payment> {
    const paymentMethod = await this.getPaymentMethodById(paymentMethodId);
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    // Get or create Stripe customer
    const customer = await this.getOrCreateStripeCustomer(userId, 'user@example.com');

    // Apply discount if provided
    let discountId: string | undefined;
    let discountedAmount = amount;
    if (discountCodeId) {
      const discountCode = await this.getDiscountCodeById(discountCodeId);
      if (discountCode && discountCode.isActive) {
        // Apply discount
        if (discountCode.type === DiscountType.Percentage) {
          discountedAmount = amount * (1 - discountCode.amount / 100);
        } else if (discountCode.type === DiscountType.FixedAmount) {
          discountedAmount = Math.max(0, amount - discountCode.amount);
        }

        // Create discount record
        const discount: Discount = {
          id: uuidv4(),
          userId,
          discountCodeId,
          type: discountCode.type,
          amount: discountCode.amount,
          currency: discountCode.currency,
          appliedTo: 'payment',
          createdAt: new Date().toISOString()
        };

        this.discounts.push(discount);
        discountId = discount.id;

        // Update discount code usage
        discountCode.usesCount += 1;
      }
    }

    // Calculate affiliate commission if provided
    let commissionAmount: number | undefined;
    if (affiliateId) {
      const affiliate = await this.getAffiliateById(affiliateId);
      if (affiliate && affiliate.status === AffiliateStatus.Active) {
        if (affiliate.commissionType === CommissionType.Percentage) {
          commissionAmount = discountedAmount * (affiliate.commissionRate / 100);
        } else if (affiliate.commissionType === CommissionType.FixedAmount) {
          commissionAmount = affiliate.commissionRate;
        }
      }
    }

    // Create payment intent in Stripe
    const paymentIntent = await mockStripeAPI.paymentIntents.create({
      amount: Math.round(discountedAmount * 100), // Stripe uses cents
      currency,
      customer: customer.stripeCustomerId,
      payment_method: paymentMethodId,
      description
    });

    // Confirm payment intent
    await mockStripeAPI.paymentIntents.confirm(paymentIntent.id, {
      payment_method: paymentMethodId
    });

    // Create payment in our database
    const now = new Date().toISOString();
    const payment: Payment = {
      id: uuidv4(),
      userId,
      amount: discountedAmount,
      currency,
      status: PaymentStatus.Succeeded,
      paymentMethodId,
      description,
      metadata,
      receiptUrl: `https://example.com/receipts/${uuidv4()}`,
      discountId,
      affiliateId,
      commissionAmount,
      createdAt: now,
      updatedAt: now
    };

    this.payments.push(payment);

    // Create commission if applicable
    if (affiliateId && commissionAmount) {
      await this.createCommission(affiliateId, payment.id, undefined, commissionAmount, currency);
    }

    return payment;
  }

  /**
   * Refund a payment
   */
  async refundPayment(id: string, amount?: number): Promise<Payment | null> {
    const paymentIndex = this.payments.findIndex(p => p.id === id);
    if (paymentIndex === -1) return null;

    const payment = this.payments[paymentIndex];
    const refundAmount = amount || payment.amount;

    // In a real implementation, we would call Stripe to process the refund

    // Update payment in our database
    this.payments[paymentIndex] = {
      ...payment,
      status: refundAmount >= payment.amount ? PaymentStatus.Refunded : PaymentStatus.Succeeded,
      refundedAmount: (payment.refundedAmount || 0) + refundAmount,
      updatedAt: new Date().toISOString()
    };

    // If there was a commission for this payment, mark it as rejected
    if (payment.affiliateId) {
      const commission = this.commissions.find(c => 
        c.affiliateId === payment.affiliateId && c.paymentId === payment.id
      );
      
      if (commission) {
        commission.status = 'rejected';
        commission.notes = `Refunded payment ${payment.id}`;
      }
    }

    return this.payments[paymentIndex];
  }

  /**
   * Get all subscriptions for a user
   */
  async getSubscriptions(userId: string): Promise<Subscription[]> {
    return this.subscriptions.filter(s => s.userId === userId);
  }

  /**
   * Get a subscription by ID
   */
  async getSubscriptionById(id: string): Promise<Subscription | null> {
    const subscription = this.subscriptions.find(s => s.id === id);
    return subscription || null;
  }

  /**
   * Create a subscription
   */
  async createSubscription(
    userId: string,
    planId: string,
    paymentMethodId: string,
    discountCodeId?: string,
    affiliateId?: string,
    metadata?: Record<string, string>
  ): Promise<Subscription> {
    const plan = await this.getPlanById(planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const paymentMethod = await this.getPaymentMethodById(paymentMethodId);
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    // Get or create Stripe customer
    const customer = await this.getOrCreateStripeCustomer(userId, 'user@example.com');

    // Apply discount if provided
    let discountId: string | undefined;
    let discountedAmount = plan.amount;
    if (discountCodeId) {
      const discountCode = await this.getDiscountCodeById(discountCodeId);
      if (discountCode && discountCode.isActive) {
        // Check if discount is applicable to this plan
        const isApplicable = !discountCode.applicablePlans || 
          discountCode.applicablePlans.includes(plan.plan);
        
        if (isApplicable) {
          // Apply discount
          if (discountCode.type === DiscountType.Percentage) {
            discountedAmount = plan.amount * (1 - discountCode.amount / 100);
          } else if (discountCode.type === Disc
