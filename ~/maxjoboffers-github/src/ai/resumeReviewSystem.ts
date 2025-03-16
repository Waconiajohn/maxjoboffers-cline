/**
 * Resume Review System
 * 
 * This file implements a multi-stage review process for resumes using AI.
 * The system analyzes resumes, provides feedback, and generates optimized versions.
 */

import OpenAI from 'openai';
import {
  initialResumeAnalysisPrompt,
  getTechnicalOptimizationPrompt,
  atsOptimizationPrompt,
  executiveImpactEnhancementPrompt,
  finalIntegrationPrompt
} from './resumePrompts';

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Resume Analysis Result Interface
 * This interface defines the structure of the initial resume analysis result.
 */
export interface ResumeAnalysisResult {
  score: number;
  format_issues: string[];
  content_gaps: string[];
  achievement_opportunities: string[];
  keyword_recommendations: string[];
  priority_improvements: string[];
}

/**
 * Technical Optimization Result Interface
 * This interface defines the structure of the technical optimization result.
 */
export interface TechnicalOptimizationResult {
  technical_score: number;
  accuracy_issues: string[];
  industry_alignment_gaps: string[];
  impact_enhancement_suggestions: string[];
  modernization_recommendations: string[];
}

/**
 * ATS Optimization Result Interface
 * This interface defines the structure of the ATS optimization result.
 */
export interface ATSOptimizationResult {
  ats_score: number;
  format_fixes: string[];
  keyword_optimizations: string[];
  structure_improvements: string[];
  parsing_enhancements: string[];
}

/**
 * Executive Impact Enhancement Result Interface
 * This interface defines the structure of the executive impact enhancement result.
 */
export interface ExecutiveImpactResult {
  executive_score: number;
  leadership_enhancements: string[];
  impact_amplifications: string[];
  presence_improvements: string[];
  positioning_recommendations: string[];
}

/**
 * Final Integration Result Interface
 * This interface defines the structure of the final integration result.
 */
export interface FinalIntegrationResult {
  final_score: number;
  integrated_improvements: string[];
  impact_enhancements: string[];
  readability_optimizations: string[];
  final_recommendations: string[];
}

/**
 * Resume Review Stage
 * This enum defines the different stages of the resume review process.
 */
export enum ResumeReviewStage {
  INITIAL_ANALYSIS = 'initial_analysis',
  TECHNICAL_OPTIMIZATION = 'technical_optimization',
  ATS_OPTIMIZATION = 'ats_optimization',
  EXECUTIVE_IMPACT = 'executive_impact',
  FINAL_INTEGRATION = 'final_integration'
}

/**
 * Resume Review Result
 * This interface defines the structure of the complete resume review result.
 */
export interface ResumeReviewResult {
  initialAnalysis?: ResumeAnalysisResult;
  technicalOptimization?: TechnicalOptimizationResult;
  atsOptimization?: ATSOptimizationResult;
  executiveImpact?: ExecutiveImpactResult;
  finalIntegration?: FinalIntegrationResult;
  optimizedResume?: string;
  currentStage: ResumeReviewStage;
  overallScore?: number;
}

/**
 * Resume Review System
 * This class implements the multi-stage resume review process.
 */
export class ResumeReviewSystem {
  private resumeContent: string;
  private jobDescription: string;
  private industry: string;
  private result: ResumeReviewResult;

  /**
   * Constructor
   * 
   * @param resumeContent The content of the resume to review
   * @param jobDescription The job description to compare against
   * @param industry The industry of the job
   */
  constructor(resumeContent: string, jobDescription: string, industry: string) {
    this.resumeContent = resumeContent;
    this.jobDescription = jobDescription;
    this.industry = industry;
    this.result = {
      currentStage: ResumeReviewStage.INITIAL_ANALYSIS
    };
  }

  /**
   * Run Initial Analysis
   * This method runs the initial analysis stage of the resume review process.
   * 
   * @returns The result of the initial analysis
   */
  public async runInitialAnalysis(): Promise<ResumeAnalysisResult> {
    try {
      const prompt = `
${initialResumeAnalysisPrompt}

Resume:
${this.resumeContent}

Job Description:
${this.jobDescription}
`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert resume analyzer.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      const result = JSON.parse(jsonMatch[0]) as ResumeAnalysisResult;
      this.result.initialAnalysis = result;
      this.result.currentStage = ResumeReviewStage.TECHNICAL_OPTIMIZATION;
      
      return result;
    } catch (error) {
      console.error('Error in initial analysis:', error);
      throw error;
    }
  }

