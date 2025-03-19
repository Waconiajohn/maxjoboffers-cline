/**
 * Resume AI Prompts
 * 
 * This file contains prompts used for AI-assisted resume rewriting and analysis.
 */

import { ResumeSection } from '../types';

/**
 * Base system prompt for resume-related AI tasks
 */
export const RESUME_SYSTEM_PROMPT = `
You are an expert resume writer and career coach with extensive experience in helping job seekers create effective resumes.
Your goal is to help the user improve their resume to increase their chances of getting interviews and job offers.
Provide specific, actionable advice that is tailored to the user's industry, experience level, and target job.
Focus on both content and formatting to create a resume that is both ATS-friendly and appealing to human recruiters.
`;

/**
 * Interface for resume analysis prompt parameters
 */
export interface ResumeAnalysisPromptParams {
  jobTitle: string;
  resumeContent: string;
  jobDescription?: string;
}

/**
 * Generate a resume analysis prompt
 */
export const generateResumeAnalysisPrompt = (params: ResumeAnalysisPromptParams): string => `
Please analyze the following resume for a ${params.jobTitle} position.

${params.resumeContent}

${params.jobDescription ? `The job description is as follows:\n${params.jobDescription}\n` : ''}

Provide a comprehensive analysis including:
1. Overall assessment of the resume's effectiveness
2. Strengths of the resume
3. Weaknesses or areas for improvement
4. ATS compatibility assessment
5. Keyword analysis (matched and missing keywords)
6. Specific suggestions for improvement for each section
7. Any formatting or structural issues

Focus on actionable feedback that will help the candidate improve their chances of getting interviews.
`;

/**
 * Interface for resume summary rewrite prompt parameters
 */
export interface ResumeSummaryRewritePromptParams {
  jobTitle: string;
  summaryContent: string;
  jobDescription?: string;
  focusKeywords?: string[];
  tone?: string;
  instructions?: string;
}

/**
 * Generate a resume summary rewrite prompt
 */
export const generateResumeSummaryRewritePrompt = (params: ResumeSummaryRewritePromptParams): string => `
Please rewrite the following resume summary for a ${params.jobTitle} position to make it more compelling and effective.

Original summary:
${params.summaryContent}

${params.jobDescription ? `The job description is as follows:\n${params.jobDescription}\n` : ''}

Guidelines:
- Keep it concise (3-5 sentences)
- Highlight key qualifications and achievements relevant to the target role
- Include relevant keywords for ATS optimization
- Use strong action verbs and quantify achievements where possible
- Avoid clichés and generic statements
- Tailor it specifically to the ${params.jobTitle} role
${params.focusKeywords ? `- Incorporate these keywords if relevant: ${params.focusKeywords.join(', ')}` : ''}
${params.tone ? `- Use a ${params.tone} tone` : ''}
${params.instructions ? `- Additional instructions: ${params.instructions}` : ''}

Provide the rewritten summary along with a brief explanation of the improvements made.
`;

/**
 * Interface for resume experience bullet rewrite prompt parameters
 */
export interface ResumeExperienceBulletRewritePromptParams {
  jobTitle: string;
  bulletContent: string;
  positionContext: string;
  jobDescription?: string;
  focusKeywords?: string[];
  tone?: string;
  instructions?: string;
}

/**
 * Generate a resume experience bullet rewrite prompt
 */
export const generateResumeExperienceBulletRewritePrompt = (params: ResumeExperienceBulletRewritePromptParams): string => `
Please rewrite the following resume bullet point for a ${params.jobTitle} position to make it more impactful and achievement-oriented.

Original bullet point:
${params.bulletContent}

Context (position and company):
${params.positionContext}

${params.jobDescription ? `The job description is as follows:\n${params.jobDescription}\n` : ''}

Guidelines:
- Start with a strong action verb
- Focus on achievements and results, not just responsibilities
- Quantify the impact where possible (numbers, percentages, etc.)
- Keep it concise (1-2 lines)
- Include relevant keywords for ATS optimization
- Demonstrate skills and qualities relevant to the target role
${params.focusKeywords ? `- Incorporate these keywords if relevant: ${params.focusKeywords.join(', ')}` : ''}
${params.tone ? `- Use a ${params.tone} tone` : ''}
${params.instructions ? `- Additional instructions: ${params.instructions}` : ''}

Provide the rewritten bullet point along with a brief explanation of the improvements made.
`;

