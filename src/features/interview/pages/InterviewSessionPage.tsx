import React, { useState, useEffect } from 'react';
import { useQuery } from 'wasp/client/operations';
import { useAction } from 'wasp/client/operations';
import { Link, useParams } from 'wasp/client/router';
import { getInterviewById } from 'wasp/queries/interview';
import { submitInterviewAnswer, completeInterview } from 'wasp/actions/interview';

const InterviewSessionPage: React.FC = () => {
  const { id } = useParams();
  const { data: interview, isLoading, error } = useQuery(getInterviewById, { id });
  
  const [submitAnswerAction] = useAction(submitInterviewAnswer);
  const [completeInterviewAction] = useAction(completeInterview);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Set up timer when question changes
  useEffect(() => {
    if (interview && interview.questions && interview.questions[currentQuestionIndex] && !showFeedback) {
      // Default time per question based on difficulty
      const baseTime = interview.difficulty === 'easy' ? 120 : 
                       interview.difficulty === 'medium' ? 180 : 240;
      
      setTimeLeft(baseTime);
      
      const intervalId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimer(intervalId);
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [currentQuestionIndex, interview, showFeedback]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    
    setIsSubmitting(true);
    
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    try {
      const result = await submitAnswerAction({
        interviewId: id,
        questionIndex: currentQuestionIndex,
        answer
      });
      
      setShowFeedback(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting answer:', error);
      setIsSubmitting(false);
    }
  };
  
  const handleNextQuestion = () => {
    setAnswer('');
    setShowFeedback(false);
    
    if (interview && interview.questions && currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleCompleteInterview();
    }
  };
  
  const handleCompleteInterview = async () => {
    setIsCompleting(true);
    
    try {
      await completeInterviewAction({
        interviewId: id
      });
      
      // Redirect to results page
      window.location.href = `/interviews/${id}/results`;
    } catch (error) {
      console.error('Error completing interview:', error);
      setIsCompleting(false);
    }
  };
  
  const getCurrentQuestion = () => {
    if (!interview || !interview.questions || interview.questions.length === 0) {
      return null;
    }
    
    return interview.questions[currentQuestionIndex];
  };
  
  const getProgressPercentage = () => {
    if (!interview || !interview.questions || interview.questions.length === 0) {
      return 0;
    }
    
    return Math.round(((currentQuestionIndex + (showFeedback ? 1 : 0)) / interview.questions.length) * 100);
  };
  
  if (isLoading) return <div className="p-4">Loading interview...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!interview) return <div className="p-4">Interview not found</div>;
  
  const currentQuestion = getCurrentQuestion();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/interviews" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Interviews
        </Link>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-3">Difficulty: {interview.difficulty.charAt(0).toUpperCase() + interview.difficulty.slice(1)}</span>
          <span>Questions: {currentQuestionIndex + 1} of {interview.questions.length}</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Progress</span>
          <span>{getProgressPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>
      
      {currentQuestion && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Question {currentQuestionIndex + 1}</h2>
            {timeLeft !== null && !showFeedback && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                timeLeft > 60 ? 'bg-green-100 text-green-800' : 
                timeLeft > 30 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                Time: {formatTime(timeLeft)}
              </div>
            )}
          </div>
          
          <p className="text-gray-800 mb-6">{currentQuestion.text}</p>
          
          {!showFeedback ? (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="answer">
                  Your Answer
                </label>
                <textarea
                  id="answer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-40"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  disabled={isSubmitting}
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !answer.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Your Answer</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{answer}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Feedback</h3>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{currentQuestion.feedback || 'No feedback available yet.'}</p>
                </div>
              </div>
              
              {currentQuestion.score !== undefined && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Score</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    currentQuestion.score >= 8 ? 'bg-green-100 text-green-800' : 
                    currentQuestion.score >= 6 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentQuestion.score}/10
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Sample Answer</h3>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{currentQuestion.sampleAnswer || 'No sample answer available.'}</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  {currentQuestionIndex < interview.questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Interview Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Interview Tips</h2>
        
        {interview.type === 'behavioral' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-1">Use the STAR Method</h3>
              <p className="text-gray-700">
                Structure your answers with <strong>Situation, Task, Action, and Result</strong> to provide complete, concise responses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Be Specific</h3>
              <p className="text-gray-700">
                Use concrete examples from your experience rather than speaking in generalities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Quantify Results</h3>
              <p className="text-gray-700">
                When possible, include metrics and numbers to demonstrate your impact.
              </p>
            </div>
          </div>
        )}
        
        {interview.type === 'technical' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-1">Think Aloud</h3>
              <p className="text-gray-700">
                Explain your thought process as you work through problems to show your reasoning.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Consider Edge Cases</h3>
              <p className="text-gray-700">
                Address potential issues like empty inputs, boundary conditions, and error handling.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Optimize Your Solution</h3>
              <p className="text-gray-700">
                After finding a working solution, consider ways to improve its efficiency.
              </p>
            </div>
          </div>
        )}
        
        {interview.type === 'situational' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-1">Show Your Decision-Making</h3>
              <p className="text-gray-700">
                Explain the factors you consider when making decisions in challenging situations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Demonstrate Values</h3>
              <p className="text-gray-700">
                Highlight your professional values and ethics through your responses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Balance Confidence and Humility</h3>
              <p className="text-gray-700">
                Show confidence in your abilities while acknowledging areas for growth and learning.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Exit Interview Modal */}
      {isCompleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Completing Interview</h2>
            <p className="text-gray-700 mb-6">
              Please wait while we analyze your responses and generate your results...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSessionPage;
