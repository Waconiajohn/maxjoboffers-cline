import { HttpError } from 'wasp/server';
import { type GetJobs, type GetJobById, type GetJobApplications } from 'wasp/server/operations';
import { Job, JobApplication } from 'wasp/entities';

export const getJobs: GetJobs<void, Job[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get jobs');
  }

  // Get all jobs that the user has applied to
  const applications = await context.entities.JobApplication.findMany({
    where: {
      userId: context.user.id
    },
    select: {
      jobId: true
    }
  });

  const jobIds = applications.map(app => app.jobId);

  const jobs = await context.entities.Job.findMany({
    where: {
      id: {
        in: jobIds
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return jobs;
};

type GetJobByIdInput = {
  id: string;
};

export const getJobById: GetJobById<GetJobByIdInput, Job> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get a job');
  }

  const job = await context.entities.Job.findUnique({
    where: { id }
  });

  if (!job) {
    throw new HttpError(404, 'Job not found');
  }

  return job;
};

export const getJobApplications: GetJobApplications<void, JobApplication[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to get job applications');
  }

  const applications = await context.entities.JobApplication.findMany({
    where: {
      userId: context.user.id
    },
    include: {
      job: true,
      resume: true,
      coverLetter: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return applications;
};
