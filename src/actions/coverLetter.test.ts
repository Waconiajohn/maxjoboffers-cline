import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { generateCoverLetter } from './coverLetter';
import { HttpError } from 'wasp/server';
import { hasActiveSubscription } from '../payment/subscriptionUtils';

// Mock dependencies
jest.mock('../payment/subscriptionUtils', () => ({
  hasActiveSubscription: jest.fn()
}));

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'Generated cover letter content'
              }
            }
          ]
        })
      }
    }
  }));
});

// Mock context
const mockContext = {
  user: { id: 'user-123' },
  entities: {
    User: {
      findUnique: jest.fn(),
      update: jest.fn()
    },
    Resume: {
      findUnique: jest.fn()
    },
    Job: {
      findUnique: jest.fn()
    },
    CoverLetter: {
      create: jest.fn()
    }
  }
};

describe('Cover Letter Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENAI_API_KEY = 'test-openai-api-key';
    
    // Default mock implementations
    (hasActiveSubscription as jest.Mock).mockReturnValue(false);
    
    mockContext.entities.User.findUnique.mockResolvedValue({
      id: 'user-123',
      credits: 10
    });
    
    mockContext.entities.Resume.findUnique.mockResolvedValue({
      id: 'resume-123',
      userId: 'user-123',
      title: 'My Resume',
      content: 'Resume content'
    });
    
    mockContext.entities.Job.findUnique.mockResolvedValue({
      id: 'job-123',
      title: 'Software Engineer',
      company: 'Tech Company',
      description: 'Job description'
    });
    
    mockContext.entities.CoverLetter.create.mockImplementation((data) => ({
      id: 'cover-letter-123',
      ...data.data,
      userId: 'user-123',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    mockContext.entities.User.update.mockImplementation((data) => ({
      id: data.where.id,
      credits: 9
    }));
  });

  describe('generateCoverLetter', () => {
    it('should generate a cover letter successfully', async () => {
      const result = await generateCoverLetter(
        { resumeId: 'resume-123', jobId: 'job-123' },
        mockContext
      );

      expect(result).toHaveProperty('id', 'cover-letter-123');
      expect(result).toHaveProperty('title', 'Cover Letter for Software Engineer at Tech Company');
      expect(result).toHaveProperty('content', 'Generated cover letter content');
      expect(mockContext.entities.CoverLetter.create).toHaveBeenCalledTimes(1);
      expect(mockContext.entities.User.update).toHaveBeenCalledTimes(1); // Credits decremented
    });

    it('should not decrement credits if user has subscription', async () => {
      (hasActiveSubscription as jest.Mock).mockReturnValue(true);

      const result = await generateCoverLetter(
        { resumeId: 'resume-123', jobId: 'job-123' },
        mockContext
      );

      expect(result).toHaveProperty('id', 'cover-letter-123');
      expect(mockContext.entities.User.update).not.toHaveBeenCalled(); // Credits not decremented
    });

    it('should throw an error if user is not authenticated', async () => {
      await expect(
        generateCoverLetter(
          { resumeId: 'resume-123', jobId: 'job-123' },
          { ...mockContext, user: null }
        )
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if user has insufficient credits and no subscription', async () => {
      mockContext.entities.User.findUnique.mockResolvedValue({
        id: 'user-123',
        credits: 0
      });

      await expect(
        generateCoverLetter(
          { resumeId: 'resume-123', jobId: 'job-123' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if resume is not found', async () => {
      mockContext.entities.Resume.findUnique.mockResolvedValue(null);

      await expect(
        generateCoverLetter(
          { resumeId: 'non-existent', jobId: 'job-123' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if job is not found', async () => {
      mockContext.entities.Job.findUnique.mockResolvedValue(null);

      await expect(
        generateCoverLetter(
          { resumeId: 'resume-123', jobId: 'non-existent' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if resume does not belong to user', async () => {
      mockContext.entities.Resume.findUnique.mockResolvedValue({
        id: 'resume-123',
        userId: 'different-user',
        title: 'My Resume',
        content: 'Resume content'
      });

      await expect(
        generateCoverLetter(
          { resumeId: 'resume-123', jobId: 'job-123' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });

    it('should handle OpenAI API errors', async () => {
      // Mock OpenAI to throw an error
      jest.mock('openai', () => {
        return jest.fn().mockImplementation(() => ({
          chat: {
            completions: {
              create: jest.fn().mockRejectedValue(new Error('OpenAI API error'))
            }
          }
        }));
      });

      await expect(
        generateCoverLetter(
          { resumeId: 'resume-123', jobId: 'job-123' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });

    it('should handle empty response from OpenAI', async () => {
      // Mock OpenAI to return empty content
      jest.mock('openai', () => {
        return jest.fn().mockImplementation(() => ({
          chat: {
            completions: {
              create: jest.fn().mockResolvedValue({
                choices: [
                  {
                    message: {
                      content: null
                    }
                  }
                ]
              })
            }
          }
        }));
      });

      await expect(
        generateCoverLetter(
          { resumeId: 'resume-123', jobId: 'job-123' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });
  });
});
