/**
 * Financial Service
 * 
 * This service provides functions for managing financial plans and calculations.
 */

import { 
  FinancialPlanResult, 
  SalaryAnalysis, 
  NegotiationStrategy, 
  BudgetPlan, 
  CareerGrowthPlan,
  CareerMilestone
} from '../types';

/**
 * Format currency for display
 * @param amount Number to format as currency
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format financial plan for display
 * @param plan Financial plan result
 * @returns Formatted financial plan summary
 */
export const formatFinancialPlan = (plan: FinancialPlanResult): string => {
  return `
    Salary Analysis:
    Market Rate: ${formatCurrency(plan.salaryAnalysis.marketRate.min)} - ${formatCurrency(plan.salaryAnalysis.marketRate.max)}
    Recommendation: ${plan.salaryAnalysis.recommendation}
    
    Negotiation Strategy:
    Opening Offer: ${formatCurrency(plan.negotiationStrategy.openingOffer)}
    Walk Away Point: ${formatCurrency(plan.negotiationStrategy.walkAwayPoint)}
    
    Budget Plan:
    Monthly Savings: ${formatCurrency(plan.budgetPlan.monthlySavings)}
    Monthly Expenses: ${formatCurrency(plan.budgetPlan.monthlyExpenses)}
    
    Career Growth Plan:
    ${plan.careerGrowthPlan.milestones.map(formatCareerMilestone).join('\n')}
  `;
};

/**
 * Format salary analysis for display
 * @param analysis Salary analysis
 * @returns Formatted salary analysis
 */
export const formatSalaryAnalysis = (analysis: SalaryAnalysis): string => {
  return `
    Market Rate:
    Minimum: ${formatCurrency(analysis.marketRate.min)}
    Median: ${formatCurrency(analysis.marketRate.median)}
    Maximum: ${formatCurrency(analysis.marketRate.max)}
    
    Recommendation: ${analysis.recommendation}
    
    Justification: ${analysis.justification}
  `;
};

/**
 * Format negotiation strategy for display
 * @param strategy Negotiation strategy
 * @returns Formatted negotiation strategy
 */
export const formatNegotiationStrategy = (strategy: NegotiationStrategy): string => {
  return `
    Opening Offer: ${formatCurrency(strategy.openingOffer)}
    Walk Away Point: ${formatCurrency(strategy.walkAwayPoint)}
    
    Key Points:
    ${strategy.keyPoints.map(point => `- ${point}`).join('\n')}
    
    Script:
    ${strategy.script}
  `;
};

/**
 * Format budget plan for display
 * @param budget Budget plan
 * @returns Formatted budget plan
 */
export const formatBudgetPlan = (budget: BudgetPlan): string => {
  return `
    Monthly Savings: ${formatCurrency(budget.monthlySavings)}
    Monthly Expenses: ${formatCurrency(budget.monthlyExpenses)}
    
    Expense Breakdown:
    ${Object.entries(budget.breakdown)
      .map(([category, amount]) => `${category}: ${formatCurrency(amount)}`)
      .join('\n')}
    
    Recommendations:
    ${budget.recommendations.map(rec => `- ${rec}`).join('\n')}
  `;
};

/**
 * Format career growth plan for display
 * @param plan Career growth plan
 * @returns Formatted career growth plan
 */
export const formatCareerGrowthPlan = (plan: CareerGrowthPlan): string => {
  return `
    Career Milestones:
    ${plan.milestones.map(formatCareerMilestone).join('\n')}
    
    Recommendations:
    ${plan.recommendations.map(rec => `- ${rec}`).join('\n')}
  `;
};

/**
 * Format career milestone for display
 * @param milestone Career milestone
 * @returns Formatted career milestone
 */
export const formatCareerMilestone = (milestone: CareerMilestone): string => {
  return `
    ${milestone.title} (${milestone.timeframe})
    Expected Salary: ${formatCurrency(milestone.expectedSalary)}
    Required Skills: ${milestone.requiredSkills.join(', ')}
  `;
};

/**
 * Calculate monthly take-home pay after taxes
 * @param annualSalary Annual salary
 * @param taxRate Estimated tax rate (default: 0.25)
 * @returns Monthly take-home pay
 */
export const calculateMonthlyTakeHomePay = (annualSalary: number, taxRate: number = 0.25): number => {
  const annualTakeHome = annualSalary * (1 - taxRate);
  return annualTakeHome / 12;
};

/**
 * Calculate recommended budget allocation
 * @param monthlyIncome Monthly income
 * @returns Budget allocation by category
 */
export const calculateBudgetAllocation = (monthlyIncome: number): Record<string, number> => {
  return {
    'Housing': monthlyIncome * 0.3,
    'Transportation': monthlyIncome * 0.15,
    'Food': monthlyIncome * 0.12,
    'Utilities': monthlyIncome * 0.08,
    'Insurance': monthlyIncome * 0.05,
    'Debt Repayment': monthlyIncome * 0.1,
    'Savings': monthlyIncome * 0.15,
    'Entertainment': monthlyIncome * 0.05
  };
};
