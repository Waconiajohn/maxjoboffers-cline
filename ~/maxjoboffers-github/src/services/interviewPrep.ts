import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import { 
  InterviewPrepGuide, 
  InterviewPrepGenerationParams,
  CompanyResearch,
  Competitor,
  GrowthArea,
  Risk,
  RoleImpact,
  InterviewQuestion,
  InterviewTip
} from '../types/interviewPrep';
import {
  companyResearchPrompt,
  competitorsPrompt,
  growthAreasPrompt,
  risksPrompt,
  roleImpactPrompt,
  interviewQuestionsPrompt,
  interviewTipsPrompt,
  completeInterviewGuidePrompt
} from '../ai/interviewPrompts';

/**
 * Service for handling interview preparation functionality
 */
class InterviewPrepService {
  private guides: InterviewPrepGuide[] = [];
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  
  /**
   * Generate an interview preparation guide using AI
   */
  async generateGuide(params: InterviewPrepGenerationParams): Promise<InterviewPrepGuide> {
    try {
      // Option 1: Generate the entire guide at once using the complete prompt
      // This is more efficient but may hit token limits for large resumes/job descriptions
      const completeGuide = await this.generateCompleteGuide(params);
      
      // Option 2: Generate each section separately
      // This is more reliable for large inputs but requires multiple API calls
      // const companyResearch = await this.generateCompanyResearch(params);
      // const competitors = await this.generateCompetitors(params);
      // const growthAreas = await this.generateGrowthAreas(params);
      // const risks = await this.generateRisks(params);
      // const roleImpacts = await this.generateRoleImpacts(params);
      // const questions = await this.generateQuestions(params);
      // const tips = await this.generateTips(params);
      
      // Create a new guide with a unique ID
      const newGuide: InterviewPrepGuide = {
        id: uuidv4(),
        jobId: params.jobId,
        resumeId: params.resumeId || '',
        jobTitle: params.jobTitle,
        companyName: params.companyName,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        companyResearch: completeGuide.companyResearch || this.generateMockCompanyResearch(params),
        competitors: completeGuide.competitors || this.generateMockCompetitors(params),
        growthAreas: completeGuide.growthAreas || this.generateMockGrowthAreas(params),
        risks: completeGuide.risks || this.generateMockRisks(params),
        roleImpacts: completeGuide.roleImpacts || this.generateMockRoleImpacts(params),
        questions: completeGuide.questions || this.generateMockQuestions(params),
        tips: completeGuide.tips || this.generateMockTips(params)
      };
      
      // Save the guide
      this.guides.push(newGuide);
      
      return newGuide;
    } catch (error) {
      console.error('Error generating interview guide:', error);
      throw new Error('Failed to generate interview guide');
    }
  }
  
  /**
   * Get all guides for a user
   */
  async getGuides(): Promise<InterviewPrepGuide[]> {
    // In a real implementation, this would fetch from an API or database
    return this.guides;
  }
  
  /**
   * Get a specific guide by ID
   */
  async getGuideById(id: string): Promise<InterviewPrepGuide | null> {
    const guide = this.guides.find(g => g.id === id);
    return guide || null;
  }
  
  /**
   * Get guides for a specific job
   */
  async getGuidesByJobId(jobId: string): Promise<InterviewPrepGuide[]> {
    return this.guides.filter(g => g.jobId === jobId);
  }
  
  /**
   * Delete a guide
   */
  async deleteGuide(id: string): Promise<boolean> {
    const initialLength = this.guides.length;
    this.guides = this.guides.filter(g => g.id !== id);
    return initialLength > this.guides.length;
  }
  
  /**
   * Generate a complete interview preparation guide using OpenAI
   */
  private async generateCompleteGuide(params: InterviewPrepGenerationParams): Promise<Partial<InterviewPrepGuide>> {
    try {
      const prompt = `
${completeInterviewGuidePrompt}

Job Title: ${params.jobTitle}
Company Name: ${params.companyName}
Job Description: ${params.jobDescription}
${params.resumeContent ? `Resume Content: ${params.resumeContent}` : ''}
`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert interview coach with deep knowledge of industry trends, company research, and interview preparation.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      const result = JSON.parse(jsonMatch[0]);
      
      return {
        companyResearch: result.companyResearch,
        competitors: result.competitors,
        growthAreas: result.growthAreas,
        risks: result.risks,
        roleImpacts: result.roleImpacts,
        questions: result.questions,
        tips: result.tips
      };
    } catch (error) {
      console.error('Error generating complete guide:', error);
      
      // Fallback to mock data if API call fails
      return {
        companyResearch: this.generateMockCompanyResearch(params),
        competitors: this.generateMockCompetitors(params),
        growthAreas: this.generateMockGrowthAreas(params),
        risks: this.generateMockRisks(params),
        roleImpacts: this.generateMockRoleImpacts(params),
        questions: this.generateMockQuestions(params),
        tips: this.generateMockTips(params)
      };
    }
  }
  
