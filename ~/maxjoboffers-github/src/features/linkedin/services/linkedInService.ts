import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import {
  LinkedInProfile,
  LinkedInSection,
  LinkedInSectionType,
  LinkedInOptimizationParams,
  OptimizationResult,
  ProfileAnalysis,
  ProfileTemplate,
  OptimizationTone,
  OptimizationLength,
  OptimizationFocus
} from '../types';
import { linkedInPrompts } from '../ai/linkedInPrompts';

/**
 * Service for handling LinkedIn profile optimization functionality
 */
class LinkedInService {
  private profiles: LinkedInProfile[] = [];
  private templates: ProfileTemplate[] = [];
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.initializeMockData();
  }

  /**
   * Get a user's LinkedIn profile
   */
  async getProfile(userId: string): Promise<LinkedInProfile | null> {
    const profile = this.profiles.find(p => p.userId === userId);
    return profile || null;
  }

  /**
   * Create a new LinkedIn profile
   */
  async createProfile(userId: string, jobTitle: string, industry: string): Promise<LinkedInProfile> {
    const now = new Date().toISOString();
    
    const newProfile: LinkedInProfile = {
      id: uuidv4(),
      userId,
      jobTitle,
      industry,
      headline: '',
      summary: '',
      sections: [],
      createdAt: now,
      lastUpdated: now,
      isComplete: false
    };

    this.profiles.push(newProfile);
    return newProfile;
  }

  /**
   * Update a LinkedIn profile
   */
  async updateProfile(
    profileId: string,
    updates: Partial<Omit<LinkedInProfile, 'id' | 'userId' | 'createdAt'>>
  ): Promise<LinkedInProfile | null> {
    const profileIndex = this.profiles.findIndex(p => p.id === profileId);
    if (profileIndex === -1) return null;

    this.profiles[profileIndex] = {
      ...this.profiles[profileIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    return this.profiles[profileIndex];
  }

  /**
   * Add a section to a LinkedIn profile
   */
  async addSection(
    profileId: string,
    type: LinkedInSectionType,
    title: string,
    content: string
  ): Promise<LinkedInSection | null> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return null;

    const newSection: LinkedInSection = {
      id: uuidv4(),
      type,
      title,
      content,
      lastUpdated: new Date().toISOString(),
      isOptimized: false
    };

    profile.sections.push(newSection);
    profile.lastUpdated = new Date().toISOString();

    return newSection;
  }

  /**
   * Update a LinkedIn profile section
   */
  async updateSection(
    profileId: string,
    sectionId: string,
    updates: Partial<Omit<LinkedInSection, 'id' | 'type'>>
  ): Promise<LinkedInSection | null> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return null;

    const sectionIndex = profile.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return null;

    profile.sections[sectionIndex] = {
      ...profile.sections[sectionIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    profile.lastUpdated = new Date().toISOString();

    return profile.sections[sectionIndex];
  }

  /**
   * Delete a LinkedIn profile section
   */
  async deleteSection(profileId: string, sectionId: string): Promise<boolean> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return false;

    const initialLength = profile.sections.length;
    profile.sections = profile.sections.filter(s => s.id !== sectionId);
    profile.lastUpdated = new Date().toISOString();

    return initialLength > profile.sections.length;
  }

  /**
   * Optimize a LinkedIn profile section
   */
  async optimizeSection(
    profileId: string,
    sectionId: string,
    params: LinkedInOptimizationParams
  ): Promise<OptimizationResult | null> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return null;

    const section = profile.sections.find(s => s.id === sectionId);
    if (!section) return null;

    try {
      // Generate optimized content using AI
      const result = await this.generateOptimizedContent({
        ...params,
        currentContent: section.content
      });

      // Update the section with optimized content
      section.originalContent = section.content;
      section.content = result.optimizedContent;
      section.isOptimized = true;
      section.lastUpdated = new Date().toISOString();
      profile.lastUpdated = new Date().toISOString();

      return result;
    } catch (error) {
      console.error('Error optimizing LinkedIn section:', error);
      return null;
    }
  }

  /**
   * Analyze a LinkedIn profile
   */
  async analyzeProfile(profileId: string): Promise<ProfileAnalysis | null> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return null;

    try {
      // In a real implementation, this would use AI to analyze the profile
      // For now, we'll return mock data
      return this.generateMockProfileAnalysis(profile);
    } catch (error) {
      console.error('Error analyzing LinkedIn profile:', error);
      return null;
    }
  }

  /**
   * Get LinkedIn profile templates
   */
  async getTemplates(industry?: string, jobTitle?: string): Promise<ProfileTemplate[]> {
    let filteredTemplates = [...this.templates];

    if (industry) {
      filteredTemplates = filteredTemplates.filter(t => 
        t.industry.toLowerCase().includes(industry.toLowerCase())
      );
    }

    if (jobTitle) {
      filteredTemplates = filteredTemplates.filter(t => 
        t.jobTitle.toLowerCase().includes(jobTitle.toLowerCase())
      );
    }

    return filteredTemplates;
  }

  /**
   * Apply a template to a LinkedIn profile
   */
  async applyTemplate(
    profileId: string,
    templateId: string
  ): Promise<LinkedInProfile | null> {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return null;

    const template = this.templates.find(t => t.id === templateId);
    if (!template) return null;

    // Apply template sections to profile
    for (const [sectionType, content] of Object.entries(template.sections)) {
      const type = sectionType as LinkedInSectionType;
      
      // Check if section already exists
      const existingSection = profile.sections.find(s => s.type === type);
      
      if (existingSection) {
        // Update existing section
        existingSection.content = content;
        existingSection.lastUpdated = new Date().toISOString();
        existingSection.isOptimized = true;
      } else {
        // Add new section
        profile.sections.push({
          id: uuidv4(),
          type,
          title: this.getSectionTitle(type),
          content,
          lastUpdated: new Date().toISOString(),
          isOptimized: true
        });
      }
    }

    // Update profile
    profile.lastUpdated = new Date().toISOString();
    
    return profile;
  }

  /**
   * Generate optimized content using AI
   */
  private async generateOptimizedContent(
    params: LinkedInOptimizationParams
  ): Promise<OptimizationResult> {
    try {
      const prompt = `
${linkedInPrompts.optimizationPrompt}

Job Title: ${params.jobTitle}
Industry: ${params.industry}
Section Type: ${params.sectionType}
Current Content: ${params.currentContent || ''}
Target Keywords: ${params.targetKeywords?.join(', ') || ''}
Tone: ${params.tone || OptimizationTone.Professional}
Length: ${params.length || OptimizationLength.Moderate}
Focus Areas: ${params.focus?.join(', ') || OptimizationFocus.Keywords}
`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert LinkedIn profile optimizer with deep knowledge of professional branding, SEO, and industry-specific terminology.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      return JSON.parse(jsonMatch[0]) as OptimizationResult;
    } catch (error) {
      console.error('Error generating optimized content:', error);
      
      // Return mock data if API call fails
      return this.generateMockOptimizationResult(params);
    }
  }

  /**
   * Get section title based on section type
   */
  private getSectionTitle(type: LinkedInSectionType): string {
    switch (type) {
      case LinkedInSectionType.Headline:
        return 'Professional Headline';
      case LinkedInSectionType.Summary:
        return 'About';
      case LinkedInSectionType.Experience:
        return 'Experience';
      case LinkedInSectionType.Education:
        return 'Education';
      case LinkedInSectionType.Skills:
        return 'Skills';
      case LinkedInSectionType.Recommendations:
        return 'Recommendations';
      case LinkedInSectionType.Accomplishments:
        return 'Accomplishments';
      case LinkedInSectionType.Volunteer:
        return 'Volunteer Experience';
      case LinkedInSectionType.Certifications:
        return 'Certifications';
      case LinkedInSectionType.Projects:
        return 'Projects';
      case LinkedInSectionType.Custom:
        return 'Custom Section';
      default:
        return 'Section';
    }
  }

  /**
   * Initialize mock data for development and testing
   */
  private initializeMockData() {
    // Mock profiles
    this.profiles = [
      {
        id: uuidv4(),
        userId: 'user-1',
        jobTitle: 'Software Engineer',
        industry: 'Technology',
        headline: 'Software Engineer | Full Stack Developer | JavaScript | React | Node.js',
        summary: 'Experienced software engineer with a passion for building scalable web applications...',
        sections: [
          {
            id: uuidv4(),
            type: LinkedInSectionType.Experience,
            title: 'Experience',
            content: 'Senior Software Engineer at TechCorp\nJanuary 2020 - Present\n\nDeveloped and maintained...',
            lastUpdated: '2025-01-15T00:00:00Z',
            isOptimized: false
          },
          {
            id: uuidv4(),
            type: LinkedInSectionType.Education,
            title: 'Education',
            content: 'Bachelor of Science in Computer Science\nUniversity of Technology\n2016 - 2020',
            lastUpdated: '2025-01-15T00:00:00Z',
            isOptimized: false
          }
        ],
        createdAt: '2025-01-15T00:00:00Z',
        lastUpdated: '2025-01-15T00:00:00Z',
        isComplete: true
      }
    ];

    // Mock templates
    this.templates = [
      {
        id: uuidv4(),
        name: 'Software Engineer Template',
        description: 'Optimized template for software engineering roles',
        industry: 'Technology',
        jobTitle: 'Software Engineer',
        sections: {
          [LinkedInSectionType.Headline]: 'Software Engineer | Full Stack Developer | JavaScript | React | Node.js',
          [LinkedInSectionType.Summary]: 'Innovative Software Engineer with a passion for developing scalable applications that solve real-world problems. Experienced in full-stack development with expertise in JavaScript, React, and Node.js. Committed to writing clean, maintainable code and continuously learning new technologies.',
          [LinkedInSectionType.Experience]: 'Senior Software Engineer at TechCorp\nJanuary 2020 - Present\n\nLed the development of a high-performance web application that increased user engagement by 40%.\nImplemented microservices architecture using Node.js and Docker, improving system reliability and scalability.\nCollaborated with cross-functional teams to deliver features on time and within scope.'
        },
        keywords: ['JavaScript', 'React', 'Node.js', 'Full Stack', 'Software Engineering', 'Web Development']
      },
      {
        id: uuidv4(),
        name: 'Product Manager Template',
        description: 'Optimized template for product management roles',
        industry: 'Technology',
        jobTitle: 'Product Manager',
        sections: {
          [LinkedInSectionType.Headline]: 'Product Manager | User Experience | Agile | Data-Driven Decision Making',
          [LinkedInSectionType.Summary]: 'Results-oriented Product Manager with a track record of launching successful products that delight users and drive business growth. Skilled in user research, agile methodologies, and cross-functional team leadership. Passionate about creating intuitive user experiences backed by data-driven insights.',
          [LinkedInSectionType.Experience]: 'Senior Product Manager at ProductCorp\nJanuary 2020 - Present\n\nLed the development and launch of a new product feature that increased revenue by 25%.\nConducted user research and usability testing to inform product decisions, resulting in a 30% improvement in user satisfaction.\nManaged a cross-functional team of designers, engineers, and marketers to deliver products on schedule.'
        },
        keywords: ['Product Management', 'Agile', 'User Experience', 'Product Strategy', 'Data Analysis', 'Cross-functional Leadership']
      }
    ];
  }

  /**
   * Generate mock optimization result for development and testing
   */
  private generateMockOptimizationResult(
    params: LinkedInOptimizationParams
  ): OptimizationResult {
    const currentContent = params.currentContent || '';
    
    return {
      originalContent: currentContent,
      optimizedContent: `Optimized version of: ${currentContent}\n\nWith focus on ${params.jobTitle} in the ${params.industry} industry.`,
      improvements: [
        'Added relevant keywords',
        'Improved readability',
        'Enhanced professional tone',
        'Highlighted key achievements'
      ],
      keywordsAdded: params.targetKeywords || ['professional', 'expert', 'skilled'],
      readabilityScore: 85,
      seo: {
        score: 90,
        suggestions: [
          'Consider adding more industry-specific terms',
          'Include measurable achievements with metrics'
        ]
      }
    };
  }

  /**
   * Generate mock profile analysis for development and testing
   */
  private generateMockProfileAnalysis(profile: LinkedInProfile): ProfileAnalysis {
    return {
      overallScore: 75,
      sectionScores: {
        [LinkedInSectionType.Headline]: 80,
        [LinkedInSectionType.Summary]: 70,
        [LinkedInSectionType.Experience]: 85,
        [LinkedInSectionType.Education]: 90,
        [LinkedInSectionType.Skills]: 65
      },
      strengths: [
        'Strong professional headline',
        'Detailed experience section',
        'Clear education information'
      ],
      weaknesses: [
        'Summary could be more compelling',
        'Skills section needs more relevant keywords',
        'Missing recommendations'
      ],
      recommendations: [
        'Add more industry-specific keywords to your headline',
        'Include measurable achievements in your experience section',
        'Add more skills relevant to your target role',
        'Request recommendations from colleagues'
      ],
      keywordAnalysis: {
        present: ['Software Engineer', 'JavaScript', 'React'],
        missing: ['Node.js', 'Full Stack', 'Web Development'],
        recommended: ['API', 'Cloud', 'Agile', 'Microservices']
      }
    };
  }
}

export const linkedInService = new LinkedInService();
