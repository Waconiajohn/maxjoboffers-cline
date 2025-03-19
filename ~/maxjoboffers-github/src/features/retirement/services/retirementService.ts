import { v4 as uuidv4 } from 'uuid';
import {
  RetirementProfile,
  RetirementAccount,
  RetirementAccountType,
  RiskTolerance,
  InvestmentAllocation,
  AssetClass,
  RetirementProjection,
  YearlyProjection,
  SavingsRateStatus,
  RetirementScenario,
  RetirementCalculatorParams,
  RetirementCalculatorResult,
  RetirementReadiness,
  RetirementReadinessStatus,
  RetirementRecommendation,
  RecommendationType,
  RecommendationImpact,
  RetirementIncentive,
  IncentiveType,
  IncentiveFrequency,
  RetirementOnboardingData
} from '../types';

/**
 * Service for handling retirement planning functionality
 */
class RetirementService {
  private profiles: RetirementProfile[] = [];
  private incentives: RetirementIncentive[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Get a user's retirement profile
   */
  async getProfile(userId: string): Promise<RetirementProfile | null> {
    const profile = this.profiles.find(p => p.userId === userId);
    return profile || null;
  }

  /**
   * Create a new retirement profile
   */
  async createProfile(
    userId: string,
    onboardingData: RetirementOnboardingData
  ): Promise<RetirementProfile> {
    const now = new Date().toISOString();
    
    // Create investment allocations based on risk tolerance
    const investmentAllocations = this.getDefaultAllocations(onboardingData.riskTolerance);
    
    // Create retirement accounts
    const retirementAccounts: RetirementAccount[] = onboardingData.hasRetirementAccounts
      ? onboardingData.retirementAccounts.map(account => ({
          id: uuidv4(),
          accountType: account.accountType,
          balance: account.balance,
          annualContribution: account.annualContribution,
          employerMatch: onboardingData.employerMatch,
          employerMatchLimit: onboardingData.employerMatchLimit,
          investmentAllocations: [...investmentAllocations]
        }))
      : [];
    
    const newProfile: RetirementProfile = {
      id: uuidv4(),
      userId,
      currentAge: onboardingData.currentAge,
      targetRetirementAge: onboardingData.targetRetirementAge,
      currentSalary: onboardingData.currentSalary,
      currentSavings: onboardingData.currentSavings,
      monthlySavings: onboardingData.monthlySavings,
      employerMatch: onboardingData.employerMatch,
      employerMatchLimit: onboardingData.employerMatchLimit,
      riskTolerance: onboardingData.riskTolerance,
      investmentAllocations,
      retirementAccounts,
      createdAt: now,
      lastUpdated: now
    };

    this.profiles.push(newProfile);
    return newProfile;
  }

  /**
   * Update a retirement profile
   */
  async updateProfile(
    profileId: string,
    updates: Partial<Omit<RetirementProfile, 'id' | 'userId' | 'createdAt'>>
  ): Promise<RetirementProfile | null> {
    const profileIndex = this.profiles.findIndex(p => p.id === profileId);
    if (profileIndex === -1) return null;

    this.profiles[profileIndex] = {
      ...this.profiles[profileIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    return this.profiles[profileIndex];
  }

  /**
   * Add a retirement account to a profile
   */
  async addRetirementAccount(
    profileId: string,
    accountType: RetirementAccountType,
    balance: number,
    annualContribution: number
  ): Promise<RetirementProfile | null> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return null;

    const newAccount: RetirementAccount = {
      id: uuidv4(),
      accountType,
      balance,
      annualContribution,
      employerMatch: profile.employerMatch,
      employerMatchLimit: profile.employerMatchLimit,
      investmentAllocations: [...profile.investmentAllocations]
    };

    profile.retirementAccounts.push(newAccount);
    profile.lastUpdated = new Date().toISOString();

    return profile;
  }

  /**
   * Update a retirement account
   */
  async updateRetirementAccount(
    profileId: string,
    accountId: string,
    updates: Partial<Omit<RetirementAccount, 'id'>>
  ): Promise<RetirementProfile | null> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return null;

    const accountIndex = profile.retirementAccounts.findIndex(a => a.id === accountId);
    if (accountIndex === -1) return null;

    profile.retirementAccounts[accountIndex] = {
      ...profile.retirementAccounts[accountIndex],
      ...updates
    };

    profile.lastUpdated = new Date().toISOString();

    return profile;
  }

  /**
   * Remove a retirement account
   */
  async removeRetirementAccount(
    profileId: string,
    accountId: string
  ): Promise<RetirementProfile | null> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return null;

    profile.retirementAccounts = profile.retirementAccounts.filter(a => a.id !== accountId);
    profile.lastUpdated = new Date().toISOString();

    return profile;
  }

