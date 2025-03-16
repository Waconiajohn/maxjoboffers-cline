import { HttpError } from 'wasp/server';
import { type GenerateLinkedInProfile } from 'wasp/server/operations';
import { LinkedInProfile } from 'wasp/entities';
import { hasActiveSubscription } from '../payment/subscriptionUtils';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type GenerateLinkedInProfileInput = {
  resumeId: string;
  currentProfile?: {
    headline?: string;
    summary?: string;
    sections?: Record<string, any>;
  };
};

type LinkedInProfileData = {
  headline: string;
  summary: string;
  sections: {
    experience: Array<{
      title: string;
      company: string;
      description: string;
      startDate: string;
      endDate?: string;
    }>;
    education: Array<{
      degree: string;
      institution: string;
      description: string;
      startDate: string;
      endDate?: string;
    }>;
    skills: string[];
    certifications: Array<{
      name: string;
      issuer: string;
      date: string;
    }>;
  };
  keywords: string[];
  optimizationScore: number;
};

export const generateLinkedInProfile: GenerateLinkedInProfile<GenerateLinkedInProfileInput, LinkedInProfile> = async (
  { resumeId, currentProfile },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to generate a LinkedIn profile');
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
    // Get resume
    const resume = await context.entities.Resume.findUnique({
      where: { id: resumeId }
    });

    if (!resume) {
      throw new HttpError(404, 'Resume not found');
    }

    // Check if resume belongs to user
    if (resume.userId !== context.user.id) {
      throw new HttpError(403, 'You do not have permission to use this resume');
    }

    // Use OpenAI to generate LinkedIn profile
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert LinkedIn profile optimizer for executives."
        },
        {
          role: "user",
          content: `Generate an optimized LinkedIn profile based on this resume: ${resume.content}${
            currentProfile ? `\n\nCurrent LinkedIn profile:\nHeadline: ${currentProfile.headline || ''}\nSummary: ${currentProfile.summary || ''}\nSections: ${JSON.stringify(currentProfile.sections || {})}` : ''
          }`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generateLinkedInProfile",
            description: "Generates an optimized LinkedIn profile",
            parameters: {
              type: "object",
              properties: {
                headline: {
                  type: "string",
                  description: "Professional headline for LinkedIn profile"
                },
                summary: {
                  type: "string",
                  description: "Professional summary for LinkedIn profile"
                },
                sections: {
                  type: "object",
                  properties: {
                    experience: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          company: { type: "string" },
                          description: { type: "string" },
                          startDate: { type: "string" },
                          endDate: { type: "string", nullable: true }
                        }
                      }
                    },
                    education: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          degree: { type: "string" },
                          institution: { type: "string" },
                          description: { type: "string" },
                          startDate: { type: "string" },
                          endDate: { type: "string", nullable: true }
                        }
                      }
                    },
                    skills: {
                      type: "array",
                      items: { type: "string" }
                    },
                    certifications: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          issuer: { type: "string" },
                          date: { type: "string" }
                        }
                      }
                    }
                  }
                },
                keywords: {
                  type: "array",
                  items: { type: "string" },
                  description: "Keywords for LinkedIn profile optimization"
                },
                optimizationScore: {
                  type: "number",
                  description: "Score from 0-100 indicating the optimization level of the profile"
                }
              },
              required: ["headline", "summary", "sections", "keywords", "optimizationScore"]
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "generateLinkedInProfile" }
      }
    });

    // Decrement user credits if not on subscription
    if (!hasSubscription) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { credits: { decrement: 1 } }
      });
    }

    const profileArgs = completion.choices[0]?.message?.tool_calls?.[0]?.function.arguments;
    if (!profileArgs) {
      throw new HttpError(500, 'Failed to generate LinkedIn profile');
    }

    const profileData: LinkedInProfileData = JSON.parse(profileArgs);

    // Check if user already has a LinkedIn profile
    const existingProfile = await context.entities.LinkedInProfile.findFirst({
      where: { userId: context.user.id }
    });

    let linkedInProfile;

    if (existingProfile) {
      // Update existing profile
      linkedInProfile = await context.entities.LinkedInProfile.update({
        where: { id: existingProfile.id },
        data: {
          headline: profileData.headline,
          summary: profileData.summary,
          sections: profileData.sections,
          keywords: profileData.keywords,
          optimizationScore: profileData.optimizationScore
        }
      });
    } else {
      // Create new profile
      linkedInProfile = await context.entities.LinkedInProfile.create({
        data: {
          headline: profileData.headline,
          summary: profileData.summary,
          sections: profileData.sections,
          keywords: profileData.keywords,
          optimizationScore: profileData.optimizationScore,
          user: { connect: { id: context.user.id } }
        }
      });
    }

    return linkedInProfile;
  } catch (error: any) {
    console.error('Error generating LinkedIn profile:', error);
    throw new HttpError(500, 'Failed to generate LinkedIn profile: ' + error.message);
  }
};
