import { v4 as uuidv4 } from 'uuid';
import {
  ResumeData,
  ResumeVersion,
  ResumeTemplate,
  ResumeFormat,
  ResumeSection,
  ResumeExportFormat,
  ResumeExportOptions,
  ResumeImportSource,
  ResumeImportOptions,
  ResumeParsingResult,
  ResumeAnalysis,
  AIRewriteRequest,
  AIRewriteResponse,
  ATSScore
} from '../types';
import {
  generateResumeAnalysisPrompt,
  generateResumeSummaryRewritePrompt,
  generateResumeExperienceBulletRewritePrompt,
  generateResumeSkillsRewritePrompt,
  generateATSOptimizationPrompt,
  generateJobTailoringPrompt,
  getSectionRewritePrompt,
  generateResumeImprovementSuggestionsPrompt,
  generateResumeComparisonPrompt,
  generateResumeGenerationPrompt,
  ResumeAnalysisPromptParams,
  ResumeSummaryRewritePromptParams,
  ResumeExperienceBulletRewritePromptParams,
  ResumeSkillsRewritePromptParams,
  ATSOptimizationPromptParams,
  JobTailoringPromptParams,
  SectionRewritePromptParams,
  ResumeImprovementSuggestionsPromptParams,
  ResumeComparisonPromptParams,
  ResumeGenerationPromptParams
} from '../ai/resumePrompts';

/**
 * Service for handling resume functionality
 */
