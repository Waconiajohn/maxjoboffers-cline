export interface RetirementPlanRequest {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  age: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution?: number;
  employerMatch?: number;
  hasAdvisor: boolean;
  documentIds: string[];
  appointmentDateTime: string;
}

export interface RetirementPlan {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: RetirementPlanStatus;
  appointmentDateTime: string;
  appointmentConfirmed: boolean;
  advisorId?: string;
  advisorName?: string;
  documentIds: string[];
  recommendations?: RetirementRecommendations;
}

export enum RetirementPlanStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface RetirementRecommendations {
  monthlySavingsGoal: number;
  retirementIncomeEstimate: number;
  retirementReadinessScore: number;
  investmentRecommendations: InvestmentRecommendation[];
  actionItems: ActionItem[];
  additionalNotes: string;
}

export interface InvestmentRecommendation {
  category: string;
  allocation: number;
  description: string;
}

export interface ActionItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  dateTime: Date;
}

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  fileUrl: string;
}

export interface RolloverIncentive {
  tier1Amount: number;  // $50,000 – $99,999
  tier2Amount: number;  // $100,000 – $249,999
  tier3Amount: number;  // $250,000 – $499,999
  tier4Amount: number;  // $500,000 – $999,999
  tier5Amount: number;  // $1,000,000 and above
  holdingPeriodMonths: number;
}
