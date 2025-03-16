import { HttpError } from 'wasp/server';
import { type CreateMockInterview, type SaveRecording, type SubmitAnswer, type ResearchCompany } from 'wasp/server/operations';
import { Interview, InterviewQuestion, InterviewRecording } from 'wasp/entities';
import { hasActiveSubscription } from '../payment/subscriptionUtils';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type CreateMockInterviewInput = {
  jobApplicationId: string;
  type: string;
};

export const createMockInterview: CreateMockInterview<CreateMockInterviewInput, Interview> = async (
  { jobApplicationId, type },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to create a mock interview');
  }

  try {
    // Get job application
    const jobApplication = await context.entities.JobApplication.findUnique({
      where: { id: jobApplicationId },
      include: { job: true }
    });

    if (!jobApplication) {
      throw new HttpError(404, 'Job application not found');
    }

    // Check if job application belongs to user
    if (jobApplication.userId !== context.user.id) {
      throw new HttpError(403, 'You do not have permission to use this job application');
    }

    // Use OpenAI to generate questions
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert interviewer for ${type} interviews.`
        },
        {
          role: "user",
          content: `Generate 5 ${type} interview questions for a ${jobApplication.job.title} position at ${jobApplication.job.company}. Job description: ${jobApplication.job.description}`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generateInterviewQuestions",
            description: "Generates interview questions",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      category: { type: "string" },
                      difficulty: { type: "string", enum: ["easy", "medium", "hard"] }
                    }
                  }
                }
              },
              required: ["questions"]
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "generateInterviewQuestions" }
      }
    });

    const questionsArgs = completion.choices[0]?.message?.tool_calls?.[0]?.function.arguments;
    if (!questionsArgs) {
      throw new HttpError(500, 'Failed to generate interview questions');
    }

    const { questions } = JSON.parse(questionsArgs);

    // Create interview
    const interview = await context.entities.Interview.create({
      data: {
        type,
        user: { connect: { id: context.user.id } },
        jobApplication: { connect: { id: jobApplicationId } },
        questions: {
          create: questions.map((q: any) => ({
            question: q.question,
            category: q.category,
            difficulty: q.difficulty
          }))
        }
      },
      include: {
        questions: true,
        jobApplication: {
          include: {
            job: true
          }
        }
      }
    });

    return interview;
  } catch (error: any) {
    console.error('Error creating mock interview:', error);
    throw new HttpError(500, 'Failed to create mock interview: ' + error.message);
  }
};

type SaveRecordingInput = {
  interviewId: string;
  questionId: string;
  recording: Blob;
};

export const saveRecording: SaveRecording<SaveRecordingInput, InterviewRecording> = async (
  { interviewId, questionId, recording },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to save a recording');
  }

  try {
    // Get interview
    const interview = await context.entities.Interview.findUnique({
      where: { id: interviewId }
    });

    if (!interview) {
      throw new HttpError(404, 'Interview not found');
    }

    // Check if interview belongs to user
    if (interview.userId !== context.user.id) {
      throw new HttpError(403, 'You do not have permission to modify this interview');
    }

    // Get question
    const question = await context.entities.InterviewQuestion.findUnique({
      where: { id: questionId }
    });

    if (!question || question.interviewId !== interviewId) {
      throw new HttpError(404, 'Question not found');
    }

    // Upload recording to S3
    const fileKey = `recordings/${context.user.id}/${interviewId}/${questionId}-${Date.now()}.webm`;
    
    // Convert Blob to Buffer for S3 upload
    const buffer = Buffer.from(await recording.arrayBuffer());
    
    const uploadResult = await context.fileUploads.uploadFile({
      file: {
        buffer,
        name: `${questionId}.webm`,
        mimetype: 'video/webm'
      },
      key: fileKey
    });

    // Create recording record
    const recordingRecord = await context.entities.InterviewRecording.create({
      data: {
        recordingUrl: uploadResult.url,
        interview: { connect: { id: interviewId } },
        question: { connect: { id: questionId } }
      }
    });

    return recordingRecord;
  } catch (error: any) {
    console.error('Error saving recording:', error);
    throw new HttpError(500, 'Failed to save recording: ' + error.message);
  }
};

type SubmitAnswerInput = {
  interviewId: string;
  questionId: string;
  answer: string;
};

type AnswerFeedback = {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
};

export const submitAnswer: SubmitAnswer<SubmitAnswerInput, AnswerFeedback> = async (
  { interviewId, questionId, answer },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to submit an answer');
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
    // Get interview and question
    const interview = await context.entities.Interview.findUnique({
      where: { id: interviewId },
      include: {
        jobApplication: {
          include: {
            job: true
          }
        }
      }
    });

    if (!interview) {
      throw new HttpError(404, 'Interview not found');
    }

    // Check if interview belongs to user
    if (interview.userId !== context.user.id) {
      throw new HttpError(403, 'You do not have permission to modify this interview');
    }

    const question = await context.entities.InterviewQuestion.findUnique({
      where: { id: questionId }
    });

    if (!question || question.interviewId !== interviewId) {
      throw new HttpError(404, 'Question not found');
    }

    // Use OpenAI to analyze answer
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach with deep experience in helping executives prepare for job interviews."
        },
        {
          role: "user",
          content: `Analyze this interview answer for the following question: "${question.question}". The position is ${interview.jobApplication.job.title} at ${interview.jobApplication.job.company}. The answer is: "${answer}"`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "analyzeAnswer",
            description: "Analyzes an interview answer",
            parameters: {
              type: "object",
              properties: {
                score: {
                  type: "number",
                  description: "Score from 0-100 indicating the quality of the answer"
                },
                feedback: {
                  type: "string",
                  description: "Overall feedback on the answer"
                },
                strengths: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of strengths in the answer"
                },
                improvements: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of areas for improvement"
                }
              },
              required: ["score", "feedback", "strengths", "improvements"]
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "analyzeAnswer" }
      }
    });

    // Decrement user credits if not on subscription
    if (!hasSubscription) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { credits: { decrement: 1 } }
      });
    }

    const feedbackArgs = completion.choices[0]?.message?.tool_calls?.[0]?.function.arguments;
    if (!feedbackArgs) {
      throw new HttpError(500, 'Failed to analyze answer');
    }

    const feedback = JSON.parse(feedbackArgs);

    // Update question with answer and feedback
    await context.entities.InterviewQuestion.update({
      where: { id: questionId },
      data: {
        answer,
        feedback: feedback.feedback,
        score: feedback.score
      }
    });

    return feedback;
  } catch (error: any) {
    console.error('Error submitting answer:', error);
    throw new HttpError(500, 'Failed to submit answer: ' + error.message);
  }
};

type ResearchCompanyInput = {
  companyName: string;
  industry: string;
};

type CompanyResearch = {
  marketPosition: Array<{ title: string; description: string }>;
  financialHealth: Array<{ title: string; description: string }>;
  culture: Array<{ title: string; description: string }>;
  strategies: Array<{ title: string; description: string }>;
};

export const researchCompany: ResearchCompany<ResearchCompanyInput, CompanyResearch> = async (
  { companyName, industry },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to research a company');
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
    // Use OpenAI to research company
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert company researcher."
        },
        {
          role: "user",
          content: `Research ${companyName} in the ${industry} industry. Provide detailed information about their market position, culture, recent news, and competitors.`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "companyResearch",
            description: "Provides research about a company",
            parameters: {
              type: "object",
              properties: {
                marketPosition: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" }
                    }
                  }
                },
                financialHealth: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" }
                    }
                  }
                },
                culture: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" }
                    }
                  }
                },
                strategies: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" }
                    }
                  }
                }
              },
              required: ["marketPosition", "financialHealth", "culture", "strategies"]
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "companyResearch" }
      }
    });

    // Decrement user credits if not on subscription
    if (!hasSubscription) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { credits: { decrement: 1 } }
      });
    }

    const researchArgs = completion.choices[0]?.message?.tool_calls?.[0]?.function.arguments;
    if (!researchArgs) {
      throw new HttpError(500, 'Failed to research company');
    }

    return JSON.parse(researchArgs);
  } catch (error: any) {
    console.error('Error researching company:', error);
    throw new HttpError(500, 'Failed to research company: ' + error.message);
  }
};
