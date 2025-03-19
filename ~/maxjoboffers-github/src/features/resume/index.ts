/**
 * Resume Feature Module
 * 
 * This module exports all resume-related components, services, and types.
 */

// Export types
export * from './types';

// Export services
export { resumeService } from './services/resumeService';

// Export components
export { default as ResumeManager } from './components/ResumeManager';

// Export AI prompts
export {
  generateResumeAnalysisPrompt,
  generateResumeSummaryRewritePrompt,
  generateResumeExperienceBulletRewritePrompt,
  generateResumeSkillsRewritePrompt,
  generateATSOptimizationPrompt,
  generateJobTailoringPrompt,
  getSectionRewritePrompt,
  generateResumeImprovementSuggestionsPrompt,
  generateResumeComparisonPrompt,
  generateResumeGenerationPrompt,
  ResumeAnalysisPromptParams,
  ResumeSummaryRewritePromptParams,
  ResumeExperienceBulletRewritePromptParams,
  ResumeSkillsRewritePromptParams,
  ATSOptimizationPromptParams,
  JobTailoringPromptParams,
  SectionRewritePromptParams,
  ResumeImprovementSuggestionsPromptParams,
  ResumeComparisonPromptParams,
  ResumeGenerationPromptParams
} from './ai/resumePrompts';
