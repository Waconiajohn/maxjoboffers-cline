import { HttpError } from 'wasp/server';
import { type GenerateFinancialPlan } from 'wasp/server/operations';
import { hasActiveSubscription } from '../payment/subscriptionUtils';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type GenerateFinancialPlanInput = {
  currentSalary: number;
  targetSalary: number;
  industry: string;
  location: string;
  yearsOfExperience: number;
  currentBenefits?: string[];
  desiredBenefits?: string[];
  financialGoals?: string[];
};

type FinancialPlanResult = {
  salaryAnalysis: {
    marketRate: {
      min: number;
      median: number;
      max: number;
    };
    recommendation: string;
    justification: string;
  };
  negotiationStrategy: {
    openingOffer: number;
    walkAwayPoint: number;
    keyPoints: string[];
    script: string;
  };
  budgetPlan: {
    monthlySavings: number;
    monthlyExpenses: number;
    breakdown: Record<string, number>;
    recommendations: string[];
  };
  careerGrowthPlan: {
    milestones: Array<{
      title: string;
      timeframe: string;
      expectedSalary: number;
      requiredSkills: string[];
    }>;
    recommendations: string[];
  };
};

export const generateFinancialPlan: GenerateFinancialPlan<GenerateFinancialPlanInput, FinancialPlanResult> = async (
  { currentSalary, targetSalary, industry, location, yearsOfExperience, currentBenefits, desiredBenefits, financialGoals },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to generate a financial plan');
  }

  // Check user credits/subscription
  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  const hasCredits = user.credits > 0;
  const hasSubscription = hasActiveSubscription(user);

  if (!hasCredits && !hasSubscription) {
    throw new HttpError(402, 'Insufficient credits or subscription');
  }

  try {
    // Use OpenAI to generate financial plan
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert financial advisor specializing in career financial planning and salary negotiation."
        },
        {
          role: "user",
          content: `Generate a comprehensive financial plan for a professional in the ${industry} industry with ${yearsOfExperience} years of experience, located in ${location}. Current salary: $${currentSalary}. Target salary: $${targetSalary}.${
            currentBenefits ? ` Current benefits: ${currentBenefits.join(', ')}.` : ''
          }${
            desiredBenefits ? ` Desired benefits: ${desiredBenefits.join(', ')}.` : ''
          }${
            financialGoals ? ` Financial goals: ${financialGoals.join(', ')}.` : ''
          }`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generateFinancialPlan",
            description: "Generates a comprehensive financial plan",
            parameters: {
              type: "object",
              properties: {
                salaryAnalysis: {
                  type: "object",
                  properties: {
                    marketRate: {
                      type: "object",
                      properties: {
                        min: { type: "number" },
                        median: { type: "number" },
                        max: { type: "number" }
                      }
                    },
                    recommendation: { type: "string" },
                    justification: { type: "string" }
                  }
                },
                negotiationStrategy: {
                  type: "object",
                  properties: {
                    openingOffer: { type: "number" },
                    walkAwayPoint: { type: "number" },
                    keyPoints: {
                      type: "array",
                      items: { type: "string" }
                    },
                    script: { type: "string" }
                  }
                },
                budgetPlan: {
                  type: "object",
                  properties: {
                    monthlySavings: { type: "number" },
                    monthlyExpenses: { type: "number" },
                    breakdown: {
                      type: "object",
                      additionalProperties: { type: "number" }
                    },
                    recommendations: {
                      type: "array",
                      items: { type: "string" }
                    }
                  }
                },
                careerGrowthPlan: {
                  type: "object",
                  properties: {
                    milestones: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          timeframe: { type: "string" },
                          expectedSalary: { type: "number" },
                          requiredSkills: {
                            type: "array",
                            items: { type: "string" }
                          }
                        }
                      }
                    },
                    recommendations: {
                      type: "array",
                      items: { type: "string" }
                    }
                  }
                }
              },
              required: ["salaryAnalysis", "negotiationStrategy", "budgetPlan", "careerGrowthPlan"]
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "generateFinancialPlan" }
      }
    });

    // Decrement user credits if not on subscription
    if (!hasSubscription) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { credits: { decrement: 1 } }
      });
    }

    const planArgs = completion.choices[0]?.message?.tool_calls?.[0]?.function.arguments;
    if (!planArgs) {
      throw new HttpError(500, 'Failed to generate financial plan');
    }

    return JSON.parse(planArgs);
  } catch (error: any) {
    console.error('Error generating financial plan:', error);
    throw new HttpError(500, 'Failed to generate financial plan: ' + error.message);
  }
};
