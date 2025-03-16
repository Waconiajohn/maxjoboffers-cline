/**
 * Enum representing the type of interview
 */
export enum InterviewType {
  BEHAVIORAL = 'behavioral',
  TECHNICAL = 'technical',
  CASE_STUDY = 'case_study',
  SITUATIONAL = 'situational',
  PANEL = 'panel',
  PHONE_SCREEN = 'phone_screen'
}

/**
 * Enum representing the difficulty level of interview questions
 */
export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

/**
 * Interface for an interview question
 */
export interface InterviewQuestion {
  id: string;
  question: string;
  type: InterviewType;
  difficultyLevel: DifficultyLevel;
  category?: string;
  suggestedAnswer?: string;
  tips?: string;
  followUpQuestions?: string[];
}

/**
 * Interface for a company research item
 */
export interface CompanyResearch {
  companyName: string;
  overview?: string;
  mission?: string;
  values?: string;
  culture?: string;
  products?: string[];
  competitors?: string[];
  recentNews?: {
    title: string;
    date: string;
    summary: string;
    url?: string;
  }[];
  keyPeople?: {
    name: string;
    title: string;
    background?: string;
  }[];
}

/**
 * Interface for interview preparation request
 */
export interface InterviewPrepRequest {
  userId: string;
  jobDescription: string;
  jobTitle?: string;
  company?: string;
  resumeId?: string;
  interviewType: InterviewType;
  difficultyLevel: DifficultyLevel;
  focusAreas?: string[];
}

/**
 * Interface for interview preparation response
 */
export interface InterviewPrepResponse {
  id: string;
  userId: string;
  jobTitle?: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
  interviewType: InterviewType;
  difficultyLevel: DifficultyLevel;
  questions: InterviewQuestion[];
  companyResearch?: CompanyResearch;
  keySkills: string[];
  preparationTips: string[];
  commonMistakes: string[];
  suggestedTopics: string[];
  technicalConcepts?: string[];
  behavioralThemes?: string[];
  interviewStructure?: {
    stage: string;
    description: string;
    duration?: string;
    tips?: string;
  }[];
  followUpQuestions?: {
    question: string;
    suggestedAnswer?: string;
  }[];
  selfAssessment?: {
    strengths: string[];
    weaknesses: string[];
    improvementAreas: string[];
  };
}

/**
 * Interface for interview preparation session
 */
export interface InterviewPrepSession {
  id: string;
  userId: string;
  prepId: string;
  startTime: string;
  endTime?: string;
  questions: {
    questionId: string;
    userAnswer?: string;
    feedback?: string;
    rating?: number;
  }[];
  notes?: string;
  overallFeedback?: string;
  recordingUrl?: string;
}

/**
 * Interface for interview feedback
 */
export interface InterviewFeedback {
  id: string;
  userId: string;
  prepId: string;
  sessionId?: string;
  createdAt: string;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  overallRating: number;
  specificFeedback?: {
    category: string;
    feedback: string;
    rating: number;
  }[];
  nextSteps?: string[];
}
