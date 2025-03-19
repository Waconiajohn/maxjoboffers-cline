import { HttpError } from 'wasp/server';
import { type GetInterviews, type GetInterviewById } from 'wasp/server/operations';
import { Interview } from 'wasp/entities';

export const getInterviews: GetInterviews<void, Interview[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get interviews');
  }

  const interviews = await context.entities.Interview.findMany({
    where: {
      userId: context.user.id
    },
    include: {
      jobApplication: {
        include: {
          job: true
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return interviews;
};

type GetInterviewByIdInput = {
  id: string;
};

export const getInterviewById: GetInterviewById<GetInterviewByIdInput, Interview> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get an interview');
  }

  const interview = await context.entities.Interview.findUnique({
    where: { id },
    include: {
      jobApplication: {
        include: {
          job: true
        }
      },
      questions: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      recordings: true
    }
  });

  if (!interview) {
    throw new HttpError(404, 'Interview not found');
  }

  // Check if interview belongs to user
  if (interview.userId !== context.user.id) {
    throw new HttpError(403, 'You do not have permission to view this interview');
  }

  return interview;
};

export const getUpcomingInterviews = async (_args: void, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get upcoming interviews');
  }

  const now = new Date();

  const interviews = await context.entities.Interview.findMany({
    where: {
      userId: context.user.id,
      date: {
        gte: now
      }
    },
    include: {
      jobApplication: {
        include: {
          job: true
        }
      }
    },
    orderBy: {
      date: 'asc'
    },
    take: 5
  });

  return interviews;
};
