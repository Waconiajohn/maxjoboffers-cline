import { describe, it, expect, beforeEach, jest, afterAll } from '@jest/globals';
import { searchJobs, applyToJob } from '../../actions/job';
import { uploadResume, analyzeResume, changeResumeFormat } from '../../actions/resume';
import { generateCoverLetter } from '../../actions/coverLetter';
import { HttpError } from 'wasp/server';

// Mock dependencies
jest.mock('wasp/server/fileUploads', () => ({
  uploadFile: jest.fn().mockResolvedValue({ url: 'https://example.com/resume.pdf' })
}));

jest.mock('../../utils/resumeParser', () => ({
  parseResumeContent: jest.fn().mockResolvedValue('Parsed resume content')
}));

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                tool_calls: [
                  {
                    function: {
                      arguments: JSON.stringify({
                        content: 'Generated cover letter content'
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

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({
    data: {
      jobs: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Innovations Inc.',
          location: 'San Francisco, CA',
          description: 'We are looking for a Senior Software Engineer to join our team.',
          requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience.',
          salary: { min: 120000, max: 160000 },
          applicationUrl: 'https://example.com/apply',
          source: 'google'
        }
      ],
      totalCount: 1
    }
  })
}));

// Create a database-like store for our integration test
const testDb = {
  users: [
    {
      id: 'user-123',
      email: 'test@example.com',
      credits: 10,
      subscriptionStatus: 'active'
    }
  ],
  resumes: [],
  jobs: [],
  coverLetters: [],
  jobApplications: []
};