class ResumeService {
  private resumes: ResumeData[] = [];
  private versions: ResumeVersion[] = [];
  private templates: ResumeTemplate[] = [];
  private analyses: ResumeAnalysis[] = [];
  private aiRequests: AIRewriteRequest[] = [];
  private aiResponses: AIRewriteResponse[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Get all resumes for a user
   */
  async getResumes(userId: string): Promise<ResumeData[]> {
    return this.resumes.filter(resume => resume.userId === userId);
  }

  /**
   * Get a resume by ID
   */
  async getResumeById(id: string): Promise<ResumeData | null> {
    const resume = this.resumes.find(r => r.id === id);
    return resume || null;
  }

  /**
   * Create a new resume
   */
  async createResume(
    userId: string,
    name: string,
    format: ResumeFormat,
    data: Partial<Omit<ResumeData, 'id' | 'userId' | 'name' | 'format' | 'createdAt' | 'updatedAt'>>
  ): Promise<ResumeData> {
    const now = new Date().toISOString();
    
    const newResume: ResumeData = {
      id: uuidv4(),
      userId,
      name,
      format,
      header: data.header || {
        name: '',
        title: '',
        email: '',
      },
      summary: data.summary || '',
      experience: data.experience || [],
      education: data.education || [],
      skills: data.skills || [],
      projects: data.projects || [],
      certifications: data.certifications || [],
      awards: data.awards || [],
      publications: data.publications || [],
      languages: data.languages || [],
      interests: data.interests || [],
      references: data.references || '',
      customSections: data.customSections || {},
      createdAt: now,
      updatedAt: now
    };

    this.resumes.push(newResume);
    
    // Create initial version
    this.createVersion(newResume.id, 'Initial Version', newResume);
    
    return newResume;
  }

  /**
   * Update a resume
   */
  async updateResume(
    id: string,
    updates: Partial<Omit<ResumeData, 'id' | 'userId' | 'createdAt'>>
  ): Promise<ResumeData | null> {
    const resumeIndex = this.resumes.findIndex(r => r.id === id);
    if (resumeIndex === -1) return null;

    this.resumes[resumeIndex] = {
      ...this.resumes[resumeIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Create a new version if significant changes were made
    if (
      updates.header ||
      updates.summary ||
      updates.experience ||
      updates.education ||
      updates.skills
    ) {
      this.createVersion(
        id,
        `Update ${new Date().toLocaleString()}`,
        this.resumes[resumeIndex]
      );
    }

    return this.resumes[resumeIndex];
  }

  /**
   * Delete a resume
   */
  async deleteResume(id: string): Promise<boolean> {
    const initialLength = this.resumes.length;
    this.resumes = this.resumes.filter(r => r.id !== id);
    
    // Also delete versions
    this.versions = this.versions.filter(v => v.resumeId !== id);
    
    // Also delete analyses
    this.analyses = this.analyses.filter(a => a.resumeId !== id);
    
    return initialLength > this.resumes.length;
  }

  /**
   * Get all versions of a resume
   */
  async getResumeVersions(resumeId: string): Promise<ResumeVersion[]> {
    return this.versions
      .filter(version => version.resumeId === resumeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get a specific version of a resume
   */
  async getResumeVersion(versionId: string): Promise<ResumeVersion | null> {
    const version = this.versions.find(v => v.id === versionId);
    return version || null;
  }

  /**
   * Create a new version of a resume
   */
  async createVersion(
    resumeId: string,
    name: string,
    data: ResumeData
  ): Promise<ResumeVersion> {
    const newVersion: ResumeVersion = {
      id: uuidv4(),
      resumeId,
      name,
      data,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // Set all other versions to inactive
    this.versions
      .filter(v => v.resumeId === resumeId)
      .forEach(v => {
        v.isActive = false;
      });

    this.versions.push(newVersion);
    return newVersion;
  }

  /**
   * Set a version as the active version
   */
  async setActiveVersion(versionId: string): Promise<ResumeVersion | null> {
    const versionIndex = this.versions.findIndex(v => v.id === versionId);
    if (versionIndex === -1) return null;

    const resumeId = this.versions[versionIndex].resumeId;

    // Set all versions of this resume to inactive
    this.versions
      .filter(v => v.resumeId === resumeId)
      .forEach(v => {
        v.isActive = false;
      });

    // Set the specified version to active
    this.versions[versionIndex].isActive = true;

    // Update the resume with the data from this version
    const resumeIndex = this.resumes.findIndex(r => r.id === resumeId);
    if (resumeIndex !== -1) {
      this.resumes[resumeIndex] = {
        ...this.versions[versionIndex].data,
        updatedAt: new Date().toISOString()
      };
    }

    return this.versions[versionIndex];
  }

  /**
   * Delete a version
   */
  async deleteVersion(versionId: string): Promise<boolean> {
    const initialLength = this.versions.length;
    
    // Cannot delete if it's the only version
    const version = this.versions.find(v => v.id === versionId);
    if (!version) return false;
    
    const resumeVersions = this.versions.filter(v => v.resumeId === version.resumeId);
    if (resumeVersions.length <= 1) return false;
    
    // If deleting the active version, set another one as active
    if (version.isActive) {
      const otherVersions = resumeVersions.filter(v => v.id !== versionId);
      if (otherVersions.length > 0) {
        // Set the most recent version as active
        otherVersions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        otherVersions[0].isActive = true;
        
        // Update the resume with the data from this version
        const resumeIndex = this.resumes.findIndex(r => r.id === version.resumeId);
        if (resumeIndex !== -1) {
          this.resumes[resumeIndex] = {
            ...otherVersions[0].data,
            updatedAt: new Date().toISOString()
          };
        }
      }
    }
    
    this.versions = this.versions.filter(v => v.id !== versionId);
    return initialLength > this.versions.length;
  }

  /**
   * Get all resume templates
   */
  async getResumeTemplates(): Promise<ResumeTemplate[]> {
    return this.templates;
  }

  /**
   * Get a resume template by ID
   */
  async getResumeTemplateById(id: string): Promise<ResumeTemplate | null> {
    const template = this.templates.find(t => t.id === id);
    return template || null;
  }

  /**
   * Apply a template to a resume
   */
  async applyTemplate(resumeId: string, templateId: string): Promise<ResumeData | null> {
    const resumeIndex = this.resumes.findIndex(r => r.id === resumeId);
    const template = this.templates.find(t => t.id === templateId);
    
    if (resumeIndex === -1 || !template) return null;
    
    // Update the resume format based on the template
    this.resumes[resumeIndex] = {
      ...this.resumes[resumeIndex],
      format: template.format,
      updatedAt: new Date().toISOString()
    };
    
    // Create a new version
    this.createVersion(
      resumeId,
      `Applied Template: ${template.name}`,
      this.resumes[resumeIndex]
    );
    
    return this.resumes[resumeIndex];
  }

  /**
   * Export a resume
   */
  async exportResume(
    resumeId: string,
    options: ResumeExportOptions
  ): Promise<{ url: string; filename: string } | null> {
    const resume = this.resumes.find(r => r.id === resumeId);
    if (!resume) return null;
    
    // In a real implementation, this would generate the file and return a URL
    // For now, we'll just return a mock URL
    const filename = `${resume.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${options.format.toLowerCase()}`;
    const url = `https://example.com/exports/${filename}`;
    
    return { url, filename };
  }

  /**
   * Import a resume
   */
  async importResume(
    userId: string,
    source: ResumeImportSource,
    content: string,
    options?: ResumeImportOptions
  ): Promise<ResumeParsingResult> {
    // In a real implementation, this would parse the resume from the source
    // For now, we'll just return a mock result
    
    const mockResult: ResumeParsingResult = {
      success: true,
      data: {
        header: {
          name: 'John Doe',
          title: 'Software Engineer',
          email: 'john.doe@example.com',
          phone: '(123) 456-7890',
          location: 'San Francisco, CA'
        },
        summary: 'Experienced software engineer with a passion for building scalable applications.',
        experience: [
          {
            id: uuidv4(),
            company: 'Example Corp',
            title: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2020-01-01',
            endDate: '2023-01-01',
            bullets: [
              'Led a team of 5 engineers to develop a new product feature that increased user engagement by 25%',
              'Implemented CI/CD pipeline that reduced deployment time by 50%',
              'Refactored legacy codebase resulting in 30% performance improvement'
            ]
          }
        ],
        education: [
          {
            id: uuidv4(),
            institution: 'University of Example',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            location: 'Example City, CA',
            startDate: '2012-09-01',
            endDate: '2016-05-01'
          }
        ],
        skills: [
          {
            id: uuidv4(),
            name: 'JavaScript',
            level: 5,
            category: 'Programming Languages'
          },
          {
            id: uuidv4(),
            name: 'React',
            level: 4,
            category: 'Frameworks'
          },
          {
            id: uuidv4(),
            name: 'Node.js',
            level: 4,
            category: 'Frameworks'
          }
        ]
      },
      warnings: ['Some formatting may have been lost during import']
    };
    
    // Create a new resume with the parsed data
    if (mockResult.success && mockResult.data) {
      const format = options?.format || ResumeFormat.Standard;
      const newResume = await this.createResume(userId, 'Imported Resume', format, mockResult.data);
      mockResult.data = newResume;
    }
    
    return mockResult;
  }

  /**
   * Analyze a resume
   */
  async analyzeResume(
    resumeId: string,
    jobTitle?: string,
    jobDescription?: string
  ): Promise<ResumeAnalysis> {
    const resume = this.resumes.find(r => r.id === resumeId);
    if (!resume) {
      throw new Error('Resume not found');
    }
    
    // In a real implementation, this would call an AI service to analyze the resume
    // For now, we'll just return a mock analysis
    
    const mockATSScore: ATSScore = {
      overall: 75,
      sections: {
        [ResumeSection.Header]: 90,
        [ResumeSection.Summary]: 70,
        [ResumeSection.Experience]: 80,
        [ResumeSection.Education]: 85,
        [ResumeSection.Skills]: 65
      },
      keywords: {
        matched: ['software engineer', 'JavaScript', 'React', 'Node.js'],
        missing: ['TypeScript', 'AWS', 'CI/CD']
      },
      suggestions: [
        'Add more keywords from the job description',
        'Quantify achievements in experience section',
        'Add more technical skills'
      ]
    };
    
    const analysis: ResumeAnalysis = {
      id: uuidv4(),
      resumeId,
      jobTitle,
      jobDescription,
      atsScore: mockATSScore,
      strengths: [
        'Clear and concise summary',
        'Quantified achievements in experience section',
        'Relevant education and skills'
      ],
      weaknesses: [
        'Missing some key keywords from job description',
        'Skills section could be more comprehensive',
        'Summary could be more tailored to the specific job'
      ],
      suggestions: [
        'Add more keywords from the job description to improve ATS score',
        'Quantify more achievements in your experience section',
        'Add more technical skills relevant to the job',
        'Tailor your summary to the specific job',
        'Consider adding a projects section to showcase relevant work'
      ],
      createdAt: new Date().toISOString()
    };
    
    this.analyses.push(analysis);
    return analysis;
  }

  /**
   * Get resume analyses
   */
  async getResumeAnalyses(resumeId: string): Promise<ResumeAnalysis[]> {
    return this.analyses
      .filter(analysis => analysis.resumeId === resumeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Request AI rewrite
   */
  async requestAIRewrite(request: AIRewriteRequest): Promise<AIRewriteResponse> {
    const resume = this.resumes.find(r => r.id === request.resumeId);
    if (!resume) {
      throw new Error('Resume not found');
    }
    
    // In a real implementation, this would call an AI service to rewrite the content
    // For now, we'll just return a mock response
    
    let originalContent: any;
    let rewrittenContent: any;
    
    if (request.section === 'all') {
      originalContent = resume;
      rewrittenContent = { ...resume };
      
      // Rewrite summary
      if (resume.summary) {
        rewrittenContent.summary = 'Results-driven Software Engineer with 5+ years of experience developing scalable web applications using JavaScript, React, and Node.js. Proven track record of leading teams to deliver high-quality products that increase user engagement and improve performance. Passionate about clean code, CI/CD, and creating exceptional user experiences.';
      }
      
      // Rewrite experience bullets
      if (resume.experience && resume.experience.length > 0) {
        rewrittenContent.experience = resume.experience.map(exp => ({
          ...exp,
          bullets: exp.bullets.map(bullet => 
            bullet.replace(/^(Implemented|Developed|Created|Built)/, 'Engineered')
          )
        }));
      }
      
    } else if (request.section === ResumeSection.Summary) {
      originalContent = resume.summary;
      rewrittenContent = 'Results-driven Software Engineer with 5+ years of experience developing scalable web applications using JavaScript, React, and Node.js. Proven track record of leading teams to deliver high-quality products that increase user engagement and improve performance. Passionate about clean code, CI/CD, and creating exceptional user experiences.';
      
    } else if (request.section === ResumeSection.Experience) {
      originalContent = resume.experience;
      rewrittenContent = resume.experience.map(exp => ({
        ...exp,
        bullets: exp.bullets.map(bullet => 
          bullet.replace(/^(Implemented|Developed|Created|Built)/, 'Engineered')
        )
      }));
      
    } else if (request.section === ResumeSection.Skills) {
      originalContent = resume.skills;
      rewrittenContent = [
        ...resume.skills,
        {
          id: uuidv4(),
          name: 'TypeScript',
          level: 4,
          category: 'Programming Languages'
        },
        {
          id: uuidv4(),
          name: 'AWS',
          level: 3,
          category: 'Cloud Services'
        }
      ];
    } else {
      originalContent = resume[request.section];
      rewrittenContent = originalContent;
    }
    
    const response: AIRewriteResponse = {
      id: uuidv4(),
      requestId: uuidv4(),
      originalContent,
      rewrittenContent,
      explanation: 'Enhanced the content with stronger action verbs, quantified achievements, and added relevant keywords to improve ATS compatibility.',
      createdAt: new Date().toISOString()
    };
    
    this.aiResponses.push(response);
    return response;
  }

  /**
   * Apply AI rewrite
   */
  async applyAIRewrite(
    resumeId: string,
    rewriteResponseId: string
  ): Promise<ResumeData | null> {
    const resumeIndex = this.resumes.findIndex(r => r.id === resumeId);
    const rewriteResponse = this.aiResponses.find(r => r.id === rewriteResponseId);
    
    if (resumeIndex === -1 || !rewriteResponse) return null;
    
    const resume = this.resumes[resumeIndex];
    let updatedResume: ResumeData;
    
    // Determine what section was rewritten and apply the changes
    if (typeof rewriteResponse.rewrittenContent === 'string') {
      // Likely a summary rewrite
      updatedResume = {
        ...resume,
        summary: rewriteResponse.rewrittenContent,
        updatedAt: new Date().toISOString()
      };
    } else if (Array.isArray(rewriteResponse.rewrittenContent)) {
      // Likely an experience or skills rewrite
      if (rewriteResponse.rewrittenContent[0]?.company) {
        updatedResume = {
          ...resume,
          experience: rewriteResponse.rewrittenContent,
          updatedAt: new Date().toISOString()
        };
      } else if (rewriteResponse.rewrittenContent[0]?.name) {
        updatedResume = {
          ...resume,
          skills: rewriteResponse.rewrittenContent,
          updatedAt: new Date().toISOString()
        };
      } else {
        updatedResume = {
          ...resume,
          updatedAt: new Date().toISOString()
        };
      }
    } else {
      // Full resume rewrite or other section
      updatedResume = {
        ...resume,
        ...rewriteResponse.rewrittenContent,
        id: resume.id, // Ensure ID doesn't change
        userId: resume.userId, // Ensure user ID doesn't change
        createdAt: resume.createdAt, // Ensure created date doesn't change
        updatedAt: new Date().toISOString()
      };
    }
    
    this.resumes[resumeIndex] = updatedResume;
    
    // Create a new version
    this.createVersion(
      resumeId,
      `AI Rewrite ${new Date().toLocaleString()}`,
      updatedResume
    );
    
    return updatedResume;
  }

  /**
   * Generate AI prompts for resume-related tasks
   */
  generateAIPrompt(type: string, params: any): string {
    switch (type) {
      case 'analysis':
        return generateResumeAnalysisPrompt(params as ResumeAnalysisPromptParams);
      case 'summary-rewrite':
        return generateResumeSummaryRewritePrompt(params as ResumeSummaryRewritePromptParams);
      case 'experience-bullet-rewrite':
        return generateResumeExperienceBulletRewritePrompt(params as ResumeExperienceBulletRewritePromptParams);
      case 'skills-rewrite':
        return generateResumeSkillsRewritePrompt(params as ResumeSkillsRewritePromptParams);
      case 'ats-optimization':
        return generateATSOptimizationPrompt(params as ATSOptimizationPromptParams);
      case 'job-tailoring':
        return generateJobTailoringPrompt(params as JobTailoringPromptParams);
      case 'section-rewrite':
        return getSectionRewritePrompt(params as SectionRewritePromptParams);
      case 'improvement-suggestions':
        return generateResumeImprovementSuggestionsPrompt(params as ResumeImprovementSuggestionsPromptParams);
      case 'comparison':
        return generateResumeComparisonPrompt(params as ResumeComparisonPromptParams);
      case 'generation':
        return generateResumeGenerationPrompt(params as ResumeGenerationPromptParams);
      default:
        throw new Error(`Unknown prompt type: ${type}`);
    }
  }

  /**
   * Initialize mock data for development and testing
   */
  private initializeMockData() {
    // Mock templates
    this.templates = [
      {
        id: uuidv4(),
        name: 'Professional',
        description: 'A clean, professional template suitable for most industries.',
        format: ResumeFormat.Standard,
        imageUrl: 'https://example.com/templates/professional.jpg',
        isDefault: true,
        isPremium: false,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z'
      },
      {
        id: uuidv4(),
        name: 'Modern',
        description: 'A modern template with a sleek design and subtle color accents.',
        format: ResumeFormat.Modern,
        imageUrl: 'https://example.com/templates/modern.jpg',
        isDefault: false,
        isPremium: false,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z'
      },
      {
        id: uuidv4(),
        name: 'Creative',
        description: 'A creative template with unique design elements for creative industries.',
        format: ResumeFormat.Creative,
        imageUrl: 'https://example.com/templates/creative.jpg',
        isDefault: false,
        isPremium: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z'
      },
      {
        id: uuidv4(),
        name: 'Executive',
        description: 'An executive template with a sophisticated design for senior professionals.',
        format: ResumeFormat.Executive,
        imageUrl: 'https://example.com/templates/executive.jpg',
        isDefault: false,
        isPremium: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z'
      },
      {
        id: uuidv4(),
        name: 'ATS-Optimized',
        description: 'A template designed to pass through ATS systems with ease.',
        format: ResumeFormat.ATS,
        imageUrl: 'https://example.com/templates/ats.jpg',
        isDefault: false,
        isPremium: false,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z'
      }
    ];

    // Mock resume for user-1
    const resumeId = uuidv4();
    const resume: ResumeData = {
      id: resumeId,
      userId: 'user-1',
      name: 'Software Engineer Resume',
      format: ResumeFormat.Standard,
      header: {
        name: 'John Doe',
        title: 'Software Engineer',
        email: 'john.doe@example.com',
        phone: '(123) 456-7890',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/johndoe',
        github: 'github.com/johndoe'
      },
      summary: 'Software engineer with 5+ years of experience developing web applications using JavaScript, React, and Node.js.',
      experience: [
        {
          id: uuidv4(),
          company: 'Example Corp',
          title: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2020-01-01',
          endDate: '2023-01-01',
          bullets: [
            'Led a team of 5 engineers to develop a new product feature that increased user engagement by 25%',
            'Implemented CI/CD pipeline that reduced deployment time by 50%',
            'Refactored legacy codebase resulting in 30% performance improvement'
          ]
        },
        {
          id: uuidv4(),
          company: 'Tech Startup',
          title: 'Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2018-01-01',
          endDate: '2019-12-31',
          bullets: [
            'Developed responsive web applications using React and Redux',
            'Collaborated with UX designers to implement user-friendly interfaces',
            'Participated in code reviews and mentored junior developers'
          ]
        }
      ],
      education: [
        {
          id: uuidv4(),
          institution: 'University of Example',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          location: 'Example City, CA',
          startDate: '2014-09-01',
          endDate: '2018-05-01',
          gpa: '3.8'
        }
      ],
      skills: [
        {
          id: uuidv4(),
          name: 'JavaScript',
          level: 5,
          category: 'Programming Languages'
        },
        {
          id: uuidv4(),
          name: 'React',
          level: 4,
          category: 'Frameworks'
        },
        {
          id: uuidv4(),
          name: 'Node.js',
          level: 4,
          category: 'Frameworks'
        },
        {
          id: uuidv4(),
          name: 'HTML/CSS',
          level: 4,
          category: 'Web Technologies'
        },
        {
          id: uuidv4(),
          name: 'Git',
          level: 4,
          category: 'Tools'
        }
      ],
      projects: [
        {
          id: uuidv4(),
          name: 'E-commerce Platform',
          description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB',
          url: 'https://github.com/johndoe/ecommerce',
          startDate: '2019-06-01',
          endDate: '2019-12-01',
          bullets: [
            'Implemented user authentication and authorization',
            'Developed shopping cart and checkout functionality',
            'Integrated with payment gateway API'
          ]
        }
      ],
      createdAt: '2025-02-01T00:00:00Z',
      updatedAt: '2025-02-01T00:00:00Z'
    };
    
    this.resumes.push(resume);
    
    // Create initial version
    const version: ResumeVersion = {
      id: uuidv4(),
      resumeId,
      name: 'Initial Version',
      data: resume,
      createdAt: '2025-02-01T00:00:00Z',
      isActive: true
    };
    
    this.versions.push(version);
    
    // Mock analysis
    const analysis: ResumeAnalysis = {
      id: uuidv4(),
      resumeId,
      jobTitle: 'Senior Software Engineer',
      jobDescription: 'We are looking for a Senior Software Engineer with experience in JavaScript, React, and Node.js to join our team. The ideal candidate will have 5+ years of experience developing web applications and a strong understanding of modern web technologies.',
      atsScore: {
        overall: 75,
        sections: {
          [ResumeSection.Header]: 90,
          [ResumeSection.Summary]: 70,
          [ResumeSection.Experience]: 80,
          [ResumeSection.Education]: 85,
          [ResumeSection.Skills]: 65
        },
        keywords: {
          matched: ['software engineer', 'JavaScript', 'React', 'Node.js'],
          missing: ['TypeScript', 'AWS', 'CI/CD']
        },
        suggestions: [
          'Add more keywords from the job description',
          'Quantify achievements in experience section',
          'Add more technical skills'
        ]
      },
      strengths: [
        'Clear and concise summary',
        'Quantified achievements in experience section',
        'Relevant education and skills'
      ],
      weaknesses: [
        'Missing some key keywords from job description',
        'Skills section could be more comprehensive',
        'Summary could be more tailored to the specific job'
      ],
      suggestions: [
        'Add more keywords from the job description to improve ATS score',
        'Quantify more achievements in your experience section',
        'Add more technical skills relevant to the job',
        'Tailor your summary to the specific job',
        'Consider adding a projects section to showcase relevant work'
      ],
      createdAt: '2025-02-01T00:00:00Z'
    };
    
    this.analyses.push(analysis);
  }
}

export const resumeService = new ResumeService();
