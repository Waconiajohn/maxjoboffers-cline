/**
 * This file contains prompts for the AI to generate interview preparation content
 */

/**
 * Prompt for generating behavioral interview questions based on job description
 */
export const behavioralQuestionsPrompt = `
You are an expert interview coach specializing in behavioral interviews. 
Based on the following job description, generate {count} behavioral interview questions that are likely to be asked in an interview for this position.
For each question, provide:
1. The question itself
2. The skill or quality being assessed
3. A suggested approach to answering (STAR method recommended)
4. An example of a strong answer

Job Description:
{jobDescription}

Focus Areas (if applicable):
{focusAreas}
`;

/**
 * Prompt for generating technical interview questions based on job description
 */
export const technicalQuestionsPrompt = `
You are an expert technical interviewer with deep knowledge across multiple technical domains.
Based on the following job description, generate {count} technical interview questions that are likely to be asked in an interview for this position.
The questions should be at {difficultyLevel} difficulty level.
For each question, provide:
1. The question itself
2. The technical concept being assessed
3. A detailed answer that demonstrates understanding
4. Follow-up questions an interviewer might ask

Job Description:
{jobDescription}

Technical Skills to Focus On (if applicable):
{focusAreas}
`;

/**
 * Prompt for generating case study interview questions
 */
export const caseStudyPrompt = `
You are an expert case study interviewer with experience in management consulting and business strategy.
Based on the following job description, generate a detailed case study interview scenario that would be appropriate for this position.
The case study should be at {difficultyLevel} difficulty level.

Include:
1. The case study scenario
2. Key information and data the candidate would receive
3. Questions the interviewer would ask throughout the case
4. The ideal approach to solving the case
5. Common pitfalls candidates should avoid
6. A framework for structuring the analysis

Job Description:
{jobDescription}

Company Industry:
{company}

Focus Areas (if applicable):
{focusAreas}
`;

/**
 * Prompt for generating situational interview questions
 */
export const situationalQuestionsPrompt = `
You are an expert interview coach specializing in situational interviews.
Based on the following job description, generate {count} situational interview questions that present hypothetical scenarios a candidate might face in this role.
For each question, provide:
1. The situational question
2. The skills or qualities being assessed
3. What a strong answer would demonstrate
4. An example of an effective response

Job Description:
{jobDescription}

Focus Areas (if applicable):
{focusAreas}
`;

/**
 * Prompt for generating company research information
 */
export const companyResearchPrompt = `
You are an expert business analyst with deep knowledge of industries, companies, and market trends.
Provide comprehensive research about the following company that would be valuable for a job candidate preparing for an interview.

Include:
1. Company overview and history
2. Mission, vision, and values
3. Products/services and market position
4. Recent news, developments, or initiatives (within the last year)
5. Company culture and work environment
6. Key competitors and how this company differentiates itself
7. Leadership team background
8. Financial health and growth trajectory (if publicly available)
9. Potential interview questions specific to this company

Company Name:
{companyName}

Industry:
{industry}

Position Applied For:
{jobTitle}
`;

/**
 * Prompt for generating interview feedback
 */
export const interviewFeedbackPrompt = `
You are an expert interview coach providing constructive feedback.
Based on the following interview session details, provide comprehensive feedback to help the candidate improve.

Include:
1. Overall assessment of performance
2. Specific strengths demonstrated
3. Areas for improvement
4. Analysis of communication style and clarity
5. Quality of examples/answers provided
6. Suggestions for better responses to specific questions
7. Next steps and preparation advice for future interviews

Interview Type: {interviewType}
Position: {jobTitle}
Company: {company}

Questions and Answers:
{questionsAndAnswers}

Additional Notes:
{notes}
`;

/**
 * Prompt for generating interview preparation tips
 */
export const interviewPreparationTipsPrompt = `
You are an expert interview coach helping a candidate prepare for an upcoming interview.
Based on the following job description and interview type, provide comprehensive preparation tips and strategies.

Include:
1. How to research the company effectively
2. Key topics to prepare for based on the job description
3. Common mistakes to avoid for this type of interview
4. How to structure answers effectively
5. Questions the candidate should ask the interviewer
6. Tips for making a strong impression (verbal and non-verbal)
7. How to follow up after the interview

Job Title: {jobTitle}
Company: {company}
Interview Type: {interviewType}
Difficulty Level: {difficultyLevel}

Job Description:
{jobDescription}

Candidate Background (if provided):
{candidateBackground}
`;

/**
 * Prompt for generating mock interview questions based on resume and job description
 */
export const mockInterviewPrompt = `
You are an expert interviewer conducting a mock interview.
Based on the candidate's resume and the job description, generate a realistic mock interview scenario.

Include:
1. Introduction and ice-breaker questions
2. {count} questions specific to the candidate's background and experience
3. {count} questions specific to the job requirements
4. {count} questions about handling challenges relevant to the role
5. Closing questions about career goals and interest in the position

For each question, provide:
- The question itself
- What the interviewer is looking to assess
- Guidance on what constitutes a strong answer

Resume:
{resumeContent}

Job Description:
{jobDescription}

Interview Type: {interviewType}
Position: {jobTitle}
Company: {company}
`;