/**
 * Interface for resume skills rewrite prompt parameters
 */
export interface ResumeSkillsRewritePromptParams {
  jobTitle: string;
  skillsContent: string;
  jobDescription?: string;
  focusKeywords?: string[];
  instructions?: string;
}

/**
 * Generate a resume skills rewrite prompt
 */
export const generateResumeSkillsRewritePrompt = (params: ResumeSkillsRewritePromptParams): string => `
Please optimize the following skills section for a ${params.jobTitle} position.

Original skills:
${params.skillsContent}

${params.jobDescription ? `The job description is as follows:\n${params.jobDescription}\n` : ''}

Guidelines:
- Prioritize skills most relevant to the target role
- Include a mix of technical/hard skills and soft skills
- Use industry-standard terminology
- Organize skills into logical categories if appropriate
- Include relevant keywords for ATS optimization
- Remove outdated or irrelevant skills
${params.focusKeywords ? `- Incorporate these keywords if relevant: ${params.focusKeywords.join(', ')}` : ''}
${params.instructions ? `- Additional instructions: ${params.instructions}` : ''}

Provide the optimized skills section along with a brief explanation of the improvements made.
`;

/**
 * Interface for ATS optimization prompt parameters
 */
export interface ATSOptimizationPromptParams {
  jobTitle: string;
  resumeContent: string;
  jobDescription?: string;
  focusKeywords?: string[];
  instructions?: string;
}

/**
 * Generate an ATS optimization prompt
 */
export const generateATSOptimizationPrompt = (params: ATSOptimizationPromptParams): string => `
Please optimize the following resume content to make it more ATS-friendly for a ${params.jobTitle} position.

${params.resumeContent}

${params.jobDescription ? `The job description is as follows:\n${params.jobDescription}\n` : ''}

Guidelines:
- Use standard section headings
- Include relevant keywords from the job description
- Use standard formatting (avoid tables, columns, headers/footers, images)
- Spell out acronyms at least once
- Use standard job titles where appropriate
- Focus on relevant skills and experiences
- Ensure proper spelling and grammar
${params.focusKeywords ? `- Incorporate these keywords if relevant: ${params.focusKeywords.join(', ')}` : ''}
${params.instructions ? `- Additional instructions: ${params.instructions}` : ''}

Provide the ATS-optimized content along with an explanation of the changes made.
`;

/**
 * Interface for job tailoring prompt parameters
 */
export interface JobTailoringPromptParams {
  jobTitle: string;
  companyName: string;
  resumeContent: string;
  jobDescription: string;
  focusKeywords?: string[];
  tone?: string;
  instructions?: string;
}

/**
 * Generate a job tailoring prompt
 */
export const generateJobTailoringPrompt = (params: JobTailoringPromptParams): string => `
Please tailor the following resume content for a ${params.jobTitle} position at ${params.companyName}.

${params.resumeContent}

Job description:
${params.jobDescription}

Guidelines:
- Highlight experiences and skills most relevant to this specific job
- Mirror language and keywords from the job description
- Prioritize achievements that demonstrate required qualifications
- Adjust the summary to speak directly to this role
- Customize skills section to match job requirements
- Maintain honesty and accuracy while emphasizing relevant experience
${params.focusKeywords ? `- Incorporate these keywords if relevant: ${params.focusKeywords.join(', ')}` : ''}
${params.tone ? `- Use a ${params.tone} tone` : ''}
${params.instructions ? `- Additional instructions: ${params.instructions}` : ''}

Provide the tailored resume content along with an explanation of the customizations made.
`;

/**
 * Interface for section rewrite prompt parameters
 */
export interface SectionRewritePromptParams {
  section: ResumeSection;
  sectionContent: string;
  jobTitle: string;
  jobDescription?: string;
  tone?: string;
  focusKeywords?: string[];
  instructions?: string;
}

/**
 * Get section-specific rewrite prompt
 */
