/**
 * Interview Feature Types
 */

export interface Interview {
  id: string;
  userId: string;
  jobId?: string;
  customJobDescription?: string;
  type: 'behavioral' | 'technical' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  focusAreas?: string[];
  questions?: InterviewQuestion[];
  status: 'created' | 'in_progress' | 'completed';
  overallScore?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestion {
  id: string;
  interviewId: string;
  question: string;
  answer?: string;
  feedback?: string;
  score?: number;
  order: number;
}

export interface CreateInterviewParams {
  jobId?: string;
  customJobDescription?: string;
  type: 'behavioral' | 'technical' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  focusAreas?: string[];
}

export interface AnswerQuestionParams {
  interviewId: string;
  questionId: string;
  answer: string;
}

export interface InterviewFeedback {
  overallScore: number;
  feedback: string;
  questionFeedback: {
    questionId: string;
    score: number;
    feedback: string;
  }[];
  strengths: string[];
  areasForImprovement: string[];
}
