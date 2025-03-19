/**
 * Job Feature Module
 * 
 * This module exports all job-related components, services, and types.
 * It includes functionality for job search and job application tracking.
 */

// Export services
export { jobSearchService } from './services/jobSearchService';
export { jobTrackingService } from './services/jobTrackingService';

// Export types
export * from './types';

// Export components
export { default as JobSearchBoard } from './components/JobSearchBoard';
// These components would be exported once implemented
// export { default as JobSearchFilters } from './components/JobSearchFilters';
// export { default as JobCard } from './components/JobCard';
// export { default as JobTrackingDashboard } from './components/JobTrackingDashboard';
// export { default as JobTrackingCard } from './components/JobTrackingCard';
