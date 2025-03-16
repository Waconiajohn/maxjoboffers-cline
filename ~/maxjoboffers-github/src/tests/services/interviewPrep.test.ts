import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { interviewPrepService } from '../../services/interviewPrep';
import { InterviewPrepGenerationParams } from '../../types/interviewPrep';

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
                    companyResearch: {
                      overview: 'Test Company is a leading company in its industry.',
                      focusAreas: ['Area 1', 'Area 2', 'Area 3'],
                      customerService: 'Test Company is known for exceptional customer service.'
                    },
                    competitors: [
                      {
                        name: 'Competitor A',
                        description: 'Major player in the industry.'
                      }
                    ],
                    growthAreas: [
                      {
                        title: 'Market Expansion',
                        description: 'Expanding into new markets.'
                      }
                    ],
                    risks: [
                      {
                        title: 'Market Volatility',
                        description: 'Economic uncertainties affecting business operations.'
                      }
                    ],
                    roleImpacts: [
                      {
                        title: 'Drive Innovation',
                        description: 'Help drive innovation in key areas.'
                      }
                    ],
                    questions: [
                      {
                        category: 'Technical Skills',
                        question: 'What experience do you have?',
                        answer: 'Your answer should highlight your relevant experience.'
                      }
                    ],
                    tips: [
                      {
                        title: 'Research Thoroughly',
                        description: 'Learn everything you can about the company.'
                      }
                    ]
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

describe('InterviewPrepService', () => {
  const mockParams: InterviewPrepGenerationParams = {
    jobId: 'job123',
    resumeId: 'resume123',
    jobTitle: 'Software Engineer',
    companyName: 'Test Company',
    jobDescription: 'We are looking for a skilled Software Engineer...',
    resumeContent: 'Experienced software engineer with 5+ years of experience...'
  };
  
  beforeEach(() => {
    // Reset the guides array before each test
    // @ts-ignore - Accessing private property for testing
    interviewPrepService.guides = [];
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe('generateGuide', () => {
    it('should generate a guide with the correct structure', async () => {
      const guide = await interviewPrepService.generateGuide(mockParams);
      
      expect(guide).toBeDefined();
      expect(guide.id).toBeDefined();
      expect(guide.jobId).toBe(mockParams.jobId);
      expect(guide.resumeId).toBe(mockParams.resumeId);
      expect(guide.jobTitle).toBe(mockParams.jobTitle);
      expect(guide.companyName).toBe(mockParams.companyName);
      expect(guide.createdAt).toBeDefined();
      expect(guide.lastUpdated).toBeDefined();
      
      // Check that all required sections are present
      expect(guide.companyResearch).toBeDefined();
      expect(guide.competitors).toBeDefined();
      expect(guide.growthAreas).toBeDefined();
      expect(guide.risks).toBeDefined();
      expect(guide.roleImpacts).toBeDefined();
      expect(guide.questions).toBeDefined();
      expect(guide.tips).toBeDefined();
    });
    
    it('should save the generated guide', async () => {
      const guide = await interviewPrepService.generateGuide(mockParams);
      
      const guides = await interviewPrepService.getGuides();
      expect(guides).toHaveLength(1);
      expect(guides[0].id).toBe(guide.id);
    });
  });
  
  describe('getGuides', () => {
    it('should return an empty array when no guides exist', async () => {
      const guides = await interviewPrepService.getGuides();
      expect(guides).toEqual([]);
    });
    
    it('should return all guides', async () => {
      // Generate two guides
      const guide1 = await interviewPrepService.generateGuide(mockParams);
      const guide2 = await interviewPrepService.generateGuide({
        ...mockParams,
        jobId: 'job456',
        jobTitle: 'Product Manager'
      });
      
      const guides = await interviewPrepService.getGuides();
      expect(guides).toHaveLength(2);
      expect(guides[0].id).toBe(guide1.id);
      expect(guides[1].id).toBe(guide2.id);
    });
  });
  
  describe('getGuideById', () => {
    it('should return null when guide does not exist', async () => {
      const guide = await interviewPrepService.getGuideById('nonexistent');
      expect(guide).toBeNull();
    });
    
    it('should return the guide with the specified ID', async () => {
      const createdGuide = await interviewPrepService.generateGuide(mockParams);
      
      const guide = await interviewPrepService.getGuideById(createdGuide.id);
      expect(guide).not.toBeNull();
      expect(guide?.id).toBe(createdGuide.id);
    });
  });
  
  describe('getGuidesByJobId', () => {
    it('should return an empty array when no guides exist for the job', async () => {
      const guides = await interviewPrepService.getGuidesByJobId('nonexistent');
      expect(guides).toEqual([]);
    });
    
    it('should return all guides for the specified job', async () => {
      // Generate guides for two different jobs
      const jobId1 = 'job123';
      const jobId2 = 'job456';
      
      await interviewPrepService.generateGuide({
        ...mockParams,
        jobId: jobId1
      });
      
      await interviewPrepService.generateGuide({
        ...mockParams,
        jobId: jobId1
      });
      
      await interviewPrepService.generateGuide({
        ...mockParams,
        jobId: jobId2
      });
      
      const guides1 = await interviewPrepService.getGuidesByJobId(jobId1);
      expect(guides1).toHaveLength(2);
      expect(guides1[0].jobId).toBe(jobId1);
      expect(guides1[1].jobId).toBe(jobId1);
      
      const guides2 = await interviewPrepService.getGuidesByJobId(jobId2);
      expect(guides2).toHaveLength(1);
      expect(guides2[0].jobId).toBe(jobId2);
    });
  });
  
  describe('deleteGuide', () => {
    it('should return false when guide does not exist', async () => {
      const result = await interviewPrepService.deleteGuide('nonexistent');
      expect(result).toBe(false);
    });
    
    it('should delete the guide with the specified ID', async () => {
      const guide = await interviewPrepService.generateGuide(mockParams);
      
      const result = await interviewPrepService.deleteGuide(guide.id);
      expect(result).toBe(true);
      
      const guides = await interviewPrepService.getGuides();
      expect(guides).toHaveLength(0);
    });
  });
});