  /**
   * Run Technical Optimization
   * This method runs the technical optimization stage of the resume review process.
   * 
   * @returns The result of the technical optimization
   */
  public async runTechnicalOptimization(): Promise<TechnicalOptimizationResult> {
    if (!this.result.initialAnalysis) {
      throw new Error('Initial analysis must be run before technical optimization');
    }

    try {
      const prompt = `
${getTechnicalOptimizationPrompt(this.industry)}

Resume:
${this.resumeContent}

Job Description:
${this.jobDescription}

Initial Analysis:
${JSON.stringify(this.result.initialAnalysis, null, 2)}
`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: `You are an expert in the ${this.industry} industry.` },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      const result = JSON.parse(jsonMatch[0]) as TechnicalOptimizationResult;
      this.result.technicalOptimization = result;
      this.result.currentStage = ResumeReviewStage.ATS_OPTIMIZATION;
      
      return result;
    } catch (error) {
      console.error('Error in technical optimization:', error);
      throw error;
    }
  }

  /**
   * Run ATS Optimization
   * This method runs the ATS optimization stage of the resume review process.
   * 
   * @returns The result of the ATS optimization
   */
  public async runATSOptimization(): Promise<ATSOptimizationResult> {
    if (!this.result.technicalOptimization) {
      throw new Error('Technical optimization must be run before ATS optimization');
    }

    try {
      const prompt = `
${atsOptimizationPrompt}

Resume:
${this.resumeContent}

Job Description:
${this.jobDescription}

Technical Optimization:
${JSON.stringify(this.result.technicalOptimization, null, 2)}
`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert in ATS optimization.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      const result = JSON.parse(jsonMatch[0]) as ATSOptimizationResult;
      this.result.atsOptimization = result;
      this.result.currentStage = ResumeReviewStage.EXECUTIVE_IMPACT;
      
      return result;
    } catch (error) {
      console.error('Error in ATS optimization:', error);
      throw error;
    }
  }

  /**
   * Run Executive Impact Enhancement
   * This method runs the executive impact enhancement stage of the resume review process.
   * 
   * @returns The result of the executive impact enhancement
   */
  public async runExecutiveImpactEnhancement(): Promise<ExecutiveImpactResult> {
    if (!this.result.atsOptimization) {
      throw new Error('ATS optimization must be run before executive impact enhancement');
    }

    try {
      const prompt = `
${executiveImpactEnhancementPrompt}

Resume:
${this.resumeContent}

Job Description:
${this.jobDescription}

ATS Optimization:
${JSON.stringify(this.result.atsOptimization, null, 2)}
`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert in executive resume writing.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }

      const result = JSON.parse(jsonMatch[0]) as ExecutiveImpactResult;
      this.result.executiveImpact = result;
      this.result.currentStage = ResumeReviewStage.FINAL_INTEGRATION;
      
      return result;
    } catch (error) {
      console.error('Error in executive impact enhancement:', error);
      throw error;
    }
  }

  /**
   * Run Final Integration
   * This method runs the final integration stage of the resume review process.
   * 
   * @returns The result of the final integration
   */
  public async runFinalIntegration(): Promise<FinalIntegrationResult> {
    if (!this.result.executiveImpact) {
      throw new Error('Executive impact enhancement must be run before final integration');
    }

    try {
      const prompt = `
${finalIntegrationPrompt}

Original Resume:
${this.resumeContent}

Job Description:
${this.jobDescription}

Initial Analysis:
${JSON.stringify(this.result.initialAnalysis, null, 2)}

Technical Optimization:
${JSON.stringify(this.result.technicalOptimization, null, 2)}

ATS Optimization:
${JSON.stringify(this.result.atsOptimization, null, 2)}

Executive Impact Enhancement:
${JSON.stringify(this.result.executiveImpact, null, 2)}

Please provide the final integration result and the optimized resume.
`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert resume integration specialist.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || '';
      
      // Extract the JSON result
      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from OpenAI');
      }
      
      const result = JSON.parse(jsonMatch[0]) as FinalIntegrationResult;
      this.result.finalIntegration = result;
      
      // Extract the optimized resume
      const resumeMatch = content.match(/Optimized Resume:\s*([\s\S]*?)(?=\n\n|$)/);
      if (resumeMatch && resumeMatch[1]) {
        this.result.optimizedResume = resumeMatch[1].trim();
      } else {
        // If no specific "Optimized Resume:" section, use the rest of the content after the JSON
        const remainingContent = content.replace(jsonMatch[0], '').trim();
        if (remainingContent) {
          this.result.optimizedResume = remainingContent;
        }
      }
      
      // Calculate overall score
      this.result.overallScore = this.calculateOverallScore();
      
      return result;
    } catch (error) {
      console.error('Error in final integration:', error);
      throw error;
    }
  }

  /**
   * Run Complete Review
   * This method runs all stages of the resume review process in sequence.
   * 
   * @returns The complete resume review result
   */
  public async runCompleteReview(): Promise<ResumeReviewResult> {
    await this.runInitialAnalysis();
    await this.runTechnicalOptimization();
    await this.runATSOptimization();
    await this.runExecutiveImpactEnhancement();
    await this.runFinalIntegration();
    
    return this.result;
  }

  /**
   * Get Current Result
   * This method returns the current state of the resume review result.
   * 
   * @returns The current resume review result
   */
  public getCurrentResult(): ResumeReviewResult {
    return this.result;
  }

  /**
   * Calculate Overall Score
   * This method calculates the overall score based on the scores from each stage.
   * 
   * @returns The overall score
   */
  private calculateOverallScore(): number {
    const scores = [
      this.result.initialAnalysis?.score,
      this.result.technicalOptimization?.technical_score,
      this.result.atsOptimization?.ats_score,
      this.result.executiveImpact?.executive_score,
      this.result.finalIntegration?.final_score
    ].filter(score => score !== undefined) as number[];
    
    if (scores.length === 0) {
      return 0;
    }
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
}
