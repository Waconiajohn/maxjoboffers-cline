import { HttpError } from 'wasp/server';
import { type SearchJobs, type ApplyToJob } from 'wasp/server/operations';
import { Job, JobApplication } from 'wasp/entities';
import axios from 'axios';

type SearchJobsInput = {
  query: string;
  location: string;
  radius?: number;
  filters?: {
    workType?: string;
    datePosted?: string;
    minSalary?: number;
    maxSalary?: number;
  };
};

type SearchJobsResult = {
  jobs: Job[];
  totalCount: number;
  nextPageToken?: string;
};

export const searchJobs: SearchJobs<SearchJobsInput, SearchJobsResult> = async (
  { query, location, radius = 25, filters = {} },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to search jobs');
  }

  try {
    // Call Google Jobs API
    const apiKey = process.env.GOOGLE_JOBS_API_KEY;
    if (!apiKey) {
      throw new HttpError(500, 'Google Jobs API key not configured');
    }

    // Prepare parameters for Google Jobs API
    const params: any = {
      query,
      location,
      radius: radius.toString(),
    };

    // Add filters if provided
    if (filters.workType && filters.workType !== 'all') {
      params.workType = filters.workType;
    }

    if (filters.datePosted && filters.datePosted !== 'all') {
      params.datePosted = filters.datePosted;
    }

    if (filters.minSalary) {
      params.minSalary = filters.minSalary.toString();
    }

    if (filters.maxSalary) {
      params.maxSalary = filters.maxSalary.toString();
    }

    // In a real implementation, you would call the Google Jobs API
    // For this example, we'll simulate the API call
    // const response = await axios.get('https://jobs.googleapis.com/v4/jobs:search', {
    //   params,
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`
    //   }
    // });

    // Simulate API response
    const simulatedJobs = [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.',
        location: location,
        description: 'We are looking for a Senior Software Engineer to join our team. You will be responsible for developing high-quality applications.',
        requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience in software development.',
        salary: { min: 120000, max: 160000 },
        applicationUrl: 'https://example.com/apply',
        source: 'google'
      },
      {
        title: 'Product Manager',
        company: 'Digital Solutions LLC',
        location: location,
        description: 'As a Product Manager, you will be responsible for the product roadmap and working with cross-functional teams.',
        requirements: 'Bachelor\'s degree in Business, Computer Science, or related field. 3+ years of product management experience.',
        salary: { min: 110000, max: 140000 },
        applicationUrl: 'https://example.com/apply',
        source: 'google'
      },
      {
        title: 'UX/UI Designer',
        company: 'Creative Designs Co.',
        location: location,
        description: 'We are seeking a talented UX/UI Designer to create amazing user experiences.',
        requirements: 'Bachelor\'s degree in Design, HCI, or related field. 2+ years of UX/UI design experience.',
        salary: { min: 90000, max: 120000 },
        applicationUrl: 'https://example.com/apply',
        source: 'google'
      }
    ];

    // Transform and store jobs
    const jobs = await Promise.all(simulatedJobs.map(async (job) => {
      // Check if job already exists
      let existingJob = await context.entities.Job.findFirst({
        where: { 
          title: job.title,
          company: job.company,
          location: job.location
        }
      });
      
      if (!existingJob) {
        existingJob = await context.entities.Job.create({
          data: {
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            requirements: job.requirements,
            salary: job.salary,
            applicationUrl: job.applicationUrl,
            source: 'google'
          }
        });
      }
      
      return existingJob;
    }));

    return {
      jobs,
      totalCount: jobs.length
    };
  } catch (error: any) {
    console.error('Error searching jobs:', error);
    throw new HttpError(500, 'Failed to search jobs: ' + error.message);
  }
};

type ApplyToJobInput = {
  jobId: string;
  resumeId?: string;
  coverLetterId?: string;
};

export const applyToJob: ApplyToJob<ApplyToJobInput, JobApplication> = async (
  { jobId, resumeId, coverLetterId },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to apply to a job');
  }

  try {
    // Check if job exists
    const job = await context.entities.Job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      throw new HttpError(404, 'Job not found');
    }

    // Check if resume exists if provided
    if (resumeId) {
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
    }

    // Check if cover letter exists if provided
    if (coverLetterId) {
      const coverLetter = await context.entities.CoverLetter.findUnique({
        where: { id: coverLetterId }
      });

      if (!coverLetter) {
        throw new HttpError(404, 'Cover letter not found');
      }

      // Check if cover letter belongs to user
      if (coverLetter.userId !== context.user.id) {
        throw new HttpError(403, 'You do not have permission to use this cover letter');
      }
    }

    // Check if user has already applied to this job
    const existingApplication = await context.entities.JobApplication.findFirst({
      where: {
        userId: context.user.id,
        jobId
      }
    });

    if (existingApplication) {
      throw new HttpError(400, 'You have already applied to this job');
    }

    // Create application record
    const application = await context.entities.JobApplication.create({
      data: {
        user: { connect: { id: context.user.id } },
        job: { connect: { id: jobId } },
        ...(resumeId ? { resume: { connect: { id: resumeId } } } : {}),
        ...(coverLetterId ? { coverLetter: { connect: { id: coverLetterId } } } : {}),
        status: 'applied'
      }
    });

    return application;
  } catch (error: any) {
    console.error('Error applying to job:', error);
    throw new HttpError(500, 'Failed to apply to job: ' + error.message);
  }
};
