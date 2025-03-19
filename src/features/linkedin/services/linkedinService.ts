/**
 * LinkedIn Service
 * 
 * This service provides functions for managing LinkedIn content and networking strategies.
 */

import { LinkedInPost, NetworkingStrategy, ConnectionStrategy } from '../types';

/**
 * Format LinkedIn post for display
 * @param post LinkedIn post object
 * @returns Formatted post content
 */
export const formatLinkedInPost = (post: LinkedInPost): string => {
  return `
    ${post.title}
    
    ${post.content}
    
    ${post.hashtags.map(tag => `#${tag}`).join(' ')}
  `;
};

/**
 * Format networking strategy for display
 * @param strategy Networking strategy object
 * @returns Formatted strategy content
 */
export const formatNetworkingStrategy = (strategy: NetworkingStrategy): string => {
  return `
    Industry: ${strategy.industry}
    Career Stage: ${strategy.careerStage}
    Goals: ${strategy.goals.join(', ')}
    
    Summary:
    ${strategy.summary}
    
    Key Strategies:
    ${strategy.connectionStrategies.map(formatConnectionStrategy).join('\n\n')}
  `;
};

/**
 * Format connection strategy for display
 * @param strategy Connection strategy object
 * @returns Formatted connection strategy
 */
export const formatConnectionStrategy = (strategy: ConnectionStrategy): string => {
  return `
    ${strategy.title}
    ${strategy.description}
    
    Action Items:
    ${strategy.actionItems.map(item => `- ${item}`).join('\n')}
    ${strategy.timeframe ? `\nTimeframe: ${strategy.timeframe}` : ''}
  `;
};

/**
 * Generate hashtags for a LinkedIn post
 * @param topic Post topic
 * @param industry Post industry
 * @returns Array of relevant hashtags
 */
export const generateHashtags = (topic: string, industry: string): string[] => {
  const topicWords = topic.toLowerCase().split(' ');
  const industryWords = industry.toLowerCase().split(' ');
  
  const hashtags = [
    ...topicWords.filter(word => word.length > 3).map(word => word.replace(/[^a-z0-9]/g, '')),
    ...industryWords.filter(word => word.length > 3).map(word => word.replace(/[^a-z0-9]/g, ''))
  ];
  
  // Add some common professional hashtags
  hashtags.push('career', 'professional', 'networking');
  
  // Remove duplicates and limit to 10 hashtags
  return [...new Set(hashtags)].slice(0, 10);
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
