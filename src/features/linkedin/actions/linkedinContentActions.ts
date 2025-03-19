import { HttpError } from 'wasp/server';
import { type GenerateLinkedInPost, type GenerateNetworkingStrategy } from 'wasp/server/operations';
import { hasActiveSubscription } from '../payment/subscriptionUtils';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type GenerateLinkedInPostInput = {
  topic: string;
  industry: string;
  tone?: string;
  includeHashtags?: boolean;
  targetAudience?: string;
  length?: 'short' | 'medium' | 'long';
};

type LinkedInPostResult = {
  title: string;
  content: string;
  hashtags: string[];
  suggestedImage?: string;
  engagementTips: string[];
};

export const generateLinkedInPost: GenerateLinkedInPost<GenerateLinkedInPostInput, LinkedInPostResult> = async (
  { topic, industry, tone = 'professional', includeHashtags = true, targetAudience, length = 'medium' },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to generate a LinkedIn post');
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
    // Use OpenAI to generate LinkedIn post
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert LinkedIn content creator specializing in creating engaging posts for professionals in the ${industry} industry.`
        },
        {
          role: "user",
          content: `Generate a ${length} LinkedIn post about ${topic} with a ${tone} tone.${
            targetAudience ? ` The target audience is ${targetAudience}.` : ''
          }${
            includeHashtags ? ' Include relevant hashtags.' : ''
          }`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generateLinkedInPost",
            description: "Generates a LinkedIn post",
            parameters: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Attention-grabbing title for the LinkedIn post"
                },
                content: {
                  type: "string",
                  description: "The main content of the LinkedIn post"
                },
                hashtags: {
                  type: "array",
                  items: { type: "string" },
                  description: "Relevant hashtags for the post"
                },
                suggestedImage: {
                  type: "string",
                  description: "Description of an image that would complement the post"
                },
                engagementTips: {
                  type: "array",
                  items: { type: "string" },
                  description: "Tips for maximizing engagement with the post"
                }
              },
              required: ["title", "content", "hashtags", "engagementTips"]
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "generateLinkedInPost" }
      }
    });

    // Decrement user credits if not on subscription
    if (!hasSubscription) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { credits: { decrement: 1 } }
      });
    }

    const postArgs = completion.choices[0]?.message?.tool_calls?.[0]?.function.arguments;
    if (!postArgs) {
      throw new HttpError(500, 'Failed to generate LinkedIn post');
    }

    // Store the generated post in the database
    const postData = JSON.parse(postArgs);
    await context.entities.LinkedInPost.create({
      data: {
        title: postData.title,
        content: postData.content,
        hashtags: postData.hashtags,
        suggestedImage: postData.suggestedImage,
        engagementTips: postData.engagementTips,
        user: { connect: { id: context.user.id } }
      }
    });

    return postData;
  } catch (error: any) {
    console.error('Error generating LinkedIn post:', error);
    throw new HttpError(500, 'Failed to generate LinkedIn post: ' + error.message);
  }
};

type GenerateNetworkingStrategyInput = {
  industry: string;
  careerStage: string;
  goals: string[];
  currentNetworkSize?: 'small' | 'medium' | 'large';
  targetRoles?: string[];
  targetCompanies?: string[];
  timeCommitment?: 'low' | 'medium' | 'high';
};

type NetworkingStrategyResult = {
  summary: string;
  connectionStrategies: Array<{
    title: string;
    description: string;
    actionItems: string[];
    timeframe: string;
  }>;
  contentStrategy: {
    recommendedTopics: string[];
    postingFrequency: string;
    contentTypes: string[];
  };
  outreachTemplates: Array<{
    scenario: string;
    template: string;
    followUpStrategy: string;
  }>;
  kpis: Array<{
    metric: string;
    target: string;
    timeframe: string;
  }>;
};

export const generateNetworkingStrategy: GenerateNetworkingStrategy<GenerateNetworkingStrategyInput, NetworkingStrategyResult> = async (
  { industry, careerStage, goals, currentNetworkSize = 'medium', targetRoles = [], targetCompanies = [], timeCommitment = 'medium' },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to generate a networking strategy');
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
    // Use OpenAI to generate networking strategy
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach and LinkedIn networking strategist."
        },
        {
          role: "user",
          content: `Create a comprehensive LinkedIn networking strategy for a ${careerStage} professional in the ${industry} industry. 
          Career goals: ${goals.join(', ')}. 
          Current network size: ${currentNetworkSize}.
          ${targetRoles.length > 0 ? `Target roles: ${targetRoles.join(', ')}. ` : ''}
          ${targetCompanies.length > 0 ? `Target companies: ${targetCompanies.join(', ')}. ` : ''}
          Time commitment: ${timeCommitment}.`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generateNetworkingStrategy",
            description: "Generates a LinkedIn networking strategy",
            parameters: {
              type: "object",
              properties: {
                summary: {
                  type: "string",
                  description: "Executive summary of the networking strategy"
                },
                connectionStrategies: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      actionItems: {
                        type: "array",
                        items: { type: "string" }
                      },
                      timeframe: { type: "string" }
                    }
                  },
                  description: "Strategies for building connections"
                },
                contentStrategy: {
                  type: "object",
                  properties: {
                    recommendedTopics: {
                      type: "array",
                      items: { type: "string" }
                    },
                    postingFrequency: { type: "string" },
                    contentTypes: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  description: "Strategy for content creation"
                },
                outreachTemplates: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      scenario: { type: "string" },
                      template: { type: "string" },
                      followUpStrategy: { type: "string" }
                    }
                  },
                  description: "Templates for outreach messages"
                },
                kpis: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      metric: { type: "string" },
                      target: { type: "string" },
                      timeframe: { type: "string" }
                    }
                  },
                  description: "Key performance indicators to track networking success"
                }
              },
              required: ["summary", "connectionStrategies", "contentStrategy", "outreachTemplates", "kpis"]
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "generateNetworkingStrategy" }
      }
    });

    // Decrement user credits if not on subscription
    if (!hasSubscription) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { credits: { decrement: 1 } }
      });
    }

    const strategyArgs = completion.choices[0]?.message?.tool_calls?.[0]?.function.arguments;
    if (!strategyArgs) {
      throw new HttpError(500, 'Failed to generate networking strategy');
    }

    // Store the generated strategy in the database
    const strategyData = JSON.parse(strategyArgs);
    await context.entities.NetworkingStrategy.create({
      data: {
        summary: strategyData.summary,
        connectionStrategies: strategyData.connectionStrategies,
        contentStrategy: strategyData.contentStrategy,
        outreachTemplates: strategyData.outreachTemplates,
        kpis: strategyData.kpis,
        user: { connect: { id: context.user.id } }
      }
    });

    return strategyData;
  } catch (error: any) {
    console.error('Error generating networking strategy:', error);
    throw new HttpError(500, 'Failed to generate networking strategy: ' + error.message);
  }
};
