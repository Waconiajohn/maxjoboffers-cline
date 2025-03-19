/**
 * Financial Feature Types
 */

export interface GenerateFinancialPlanInput {
  currentSalary: number;
  targetSalary: number;
  industry: string;
  location: string;
  yearsOfExperience: number;
  currentBenefits?: string[];
  desiredBenefits?: string[];
  financialGoals?: string[];
}

export interface FinancialPlanResult {
  salaryAnalysis: SalaryAnalysis;
  negotiationStrategy: NegotiationStrategy;
  budgetPlan: BudgetPlan;
  careerGrowthPlan: CareerGrowthPlan;
}

export interface SalaryAnalysis {
  marketRate: {
    min: number;
    median: number;
    max: number;
  };
  recommendation: string;
  justification: string;
}

export interface NegotiationStrategy {
  openingOffer: number;
  walkAwayPoint: number;
  keyPoints: string[];
  script: string;
}

export interface BudgetPlan {
  monthlySavings: number;
  monthlyExpenses: number;
  breakdown: Record<string, number>;
  recommendations: string[];
}

export interface CareerGrowthPlan {
  milestones: CareerMilestone[];
  recommendations: string[];
}

export interface CareerMilestone {
  title: string;
  timeframe: string;
  expectedSalary: number;
  requiredSkills: string[];
}
