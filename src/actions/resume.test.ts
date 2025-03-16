import { describe, it, expect, beforeEach, vi } from 'vitest';
import { uploadResume, analyzeResume, changeResumeFormat } from './resume';
import { HttpError } from 'wasp/server';

// Mock dependencies
vi.mock('wasp/server/fileUploads', () => ({
  uploadFile: vi.fn().mockResolvedValue({ url: 'https://example.com/resume.pdf' })
}));

vi.mock('../utils/resumeParser', () => ({
  parseResumeContent: vi.fn().mockResolvedValue('Parsed resume content')
}));

vi.mock('openai', () => {
  return vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [
            {
              message: {
                tool_calls: [
                  {
                    function: {
                      arguments: JSON.stringify({
                        matchScore: 85,
                        strengths: ['Strong technical skills', 'Relevant experience'],
                        weaknesses: ['Missing specific keywords', 'Limited leadership examples'],
                        improvementSuggestions: [
                          {
                            section: 'Experience',
                            suggestion: 'Add more quantifiable achievements',
                            reason: 'Helps demonstrate impact'
                          }
                        ]
                      })
                    }
                  }
                ]
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
    Resume: {
      create: vi.fn().mockImplementation((data) => ({ id: 'resume-123', ...data.data })),
      findUnique: vi.fn().mockImplementation(() => ({
        id: 'resume-123',
        userId: 'user-123',
        title: 'My Resume',
        content: 'Resume content',
        version: 1
      })),
      update: vi.fn().mockImplementation((data) => ({ id: data.where.id, ...data.data }))
    },
    User: {
      findUnique: vi.fn().mockImplementation(() => ({
        id: 'user-123',
        credits: 10,
        subscriptionStatus: 'active'
      })),
      update: vi.fn().mockImplementation((data) => ({ id: data.where.id, ...data.data }))
    }
  }
};

describe('Resume Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadResume', () => {
    it('should upload a resume successfully', async () => {
      const mockFile = {
        name: 'resume.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('mock file content')
      };

      const result = await uploadResume(
        { file: mockFile, title: 'My Resume' },
        mockContext
      );

      expect(result).toHaveProperty('id', 'resume-123');
      expect(result).toHaveProperty('title', 'My Resume');
      expect(result).toHaveProperty('fileUrl', 'https://example.com/resume.pdf');
      expect(mockContext.entities.Resume.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user is not authenticated', async () => {
      const mockFile = {
        name: 'resume.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('mock file content')
      };

      await expect(
        uploadResume(
          { file: mockFile, title: 'My Resume' },
          { ...mockContext, user: null }
        )
      ).rejects.toThrow(HttpError);
    });
  });

  describe('analyzeResume', () => {
    it('should analyze a resume successfully', async () => {
      const result = await analyzeResume(
        { resumeId: 'resume-123', jobDescription: 'Job description' },
        mockContext
      );

      expect(result).toHaveProperty('matchScore', 85);
      expect(result.strengths).toHaveLength(2);
      expect(result.weaknesses).toHaveLength(2);
      expect(result.improvementSuggestions).toHaveLength(1);
      expect(mockContext.entities.Resume.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if resume is not found', async () => {
      mockContext.entities.Resume.findUnique.mockResolvedValueOnce(null);

      await expect(
        analyzeResume(
          { resumeId: 'non-existent', jobDescription: 'Job description' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if user does not own the resume', async () => {
      mockContext.entities.Resume.findUnique.mockResolvedValueOnce({
        id: 'resume-123',
        userId: 'different-user',
        title: 'My Resume',
        content: 'Resume content'
      });

      await expect(
        analyzeResume(
          { resumeId: 'resume-123', jobDescription: 'Job description' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });
  });

  describe('changeResumeFormat', () => {
    it('should change resume format successfully', async () => {
      const result = await changeResumeFormat(
        { resumeId: 'resume-123', format: 'ATS' },
        mockContext
      );

      expect(result).toHaveProperty('title', 'My Resume (ATS format)');
      expect(result).toHaveProperty('format', 'ATS');
      expect(result).toHaveProperty('version', 2);
      expect(mockContext.entities.Resume.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if resume is not found', async () => {
      mockContext.entities.Resume.findUnique.mockResolvedValueOnce(null);

      await expect(
        changeResumeFormat(
          { resumeId: 'non-existent', format: 'ATS' },
          mockContext
        )
      ).rejects.toThrow(HttpError);
    });
  });
});
