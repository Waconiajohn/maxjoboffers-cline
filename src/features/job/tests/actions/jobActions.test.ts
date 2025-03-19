import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { searchJobs, applyToJob } from './job';
import { HttpError } from 'wasp/server';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({
    data: {
      jobs: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Innovations Inc.',
          location: 'San Francisco, CA',
          description: 'We are looking for a Senior Software Engineer to join our team.',
          requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience.',
          salary: { min: 120000, max: 160000 },
          applicationUrl: 'https://example.com/apply',
          source: 'google'
        }
      ],
      totalCount: 1
    }
  })
}));

// Mock context
const mockContext = {
  user: { id: 'user-123' },
  entities: {
    Job: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn()
    },
    Resume: {
      findUnique: jest.fn()
    },
    CoverLetter: {
      findUnique: jest.fn()
    },
    JobApplication: {
      findFirst: jest.fn(),
      create: jest.fn()
    }
  }
};

describe('Job Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_JOBS_API_KEY = 'test-google-jobs-api-key';
  });

  describe('searchJobs', () => {
    it('should search jobs successfully', async () => {
      // Mock Job.findFirst to return null (job doesn't exist yet)
      mockContext.entities.Job.findFirst.mockResolvedValue(null);
      
      // Mock Job.create to return a new job
      mockContext.entities.Job.create.mockImplementation((data) => ({
        id: 'job-123',
        ...data.data,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      const result = await searchJobs(
        { 
          query: 'software engineer', 
          location: 'San Francisco, CA',
          radius: 25,
          filters: {
            workType: 'FULL_TIME',
            datePosted: 'PAST_MONTH'
          }
        },
        mockContext
      );

      expect(result).toHaveProperty('jobs');
      expect(result).toHaveProperty('totalCount');
      expect(result.jobs.length).toBeGreaterThan(0);
      expect(mockContext.entities.Job.create).toHaveBeenCalled();
    });

    it('should return existing jobs if they already exist', async () => {
      // Mock Job.findFirst to return an existing job
      const existingJob = {
        id: 'job-123',
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.',
        location: 'San Francisco, CA',
        description: 'We are looking for a Senior Software Engineer to join our team.',
        requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience.',
        salary: { min: 120000, max: 160000 },
        applicationUrl: 'https://example.com/apply',
        source: 'google',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockContext.entities.Job.findFirst.mockResolvedValue(existingJob);

      const result = await searchJobs(
        { 
          query: 'software engineer', 
          location: 'San Francisco, CA' 
        },
        mockContext
      );

      expect(result).toHaveProperty('jobs');
      expect(result.jobs[0]).toEqual(existingJob);
      expect(mockContext.entities.Job.create).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not authenticated', async () => {
      await expect(
        searchJobs(
          { query: 'software engineer', location: 'San Francisco, CA' },
          { ...mockContext, user: null }
        )
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if Google Jobs API key is not configured', async () => {
      process.env.GOOGLE_JOBS_API_KEY = '';

      await expect(
        searchJobs(
          { query: 'software engineer', location: 'San Francisco, CA' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });
  });

  describe('applyToJob', () => {
    it('should apply to a job successfully', async () => {
      // Mock Job.findUnique to return a job
      mockContext.entities.Job.findUnique.mockResolvedValue({
        id: 'job-123',
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.'
      });

      // Mock Resume.findUnique to return a resume
      mockContext.entities.Resume.findUnique.mockResolvedValue({
        id: 'resume-123',
        userId: 'user-123',
        title: 'My Resume'
      });

      // Mock CoverLetter.findUnique to return a cover letter
      mockContext.entities.CoverLetter.findUnique.mockResolvedValue({
        id: 'cover-letter-123',
        userId: 'user-123',
        title: 'My Cover Letter'
      });

      // Mock JobApplication.findFirst to return null (no existing application)
      mockContext.entities.JobApplication.findFirst.mockResolvedValue(null);

      // Mock JobApplication.create to return a new application
      mockContext.entities.JobApplication.create.mockImplementation((data) => ({
        id: 'application-123',
        userId: 'user-123',
        jobId: 'job-123',
        resumeId: 'resume-123',
        coverLetterId: 'cover-letter-123',
        status: 'applied',
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      const result = await applyToJob(
        { 
          jobId: 'job-123', 
          resumeId: 'resume-123', 
          coverLetterId: 'cover-letter-123' 
        },
        mockContext
      );

      expect(result).toHaveProperty('id', 'application-123');
      expect(result).toHaveProperty('status', 'applied');
      expect(mockContext.entities.JobApplication.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if job is not found', async () => {
      mockContext.entities.Job.findUnique.mockResolvedValue(null);

      await expect(
        applyToJob(
          { jobId: 'non-existent' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if resume is not found', async () => {
      mockContext.entities.Job.findUnique.mockResolvedValue({
        id: 'job-123',
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.'
      });

      mockContext.entities.Resume.findUnique.mockResolvedValue(null);

      await expect(
        applyToJob(
          { jobId: 'job-123', resumeId: 'non-existent' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if resume does not belong to user', async () => {
      mockContext.entities.Job.findUnique.mockResolvedValue({
        id: 'job-123',
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.'
      });

      mockContext.entities.Resume.findUnique.mockResolvedValue({
        id: 'resume-123',
        userId: 'different-user',
        title: 'My Resume'
      });

      await expect(
        applyToJob(
          { jobId: 'job-123', resumeId: 'resume-123' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if cover letter is not found', async () => {
      mockContext.entities.Job.findUnique.mockResolvedValue({
        id: 'job-123',
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.'
      });

      mockContext.entities.Resume.findUnique.mockResolvedValue({
        id: 'resume-123',
        userId: 'user-123',
        title: 'My Resume'
      });

      mockContext.entities.CoverLetter.findUnique.mockResolvedValue(null);

      await expect(
        applyToJob(
          { jobId: 'job-123', resumeId: 'resume-123', coverLetterId: 'non-existent' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if cover letter does not belong to user', async () => {
      mockContext.entities.Job.findUnique.mockResolvedValue({
        id: 'job-123',
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.'
      });

      mockContext.entities.Resume.findUnique.mockResolvedValue({
        id: 'resume-123',
        userId: 'user-123',
        title: 'My Resume'
      });

      mockContext.entities.CoverLetter.findUnique.mockResolvedValue({
        id: 'cover-letter-123',
        userId: 'different-user',
        title: 'My Cover Letter'
      });

      await expect(
        applyToJob(
          { jobId: 'job-123', resumeId: 'resume-123', coverLetterId: 'cover-letter-123' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if user has already applied to the job', async () => {
      mockContext.entities.Job.findUnique.mockResolvedValue({
        id: 'job-123',
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.'
      });

      mockContext.entities.JobApplication.findFirst.mockResolvedValue({
        id: 'application-123',
        userId: 'user-123',
        jobId: 'job-123',
        status: 'applied'
      });

      await expect(
        applyToJob(
          { jobId: 'job-123' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if user is not authenticated', async () => {
      await expect(
        applyToJob(
          { jobId: 'job-123' },
          { ...mockContext, user: null }
        )
      ).rejects.toThrow(HttpError);
    });
  });
});