// Mock context with in-memory database operations
const mockContext: any = {
  user: { id: 'user-123' },
  entities: {
    User: {
      findUnique: jest.fn((args) => {
        const user = testDb.users.find(u => u.id === args.where.id);
        return Promise.resolve(user || null);
      }),
      update: jest.fn((args) => {
        const userIndex = testDb.users.findIndex(u => u.id === args.where.id);
        if (userIndex === -1) return Promise.resolve(null);
        
        const updatedUser = { ...testDb.users[userIndex], ...args.data };
        if (args.data.credits && args.data.credits.decrement) {
          updatedUser.credits -= args.data.credits.decrement;
        }
        
        testDb.users[userIndex] = updatedUser;
        return Promise.resolve(updatedUser);
      })
    },
    Resume: {
      create: jest.fn((args) => {
        const newResume = {
          id: `resume-${testDb.resumes.length + 1}`,
          ...args.data,
          userId: args.data.user?.connect?.id || mockContext.user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        delete newResume.user;
        testDb.resumes.push(newResume);
        return Promise.resolve(newResume);
      }),
      findUnique: jest.fn((args) => {
        const resume = testDb.resumes.find(r => r.id === args.where.id);
        return Promise.resolve(resume || null);
      })
    },
    Job: {
      findFirst: jest.fn((args) => {
        const job = testDb.jobs.find(j => 
          j.title === args.where.title && 
          j.company === args.where.company && 
          j.location === args.where.location
        );
        return Promise.resolve(job || null);
      }),
      findUnique: jest.fn((args) => {
        const job = testDb.jobs.find(j => j.id === args.where.id);
        return Promise.resolve(job || null);
      }),
      create: jest.fn((args) => {
        const newJob = {
          id: `job-${testDb.jobs.length + 1}`,
          ...args.data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        testDb.jobs.push(newJob);
        return Promise.resolve(newJob);
      })
    },
    CoverLetter: {
      create: jest.fn((args) => {
        const newCoverLetter = {
          id: `cover-letter-${testDb.coverLetters.length + 1}`,
          ...args.data,
          userId: args.data.user?.connect?.id || mockContext.user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        delete newCoverLetter.user;
        testDb.coverLetters.push(newCoverLetter);
        return Promise.resolve(newCoverLetter);
      }),
      findUnique: jest.fn((args) => {
        const coverLetter = testDb.coverLetters.find(c => c.id === args.where.id);
        return Promise.resolve(coverLetter || null);
      })
    },
    JobApplication: {
      findFirst: jest.fn((args) => {
        const application = testDb.jobApplications.find(a => 
          a.userId === args.where.userId && 
          a.jobId === args.where.jobId
        );
        return Promise.resolve(application || null);
      }),
      create: jest.fn((args) => {
        const newApplication = {
          id: `application-${testDb.jobApplications.length + 1}`,
          userId: args.data.user?.connect?.id || mockContext.user.id,
          jobId: args.data.job?.connect?.id,
          resumeId: args.data.resume?.connect?.id,
          coverLetterId: args.data.coverLetter?.connect?.id,
          status: args.data.status || 'applied',
          appliedDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        delete newApplication.user;
        delete newApplication.job;
        delete newApplication.resume;
        delete newApplication.coverLetter;
        
        testDb.jobApplications.push(newApplication);
        return Promise.resolve(newApplication);
      })
    }
  }
};

describe('Job Application Flow Integration Test', () => {
  beforeEach(() => {
    // Reset the test database before each test
    testDb.resumes = [];
    testDb.jobs = [];
    testDb.coverLetters = [];
    testDb.jobApplications = [];
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Set environment variables
    process.env.GOOGLE_JOBS_API_KEY = 'test-google-jobs-api-key';
    process.env.OPENAI_API_KEY = 'test-openai-api-key';
  });
  
  it('should complete the full job application flow', async () => {
    // Step 1: Upload a resume
    const mockFile = {
      name: 'resume.pdf',
      mimetype: 'application/pdf',
      buffer: Buffer.from('mock file content')
    };
    
    const resume = await uploadResume(
      { file: mockFile, title: 'My Professional Resume' },
      mockContext
    );
    
    expect(resume).toBeDefined();
    expect(resume.id).toBeDefined();
    expect(resume.title).toBe('My Professional Resume');
    expect(testDb.resumes.length).toBe(1);
    
    // Step 2: Search for jobs
    const searchResult = await searchJobs(
      { query: 'software engineer', location: 'San Francisco, CA' },
      mockContext
    );
    
    expect(searchResult).toBeDefined();
    expect(searchResult.jobs.length).toBeGreaterThan(0);
    expect(testDb.jobs.length).toBeGreaterThan(0);
    
    const job = searchResult.jobs[0];
    
    // Step 3: Analyze and optimize the resume for the job
    const analysisResult = await analyzeResume(
      { resumeId: resume.id, jobDescription: job.description },
      mockContext
    );
    
    expect(analysisResult).toBeDefined();
    expect(analysisResult.matchScore).toBeDefined();
    expect(analysisResult.strengths).toBeDefined();
    expect(analysisResult.weaknesses).toBeDefined();
    expect(analysisResult.improvementSuggestions).toBeDefined();
    
    // Step 4: Change the resume format to better match the job
    const optimizedResume = await changeResumeFormat(
      { resumeId: resume.id, format: 'ATS' },
      mockContext
    );
    
    expect(optimizedResume).toBeDefined();
    expect(optimizedResume.id).toBeDefined();
    expect(optimizedResume.format).toBe('ATS');
    expect(optimizedResume.version).toBe(2); // Version should be incremented
    expect(testDb.resumes.length).toBe(2); // Should have created a new version
    
    // Step 5: Generate a cover letter
    const coverLetter = await generateCoverLetter(
      { 
        resumeId: resume.id, 
        jobId: job.id,
        jobDescription: job.description,
        companyName: job.company
      },
      mockContext
    );
    
    expect(coverLetter).toBeDefined();
    expect(coverLetter.id).toBeDefined();
    expect(coverLetter.content).toBeDefined();
    expect(testDb.coverLetters.length).toBe(1);
    
    // Step 6: Apply to the job
    const application = await applyToJob(
      {
        jobId: job.id,
        resumeId: optimizedResume.id, // Use the optimized resume
        coverLetterId: coverLetter.id
      },
      mockContext
    );
    
    expect(application).toBeDefined();
    expect(application.id).toBeDefined();
    expect(application.status).toBe('applied');
    expect(application.jobId).toBe(job.id);
    expect(application.resumeId).toBe(optimizedResume.id);
    expect(application.coverLetterId).toBe(coverLetter.id);
    expect(testDb.jobApplications.length).toBe(1);
    
    // Verify that all the pieces are connected correctly
    expect(testDb.resumes[0].id).toBe(resume.id);
    expect(testDb.jobs[0].id).toBe(job.id);
    expect(testDb.coverLetters[0].id).toBe(coverLetter.id);
    expect(testDb.jobApplications[0].id).toBe(application.id);
    expect(testDb.jobApplications[0].resumeId).toBe(optimizedResume.id);
    expect(testDb.jobApplications[0].jobId).toBe(job.id);
    expect(testDb.jobApplications[0].coverLetterId).toBe(coverLetter.id);
  });
  
  it('should handle errors in the job application flow', async () => {
    // Step 1: Upload a resume
    const mockFile = {
      name: 'resume.pdf',
      mimetype: 'application/pdf',
      buffer: Buffer.from('mock file content')
    };
    
    const resume = await uploadResume(
      { file: mockFile, title: 'My Professional Resume' },
      mockContext
    );
    
    // Step 2: Search for jobs
    const searchResult = await searchJobs(
      { query: 'software engineer', location: 'San Francisco, CA' },
      mockContext
    );
    
    const job = searchResult.jobs[0];
    
    // Step 3: Try to apply without a cover letter
    const application = await applyToJob(
      {
        jobId: job.id,
        resumeId: resume.id
      },
      mockContext
    );
    
    expect(application).toBeDefined();
    expect(application.coverLetterId).toBeUndefined();
    
    // Step 4: Try to apply again (should fail)
    await expect(
      applyToJob(
        {
          jobId: job.id,
          resumeId: resume.id
        },
        mockContext
      )
    ).rejects.toThrow(HttpError);
    
    // Verify that only one application was created
    expect(testDb.jobApplications.length).toBe(1);
  });
});
