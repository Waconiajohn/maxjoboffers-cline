import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { useAction } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { getUser } from 'wasp/queries/user';
import { updateUserProfile, changePassword, cancelSubscription } from 'wasp/actions/user';

const UserProfilePage: React.FC = () => {
  const { data: user, isLoading, error, refetch } = useQuery(getUser);
  
  const [updateProfileAction] = useAction(updateUserProfile);
  const [changePasswordAction] = useAction(changePassword);
  const [cancelSubscriptionAction] = useAction(cancelSubscription);
  
  // Profile form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  
  // Subscription cancellation state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState(false);
  
  // Initialize form with user data when it loads
  React.useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email);
    }
  }, [user]);
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfileAction({
        username,
        email
      });
      
      setProfileUpdateSuccess(true);
      setIsEditingProfile(false);
      refetch();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setProfileUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      await changePasswordAction({
        currentPassword,
        newPassword
      });
      
      setPasswordUpdateSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setPasswordUpdateSuccess(false);
      }, 3000);
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password');
    }
  };
  
  const handleCancelSubscription = async () => {
    try {
      await cancelSubscriptionAction({
        reason: cancellationReason
      });
      
      setCancelSuccess(true);
      setShowCancelConfirm(false);
      refetch();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const getSubscriptionStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Active</span>;
      case 'canceled':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Canceled</span>;
      case 'past_due':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Past Due</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };
  
  const getPlanName = (planId: string) => {
    switch (planId) {
      case 'basic':
        return 'Basic Plan';
      case 'professional':
        return 'Professional Plan';
      case 'enterprise':
        return 'Enterprise Plan';
      default:
        return planId;
    }
  };

  if (isLoading) return <div className="p-4">Loading user profile...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!user) return <div className="p-4">User not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Navigation */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <nav className="space-y-1">
              <a href="#profile" className="block px-3 py-2 rounded-md bg-blue-50 text-blue-700 font-medium">
                Profile Information
              </a>
              <a href="#security" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">
                Security
              </a>
              <a href="#subscription" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">
                Subscription
              </a>
              <a href="#billing" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">
                Billing History
              </a>
              <a href="#preferences" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">
                Preferences
              </a>
              <a href="#privacy" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">
                Privacy
              </a>
            </nav>
            
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{user.username || 'User'}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Link
                to="/logout"
                className="w-full block text-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Column - Settings Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Information */}
          <div id="profile" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
            
            {profileUpdateSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                Profile updated successfully!
              </div>
            )}
            
            {isEditingProfile ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setUsername(user.username || '');
                      setEmail(user.email);
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Username</h3>
                    <p className="mt-1">{user.username || 'Not set'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                    <p className="mt-1">{formatDate(user.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Verified</h3>
                    <p className="mt-1">
                      {user.isEmailVerified ? (
                        <span className="text-green-600">Verified</span>
                      ) : (
                        <span className="text-red-600">Not verified</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
          
          {/* Security */}
          <div id="security" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Security</h2>
            
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            
            {passwordUpdateSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                Password updated successfully!
              </div>
            )}
            
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {passwordError}
              </div>
            )}
            
            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="currentPassword">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Update Password
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
              <p className="text-gray-700 mb-4">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Set Up Two-Factor Authentication
              </button>
            </div>
          </div>
          
          {/* Subscription */}
          <div id="subscription" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Subscription</h2>
            
            {cancelSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                Your subscription has been canceled. You will have access until the end of your current billing period.
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Current Plan</h3>
                {user.subscriptionStatus && getSubscriptionStatusBadge(user.subscriptionStatus)}
              </div>
              
              {user.subscriptionPlanId ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{getPlanName(user.subscriptionPlanId)}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {user.subscriptionStatus === 'active' ? 'Your plan renews automatically' : 'Your plan will not renew'}
                      </p>
                    </div>
                    <div>
                      {user.subscriptionStatus === 'active' && !showCancelConfirm && (
                        <button
                          onClick={() => setShowCancelConfirm(true)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Cancel Subscription
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {showCancelConfirm && (
                    <div className="mt-4 p-3 bg-red-50 rounded-md">
                      <p className="text-red-700 mb-2">
                        Are you sure you want to cancel your subscription? You will lose access at the end of your current billing period.
                      </p>
                      <div className="mb-3">
                        <label className="block text-gray-700 mb-2 text-sm" htmlFor="cancellationReason">
                          Please tell us why you're canceling (optional)
                        </label>
                        <textarea
                          id="cancellationReason"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={cancellationReason}
                          onChange={(e) => setCancellationReason(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleCancelSubscription}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                        >
                          Confirm Cancellation
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm(false)}
                          className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300"
                        >
                          Keep Subscription
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p>You don't have an active subscription.</p>
                  <Link
                    to="/pricing"
                    className="mt-2 inline-block text-blue-600 hover:text-blue-800"
                  >
                    View Subscription Plans
                  </Link>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Credits</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{user.credits} credits remaining</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Use credits for premium features like AI resume optimization
                    </p>
                  </div>
                  <Link
                    to="/credits"
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                  >
                    Buy Credits
                  </Link>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Upgrade Your Plan</h3>
              <p className="text-gray-700 mb-4">
                Get more features and benefits by upgrading to a higher tier plan.
              </p>
              <Link
                to="/pricing"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
              >
                View Plans
              </Link>
            </div>
          </div>
          
          {/* Billing History */}
          <div id="billing" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Billing History</h2>
            <p className="text-gray-700 mb-4">
              View your past invoices and payment history.
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Sample invoice data - would be replaced with real data */}
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">Mar 1, 2025</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">Professional Plan - Monthly</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">$29.99</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Paid
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        Download
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">Feb 1, 2025</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">Professional Plan - Monthly</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">$29.99</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Paid
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        Download
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Preferences */}
          <div id="preferences" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Preferences</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="notifyJobMatches"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="notifyJobMatches" className="ml-2 block text-gray-700">
                    Job matches and recommendations
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="notifyApplicationUpdates"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="notifyApplicationUpdates" className="ml-2 block text-gray-700">
                    Application status updates
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="notifyProductUpdates"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="notifyProductUpdates" className="ml-2 block text-gray-700">
                    Product updates and new features
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="notifyMarketing"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="notifyMarketing" className="ml-2 block text-gray-700">
                    Marketing and promotional emails
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Display Settings</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="theme">
                  Theme
                </label>
                <select
                  id="theme"
                  className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue="system"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="language">
                  Language
                </label>
                <select
                  id="language"
                  className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Privacy */}
          <div id="privacy" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Privacy</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Data Usage</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="allowDataAnalysis"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="allowDataAnalysis" className="ml-2 block text-gray-700">
                    Allow anonymous usage data collection to improve the service
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="allowPersonalization"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="allowPersonalization" className="ml-2 block text-gray-700">
                    Allow personalization based on my activity
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Download Your Data</h3>
                <p className="text-gray-700 mb-2">
                  You can request a copy of all the data we have stored about you.
                </p>
                <button className="text-blue-600 hover:text-blue-800">
                  Request Data Export
                </button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Delete Your Account</h3>
                <p className="text-gray-700 mb-2">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="text-red-600 hover:text-red-800">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
