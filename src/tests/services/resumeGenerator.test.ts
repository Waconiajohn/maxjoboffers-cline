import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resumeGeneratorService } from '../../services/resumeGenerator';
import { ResumeGenerationParams, ResumeFormat } from '../../types/resume';

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
                      summary: 'Experienced software engineer with expertise in React, Node.js, and cloud technologies.',
                      experience: [
                        {
                          company: 'Tech Company A',
                          position: 'Senior Software Engineer',
                          startDate: 'January 2022',
                          endDate: 'Present',
                          description: 'Led development of cloud-based applications using React and Node.js.',
                          achievements: [
                            'Reduced application load time by 40% through code optimization',
                            'Implemented CI/CD pipeline reducing deployment time by 60%',
                            'Mentored junior developers on best practices'
                          ]
                        },
                        {
                          company: 'Tech Company B',
                          position: 'Software Engineer',
                          startDate: 'June 2019',
                          endDate: 'December 2021',
                          description: 'Developed and maintained web applications using React and Express.',
                          achievements: [
                            'Implemented new features that increased user engagement by 25%',
                            'Collaborated with design team to improve UI/UX',
                            'Participated in code reviews and technical discussions'
                          ]
                        }
                      ],
                      education: [
                        {
                          institution: 'University of Technology',
                          degree: 'Bachelor of Science in Computer Science',
                          graduationDate: 'May 2019',
                          gpa: '3.8/4.0',
                          achievements: [
                            'Dean\'s List all semesters',
                            'Senior project: Developed a machine learning application for image recognition'
                          ]
                        }
                      ],
                      skills: [
                        'Programming Languages: JavaScript, TypeScript, Python, Java',
                        'Frameworks & Libraries: React, Node.js, Express, Redux, Jest',
                        'Tools & Platforms: Git, Docker, AWS, CI/CD, Agile methodologies'
                      ],
                      certifications: [
                        'AWS Certified Developer - Associate',
                        'Professional Scrum Master I (PSM I)'
                      ],
                      projects: [
                        {
                          name: 'E-commerce Platform',
                          description: 'Developed a full-stack e-commerce platform with React, Node.js, and MongoDB.',
                          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux'],
                          link: 'https://github.com/username/ecommerce-platform'
                        }
                      ]
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
    post: vi.fn()
  }
}));

import axios from 'axios';
import OpenAI from 'openai';

