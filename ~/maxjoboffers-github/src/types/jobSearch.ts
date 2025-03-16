export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' | 'INTERN' | 'VOLUNTEER' | 'PER_DIEM';
  datePosted: string;
  applicationUrl: string;
  remote: boolean;
  skills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  industry: string;
  benefits?: string[];
}

export interface JobSearchFilters {
  query: string;
  location?: string;
  radius?: number; // in miles
  employmentTypes?: string[];
  datePosted?: 'past24Hours' | 'past3Days' | 'pastWeek' | 'pastMonth' | 'anytime';
  experienceLevels?: string[];
  remote?: boolean;
  salary?: {
    min?: number;
    max?: number;
  };
  industries?: string[];
  skills?: string[];
}

export interface JobSearchResponse {
  jobs: JobListing[];
  totalResults: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}
