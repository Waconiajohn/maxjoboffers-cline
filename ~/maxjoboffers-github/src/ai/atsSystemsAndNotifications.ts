/**
 * ATS Systems and Notifications
 * 
 * This file contains information about different Applicant Tracking Systems (ATS)
 * and notification messages for the resume review process.
 */

/**
 * ATS System Interface
 * This interface defines the structure of an ATS system.
 */
export interface ATSSystem {
  id: string;
  name: string;
  company: string;
  description: string;
  popularity: number; // 1-100
  keyFeatures: string[];
  specialConsiderations?: string[];
  website?: string;
  logoUrl?: string;
}

/**
 * ATS Systems
 * This array contains information about different ATS systems.
 */
export const atsSystems: ATSSystem[] = [
  {
    id: 'taleo',
    name: 'Taleo',
    company: 'Oracle',
    description: 'One of the most widely used ATS systems, particularly by large enterprises.',
    popularity: 95,
    keyFeatures: [
      'Keyword matching',
      'Skills-based filtering',
      'Education verification',
      'Experience level filtering'
    ],
    specialConsiderations: [
      'Struggles with complex formatting',
      'Prefers chronological format',
      'May ignore information in headers/footers'
    ],
    website: 'https://www.oracle.com/human-capital-management/recruiting/'
  },
  {
    id: 'workday',
    name: 'Workday Recruiting',
    company: 'Workday',
    description: 'Enterprise-level ATS with strong integration with other HR systems.',
    popularity: 90,
    keyFeatures: [
      'Machine learning matching',
      'Skills and competency analysis',
      'Behavioral assessment integration',
      'Mobile application support'
    ],
    specialConsiderations: [
      'Prefers standard section headings',
      'Better with PDF format',
      'Handles tables well'
    ],
    website: 'https://www.workday.com/en-us/products/human-capital-management/recruiting.html'
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    company: 'Greenhouse Software',
    description: 'Popular among tech companies and startups, known for its user-friendly interface.',
    popularity: 85,
    keyFeatures: [
      'Structured hiring process',
      'Customizable scorecards',
      'Diversity and inclusion features',
      'API integrations'
    ],
    specialConsiderations: [
      'Good at parsing modern resume formats',
      'Handles links well',
      'Supports skill tagging'
    ],
    website: 'https://www.greenhouse.io/'
  },
  {
    id: 'lever',
    name: 'Lever',
    company: 'Lever',
    description: 'Modern ATS focused on collaboration and candidate experience.',
    popularity: 80,
    keyFeatures: [
      'Candidate relationship management',
      'Team collaboration tools',
      'Interview scheduling',
      'Diversity and inclusion analytics'
    ],
    specialConsiderations: [
      'Good with social media links',
      'Supports portfolio links',
      'Handles creative formats better than most'
    ],
    website: 'https://www.lever.co/'
  },
  {
    id: 'jobvite',
    name: 'Jobvite',
    company: 'Jobvite',
    description: 'Comprehensive recruiting platform with social recruiting features.',
    popularity: 75,
    keyFeatures: [
      'Social recruiting',
      'Employee referrals',
      'Mobile application',
      'Analytics and reporting'
    ],
    specialConsiderations: [
      'Prefers clean, simple formatting',
      'Good keyword matching',
      'Handles PDF and Word formats well'
    ],
    website: 'https://www.jobvite.com/'
  },
  {
    id: 'icims',
    name: 'iCIMS',
    company: 'iCIMS',
    description: 'Specialized talent acquisition software used by mid to large companies.',
    popularity: 70,
    keyFeatures: [
      'Candidate relationship management',
      'Social recruiting',
      'Mobile recruiting',
      'Advanced analytics'
    ],
    specialConsiderations: [
      'Prefers standard chronological format',
      'Good with keywords and skills matching',
      'May struggle with creative layouts'
    ],
    website: 'https://www.icims.com/'
  },
  {
    id: 'smartrecruiters',
    name: 'SmartRecruiters',
    company: 'SmartRecruiters',
    description: 'Enterprise talent acquisition suite with a focus on user experience.',
    popularity: 65,
    keyFeatures: [
      'Collaborative hiring',
      'Mobile recruiting',
      'AI-powered matching',
      'Marketplace integrations'
    ],
    specialConsiderations: [
      'Good parsing of various formats',
      'Handles links well',
      'Supports modern resume designs'
    ],
    website: 'https://www.smartrecruiters.com/'
  },
  {
    id: 'brassring',
    name: 'Kenexa BrassRing',
    company: 'IBM',
    description: 'Enterprise-level ATS with robust compliance features.',
    popularity: 60,
    keyFeatures: [
      'Compliance management',
      'Global capabilities',
      'Behavioral assessments',
      'Reporting and analytics'
    ],
    specialConsiderations: [
      'Prefers traditional formats',
      'May struggle with graphics',
      'Better with Word documents than PDFs'
    ],
    website: 'https://www.ibm.com/talent-management/kenexa/brassring'
  },
  {
    id: 'successfactors',
    name: 'SuccessFactors Recruiting',
    company: 'SAP',
    description: 'Part of SAP\'s HCM suite, used by many large enterprises.',
    popularity: 85,
    keyFeatures: [
      'Integration with SAP systems',
      'Candidate relationship management',
      'Career site builder',
      'Analytics and reporting'
    ],
    specialConsiderations: [
      'Prefers standard formatting',
      'Good keyword matching',
      'Handles tables and bullets well'
    ],
    website: 'https://www.sap.com/products/human-resources-hcm/recruiting-onboarding.html'
  },
  {
    id: 'applytrak',
    name: 'ApplyTrak',
    company: 'ApplyTrak',
    description: 'Specialized ATS for small to medium businesses.',
    popularity: 40,
    keyFeatures: [
      'Simple interface',
      'Customizable application forms',
      'Email notifications',
      'Basic reporting'
    ],
    specialConsiderations: [
      'Limited parsing capabilities',
      'Prefers simple formats',
      'May struggle with complex layouts'
    ]
  },
  {
    id: 'recruitee',
    name: 'Recruitee',
    company: 'Recruitee',
    description: 'Collaborative hiring platform popular with growing companies.',
    popularity: 55,
    keyFeatures: [
      'Collaborative hiring',
      'Careers page builder',
      'Chrome extension',
      'Analytics'
    ],
    specialConsiderations: [
      'Good with modern formats',
      'Handles links well',
      'Supports social media profiles'
    ],
    website: 'https://recruitee.com/'
  },
  {
    id: 'zohorecruit',
    name: 'Zoho Recruit',
    company: 'Zoho',
    description: 'Part of the Zoho suite, popular with small to medium businesses.',
    popularity: 50,
    keyFeatures: [
      'Integration with Zoho suite',
      'Customizable workflows',
      'Social recruiting',
      'Analytics'
    ],
    specialConsiderations: [
      'Prefers standard formats',
      'Good with keywords',
      'May struggle with creative layouts'
    ],
    website: 'https://www.zoho.com/recruit/'
  }
];

