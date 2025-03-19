/**
 * Retirement Feature Types
 * 
 * This file contains all types related to retirement planning functionality.
 */

/**
 * User retirement profile
 */
export interface RetirementProfile {
  id: string;
  userId: string;
  currentAge: number;
  targetRetirementAge: number;
  currentSalary: number;
  currentSavings: number;
  monthlySavings: number;
  employerMatch: number;
  employerMatchLimit: number;
  riskTolerance: RiskTolerance;
  investmentAllocations: InvestmentAllocation[];
  retirementAccounts: RetirementAccount[];
  createdAt: string;
  lastUpdated: string;
}

/**
 * Risk tolerance levels
 */
export enum RiskTolerance {
  Conservative = 'conservative',
  ModeratelyConservative = 'moderately_conservative',
  Moderate = 'moderate',
  ModeratelyAggressive = 'moderately_aggressive',
  Aggressive = 'aggressive'
}

/**
 * Investment allocation
 */
export interface InvestmentAllocation {
  id: string;
  assetClass: AssetClass;
  percentage: number;
  expectedReturn: number;
}

/**
 * Asset classes
 */
export enum AssetClass {
  Cash = 'cash',
  Bonds = 'bonds',
  Stocks = 'stocks',
  RealEstate = 'real_estate',
  Commodities = 'commodities',
  Alternatives = 'alternatives'
}

/**
 * Retirement account
 */
export interface RetirementAccount {
  id: string;
  accountType: RetirementAccountType;
  balance: number;
  annualContribution: number;
  employerMatch: number;
  employerMatchLimit: number;
  investmentAllocations: InvestmentAllocation[];
}

/**
 * Retirement account types
 */
export enum RetirementAccountType {
  Traditional401k = 'traditional_401k',
  Roth401k = 'roth_401k',
  TraditionalIRA = 'traditional_ira',
  RothIRA = 'roth_ira',
  FourZeroThreeB = '403b',
  FourFiveSeven = '457',
  Pension = 'pension',
  Brokerage = 'brokerage',
  Other = 'other'
}

/**
 * Retirement projection
 */
export interface RetirementProjection {
  currentAge: number;
  targetRetirementAge: number;
  yearsToRetirement: number;
  currentSavings: number;
  projectedSavings: number;
  projectedAnnualIncome: number;
  projectedMonthlyIncome: number;
  savingsRate: number;
  savingsRateStatus: SavingsRateStatus;
  projectionByYear: YearlyProjection[];
  scenarios: RetirementScenario[];
}

/**
 * Yearly projection
 */
export interface YearlyProjection {
  age: number;
  year: number;
  savings: number;
  contributions: number;
  employerMatch: number;
  returns: number;
  totalSavings: number;
}

/**
 * Savings rate status
 */
export enum SavingsRateStatus {
  Low = 'low',
  BelowTarget = 'below_target',
  OnTarget = 'on_target',
  AboveTarget = 'above_target',
  Excellent = 'excellent'
}

/**
 * Retirement scenario
 */
export interface RetirementScenario {
  id: string;
  name: string;
  description: string;
  targetRetirementAge: number;
  monthlySavings: number;
  employerMatch: number;
  employerMatchLimit: number;
  riskTolerance: RiskTolerance;
  investmentAllocations: InvestmentAllocation[];
  projectedSavings: number;
  projectedAnnualIncome: number;
  projectedMonthlyIncome: number;
}

/**
 * Retirement incentive
 */
export interface RetirementIncentive {
  id: string;
  name: string;
  description: string;
  type: IncentiveType;
  amount: number;
  frequency: IncentiveFrequency;
  startDate: string;
  endDate: string | null;
  conditions: string[];
  isActive: boolean;
}

/**
 * Incentive types
 */
export enum IncentiveType {
  EmployerMatch = 'employer_match',
  EmployerContribution = 'employer_contribution',
  CatchUpContribution = 'catch_up_contribution',
  TaxCredit = 'tax_credit',
  TaxDeduction = 'tax_deduction',
  Other = 'other'
}

/**
 * Incentive frequency
 */
export enum IncentiveFrequency {
  OneTime = 'one_time',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Annual = 'annual'
}

/**
 * Retirement calculator parameters
 */
export interface RetirementCalculatorParams {
  currentAge: number;
  targetRetirementAge: number;
  currentSalary: number;
  salaryGrowthRate: number;
  currentSavings: number;
  monthlySavings: number;
  employerMatch: number;
  employerMatchLimit: number;
  expectedReturnRate: number;
  inflationRate: number;
  retirementDuration: number;
  withdrawalRate: number;
}

/**
 * Retirement calculator result
 */
export interface RetirementCalculatorResult {
  projectedSavings: number;
  projectedAnnualIncome: number;
  projectedMonthlyIncome: number;
  savingsRate: number;
  savingsRateStatus: SavingsRateStatus;
  projectionByYear: YearlyProjection[];
  retirementReadiness: RetirementReadiness;
  recommendations: RetirementRecommendation[];
}

/**
 * Retirement readiness
 */
export interface RetirementReadiness {
  score: number;
  status: RetirementReadinessStatus;
  details: {
    savingsRate: number;
    savingsRateScore: number;
    diversification: number;
    diversificationScore: number;
    incomeReplacement: number;
    incomeReplacementScore: number;
    retirementAge: number;
    retirementAgeScore: number;
  };
}

/**
 * Retirement readiness status
 */
export enum RetirementReadinessStatus {
  Critical = 'critical',
  AtRisk = 'at_risk',
  OnTrack = 'on_track',
  Good = 'good',
  Excellent = 'excellent'
}

/**
 * Retirement recommendation
 */
export interface RetirementRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  impact: RecommendationImpact;
  actionItems: string[];
}

/**
 * Recommendation types
 */
export enum RecommendationType {
  IncreaseSavings = 'increase_savings',
  AdjustAllocation = 'adjust_allocation',
  IncreaseEmployerMatch = 'increase_employer_match',
  DelayRetirement = 'delay_retirement',
  ReduceExpenses = 'reduce_expenses',
  TaxStrategy = 'tax_strategy',
  SocialSecurity = 'social_security',
  Other = 'other'
}

/**
 * Recommendation impact
 */
export enum RecommendationImpact {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

/**
 * Onboarding form data
 */
export interface RetirementOnboardingData {
  currentAge: number;
  targetRetirementAge: number;
  currentSalary: number;
  currentSavings: number;
  monthlySavings: number;
  employerMatch: number;
  employerMatchLimit: number;
  riskTolerance: RiskTolerance;
  hasRetirementAccounts: boolean;
  retirementAccounts: {
    accountType: RetirementAccountType;
    balance: number;
    annualContribution: number;
  }[];
}
