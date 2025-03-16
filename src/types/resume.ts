/**
 * Enum representing the format of a resume
 */
export enum ResumeFormat {
  STANDARD = 'standard',
  ATS = 'ats',
  CREATIVE = 'creative',
  EXECUTIVE = 'executive',
  TECHNICAL = 'technical',
  ACADEMIC = 'academic',
  FEDERAL = 'federal'
}

/**
 * Interface for a resume section
 */
export interface ResumeSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

/**
 * Interface for a work experience entry
 */
export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills?: string[];
}

/**
 * Interface for an education entry
 */
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: number;
  achievements?: string[];
}

/**
 * Interface for a project entry
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  skills?: string[];
  achievements?: string[];
}

/**
 * Interface for a certification entry
 */
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string;
  url?: string;
}

/**
 * Interface for a resume
 */
export interface Resume {
  id: string;
  userId: string;
  title: string;
  format: ResumeFormat;
  version: number;
  createdAt: string;
  updatedAt: string;
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
    github?: string;
    website?: string;
  };
  summary: string;
  skills: string[];
  workExperience: WorkExperience[];
  education: Education[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: { language: string; proficiency: string }[];
  customSections?: ResumeSection[];
  fileUrl?: string;
  keywords?: string[];
  targetJobTitle?: string;
  targetIndustry?: string;
  isPublic?: boolean;
}

/**
 * Interface for resume analysis result
 */
export interface ResumeAnalysisResult {
  resumeId: string;
  jobDescription: string;
  matchScore: number;
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  skillGaps: string[];
  recommendedSkills: string[];
  recommendedExperience: string[];
  atsCompatibility: number;
  readabilityScore: number;
  formattingIssues?: string[];
  contentIssues?: string[];
  overallRecommendation: string;
}

/**
 * Interface for resume generation options
 */
export interface ResumeGenerationOptions {
  userId: string;
  jobDescription: string;
  format?: ResumeFormat;
  emphasizeSkills?: string[];
  includeProjects?: boolean;
  customSections?: { title: string; content: string }[];
  targetJobTitle?: string;
  targetIndustry?: string;
  useExistingResumeId?: string;
}
