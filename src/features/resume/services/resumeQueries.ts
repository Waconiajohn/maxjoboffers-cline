import { HttpError } from 'wasp/server';
import { type GetResumes, type GetResumeById } from 'wasp/server/operations';
import { Resume } from 'wasp/entities';

export const getResumes: GetResumes<void, Resume[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get resumes');
  }

  const resumes = await context.entities.Resume.findMany({
    where: {
      userId: context.user.id
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return resumes;
};

type GetResumeByIdInput = {
  id: string;
};

export const getResumeById: GetResumeById<GetResumeByIdInput, Resume> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get a resume');
  }

  const resume = await context.entities.Resume.findUnique({
    where: { id }
  });

  if (!resume) {
    throw new HttpError(404, 'Resume not found');
  }

  // Check if resume belongs to user
  if (resume.userId !== context.user.id) {
    throw new HttpError(403, 'You do not have permission to view this resume');
  }

  return resume;
};
