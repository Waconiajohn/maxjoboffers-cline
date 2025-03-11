import { HttpError } from 'wasp/server';
import { type GetUser } from 'wasp/server/operations';

export const getUser: GetUser<void, any> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get user data');
  }

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id },
    select: {
      id: true,
      email: true,
      username: true,
      isAdmin: true,
      subscriptionStatus: true,
      subscriptionPlanId: true,
      credits: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          resumes: true,
          applications: true,
          interviews: true,
          coverLetters: true
        }
      }
    }
  });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return user;
};
