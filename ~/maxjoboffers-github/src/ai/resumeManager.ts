/**
 * Resume Manager
 * 
 * This file integrates the resume review system and version control system
 * to provide a comprehensive resume management solution.
 */

import { ResumeReviewSystem, ResumeReviewResult, ResumeReviewStage } from './resumeReviewSystem';
import { ResumeVersionControl, ResumeVersion, ResumeDiff } from './resumeVersionControl';
import { 
  ATSSystem, 
  NotificationMessage,
  getATSSystemsForJobDescription,
  getATSSystemsByPopularity,
  getNotificationMessage
} from './atsSystemsAndNotifications';

/**
 * Resume Format
 * This enum defines the different formats for resumes.
 */
export enum ResumeFormat {
  STANDARD = 'standard',
  MODERN = 'modern',
  CREATIVE = 'creative',
  EXECUTIVE = 'executive',
  TECHNICAL = 'technical',
  ATS_OPTIMIZED = 'ats_optimized'
}

/**
 * Resume Format Details
 * This interface defines the details of a resume format.
 */
export interface ResumeFormatDetails {
  id: ResumeFormat;
  name: string;
  description: string;
  atsCompatibilityScore: number;
  suitableFor: string[];
  previewUrl?: string;
}

/**
 * Resume Manager
 * This class integrates the resume review system and version control system.
 */
export class ResumeManager {
  private reviewSystem: ResumeReviewSystem | null;
  private versionControl: ResumeVersionControl;
  private formats: Map<ResumeFormat, ResumeFormatDetails>;
  private currentFormat: ResumeFormat;
  private targetATSSystems: ATSSystem[];
  private notificationCallback?: (notification: NotificationMessage) => void;
  
  /**
   * Constructor
   * 
   * @param resumeId The ID of the resume
   * @param notificationCallback Optional callback for notifications
   */
  constructor(
    resumeId: string,
    notificationCallback?: (notification: NotificationMessage) => void
  ) {
    this.reviewSystem = null;
    this.versionControl = new ResumeVersionControl(resumeId);
    this.formats = this.initializeFormats();
    this.currentFormat = ResumeFormat.STANDARD;
    this.targetATSSystems = getATSSystemsByPopularity(5);
    this.notificationCallback = notificationCallback;
  }
  
  /**
   * Initialize Formats
   * This method initializes the available resume formats.
   * 
   * @returns The available resume formats
   */
  private initializeFormats(): Map<ResumeFormat, ResumeFormatDetails> {
    const formats = new Map<ResumeFormat, ResumeFormatDetails>();
    
    formats.set(ResumeFormat.STANDARD, {
      id: ResumeFormat.STANDARD,
      name: 'Standard',
      description: 'A traditional resume format suitable for most industries.',
      atsCompatibilityScore: 90,
      suitableFor: ['All industries', 'Entry to mid-level positions']
    });
    
    formats.set(ResumeFormat.MODERN, {
      id: ResumeFormat.MODERN,
      name: 'Modern',
      description: 'A clean, contemporary design with a focus on readability.',
      atsCompatibilityScore: 85,
      suitableFor: ['Tech', 'Design', 'Marketing', 'Startups']
    });
    
    formats.set(ResumeFormat.CREATIVE, {
      id: ResumeFormat.CREATIVE,
      name: 'Creative',
      description: 'A visually striking design for creative professionals.',
      atsCompatibilityScore: 70,
      suitableFor: ['Design', 'Art', 'Marketing', 'Entertainment']
    });
    
    formats.set(ResumeFormat.EXECUTIVE, {
      id: ResumeFormat.EXECUTIVE,
      name: 'Executive',
      description: 'A sophisticated format for senior-level professionals.',
      atsCompatibilityScore: 85,
      suitableFor: ['Executive positions', 'Senior management', 'Board roles']
    });
    
    formats.set(ResumeFormat.TECHNICAL, {
      id: ResumeFormat.TECHNICAL,
      name: 'Technical',
      description: 'A format optimized for technical roles with skills emphasis.',
      atsCompatibilityScore: 95,
      suitableFor: ['Engineering', 'IT', 'Data Science', 'Research']
    });
    
    formats.set(ResumeFormat.ATS_OPTIMIZED, {
      id: ResumeFormat.ATS_OPTIMIZED,
      name: 'ATS Optimized',
      description: 'Maximized for Applicant Tracking System compatibility.',
      atsCompatibilityScore: 100,
      suitableFor: ['All industries', 'Large company applications', 'Online applications']
    });
    
    return formats;
  }
  
