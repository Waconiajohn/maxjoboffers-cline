/**
 * Enum representing the status of a job application
 */
export enum JobStatus {
  SAVED = 'saved',
  APPLIED = 'applied',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

/**
 * Interface for a contact associated with a job application
 */
export interface Contact {
  id?: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

/**
 * Interface for an interview associated with a job application
 */
export interface Interview {
  id?: string;
  date: string;
  type: string;
  notes?: string;
  contacts?: Contact[];
}

/**
 * Interface for a job application
 */
export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  applicationDate: string;
  status: JobStatus;
  notes?: string;
  nextSteps?: string;
  resumeId?: string;
  coverLetterId?: string;
  interviews: Interview[];
  contacts: Contact[];
  lastUpdated: string;
}

/**
 * Interface for job application filters
 */
export interface JobApplicationFilters {
  status?: JobStatus;
  company?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

/**
 * Interface for job application statistics
 */
export interface JobApplicationStats {
  totalApplications: number;
  byStatus: Record<JobStatus, number>;
  byCompany: Record<string, number>;
  byMonth: Record<string, number>;
  interviewRate: number;
  offerRate: number;
}
