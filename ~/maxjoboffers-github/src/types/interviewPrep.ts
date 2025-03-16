/**
 * Types for the Interview Prep feature
 */

export interface CompanyResearch {
  overview: string;
  focusAreas: string[];
  customerService: string;
}

export interface Competitor {
  name: string;
  description: string;
}

export interface GrowthArea {
  title: string;
  description: string;
}

export interface Risk {
  title: string;
  description: string;
}

export interface RoleImpact {
  title: string;
  description: string;
}

export interface InterviewQuestion {
  category: string;
  question: string;
  answer: string;
}

export interface InterviewTip {
  title: string;
  description: string;
}

export interface InterviewPrepGuide {
  id: string;
  jobId: string;
  resumeId: string;
  jobTitle: string;
  companyName: string;
  createdAt: string;
  lastUpdated: string;
  companyResearch: CompanyResearch;
  competitors: Competitor[];
  growthAreas: GrowthArea[];
  risks: Risk[];
  roleImpacts: RoleImpact[];
  questions: InterviewQuestion[];
  tips: InterviewTip[];
}

export interface InterviewPrepGenerationParams {
  jobId: string;
  resumeId?: string;
  resumeContent?: string;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
}