  /**
   * Set Notification Callback
   * This method sets the callback function for notifications.
   * 
   * @param callback The callback function
   */
  public setNotificationCallback(callback: (notification: NotificationMessage) => void): void {
    this.notificationCallback = callback;
  }
  
  /**
   * Send Notification
   * This method sends a notification using the callback function.
   * 
   * @param notificationId The ID of the notification
   */
  private sendNotification(notificationId: string): void {
    if (this.notificationCallback) {
      const notification = getNotificationMessage(notificationId);
      this.notificationCallback(notification);
    }
  }
  
  /**
   * Start Review Process
   * This method starts the resume review process.
   * 
   * @param resumeContent The content of the resume
   * @param jobDescription The job description to compare against
   * @param industry The industry of the job
   * @returns The ID of the new version
   */
  public async startReviewProcess(
    resumeContent: string,
    jobDescription: string,
    industry: string
  ): Promise<string> {
    // Identify target ATS systems
    this.targetATSSystems = getATSSystemsForJobDescription(jobDescription);
    
    // Create initial version
    const versionId = this.versionControl.createVersion(
      resumeContent,
      undefined,
      jobDescription,
      { 
        stage: 'initial', 
        industry,
        targetATSSystems: this.targetATSSystems.map(system => system.id)
      }
    );
    
    // Send notification
    this.sendNotification('versionCreated');
    
    // Initialize review system
    this.reviewSystem = new ResumeReviewSystem(resumeContent, jobDescription, industry);
    
    return versionId;
  }
  
  /**
   * Run Next Review Stage
   * This method runs the next stage of the review process.
   * 
   * @returns The result of the review stage
   */
  public async runNextReviewStage(): Promise<ResumeReviewResult> {
    if (!this.reviewSystem) {
      throw new Error('Review process not started');
    }
    
    const currentResult = this.reviewSystem.getCurrentResult();
    let result: ResumeReviewResult;
    
    switch (currentResult.currentStage) {
      case ResumeReviewStage.INITIAL_ANALYSIS:
        // Send notification
        this.sendNotification('initialAnalysisStarted');
        
        // Run analysis
        await this.reviewSystem.runInitialAnalysis();
        result = this.reviewSystem.getCurrentResult();
        
        // Send completion notification
        this.sendNotification('initialAnalysisCompleted');
        break;
        
      case ResumeReviewStage.TECHNICAL_OPTIMIZATION:
        // Send notification
        this.sendNotification('technicalOptimizationStarted');
        
        // Run optimization
        await this.reviewSystem.runTechnicalOptimization();
        result = this.reviewSystem.getCurrentResult();
        
        // Send completion notification
        this.sendNotification('technicalOptimizationCompleted');
        break;
        
      case ResumeReviewStage.ATS_OPTIMIZATION:
        // Send notification
        this.sendNotification('atsOptimizationStarted');
        
        // Run optimization
        await this.reviewSystem.runATSOptimization();
        result = this.reviewSystem.getCurrentResult();
        
        // Send completion notification
        this.sendNotification('atsOptimizationCompleted');
        break;
        
      case ResumeReviewStage.EXECUTIVE_IMPACT:
        // Send notification
        this.sendNotification('executiveImpactStarted');
        
        // Run enhancement
        await this.reviewSystem.runExecutiveImpactEnhancement();
        result = this.reviewSystem.getCurrentResult();
        
        // Send completion notification
        this.sendNotification('executiveImpactCompleted');
        break;
        
      case ResumeReviewStage.FINAL_INTEGRATION:
        // Send notification
        this.sendNotification('finalIntegrationStarted');
        
        // Run integration
        await this.reviewSystem.runFinalIntegration();
        result = this.reviewSystem.getCurrentResult();
        
        // Create new version with the optimized resume
        if (result.optimizedResume) {
          const currentVersion = this.versionControl.getCurrentVersion();
          if (currentVersion) {
            this.versionControl.createVersion(
              result.optimizedResume,
              result,
              currentVersion.jobDescription,
              { 
                stage: 'optimized', 
                format: this.currentFormat,
                targetATSSystems: this.targetATSSystems.map(system => system.id)
              }
            );
            
            // Send notification
            this.sendNotification('versionCreated');
          }
        }
        
        // Send completion notification
        this.sendNotification('finalIntegrationCompleted');
        break;
        
      default:
        throw new Error('Invalid review stage');
    }
    
    return result;
  }
  
