import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { coverLetterGeneratorService } from '../../services/coverLetterGenerator';
import { CoverLetterGenerationParams, CoverLetterStyle } from '../../types/coverLetter';

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    sections: {
                      header: {
                        date: 'March 15, 2025',
                        recipientName: 'Hiring Manager',
                        recipientTitle: 'Talent Acquisition',
                        companyName: 'Tech Company X',
                        companyAddress: '123 Tech Avenue, San Francisco, CA 94105'
                      },
                      greeting: 'Dear Hiring Manager,',
                      introduction: 'I am writing to express my interest in the Senior Software Engineer position at Tech Company X. With over 5 years of experience in web development and a passion for creating efficient, scalable applications, I am excited about the opportunity to contribute to your innovative team.',
                      body: [
                        'Throughout my career, I have developed expertise in React, Node.js, and cloud technologies, which align perfectly with the requirements outlined in your job description. At Tech Company A, I led the development of cloud-based applications that reduced load times by 40% and implemented CI/CD pipelines that decreased deployment time by 60%.',
                        'I am particularly drawn to Tech Company X\'s mission to revolutionize the way people interact with technology. Your recent project on AI-driven user experiences resonates with my own professional interests, and I am eager to bring my technical skills and creative problem-solving abilities to help advance this initiative.'
                      ],
                      skills: [
                        'Frontend development with React and TypeScript',
                        'Backend development with Node.js and Express',
                        'Cloud infrastructure using AWS',
                        'CI/CD implementation and DevOps practices',
                        'Team leadership and mentoring'
                      ],
                      closing: 'I am excited about the possibility of joining Tech Company X and would welcome the opportunity to discuss how my background and skills would be an asset to your team. Thank you for considering my application.',
                      signature: 'Sincerely,\n\nJohn Doe'
                    }
                  })
                }
              }
            ]
          })
        }
      }
    }))
  };
});

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}));

import axios from 'axios';
import OpenAI from 'openai';

