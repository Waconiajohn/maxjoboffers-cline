/**
 * LinkedIn Feature Module
 * 
 * This module exports all LinkedIn-related components, services, and types.
 * It includes functionality for LinkedIn profile optimization.
 */

// Export services
export { linkedInService } from './services/linkedInService';

// Export types
export * from './types';

// Export components
export { default as LinkedInProfileEditor } from './components/LinkedInProfileEditor';

// Export AI prompts
export { linkedInPrompts } from './ai/linkedInPrompts';
