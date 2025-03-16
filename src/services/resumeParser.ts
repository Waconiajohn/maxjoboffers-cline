import axios from 'axios';

// Import fileUploads from wasp/server if available, otherwise use a mock
let fileUploads: { uploadFile: (file: File) => Promise<{ url: string }> };

try {
  // Try to import from wasp/server
  const waspServer = require('wasp/server');
  fileUploads = waspServer.fileUploads;
} catch (error) {
  // If import fails, use a mock implementation for testing
  fileUploads = {
    uploadFile: async (file: File) => ({ url: 'https://example.com/mock-file-url' })
  };
}

/**
 * Service for parsing and analyzing resumes
 */
export const resumeParserService = {
  /**
   * Parse a resume file
   * @param file The resume file to parse
   * @returns Promise resolving to the parsed resume data
   */
  async parseResumeFile(file: File): Promise<any> {
    try {
      // Upload the file first
      const uploadResult = await fileUploads.uploadFile(file);
      
      // Then parse the uploaded file
      const response = await axios.post('/api/resume/parse', {
        fileUrl: uploadResult.url
      });
      
      return response.data;
    } catch (error) {
      console.error('Error parsing resume file:', error);
      throw error;
    }
  },

  /**
   * Parse resume text content
   * @param text The resume text content to parse
   * @returns Promise resolving to the parsed resume data
   */
  async parseResumeText(text: string): Promise<any> {
    try {
      const response = await axios.post('/api/resume/parse-text', {
        text
      });
      
      return response.data;
    } catch (error) {
      console.error('Error parsing resume text:', error);
      throw error;
    }
  },

  /**
   * Get keywords from a job description
   * @param jobDescription The job description to extract keywords from
   * @returns Promise resolving to an array of keywords
   */
  async getResumeKeywords(jobDescription: string): Promise<string[]> {
    try {
      const response = await axios.post('/api/resume/keywords', {
        jobDescription
      });
      
      return response.data.keywords;
    } catch (error) {
      console.error('Error getting resume keywords:', error);
      throw error;
    }
  },

  /**
   * Analyze how well a resume matches a job description
   * @param resumeId The ID of the resume to analyze
   * @param jobDescription The job description to match against
   * @returns Promise resolving to the analysis result
   */
  async analyzeResumeMatch(resumeId: string, jobDescription: string): Promise<any> {
    try {
      const response = await axios.post('/api/resume/analyze-match', {
        resumeId,
        jobDescription
      });
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing resume match:', error);
      throw error;
    }
  },

  /**
   * Extract skills from resume content
   * @param content The resume content to extract skills from
   * @returns Promise resolving to an array of skills
   */
  async extractSkills(content: string): Promise<string[]> {
    try {
      const response = await axios.post('/api/resume/extract-skills', {
        content
      });
      
      return response.data.skills;
    } catch (error) {
      console.error('Error extracting skills:', error);
      throw error;
    }
  }
};