  /**
   * Run Complete Review
   * This method runs all stages of the review process.
   * 
   * @returns The result of the complete review
   */
  public async runCompleteReview(): Promise<ResumeReviewResult> {
    if (!this.reviewSystem) {
      throw new Error('Review process not started');
    }
    
    try {
      // Initial Analysis
      this.sendNotification('initialAnalysisStarted');
      await this.reviewSystem.runInitialAnalysis();
      this.sendNotification('initialAnalysisCompleted');
      
      // Technical Optimization
      this.sendNotification('technicalOptimizationStarted');
      await this.reviewSystem.runTechnicalOptimization();
      this.sendNotification('technicalOptimizationCompleted');
      
      // ATS Optimization
      this.sendNotification('atsOptimizationStarted');
      await this.reviewSystem.runATSOptimization();
      this.sendNotification('atsOptimizationCompleted');
      
      // Executive Impact Enhancement
      this.sendNotification('executiveImpactStarted');
      await this.reviewSystem.runExecutiveImpactEnhancement();
      this.sendNotification('executiveImpactCompleted');
      
      // Final Integration
      this.sendNotification('finalIntegrationStarted');
      await this.reviewSystem.runFinalIntegration();
      
      const result = this.reviewSystem.getCurrentResult();
      
      // Create new version with the optimized resume
      if (result.optimizedResume) {
        const currentVersion = this.versionControl.getCurrentVersion();
        if (currentVersion) {
          this.versionControl.createVersion(
            result.optimizedResume,
            result,
            currentVersion.jobDescription,
            { 
              stage: 'optimized', 
              format: this.currentFormat,
              targetATSSystems: this.targetATSSystems.map(system => system.id)
            }
          );
          
          // Send notification
          this.sendNotification('versionCreated');
        }
      }
      
      // Send completion notification
      this.sendNotification('finalIntegrationCompleted');
      
      return result;
    } catch (error) {
      // Send error notification
      this.sendNotification('apiError');
      throw error;
    }
  }
  
  /**
   * Get Available Formats
   * This method returns the available resume formats.
   * 
   * @returns The available resume formats
   */
  public getAvailableFormats(): ResumeFormatDetails[] {
    return Array.from(this.formats.values());
  }
  
  /**
   * Set Format
   * This method sets the format for the resume.
   * 
   * @param format The format to set
   */
  public setFormat(format: ResumeFormat): void {
    if (!this.formats.has(format)) {
      throw new Error(`Invalid format: ${format}`);
    }
    
    this.currentFormat = format;
    
    // Send notification
    this.sendNotification('formatChanged');
  }
  
  /**
   * Get Current Format
   * This method returns the current format for the resume.
   * 
   * @returns The current format
   */
  public getCurrentFormat(): ResumeFormatDetails {
    return this.formats.get(this.currentFormat)!;
  }
  
  /**
   * Get Format Details
   * This method returns the details for a specific format.
   * 
   * @param format The format to get details for
   * @returns The format details
   */
  public getFormatDetails(format: ResumeFormat): ResumeFormatDetails | undefined {
    return this.formats.get(format);
  }
  
