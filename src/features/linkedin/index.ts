/**
 * LinkedIn Feature Module
 *
 * This module exports all LinkedIn-related components, services, and types.
 */

// Export components
export { default as LinkedInContent } from './components/LinkedInContent';
export { default as NetworkingManager } from './components/NetworkingManager';
export { default as LinkedInMessageManager } from './components/LinkedInMessageManager';
export { default as LinkedInProfileBuilder } from './components/LinkedInProfileBuilder';

// Export pages
export { default as LinkedInContentPage } from './pages/LinkedInContentPage';
export { default as NetworkingManagerPage } from './pages/NetworkingManagerPage';
export { default as LinkedInMessageManagerPage } from './pages/LinkedInMessageManagerPage';
export { default as LinkedInProfileBuilderPage } from './pages/LinkedInProfileBuilderPage';
export { default as LinkedInPostPage } from './pages/LinkedInPostPage';
export { default as NetworkingStrategyPage } from './pages/NetworkingStrategyPage';

// Export actions
export * from './actions/linkedinActions';
// Export linkedinContentActions with renamed exports to avoid conflicts
export {
  generateLinkedInPost as generateLinkedInPostContent,
  generateNetworkingStrategy as generateNetworkingStrategyContent
} from './actions/linkedinContentActions';

// Export services
export * from './services/linkedinService';
export * from './services/mockNetworkingData';
export * from './services/mockLinkedInProfileData';
export * from './services/linkedinContentQueries';

// Export types
export * from './types';
