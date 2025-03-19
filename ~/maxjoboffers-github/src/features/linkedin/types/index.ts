/**
 * LinkedIn Feature Types
 * 
 * This file contains all types related to LinkedIn profile optimization functionality.
 */

/**
 * LinkedIn profile section types
 */
export enum LinkedInSectionType {
  Headline = 'headline',
  Summary = 'summary',
  Experience = 'experience',
  Education = 'education',
  Skills = 'skills',
  Recommendations = 'recommendations',
  Accomplishments = 'accomplishments',
  Volunteer = 'volunteer',
  Certifications = 'certifications',
  Projects = 'projects',
  Custom = 'custom'
}

/**
 * LinkedIn profile section content
 */
export interface LinkedInSection {
  id: string;
  type: LinkedInSectionType;
  title: string;
  content: string;
  originalContent?: string;
  lastUpdated: string;
  isOptimized: boolean;
}

/**
 * LinkedIn profile
 */
export interface LinkedInProfile {
  id: string;
  userId: string;
  jobTitle: string;
  industry: string;
  headline: string;
  summary: string;
  sections: LinkedInSection[];
  createdAt: string;
  lastUpdated: string;
  isComplete: boolean;
}

/**
 * LinkedIn optimization parameters
 */
export interface LinkedInOptimizationParams {
  jobTitle: string;
  industry: string;
  sectionType: LinkedInSectionType;
  currentContent?: string;
  targetKeywords?: string[];
  tone?: OptimizationTone;
  length?: OptimizationLength;
  focus?: OptimizationFocus[];
}

/**
 * Tone options for content optimization
 */
export enum OptimizationTone {
  Professional = 'professional',
  Conversational = 'conversational',
  Enthusiastic = 'enthusiastic',
  Technical = 'technical',
  Leadership = 'leadership',
  Creative = 'creative'
}

/**
 * Length options for content optimization
 */
export enum OptimizationLength {
  Concise = 'concise',
  Moderate = 'moderate',
  Comprehensive = 'comprehensive'
}

/**
 * Focus areas for content optimization
 */
export enum OptimizationFocus {
  Keywords = 'keywords',
  Achievements = 'achievements',
  Skills = 'skills',
  Metrics = 'metrics',
  Leadership = 'leadership',
  Collaboration = 'collaboration',
  Innovation = 'innovation',
  ProblemSolving = 'problem-solving'
}

/**
 * LinkedIn optimization result
 */
export interface OptimizationResult {
  originalContent: string;
  optimizedContent: string;
  improvements: string[];
  keywordsAdded: string[];
  readabilityScore: number;
  seo: {
    score: number;
    suggestions: string[];
  };
}

/**
 * LinkedIn profile analysis
 */
export interface ProfileAnalysis {
  overallScore: number;
  sectionScores: {
    [key in LinkedInSectionType]?: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keywordAnalysis: {
    present: string[];
    missing: string[];
    recommended: string[];
  };
}

/**
 * LinkedIn profile template
 */
export interface ProfileTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  jobTitle: string;
  sections: {
    [key in LinkedInSectionType]?: string;
  };
  keywords: string[];
}