describe('ResumeGeneratorService', () => {
  const mockResumeParams: ResumeGenerationParams = {
    userId: 'user123',
    jobTitle: 'Senior Software Engineer',
    jobDescription: 'We are looking for a skilled Software Engineer with experience in React, Node.js, and cloud technologies...',
    userResume: 'Experienced software engineer with 5+ years of experience in web development...',
    format: ResumeFormat.CHRONOLOGICAL,
    targetCompany: 'Tech Company X',
    targetKeywords: ['React', 'Node.js', 'AWS', 'CI/CD']
  };
  
  let openaiInstance: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    openaiInstance = new OpenAI();
  });
  
  describe('generateResume', () => {
    it('should generate a resume based on the provided parameters', async () => {
      const result = await resumeGeneratorService.generateResume(mockResumeParams);
      
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.userId).toBe(mockResumeParams.userId);
      expect(result.jobTitle).toBe(mockResumeParams.jobTitle);
      expect(result.targetCompany).toBe(mockResumeParams.targetCompany);
      expect(result.format).toBe(mockResumeParams.format);
      expect(result.createdAt).toBeDefined();
      expect(result.lastUpdated).toBeDefined();
      
      // Check that the resume content is structured correctly
      expect(result.content).toBeDefined();
      expect(result.content.sections).toBeDefined();
      expect(result.content.sections.summary).toBeDefined();
      expect(result.content.sections.experience).toBeInstanceOf(Array);
      expect(result.content.sections.education).toBeInstanceOf(Array);
      expect(result.content.sections.skills).toBeInstanceOf(Array);
      
      // Verify OpenAI was called with the correct parameters
      expect(openaiInstance.chat.completions.create).toHaveBeenCalledWith({
        model: expect.any(String),
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('You are an expert resume writer')
          }),
          expect.objectContaining({
            role: 'user',
            content: expect.stringContaining(mockResumeParams.jobTitle)
          })
        ]),
        temperature: expect.any(Number)
      });
    });
    
    it('should handle errors during resume generation', async () => {
      // Mock OpenAI to throw an error
      openaiInstance.chat.completions.create.mockRejectedValueOnce(new Error('API error'));
      
      await expect(resumeGeneratorService.generateResume(mockResumeParams)).rejects.toThrow('Failed to generate resume');
    });
  });
  
  describe('saveResume', () => {
    it('should save a generated resume', async () => {
      const generatedResume = await resumeGeneratorService.generateResume(mockResumeParams);
      
      // Mock axios.post response
      (axios.post as any).mockResolvedValueOnce({
        data: { id: 'saved-resume-123', ...generatedResume }
      });
      
      const result = await resumeGeneratorService.saveResume(generatedResume);
      
      expect(result.id).toBe('saved-resume-123');
      expect(axios.post).toHaveBeenCalledWith('/api/resumes', generatedResume);
    });
    
    it('should handle errors when saving a resume', async () => {
      const generatedResume = await resumeGeneratorService.generateResume(mockResumeParams);
      
      // Mock axios.post to throw an error
      (axios.post as any).mockRejectedValueOnce(new Error('Network error'));
      
      await expect(resumeGeneratorService.saveResume(generatedResume)).rejects.toThrow('Failed to save resume');
    });
  });
  
  describe('exportResume', () => {
    it('should export a resume to PDF format', async () => {
      const generatedResume = await resumeGeneratorService.generateResume(mockResumeParams);
      const format = 'pdf';
      
      // Mock axios.post response for PDF export
      (axios.post as any).mockResolvedValueOnce({
        data: { url: 'https://example.com/resumes/resume-123.pdf' }
      });
      
      const result = await resumeGeneratorService.exportResume(generatedResume.id, format);
      
      expect(result.url).toBe('https://example.com/resumes/resume-123.pdf');
      expect(axios.post).toHaveBeenCalledWith('/api/resumes/export', {
        resumeId: generatedResume.id,
        format
      });
    });
    
    it('should export a resume to DOCX format', async () => {
      const generatedResume = await resumeGeneratorService.generateResume(mockResumeParams);
      const format = 'docx';
      
      // Mock axios.post response for DOCX export
      (axios.post as any).mockResolvedValueOnce({
        data: { url: 'https://example.com/resumes/resume-123.docx' }
      });
      
      const result = await resumeGeneratorService.exportResume(generatedResume.id, format);
      
      expect(result.url).toBe('https://example.com/resumes/resume-123.docx');
      expect(axios.post).toHaveBeenCalledWith('/api/resumes/export', {
        resumeId: generatedResume.id,
        format
      });
    });
    
    it('should handle errors during resume export', async () => {
      const generatedResume = await resumeGeneratorService.generateResume(mockResumeParams);
      const format = 'pdf';
      
      // Mock axios.post to throw an error
      (axios.post as any).mockRejectedValueOnce(new Error('Export failed'));
      
      await expect(resumeGeneratorService.exportResume(generatedResume.id, format)).rejects.toThrow('Failed to export resume');
    });
  });
  
  describe('getResumeById', () => {
    it('should retrieve a resume by ID', async () => {
      const resumeId = 'resume-123';
      const mockResume = {
        id: resumeId,
        userId: 'user123',
        jobTitle: 'Senior Software Engineer',
        content: { sections: {} },
        format: ResumeFormat.CHRONOLOGICAL,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // Mock axios.get response
      (axios.get as any) = vi.fn().mockResolvedValueOnce({
        data: mockResume
      });
      
      const result = await resumeGeneratorService.getResumeById(resumeId);
      
      expect(result).toEqual(mockResume);
      expect(axios.get).toHaveBeenCalledWith(`/api/resumes/${resumeId}`);
    });
    
    it('should handle errors when retrieving a resume', async () => {
      const resumeId = 'resume-123';
      
      // Mock axios.get to throw an error
      (axios.get as any) = vi.fn().mockRejectedValueOnce(new Error('Resume not found'));
      
      await expect(resumeGeneratorService.getResumeById(resumeId)).rejects.toThrow('Failed to retrieve resume');
    });
  });
  
  describe('getUserResumes', () => {
    it('should retrieve all resumes for a user', async () => {
      const userId = 'user123';
      const mockResumes = [
        {
          id: 'resume-123',
          userId,
          jobTitle: 'Senior Software Engineer',
          content: { sections: {} },
          format: ResumeFormat.CHRONOLOGICAL,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'resume-456',
          userId,
          jobTitle: 'Full Stack Developer',
          content: { sections: {} },
          format: ResumeFormat.FUNCTIONAL,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      ];
      
      // Mock axios.get response
      (axios.get as any) = vi.fn().mockResolvedValueOnce({
        data: mockResumes
      });
      
      const result = await resumeGeneratorService.getUserResumes(userId);
      
      expect(result).toEqual(mockResumes);
      expect(axios.get).toHaveBeenCalledWith(`/api/resumes?userId=${userId}`);
    });
    
    it('should handle errors when retrieving user resumes', async () => {
      const userId = 'user123';
      
      // Mock axios.get to throw an error
      (axios.get as any) = vi.fn().mockRejectedValueOnce(new Error('Failed to fetch resumes'));
      
      await expect(resumeGeneratorService.getUserResumes(userId)).rejects.toThrow('Failed to retrieve user resumes');
    });
  });
});
