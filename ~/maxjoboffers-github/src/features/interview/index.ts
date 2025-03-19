/**
 * Interview Feature Module
 * 
 * This module exports all interview-related components, services, types, and actions.
 */

// Export components
export { default as InterviewDashboard } from './components/InterviewDashboard';
export { default as InterviewViewer } from './components/InterviewViewer';
export { default as InterviewGenerator } from './components/InterviewGenerator';

// Export services
export { interviewPrepService } from './services/interviewPrep';

// Export types
export * from './types/interviewPrep';

// Export actions
export * from './actions';

// Export AI prompts
export * from './ai/interviewPrompts';
