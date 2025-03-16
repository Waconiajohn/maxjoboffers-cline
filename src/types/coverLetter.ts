/**
 * Enum representing the style of a cover letter
 */
export enum CoverLetterStyle {
  STANDARD = 'standard',
  MODERN = 'modern',
  CREATIVE = 'creative',
  PROFESSIONAL = 'professional',
  EXECUTIVE = 'executive',
  TECHNICAL = 'technical',
  ACADEMIC = 'academic',
  FEDERAL = 'federal'
}

/**
 * Interface for a cover letter
 */
export interface CoverLetter {
  id: string;
  userId: string;
  title: string;
  style: CoverLetterStyle;
  version: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  greeting?: string;
  closing?: string;
  signature?: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    linkedin?: string;
    website?: string;
  };
  recipientInfo?: {
    name?: string;
    title?: string;
    company: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  jobTitle?: string;
  jobId?: string;
  resumeId?: string;
  keywords?: string[];
  fileUrl?: string;
  isPublic?: boolean;
}

/**
 * Interface for cover letter generation options
 */
export interface CoverLetterGenerationOptions {
  userId: string;
  resumeId?: string;
  jobId?: string;
  jobTitle?: string;
  jobDescription: string;
  companyName: string;
  companyInfo?: string;
  recipientName?: string;
  recipientTitle?: string;
  style?: CoverLetterStyle;
  customGreeting?: string;
  customClosing?: string;
  customSignature?: string;
  emphasizeSkills?: string[];
  emphasizeExperiences?: string[];
  tone?: 'formal' | 'conversational' | 'enthusiastic' | 'confident';
  length?: 'short' | 'medium' | 'long';
  includeReferences?: boolean;
  includeAvailability?: boolean;
  availabilityDate?: string;
  additionalInstructions?: string;
}

/**
 * Interface for cover letter analysis result
 */
export interface CoverLetterAnalysisResult {
  coverLetterId: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  tone: string;
  readabilityScore: number;
  keywordMatches?: {
    matched: string[];
    missing: string[];
  };
  formattingIssues?: string[];
  contentIssues?: string[];
  overallRecommendation: string;
}
