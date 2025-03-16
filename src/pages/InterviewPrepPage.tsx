import React, { useState, useEffect } from 'react';
import { useQuery } from 'wasp/client/operations';
import { useAction } from 'wasp/client/operations';
import { Link, useParams, useLocation } from 'wasp/client/router';
import { getJobById } from 'wasp/queries/job';
import { getInterviews } from 'wasp/queries/interview';
import { createMockInterview } from 'wasp/actions/interview';

// Helper function to parse query parameters
const useQueryParams = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const InterviewPrepPage: React.FC = () => {
  const params = useParams();
  const queryParams = useQueryParams();
  const jobId = queryParams.get('jobId');
  
  const { data: job, isLoading: jobLoading } = useQuery(jobId ? getJobById : null, jobId ? { id: jobId } : null);
  const { data: interviews, isLoading: interviewsLoading, refetch: refetchInterviews } = useQuery(getInterviews);
  
  const [createInterviewAction, { isLoading: isCreating }] = useAction(createMockInterview);
  
  const [interviewType, setInterviewType] = useState('behavioral');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(10);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [customJobDescription, setCustomJobDescription] = useState('');
  const [showCustomJob, setShowCustomJob] = useState(!jobId);
  
  // Available focus areas for different interview types
  const focusAreaOptions = {
    behavioral: [
      'Leadership', 'Teamwork', 'Problem Solving', 'Communication', 
      'Adaptability', 'Time Management', 'Conflict Resolution'
    ],
    technical: [
      'Algorithms', 'Data Structures', 'System Design', 'Coding', 
      'Database', 'Frontend', 'Backend', 'DevOps'
    ],
    situational: [
      'Customer Service', 'Crisis Management', 'Decision Making', 
      'Prioritization', 'Ethics', 'Innovation', 'Strategic Thinking'
    ]
  };
  
  // Reset focus areas when interview type changes
  useEffect(() => {
    setFocusAreas([]);
  }, [interviewType]);
  
  const handleFocusAreaToggle = (area: string) => {
    if (focusAreas.includes(area)) {
      setFocusAreas(focusAreas.filter(a => a !== area));
    } else {
      setFocusAreas([...focusAreas, area]);
    }
  };
  
  const handleCreateInterview = async () => {
    try {
      const result = await createInterviewAction({
        jobId: jobId || undefined,
        customJobDescription: !jobId && showCustomJob ? customJobDescription : undefined,
        type: interviewType,
        difficulty,
        numQuestions,
        focusAreas: focusAreas.length > 0 ? focusAreas : undefined
      });
      
      refetchInterviews();
      
      // Redirect to the new interview
      window.location.href = `/interviews/${result.id}`;
    } catch (error) {
      console.error('Error creating interview:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Interview Preparation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Create New Interview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Create Mock Interview</h2>
            
            {jobId && job && (
              <div className="mb-6 p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">Preparing for Job:</h3>
                <p className="font-medium">{job.title} at {job.company}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Your mock interview will be tailored to this specific job description.
                </p>
                <button
                  onClick={() => setShowCustomJob(!showCustomJob)}
                  className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                >
                  {showCustomJob ? 'Use job description only' : 'Add custom details'}
                </button>
              </div>
            )}
            
            {(!jobId || showCustomJob) && (
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="customJobDescription">
                  {jobId ? 'Additional Job Details (Optional)' : 'Job Description*'}
                </label>
                <textarea
                  id="customJobDescription"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                  value={customJobDescription}
                  onChange={(e) => setCustomJobDescription(e.target.value)}
                  placeholder={jobId 
                    ? "Add any specific details you want to focus on in the interview..."
                    : "Paste the job description here or describe the role you're interviewing for..."}
                  required={!jobId}
                />
                {!jobId && (
                  <p className="text-sm text-gray-500 mt-1">
                    For best results, include the job title, company, and key responsibilities
                  </p>
                )}
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Interview Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`border rounded-md p-3 cursor-pointer ${
                    interviewType === 'behavioral' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={() => setInterviewType('behavioral')}
                >
                  <div className="font-medium">Behavioral</div>
                  <div className="text-sm text-gray-500">
                    Questions about past experiences and how you handled situations
                  </div>
                </div>
                <div
                  className={`border rounded-md p-3 cursor-pointer ${
                    interviewType === 'technical' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={() => setInterviewType('technical')}
                >
                  <div className="font-medium">Technical</div>
                  <div className="text-sm text-gray-500">
                    Questions testing technical knowledge and problem-solving
                  </div>
                </div>
                <div
                  className={`border rounded-md p-3 cursor-pointer ${
                    interviewType === 'situational' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={() => setInterviewType('situational')}
                >
                  <div className="font-medium">Situational</div>
                  <div className="text-sm text-gray-500">
                    Questions about how you would handle hypothetical situations
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Difficulty Level
              </label>
              <div className="flex space-x-4">
                <div
                  className={`border rounded-md px-4 py-2 cursor-pointer ${
                    difficulty === 'easy' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={() => setDifficulty('easy')}
                >
                  Easy
                </div>
                <div
                  className={`border rounded-md px-4 py-2 cursor-pointer ${
                    difficulty === 'medium' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={() => setDifficulty('medium')}
                >
                  Medium
                </div>
                <div
                  className={`border rounded-md px-4 py-2 cursor-pointer ${
                    difficulty === 'hard' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={() => setDifficulty('hard')}
                >
                  Hard
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="numQuestions">
                Number of Questions
              </label>
              <input
                id="numQuestions"
                type="number"
                className="w-full md:w-32 px-3 py-2 border border-gray-300 rounded-md"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                min="1"
                max="20"
              />
              <p className="text-sm text-gray-500 mt-1">
                We recommend 5-10 questions for a practice session
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Focus Areas (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {focusAreaOptions[interviewType as keyof typeof focusAreaOptions].map((area) => (
                  <div
                    key={area}
                    className={`border rounded-full px-3 py-1 cursor-pointer text-sm ${
                      focusAreas.includes(area) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'
                    }`}
                    onClick={() => handleFocusAreaToggle(area)}
                  >
                    {area}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Select areas you want to focus on in your interview
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleCreateInterview}
                disabled={isCreating || (!jobId && !customJobDescription)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isCreating ? 'Creating Interview...' : 'Start Mock Interview'}
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Interview Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Prepare Your Environment</h3>
                <p className="text-gray-700">
                  Find a quiet, well-lit space with a neutral background. Test your camera and microphone before the interview.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Research the Company</h3>
                <p className="text-gray-700">
                  Understand the company's mission, values, products, and recent news. This shows your interest and preparation.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Use the STAR Method</h3>
                <p className="text-gray-700">
                  For behavioral questions, structure your answers with Situation, Task, Action, and Result to provide complete, concise responses.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Practice Active Listening</h3>
                <p className="text-gray-700">
                  Pay close attention to questions, ask for clarification if needed, and respond directly to what was asked.
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/interview-resources"
                className="text-blue-600 hover:text-blue-800"
              >
                View More Interview Resources
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Column - Previous Interviews */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Interviews</h2>
            
            {interviewsLoading ? (
              <p className="text-gray-500">Loading your interviews...</p>
            ) : !interviews || interviews.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-2">No interviews yet</p>
                <p className="text-sm text-gray-500">
                  Create your first mock interview to start practicing
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {interviews.map((interview: any) => (
                  <div key={interview.id} className="border rounded-md p-3 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          <Link
                            to={`/interviews/${interview.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(interview.createdAt)}
                        </p>
                      </div>
                      {interview.overallScore !== null && (
                        <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                          interview.overallScore >= 8 ? 'bg-green-100 text-green-800' :
                          interview.overallScore >= 6 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Score: {interview.overallScore}/10
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {interview.questions?.length || 0} questions
                      </div>
                      <div>
                        {interview.status === 'completed' ? (
                          <Link
                            to={`/interviews/${interview.id}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            View Results
                          </Link>
                        ) : (
                          <Link
                            to={`/interviews/${interview.id}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Continue
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 text-center">
                  <Link
                    to="/interviews"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View All Interviews
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Interview Stats</h2>
            {interviewsLoading ? (
              <p className="text-gray-500">Loading stats...</p>
            ) : !interviews || interviews.length === 0 ? (
              <p className="text-gray-600">Complete interviews to see your stats</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Interviews</h3>
                  <p className="text-2xl font-bold">{interviews.length}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
                  <p className="text-2xl font-bold">
                    {interviews.some(i => i.overallScore !== null) 
                      ? (interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / 
                         interviews.filter(i => i.overallScore !== null).length).toFixed(1)
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Most Recent</h3>
                  <p className="text-md">
                    {interviews.length > 0 
                      ? formatDate(interviews[0].createdAt)
                      : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrepPage;
