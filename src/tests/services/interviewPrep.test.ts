import { describe, it, expect, vi, beforeEach } from 'vitest';
import { interviewPrepService } from '../../services/interviewPrep';
import { 
  InterviewPrepRequest, 
  InterviewType, 
  DifficultyLevel,
  InterviewPrepSession,
  InterviewFeedback
} from '../../types/interviewPrep';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

import axios from 'axios';

describe('interviewPrepService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateInterviewPrep', () => {
    it('should generate interview preparation', async () => {
      const mockRequest: InterviewPrepRequest = {
        userId: 'user123',
        jobDescription: 'This is a job description',
        jobTitle: 'Software Engineer',
        company: 'Tech Company',
        resumeId: 'resume123',
        interviewType: InterviewType.BEHAVIORAL,
        difficultyLevel: DifficultyLevel.MEDIUM,
        focusAreas: ['Leadership', 'Problem Solving']
      };

      const mockResponse = {
        id: 'prep123',
        userId: 'user123',
        jobTitle: 'Software Engineer',
        company: 'Tech Company',
        createdAt: '2025-03-15T12:00:00Z',
        updatedAt: '2025-03-15T12:00:00Z',
        interviewType: InterviewType.BEHAVIORAL,
        difficultyLevel: DifficultyLevel.MEDIUM,
        questions: [
          {
            id: 'q1',
            question: 'Tell me about a time you faced a challenge.',
            type: InterviewType.BEHAVIORAL,
            difficultyLevel: DifficultyLevel.MEDIUM,
            category: 'Problem Solving',
            suggestedAnswer: 'Your answer should include a specific situation...'
          }
        ],
        keySkills: ['Communication', 'Problem Solving'],
        preparationTips: ['Research the company', 'Practice your answers'],
        commonMistakes: ['Not providing specific examples'],
        suggestedTopics: ['Company culture', 'Technical skills']
      };

      (axios.post as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await interviewPrepService.generateInterviewPrep(mockRequest);

      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith('/api/interview-prep/generate', mockRequest);
    });

    it('should handle errors when generating interview preparation', async () => {
      const mockRequest: InterviewPrepRequest = {
        userId: 'user123',
        jobDescription: 'This is a job description',
        interviewType: InterviewType.BEHAVIORAL,
        difficultyLevel: DifficultyLevel.MEDIUM
      };

      (axios.post as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(interviewPrepService.generateInterviewPrep(mockRequest)).rejects.toThrow('API Error');
    });
  });

  describe('getInterviewPrepById', () => {
    it('should get interview preparation by ID', async () => {
      const mockPrepId = 'prep123';
      const mockResponse = {
        id: mockPrepId,
        userId: 'user123',
        jobTitle: 'Software Engineer',
        company: 'Tech Company',
        createdAt: '2025-03-15T12:00:00Z',
        updatedAt: '2025-03-15T12:00:00Z',
        interviewType: InterviewType.BEHAVIORAL,
        difficultyLevel: DifficultyLevel.MEDIUM,
        questions: []
      };

      (axios.get as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await interviewPrepService.getInterviewPrepById(mockPrepId);

      expect(result).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(`/api/interview-prep/${mockPrepId}`);
    });

    it('should handle errors when getting interview preparation by ID', async () => {
      const mockPrepId = 'prep123';

      (axios.get as any).mockRejectedValueOnce(new Error('Not found'));

      await expect(interviewPrepService.getInterviewPrepById(mockPrepId)).rejects.toThrow('Not found');
    });
  });

  describe('getUserInterviewPreps', () => {
    it('should get all interview preparations for a user', async () => {
      const mockUserId = 'user123';
      const mockResponse = [
        {
          id: 'prep123',
          userId: mockUserId,
          jobTitle: 'Software Engineer',
          company: 'Tech Company',
          createdAt: '2025-03-15T12:00:00Z',
          updatedAt: '2025-03-15T12:00:00Z',
          interviewType: InterviewType.BEHAVIORAL,
          difficultyLevel: DifficultyLevel.MEDIUM,
          questions: []
        },
        {
          id: 'prep456',
          userId: mockUserId,
          jobTitle: 'Frontend Developer',
          company: 'Web Company',
          createdAt: '2025-03-14T12:00:00Z',
          updatedAt: '2025-03-14T12:00:00Z',
          interviewType: InterviewType.TECHNICAL,
          difficultyLevel: DifficultyLevel.HARD,
          questions: []
        }
      ];

      (axios.get as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await interviewPrepService.getUserInterviewPreps(mockUserId);

      expect(result).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(`/api/interview-prep?userId=${mockUserId}`);
    });

    it('should handle errors when getting user interview preparations', async () => {
      const mockUserId = 'user123';

      (axios.get as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(interviewPrepService.getUserInterviewPreps(mockUserId)).rejects.toThrow('API Error');
    });
  });

  describe('updateInterviewPrep', () => {
    it('should update an interview preparation', async () => {
      const mockPrepId = 'prep123';
      const mockUpdates = {
        jobTitle: 'Updated Job Title',
        company: 'Updated Company'
      };
      const mockResponse = {
        id: mockPrepId,
        userId: 'user123',
        jobTitle: 'Updated Job Title',
        company: 'Updated Company',
        createdAt: '2025-03-15T12:00:00Z',
        updatedAt: '2025-03-15T13:00:00Z',
        interviewType: InterviewType.BEHAVIORAL,
        difficultyLevel: DifficultyLevel.MEDIUM,
        questions: []
      };

      (axios.put as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await interviewPrepService.updateInterviewPrep(mockPrepId, mockUpdates);

      expect(result).toEqual(mockResponse);
      expect(axios.put).toHaveBeenCalledWith(`/api/interview-prep/${mockPrepId}`, mockUpdates);
    });

    it('should handle errors when updating interview preparation', async () => {
      const mockPrepId = 'prep123';
      const mockUpdates = {
        jobTitle: 'Updated Job Title'
      };

      (axios.put as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(interviewPrepService.updateInterviewPrep(mockPrepId, mockUpdates)).rejects.toThrow('API Error');
    });
  });

  describe('deleteInterviewPrep', () => {
    it('should delete an interview preparation', async () => {
      const mockPrepId = 'prep123';
      const mockResponse = { success: true };

      (axios.delete as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await interviewPrepService.deleteInterviewPrep(mockPrepId);

      expect(result).toEqual(mockResponse);
      expect(axios.delete).toHaveBeenCalledWith(`/api/interview-prep/${mockPrepId}`);
    });

    it('should handle errors when deleting interview preparation', async () => {
      const mockPrepId = 'prep123';

      (axios.delete as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(interviewPrepService.deleteInterviewPrep(mockPrepId)).rejects.toThrow('API Error');
    });
  });

  describe('startInterviewSession', () => {
    it('should start an interview session', async () => {
      const mockPrepId = 'prep123';
      const mockUserId = 'user123';
      const mockResponse: InterviewPrepSession = {
        id: 'session123',
        userId: mockUserId,
        prepId: mockPrepId,
        startTime: '2025-03-15T14:00:00Z',
        questions: []
      };

      (axios.post as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await interviewPrepService.startInterviewSession(mockPrepId, mockUserId);

      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith('/api/interview-prep/sessions', {
        prepId: mockPrepId,
        userId: mockUserId,
        startTime: expect.any(String)
      });
    });

    it('should handle errors when starting an interview session', async () => {
      const mockPrepId = 'prep123';
      const mockUserId = 'user123';

      (axios.post as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(interviewPrepService.startInterviewSession(mockPrepId, mockUserId)).rejects.toThrow('API Error');
    });
  });

  describe('endInterviewSession', () => {
    it('should end an interview session', async () => {
      const mockSessionId = 'session123';
      const mockResponse: InterviewPrepSession = {
        id: mockSessionId,
        userId: 'user123',
        prepId: 'prep123',
        startTime: '2025-03-15T14:00:00Z',
        endTime: '2025-03-15T15:00:00Z',
        questions: []
      };

      (axios.put as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await interviewPrepService.endInterviewSession(mockSessionId);

      expect(result).toEqual(mockResponse);
      expect(axios.put).toHaveBeenCalledWith(`/api/interview-prep/sessions/${mockSessionId}/end`, {
        endTime: expect.any(String)
      });
    });

    it('should handle errors when ending an interview session', async () => {
      const mockSessionId = 'session123';

      (axios.put as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(interviewPrepService.endInterviewSession(mockSessionId)).rejects.toThrow('API Error');
    });
  });

  describe('saveQuestionAnswer', () => {
    it('should save an answer for a question', async () => {
      const mockSessionId = 'session123';
      const mockQuestionId = 'question123';
      const mockAnswer = 'This is my answer';
      const mockResponse: InterviewPrepSession = {
        id: mockSessionId,
        userId: 'user123',
        prepId: 'prep123',
        startTime: '2025-03-15T14:00:00Z',
        questions: [
          {
            questionId: mockQuestionId,
            userAnswer: mockAnswer
          }
        ]
      };

      (axios.put as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await interviewPrepService.saveQuestionAnswer(mockSessionId, mockQuestionId, mockAnswer);

      expect(result).toEqual(mockResponse);
      expect(axios.put).toHaveBeenCalledWith(
        `/api/interview-prep/sessions/${mockSessionId}/questions/${mockQuestionId}`,
        { userAnswer: mockAnswer }
      );
    });

    it('should handle errors when saving a question answer', async () => {
      const mockSessionId = 'session123';
      const mockQuestionId = 'question123';
      const mockAnswer = 'This is my answer';

      (axios.put as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(
        interviewPrepService.saveQuestionAnswer(mockSessionId, mockQuestionId, mockAnswer)
      ).rejects.toThrow('API Error');
    });
  });

  describe('getSessionFeedback', () => {
    it('should get feedback for a session', async () => {
      const mockSessionId = 'session123';
      const mockResponse: InterviewFeedback = {
        id: 'feedback123',
        userId: 'user123',
        prepId: 'prep123',
        sessionId: mockSessionId,
        createdAt: '2025-03-15T16:00:00Z',
        strengths: ['Good communication', 'Clear examples'],
        weaknesses: ['Could improve on technical details'],
        improvementSuggestions: ['Practice more technical questions'],
        overallRating: 4
      };

      (axios.get as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await interviewPrepService.getSessionFeedback(mockSessionId);

      expect(result).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(`/api/interview-prep/sessions/${mockSessionId}/feedback`);
    });

    it('should handle errors when getting session feedback', async () => {
      const mockSessionId = 'session123';

      (axios.get as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(interviewPrepService.getSessionFeedback(mockSessionId)).rejects.toThrow('API Error');
    });
  });

  describe('generateSessionFeedback', () => {
    it('should generate feedback for a session', async () => {
      const mockSessionId = 'session123';
      const mockResponse: InterviewFeedback = {
        id: 'feedback123',
        userId: 'user123',
        prepId: 'prep123',
        sessionId: mockSessionId,
        createdAt: '2025-03-15T16:00:00Z',
        strengths: ['Good communication', 'Clear examples'],
        weaknesses: ['Could improve on technical details'],
        improvementSuggestions: ['Practice more technical questions'],
        overallRating: 4
      };

      (axios.post as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await interviewPrepService.generateSessionFeedback(mockSessionId);

      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(`/api/interview-prep/sessions/${mockSessionId}/feedback`);
    });

    it('should handle errors when generating session feedback', async () => {
      const mockSessionId = 'session123';

      (axios.post as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(interviewPrepService.generateSessionFeedback(mockSessionId)).rejects.toThrow('API Error');
    });
  });

  describe('getPracticeQuestions', () => {
    it('should get practice questions', async () => {
      const mockInterviewType = InterviewType.BEHAVIORAL;
      const mockDifficultyLevel = DifficultyLevel.MEDIUM;
      const mockCount = 3;
      const mockResponse = [
        {
          id: 'q1',
          question: 'Tell me about a time you faced a challenge.',
          type: InterviewType.BEHAVIORAL,
          difficultyLevel: DifficultyLevel.MEDIUM
        },
        {
          id: 'q2',
          question: 'Describe a situation where you had to work with a difficult team member.',
          type: InterviewType.BEHAVIORAL,
          difficultyLevel: DifficultyLevel.MEDIUM
        },
        {
          id: 'q3',
          question: 'Give an example of a goal you reached and how you achieved it.',
          type: InterviewType.BEHAVIORAL,
          difficultyLevel: DifficultyLevel.MEDIUM
        }
      ];

      (axios.get as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await interviewPrepService.getPracticeQuestions(
        mockInterviewType,
        mockDifficultyLevel,
        mockCount
      );

      expect(result).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith('/api/interview-prep/practice-questions', {
        params: {
          type: mockInterviewType,
          difficulty: mockDifficultyLevel,
          count: mockCount
        }
      });
    });

    it('should handle errors when getting practice questions', async () => {
      const mockInterviewType = InterviewType.BEHAVIORAL;
      const mockDifficultyLevel = DifficultyLevel.MEDIUM;

      (axios.get as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(
        interviewPrepService.getPracticeQuestions(mockInterviewType, mockDifficultyLevel)
      ).rejects.toThrow('API Error');
    });
  });

  describe('getCompanyResearch', () => {
    it('should get company research information', async () => {
      const mockCompanyName = 'Tech Company';
      const mockResponse = {
        companyName: mockCompanyName,
        overview: 'Tech Company is a leading technology company.',
        mission: 'To innovate and transform the world through technology.',
        values: 'Innovation, Integrity, Excellence',
        culture: 'Collaborative and innovative culture',
        products: ['Product A', 'Product B'],
        competitors: ['Competitor X', 'Competitor Y'],
        recentNews: [
          {
            title: 'Tech Company Launches New Product',
            date: '2025-03-10',
            summary: 'Tech Company announced the launch of a new product.'
          }
        ]
      };

      (axios.get as any).mockResolvedValueOnce({ data: mockResponse });

      const result = await interviewPrepService.getCompanyResearch(mockCompanyName);

      expect(result).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(
        `/api/interview-prep/company-research?name=${encodeURIComponent(mockCompanyName)}`
      );
    });

    it('should handle errors when getting company research', async () => {
      const mockCompanyName = 'Tech Company';

      (axios.get as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(interviewPrepService.getCompanyResearch(mockCompanyName)).rejects.toThrow('API Error');
    });
  });
});
