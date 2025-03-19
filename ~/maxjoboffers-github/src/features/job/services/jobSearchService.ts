import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  Job,
  JobSearchFilters,
  JobSearchResults,
  JobType,
  ExperienceLevel,
  JobSource
} from '../types';

/**
 * Service for handling job search functionality
 */
class JobSearchService {
  private jobs: Job[] = [];
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.JOB_API_KEY;
    this.initializeMockJobs();
  }

  /**
   * Search for jobs based on filters
   */
  async searchJobs(filters: JobSearchFilters, page = 1, pageSize = 10): Promise<JobSearchResults> {
    try {
      // In a real implementation, this would call an external API
      if (this.apiKey) {
        return await this.searchJobsFromApi(filters, page, pageSize);
      }

      // Fallback to mock data
      return this.searchMockJobs(filters, page, pageSize);
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw new Error('Failed to search jobs');
    }
  }

  /**
   * Get a job by ID
   */
  async getJobById(id: string): Promise<Job | null> {
    const job = this.jobs.find(j => j.id === id);
    return job || null;
  }

  /**
   * Save a job (mark as favorite)
   */
  async saveJob(jobId: string, favorite: boolean): Promise<Job | null> {
    const jobIndex = this.jobs.findIndex(j => j.id === jobId);
    if (jobIndex === -1) return null;

    this.jobs[jobIndex] = {
      ...this.jobs[jobIndex],
      favorite
    };

    return this.jobs[jobIndex];
  }

  /**
   * Mark a job as applied
   */
  async markJobAsApplied(jobId: string): Promise<Job | null> {
    const jobIndex = this.jobs.findIndex(j => j.id === jobId);
    if (jobIndex === -1) return null;

    this.jobs[jobIndex] = {
      ...this.jobs[jobIndex],
      applied: true
    };

    return this.jobs[jobIndex];
  }

  /**
   * Add notes to a job
   */
  async addJobNotes(jobId: string, notes: string): Promise<Job | null> {
    const jobIndex = this.jobs.findIndex(j => j.id === jobId);
    if (jobIndex === -1) return null;

    this.jobs[jobIndex] = {
      ...this.jobs[jobIndex],
      notes
    };

    return this.jobs[jobIndex];
  }

  /**
   * Search jobs from external API
   */
  private async searchJobsFromApi(
    filters: JobSearchFilters,
    page: number,
    pageSize: number
  ): Promise<JobSearchResults> {
    try {
      const response = await axios.get('https://api.example.com/jobs', {
        params: {
          query: filters.query,
          location: filters.location,
          remote: filters.remote,
          job_type: filters.jobType?.join(','),
          experience_level: filters.experienceLevel?.join(','),
          salary_min: filters.salary?.[0],
          salary_max: filters.salary?.[1],
          date_posted: filters.datePosted,
          tags: filters.tags?.join(','),
          page,
          page_size: pageSize,
          api_key: this.apiKey
        }
      });

      return {
        jobs: response.data.jobs,
        totalCount: response.data.total_count,
        page: response.data.page,
        pageSize: response.data.page_size,
        hasMore: response.data.has_more
      };
    } catch (error) {
      console.error('Error fetching jobs from API:', error);
      return this.searchMockJobs(filters, page, pageSize);
    }
  }

  /**
   * Search mock jobs (for development and testing)
   */
  private searchMockJobs(
    filters: JobSearchFilters,
    page: number,
    pageSize: number
  ): JobSearchResults {
    let filteredJobs = [...this.jobs];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredJobs = filteredJobs.filter(
        job =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
      );
    }

    if (filters.location) {
      const location = filters.location.toLowerCase();
      filteredJobs = filteredJobs.filter(job => job.location.toLowerCase().includes(location));
    }

    if (filters.remote !== null) {
      filteredJobs = filteredJobs.filter(job => job.remote === filters.remote);
    }

    if (filters.jobType && filters.jobType.length > 0) {
      filteredJobs = filteredJobs.filter(job => filters.jobType!.includes(job.jobType));
    }

    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      filteredJobs = filteredJobs.filter(job => filters.experienceLevel!.includes(job.experienceLevel));
    }

    if (filters.salary) {
      filteredJobs = filteredJobs.filter(job => {
        if (!job.salary) return false;
        const jobSalary = parseInt(job.salary.replace(/[^0-9]/g, ''));
        return jobSalary >= filters.salary![0] && jobSalary <= filters.salary![1];
      });
    }

    if (filters.datePosted) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - filters.datePosted);
      filteredJobs = filteredJobs.filter(job => new Date(job.postedDate) >= cutoffDate);
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        filters.tags!.some(tag => job.tags.includes(tag))
      );
    }

    if (filters.favorite !== null) {
      filteredJobs = filteredJobs.filter(job => job.favorite === filters.favorite);
    }

    if (filters.applied !== null) {
      filteredJobs = filteredJobs.filter(job => job.applied === filters.applied);
    }

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return {
      jobs: paginatedJobs,
      totalCount: filteredJobs.length,
      page,
      pageSize,
      hasMore: endIndex < filteredJobs.length
    };
  }

  /**
   * Initialize mock jobs for development and testing
   */
  private initializeMockJobs() {
    const mockJobs: Job[] = [
      {
        id: uuidv4(),
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        salary: '$120,000 - $150,000',
        description: 'We are looking for a Senior Frontend Developer to join our team...',
        requirements: [
          'Proficient in React, TypeScript, and modern JavaScript',
          '5+ years of frontend development experience',
          'Experience with state management libraries (Redux, MobX, etc.)',
          'Strong understanding of web performance optimization'
        ],
        postedDate: '2025-03-10T00:00:00Z',
        applicationUrl: 'https://techcorp.com/careers/senior-frontend-developer',
        remote: true,
        jobType: JobType.FullTime,
        experienceLevel: ExperienceLevel.Senior,
        source: JobSource.LinkedIn,
        tags: ['React', 'TypeScript', 'Frontend'],
        favorite: false,
        applied: false
      },
      {
        id: uuidv4(),
        title: 'Full Stack Developer',
        company: 'StartupX',
        location: 'New York, NY',
        salary: '$100,000 - $130,000',
        description: 'StartupX is seeking a Full Stack Developer to help build our next-generation platform...',
        requirements: [
          'Experience with React and Node.js',
          'Familiarity with database design and ORM frameworks',
          'Understanding of RESTful APIs and microservices',
          'Ability to work in a fast-paced startup environment'
        ],
        postedDate: '2025-03-12T00:00:00Z',
        applicationUrl: 'https://startupx.io/jobs/full-stack-developer',
        remote: false,
        jobType: JobType.FullTime,
        experienceLevel: ExperienceLevel.Mid,
        source: JobSource.Indeed,
        tags: ['React', 'Node.js', 'Full Stack'],
        favorite: false,
        applied: false
      },
      {
        id: uuidv4(),
        title: 'Backend Engineer',
        company: 'DataSystems',
        location: 'Seattle, WA',
        salary: '$130,000 - $160,000',
        description: 'DataSystems is looking for a Backend Engineer to join our cloud infrastructure team...',
        requirements: [
          'Strong experience with Java or Kotlin',
          'Knowledge of cloud services (AWS, GCP, or Azure)',
          'Experience with database systems and SQL',
          'Understanding of distributed systems'
        ],
        postedDate: '2025-03-05T00:00:00Z',
        applicationUrl: 'https://datasystems.com/careers/backend-engineer',
        remote: true,
        jobType: JobType.FullTime,
        experienceLevel: ExperienceLevel.Senior,
        source: JobSource.Company,
        tags: ['Java', 'AWS', 'Backend'],
        favorite: false,
        applied: false
      },
      {
        id: uuidv4(),
        title: 'UX/UI Designer',
        company: 'CreativeAgency',
        location: 'Los Angeles, CA',
        salary: '$90,000 - $110,000',
        description: 'CreativeAgency is seeking a talented UX/UI Designer to create beautiful and functional interfaces...',
        requirements: [
          'Portfolio demonstrating strong UI/UX skills',
          'Proficiency in design tools (Figma, Sketch, Adobe XD)',
          'Understanding of user-centered design principles',
          'Ability to collaborate with developers and stakeholders'
        ],
        postedDate: '2025-03-15T00:00:00Z',
        applicationUrl: 'https://creativeagency.com/jobs/ux-ui-designer',
        remote: false,
        jobType: JobType.FullTime,
        experienceLevel: ExperienceLevel.Mid,
        source: JobSource.GlassDoor,
        tags: ['UX', 'UI', 'Design', 'Figma'],
        favorite: false,
        applied: false
      },
      {
        id: uuidv4(),
        title: 'DevOps Engineer',
        company: 'CloudTech',
        location: 'Austin, TX',
        salary: '$115,000 - $140,000',
        description: 'CloudTech is looking for a DevOps Engineer to help automate and optimize our infrastructure...',
        requirements: [
          'Experience with CI/CD pipelines',
          'Knowledge of containerization (Docker, Kubernetes)',
          'Familiarity with infrastructure as code (Terraform, CloudFormation)',
          'Strong scripting skills (Bash, Python)'
        ],
        postedDate: '2025-03-08T00:00:00Z',
        applicationUrl: 'https://cloudtech.io/careers/devops-engineer',
        remote: true,
        jobType: JobType.FullTime,
        experienceLevel: ExperienceLevel.Mid,
        source: JobSource.LinkedIn,
        tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
        favorite: false,
        applied: false
      }
    ];

    this.jobs = mockJobs;
  }
}

export const jobSearchService = new JobSearchService();