describe('CoverLetterGeneratorService', () => {
  const mockCoverLetterParams: CoverLetterGenerationParams = {
    userId: 'user123',
    jobTitle: 'Senior Software Engineer',
    jobDescription: 'We are looking for a skilled Software Engineer with experience in React, Node.js, and cloud technologies...',
    userResume: 'Experienced software engineer with 5+ years of experience in web development...',
    companyName: 'Tech Company X',
    companyInfo: 'Tech Company X is a leading technology company focused on creating innovative solutions...',
    recipientName: 'Hiring Manager',
    style: CoverLetterStyle.PROFESSIONAL,
    customInstructions: 'Highlight my experience with cloud technologies and team leadership.'
  };
  
  let openaiInstance: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    openaiInstance = new OpenAI();
  });
  
  describe('generateCoverLetter', () => {
    it('should generate a cover letter based on the provided parameters', async () => {
      const result = await coverLetterGeneratorService.generateCoverLetter(mockCoverLetterParams);
      
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.userId).toBe(mockCoverLetterParams.userId);
      expect(result.jobTitle).toBe(mockCoverLetterParams.jobTitle);
      expect(result.companyName).toBe(mockCoverLetterParams.companyName);
      expect(result.style).toBe(mockCoverLetterParams.style);
      expect(result.createdAt).toBeDefined();
      expect(result.lastUpdated).toBeDefined();
      
      // Check that the cover letter content is structured correctly
      expect(result.content).toBeDefined();
      expect(result.content.sections).toBeDefined();
      expect(result.content.sections.header).toBeDefined();
      expect(result.content.sections.greeting).toBeDefined();
      expect(result.content.sections.introduction).toBeDefined();
      expect(result.content.sections.body).toBeInstanceOf(Array);
      expect(result.content.sections.skills).toBeInstanceOf(Array);
      expect(result.content.sections.closing).toBeDefined();
      expect(result.content.sections.signature).toBeDefined();
      
      // Verify OpenAI was called with the correct parameters
      expect(openaiInstance.chat.completions.create).toHaveBeenCalledWith({
        model: expect.any(String),
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('You are an expert cover letter writer')
          }),
          expect.objectContaining({
            role: 'user',
            content: expect.stringContaining(mockCoverLetterParams.jobTitle)
          })
        ]),
        temperature: expect.any(Number)
      });
    });
    
    it('should handle errors during cover letter generation', async () => {
      // Mock OpenAI to throw an error
      openaiInstance.chat.completions.create.mockRejectedValueOnce(new Error('API error'));
      
      await expect(coverLetterGeneratorService.generateCoverLetter(mockCoverLetterParams)).rejects.toThrow('Failed to generate cover letter');
    });
  });
  
  describe('saveCoverLetter', () => {
    it('should save a generated cover letter', async () => {
      const generatedCoverLetter = await coverLetterGeneratorService.generateCoverLetter(mockCoverLetterParams);
      
      // Mock axios.post response
      (axios.post as any).mockResolvedValueOnce({
        data: { id: 'saved-cover-letter-123', ...generatedCoverLetter }
      });
      
      const result = await coverLetterGeneratorService.saveCoverLetter(generatedCoverLetter);
      
      expect(result.id).toBe('saved-cover-letter-123');
      expect(axios.post).toHaveBeenCalledWith('/api/cover-letters', generatedCoverLetter);
    });
    
    it('should handle errors when saving a cover letter', async () => {
      const generatedCoverLetter = await coverLetterGeneratorService.generateCoverLetter(mockCoverLetterParams);
      
      // Mock axios.post to throw an error
      (axios.post as any).mockRejectedValueOnce(new Error('Network error'));
      
      await expect(coverLetterGeneratorService.saveCoverLetter(generatedCoverLetter)).rejects.toThrow('Failed to save cover letter');
    });
  });
  
  describe('exportCoverLetter', () => {
    it('should export a cover letter to PDF format', async () => {
      const generatedCoverLetter = await coverLetterGeneratorService.generateCoverLetter(mockCoverLetterParams);
      const format = 'pdf';
      
      // Mock axios.post response for PDF export
      (axios.post as any).mockResolvedValueOnce({
        data: { url: 'https://example.com/cover-letters/cover-letter-123.pdf' }
      });
      
      const result = await coverLetterGeneratorService.exportCoverLetter(generatedCoverLetter.id, format);
      
      expect(result.url).toBe('https://example.com/cover-letters/cover-letter-123.pdf');
      expect(axios.post).toHaveBeenCalledWith('/api/cover-letters/export', {
        coverLetterId: generatedCoverLetter.id,
        format
      });
    });
    
    it('should export a cover letter to DOCX format', async () => {
      const generatedCoverLetter = await coverLetterGeneratorService.generateCoverLetter(mockCoverLetterParams);
      const format = 'docx';
      
      // Mock axios.post response for DOCX export
      (axios.post as any).mockResolvedValueOnce({
        data: { url: 'https://example.com/cover-letters/cover-letter-123.docx' }
      });
      
      const result = await coverLetterGeneratorService.exportCoverLetter(generatedCoverLetter.id, format);
      
      expect(result.url).toBe('https://example.com/cover-letters/cover-letter-123.docx');
      expect(axios.post).toHaveBeenCalledWith('/api/cover-letters/export', {
        coverLetterId: generatedCoverLetter.id,
        format
      });
    });
    
    it('should handle errors during cover letter export', async () => {
      const generatedCoverLetter = await coverLetterGeneratorService.generateCoverLetter(mockCoverLetterParams);
      const format = 'pdf';
      
      // Mock axios.post to throw an error
      (axios.post as any).mockRejectedValueOnce(new Error('Export failed'));
      
      await expect(coverLetterGeneratorService.exportCoverLetter(generatedCoverLetter.id, format)).rejects.toThrow('Failed to export cover letter');
    });
  });
  
  describe('getCoverLetterById', () => {
    it('should retrieve a cover letter by ID', async () => {
      const coverLetterId = 'cover-letter-123';
      const mockCoverLetter = {
        id: coverLetterId,
        userId: 'user123',
        jobTitle: 'Senior Software Engineer',
        companyName: 'Tech Company X',
        content: { sections: {} },
        style: CoverLetterStyle.PROFESSIONAL,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // Mock axios.get response
      (axios.get as any).mockResolvedValueOnce({
        data: mockCoverLetter
      });
      
      const result = await coverLetterGeneratorService.getCoverLetterById(coverLetterId);
      
      expect(result).toEqual(mockCoverLetter);
      expect(axios.get).toHaveBeenCalledWith(`/api/cover-letters/${coverLetterId}`);
    });
    
    it('should handle errors when retrieving a cover letter', async () => {
      const coverLetterId = 'cover-letter-123';
      
      // Mock axios.get to throw an error
      (axios.get as any).mockRejectedValueOnce(new Error('Cover letter not found'));
      
      await expect(coverLetterGeneratorService.getCoverLetterById(coverLetterId)).rejects.toThrow('Failed to retrieve cover letter');
    });
  });
  
  describe('getUserCoverLetters', () => {
    it('should retrieve all cover letters for a user', async () => {
      const userId = 'user123';
      const mockCoverLetters = [
        {
          id: 'cover-letter-123',
          userId,
          jobTitle: 'Senior Software Engineer',
          companyName: 'Tech Company X',
          content: { sections: {} },
          style: CoverLetterStyle.PROFESSIONAL,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'cover-letter-456',
          userId,
          jobTitle: 'Full Stack Developer',
          companyName: 'Tech Company Y',
          content: { sections: {} },
          style: CoverLetterStyle.CREATIVE,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      ];
      
      // Mock axios.get response
      (axios.get as any).mockResolvedValueOnce({
        data: mockCoverLetters
      });
      
      const result = await coverLetterGeneratorService.getUserCoverLetters(userId);
      
      expect(result).toEqual(mockCoverLetters);
      expect(axios.get).toHaveBeenCalledWith(`/api/cover-letters?userId=${userId}`);
    });
    
    it('should handle errors when retrieving user cover letters', async () => {
      const userId = 'user123';
      
      // Mock axios.get to throw an error
      (axios.get as any).mockRejectedValueOnce(new Error('Failed to fetch cover letters'));
      
      await expect(coverLetterGeneratorService.getUserCoverLetters(userId)).rejects.toThrow('Failed to retrieve user cover letters');
    });
  });
  
  describe('updateCoverLetter', () => {
    it('should update an existing cover letter', async () => {
      const coverLetterId = 'cover-letter-123';
      const updates = {
        recipientName: 'Jane Smith',
        customInstructions: 'Focus more on my leadership experience'
      };
      
      const updatedCoverLetter = {
        id: coverLetterId,
        userId: 'user123',
        jobTitle: 'Senior Software Engineer',
        companyName: 'Tech Company X',
        recipientName: 'Jane Smith',
        content: { sections: {} },
        style: CoverLetterStyle.PROFESSIONAL,
        customInstructions: 'Focus more on my leadership experience',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // Mock axios.put response
      (axios.put as any) = vi.fn().mockResolvedValueOnce({
        data: updatedCoverLetter
      });
      
      const result = await coverLetterGeneratorService.updateCoverLetter(coverLetterId, updates);
      
      expect(result).toEqual(updatedCoverLetter);
      expect(axios.put).toHaveBeenCalledWith(`/api/cover-letters/${coverLetterId}`, updates);
    });
    
    it('should handle errors when updating a cover letter', async () => {
      const coverLetterId = 'cover-letter-123';
      const updates = {
        recipientName: 'Jane Smith'
      };
      
      // Mock axios.put to throw an error
      (axios.put as any) = vi.fn().mockRejectedValueOnce(new Error('Failed to update cover letter'));
      
      await expect(coverLetterGeneratorService.updateCoverLetter(coverLetterId, updates)).rejects.toThrow('Failed to update cover letter');
    });
  });
  
  describe('deleteCoverLetter', () => {
    it('should delete a cover letter', async () => {
      const coverLetterId = 'cover-letter-123';
      
      // Mock axios.delete response
      (axios.delete as any) = vi.fn().mockResolvedValueOnce({
        data: { success: true }
      });
      
      const result = await coverLetterGeneratorService.deleteCoverLetter(coverLetterId);
      
      expect(result).toEqual({ success: true });
      expect(axios.delete).toHaveBeenCalledWith(`/api/cover-letters/${coverLetterId}`);
    });
    
    it('should handle errors when deleting a cover letter', async () => {
      const coverLetterId = 'cover-letter-123';
      
      // Mock axios.delete to throw an error
      (axios.delete as any) = vi.fn().mockRejectedValueOnce(new Error('Failed to delete cover letter'));
      
      await expect(coverLetterGeneratorService.deleteCoverLetter(coverLetterId)).rejects.toThrow('Failed to delete cover letter');
    });
  });
});
