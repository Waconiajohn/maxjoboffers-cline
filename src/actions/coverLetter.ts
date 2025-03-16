import { HttpError } from 'wasp/server';
import { type GenerateCoverLetter } from 'wasp/server/operations';
import { CoverLetter } from 'wasp/entities';
import { hasActiveSubscription } from '../payment/subscriptionUtils';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type GenerateCoverLetterInput = {
  resumeId: string;
  jobId: string;
};

export const generateCoverLetter: GenerateCoverLetter<GenerateCoverLetterInput, CoverLetter> = async (
  { resumeId, jobId },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to generate a cover letter');
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
    // Get resume and job
    const resume = await context.entities.Resume.findUnique({
      where: { id: resumeId }
    });

    const job = await context.entities.Job.findUnique({
      where: { id: jobId }
    });

    if (!resume || !job) {
      throw new HttpError(404, 'Resume or job not found');
    }

    // Check if resume belongs to user
    if (resume.userId !== context.user.id) {
      throw new HttpError(403, 'You do not have permission to use this resume');
    }

    // Use OpenAI to generate cover letter
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert cover letter writer for executives."
        },
        {
          role: "user",
          content: `Generate a professional cover letter for the following job: ${job.title} at ${job.company}. Job description: ${job.description}. Using this resume: ${resume.content}`
        }
      ]
    });

    const coverLetterContent = completion.choices[0]?.message?.content;
    if (!coverLetterContent) {
      throw new HttpError(500, 'Failed to generate cover letter');
    }

    // Decrement user credits if not on subscription
    if (!hasSubscription) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { credits: { decrement: 1 } }
      });
    }

    // Create cover letter
    const coverLetter = await context.entities.CoverLetter.create({
      data: {
        title: `Cover Letter for ${job.title} at ${job.company}`,
        content: coverLetterContent,
        user: { connect: { id: context.user.id } }
      }
    });

    return coverLetter;
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    throw new HttpError(500, 'Failed to generate cover letter: ' + error.message);
  }
};
