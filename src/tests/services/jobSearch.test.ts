import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { jobSearchService } from '../../services/jobSearch';
import { JobSearchParams, JobSearchResult } from '../../types/jobSearch';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}));

import axios from 'axios';

describe('JobSearchService', () => {
  const mockJobSearchParams: JobSearchParams = {
    query: 'software engineer',
    location: 'San Francisco, CA',
    radius: 25,
    jobType: 'fulltime',
    datePosted: 'week',
    remoteOnly: true,
    page: 1,
    pageSize: 10
  };

  const mockJobSearchResults: JobSearchResult[] = [
    {
      id: 'job1',
      title: 'Senior Software Engineer',
      company: 'Tech Company A',
      location: 'San Francisco, CA',
      description: 'We are looking for a skilled Software Engineer...',
      salary: '$120,000 - $150,000',
      datePosted: '2025-03-10T12:00:00Z',
      jobType: 'Full-time',
      url: 'https://example.com/job1',
      isRemote: true,
      skills: ['JavaScript', 'React', 'Node.js'],
      source: 'Google Jobs'
    },
    {
      id: 'job2',
      title: 'Full Stack Developer',
      company: 'Tech Company B',
      location: 'Remote',
      description: 'Join our team as a Full Stack Developer...',
      salary: '$100,000 - $130,000',
      datePosted: '2025-03-12T10:00:00Z',
      jobType: 'Full-time',
      url: 'https://example.com/job2',
      isRemote: true,
      skills: ['TypeScript', 'React', 'Express'],
      source: 'Google Jobs'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchJobs', () => {
    it('should return job search results', async () => {
      // Mock the axios.get response
      (axios.get as any).mockResolvedValueOnce({
        data: {
          jobs: mockJobSearchResults,
          totalResults: 2,
          totalPages: 1
        }
      });

      const result = await jobSearchService.searchJobs(mockJobSearchParams);

      expect(result).toEqual({
        jobs: mockJobSearchResults,
        totalResults: 2,
        totalPages: 1
      });

      expect(axios.get).toHaveBeenCalledWith('/api/jobs/search', {
        params: mockJobSearchParams
      });
    });

    it('should handle errors during job search', async () => {
      // Mock the axios.get to throw an error
      (axios.get as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(jobSearchService.searchJobs(mockJobSearchParams)).rejects.toThrow('Network error');
    });
  });

  describe('getJobDetails', () => {
    it('should return job details', async () => {
      const jobId = 'job1';
      const mockJobDetails = mockJobSearchResults[0];

      // Mock the axios.get response
      (axios.get as any).mockResolvedValueOnce({
        data: mockJobDetails
      });

      const result = await jobSearchService.getJobDetails(jobId);

      expect(result).toEqual(mockJobDetails);
      expect(axios.get).toHaveBeenCalledWith(`/api/jobs/${jobId}`);
    });

    it('should handle errors when fetching job details', async () => {
      const jobId = 'job1';

      // Mock the axios.get to throw an error
      (axios.get as any).mockRejectedValueOnce(new Error('Job not found'));

      await expect(jobSearchService.getJobDetails(jobId)).rejects.toThrow('Job not found');
    });
  });

  describe('getSimilarJobs', () => {
    it('should return similar jobs', async () => {
      const jobId = 'job1';

      // Mock the axios.get response
      (axios.get as any).mockResolvedValueOnce({
        data: {
          jobs: [mockJobSearchResults[1]],
          totalResults: 1
        }
      });

      const result = await jobSearchService.getSimilarJobs(jobId);

      expect(result).toEqual({
        jobs: [mockJobSearchResults[1]],
        totalResults: 1
      });
      expect(axios.get).toHaveBeenCalledWith(`/api/jobs/${jobId}/similar`);
    });

    it('should handle errors when fetching similar jobs', async () => {
      const jobId = 'job1';

      // Mock the axios.get to throw an error
      (axios.get as any).mockRejectedValueOnce(new Error('Failed to fetch similar jobs'));

      await expect(jobSearchService.getSimilarJobs(jobId)).rejects.toThrow('Failed to fetch similar jobs');
    });
  });

  describe('saveJob', () => {
    it('should save a job', async () => {
      const jobId = 'job1';
      const userId = 'user1';

      // Mock the axios.post response
      (axios.post as any) = vi.fn().mockResolvedValueOnce({
        data: { success: true }
      });

      const result = await jobSearchService.saveJob(jobId, userId);

      expect(result).toEqual({ success: true });
      expect(axios.post).toHaveBeenCalledWith('/api/jobs/save', { jobId, userId });
    });

    it('should handle errors when saving a job', async () => {
      const jobId = 'job1';
      const userId = 'user1';

      // Mock the axios.post to throw an error
      (axios.post as any) = vi.fn().mockRejectedValueOnce(new Error('Failed to save job'));

      await expect(jobSearchService.saveJob(jobId, userId)).rejects.toThrow('Failed to save job');
    });
  });

  describe('unsaveJob', () => {
    it('should unsave a job', async () => {
      const jobId = 'job1';
      const userId = 'user1';

      // Mock the axios.delete response
      (axios.delete as any) = vi.fn().mockResolvedValueOnce({
        data: { success: true }
      });

      const result = await jobSearchService.unsaveJob(jobId, userId);

      expect(result).toEqual({ success: true });
      expect(axios.delete).toHaveBeenCalledWith('/api/jobs/save', {
        data: { jobId, userId }
      });
    });

    it('should handle errors when unsaving a job', async () => {
      const jobId = 'job1';
      const userId = 'user1';

      // Mock the axios.delete to throw an error
      (axios.delete as any) = vi.fn().mockRejectedValueOnce(new Error('Failed to unsave job'));

      await expect(jobSearchService.unsaveJob(jobId, userId)).rejects.toThrow('Failed to unsave job');
    });
  });
});
