import { HttpError } from 'wasp/server';
import { type GetCoverLetters } from 'wasp/server/operations';
import { CoverLetter } from 'wasp/entities';

export const getCoverLetters: GetCoverLetters<void, CoverLetter[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get cover letters');
  }

  const coverLetters = await context.entities.CoverLetter.findMany({
    where: {
      userId: context.user.id
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return coverLetters;
};

type GetCoverLetterByIdInput = {
  id: string;
};

export const getCoverLetterById = async ({ id }: GetCoverLetterByIdInput, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get a cover letter');
  }

  const coverLetter = await context.entities.CoverLetter.findUnique({
    where: { id }
  });

  if (!coverLetter) {
    throw new HttpError(404, 'Cover letter not found');
  }

  // Check if cover letter belongs to user
  if (coverLetter.userId !== context.user.id) {
    throw new HttpError(403, 'You do not have permission to view this cover letter');
  }

  return coverLetter;
};