  /**
   * Generate company research using OpenAI
   */
  private async generateCompanyResearch(params: InterviewPrepGenerationParams): Promise<CompanyResearch> {
    try {
      const prompt = `
${companyResearchPrompt}

Company Name: ${params.companyName}
Job Title: ${params.jobTitle}
Job Description: ${params.jobDescription}
`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert in company research and industry analysis.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      return JSON.parse(jsonMatch[0]) as CompanyResearch;
    } catch (error) {
      console.error('Error generating company research:', error);
      return this.generateMockCompanyResearch(params);
    }
  }
  
  /**
   * Generate competitors using OpenAI
   */
  private async generateCompetitors(params: InterviewPrepGenerationParams): Promise<Competitor[]> {
    try {
      const prompt = `
${competitorsPrompt}

Company Name: ${params.companyName}
Job Title: ${params.jobTitle}
Job Description: ${params.jobDescription}
`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert in competitive analysis and market research.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      return JSON.parse(jsonMatch[0]) as Competitor[];
    } catch (error) {
      console.error('Error generating competitors:', error);
      return this.generateMockCompetitors(params);
    }
  }
  
  /**
   * Generate growth areas using OpenAI
   */
  private async generateGrowthAreas(params: InterviewPrepGenerationParams): Promise<GrowthArea[]> {
    try {
      const prompt = `
${growthAreasPrompt}

Company Name: ${params.companyName}
Job Title: ${params.jobTitle}
Job Description: ${params.jobDescription}
`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert in business strategy and growth analysis.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      return JSON.parse(jsonMatch[0]) as GrowthArea[];
    } catch (error) {
      console.error('Error generating growth areas:', error);
      return this.generateMockGrowthAreas(params);
    }
  }
  
  /**
   * Generate risks using OpenAI
   */
  private async generateRisks(params: InterviewPrepGenerationParams): Promise<Risk[]> {
    try {
      const prompt = `
${risksPrompt}

Company Name: ${params.companyName}
Job Title: ${params.jobTitle}
Job Description: ${params.jobDescription}
`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert in risk assessment and business analysis.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      return JSON.parse(jsonMatch[0]) as Risk[];
    } catch (error) {
      console.error('Error generating risks:', error);
      return this.generateMockRisks(params);
    }
  }
  
  /**
   * Generate role impacts using OpenAI
   */
  private async generateRoleImpacts(params: InterviewPrepGenerationParams): Promise<RoleImpact[]> {
    try {
      const prompt = `
${roleImpactPrompt}

Company Name: ${params.companyName}
Job Title: ${params.jobTitle}
Job Description: ${params.jobDescription}
`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert in organizational development and role analysis.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      return JSON.parse(jsonMatch[0]) as RoleImpact[];
    } catch (error) {
      console.error('Error generating role impacts:', error);
      return this.generateMockRoleImpacts(params);
    }
  }
  
  /**
   * Generate interview questions using OpenAI
   */
  private async generateQuestions(params: InterviewPrepGenerationParams): Promise<InterviewQuestion[]> {
    try {
      const prompt = `
${interviewQuestionsPrompt}

Job Title: ${params.jobTitle}
Company Name: ${params.companyName}
Job Description: ${params.jobDescription}
${params.resumeContent ? `Resume Content: ${params.resumeContent}` : ''}
`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert in interview preparation and career coaching.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      return JSON.parse(jsonMatch[0]) as InterviewQuestion[];
    } catch (error) {
      console.error('Error generating questions:', error);
      return this.generateMockQuestions(params);
    }
  }
  
