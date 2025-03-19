/**
 * Job Feature Types
 */

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  salary?: {
    min: number;
    max: number;
    currency?: string;
  };
  workType?: string;
  datePosted: string;
  url?: string;
  status?: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
}

export interface JobSearchParams {
  query: string;
  location: string;
  radius: number;
  filters?: {
    workType?: string;
    datePosted?: string;
    minSalary?: number;
    maxSalary?: number;
  };
}

export interface JobSearchResults {
  jobs: Job[];
  totalCount: number;
  page?: number;
  totalPages?: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  notes?: string;
  coverLetterId?: string;
  resumeId?: string;
}
