/**
 * Job Feature Types
 * 
 * This file contains all types related to job search and job tracking functionality.
 */

// Job Search Types

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  postedDate: string;
  applicationUrl?: string;
  remote: boolean;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  source: JobSource;
  tags: string[];
  favorite: boolean;
  applied: boolean;
  notes?: string;
}

export enum JobType {
  FullTime = 'Full-time',
  PartTime = 'Part-time',
  Contract = 'Contract',
  Temporary = 'Temporary',
  Internship = 'Internship'
}

export enum ExperienceLevel {
  Entry = 'Entry-level',
  Mid = 'Mid-level',
  Senior = 'Senior-level',
  Executive = 'Executive'
}

export enum JobSource {
  LinkedIn = 'LinkedIn',
  Indeed = 'Indeed',
  GlassDoor = 'GlassDoor',
  Company = 'Company Website',
  Referral = 'Referral',
  Other = 'Other'
}

export interface JobSearchFilters {
  query: string;
  location: string;
  remote: boolean | null;
  jobType: JobType[] | null;
  experienceLevel: ExperienceLevel[] | null;
  salary: [number, number] | null;
  datePosted: number | null; // Days ago
  tags: string[] | null;
  favorite: boolean | null;
  applied: boolean | null;
}

export interface JobSearchResults {
  jobs: Job[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Job Tracking Types

export interface JobApplication {
  id: string;
  jobId: string;
  job: Job;
  status: ApplicationStatus;
  appliedDate: string;
  resumeId?: string;
  coverLetterId?: string;
  contacts: ContactPerson[];
  interviews: Interview[];
  followUps: FollowUp[];
  notes: string;
  tasks: ApplicationTask[];
  lastUpdated: string;
  favorite: boolean;
}

export enum ApplicationStatus {
  Saved = 'Saved',
  Applied = 'Applied',
  InProgress = 'In Progress',
  Interview = 'Interview',
  Offer = 'Offer',
  Rejected = 'Rejected',
  Accepted = 'Accepted',
  Withdrawn = 'Withdrawn'
}

export interface ContactPerson {
  id: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
  notes?: string;
  linkedInUrl?: string;
}

export interface Interview {
  id: string;
  type: InterviewType;
  date: string;
  duration: number; // minutes
  location?: string;
  virtual: boolean;
  meetingLink?: string;
  interviewers: ContactPerson[];
  notes: string;
  completed: boolean;
  feedback?: string;
  prepGuideId?: string; // Link to interview prep guide
}

export enum InterviewType {
  Phone = 'Phone Screen',
  Technical = 'Technical',
  Behavioral = 'Behavioral',
  Onsite = 'Onsite',
  Final = 'Final Round',
  Other = 'Other'
}

export interface FollowUp {
  id: string;
  date: string;
  type: FollowUpType;
  notes: string;
  completed: boolean;
}

export enum FollowUpType {
  ThankYou = 'Thank You Note',
  StatusInquiry = 'Status Inquiry',
  AdditionalInfo = 'Additional Information',
  Other = 'Other'
}

export interface ApplicationTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  priority: TaskPriority;
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

// Cover Letter Types

export interface CoverLetter {
  id: string;
  jobId?: string;
  title: string;
  content: string;
  createdAt: string;
  lastUpdated: string;
  version: number;
  template?: boolean;
}

export interface CoverLetterGenerationParams {
  jobTitle: string;
  company: string;
  jobDescription: string;
  resumeContent?: string;
  keySkills?: string[];
  customInstructions?: string;
}
