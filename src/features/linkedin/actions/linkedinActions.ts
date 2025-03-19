import { generateLinkedInPost as originalGenerateLinkedInPost, generateNetworkingStrategy as originalGenerateNetworkingStrategy } from 'wasp/actions/linkedinContent';

// Re-export the original LinkedIn actions
export const generateLinkedInPost = originalGenerateLinkedInPost;
export const generateNetworkingStrategy = originalGenerateNetworkingStrategy;

// Export other LinkedIn-related actions as needed
