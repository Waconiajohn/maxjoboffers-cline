import { HttpError } from 'wasp/server';
import { type GetLinkedInPosts, type GetNetworkingStrategies } from 'wasp/server/operations';
import { LinkedInPost, NetworkingStrategy } from 'wasp/entities';

export const getLinkedInPosts: GetLinkedInPosts<void, LinkedInPost[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get LinkedIn posts');
  }

  const posts = await context.entities.LinkedInPost.findMany({
    where: {
      userId: context.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return posts;
};

type GetLinkedInPostByIdInput = {
  id: string;
};

export const getLinkedInPostById = async ({ id }: GetLinkedInPostByIdInput, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get a LinkedIn post');
  }

  const post = await context.entities.LinkedInPost.findUnique({
    where: { id }
  });

  if (!post) {
    throw new HttpError(404, 'LinkedIn post not found');
  }

  // Check if post belongs to user
  if (post.userId !== context.user.id) {
    throw new HttpError(403, 'You do not have permission to view this LinkedIn post');
  }

  return post;
};

export const getNetworkingStrategies: GetNetworkingStrategies<void, NetworkingStrategy[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get networking strategies');
  }

  const strategies = await context.entities.NetworkingStrategy.findMany({
    where: {
      userId: context.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return strategies;
};

type GetNetworkingStrategyByIdInput = {
  id: string;
};

export const getNetworkingStrategyById = async ({ id }: GetNetworkingStrategyByIdInput, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get a networking strategy');
  }

  const strategy = await context.entities.NetworkingStrategy.findUnique({
    where: { id }
  });

  if (!strategy) {
    throw new HttpError(404, 'Networking strategy not found');
  }

  // Check if strategy belongs to user
  if (strategy.userId !== context.user.id) {
    throw new HttpError(403, 'You do not have permission to view this networking strategy');
  }

  return strategy;
};
