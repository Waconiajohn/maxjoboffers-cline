import { createCheckoutSession as originalCreateCheckoutSession } from 'wasp/actions/payment';
import { updateSubscription as originalUpdateSubscription } from 'wasp/actions/payment';
import { cancelSubscription as originalCancelSubscription } from 'wasp/actions/payment';
import { reactivateSubscription as originalReactivateSubscription } from 'wasp/actions/payment';
import { updatePaymentMethod as originalUpdatePaymentMethod } from 'wasp/actions/payment';
import { deletePaymentMethod as originalDeletePaymentMethod } from 'wasp/actions/payment';
import { addCredits as originalAddCredits } from 'wasp/actions/payment';
import { useCredits as originalUseCredits } from 'wasp/actions/payment';

// Re-export the original payment actions
export const createCheckoutSession = originalCreateCheckoutSession;
export const updateSubscription = originalUpdateSubscription;
export const cancelSubscription = originalCancelSubscription;
export const reactivateSubscription = originalReactivateSubscription;
export const updatePaymentMethod = originalUpdatePaymentMethod;
export const deletePaymentMethod = originalDeletePaymentMethod;
export const addCredits = originalAddCredits;
export const useCredits = originalUseCredits;

// Export other payment-related actions as needed
