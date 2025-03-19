/**
 * Mock Resume Data Service
 * 
 * This file provides mock data for the resume manager component.
 * In a real application, this would be replaced with actual API calls.
 */

import { v4 as uuidv4 } from 'uuid';

// Types
export interface ResumeVersion {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'review' | 'complete';
}

export interface JobRequirement {
  id: string;
  skill: string;
  importance: 'required' | 'preferred';
  matched: boolean;
}

export interface ValidationError {
  id: string;
  section: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ResumeSection {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'summary';
  title: string;
  content: string;
  order: number;
}

// Mock data
const mockSections: ResumeSection[] = [
  {
    id: uuidv4(),
    type: 'summary',
    title: 'Professional Summary',
    content: 'Experienced software engineer with 5+ years of experience in full-stack development. Proficient in React, Node.js, and TypeScript. Strong problem-solving skills and a passion for creating clean, efficient code.',
    order: 0
  },
  {
    id: uuidv4(),
    type: 'experience',
    title: 'Work Experience',
    content: 'Senior Software Engineer | TechCorp | 2020-Present\n- Led development of a React-based dashboard that improved user engagement by 40%\n- Implemented CI/CD pipeline that reduced deployment time by 60%\n- Mentored junior developers and conducted code reviews\n\nSoftware Engineer | WebSolutions | 2018-2020\n- Developed RESTful APIs using Node.js and Express\n- Collaborated with UX designers to implement responsive UI components\n- Reduced application load time by 30% through code optimization',
    order: 1
  },
  {
    id: uuidv4(),
    type: 'education',
    title: 'Education',
    content: 'Bachelor of Science in Computer Science\nUniversity of Technology\n2014-2018',
    order: 2
  },
  {
    id: uuidv4(),
    type: 'skills',
    title: 'Skills',
    content: 'Programming Languages: JavaScript, TypeScript, Python, Java\nFrontend: React, Redux, HTML5, CSS3, Material-UI\nBackend: Node.js, Express, MongoDB, PostgreSQL\nTools: Git, Docker, AWS, Jest, Webpack',
    order: 3
  }
];

export const mockResumeVersions: ResumeVersion[] = [
  {
    id: uuidv4(),
    title: 'Software Engineer Resume',
    content: JSON.stringify(mockSections),
    createdAt: '2025-02-15T10:30:00Z',
    updatedAt: '2025-03-10T14:45:00Z',
    status: 'complete'
  },
  {
    id: uuidv4(),
    title: 'Frontend Developer Resume',
    content: JSON.stringify(mockSections.map(section => 
      section.type === 'skills' 
        ? { 
            ...section, 
            content: 'Programming Languages: JavaScript, TypeScript\nFrontend: React, Redux, HTML5, CSS3, Material-UI, Tailwind CSS\nTools: Git, Jest, Webpack, Vite, Storybook' 
          } 
        : section
    )),
    createdAt: '2025-02-20T09:15:00Z',
    updatedAt: '2025-03-05T11:30:00Z',
    status: 'review'
  },
  {
    id: uuidv4(),
    title: 'Full Stack Developer Resume',
    content: JSON.stringify(mockSections),
    createdAt: '2025-03-01T16:45:00Z',
    updatedAt: '2025-03-01T16:45:00Z',
    status: 'draft'
  }
];

export const mockJobRequirements: JobRequirement[] = [
  { id: uuidv4(), skill: 'React', importance: 'required', matched: true },
  { id: uuidv4(), skill: 'TypeScript', importance: 'required', matched: true },
  { id: uuidv4(), skill: 'Node.js', importance: 'required', matched: true },
  { id: uuidv4(), skill: 'GraphQL', importance: 'preferred', matched: false },
  { id: uuidv4(), skill: 'AWS', importance: 'preferred', matched: true },
  { id: uuidv4(), skill: 'Docker', importance: 'preferred', matched: true },
  { id: uuidv4(), skill: 'CI/CD', importance: 'preferred', matched: true },
  { id: uuidv4(), skill: 'MongoDB', importance: 'required', matched: true },
  { id: uuidv4(), skill: 'Redux', importance: 'required', matched: true },
  { id: uuidv4(), skill: 'Jest', importance: 'preferred', matched: true }
];

/**
 * Mock API function to simulate fetching resume versions
 * @returns Promise that resolves to the mock resume versions
 */
export const fetchResumeVersions = (): Promise<ResumeVersion[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockResumeVersions);
    }, 800);
  });
};

/**
 * Mock API function to simulate fetching job requirements
 * @returns Promise that resolves to the mock job requirements
 */
export const fetchJobRequirements = (): Promise<JobRequirement[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockJobRequirements);
    }, 600);
  });
};

/**
 * Mock API function to simulate creating a new resume version
 * @param title The title of the new resume version
 * @returns Promise that resolves to the newly created resume version
 */
export const createResumeVersion = (title: string): Promise<ResumeVersion> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const newVersion: ResumeVersion = {
        id: uuidv4(),
        title,
        content: JSON.stringify(mockSections),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      };
      
      // In a real app, we would add this to the database
      // For this mock, we'll just return the new version
      resolve(newVersion);
    }, 1000);
  });
};

/**
 * Mock API function to simulate updating a resume version
 * @param version The updated resume version
 * @returns Promise that resolves to the updated resume version
 */
export const updateResumeVersion = (version: ResumeVersion): Promise<ResumeVersion> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const updatedVersion: ResumeVersion = {
        ...version,
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, we would update this in the database
      // For this mock, we'll just return the updated version
      resolve(updatedVersion);
    }, 1000);
  });
};

/**
 * Mock API function to simulate deleting a resume version
 * @param id The ID of the resume version to delete
 * @returns Promise that resolves to a success message
 */
export const deleteResumeVersion = (id: string): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // In a real app, we would delete this from the database
      // For this mock, we'll just return success
      resolve({ success: true });
    }, 800);
  });
};
