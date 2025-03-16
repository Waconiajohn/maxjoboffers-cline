// Mock entity types
export interface User {
  id: string;
  email: string;
  username?: string;
  password?: string;
  isEmailVerified: boolean;
  emailVerificationSentAt?: Date;
  passwordResetSentAt?: Date;
  isAdmin: boolean;
  stripeCustomerId?: string;
  paymentProcessorUserId?: string;
  subscriptionStatus?: string;
  subscriptionPlanId?: string;
  credits: number;
  lastLoginAt?: Date;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  content: string;
  fileUrl?: string;
  version: number;
  format?: string;
  isAtsOptimized: boolean;
  matchScore?: number;
  keywords?: string[];
  parentResumeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  description: string;
  requirements?: string;
  salary?: {
    min: number;
    max: number;
  };
  applicationUrl?: string;
  source?: string;
  jobType?: string;
  experienceLevel?: string;
  industry?: string;
  skills?: string[];
  benefits?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  resumeId?: string;
  coverLetterId?: string;
  status: string;
  appliedDate: Date;
  followUpDate?: Date;
  notes?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoverLetter {
  id: string;
  userId: string;
  title: string;
  content: string;
  jobId?: string;
  resumeId?: string;
  format?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interview {
  id: string;
  userId: string;
  jobApplicationId: string;
  type: string;
  round: number;
  interviewers: string[];
  date?: Date;
  duration?: number;
  location?: string;
  notes?: string;
  feedback?: string;
  overallScore?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewQuestion {
  id: string;
  interviewId: string;
  question: string;
  answer?: string;
  feedback?: string;
  score?: number;
  category?: string;
  difficulty?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewRecording {
  id: string;
  interviewId: string;
  questionId: string;
  recordingUrl: string;
  createdAt: Date;
}

export interface LinkedInProfile {
  id: string;
  userId: string;
  headline: string;
  summary: string;
  sections: any;
  keywords: string[];
  optimizationScore: number;
  profileUrl?: string;
  connections?: number;
  recommendations?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkedInPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  hashtags: string[];
  suggestedImage?: string;
  engagementTips: string[];
  publishDate?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NetworkingStrategy {
  id: string;
  userId: string;
  title: string;
  summary: string;
  connectionStrategies: any;
  contentStrategy: any;
  outreachTemplates: any;
  kpis: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  notes?: string;
  savedAt: Date;
}

export interface ApplicationStatusHistory {
  id: string;
  applicationId: string;
  status: string;
  date: Date;
  notes?: string;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  paymentMethod: string;
  status: string;
  stripePaymentId?: string;
  createdAt: Date;
}
