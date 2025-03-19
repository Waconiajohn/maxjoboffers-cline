/**
 * Resume Feature Types
 * 
 * This file contains all types related to resume functionality.
 */

/**
 * Resume format
 */
export enum ResumeFormat {
  Standard = 'standard',
  Modern = 'modern',
  Creative = 'creative',
  Executive = 'executive',
  Technical = 'technical',
  ATS = 'ats'
}

/**
 * Resume section
 */
export enum ResumeSection {
  Header = 'header',
  Summary = 'summary',
  Experience = 'experience',
  Education = 'education',
  Skills = 'skills',
  Projects = 'projects',
  Certifications = 'certifications',
  Awards = 'awards',
  Publications = 'publications',
  Languages = 'languages',
  Interests = 'interests',
  References = 'references',
  Custom = 'custom'
}

/**
 * Resume header
 */
export interface ResumeHeader {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  other?: { [key: string]: string };
}

/**
 * Resume experience item
 */
export interface ResumeExperienceItem {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  bullets: string[];
  skills?: string[];
  achievements?: string[];
}

/**
 * Resume education item
 */
export interface ResumeEducationItem {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  gpa?: string;
  description?: string;
  bullets?: string[];
  achievements?: string[];
}

/**
 * Resume skill item
 */
export interface ResumeSkillItem {
  id: string;
  name: string;
  level?: number; // 1-5
  category?: string;
  years?: number;
}

/**
 * Resume project item
 */
export interface ResumeProjectItem {
  id: string;
  name: string;
  description: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  bullets?: string[];
  skills?: string[];
  achievements?: string[];
}

/**
 * Resume certification item
 */
export interface ResumeCertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  expirationDate?: string;
  url?: string;
  description?: string;
}

/**
 * Resume award item
 */
export interface ResumeAwardItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  description?: string;
}

/**
 * Resume publication item
 */
export interface ResumePublicationItem {
  id: string;
  title: string;
  publisher: string;
  date?: string;
  url?: string;
  description?: string;
  authors?: string[];
}

/**
 * Resume language item
 */
export interface ResumeLanguageItem {
  id: string;
  name: string;
  proficiency: string; // e.g., "Native", "Fluent", "Intermediate", "Basic"
}

/**
 * Resume custom section item
 */
export interface ResumeCustomSectionItem {
  id: string;
  title: string;
  content: string;
  bullets?: string[];
}

/**
 * Resume data
 */
export interface ResumeData {
  id: string;
  userId: string;
  name: string;
  format: ResumeFormat;
  header: ResumeHeader;
  summary?: string;
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
  skills: ResumeSkillItem[];
  projects?: ResumeProjectItem[];
  certifications?: ResumeCertificationItem[];
  awards?: ResumeAwardItem[];
  publications?: ResumePublicationItem[];
  languages?: ResumeLanguageItem[];
  interests?: string[];
  references?: string;
  customSections?: { [key: string]: ResumeCustomSectionItem[] };
  createdAt: string;
  updatedAt: string;
}

/**
 * Resume version
 */
export interface ResumeVersion {
  id: string;
  resumeId: string;
  name: string;
  data: ResumeData;
  createdAt: string;
  isActive: boolean;
}

/**
 * Resume template
 */
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  format: ResumeFormat;
  imageUrl?: string;
  isDefault?: boolean;
  isPremium?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * ATS score
 */
export interface ATSScore {
  overall: number; // 0-100
  sections: {
    [key in ResumeSection]?: number; // 0-100
  };
  keywords: {
    matched: string[];
    missing: string[];
  };
  suggestions: string[];
}

/**
 * Resume analysis
 */
export interface ResumeAnalysis {
  id: string;
  resumeId: string;
  jobTitle?: string;
  jobDescription?: string;
  atsScore?: ATSScore;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  createdAt: string;
}

/**
 * AI rewrite request
 */
export interface AIRewriteRequest {
  resumeId: string;
  section: ResumeSection | 'all';
  jobTitle?: string;
  jobDescription?: string;
  tone?: string; // e.g., "professional", "confident", "creative"
  focusKeywords?: string[];
  instructions?: string;
}

/**
 * AI rewrite response
 */
export interface AIRewriteResponse {
  id: string;
  requestId: string;
  originalContent: any; // The original content of the section
  rewrittenContent: any; // The rewritten content of the section
  explanation?: string;
  createdAt: string;
}

/**
 * Resume export format
 */
export enum ResumeExportFormat {
  PDF = 'pdf',
  DOCX = 'docx',
  TXT = 'txt',
  JSON = 'json'
}

/**
 * Resume export options
 */
export interface ResumeExportOptions {
  format: ResumeExportFormat;
  includeReferences?: boolean;
  customFonts?: boolean;
  colorScheme?: string;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

/**
 * Resume import source
 */
export enum ResumeImportSource {
  File = 'file',
  LinkedIn = 'linkedin',
  Indeed = 'indeed',
  URL = 'url'
}

/**
 * Resume import options
 */
export interface ResumeImportOptions {
  source: ResumeImportSource;
  format?: ResumeFormat;
  overwrite?: boolean;
}

/**
 * Resume parsing result
 */
export interface ResumeParsingResult {
  success: boolean;
  data?: Partial<ResumeData>;
  errors?: string[];
  warnings?: string[];
}
