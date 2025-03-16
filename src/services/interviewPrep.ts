import axios from 'axios';
import { 
  InterviewPrepRequest, 
  InterviewPrepResponse, 
  InterviewPrepSession,
  InterviewFeedback,
  InterviewType,
  DifficultyLevel
} from '../types/interviewPrep';

/**
 * Service for generating and managing interview preparation
 */
export const interviewPrepService = {
  /**
   * Generate interview preparation based on job description and other parameters
   * @param request The interview preparation request
   * @returns Promise resolving to the generated interview preparation
   */
  async generateInterviewPrep(request: InterviewPrepRequest): Promise<InterviewPrepResponse> {
    try {
      const response = await axios.post('/api/interview-prep/generate', request);
      return response.data;
    } catch (error) {
      console.error('Error generating interview preparation:', error);
      throw error;
    }
  },

  /**
   * Get interview preparation by ID
   * @param prepId The preparation ID
   * @returns Promise resolving to the interview preparation
   */
  async getInterviewPrepById(prepId: string): Promise<InterviewPrepResponse> {
    try {
      const response = await axios.get(`/api/interview-prep/${prepId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching interview preparation:', error);
      throw error;
    }
  },

  /**
   * Get all interview preparations for a user
   * @param userId The user ID
   * @returns Promise resolving to an array of interview preparations
   */
  async getUserInterviewPreps(userId: string): Promise<InterviewPrepResponse[]> {
    try {
      const response = await axios.get(`/api/interview-prep?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user interview preparations:', error);
      throw error;
    }
  },

  /**
   * Update an interview preparation
   * @param prepId The preparation ID
   * @param updates The updates to apply
   * @returns Promise resolving to the updated interview preparation
   */
  async updateInterviewPrep(
    prepId: string,
    updates: Partial<InterviewPrepResponse>
  ): Promise<InterviewPrepResponse> {
    try {
      const response = await axios.put(`/api/interview-prep/${prepId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating interview preparation:', error);
      throw error;
    }
  },

  /**
   * Delete an interview preparation
   * @param prepId The preparation ID
   * @returns Promise resolving to a success indicator
   */
  async deleteInterviewPrep(prepId: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(`/api/interview-prep/${prepId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting interview preparation:', error);
      throw error;
    }
  },

  /**
   * Start an interview preparation session
   * @param prepId The preparation ID
   * @param userId The user ID
   * @returns Promise resolving to the created session
   */
  async startInterviewSession(
    prepId: string,
    userId: string
  ): Promise<InterviewPrepSession> {
    try {
      const response = await axios.post('/api/interview-prep/sessions', {
        prepId,
        userId,
        startTime: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error starting interview session:', error);
      throw error;
    }
  },

  /**
   * End an interview preparation session
   * @param sessionId The session ID
   * @returns Promise resolving to the updated session
   */
  async endInterviewSession(sessionId: string): Promise<InterviewPrepSession> {
    try {
      const response = await axios.put(`/api/interview-prep/sessions/${sessionId}/end`, {
        endTime: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error ending interview session:', error);
      throw error;
    }
  },

  /**
   * Save answer for a question in an interview session
   * @param sessionId The session ID
   * @param questionId The question ID
   * @param answer The user's answer
   * @returns Promise resolving to the updated session
   */
  async saveQuestionAnswer(
    sessionId: string,
    questionId: string,
    answer: string
  ): Promise<InterviewPrepSession> {
    try {
      const response = await axios.put(`/api/interview-prep/sessions/${sessionId}/questions/${questionId}`, {
        userAnswer: answer
      });
      return response.data;
    } catch (error) {
      console.error('Error saving question answer:', error);
      throw error;
    }
  },

  /**
   * Get feedback for an interview session
   * @param sessionId The session ID
   * @returns Promise resolving to the feedback
   */
  async getSessionFeedback(sessionId: string): Promise<InterviewFeedback> {
    try {
      const response = await axios.get(`/api/interview-prep/sessions/${sessionId}/feedback`);
      return response.data;
    } catch (error) {
      console.error('Error getting session feedback:', error);
      throw error;
    }
  },

  /**
   * Generate feedback for an interview session
   * @param sessionId The session ID
   * @returns Promise resolving to the generated feedback
   */
  async generateSessionFeedback(sessionId: string): Promise<InterviewFeedback> {
    try {
      const response = await axios.post(`/api/interview-prep/sessions/${sessionId}/feedback`);
      return response.data;
    } catch (error) {
      console.error('Error generating session feedback:', error);
      throw error;
    }
  },

  /**
   * Get additional practice questions based on interview type and difficulty
   * @param interviewType The interview type
   * @param difficultyLevel The difficulty level
   * @param count The number of questions to get
   * @returns Promise resolving to an array of practice questions
   */
  async getPracticeQuestions(
    interviewType: InterviewType,
    difficultyLevel: DifficultyLevel,
    count: number = 5
  ): Promise<any[]> {
    try {
      const response = await axios.get('/api/interview-prep/practice-questions', {
        params: {
          type: interviewType,
          difficulty: difficultyLevel,
          count
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting practice questions:', error);
      throw error;
    }
  },

  /**
   * Get company research information
   * @param companyName The company name
   * @returns Promise resolving to the company research information
   */
  async getCompanyResearch(companyName: string): Promise<any> {
    try {
      const response = await axios.get(`/api/interview-prep/company-research?name=${encodeURIComponent(companyName)}`);
      return response.data;
    } catch (error) {
      console.error('Error getting company research:', error);
      throw error;
    }
  }
};