export const getSectionRewritePrompt = (params: SectionRewritePromptParams): string => {
  switch (params.section) {
    case ResumeSection.Summary:
      return generateResumeSummaryRewritePrompt({
        jobTitle: params.jobTitle,
        summaryContent: params.sectionContent,
        jobDescription: params.jobDescription,
        focusKeywords: params.focusKeywords,
        tone: params.tone,
        instructions: params.instructions
      });
    
    case ResumeSection.Skills:
      return generateResumeSkillsRewritePrompt({
        jobTitle: params.jobTitle,
        skillsContent: params.sectionContent,
        jobDescription: params.jobDescription,
        focusKeywords: params.focusKeywords,
        instructions: params.instructions
      });
    
    // Add more cases for other sections as needed
    
    default:
      return `
Please rewrite the following ${params.section} section for a ${params.jobTitle} position to make it more effective and impactful.

Original content:
${params.sectionContent}

${params.jobDescription ? `The job description is as follows:\n${params.jobDescription}\n` : ''}

Guidelines:
- Focus on achievements and results where applicable
- Use strong action verbs
- Include relevant keywords for ATS optimization
- Be concise and impactful
- Highlight skills and experiences relevant to the target role
${params.focusKeywords ? `- Incorporate these keywords if relevant: ${params.focusKeywords.join(', ')}` : ''}
${params.tone ? `- Use a ${params.tone} tone` : ''}
${params.instructions ? `- Additional instructions: ${params.instructions}` : ''}

Provide the rewritten content along with a brief explanation of the improvements made.
`;
  }
};

/**
 * Interface for resume improvement suggestions prompt parameters
 */
export interface ResumeImprovementSuggestionsPromptParams {
  jobTitle: string;
  resumeContent: string;
  jobDescription?: string;
}

/**
 * Generate a resume improvement suggestions prompt
 */
export const generateResumeImprovementSuggestionsPrompt = (params: ResumeImprovementSuggestionsPromptParams): string => `
Based on the following resume for a ${params.jobTitle} position, please provide specific suggestions for improvement.

${params.resumeContent}

${params.jobDescription ? `The job description is as follows:\n${params.jobDescription}\n` : ''}

Please provide 5-7 specific, actionable suggestions that would make this resume more effective.
Focus on content, structure, formatting, and keyword optimization.
For each suggestion, explain why it would be beneficial and provide an example of how to implement it.
`;

/**
 * Interface for resume comparison prompt parameters
 */
export interface ResumeComparisonPromptParams {
  jobTitle: string;
  originalResumeContent: string;
  updatedResumeContent: string;
  jobDescription?: string;
}

/**
 * Generate a resume comparison prompt
 */
export const generateResumeComparisonPrompt = (params: ResumeComparisonPromptParams): string => `
Please compare the following two versions of a resume for a ${params.jobTitle} position.

Original version:
${params.originalResumeContent}

Updated version:
${params.updatedResumeContent}

${params.jobDescription ? `The job description is as follows:\n${params.jobDescription}\n` : ''}

Please analyze:
1. Key differences between the versions
2. Improvements in the updated version
3. Any strengths from the original version that may have been lost
4. Overall assessment of which version is more effective and why
5. Any additional suggestions for further improvement
`;

/**
 * Interface for resume generation prompt parameters
 */
export interface ResumeGenerationPromptParams {
  jobTitle: string;
  personalInfo: string;
  workExperience: string;
  education: string;
  skills: string;
  additionalInfo?: string;
  jobDescription?: string;
  focusKeywords?: string[];
  tone?: string;
  instructions?: string;
}

/**
 * Generate a resume generation prompt
 */
export const generateResumeGenerationPrompt = (params: ResumeGenerationPromptParams): string => `
Please help me create a professional resume for a ${params.jobTitle} position based on the following information:

Personal Information:
${params.personalInfo}

Work Experience:
${params.workExperience}

Education:
${params.education}

Skills:
${params.skills}

${params.additionalInfo ? `Additional Information:\n${params.additionalInfo}\n` : ''}

${params.jobDescription ? `The job description is as follows:\n${params.jobDescription}\n` : ''}

Guidelines:
- Create a clean, professional resume that is both ATS-friendly and appealing to recruiters
- Focus on achievements and results, not just responsibilities
- Quantify accomplishments where possible
- Include relevant keywords for the ${params.jobTitle} role
- Use strong action verbs
- Organize information in a logical, easy-to-scan format
- Include a compelling summary/objective statement
${params.focusKeywords ? `- Incorporate these keywords if relevant: ${params.focusKeywords.join(', ')}` : ''}
${params.tone ? `- Use a ${params.tone} tone` : ''}
${params.instructions ? `- Additional instructions: ${params.instructions}` : ''}

Please provide the complete resume content, formatted appropriately for each section.
`;
