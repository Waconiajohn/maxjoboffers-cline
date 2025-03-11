import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { getUser } from 'wasp/queries/user';
import { getRecentResumes } from 'wasp/queries/resume';
import { getRecentCoverLetters } from 'wasp/queries/coverLetter';
import { getRecentJobs } from 'wasp/queries/job';
import { getRecentInterviews } from 'wasp/queries/interview';
import { getRecentLinkedInContent } from 'wasp/queries/linkedinContent';

const DashboardPage: React.FC = () => {
  const { data: user, isLoading: userLoading } = useQuery(getUser);
  const { data: recentResumes } = useQuery(getRecentResumes, { limit: 3 });
  const { data: recentCoverLetters } = useQuery(getRecentCoverLetters, { limit: 3 });
  const { data: recentJobs } = useQuery(getRecentJobs, { limit: 5 });
  const { data: recentInterviews } = useQuery(getRecentInterviews, { limit: 3 });
  const { data: recentLinkedInContent } = useQuery(getRecentLinkedInContent, { limit: 3 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (userLoading) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {user?.username || 'there'}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your job search activities and progress.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/jobs/search"
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 flex flex-col items-center justify-center text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="font-medium">Find Jobs</span>
          </Link>
          <Link
            to="/resumes/new"
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 flex flex-col items-center justify-center text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium">Upload Resume</span>
          </Link>
          <Link
            to="/cover-letters/new"
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 flex flex-col items-center justify-center text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Create Cover Letter</span>
          </Link>
          <Link
            to="/interviews"
            className="bg-yellow-600 text-white p-4 rounded-lg hover:bg-yellow-700 flex flex-col items-center justify-center text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <span className="font-medium">Practice Interview</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-3xl font-bold text-blue-600 mb-1">{recentJobs?.filter(job => job.status === 'applied').length || 0}</div>
            <div className="text-sm text-gray-500">Jobs Applied</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-3xl font-bold text-green-600 mb-1">{recentJobs?.filter(job => job.status === 'interview').length || 0}</div>
            <div className="text-sm text-gray-500">Interviews Scheduled</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-3xl font-bold text-purple-600 mb-1">{recentResumes?.length || 0}</div>
            <div className="text-sm text-gray-500">Resumes Created</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{recentInterviews?.filter(interview => interview.status === 'completed').length || 0}</div>
            <div className="text-sm text-gray-500">Practice Interviews</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {/* Recent Jobs */}
            {recentJobs && recentJobs.length > 0 && recentJobs.map((job: any) => (
              <div key={job.id} className="p-4 hover:bg-gray-50">
                <Link to={`/jobs/${job.id}`} className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{job.title} at {job.company}</h3>
                      <span className="text-sm text-gray-500">{formatDate(job.updatedAt)}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {job.status === 'saved' && 'Job saved'}
                      {job.status === 'applied' && 'Application submitted'}
                      {job.status === 'interview' && 'Interview scheduled'}
                      {job.status === 'offer' && 'Offer received'}
                      {job.status === 'rejected' && 'Application not selected'}
                    </p>
                  </div>
                </Link>
              </div>
            ))}

            {/* Recent Resumes */}
            {recentResumes && recentResumes.length > 0 && recentResumes.map((resume: any) => (
              <div key={resume.id} className="p-4 hover:bg-gray-50">
                <Link to={`/resumes/${resume.id}`} className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{resume.title}</h3>
                      <span className="text-sm text-gray-500">{formatDate(resume.updatedAt)}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {resume.isAtsOptimized ? 'ATS-optimized resume' : 'Resume updated'}
                    </p>
                  </div>
                </Link>
              </div>
            ))}

            {/* Recent Cover Letters */}
            {recentCoverLetters && recentCoverLetters.length > 0 && recentCoverLetters.map((letter: any) => (
              <div key={letter.id} className="p-4 hover:bg-gray-50">
                <Link to={`/cover-letters/${letter.id}`} className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{letter.title}</h3>
                      <span className="text-sm text-gray-500">{formatDate(letter.updatedAt)}</span>
                    </div>
                    <p className="text-sm text-gray-500">Cover letter created</p>
                  </div>
                </Link>
              </div>
            ))}

            {/* Recent Interviews */}
            {recentInterviews && recentInterviews.length > 0 && recentInterviews.map((interview: any) => (
              <div key={interview.id} className="p-4 hover:bg-gray-50">
                <Link to={`/interviews/${interview.id}`} className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
                      </h3>
                      <span className="text-sm text-gray-500">{formatDate(interview.updatedAt)}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {interview.status === 'completed' ? 
                        `Completed with score: ${interview.overallScore}/10` : 
                        'Interview in progress'}
                    </p>
                  </div>
                </Link>
              </div>
            ))}

            {/* Recent LinkedIn Content */}
            {recentLinkedInContent && recentLinkedInContent.length > 0 && recentLinkedInContent.map((content: any) => (
              <div key={content.id} className="p-4 hover:bg-gray-50">
                <Link to={`/linkedin-content/${content.id}`} className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{content.title || 'LinkedIn Content'}</h3>
                      <span className="text-sm text-gray-500">{formatDate(content.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {content.type === 'post' ? 'LinkedIn post created' : 'Networking strategy created'}
                    </p>
                  </div>
                </Link>
              </div>
            ))}

            {/* No Activity */}
            {(!recentJobs || recentJobs.length === 0) && 
             (!recentResumes || recentResumes.length === 0) && 
             (!recentCoverLetters || recentCoverLetters.length === 0) && 
             (!recentInterviews || recentInterviews.length === 0) && 
             (!recentLinkedInContent || recentLinkedInContent.length === 0) && (
              <div className="p-8 text-center">
                <p className="text-gray-500">No recent activity. Start your job search journey!</p>
                <div className="mt-4">
                  <Link
                    to="/jobs/search"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Find Jobs
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Optimize Your Resume</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Tailor your resume to match job descriptions and increase your chances of getting interviews.
            </p>
            <Link
              to="/resumes"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Optimize Now →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Practice Interviews</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Prepare for your upcoming interviews with our AI-powered mock interview tool.
            </p>
            <Link
              to="/interviews"
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Start Practice →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Grow Your Network</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Create engaging LinkedIn content and develop networking strategies to expand your professional connections.
            </p>
            <Link
              to="/linkedin-content"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Create Content →
            </Link>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      {user && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-1">Your Subscription</h2>
              <p className="text-gray-600">
                {user.subscriptionPlanId ? (
                  <>
                    You're on the {user.subscriptionPlanId === 'basic' ? 'Basic' : 
                                   user.subscriptionPlanId === 'professional' ? 'Professional' : 
                                   user.subscriptionPlanId === 'enterprise' ? 'Enterprise' : 'Premium'} plan.
                    {user.credits > 0 && ` You have ${user.credits} credits remaining.`}
                  </>
                ) : (
                  'You don\'t have an active subscription. Upgrade to access premium features.'
                )}
              </p>
            </div>
            <Link
              to="/pricing"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {user.subscriptionPlanId ? 'Manage Subscription' : 'View Plans'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
