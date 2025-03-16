import { HttpError } from 'wasp/server';
import { type CreateCheckoutSession, type UpdateSubscription } from 'wasp/server/operations';
import { User } from 'wasp/entities';
import { parsePaymentPlanId, paymentPlans, isSubscriptionPlan, isCreditsPlan, getCreditsAmount } from '../payment/subscriptionUtils';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

type CreateCheckoutSessionInput = {
  planId: string;
  successUrl: string;
  cancelUrl: string;
};

export const createCheckoutSession: CreateCheckoutSession<CreateCheckoutSessionInput, { sessionUrl: string }> = async (
  { planId, successUrl, cancelUrl },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to create a checkout session');
  }

  try {
    // Parse and validate plan ID
    const paymentPlanId = parsePaymentPlanId(planId);
    const plan = paymentPlans[paymentPlanId];
    
    if (!plan) {
      throw new HttpError(400, 'Invalid payment plan');
    }

    // Get user
    const user = await context.entities.User.findUnique({
      where: { id: context.user.id }
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id
        }
      });
      
      stripeCustomerId = customer.id;
      
      // Update user with Stripe customer ID
      await context.entities.User.update({
        where: { id: user.id },
        data: { stripeCustomerId }
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.getPaymentProcessorPlanId(),
          quantity: 1
        }
      ],
      mode: isSubscriptionPlan(paymentPlanId) ? 'subscription' : 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.id,
        planId: paymentPlanId
      }
    });

    return { sessionUrl: session.url || '' };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw new HttpError(500, 'Failed to create checkout session: ' + error.message);
  }
};

type UpdateSubscriptionInput = {
  subscriptionId: string;
  action: 'cancel' | 'reactivate';
};

export const updateSubscription: UpdateSubscription<UpdateSubscriptionInput, User> = async (
  { subscriptionId, action },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to update subscription');
  }

  try {
    // Get user
    const user = await context.entities.User.findUnique({
      where: { id: context.user.id }
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    if (!user.stripeCustomerId) {
      throw new HttpError(400, 'User does not have a Stripe customer ID');
    }

    // Get subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Check if subscription belongs to user
    if (subscription.customer !== user.stripeCustomerId) {
      throw new HttpError(403, 'You do not have permission to update this subscription');
    }

    // Update subscription
    if (action === 'cancel') {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });

      // Update user subscription status
      await context.entities.User.update({
        where: { id: user.id },
        data: { subscriptionStatus: 'cancel_at_period_end' }
      });
    } else if (action === 'reactivate') {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      });

      // Update user subscription status
      await context.entities.User.update({
        where: { id: user.id },
        data: { subscriptionStatus: 'active' }
      });
    }

    // Get updated user
    const updatedUser = await context.entities.User.findUnique({
      where: { id: user.id }
    });

    if (!updatedUser) {
      throw new HttpError(404, 'User not found');
    }

    return updatedUser;
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    throw new HttpError(500, 'Failed to update subscription: ' + error.message);
  }
};

// Webhook handler for Stripe events
export const stripeWebhook = async (req: any, res: any, context: any) => {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new HttpError(500, 'Stripe webhook secret not configured');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Error verifying webhook signature:', error);
    throw new HttpError(400, 'Invalid webhook signature');
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, planId } = session.metadata;
        
        if (!userId || !planId) {
          console.error('Missing metadata in checkout session');
          break;
        }

        const paymentPlanId = parsePaymentPlanId(planId);
        const plan = paymentPlans[paymentPlanId];
        
        if (!plan) {
          console.error('Invalid payment plan in checkout session');
          break;
        }

        // Handle subscription or one-time payment
        if (isSubscriptionPlan(paymentPlanId)) {
          // Update user subscription status
          await context.entities.User.update({
            where: { id: userId },
            data: {
              subscriptionStatus: 'active',
              subscriptionPlanId: paymentPlanId
            }
          });
        } else if (isCreditsPlan(paymentPlanId)) {
          // Add credits to user
          const creditsAmount = getCreditsAmount(paymentPlanId);
          await context.entities.User.update({
            where: { id: userId },
            data: {
              credits: { increment: creditsAmount }
            }
          });
        }
        
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get user by Stripe customer ID
        const user = await context.entities.User.findFirst({
          where: { stripeCustomerId: customerId }
        });
        
        if (!user) {
          console.error('User not found for Stripe customer ID:', customerId);
          break;
        }
        
        // Update user subscription status
        let subscriptionStatus;
        if (subscription.cancel_at_period_end) {
          subscriptionStatus = 'cancel_at_period_end';
        } else if (subscription.status === 'active') {
          subscriptionStatus = 'active';
        } else if (subscription.status === 'past_due') {
          subscriptionStatus = 'past_due';
        } else {
          subscriptionStatus = subscription.status;
        }
        
        await context.entities.User.update({
          where: { id: user.id },
          data: { subscriptionStatus }
        });
        
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get user by Stripe customer ID
        const user = await context.entities.User.findFirst({
          where: { stripeCustomerId: customerId }
        });
        
        if (!user) {
          console.error('User not found for Stripe customer ID:', customerId);
          break;
        }
        
        // Update user subscription status
        await context.entities.User.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: 'deleted',
            subscriptionPlanId: null
          }
        });
        
        break;
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error processing webhook event:', error);
    throw new HttpError(500, 'Failed to process webhook event: ' + error.message);
  }
};
