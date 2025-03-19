/**
 * Job Service
 * 
 * This service provides functions for managing jobs and job applications.
 */

import { Job, JobSearchParams, JobSearchResults, JobApplication } from '../types';

/**
 * Format job details for display
 * @param job Job object
 * @returns Formatted job information
 */
export const formatJobDetails = (job: Job): string => {
  return `
    ${job.title} at ${job.company}
    Location: ${job.location}
    ${job.salary ? `Salary: $${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}` : 'Salary: Not specified'}
    ${job.workType ? `Work Type: ${job.workType}` : ''}
    Posted: ${new Date(job.datePosted).toLocaleDateString()}
    
    Description:
    ${job.description}
    
    ${job.requirements ? `Requirements:\n${job.requirements}` : ''}
  `;
};

/**
 * Format job application status
 * @param status Job application status
 * @returns Formatted status text
 */
export const formatJobApplicationStatus = (status: JobApplication['status']): string => {
  switch (status) {
    case 'applied':
      return 'Applied';
    case 'interview':
      return 'Interview Scheduled';
    case 'offer':
      return 'Offer Received';
    case 'rejected':
      return 'Not Selected';
    default:
      return 'Unknown';
  }
};

/**
 * Get job application status color
 * @param status Job application status
 * @returns CSS color class
 */
export const getJobStatusColor = (status: JobApplication['status']): string => {
  switch (status) {
    case 'applied':
      return 'text-blue-600';
    case 'interview':
      return 'text-purple-600';
    case 'offer':
      return 'text-green-600';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};
