/**
 * Resume Feature Module
 * 
 * This module exports all resume-related components, services, and types.
 */

// Export components
export { default as ResumeUpload } from './components/ResumeUpload';
export { default as ResumeManager } from './components/ResumeManager';

// Export pages
export { default as ResumeUploadPage } from './pages/ResumeUploadPage';
export { default as ResumeManagerPage } from './pages/ResumeManagerPage';

// Export actions
export * from './actions/resumeActions';

// Export services
export * from './services/resumeService';
export * from './services/mockResumeData';

// Export types
export * from './types';