  /**
   * Get Version History
   * This method returns the version history for the resume.
   * 
   * @returns The version history
   */
  public getVersionHistory(): {
    versionId: string;
    timestamp: Date;
    score?: number;
    jobDescription?: string;
  }[] {
    return this.versionControl.getVersionHistory();
  }
  
  /**
   * Get Version
   * This method returns a specific version of the resume.
   * 
   * @param versionId The ID of the version to get
   * @returns The version
   */
  public getVersion(versionId: string): ResumeVersion | undefined {
    return this.versionControl.getVersion(versionId);
  }
  
  /**
   * Get Current Version
   * This method returns the current version of the resume.
   * 
   * @returns The current version
   */
  public getCurrentVersion(): ResumeVersion | undefined {
    return this.versionControl.getCurrentVersion();
  }
  
  /**
   * Compare Versions
   * This method compares two versions of the resume.
   * 
   * @param fromVersionId The ID of the version to compare from
   * @param toVersionId The ID of the version to compare to
   * @returns The diff between the two versions
   */
  public compareVersions(fromVersionId: string, toVersionId: string): ResumeDiff | undefined {
    return this.versionControl.compareVersions(fromVersionId, toVersionId);
  }
  
  /**
   * Get Improvement Metrics
   * This method returns improvement metrics for the resume.
   * 
   * @returns The improvement metrics
   */
  public getImprovementMetrics(): {
    overallImprovement: number;
    versionImprovements: {
      versionId: string;
      improvement: number;
      timestamp: Date;
    }[];
  } {
    return this.versionControl.getImprovementMetrics();
  }
  
  /**
   * Export Resume
   * This method exports the resume in the specified format.
   * 
   * @param versionId The ID of the version to export
   * @param format The format to export in
   * @returns The exported resume content
   */
  public exportResume(versionId: string, format: ResumeFormat): string | undefined {
    const version = this.versionControl.getVersion(versionId);
    if (!version) {
      return undefined;
    }
    
    // In a real implementation, this would format the resume according to the specified format
    // For now, we'll just return the content
    return version.content;
  }
  
  /**
   * Recommend Format
   * This method recommends a format for the resume based on the job description.
   * 
   * @param jobDescription The job description
   * @returns The recommended format
   */
  public recommendFormat(jobDescription: string): ResumeFormat {
    // In a real implementation, this would analyze the job description and recommend a format
    // For now, we'll just return a default format based on keywords
    
    const jobDescLower = jobDescription.toLowerCase();
    
    if (jobDescLower.includes('engineer') || jobDescLower.includes('developer') || 
        jobDescLower.includes('programmer') || jobDescLower.includes('data scientist')) {
      return ResumeFormat.TECHNICAL;
    }
    
    if (jobDescLower.includes('designer') || jobDescLower.includes('creative') || 
        jobDescLower.includes('artist') || jobDescLower.includes('ux')) {
      return ResumeFormat.CREATIVE;
    }
    
    if (jobDescLower.includes('ceo') || jobDescLower.includes('cto') || 
        jobDescLower.includes('director') || jobDescLower.includes('executive') ||
        jobDescLower.includes('vp') || jobDescLower.includes('vice president')) {
      return ResumeFormat.EXECUTIVE;
    }
    
    if (jobDescLower.includes('startup') || jobDescLower.includes('innovation') || 
        jobDescLower.includes('tech company')) {
      return ResumeFormat.MODERN;
    }
    
    // Default to ATS optimized for maximum compatibility
    return ResumeFormat.ATS_OPTIMIZED;
  }
  
  /**
   * Get Target ATS Systems
   * This method returns the target ATS systems for the resume.
   * 
   * @returns The target ATS systems
   */
  public getTargetATSSystems(): ATSSystem[] {
    return this.targetATSSystems;
  }
  
  /**
   * Set Target ATS Systems
   * This method sets the target ATS systems for the resume.
   * 
   * @param systems The target ATS systems
   */
  public setTargetATSSystems(systems: ATSSystem[]): void {
    this.targetATSSystems = systems;
  }
}
