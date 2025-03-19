import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { getBillingHistory } from 'wasp/queries/payment';
import { PaymentPlanId, prettyPaymentPlanName } from '../../../payment/subscriptionUtils';

const BillingHistory: React.FC = () => {
  const { data: billingHistory, isLoading, error } = useQuery(getBillingHistory);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Billing History</h1>
        <div className="text-center py-12">
          <p className="text-lg">Loading billing history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Billing History</h1>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>Error loading billing history: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!billingHistory || billingHistory.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Billing History</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No billing history found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Billing History</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billingHistory.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.planId && prettyPaymentPlanName(transaction.planId as PaymentPlanId)}
                    </div>
                    <div className="text-sm text-gray-500">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.invoiceUrl ? (
                      <a
                        href={transaction.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Invoice
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Payment Methods</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          {billingHistory[0]?.paymentMethod ? (
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {billingHistory[0].paymentMethod.brand === 'visa' && (
                  <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.5 3h-21C.7 3 0 3.7 0 4.5v15c0 .8.7 1.5 1.5 1.5h21c.8 0 1.5-.7 1.5-1.5v-15c0-.8-.7-1.5-1.5-1.5z" />
                    <path
                      fill="#fff"
                      d="M9.7 11.5l1.5-3.5h1.2l-2.4 5.5H8.8L7.2 8h1.2l1.3 3.5zm3.5 2l-.3-1.6c-.1-.3-.2-.6-.2-.8h-.1c-.1.3-.1.5-.2.8l-.3 1.6h1.1zm1.7-3.5l-1.3 5.5h-1.1l1.3-5.5h1.1zm3.9 3.9c0-.6-.4-1-.9-1-.5 0-.9.4-.9 1s.4 1 .9 1c.5 0 .9-.4.9-1zm1.1 0c0 1.1-.9 1.9-2 1.9s-2-.8-2-1.9.9-1.9 2-1.9 2 .8 2 1.9z"
                    />
                  </svg>
                )}
                {billingHistory[0].paymentMethod.brand === 'mastercard' && (
                  <svg className="h-8 w-8 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.5 3h-21C.7 3 0 3.7 0 4.5v15c0 .8.7 1.5 1.5 1.5h21c.8 0 1.5-.7 1.5-1.5v-15c0-.8-.7-1.5-1.5-1.5z" />
                    <path
                      fill="#fff"
                      d="M15 12c0-1.7-1.3-3-3-3s-3 1.3-3 3 1.3 3 3 3 3-1.3 3-3zm-3-4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"
                    />
                    <path
                      fill="#fff"
                      d="M9 12c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zm3 4c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z"
                    />
                  </svg>
                )}
                {billingHistory[0].paymentMethod.brand === 'amex' && (
                  <svg className="h-8 w-8 text-blue-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.5 3h-21C.7 3 0 3.7 0 4.5v15c0 .8.7 1.5 1.5 1.5h21c.8 0 1.5-.7 1.5-1.5v-15c0-.8-.7-1.5-1.5-1.5z" />
                    <path
                      fill="#fff"
                      d="M14.5 7l-1.7 4-1.7-4H9v5.5h1.2v-4l1.7 4h1.2l1.7-4v4H16V7h-1.5zm-7 0L5 12.5h1.2l.4-1h2.2l.4 1h1.2L8 7H7.5zm-.1 3.5l.8-2 .8 2H7.4z"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {billingHistory[0].paymentMethod.brand.toUpperCase()} •••• {billingHistory[0].paymentMethod.last4}
                </div>
                <div className="text-sm text-gray-500">
                  Expires {billingHistory[0].paymentMethod.expMonth}/{billingHistory[0].paymentMethod.expYear}
                </div>
              </div>
              <div className="ml-auto">
                <button className="text-blue-600 hover:text-blue-800 text-sm">Update</button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No payment methods found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100); // Assuming amount is in cents
};

const getStatusColor = (status: string): string => {
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

export default BillingHistory;
