/**
 * Resume Version Control System
 * 
 * This file implements a version control system for resumes.
 * It tracks changes to resumes, maintains a history of versions, and allows comparison between versions.
 */

import { ResumeReviewResult } from './resumeReviewSystem';

/**
 * Resume Version Interface
 * This interface defines the structure of a resume version.
 */
export interface ResumeVersion {
  id: string;
  timestamp: Date;
  content: string;
  reviewResult?: ResumeReviewResult;
  jobDescription?: string;
  changes?: ResumeChange[];
  score?: number;
  metadata?: {
    [key: string]: any;
  };
}

/**
 * Resume Change Interface
 * This interface defines the structure of a change to a resume.
 */
export interface ResumeChange {
  type: 'addition' | 'deletion' | 'modification';
  section: string;
  before?: string;
  after?: string;
  description: string;
}

/**
 * Resume Diff Interface
 * This interface defines the structure of a diff between two resume versions.
 */
export interface ResumeDiff {
  fromVersion: string;
  toVersion: string;
  changes: ResumeChange[];
  improvementScore?: number;
}

/**
 * Resume Version Control System
 * This class implements the version control system for resumes.
 */
export class ResumeVersionControl {
  private versions: Map<string, ResumeVersion>;
  private currentVersionId: string | null;
  private resumeId: string;

  /**
   * Constructor
   * 
   * @param resumeId The ID of the resume
   */
  constructor(resumeId: string) {
    this.versions = new Map<string, ResumeVersion>();
    this.currentVersionId = null;
    this.resumeId = resumeId;
  }

  /**
   * Create Version
   * This method creates a new version of the resume.
   * 
   * @param content The content of the resume
   * @param reviewResult The review result for the resume
   * @param jobDescription The job description used for the review
   * @param metadata Additional metadata for the version
   * @returns The ID of the new version
   */
  public createVersion(
    content: string,
    reviewResult?: ResumeReviewResult,
    jobDescription?: string,
    metadata?: { [key: string]: any }
  ): string {
    const timestamp = new Date();
    const id = `${this.resumeId}-${timestamp.getTime()}`;
    
    // Calculate changes if there's a previous version
    let changes: ResumeChange[] | undefined;
    if (this.currentVersionId) {
      const previousVersion = this.versions.get(this.currentVersionId);
      if (previousVersion) {
        changes = this.calculateChanges(previousVersion.content, content);
      }
    }
    
    const version: ResumeVersion = {
      id,
      timestamp,
      content,
      reviewResult,
      jobDescription,
      changes,
      score: reviewResult?.overallScore,
      metadata
    };
    
    this.versions.set(id, version);
    this.currentVersionId = id;
    
    return id;
  }

  /**
   * Get Version
   * This method retrieves a specific version of the resume.
   * 
   * @param versionId The ID of the version to retrieve
   * @returns The resume version
   */
  public getVersion(versionId: string): ResumeVersion | undefined {
    return this.versions.get(versionId);
  }

  /**
   * Get Current Version
   * This method retrieves the current version of the resume.
   * 
   * @returns The current resume version
   */
  public getCurrentVersion(): ResumeVersion | undefined {
    if (!this.currentVersionId) {
      return undefined;
    }
    
    return this.versions.get(this.currentVersionId);
  }

