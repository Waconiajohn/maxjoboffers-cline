import axios from 'axios';
import { CoverLetter, CoverLetterStyle, CoverLetterGenerationOptions } from '../types/coverLetter';

/**
 * Service for generating and managing cover letters
 */
export const coverLetterGeneratorService = {
  /**
   * Generate a cover letter based on resume, job description, and company information
   * @param options The generation options
   * @returns Promise resolving to the generated cover letter
   */
  async generateCoverLetter(options: CoverLetterGenerationOptions): Promise<CoverLetter> {
    try {
      const response = await axios.post('/api/cover-letters/generate', options);
      return response.data;
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw error;
    }
  },

  /**
   * Get a cover letter by ID
   * @param coverLetterId The cover letter ID
   * @returns Promise resolving to the cover letter
   */
  async getCoverLetterById(coverLetterId: string): Promise<CoverLetter> {
    try {
      const response = await axios.get(`/api/cover-letters/${coverLetterId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cover letter:', error);
      throw error;
    }
  },

  /**
   * Get all cover letters for a user
   * @param userId The user ID
   * @returns Promise resolving to an array of cover letters
   */
  async getUserCoverLetters(userId: string): Promise<CoverLetter[]> {
    try {
      const response = await axios.get(`/api/cover-letters?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user cover letters:', error);
      throw error;
    }
  },

  /**
   * Update a cover letter
   * @param coverLetterId The cover letter ID
   * @param updates The updates to apply
   * @returns Promise resolving to the updated cover letter
   */
  async updateCoverLetter(
    coverLetterId: string,
    updates: Partial<CoverLetter>
  ): Promise<CoverLetter> {
    try {
      const response = await axios.put(`/api/cover-letters/${coverLetterId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating cover letter:', error);
      throw error;
    }
  },

  /**
   * Delete a cover letter
   * @param coverLetterId The cover letter ID
   * @returns Promise resolving to a success indicator
   */
  async deleteCoverLetter(coverLetterId: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(`/api/cover-letters/${coverLetterId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      throw error;
    }
  },

  /**
   * Change the style of a cover letter
   * @param coverLetterId The cover letter ID
   * @param style The new style
   * @returns Promise resolving to the updated cover letter
   */
  async changeCoverLetterStyle(
    coverLetterId: string,
    style: CoverLetterStyle
  ): Promise<CoverLetter> {
    try {
      const response = await axios.post(`/api/cover-letters/${coverLetterId}/style`, { style });
      return response.data;
    } catch (error) {
      console.error('Error changing cover letter style:', error);
      throw error;
    }
  },

  /**
   * Export a cover letter to a specific file format
   * @param coverLetterId The cover letter ID
   * @param fileFormat The file format (pdf, docx, etc.)
   * @returns Promise resolving to the export result
   */
  async exportCoverLetter(
    coverLetterId: string,
    fileFormat: 'pdf' | 'docx' | 'txt'
  ): Promise<{ url: string; filename: string }> {
    try {
      const response = await axios.get(
        `/api/cover-letters/${coverLetterId}/export?format=${fileFormat}`,
        {
          responseType: 'blob'
        }
      );
      
      const url = URL.createObjectURL(response.data);
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `cover-letter.${fileFormat}`;
      
      return { url, filename };
    } catch (error) {
      console.error('Error exporting cover letter:', error);
      throw error;
    }
  },

  /**
   * Analyze a cover letter for improvement suggestions
   * @param coverLetterId The cover letter ID
   * @returns Promise resolving to the analysis result
   */
  async analyzeCoverLetter(coverLetterId: string): Promise<{
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    tone: string;
    readabilityScore: number;
  }> {
    try {
      const response = await axios.get(`/api/cover-letters/${coverLetterId}/analyze`);
      return response.data;
    } catch (error) {
      console.error('Error analyzing cover letter:', error);
      throw error;
    }
  }
};