  /**
   * Generate interview tips using OpenAI
   */
  private async generateTips(params: InterviewPrepGenerationParams): Promise<InterviewTip[]> {
    try {
      const prompt = `
${interviewTipsPrompt}

Job Title: ${params.jobTitle}
Company Name: ${params.companyName}
Job Description: ${params.jobDescription}
`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert in interview preparation and career coaching.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      return JSON.parse(jsonMatch[0]) as InterviewTip[];
    } catch (error) {
      console.error('Error generating tips:', error);
      return this.generateMockTips(params);
    }
  }
  
  // Mock data generation methods for fallback
  
  private generateMockCompanyResearch(params: InterviewPrepGenerationParams): CompanyResearch {
    return {
      overview: `${params.companyName} is a leading company in its industry, known for innovation and quality service.`,
      focusAreas: [
        `Expanding ${params.jobTitle.toLowerCase()} capabilities`,
        'Digital transformation initiatives',
        'Customer experience enhancement'
      ],
      customerService: `${params.companyName} is known for exceptional customer service and building long-term relationships.`
    };
  }
  
  private generateMockCompetitors(params: InterviewPrepGenerationParams): Competitor[] {
    return [
      {
        name: 'Competitor A',
        description: 'Major player in the industry with strong market presence.'
      },
      {
        name: 'Competitor B',
        description: 'Known for innovation and cutting-edge technology.'
      },
      {
        name: 'Competitor C',
        description: 'Regional competitor with loyal customer base.'
      }
    ];
  }
  
  private generateMockGrowthAreas(params: InterviewPrepGenerationParams): GrowthArea[] {
    return [
      {
        title: 'Market Expansion',
        description: `${params.companyName} is looking to expand into new geographic markets.`
      },
      {
        title: 'Product Development',
        description: 'Investing in new product lines and services.'
      },
      {
        title: 'Digital Transformation',
        description: 'Enhancing digital capabilities and online presence.'
      }
    ];
  }
  
  private generateMockRisks(params: InterviewPrepGenerationParams): Risk[] {
    return [
      {
        title: 'Market Volatility',
        description: 'Economic uncertainties affecting business operations.'
      },
      {
        title: 'Competitive Pressure',
        description: 'Increasing competition in key markets.'
      },
      {
        title: 'Regulatory Changes',
        description: 'Evolving regulations requiring adaptation.'
      }
    ];
  }
  
  private generateMockRoleImpacts(params: InterviewPrepGenerationParams): RoleImpact[] {
    return [
      {
        title: 'Drive Innovation',
        description: `As a ${params.jobTitle}, you will help drive innovation in key areas.`
      },
      {
        title: 'Enhance Efficiency',
        description: 'Streamline processes and improve operational efficiency.'
      },
      {
        title: 'Support Growth',
        description: 'Contribute to company growth initiatives and strategic goals.'
      }
    ];
  }
  
  private generateMockQuestions(params: InterviewPrepGenerationParams): InterviewQuestion[] {
    return [
      {
        category: 'Technical Skills',
        question: `What experience do you have that's relevant to the ${params.jobTitle} role?`,
        answer: 'Your answer should highlight your relevant experience and skills, with specific examples of achievements.'
      },
      {
        category: 'Problem Solving',
        question: 'Describe a challenging problem you solved in your previous role.',
        answer: 'Discuss a specific problem, your approach to solving it, and the positive outcome achieved.'
      },
      {
        category: 'Leadership',
        question: 'How do you lead teams through challenging projects?',
        answer: 'Explain your leadership style, how you motivate team members, and provide an example of a successful project.'
      },
      {
        category: 'Company Knowledge',
        question: `What do you know about ${params.companyName} and why do you want to work here?`,
        answer: 'Demonstrate your research on the company, its values, and how your goals align with the organization.'
      }
    ];
  }
  
  private generateMockTips(params: InterviewPrepGenerationParams): InterviewTip[] {
    return [
      {
        title: 'Research Thoroughly',
        description: `Learn everything you can about ${params.companyName}, its products, services, and recent news.`
      },
      {
        title: 'Prepare Examples',
        description: 'Have specific examples ready that demonstrate your skills and experience.'
      },
      {
        title: 'Ask Thoughtful Questions',
        description: 'Prepare questions that show your interest in the role and company.'
      }
    ];
  }
}

export const interviewPrepService = new InterviewPrepService();
