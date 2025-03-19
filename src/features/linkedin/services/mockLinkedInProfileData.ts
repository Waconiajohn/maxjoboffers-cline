/**
 * Mock LinkedIn Profile Data Service
 * 
 * This file provides mock data for the LinkedIn profile builder component.
 * In a real application, this would be replaced with actual API calls.
 */

import { v4 as uuidv4 } from 'uuid';

// Types
export interface LinkedInProfile {
  id: string;
  headline: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  accomplishments: Accomplishment[];
  recommendations: Recommendation[];
  profileStrength: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights: string[];
  skills: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  activities: string[];
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  endorsements: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Accomplishment {
  id: string;
  type: 'certification' | 'award' | 'publication' | 'patent' | 'project';
  title: string;
  issuer?: string;
  date: string;
  description: string;
  url?: string;
}

export interface Recommendation {
  id: string;
  author: {
    name: string;
    title: string;
    company: string;
    relationship: string;
  };
  content: string;
  date: string;
}

// Mock data
export const mockLinkedInProfile: LinkedInProfile = {
  id: uuidv4(),
  headline: "Senior Software Engineer with expertise in React, TypeScript, and Node.js",
  summary: "Results-driven software engineer with 7+ years of experience building scalable web applications. Specialized in React, TypeScript, and Node.js with a strong focus on performance optimization and clean code. Passionate about creating intuitive user experiences and solving complex technical challenges.",
  experience: [
    {
      id: uuidv4(),
      title: "Senior Software Engineer",
      company: "TechInnovate Solutions",
      location: "San Francisco, CA",
      startDate: "2022-03-15",
      current: true,
      description: "Lead developer for the company's flagship SaaS product, managing a team of 5 engineers and implementing best practices for code quality and performance.",
      highlights: [
        "Reduced page load time by 40% through code splitting and lazy loading",
        "Implemented CI/CD pipeline that decreased deployment time by 60%",
        "Mentored junior developers and conducted technical interviews"
      ],
      skills: ["React", "TypeScript", "Node.js", "AWS", "CI/CD"]
    },
    {
      id: uuidv4(),
      title: "Software Engineer",
      company: "DataViz Corp",
      location: "Seattle, WA",
      startDate: "2019-06-01",
      endDate: "2022-03-01",
      current: false,
      description: "Developed and maintained data visualization dashboards for enterprise clients, focusing on performance and accessibility.",
      highlights: [
        "Created reusable component library used across multiple projects",
        "Optimized database queries resulting in 50% faster data retrieval",
        "Implemented responsive design principles for mobile compatibility"
      ],
      skills: ["JavaScript", "D3.js", "React", "PostgreSQL", "REST APIs"]
    },
    {
      id: uuidv4(),
      title: "Junior Developer",
      company: "WebSolutions Inc",
      location: "Portland, OR",
      startDate: "2017-09-15",
      endDate: "2019-05-30",
      current: false,
      description: "Worked on front-end development for various client websites and applications.",
      highlights: [
        "Developed responsive websites for 15+ clients",
        "Collaborated with designers to implement pixel-perfect UIs",
        "Participated in agile development process"
      ],
      skills: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap"]
    }
  ],
  education: [
    {
      id: uuidv4(),
      school: "University of Washington",
      degree: "Master of Science",
      field: "Computer Science",
      startDate: "2015-09-01",
      endDate: "2017-06-15",
      activities: ["AI Research Group", "Hackathon Organizer", "Teaching Assistant for Algorithms course"],
      description: "Focused on machine learning and distributed systems. Thesis on optimizing neural networks for edge computing."
    },
    {
      id: uuidv4(),
      school: "Oregon State University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2011-09-01",
      endDate: "2015-06-15",
      activities: ["Programming Club President", "Undergraduate Research Assistant", "Peer Tutor"],
      description: "Graduated with honors. Completed internship at Microsoft during summer 2014."
    }
  ],
  skills: [
    {
      id: uuidv4(),
      name: "React",
      endorsements: 48,
      level: "Expert"
    },
    {
      id: uuidv4(),
      name: "TypeScript",
      endorsements: 42,
      level: "Expert"
    },
    {
      id: uuidv4(),
      name: "Node.js",
      endorsements: 37,
      level: "Advanced"
    },
    {
      id: uuidv4(),
      name: "JavaScript",
      endorsements: 53,
      level: "Expert"
    },
    {
      id: uuidv4(),
      name: "AWS",
      endorsements: 29,
      level: "Advanced"
    },
    {
      id: uuidv4(),
      name: "GraphQL",
      endorsements: 21,
      level: "Intermediate"
    },
    {
      id: uuidv4(),
      name: "Docker",
      endorsements: 18,
      level: "Intermediate"
    },
    {
      id: uuidv4(),
      name: "CI/CD",
      endorsements: 25,
      level: "Advanced"
    },
    {
      id: uuidv4(),
      name: "REST APIs",
      endorsements: 31,
      level: "Advanced"
    },
    {
      id: uuidv4(),
      name: "SQL",
      endorsements: 27,
      level: "Advanced"
    }
  ],
  accomplishments: [
    {
      id: uuidv4(),
      type: "certification",
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-02-15",
      description: "Professional level certification for designing distributed systems on AWS.",
      url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/"
    },
    {
      id: uuidv4(),
      type: "award",
      title: "Best Technical Innovation",
      issuer: "TechInnovate Solutions",
      date: "2022-12-10",
      description: "Awarded for developing an AI-powered recommendation engine that increased customer engagement by 35%.",
    },
    {
      id: uuidv4(),
      type: "publication",
      title: "Optimizing React Applications for Performance",
      issuer: "Medium",
      date: "2021-07-22",
      description: "Published article on advanced techniques for optimizing React applications, with over 50,000 views.",
      url: "https://medium.com/example/optimizing-react-applications"
    },
    {
      id: uuidv4(),
      type: "project",
      title: "Open Source Data Visualization Library",
      date: "2020-03-10",
      description: "Created and maintained a popular open-source library for data visualization with over 2,000 GitHub stars.",
      url: "https://github.com/example/data-viz-library"
    }
  ],
  recommendations: [
    {
      id: uuidv4(),
      author: {
        name: "Jennifer Lee",
        title: "CTO",
        company: "TechInnovate Solutions",
        relationship: "Manager"
      },
      content: "One of the most talented engineers I've had the pleasure to work with. Their technical skills are exceptional, but what truly sets them apart is their ability to communicate complex concepts clearly and mentor other team members. They've been instrumental in elevating our entire engineering organization.",
      date: "2023-05-10"
    },
    {
      id: uuidv4(),
      author: {
        name: "Michael Rodriguez",
        title: "Product Manager",
        company: "TechInnovate Solutions",
        relationship: "Colleague"
      },
      content: "An exceptional engineer who consistently delivers high-quality work. They have a unique ability to understand business requirements and translate them into technical solutions. Their contributions have been critical to the success of our product.",
      date: "2023-02-18"
    },
    {
      id: uuidv4(),
      author: {
        name: "Sarah Johnson",
        title: "Engineering Director",
        company: "DataViz Corp",
        relationship: "Former Manager"
      },
      content: "I had the pleasure of managing this person for nearly three years, and they consistently exceeded expectations. They're not only technically proficient but also a great team player who elevates everyone around them. Any company would be fortunate to have them on their team.",
      date: "2022-04-05"
    }
  ],
  profileStrength: 85
};

/**
 * Mock API function to simulate fetching a LinkedIn profile
 * @returns Promise that resolves to the mock LinkedIn profile
 */
export const fetchLinkedInProfile = (): Promise<LinkedInProfile> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockLinkedInProfile);
    }, 800);
  });
};