  /**
   * Get All Versions
   * This method retrieves all versions of the resume.
   * 
   * @returns All resume versions
   */
  public getAllVersions(): ResumeVersion[] {
    return Array.from(this.versions.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
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
    const fromVersion = this.versions.get(fromVersionId);
    const toVersion = this.versions.get(toVersionId);
    
    if (!fromVersion || !toVersion) {
      return undefined;
    }
    
    const changes = this.calculateChanges(fromVersion.content, toVersion.content);
    
    // Calculate improvement score
    let improvementScore: number | undefined;
    if (fromVersion.score !== undefined && toVersion.score !== undefined) {
      improvementScore = toVersion.score - fromVersion.score;
    }
    
    return {
      fromVersion: fromVersionId,
      toVersion: toVersionId,
      changes,
      improvementScore
    };
  }

  /**
   * Calculate Changes
   * This method calculates the changes between two versions of the resume.
   * 
   * @param fromContent The content of the version to compare from
   * @param toContent The content of the version to compare to
   * @returns The changes between the two versions
   */
  private calculateChanges(fromContent: string, toContent: string): ResumeChange[] {
    const changes: ResumeChange[] = [];
    
    // Split content into sections
    const fromSections = this.splitIntoSections(fromContent);
    const toSections = this.splitIntoSections(toContent);
    
    // Find added sections
    for (const [section, content] of Object.entries(toSections)) {
      if (!fromSections[section]) {
        changes.push({
          type: 'addition',
          section,
          after: content,
          description: `Added new section: ${section}`
        });
      }
    }
    
    // Find deleted sections
    for (const [section, content] of Object.entries(fromSections)) {
      if (!toSections[section]) {
        changes.push({
          type: 'deletion',
          section,
          before: content,
          description: `Removed section: ${section}`
        });
      }
    }
    
    // Find modified sections
    for (const [section, toContent] of Object.entries(toSections)) {
      const fromContent = fromSections[section];
      if (fromContent && fromContent !== toContent) {
        changes.push({
          type: 'modification',
          section,
          before: fromContent,
          after: toContent,
          description: `Modified section: ${section}`
        });
      }
    }
    
    return changes;
  }

  /**
   * Split Into Sections
   * This method splits the resume content into sections.
   * 
   * @param content The content of the resume
   * @returns The sections of the resume
   */
  private splitIntoSections(content: string): { [key: string]: string } {
    const sections: { [key: string]: string } = {};
    
    // Simple section detection based on common resume section headers
    const sectionRegexes = [
      { name: 'Contact Information', regex: /^\s*(CONTACT|PERSONAL)\s+INFORMATION\s*$/im },
      { name: 'Summary', regex: /^\s*(SUMMARY|PROFESSIONAL\s+SUMMARY|PROFILE)\s*$/im },
      { name: 'Experience', regex: /^\s*(EXPERIENCE|WORK\s+EXPERIENCE|PROFESSIONAL\s+EXPERIENCE)\s*$/im },
      { name: 'Education', regex: /^\s*(EDUCATION|ACADEMIC\s+BACKGROUND)\s*$/im },
      { name: 'Skills', regex: /^\s*(SKILLS|TECHNICAL\s+SKILLS|CORE\s+COMPETENCIES)\s*$/im },
      { name: 'Projects', regex: /^\s*(PROJECTS|KEY\s+PROJECTS)\s*$/im },
      { name: 'Certifications', regex: /^\s*(CERTIFICATIONS|CERTIFICATES)\s*$/im },
      { name: 'Languages', regex: /^\s*(LANGUAGES)\s*$/im },
      { name: 'Interests', regex: /^\s*(INTERESTS|HOBBIES)\s*$/im },
      { name: 'References', regex: /^\s*(REFERENCES)\s*$/im }
    ];
    
    // Split content into lines
    const lines = content.split('\n');
    
    let currentSection = 'Header';
    let currentContent: string[] = [];
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if line is a section header
      let isSectionHeader = false;
      for (const { name, regex } of sectionRegexes) {
        if (regex.test(line)) {
          // Save current section
          if (currentContent.length > 0) {
            sections[currentSection] = currentContent.join('\n');
          }
          
          // Start new section
          currentSection = name;
          currentContent = [line];
          isSectionHeader = true;
          break;
        }
      }
      
      if (!isSectionHeader) {
        currentContent.push(line);
      }
    }
    
    // Save last section
    if (currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n');
    }
    
    return sections;
  }

  /**
   * Get Version History
   * This method retrieves the history of versions for the resume.
   * 
   * @returns The history of versions
   */
  public getVersionHistory(): {
    versionId: string;
    timestamp: Date;
    score?: number;
    jobDescription?: string;
  }[] {
    return Array.from(this.versions.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .map(version => ({
        versionId: version.id,
        timestamp: version.timestamp,
        score: version.score,
        jobDescription: version.jobDescription
      }));
  }

  /**
   * Get Improvement Metrics
   * This method calculates improvement metrics between versions.
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
    const versions = this.getAllVersions();
    
    if (versions.length <= 1) {
      return {
        overallImprovement: 0,
        versionImprovements: []
      };
    }
    
    // Calculate improvements between consecutive versions
    const versionImprovements: {
      versionId: string;
      improvement: number;
      timestamp: Date;
    }[] = [];
    
    for (let i = 0; i < versions.length - 1; i++) {
      const currentVersion = versions[i];
      const previousVersion = versions[i + 1];
      
      if (currentVersion.score !== undefined && previousVersion.score !== undefined) {
        const improvement = currentVersion.score - previousVersion.score;
        
        versionImprovements.push({
          versionId: currentVersion.id,
          improvement,
          timestamp: currentVersion.timestamp
        });
      }
    }
    
    // Calculate overall improvement
    const firstVersion = versions[versions.length - 1];
    const latestVersion = versions[0];
    
    let overallImprovement = 0;
    if (firstVersion.score !== undefined && latestVersion.score !== undefined) {
      overallImprovement = latestVersion.score - firstVersion.score;
    }
    
    return {
      overallImprovement,
      versionImprovements
    };
  }
}
