import React, { useState } from 'react';
import { useAction } from 'wasp/client/operations';
import { createCheckoutSession } from 'wasp/actions/payment';
import { PaymentPlanId, prettyPaymentPlanName, isSubscriptionPlan, isCreditsPlan, getCreditsAmount } from '../../../payment/subscriptionUtils';

interface SubscriptionPlansProps {
  currentPlan?: PaymentPlanId;
  hasActiveSubscription: boolean;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ currentPlan, hasActiveSubscription }) => {
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlanId | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createCheckoutSessionAction] = useAction(createCheckoutSession);

  const handleSelectPlan = (planId: PaymentPlanId) => {
    setSelectedPlan(planId);
    setError(null);
  };

  const handleCheckout = async () => {
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { url } = await createCheckoutSessionAction({ planId: selectedPlan });
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session');
      setIsProcessing(false);
    }
  };

  const subscriptionPlans = [
    {
      id: PaymentPlanId.Basic,
      name: 'Basic',
      price: '$9.99',
      period: 'month',
      features: [
        '10 AI-generated job applications per month',
        '5 mock interviews per month',
        'Basic resume analysis',
        'Email support'
      ],
      isPopular: false
    },
    {
      id: PaymentPlanId.Professional,
      name: 'Professional',
      price: '$19.99',
      period: 'month',
      features: [
        'Unlimited AI-generated job applications',
        'Unlimited mock interviews',
        'Advanced resume analysis',
        'LinkedIn content generation',
        'Financial planning tools',
        'Priority email support'
      ],
      isPopular: true
    },
    {
      id: PaymentPlanId.Enterprise,
      name: 'Enterprise',
      price: '$49.99',
      period: 'month',
      features: [
        'All Professional features',
        'Custom career coaching',
        'Personalized job search strategy',
        'Interview preparation with industry experts',
        'Dedicated account manager',
        '24/7 priority support'
      ],
      isPopular: false
    }
  ];

  const creditPlans = [
    {
      id: PaymentPlanId.Credits10,
      name: '10 Credits',
      price: '$4.99',
      credits: 10,
      features: [
        'Generate 10 job applications',
        'Or conduct 5 mock interviews',
        'Or create 10 LinkedIn posts',
        'Credits never expire'
      ]
    },
    {
      id: PaymentPlanId.Credits50,
      name: '50 Credits',
      price: '$19.99',
      credits: 50,
      features: [
        'Generate 50 job applications',
        'Or conduct 25 mock interviews',
        'Or create 50 LinkedIn posts',
        'Credits never expire',
        '20% savings compared to 10-credit pack'
      ]
    },
    {
      id: PaymentPlanId.Credits100,
      name: '100 Credits',
      price: '$34.99',
      credits: 100,
      features: [
        'Generate 100 job applications',
        'Or conduct 50 mock interviews',
        'Or create 100 LinkedIn posts',
        'Credits never expire',
        '30% savings compared to 10-credit pack'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>

      {currentPlan && hasActiveSubscription && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800">
            You are currently on the <strong>{prettyPaymentPlanName(currentPlan)}</strong> plan.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Monthly Subscriptions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all ${
                selectedPlan === plan.id
                  ? 'border-blue-500 transform scale-105'
                  : 'border-transparent hover:border-gray-200'
              } ${plan.isPopular ? 'relative' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-2 px-4 rounded-md transition-colors ${
                    selectedPlan === plan.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Pay-As-You-Go Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creditPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all ${
                selectedPlan === plan.id
                  ? 'border-blue-500 transform scale-105'
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-2">one-time</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-2 px-4 rounded-md transition-colors ${
                    selectedPlan === plan.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCheckout}
          disabled={!selectedPlan || isProcessing}
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300 text-lg font-medium"
        >
          {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>All plans come with a 7-day money-back guarantee.</p>
        <p className="mt-2">
          Need help choosing? <a href="/contact" className="text-blue-600 hover:text-blue-800">Contact our support team</a>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
