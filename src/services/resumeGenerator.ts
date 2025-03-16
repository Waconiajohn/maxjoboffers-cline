import axios from 'axios';
import { Resume, ResumeFormat, ResumeAnalysisResult } from '../types/resume';

/**
 * Service for generating and managing resumes
 */
export const resumeGeneratorService = {
  /**
   * Generate a resume based on user profile and job description
   * @param userId The user ID
   * @param jobDescription The job description
   * @param options Additional options for resume generation
   * @returns Promise resolving to the generated resume
   */
  async generateResume(
    userId: string,
    jobDescription: string,
    options: {
      format?: ResumeFormat;
      emphasizeSkills?: string[];
      includeProjects?: boolean;
      customSections?: { title: string; content: string }[];
    } = {}
  ): Promise<Resume> {
    try {
      const response = await axios.post('/api/resumes/generate', {
        userId,
        jobDescription,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('Error generating resume:', error);
      throw error;
    }
  },

  /**
   * Analyze a resume against a job description
   * @param resumeId The resume ID
   * @param jobDescription The job description
   * @returns Promise resolving to the analysis result
   */
  async analyzeResume(resumeId: string, jobDescription: string): Promise<ResumeAnalysisResult> {
    try {
      const response = await axios.post(`/api/resumes/${resumeId}/analyze`, {
        jobDescription
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw error;
    }
  },

  /**
   * Get a resume by ID
   * @param resumeId The resume ID
   * @returns Promise resolving to the resume
   */
  async getResumeById(resumeId: string): Promise<Resume> {
    try {
      const response = await axios.get(`/api/resumes/${resumeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw error;
    }
  },

  /**
   * Get all resumes for a user
   * @param userId The user ID
   * @returns Promise resolving to an array of resumes
   */
  async getUserResumes(userId: string): Promise<Resume[]> {
    try {
      const response = await axios.get(`/api/resumes?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user resumes:', error);
      throw error;
    }
  },

  /**
   * Update a resume
   * @param resumeId The resume ID
   * @param updates The updates to apply
   * @returns Promise resolving to the updated resume
   */
  async updateResume(resumeId: string, updates: Partial<Resume>): Promise<Resume> {
    try {
      const response = await axios.put(`/api/resumes/${resumeId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating resume:', error);
      throw error;
    }
  },

  /**
   * Delete a resume
   * @param resumeId The resume ID
   * @returns Promise resolving to a success indicator
   */
  async deleteResume(resumeId: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(`/api/resumes/${resumeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  },

  /**
   * Change the format of a resume
   * @param resumeId The resume ID
   * @param format The new format
   * @returns Promise resolving to the updated resume
   */
  async changeResumeFormat(resumeId: string, format: ResumeFormat): Promise<Resume> {
    try {
      const response = await axios.post(`/api/resumes/${resumeId}/format`, { format });
      return response.data;
    } catch (error) {
      console.error('Error changing resume format:', error);
      throw error;
    }
  },

  /**
   * Export a resume to a specific file format
   * @param resumeId The resume ID
   * @param fileFormat The file format (pdf, docx, etc.)
   * @returns Promise resolving to the export result
   */
  async exportResume(
    resumeId: string,
    fileFormat: 'pdf' | 'docx' | 'txt'
  ): Promise<{ url: string; filename: string }> {
    try {
      const response = await axios.get(`/api/resumes/${resumeId}/export?format=${fileFormat}`, {
        responseType: 'blob'
      });
      
      const url = URL.createObjectURL(response.data);
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `resume.${fileFormat}`;
      
      return { url, filename };
    } catch (error) {
      console.error('Error exporting resume:', error);
      throw error;
    }
  }
};
