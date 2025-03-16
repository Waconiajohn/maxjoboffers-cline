import { HttpError } from 'wasp/server';
import { type UploadedFile } from 'wasp/server/fileUploads';
import { uploadFile } from 'wasp/server/fileUploads';
import { Resume, User } from 'wasp/entities';
import { hasActiveSubscription } from '../payment/subscriptionUtils';
import { parseResumeContent } from '../utils/resumeParser';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type UploadResumeInput = {
  file: UploadedFile;
  title: string;
};

export const uploadResume = async (
  { file, title }: UploadResumeInput,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to upload a resume');
  }

  try {
    // Upload file to S3
    const fileKey = `resumes/${context.user.id}/${Date.now()}-${file.name}`;
    const uploadResult = await uploadFile({
      file,
      key: fileKey,
    });

    // Parse resume content
    const content = await parseResumeContent(file);

    // Create resume record
    const resume = await context.entities.Resume.create({
      data: {
        title,
        content,
        fileUrl: uploadResult.url,
        user: { connect: { id: context.user.id } }
      }
    });

    return resume;
  } catch (error: any) {
    console.error('Error uploading resume:', error);
    throw new HttpError(500, 'Failed to upload resume: ' + error.message);
  }
};

type AnalyzeResumeInput = {
  resumeId: string;
  jobDescription: string;
};

type ResumeAnalysis = {
  matchScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: {
    section: string;
    suggestion: string;
    reason: string;
  }[];
};

export const analyzeResume = async (
  { resumeId, jobDescription }: AnalyzeResumeInput,
  context: any
): Promise<ResumeAnalysis> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to analyze a resume');
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
      throw new HttpError(403, 'You do not have permission to analyze this resume');
    }

    // Use OpenAI for analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert resume reviewer with deep experience in executive hiring."
        },
        {
          role: "user",
          content: `Analyze this resume for a job with the following description: ${jobDescription}\n\nResume content: ${resume.content}`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "analyzeResume",
            description: "Analyzes a resume against a job description",
            parameters: {
              type: "object",
              properties: {
                matchScore: {
                  type: "number",
                  description: "Score from 0-100 indicating how well the resume matches the job description"
                },
                strengths: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of resume strengths"
                },
                weaknesses: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of resume weaknesses"
                },
                improvementSuggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      section: { type: "string" },
                      suggestion: { type: "string" },
                      reason: { type: "string" }
                    }
                  },
                  description: "Specific suggestions for improvement"
                }
              },
              required: ["matchScore", "strengths", "weaknesses", "improvementSuggestions"]
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "analyzeResume" }
      }
    });

    // Decrement user credits if not on subscription
    if (!hasSubscription) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { credits: { decrement: 1 } }
      });
    }

    const analysisArgs = completion.choices[0]?.message?.tool_calls?.[0]?.function.arguments;
    if (!analysisArgs) {
      throw new HttpError(500, 'Failed to analyze resume');
    }

    return JSON.parse(analysisArgs);
  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    throw new HttpError(500, 'Failed to analyze resume: ' + error.message);
  }
};

type ChangeResumeFormatInput = {
  resumeId: string;
  format: string;
};

export const changeResumeFormat = async (
  { resumeId, format }: ChangeResumeFormatInput,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to change resume format');
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
      throw new HttpError(403, 'You do not have permission to modify this resume');
    }

    // Create a new version with the new format
    const newResume = await context.entities.Resume.create({
      data: {
        title: `${resume.title} (${format} format)`,
        content: resume.content,
        fileUrl: resume.fileUrl,
        format,
        version: resume.version + 1,
        user: { connect: { id: context.user.id } }
      }
    });

    return newResume;
  } catch (error: any) {
    console.error('Error changing resume format:', error);
    throw new HttpError(500, 'Failed to change resume format: ' + error.message);
  }
};