  /**
   * Update investment allocations
   */
  async updateInvestmentAllocations(
    profileId: string,
    allocations: Omit<InvestmentAllocation, 'id'>[]
  ): Promise<RetirementProfile | null> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return null;

    // Validate that percentages add up to 100%
    const totalPercentage = allocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error('Investment allocations must add up to 100%');
    }

    profile.investmentAllocations = allocations.map(allocation => ({
      id: uuidv4(),
      ...allocation
    }));

    profile.lastUpdated = new Date().toISOString();

    return profile;
  }

  /**
   * Generate retirement projection
   */
  async generateProjection(profileId: string): Promise<RetirementProjection | null> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return null;

    // Calculate projection
    const yearsToRetirement = profile.targetRetirementAge - profile.currentAge;
    const projectionByYear: YearlyProjection[] = [];
    
    let totalSavings = profile.currentSavings;
    const currentYear = new Date().getFullYear();
    
    // Calculate average expected return based on investment allocations
    const averageExpectedReturn = profile.investmentAllocations.reduce(
      (sum, allocation) => sum + (allocation.percentage / 100) * allocation.expectedReturn,
      0
    );
    
    // Calculate annual savings (monthly savings * 12)
    const annualSavings = profile.monthlySavings * 12;
    
    // Calculate annual employer match
    const annualEmployerMatch = Math.min(
      annualSavings * (profile.employerMatch / 100),
      profile.currentSalary * (profile.employerMatchLimit / 100)
    );
    
    // Generate yearly projections
    for (let i = 0; i <= yearsToRetirement; i++) {
      const age = profile.currentAge + i;
      const year = currentYear + i;
      
      const returns = totalSavings * (averageExpectedReturn / 100);
      const contributions = i === 0 ? 0 : annualSavings;
      const employerMatch = i === 0 ? 0 : annualEmployerMatch;
      
      totalSavings += returns + contributions + employerMatch;
      
      projectionByYear.push({
        age,
        year,
        savings: totalSavings,
        contributions,
        employerMatch,
        returns,
        totalSavings
      });
    }
    
    // Calculate projected annual income (using 4% withdrawal rule)
    const projectedSavings = totalSavings;
    const projectedAnnualIncome = projectedSavings * 0.04;
    const projectedMonthlyIncome = projectedAnnualIncome / 12;
    
    // Calculate savings rate
    const savingsRate = (annualSavings / profile.currentSalary) * 100;
    
    // Determine savings rate status
    let savingsRateStatus: SavingsRateStatus;
    if (savingsRate < 5) {
      savingsRateStatus = SavingsRateStatus.Low;
    } else if (savingsRate < 10) {
      savingsRateStatus = SavingsRateStatus.BelowTarget;
    } else if (savingsRate < 15) {
      savingsRateStatus = SavingsRateStatus.OnTarget;
    } else if (savingsRate < 20) {
      savingsRateStatus = SavingsRateStatus.AboveTarget;
    } else {
      savingsRateStatus = SavingsRateStatus.Excellent;
    }
    
    // Generate alternative scenarios
    const scenarios: RetirementScenario[] = [
      // Scenario 1: Increase savings rate by 5%
      this.generateScenario(
        'Increase Savings',
        'Increase monthly savings by 5% of your salary',
        profile.targetRetirementAge,
        profile.monthlySavings + (profile.currentSalary * 0.05) / 12,
        profile.employerMatch,
        profile.employerMatchLimit,
        profile.riskTolerance,
        profile.investmentAllocations
      ),
      
      // Scenario 2: Delay retirement by 2 years
      this.generateScenario(
        'Delay Retirement',
        'Delay retirement by 2 years',
        profile.targetRetirementAge + 2,
        profile.monthlySavings,
        profile.employerMatch,
        profile.employerMatchLimit,
        profile.riskTolerance,
        profile.investmentAllocations
      ),
      
      // Scenario 3: More aggressive investment strategy
      this.generateScenario(
        'More Aggressive Investments',
        'Adopt a more aggressive investment strategy',
        profile.targetRetirementAge,
        profile.monthlySavings,
        profile.employerMatch,
        profile.employerMatchLimit,
        RiskTolerance.Aggressive,
        this.getDefaultAllocations(RiskTolerance.Aggressive)
      )
    ];
    
    return {
      currentAge: profile.currentAge,
      targetRetirementAge: profile.targetRetirementAge,
      yearsToRetirement,
      currentSavings: profile.currentSavings,
      projectedSavings,
      projectedAnnualIncome,
      projectedMonthlyIncome,
      savingsRate,
      savingsRateStatus,
      projectionByYear,
      scenarios
    };
  }

  /**
   * Calculate retirement readiness
   */
  async calculateRetirementReadiness(profileId: string): Promise<RetirementReadiness | null> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return null;
    
    const projection = await this.generateProjection(profileId);
    if (!projection) return null;
    
    // Calculate savings rate score (0-25)
    const savingsRateScore = Math.min(25, projection.savingsRate * 1.25);
    
    // Calculate diversification score (0-25)
    const diversification = this.calculateDiversificationScore(profile.investmentAllocations);
    const diversificationScore = diversification * 25;
    
    // Calculate income replacement score (0-25)
    // Assuming target income replacement is 80% of current salary
    const targetAnnualIncome = profile.currentSalary * 0.8;
    const incomeReplacement = Math.min(1, projection.projectedAnnualIncome / targetAnnualIncome);
    const incomeReplacementScore = incomeReplacement * 25;
    
    // Calculate retirement age score (0-25)
    // Assuming ideal retirement age is 65
    const idealRetirementAge = 65;
    const retirementAgeScore = profile.targetRetirementAge <= idealRetirementAge
      ? 25
      : Math.max(0, 25 - (profile.targetRetirementAge - idealRetirementAge) * 2);
    
    // Calculate overall score
    const score = savingsRateScore + diversificationScore + incomeReplacementScore + retirementAgeScore;
    
    // Determine status
    let status: RetirementReadinessStatus;
    if (score < 40) {
      status = RetirementReadinessStatus.Critical;
    } else if (score < 60) {
      status = RetirementReadinessStatus.AtRisk;
    } else if (score < 75) {
      status = RetirementReadinessStatus.OnTrack;
    } else if (score < 90) {
      status = RetirementReadinessStatus.Good;
    } else {
      status = RetirementReadinessStatus.Excellent;
    }
    
    return {
      score,
      status,
      details: {
        savingsRate: projection.savingsRate,
        savingsRateScore,
        diversification,
        diversificationScore,
        incomeReplacement,
        incomeReplacementScore,
        retirementAge: profile.targetRetirementAge,
        retirementAgeScore
      }
    };
  }

  /**
   * Generate retirement recommendations
   */
  async generateRecommendations(profileId: string): Promise<RetirementRecommendation[]> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return [];
    
    const projection = await this.generateProjection(profileId);
    if (!projection) return [];
    
    const readiness = await this.calculateRetirementReadiness(profileId);
    if (!readiness) return [];
    
    const recommendations: RetirementRecommendation[] = [];
    
    // Recommendation 1: Increase savings if savings rate is low
    if (projection.savingsRate < 15) {
      const targetSavingsRate = 15;
      const currentSavingsRate = projection.savingsRate;
      const additionalSavingsRate = targetSavingsRate - currentSavingsRate;
      const additionalMonthlySavings = (profile.currentSalary * additionalSavingsRate) / 100 / 12;
      
      recommendations.push({
        id: uuidv4(),
        type: RecommendationType.IncreaseSavings,
        title: 'Increase Your Retirement Savings',
        description: `Your current savings rate of ${currentSavingsRate.toFixed(1)}% is below the recommended 15%. Consider increasing your monthly contributions.`,
        impact: RecommendationImpact.High,
        actionItems: [
          `Increase your monthly retirement contributions by $${additionalMonthlySavings.toFixed(0)} to reach a 15% savings rate.`,
          'Set up automatic transfers to your retirement accounts.',
          'Review your budget to identify areas where you can reduce expenses.'
        ]
      });
    }
    
    // Recommendation 2: Adjust asset allocation if diversification is low
    if (readiness.details.diversification < 0.7) {
      recommendations.push({
        id: uuidv4(),
        type: RecommendationType.AdjustAllocation,
        title: 'Diversify Your Investment Portfolio',
        description: 'Your current investment allocation could benefit from better diversification across asset classes.',
        impact: RecommendationImpact.Medium,
        actionItems: [
          'Review your current investment allocation.',
          'Consider adding exposure to different asset classes.',
          'Consult with a financial advisor to develop a more balanced portfolio strategy.'
        ]
      });
    }
    
    // Recommendation 3: Maximize employer match if not already doing so
    if (profile.monthlySavings * 12 < profile.currentSalary * (profile.employerMatchLimit / 100)) {
      const matchLimit = profile.currentSalary * (profile.employerMatchLimit / 100);
      const currentContribution = profile.monthlySavings * 12;
      const additionalContribution = matchLimit - currentContribution;
      const additionalMonthlyContribution = additionalContribution / 12;
      
      recommendations.push({
        id: uuidv4(),
        type: RecommendationType.IncreaseEmployerMatch,
        title: 'Maximize Your Employer Match',
        description: `You're not taking full advantage of your employer's matching contribution. This is essentially leaving free money on the table.`,
        impact: RecommendationImpact.High,
        actionItems: [
          `Increase your monthly contributions by $${additionalMonthlyContribution.toFixed(0)} to maximize your employer match.`,
          'Contact your HR department to ensure you understand all available retirement benefits.',
          'Adjust your payroll deductions to capture the full match amount.'
        ]
      });
    }
    
    // Recommendation 4: Consider delaying retirement if projected income is low
    const targetAnnualIncome = profile.currentSalary * 0.8;
    if (projection.projectedAnnualIncome < targetAnnualIncome) {
      recommendations.push({
        id: uuidv4(),
        type: RecommendationType.DelayRetirement,
        title: 'Consider Delaying Retirement',
        description: 'Your projected retirement income may not provide the lifestyle you desire. Delaying retirement can significantly increase your retirement savings.',
        impact: RecommendationImpact.High,
        actionItems: [
          'Consider working 2-3 years longer than your current target retirement age.',
          'Explore part-time work options during early retirement years.',
          'Develop skills that could allow for consulting or freelance work in retirement.'
        ]
      });
    }
    
    // Recommendation 5: Tax strategy
    recommendations.push({
      id: uuidv4(),
      type: RecommendationType.TaxStrategy,
      title: 'Optimize Your Tax Strategy',
      description: 'Strategic tax planning can significantly impact your retirement savings growth and withdrawal efficiency.',
      impact: RecommendationImpact.Medium,
      actionItems: [
        'Consider diversifying between traditional and Roth retirement accounts.',
        'Explore tax-loss harvesting opportunities in taxable investment accounts.',
        'Consult with a tax professional to develop a tax-efficient withdrawal strategy for retirement.'
      ]
    });
    
    return recommendations;
  }

  /**
   * Calculate retirement using custom parameters
   */
  async calculateRetirement(
    params: RetirementCalculatorParams
  ): Promise<RetirementCalculatorResult> {
    // Calculate projection
    const yearsToRetirement = params.targetRetirementAge - params.currentAge;
    const projectionByYear: YearlyProjection[] = [];
    
    let totalSavings = params.currentSavings;
    let currentSalary = params.currentSalary;
    const currentYear = new Date().getFullYear();
    
    // Generate yearly projections
    for (let i = 0; i <= yearsToRetirement; i++) {
      const age = params.currentAge + i;
      const year = currentYear + i;
      
      // Increase salary by growth rate each year
      if (i > 0) {
        currentSalary *= (1 + params.salaryGrowthRate / 100);
      }
      
      // Calculate annual savings and employer match
      const annualSavings = params.monthlySavings * 12;
      const annualEmployerMatch = Math.min(
        annualSavings * (params.employerMatch / 100),
        currentSalary * (params.employerMatchLimit / 100)
      );
      
      const returns = totalSavings * (params.expectedReturnRate / 100);
      const contributions = i === 0 ? 0 : annualSavings;
      const employerMatch = i === 0 ? 0 : annualEmployerMatch;
      
      totalSavings += returns + contributions + employerMatch;
      
      projectionByYear.push({
        age,
        year,
        savings: totalSavings,
        contributions,
        employerMatch,
        returns,
        totalSavings
      });
    }
    
    // Calculate projected annual income
    const projectedSavings = totalSavings;
    const projectedAnnualIncome = projectedSavings * (params.withdrawalRate / 100);
    const projectedMonthlyIncome = projectedAnnualIncome / 12;
    
    // Calculate savings rate
    const savingsRate = (params.monthlySavings * 12 / params.currentSalary) * 100;
    
    // Determine savings rate status
    let savingsRateStatus: SavingsRateStatus;
    if (savingsRate < 5) {
      savingsRateStatus = SavingsRateStatus.Low;
    } else if (savingsRate < 10) {
      savingsRateStatus = SavingsRateStatus.BelowTarget;
    } else if (savingsRate < 15) {
      savingsRateStatus = SavingsRateStatus.OnTarget;
    } else if (savingsRate < 20) {
      savingsRateStatus = SavingsRateStatus.AboveTarget;
    } else {
      savingsRateStatus = SavingsRateStatus.Excellent;
    }
    
    // Calculate retirement readiness
    const targetAnnualIncome = params.currentSalary * 0.8;
    const incomeReplacement = Math.min(1, projectedAnnualIncome / targetAnnualIncome);
    const incomeReplacementScore = incomeReplacement * 25;
    
    const savingsRateScore = Math.min(25, savingsRate * 1.25);
    
    const diversificationScore = 20; // Assuming moderate diversification
    
    const idealRetirementAge = 65;
    const retirementAgeScore = params.targetRetirementAge <= idealRetirementAge
      ? 25
      : Math.max(0, 25 - (params.targetRetirementAge - idealRetirementAge) * 2);
    
    const score = savingsRateScore + diversificationScore + incomeReplacementScore + retirementAgeScore;
    
    let status: RetirementReadinessStatus;
    if (score < 40) {
      status = RetirementReadinessStatus.Critical;
    } else if (score < 60) {
      status = RetirementReadinessStatus.AtRisk;
    } else if (score < 75) {
      status = RetirementReadinessStatus.OnTrack;
    } else if (score < 90) {
      status = RetirementReadinessStatus.Good;
    } else {
      status = RetirementReadinessStatus.Excellent;
    }
    
    const retirementReadiness: RetirementReadiness = {
      score,
      status,
      details: {
        savingsRate,
        savingsRateScore,
        diversification: 0.8, // Assuming moderate diversification
        diversificationScore,
        incomeReplacement,
        incomeReplacementScore,
        retirementAge: params.targetRetirementAge,
        retirementAgeScore
      }
    };
    
    // Generate recommendations
    const recommendations: RetirementRecommendation[] = [];
    
    // Recommendation 1: Increase savings if savings rate is low
    if (savingsRate < 15) {
      const targetSavingsRate = 15;
      const additionalSavingsRate = targetSavingsRate - savingsRate;
      const additionalMonthlySavings = (params.currentSalary * additionalSavingsRate) / 100 / 12;
      
      recommendations.push({
        id: uuidv4(),
        type: RecommendationType.IncreaseSavings,
        title: 'Increase Your Retirement Savings',
        description: `Your current savings rate of ${savingsRate.toFixed(1)}% is below the recommended 15%. Consider increasing your monthly contributions.`,
        impact: RecommendationImpact.High,
        actionItems: [
          `Increase your monthly retirement contributions by $${additionalMonthlySavings.toFixed(0)} to reach a 15% savings rate.`,
          'Set up automatic transfers to your retirement accounts.',
          'Review your budget to identify areas where you can reduce expenses.'
        ]
      });
    }
    
    // Recommendation 2: Consider delaying retirement if projected income is low
    if (projectedAnnualIncome < targetAnnualIncome) {
      recommendations.push({
        id: uuidv4(),
        type: RecommendationType.DelayRetirement,
        title: 'Consider Delaying Retirement',
        description: 'Your projected retirement income may not provide the lifestyle you desire. Delaying retirement can significantly increase your retirement savings.',
        impact: RecommendationImpact.High,
        actionItems: [
          'Consider working 2-3 years longer than your current target retirement age.',
          'Explore part-time work options during early retirement years.',
          'Develop skills that could allow for consulting or freelance work in retirement.'
        ]
      });
    }
    
    return {
      projectedSavings,
      projectedAnnualIncome,
      projectedMonthlyIncome,
      savingsRate,
      savingsRateStatus,
      projectionByYear,
      retirementReadiness,
      recommendations
    };
  }

  /**
   * Get retirement incentives
   */
  async getIncentives(): Promise<RetirementIncentive[]> {
    return this.incentives;
  }

  /**
   * Get a retirement incentive by ID
   */
  async getIncentiveById(id: string): Promise<RetirementIncentive | null> {
    const incentive = this.incentives.find(i => i.id === id);
    return incentive || null;
  }

  /**
   * Create a retirement incentive
   */
  async createIncentive(
    name: string,
    description: string,
    type: IncentiveType,
    amount: number,
    frequency: IncentiveFrequency,
    startDate: string,
    endDate: string | null,
    conditions: string[]
  ): Promise<RetirementIncentive> {
    const newIncentive: RetirementIncentive = {
      id: uuidv4(),
      name,
      description,
      type,
      amount,
      frequency,
      startDate,
      endDate,
      conditions,
      isActive: true
    };

    this.incentives.push(newIncentive);
    return newIncentive;
  }

  /**
   * Update a retirement incentive
   */
  async updateIncentive(
    id: string,
    updates: Partial<Omit<RetirementIncentive, 'id'>>
  ): Promise<RetirementIncentive | null> {
    const incentiveIndex = this.incentives.findIndex(i => i.id === id);
    if (incentiveIndex === -1) return null;

    this.incentives[incentiveIndex] = {
      ...this.incentives[incentiveIndex],
      ...updates
    };

    return this.incentives[incentiveIndex];
  }

  /**
   * Delete a retirement incentive
   */
  async deleteIncentive(id: string): Promise<boolean> {
    const initialLength = this.incentives.length;
    this.incentives = this.incentives.filter(i => i.id !== id);
    return initialLength > this.incentives.length;
  }

  /**
   * Get default investment allocations based on risk tolerance
   */
  private getDefaultAllocations(riskTolerance: RiskTolerance): InvestmentAllocation[] {
    switch (riskTolerance) {
      case RiskTolerance.Conservative:
        return [
          {
            id: uuidv4(),
            assetClass: AssetClass.Cash,
            percentage: 10,
            expectedReturn: 1.5
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.Bonds,
            percentage: 60,
            expectedReturn: 3.0
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.Stocks,
            percentage: 30,
            expectedReturn: 7.0
          }
        ];
      
      case RiskTolerance.ModeratelyConservative:
        return [
          {
            id: uuidv4(),
            assetClass: AssetClass.Cash,
            percentage: 5,
            expectedReturn: 1.5
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.Bonds,
            percentage: 45,
            expectedReturn: 3.0
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.Stocks,
            percentage: 45,
            expectedReturn: 7.0
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.RealEstate,
            percentage: 5,
            expectedReturn: 5.0
          }
        ];
      
      case RiskTolerance.Moderate:
        return [
          {
            id: uuidv4(),
            assetClass: AssetClass.Cash,
            percentage: 5,
            expectedReturn: 1.5
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.Bonds,
            percentage: 35,
            expectedReturn: 3.0
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.Stocks,
            percentage: 50,
            expectedReturn: 7.0
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.RealEstate,
            percentage: 10,
            expectedReturn: 5.0
          }
        ];
      
      case RiskTolerance.ModeratelyAggressive:
        return [
          {
            id: uuidv4(),
            assetClass: AssetClass.Cash,
            percentage: 5,
            expectedReturn: 1.5
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.Bonds,
            percentage: 20,
            expectedReturn: 3.0
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.Stocks,
            percentage: 65,
            expectedReturn: 7.0
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.RealEstate,
            percentage: 10,
            expectedReturn: 5.0
          }
        ];
      
      case RiskTolerance.Aggressive:
        return [
          {
            id: uuidv4(),
            assetClass: AssetClass.Cash,
            percentage: 5,
            expectedReturn: 1.5
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.Bonds,
            percentage: 10,
            expectedReturn: 3.0
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.Stocks,
            percentage: 75,
            expectedReturn: 8.0
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.RealEstate,
            percentage: 5,
            expectedReturn: 5.0
          },
          {
            id: uuidv4(),
            assetClass: AssetClass.Alternatives,
            percentage: 5,
            expectedReturn: 10.0
          }
        ];
      
      default:
        return this.getDefaultAllocations(RiskTolerance.Moderate);
    }
  }

  /**
   * Calculate diversification score (0-1)
   */
  private calculateDiversificationScore(allocations: InvestmentAllocation[]): number {
    // Count number of asset classes with significant allocation (>5%)
    const significantAssetClasses = allocations.filter(a => a.percentage > 5).length;
    
    // Calculate concentration (higher is worse)
    const concentration = allocations.reduce((max, allocation) => 
      Math.max(max, allocation.percentage), 0);
    
    // Calculate diversification score (0-1)
    const assetClassScore = Math.min(1, significantAssetClasses / 4);
    const concentrationScore = 1 - (concentration - 25) / 75;
    
    return (assetClassScore + concentrationScore) / 2;
  }

  /**
   * Generate a retirement scenario
   */
  private generateScenario(
    name: string,
    description: string,
    targetRetirementAge: number,
    monthlySavings: number,
    employerMatch: number,
    employerMatchLimit: number,
    riskTolerance: RiskTolerance,
    investmentAllocations: InvestmentAllocation[]
  ): RetirementScenario {
    // Calculate average expected return based on investment allocations
    const averageExpectedReturn = investmentAllocations.reduce(
      (sum, allocation) => sum + (allocation.percentage / 100) * allocation.expectedReturn,
      0
    );
    
    // Assume current age is 35, current savings is $100,000, and current salary is $75,000
    const currentAge = 35;
    const currentSavings = 100000;
    const currentSalary = 75000;
    
    // Calculate years to retirement
    const yearsToRetirement = targetRetirementAge - currentAge;
    
    // Calculate annual savings and employer match
    const annualSavings = monthlySavings * 12;
    const annualEmployerMatch = Math.min(
      annualSavings * (employerMatch / 100),
      currentSalary * (employerMatchLimit / 100)
    );
    
    // Calculate projected savings
    let totalSavings = currentSavings;
    for (let i = 1; i <= yearsToRetirement; i++) {
      const returns = totalSavings * (averageExpectedReturn / 100);
      totalSavings += returns + annualSavings + annualEmployerMatch;
    }
    
    // Calculate projected income (using 4% withdrawal rule)
    const projectedSavings = totalSavings;
    const projectedAnnualIncome = projectedSavings * 0.04;
    const projectedMonthlyIncome = projectedAnnualIncome / 12;
    
    return {
      id: uuidv4(),
      name,
      description,
      targetRetirementAge,
      monthlySavings,
      employerMatch,
      employerMatchLimit,
      riskTolerance,
      investmentAllocations,
      projectedSavings,
      projectedAnnualIncome,
      projectedMonthlyIncome
    };
  }

  /**
   * Initialize mock data for development and testing
   */
  private initializeMockData() {
    // Mock profiles
    this.profiles = [
      {
        id: uuidv4(),
        userId: 'user-1',
        currentAge: 35,
        targetRetirementAge: 65,
        currentSalary: 75000,
        currentSavings: 100000,
        monthlySavings: 1000,
        employerMatch: 50,
        employerMatchLimit: 6,
        riskTolerance: RiskTolerance.Moderate,
        investmentAllocations: this.getDefaultAllocations(RiskTolerance.Moderate),
        retirementAccounts: [
          {
            id: uuidv4(),
            accountType: RetirementAccountType.Traditional401k,
            balance: 80000,
            annualContribution: 10000,
            employerMatch: 50,
            employerMatchLimit: 6,
            investmentAllocations: this.getDefaultAllocations(RiskTolerance.Moderate)
          },
          {
            id: uuidv4(),
            accountType: RetirementAccountType.RothIRA,
            balance: 20000,
            annualContribution: 2000,
            employerMatch: 0,
            employerMatchLimit: 0,
            investmentAllocations: this.getDefaultAllocations(RiskTolerance.ModeratelyAggressive)
          }
        ],
        createdAt: '2025-01-15T00:00:00Z',
        lastUpdated: '2025-01-15T00:00:00Z'
      }
    ];

    // Mock incentives
    this.incentives = [
      {
        id: uuidv4(),
        name: 'Employer 401(k) Match',
        description: 'Your employer matches 50% of your contributions up to 6% of your salary.',
        type: IncentiveType.EmployerMatch,
        amount: 50,
        frequency: IncentiveFrequency.Annual,
        startDate: '2025-01-01T00:00:00Z',
        endDate: null,
        conditions: [
          'Must be employed for at least 3 months',
          'Maximum match is 6% of salary'
        ],
        isActive: true
      },
      {
        id: uuidv4(),
        name: 'Catch-Up Contributions',
        description: 'Additional contributions allowed for employees age 50 or older.',
        type: IncentiveType.CatchUpContribution,
        amount: 7500,
        frequency: IncentiveFrequency.Annual,
        startDate: '2025-01-01T00:00:00Z',
        endDate: null,
        conditions: [
          'Must be age 50 or older',
          'Available for 401(k), 403(b), and IRA accounts'
        ],
        isActive: true
      }
    ];
  }
}

export const retirementService = new RetirementService();
