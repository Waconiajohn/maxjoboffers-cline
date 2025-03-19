import React, { useState } from 'react';
import { useAction } from 'wasp/client/operations';
import { generateFinancialPlan } from 'wasp/actions/financial';

const FinancialPlanForm: React.FC = () => {
  // Form state
  const [currentSalary, setCurrentSalary] = useState<number | ''>('');
  const [targetSalary, setTargetSalary] = useState<number | ''>('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number | ''>('');
  const [currentBenefits, setCurrentBenefits] = useState('');
  const [desiredBenefits, setDesiredBenefits] = useState('');
  const [financialGoals, setFinancialGoals] = useState('');

  // Result state
  const [financialPlan, setFinancialPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Action
  const [generateFinancialPlanAction, { isLoading: isGenerating }] = useAction(generateFinancialPlan);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!currentSalary || !targetSalary || !industry || !location || !yearsOfExperience) {
        throw new Error('Please fill in all required fields');
      }

      const result = await generateFinancialPlanAction({
        currentSalary: Number(currentSalary),
        targetSalary: Number(targetSalary),
        industry,
        location,
        yearsOfExperience: Number(yearsOfExperience),
        currentBenefits: currentBenefits ? currentBenefits.split(',').map(b => b.trim()) : undefined,
        desiredBenefits: desiredBenefits ? desiredBenefits.split(',').map(b => b.trim()) : undefined,
        financialGoals: financialGoals ? financialGoals.split(',').map(g => g.trim()) : undefined
      });

      setFinancialPlan(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate financial plan');
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Financial Planning</h1>

      {!financialPlan ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Generate Financial Plan</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="currentSalary">
                  Current Salary*
                </label>
                <input
                  id="currentSalary"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g., 75000"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="targetSalary">
                  Target Salary*
                </label>
                <input
                  id="targetSalary"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={targetSalary}
                  onChange={(e) => setTargetSalary(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g., 90000"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="industry">
                  Industry*
                </label>
                <input
                  id="industry"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Technology, Healthcare, Finance"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="location">
                  Location*
                </label>
                <input
                  id="location"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="yearsOfExperience">
                  Years of Experience*
                </label>
                <input
                  id="yearsOfExperience"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g., 5"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="currentBenefits">
                Current Benefits (comma-separated)
              </label>
              <input
                id="currentBenefits"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={currentBenefits}
                onChange={(e) => setCurrentBenefits(e.target.value)}
                placeholder="e.g., Health insurance, 401k matching, 15 days PTO"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="desiredBenefits">
                Desired Benefits (comma-separated)
              </label>
              <input
                id="desiredBenefits"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={desiredBenefits}
                onChange={(e) => setDesiredBenefits(e.target.value)}
                placeholder="e.g., Remote work, Stock options, 20 days PTO"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="financialGoals">
                Financial Goals (comma-separated)
              </label>
              <input
                id="financialGoals"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={financialGoals}
                onChange={(e) => setFinancialGoals(e.target.value)}
                placeholder="e.g., Buy a house, Save for retirement, Pay off student loans"
              />
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isGenerating || isLoading}
              >
                {isGenerating || isLoading ? 'Generating Plan...' : 'Generate Financial Plan'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Salary Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Salary Analysis</h2>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Market Rate</h3>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Minimum</div>
                  <div className="text-xl font-bold">{formatCurrency(financialPlan.salaryAnalysis.marketRate.min)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Median</div>
                  <div className="text-xl font-bold">{formatCurrency(financialPlan.salaryAnalysis.marketRate.median)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Maximum</div>
                  <div className="text-xl font-bold">{formatCurrency(financialPlan.salaryAnalysis.marketRate.max)}</div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Recommendation</h3>
              <p className="text-gray-700">{financialPlan.salaryAnalysis.recommendation}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Justification</h3>
              <p className="text-gray-700">{financialPlan.salaryAnalysis.justification}</p>
            </div>
          </div>

          {/* Negotiation Strategy */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Negotiation Strategy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-blue-50 rounded-md">
                <div className="text-sm text-blue-700 mb-1">Opening Offer</div>
                <div className="text-2xl font-bold">{formatCurrency(financialPlan.negotiationStrategy.openingOffer)}</div>
              </div>
              <div className="p-4 bg-red-50 rounded-md">
                <div className="text-sm text-red-700 mb-1">Walk Away Point</div>
                <div className="text-2xl font-bold">{formatCurrency(financialPlan.negotiationStrategy.walkAwayPoint)}</div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Key Points</h3>
              <ul className="list-disc pl-5 space-y-1">
                {financialPlan.negotiationStrategy.keyPoints.map((point: string, index: number) => (
                  <li key={index} className="text-gray-700">{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Negotiation Script</h3>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700 whitespace-pre-line">{financialPlan.negotiationStrategy.script}</p>
              </div>
            </div>
          </div>

          {/* Budget Plan */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Budget Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-md">
                <div className="text-sm text-green-700 mb-1">Monthly Savings</div>
                <div className="text-2xl font-bold">{formatCurrency(financialPlan.budgetPlan.monthlySavings)}</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-md">
                <div className="text-sm text-yellow-700 mb-1">Monthly Expenses</div>
                <div className="text-2xl font-bold">{formatCurrency(financialPlan.budgetPlan.monthlyExpenses)}</div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Expense Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Category</th>
                      <th className="py-2 px-4 border-b text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(financialPlan.budgetPlan.breakdown).map(([category, amount]: [string, any], index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="py-2 px-4 border-b">{category}</td>
                        <td className="py-2 px-4 border-b text-right">{formatCurrency(amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-1">
                {financialPlan.budgetPlan.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="text-gray-700">{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Career Growth Plan */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Career Growth Plan</h2>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Career Milestones</h3>
              <div className="space-y-4">
                {financialPlan.careerGrowthPlan.milestones.map((milestone: any, index: number) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-lg">{milestone.title}</h4>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{milestone.timeframe}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-500">Expected Salary:</span> {formatCurrency(milestone.expectedSalary)}
                    </div>
                    <div>
                      <span className="text-gray-500">Required Skills:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {milestone.requiredSkills.map((skill: string, skillIndex: number) => (
                          <span key={skillIndex} className="bg-gray-100 px-2 py-1 rounded text-sm">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-1">
                {financialPlan.careerGrowthPlan.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="text-gray-700">{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setFinancialPlan(null)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Create New Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialPlanForm;
