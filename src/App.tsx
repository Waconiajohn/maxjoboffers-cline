import React from 'react';
import { Router, Route, Switch, Link } from 'wasp/client/router';
import { useAuth } from 'wasp/auth';

// Layout
import { MainLayout } from './features/common';

// Feature Pages
import { DashboardPage, ResourcesPage } from './features/dashboard';
import { JobSearchPage, JobDetailPage, CoverLetterListPage } from './features/job';
import { ResumeUploadPage, ResumeListPage, ResumeDetailPage } from './features/resume';
import { InterviewPrepPage, InterviewSessionPage } from './features/interview';
import { LinkedInContentPage, LinkedInPostPage, NetworkingStrategyPage } from './features/linkedin';
import { FinancialPlanPage, RetirementCalculatorPage } from './features/financial';
import { SubscriptionPlansPage, BillingHistoryPage } from './features/payment';
import { LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage, EmailVerificationPage, UserProfilePage } from './features/auth';
import { LandingPage } from './features/common';

// Error pages
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 text-center">
      <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
      <h2 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h2>
      <p className="mt-2 text-sm text-gray-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
          Return to Home
        </Link>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const { data: user, isLoading: authLoading } = useAuth();
  
  return (
    <Router>
      <MainLayout>
        <Switch>
          {/* Public Routes */}
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/signup" component={SignupPage} />
          <Route exact path="/forgot-password" component={ForgotPasswordPage} />
          <Route exact path="/reset-password/:token" component={ResetPasswordPage} />
          <Route exact path="/email-verification" component={EmailVerificationPage} />
          
          {/* Protected Routes - These are also protected by Wasp's authRequired in main.wasp */}
          <Route exact path="/dashboard" component={DashboardPage} />
          <Route exact path="/resources" component={ResourcesPage} />
          
          <Route exact path="/jobs/search" component={JobSearchPage} />
          <Route exact path="/jobs/:id" component={JobDetailPage} />
          
          <Route exact path="/resumes/new" component={ResumeUploadPage} />
          <Route exact path="/resumes" component={ResumeListPage} />
          <Route exact path="/resumes/:id" component={ResumeDetailPage} />
          <Route exact path="/cover-letters" component={CoverLetterListPage} />
          
          <Route exact path="/interviews" component={InterviewPrepPage} />
          <Route exact path="/interviews/:id" component={InterviewSessionPage} />
          
          <Route exact path="/linkedin-content" component={LinkedInContentPage} />
          <Route exact path="/linkedin-content/:id" component={LinkedInPostPage} />
          <Route exact path="/networking-strategy/:id" component={NetworkingStrategyPage} />
          
          <Route exact path="/financial/plan" component={FinancialPlanPage} />
          <Route exact path="/financial/retirement" component={RetirementCalculatorPage} />
          
          <Route exact path="/payment/plans" component={SubscriptionPlansPage} />
          <Route exact path="/payment/billing" component={BillingHistoryPage} />
          
          <Route exact path="/profile" component={UserProfilePage} />
          
          {/* 404 Page */}
          <Route component={NotFoundPage} />
        </Switch>
      </MainLayout>
    </Router>
  );
};

export default App;
