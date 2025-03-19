/**
 * Resume Feature Types
 */

export interface Resume {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isAtsOptimized?: boolean;
  version?: number;
  format?: string;
}

export interface ResumeUploadParams {
  title: string;
  fileContent: string;
  fileName: string;
  fileType: string;
}

export interface ResumeAnalysisResult {
  matchScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: {
    section: string;
    suggestion: string;
    reason: string;
  }[];
}