/**
 * Get ATS Systems by Popularity
 * This function returns ATS systems sorted by popularity.
 * 
 * @param limit The maximum number of systems to return
 * @returns The ATS systems sorted by popularity
 */
export const getATSSystemsByPopularity = (limit?: number): ATSSystem[] => {
  const sorted = [...atsSystems].sort((a, b) => b.popularity - a.popularity);
  return limit ? sorted.slice(0, limit) : sorted;
};

/**
 * Get ATS System by ID
 * This function returns an ATS system by its ID.
 * 
 * @param id The ID of the ATS system
 * @returns The ATS system
 */
export const getATSSystemById = (id: string): ATSSystem | undefined => {
  return atsSystems.find(system => system.id === id);
};

/**
 * Get ATS Systems for Job Description
 * This function analyzes a job description and returns the ATS systems
 * that are likely to be used by the company.
 * 
 * @param jobDescription The job description
 * @returns The ATS systems likely to be used
 */
export const getATSSystemsForJobDescription = (jobDescription: string): ATSSystem[] => {
  const jobDescLower = jobDescription.toLowerCase();
  const results: { system: ATSSystem; score: number }[] = [];
  
  // Check for company mentions
  for (const system of atsSystems) {
    let score = 0;
    
    // Check if the company name is mentioned
    if (jobDescLower.includes(system.company.toLowerCase())) {
      score += 50;
    }
    
    // Check if the ATS name is mentioned
    if (jobDescLower.includes(system.name.toLowerCase())) {
      score += 100;
    }
    
    // Add base score based on popularity
    score += system.popularity * 0.5;
    
    // Add to results if score is above threshold
    if (score > 25) {
      results.push({ system, score });
    }
  }
  
  // If no specific systems were identified, return top systems by popularity
  if (results.length === 0) {
    return getATSSystemsByPopularity(5);
  }
  
  // Sort by score and return systems
  return results
    .sort((a, b) => b.score - a.score)
    .map(result => result.system);
};

/**
 * Notification Message Interface
 * This interface defines the structure of a notification message.
 */
export interface NotificationMessage {
  id: string;
  stage: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number; // in milliseconds
}

