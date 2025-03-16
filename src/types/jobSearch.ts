/**
 * Interface for a job listing
 */
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  benefits?: string[];
  jobType?: string;
  datePosted: string;
  applicationUrl?: string;
  source: string;
  sourceId?: string;
  skills?: string[];
  experienceLevel?: string;
  educationLevel?: string;
  industry?: string;
  companySize?: string;
  companyType?: string;
  remote?: boolean;
  isSaved?: boolean;
}

/**
 * Interface for job search parameters
 */
export interface JobSearchParams {
  query?: string;
  location?: string;
  radius?: number;
  jobType?: string;
  datePosted?: string;
  salary?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  remote?: boolean;
  experienceLevel?: string;
  educationLevel?: string;
  industry?: string;
  skills?: string[];
}

/**
 * Interface for job search results
 */
export interface JobSearchResult {
  jobs: Job[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters?: {
    jobTypes?: string[];
    locations?: string[];
    companies?: string[];
    industries?: string[];
    experienceLevels?: string[];
    educationLevels?: string[];
    salaryRanges?: {
      min: number;
      max: number;
      label: string;
    }[];
  };
}

/**
 * Interface for job search history
 */
export interface JobSearchHistory {
  id: string;
  userId: string;
  query: string;
  location?: string;
  timestamp: string;
  resultCount: number;
}

/**
 * Interface for job alerts
 */
export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  query: string;
  location?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  active: boolean;
  createdAt: string;
  lastSent?: string;
}
