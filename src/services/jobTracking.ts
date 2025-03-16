import axios from 'axios';
import { JobApplication, JobStatus } from '../types/jobTracking';

/**
 * Service for managing job applications and tracking
 */
export const jobTrackingService = {
  /**
   * Get all job applications for a user
   * @param userId The user ID
   * @returns Promise resolving to an array of job applications
   */
  async getApplications(userId: string): Promise<JobApplication[]> {
    try {
      const response = await axios.get(`/api/applications?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }
  },

  /**
   * Get a specific job application by ID
   * @param applicationId The application ID
   * @returns Promise resolving to the job application
   */
  async getApplicationById(applicationId: string): Promise<JobApplication> {
    try {
      const response = await axios.get(`/api/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job application:', error);
      throw error;
    }
  },

  /**
   * Create a new job application
   * @param application The application data
   * @returns Promise resolving to the created job application
   */
  async createApplication(application: Partial<JobApplication>): Promise<JobApplication> {
    try {
      const response = await axios.post('/api/applications', application);
      return response.data;
    } catch (error) {
      console.error('Error creating job application:', error);
      throw error;
    }
  },

  /**
   * Update an existing job application
   * @param applicationId The application ID
   * @param updates The updates to apply
   * @returns Promise resolving to the updated job application
   */
  async updateApplication(
    applicationId: string,
    updates: Partial<JobApplication>
  ): Promise<JobApplication> {
    try {
      const response = await axios.put(`/api/applications/${applicationId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating job application:', error);
      throw error;
    }
  },

  /**
   * Delete a job application
   * @param applicationId The application ID
   * @returns Promise resolving to a success indicator
   */
  async deleteApplication(applicationId: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(`/api/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting job application:', error);
      throw error;
    }
  },

  /**
   * Add an interview to a job application
   * @param applicationId The application ID
   * @param interview The interview data
   * @returns Promise resolving to the updated job application
   */
  async addInterview(
    applicationId: string,
    interview: any
  ): Promise<JobApplication> {
    try {
      const response = await axios.post(`/api/applications/${applicationId}/interviews`, interview);
      return response.data;
    } catch (error) {
      console.error('Error adding interview:', error);
      throw error;
    }
  },

  /**
   * Add a contact to a job application
   * @param applicationId The application ID
   * @param contact The contact data
   * @returns Promise resolving to the updated job application
   */
  async addContact(
    applicationId: string,
    contact: any
  ): Promise<JobApplication> {
    try {
      const response = await axios.post(`/api/applications/${applicationId}/contacts`, contact);
      return response.data;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  }
};