/**
 * Notification Messages
 * This object contains notification messages for different stages of the resume review process.
 */
export const notificationMessages: { [key: string]: NotificationMessage } = {
  // Initial Analysis Stage
  initialAnalysisStarted: {
    id: 'initial-analysis-started',
    stage: 'initial-analysis',
    title: 'Initial Analysis Started',
    message: 'Analyzing your resume format, content, achievements, and keywords...',
    type: 'info',
    duration: 3000
  },
  initialAnalysisCompleted: {
    id: 'initial-analysis-completed',
    stage: 'initial-analysis',
    title: 'Initial Analysis Completed',
    message: 'Initial analysis of your resume is complete. Moving to technical optimization...',
    type: 'success',
    duration: 3000
  },
  
  // Technical Optimization Stage
  technicalOptimizationStarted: {
    id: 'technical-optimization-started',
    stage: 'technical-optimization',
    title: 'Technical Optimization Started',
    message: 'Optimizing technical aspects of your resume for your industry...',
    type: 'info',
    duration: 3000
  },
  technicalOptimizationCompleted: {
    id: 'technical-optimization-completed',
    stage: 'technical-optimization',
    title: 'Technical Optimization Completed',
    message: 'Technical optimization is complete. Moving to ATS optimization...',
    type: 'success',
    duration: 3000
  },
  
  // ATS Optimization Stage
  atsOptimizationStarted: {
    id: 'ats-optimization-started',
    stage: 'ats-optimization',
    title: 'ATS Optimization Started',
    message: 'Optimizing your resume for Applicant Tracking Systems...',
    type: 'info',
    duration: 3000
  },
  atsOptimizationCompleted: {
    id: 'ats-optimization-completed',
    stage: 'ats-optimization',
    title: 'ATS Optimization Completed',
    message: 'ATS optimization is complete. Moving to executive impact enhancement...',
    type: 'success',
    duration: 3000
  },
  
  // Executive Impact Stage
  executiveImpactStarted: {
    id: 'executive-impact-started',
    stage: 'executive-impact',
    title: 'Executive Impact Enhancement Started',
    message: 'Enhancing the executive impact of your resume...',
    type: 'info',
    duration: 3000
  },
  executiveImpactCompleted: {
    id: 'executive-impact-completed',
    stage: 'executive-impact',
    title: 'Executive Impact Enhancement Completed',
    message: 'Executive impact enhancement is complete. Moving to final integration...',
    type: 'success',
    duration: 3000
  },
  
  // Final Integration Stage
  finalIntegrationStarted: {
    id: 'final-integration-started',
    stage: 'final-integration',
    title: 'Final Integration Started',
    message: 'Integrating all optimizations into your final resume...',
    type: 'info',
    duration: 3000
  },
  finalIntegrationCompleted: {
    id: 'final-integration-completed',
    stage: 'final-integration',
    title: 'Final Integration Completed',
    message: 'Your resume has been fully optimized and is ready for review!',
    type: 'success',
    duration: 5000
  },
  
  // Version Control
  versionCreated: {
    id: 'version-created',
    stage: 'version-control',
    title: 'New Version Created',
    message: 'A new version of your resume has been created.',
    type: 'info',
    duration: 3000
  },
  
  // Format Selection
  formatChanged: {
    id: 'format-changed',
    stage: 'format-selection',
    title: 'Resume Format Changed',
    message: 'Your resume format has been updated.',
    type: 'info',
    duration: 3000
  },
  
  // Error Messages
  apiError: {
    id: 'api-error',
    stage: 'error',
    title: 'API Error',
    message: 'There was an error communicating with the AI service. Please try again.',
    type: 'error',
    duration: 5000
  },
  parsingError: {
    id: 'parsing-error',
    stage: 'error',
    title: 'Parsing Error',
    message: 'There was an error parsing your resume. Please check the format and try again.',
    type: 'error',
    duration: 5000
  }
};

/**
 * Get Notification Message
 * This function returns a notification message by its ID.
 * 
 * @param id The ID of the notification message
 * @returns The notification message
 */
export const getNotificationMessage = (id: string): NotificationMessage => {
  return notificationMessages[id] || {
    id: 'unknown',
    stage: 'unknown',
    title: 'Unknown Notification',
    message: 'An unknown notification occurred.',
    type: 'info',
    duration: 3000
  };
};

/**
 * Get Stage Notifications
 * This function returns notification messages for a specific stage.
 * 
 * @param stage The stage to get notifications for
 * @returns The notification messages for the stage
 */
export const getStageNotifications = (stage: string): NotificationMessage[] => {
  return Object.values(notificationMessages).filter(
    notification => notification.stage === stage
  );
};
