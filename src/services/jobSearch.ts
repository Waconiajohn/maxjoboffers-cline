import axios from 'axios';
import { Job, JobSearchParams, JobSearchResult } from '../types/jobSearch';

/**
 * Service for searching and retrieving job listings
 */
export const jobSearchService = {
  /**
   * Search for jobs based on the provided parameters
   * @param params The search parameters
   * @returns Promise resolving to the search results
   */
  async searchJobs(params: JobSearchParams): Promise<JobSearchResult> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.query) {
        queryParams.append('q', params.query);
      }
      
      if (params.location) {
        queryParams.append('location', params.location);
      }
      
      if (params.radius) {
        queryParams.append('radius', params.radius.toString());
      }
      
      if (params.jobType) {
        queryParams.append('jobType', params.jobType);
      }
      
      if (params.datePosted) {
        queryParams.append('datePosted', params.datePosted);
      }
      
      if (params.salary) {
        queryParams.append('salary', params.salary.toString());
      }
      
      if (params.page) {
        queryParams.append('page', params.page.toString());
      }
      
      if (params.pageSize) {
        queryParams.append('pageSize', params.pageSize.toString());
      }
      
      if (params.sortBy) {
        queryParams.append('sortBy', params.sortBy);
      }
      
      const response = await axios.get(`/api/jobs/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  /**
   * Get job details by ID
   * @param jobId The job ID
   * @returns Promise resolving to the job details
   */
  async getJobById(jobId: string): Promise<Job> {
    try {
      const response = await axios.get(`/api/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  },

  /**
   * Get similar jobs based on a job ID
   * @param jobId The job ID
   * @param limit The maximum number of similar jobs to return
   * @returns Promise resolving to an array of similar jobs
   */
  async getSimilarJobs(jobId: string, limit: number = 5): Promise<Job[]> {
    try {
      const response = await axios.get(`/api/jobs/${jobId}/similar?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar jobs:', error);
      throw error;
    }
  },

  /**
   * Save a job to the user's saved jobs list
   * @param jobId The job ID
   * @param userId The user ID
   * @returns Promise resolving to the saved job
   */
  async saveJob(jobId: string, userId: string): Promise<Job> {
    try {
      const response = await axios.post('/api/jobs/saved', { jobId, userId });
      return response.data;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  /**
   * Remove a job from the user's saved jobs list
   * @param jobId The job ID
   * @param userId The user ID
   * @returns Promise resolving to a success indicator
   */
  async unsaveJob(jobId: string, userId: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(`/api/jobs/saved/${jobId}?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing saved job:', error);
      throw error;
    }
  },

  /**
   * Get the user's saved jobs
   * @param userId The user ID
   * @returns Promise resolving to an array of saved jobs
   */
  async getSavedJobs(userId: string): Promise<Job[]> {
    try {
      const response = await axios.get(`/api/jobs/saved?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  },

  /**
   * Get job recommendations based on the user's profile and history
   * @param userId The user ID
   * @param limit The maximum number of recommendations to return
   * @returns Promise resolving to an array of recommended jobs
   */
  async getRecommendedJobs(userId: string, limit: number = 10): Promise<Job[]> {
    try {
      const response = await axios.get(`/api/jobs/recommended?userId=${userId}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
      throw error;
    }
  }
};
