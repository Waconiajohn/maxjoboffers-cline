/**
 * Interview Service
 * 
 * This service provides functions for managing interviews.
 */

import { Interview, InterviewQuestion, InterviewFeedback } from '../types';

/**
 * Format interview details for display
 * @param interview Interview object
 * @returns Formatted interview information
 */
export const formatInterviewDetails = (interview: Interview): string => {
  return `
    ${interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
    Difficulty: ${interview.difficulty.charAt(0).toUpperCase() + interview.difficulty.slice(1)}
    Questions: ${interview.numQuestions}
    ${interview.focusAreas && interview.focusAreas.length > 0 ? `Focus Areas: ${interview.focusAreas.join(', ')}` : ''}
    Status: ${formatInterviewStatus(interview.status)}
    ${interview.overallScore !== undefined ? `Score: ${interview.overallScore}/10` : ''}
  `;
};

/**
 * Format interview status
 * @param status Interview status
 * @returns Formatted status text
 */
export const formatInterviewStatus = (status: Interview['status']): string => {
  switch (status) {
    case 'created':
      return 'Created';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return 'Unknown';
  }
};

/**
 * Get interview status color
 * @param status Interview status
 * @returns CSS color class
 */
export const getInterviewStatusColor = (status: Interview['status']): string => {
  switch (status) {
    case 'created':
      return 'text-blue-600';
    case 'in_progress':
      return 'text-yellow-600';
    case 'completed':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

/**
 * Get interview score color
 * @param score Interview score
 * @returns CSS color class
 */
export const getInterviewScoreColor = (score: number): string => {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Format date for display
 * @param dateString Date string
 * @returns Formatted date
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
