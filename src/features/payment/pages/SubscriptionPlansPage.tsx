import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { getUserSubscription } from 'wasp/queries/user';
import SubscriptionPlans from '../components/SubscriptionPlans';

const SubscriptionPlansPage: React.FC = () => {
  const { data: subscription, isLoading, error } = useQuery(getUserSubscription);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>
        <div className="text-center py-12">
          <p className="text-lg">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>Error loading subscription information: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <SubscriptionPlans
      currentPlan={subscription?.planId}
      hasActiveSubscription={subscription?.isActive || false}
    />
  );
};

export default SubscriptionPlansPage;
