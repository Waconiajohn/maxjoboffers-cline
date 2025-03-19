/**
 * LinkedIn Feature Types
 */

export interface LinkedInPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  hashtags: string[];
  tone: 'professional' | 'conversational' | 'inspirational' | 'educational' | 'thought-provoking';
  industry: string;
  targetAudience?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NetworkingStrategy {
  id: string;
  userId: string;
  industry: string;
  careerStage: string;
  goals: string[];
  currentNetworkSize: 'small' | 'medium' | 'large';
  targetRoles?: string[];
  targetCompanies?: string[];
  timeCommitment: 'low' | 'medium' | 'high';
  summary: string;
  connectionStrategies: ConnectionStrategy[];
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionStrategy {
  title: string;
  description: string;
  actionItems: string[];
  timeframe?: string;
}

export interface GeneratePostParams {
  topic: string;
  industry: string;
  tone: 'professional' | 'conversational' | 'inspirational' | 'educational' | 'thought-provoking';
  length: 'short' | 'medium' | 'long';
  includeHashtags: boolean;
  targetAudience?: string;
}

export interface GenerateNetworkingStrategyParams {
  industry: string;
  careerStage: string;
  goals: string[];
  currentNetworkSize: 'small' | 'medium' | 'large';
  targetRoles?: string[];
  targetCompanies?: string[];
  timeCommitment: 'low' | 'medium' | 'high';
}
