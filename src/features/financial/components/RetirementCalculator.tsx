import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../services/financialService';

interface RetirementCalculatorProps {
  initialValues?: RetirementCalculatorInputs;
}

interface RetirementCalculatorInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  annualContribution: number;
  expectedReturnRate: number;
  inflationRate: number;
  withdrawalRate: number;
  socialSecurityBenefit: number;
}

interface RetirementCalculatorResults {
  totalSavingsAtRetirement: number;
  monthlyIncomeInRetirement: number;
  savingsDepletion: number;
  savingsByYear: Array<{ age: number; savings: number }>;
  withdrawalsByYear: Array<{ age: number; withdrawal: number }>;
  isSuccessful: boolean;
  shortfall: number;
  surplusYears: number;
}

const RetirementCalculator: React.FC<RetirementCalculatorProps> = ({ initialValues }) => {
  const [inputs, setInputs] = useState<RetirementCalculatorInputs>({
    currentAge: initialValues?.currentAge || 30,
    retirementAge: initialValues?.retirementAge || 65,
    lifeExpectancy: initialValues?.lifeExpectancy || 90,
    currentSavings: initialValues?.currentSavings || 50000,
    annualContribution: initialValues?.annualContribution || 6000,
    expectedReturnRate: initialValues?.expectedReturnRate || 7,
    inflationRate: initialValues?.inflationRate || 2.5,
    withdrawalRate: initialValues?.withdrawalRate || 4,
    socialSecurityBenefit: initialValues?.socialSecurityBenefit || 1500,
  });

  const [results, setResults] = useState<RetirementCalculatorResults | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    calculateRetirement();
  }, [inputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: parseFloat(value) || 0,
    });
  };

  const calculateRetirement = () => {
    const {
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentSavings,
      annualContribution,
      expectedReturnRate,
      inflationRate,
      withdrawalRate,
      socialSecurityBenefit,
    } = inputs;

    // Convert percentages to decimals
    const returnRate = expectedReturnRate / 100;
    const inflation = inflationRate / 100;
    const withdrawal = withdrawalRate / 100;

    // Calculate real rate of return (adjusted for inflation)
    const realReturnRate = (1 + returnRate) / (1 + inflation) - 1;

    // Calculate savings growth until retirement
    let savings = currentSavings;
    const savingsByYear: Array<{ age: number; savings: number }> = [];
    
    for (let age = currentAge; age < retirementAge; age++) {
      savingsByYear.push({ age, savings });
      savings = savings * (1 + returnRate) + annualContribution;
    }

    const totalSavingsAtRetirement = savings;
    savingsByYear.push({ age: retirementAge, savings: totalSavingsAtRetirement });

    // Calculate withdrawals during retirement
    const withdrawalsByYear: Array<{ age: number; withdrawal: number }> = [];
    let currentSavingsInRetirement = totalSavingsAtRetirement;
    let savingsDepletionAge = retirementAge;
    
    // Initial annual withdrawal amount (adjusted for inflation each year)
    const initialAnnualWithdrawal = totalSavingsAtRetirement * withdrawal;
    
    // Monthly income in retirement (including Social Security)
    const monthlyIncomeInRetirement = (initialAnnualWithdrawal / 12) + socialSecurityBenefit;

    for (let age = retirementAge; age <= lifeExpectancy; age++) {
      // Calculate withdrawal for this year
      const yearsSinceRetirement = age - retirementAge;
      const inflationFactor = Math.pow(1 + inflation, yearsSinceRetirement);
      const annualWithdrawal = initialAnnualWithdrawal * inflationFactor;
      
      // Adjust for Social Security (monthly benefit * 12 months)
      const annualSocialSecurity = socialSecurityBenefit * 12 * inflationFactor;
      const netWithdrawal = Math.max(0, annualWithdrawal - annualSocialSecurity);
      
      withdrawalsByYear.push({ age, withdrawal: netWithdrawal });
      
      // Update savings
      currentSavingsInRetirement = Math.max(0, currentSavingsInRetirement * (1 + realReturnRate) - netWithdrawal);
      savingsByYear.push({ age: age + 1, savings: currentSavingsInRetirement });
      
      // Check if savings are depleted
      if (currentSavingsInRetirement <= 0 && savingsDepletionAge === retirementAge) {
        savingsDepletionAge = age;
      }
    }

    // Determine if retirement plan is successful
    const isSuccessful = savingsDepletionAge >= lifeExpectancy;
    const shortfall = isSuccessful ? 0 : (lifeExpectancy - savingsDepletionAge) * initialAnnualWithdrawal;
    const surplusYears = isSuccessful ? savingsDepletionAge - lifeExpectancy : 0;

    setResults({
      totalSavingsAtRetirement,
      monthlyIncomeInRetirement,
      savingsDepletion: savingsDepletionAge,
      savingsByYear,
      withdrawalsByYear,
      isSuccessful,
      shortfall,
      surplusYears,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Retirement Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Your Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="currentAge">
                Current Age
              </label>
              <input
                id="currentAge"
                name="currentAge"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={inputs.currentAge}
                onChange={handleInputChange}
                min="18"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="retirementAge">
                Retirement Age
              </label>
              <input
                id="retirementAge"
                name="retirementAge"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={inputs.retirementAge}
                onChange={handleInputChange}
                min={inputs.currentAge + 1}
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="lifeExpectancy">
                Life Expectancy
              </label>
              <input
                id="lifeExpectancy"
                name="lifeExpectancy"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={inputs.lifeExpectancy}
                onChange={handleInputChange}
                min={inputs.retirementAge + 1}
                max="120"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="currentSavings">
                Current Retirement Savings ($)
              </label>
              <input
                id="currentSavings"
                name="currentSavings"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={inputs.currentSavings}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="annualContribution">
                Annual Contribution ($)
              </label>
              <input
                id="annualContribution"
                name="annualContribution"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={inputs.annualContribution}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="socialSecurityBenefit">
                Expected Monthly Social Security Benefit ($)
              </label>
              <input
                id="socialSecurityBenefit"
                name="socialSecurityBenefit"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={inputs.socialSecurityBenefit}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </button>
            </div>
            
            {showAdvanced && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="expectedReturnRate">
                    Expected Annual Return Rate (%)
                  </label>
                  <input
                    id="expectedReturnRate"
                    name="expectedReturnRate"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={inputs.expectedReturnRate}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="inflationRate">
                    Expected Inflation Rate (%)
                  </label>
                  <input
                    id="inflationRate"
                    name="inflationRate"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={inputs.inflationRate}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="withdrawalRate">
                    Annual Withdrawal Rate (%)
                  </label>
                  <input
                    id="withdrawalRate"
                    name="withdrawalRate"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={inputs.withdrawalRate}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Retirement Projection</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Retirement Savings</h3>
                <p className="text-3xl font-bold text-blue-900">
                  {formatCurrency(results.totalSavingsAtRetirement)}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Projected savings at age {inputs.retirementAge}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-green-800 mb-2">Monthly Retirement Income</h3>
                <p className="text-3xl font-bold text-green-900">
                  {formatCurrency(results.monthlyIncomeInRetirement)}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Including Social Security benefits
                </p>
              </div>
              
              <div className={`p-4 rounded-md ${results.isSuccessful ? 'bg-green-50' : 'bg-red-50'}`}>
                <h3 className={`text-lg font-medium mb-2 ${results.isSuccessful ? 'text-green-800' : 'text-red-800'}`}>
                  Retirement Outlook
                </h3>
                {results.isSuccessful ? (
                  <>
                    <p className="text-green-900 font-medium">
                      Your savings should last until age {results.savingsDepletion}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      {results.surplusYears > 0 
                        ? `That's ${results.surplusYears} years beyond your life expectancy!` 
                        : 'Your savings should last through your expected lifetime.'}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-red-900 font-medium">
                      Your savings may run out at age {results.savingsDepletion}
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      That's {Math.round(inputs.lifeExpectancy - results.savingsDepletion)} years before your life expectancy.
                    </p>
                    <p className="text-sm text-red-700 mt-2">
                      Consider increasing your savings rate, delaying retirement, or adjusting your withdrawal rate.
                    </p>
                  </>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Recommendations</h3>
                <ul className="space-y-2 text-gray-700">
                  {inputs.annualContribution < (inputs.currentSavings * 0.1) && (
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Consider increasing your annual contributions to at least 10-15% of your income.</span>
                    </li>
                  )}
                  {inputs.expectedReturnRate > 8 && (
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Your expected return rate of {inputs.expectedReturnRate}% may be optimistic. Consider using a more conservative estimate.</span>
                    </li>
                  )}
                  {inputs.retirementAge < 65 && (
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Early retirement at {inputs.retirementAge} requires more savings. Consider delaying retirement to increase your savings and Social Security benefits.</span>
                    </li>
                  )}
                  {inputs.withdrawalRate > 4 && (
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>A withdrawal rate of {inputs.withdrawalRate}% may deplete your savings too quickly. The 4% rule is a common guideline for sustainable withdrawals.</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Disclaimer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>This calculator provides estimates based on the information you provide and is for illustrative purposes only.</p>
        <p>Actual results may vary. Consult with a financial advisor for personalized retirement planning advice.</p>
      </div>
    </div>
  );
};

export default RetirementCalculator;
