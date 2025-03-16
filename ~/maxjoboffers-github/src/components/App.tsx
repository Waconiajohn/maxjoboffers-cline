import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './ui/Layout';
import Dashboard from './ui/Dashboard';
import { DashboardContainer } from './dashboard/DashboardContainer';
import ResumeManager from './ui/resume/ResumeManager';
import NetworkingManager from './ui/networking/NetworkingManager';
import { JobTrackingDashboard } from './jobTracking/JobTrackingDashboard';
import { JobSearchBoard } from './jobSearch/JobSearchBoard';
import LinkedInProfileEditor from './linkedin/LinkedInProfileEditor';
import InterviewPrepDashboard from './interview/InterviewPrepDashboard';
import InterviewPrepGenerator from './interview/InterviewPrepGenerator';
import InterviewPrepViewer from './interview/InterviewPrepViewer';

/**
 * App Component
 * 
 * This is the main component of the application that handles routing and authentication.
 */
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatarUrl?: string;
    membershipTier?: string;
  } | null>(null);
  
  // Simulate authentication
  useEffect(() => {
    // In a real app, this would check for a valid token or session
    const checkAuth = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, always authenticate
      setIsAuthenticated(true);
      setUser({
        name: 'John Doe',
        email: 'john.doe@example.com',
        membershipTier: 'Premium'
      });
    };
    
    checkAuth();
  }, []);
  
  const handleLogout = () => {
    // In a real app, this would clear the token or session
    setIsAuthenticated(false);
    setUser(null);
  };
  
  // Protected route component
  const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
    return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
  };
  
  return (
    <Router>
      <Layout 
        user={user || undefined} 
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute 
                element={<DashboardContainer user={user || undefined} />} 
              />
            } 
          />
          <Route 
            path="/resume/*" 
            element={
              <ProtectedRoute 
                element={<ResumeManager userId={user?.email || 'guest'} />} 
              />
            } 
          />
          <Route 
            path="/networking/*" 
            element={
              <ProtectedRoute 
                element={<NetworkingManager userId={user?.email || 'guest'} />} 
              />
            } 
          />
          <Route 
            path="/jobs/tracking" 
            element={
              <ProtectedRoute 
                element={<JobTrackingDashboard />} 
              />
            } 
          />
          <Route 
            path="/jobs/search" 
            element={
              <ProtectedRoute 
                element={<JobSearchBoard />} 
              />
            } 
          />
          <Route 
            path="/networking/linkedin" 
            element={
              <ProtectedRoute 
                element={<LinkedInProfileEditor userId={user?.email || 'guest'} />} 
              />
            } 
          />
          <Route 
            path="/interview" 
            element={
              <ProtectedRoute 
                element={<InterviewPrepDashboard />} 
              />
            } 
          />
          <Route 
            path="/interview/create" 
            element={
              <ProtectedRoute 
                element={<InterviewPrepGenerator />} 
              />
            } 
          />
          <Route 
            path="/interview/view/:id" 
            element={
              <ProtectedRoute 
                element={<InterviewPrepViewer />} 
              />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/" /> : <div>Login Page</div>
            } 
          />
          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
