/**
 * AI Module Index
 * 
 * This file exports all the components of the AI module.
 */

// Resume Review System
export { 
  ResumeReviewSystem,
  ResumeReviewStage,
  type ResumeAnalysisResult,
  type TechnicalOptimizationResult,
  type ATSOptimizationResult,
  type ExecutiveImpactResult,
  type FinalIntegrationResult,
  type ResumeReviewResult
} from './resumeReviewSystem';

// Resume Version Control
export {
  ResumeVersionControl,
  type ResumeVersion,
  type ResumeChange,
  type ResumeDiff
} from './resumeVersionControl';

// Resume Manager
export {
  ResumeManager,
  ResumeFormat,
  type ResumeFormatDetails
} from './resumeManager';

// Resume Prompts
export {
  initialResumeAnalysisPrompt,
  technicalOptimizationPrompt,
  atsOptimizationPrompt,
  executiveImpactEnhancementPrompt,
  finalIntegrationPrompt,
  getTechnicalOptimizationPrompt
} from './resumePrompts';

// ATS Systems and Notifications
export {
  type ATSSystem,
  type NotificationMessage,
  atsSystems,
  notificationMessages,
  getATSSystemsByPopularity,
  getATSSystemById,
  getATSSystemsForJobDescription,
  getNotificationMessage,
  getStageNotifications
} from './atsSystemsAndNotifications';

// Networking Prompts
export {
  connectionAnalysisPrompt,
  campaignStrategyPrompt,
  messageEnhancementPrompt,
  contentDevelopmentPrompt,
  groupStrategyPrompt
} from './networkingPrompts';

// Networking System
export {
  NetworkingStrategySystem,
  ConnectionAnalyzer,
  CampaignManager,
  MessageOptimizer,
  ContentStrategist,
  GroupEngagementStrategist,
  type ConnectionPath,
  type CompanyInsight,
  type ConnectionAnalysisResult,
  type NetworkingCampaign,
  type CampaignStrategyResult,
  type MessageEnhancementResult,
  type ContentDevelopmentResult,
  type GroupStrategyResult
} from './networkingSystem';