/**
 * Mock API function to simulate updating a LinkedIn profile
 * @param profile The updated LinkedIn profile
 * @returns Promise that resolves to the updated LinkedIn profile
 */
export const updateLinkedInProfile = (profile: LinkedInProfile): Promise<LinkedInProfile> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // In a real app, we would update this in the database
      // For this mock, we'll just return the updated profile
      resolve({
        ...profile,
        // Recalculate profile strength based on completeness
        profileStrength: calculateProfileStrength(profile)
      });
    }, 1000);
  });
};

/**
 * Calculate profile strength based on completeness
 * @param profile The LinkedIn profile
 * @returns A number between 0 and 100 representing profile strength
 */
const calculateProfileStrength = (profile: LinkedInProfile): number => {
  let score = 0;
  const total = 100;
  
  // Headline and summary (20%)
  if (profile.headline) score += 10;
  if (profile.summary) score += 10;
  
  // Experience (25%)
  const expScore = Math.min(25, profile.experience.length * 8);
  score += expScore;
  
  // Education (15%)
  const eduScore = Math.min(15, profile.education.length * 7.5);
  score += eduScore;
  
  // Skills (20%)
  const skillScore = Math.min(20, profile.skills.length * 2);
  score += skillScore;
  
  // Accomplishments (10%)
  const accompScore = Math.min(10, profile.accomplishments.length * 2.5);
  score += accompScore;
  
  // Recommendations (10%)
  const recScore = Math.min(10, profile.recommendations.length * 3.33);
  score += recScore;
  
  return Math.round(score);
};
