import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resumeParserService } from '../../services/resumeParser';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}));

import axios from 'axios';

// Create a mock for the fileUploads object
const mockUploadFile = vi.fn();

// Override the fileUploads in the resumeParserService
// @ts-ignore - TypeScript doesn't know about the internal structure
resumeParserService.fileUploads = {
  uploadFile: mockUploadFile
};

describe('resumeParserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('parseResumeFile', () => {
    it('should upload and parse a resume file', async () => {
      const mockFile = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const mockUploadResult = { url: 'https://example.com/resume.pdf' };
      const mockParseResult = {
        content: 'Parsed resume content',
        metadata: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          skills: ['JavaScript', 'React', 'Node.js'],
          experience: [
            {
              title: 'Software Engineer',
              company: 'Tech Company',
              startDate: '2020-01',
              endDate: '2023-03',
              description: 'Developed web applications using React and Node.js'
            }
          ],
          education: [
            {
              degree: 'Bachelor of Science in Computer Science',
              institution: 'University of Technology',
              graduationDate: '2019-05'
            }
          ]
        }
      };

      // Mock the file upload
      mockUploadFile.mockResolvedValueOnce(mockUploadResult);

      // Mock the parse API call
      (axios.post as any).mockResolvedValueOnce({ data: mockParseResult });

      const result = await resumeParserService.parseResumeFile(mockFile);

      expect(mockUploadFile).toHaveBeenCalledWith(mockFile);
      expect(axios.post).toHaveBeenCalledWith('/api/resume/parse', { fileUrl: mockUploadResult.url });
      expect(result).toEqual(mockParseResult);
    });

    it('should handle errors when uploading the file', async () => {
      const mockFile = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      
      // Mock the file upload to fail
      mockUploadFile.mockRejectedValueOnce(new Error('Upload failed'));

      await expect(resumeParserService.parseResumeFile(mockFile)).rejects.toThrow('Upload failed');
      expect(mockUploadFile).toHaveBeenCalledWith(mockFile);
      expect(axios.post).not.toHaveBeenCalled();
    });

    it('should handle errors when parsing the file', async () => {
      const mockFile = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const mockUploadResult = { url: 'https://example.com/resume.pdf' };
      
      // Mock the file upload
      mockUploadFile.mockResolvedValueOnce(mockUploadResult);
      
      // Mock the parse API call to fail
      (axios.post as any).mockRejectedValueOnce(new Error('Parse failed'));

      await expect(resumeParserService.parseResumeFile(mockFile)).rejects.toThrow('Parse failed');
      expect(mockUploadFile).toHaveBeenCalledWith(mockFile);
      expect(axios.post).toHaveBeenCalledWith('/api/resume/parse', { fileUrl: mockUploadResult.url });
    });
  });

  describe('parseResumeText', () => {
    it('should parse resume text content', async () => {
      const mockText = 'John Doe\nSoftware Engineer\njohn@example.com\n123-456-7890';
      const mockParseResult = {
        content: mockText,
        metadata: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          skills: ['JavaScript', 'React', 'Node.js'],
          experience: [
            {
              title: 'Software Engineer',
              company: 'Tech Company',
              startDate: '2020-01',
              endDate: '2023-03',
              description: 'Developed web applications using React and Node.js'
            }
          ],
          education: [
            {
              degree: 'Bachelor of Science in Computer Science',
              institution: 'University of Technology',
              graduationDate: '2019-05'
            }
          ]
        }
      };

      // Mock the parse API call
      (axios.post as any).mockResolvedValueOnce({ data: mockParseResult });

      const result = await resumeParserService.parseResumeText(mockText);

      expect(axios.post).toHaveBeenCalledWith('/api/resume/parse-text', { text: mockText });
      expect(result).toEqual(mockParseResult);
    });

    it('should handle errors when parsing resume text', async () => {
      const mockText = 'John Doe\nSoftware Engineer\njohn@example.com\n123-456-7890';
      
      // Mock the parse API call to fail
      (axios.post as any).mockRejectedValueOnce(new Error('Parse failed'));

      await expect(resumeParserService.parseResumeText(mockText)).rejects.toThrow('Parse failed');
      expect(axios.post).toHaveBeenCalledWith('/api/resume/parse-text', { text: mockText });
    });
  });

  describe('getResumeKeywords', () => {
    it('should get keywords for a job description', async () => {
      const mockJobDescription = 'We are looking for a skilled Software Engineer with experience in React, Node.js, and TypeScript.';
      const mockKeywords = ['React', 'Node.js', 'TypeScript', 'Software Engineer', 'JavaScript'];

      // Mock the API call
      (axios.post as any).mockResolvedValueOnce({ data: { keywords: mockKeywords } });

      const result = await resumeParserService.getResumeKeywords(mockJobDescription);

      expect(axios.post).toHaveBeenCalledWith('/api/resume/keywords', { jobDescription: mockJobDescription });
      expect(result).toEqual(mockKeywords);
    });

    it('should handle errors when getting keywords', async () => {
      const mockJobDescription = 'We are looking for a skilled Software Engineer with experience in React, Node.js, and TypeScript.';
      
      // Mock the API call to fail
      (axios.post as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(resumeParserService.getResumeKeywords(mockJobDescription)).rejects.toThrow('API Error');
      expect(axios.post).toHaveBeenCalledWith('/api/resume/keywords', { jobDescription: mockJobDescription });
    });
  });

  describe('analyzeResumeMatch', () => {
    it('should analyze resume match with job description', async () => {
      const mockResumeId = 'resume123';
      const mockJobDescription = 'We are looking for a skilled Software Engineer with experience in React, Node.js, and TypeScript.';
      const mockAnalysisResult = {
        matchScore: 85,
        matchedKeywords: ['React', 'Node.js', 'JavaScript'],
        missingKeywords: ['TypeScript'],
        strengths: ['Strong frontend development experience', 'Good backend knowledge'],
        weaknesses: ['No TypeScript experience mentioned'],
        suggestions: ['Add TypeScript to your skills section', 'Highlight any TypeScript projects']
      };

      // Mock the API call
      (axios.post as any).mockResolvedValueOnce({ data: mockAnalysisResult });

      const result = await resumeParserService.analyzeResumeMatch(mockResumeId, mockJobDescription);

      expect(axios.post).toHaveBeenCalledWith('/api/resume/analyze-match', {
        resumeId: mockResumeId,
        jobDescription: mockJobDescription
      });
      expect(result).toEqual(mockAnalysisResult);
    });

    it('should handle errors when analyzing resume match', async () => {
      const mockResumeId = 'resume123';
      const mockJobDescription = 'We are looking for a skilled Software Engineer with experience in React, Node.js, and TypeScript.';
      
      // Mock the API call to fail
      (axios.post as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(resumeParserService.analyzeResumeMatch(mockResumeId, mockJobDescription)).rejects.toThrow('API Error');
      expect(axios.post).toHaveBeenCalledWith('/api/resume/analyze-match', {
        resumeId: mockResumeId,
        jobDescription: mockJobDescription
      });
    });
  });

  describe('extractSkills', () => {
    it('should extract skills from resume content', async () => {
      const mockResumeContent = 'Experienced software engineer with skills in JavaScript, React, Node.js, and TypeScript.';
      const mockSkills = ['JavaScript', 'React', 'Node.js', 'TypeScript'];

      // Mock the API call
      (axios.post as any).mockResolvedValueOnce({ data: { skills: mockSkills } });

      const result = await resumeParserService.extractSkills(mockResumeContent);

      expect(axios.post).toHaveBeenCalledWith('/api/resume/extract-skills', { content: mockResumeContent });
      expect(result).toEqual(mockSkills);
    });

    it('should handle errors when extracting skills', async () => {
      const mockResumeContent = 'Experienced software engineer with skills in JavaScript, React, Node.js, and TypeScript.';
      
      // Mock the API call to fail
      (axios.post as any).mockRejectedValueOnce(new Error('API Error'));

      await expect(resumeParserService.extractSkills(mockResumeContent)).rejects.toThrow('API Error');
      expect(axios.post).toHaveBeenCalledWith('/api/resume/extract-skills', { content: mockResumeContent });
    });
  });
});
