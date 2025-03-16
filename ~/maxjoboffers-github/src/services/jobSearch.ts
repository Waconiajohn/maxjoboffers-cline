import { JobListing, JobSearchFilters, JobSearchResponse } from '../types/jobSearch';

// Google Jobs API base URL
const GOOGLE_JOBS_API_BASE_URL = 'https://jobs.googleapis.com/v4/jobs';
const API_KEY = process.env.REACT_APP_GOOGLE_JOBS_API_KEY;

// Mock data for development
const mockJobListings: JobListing[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    description: 'We are looking for a Senior Software Engineer to join our team...',
    requirements: [
      '5+ years of experience in software development',
      'Proficiency in JavaScript, TypeScript, and React',
      'Experience with cloud services (AWS, GCP, or Azure)',
      'Strong problem-solving skills'
    ],
    salary: {
      min: 120000,
      max: 160000,
      currency: 'USD',
      period: 'yearly'
    },
    employmentType: 'FULL_TIME',
    datePosted: '2025-03-01T00:00:00Z',
    applicationUrl: 'https://techinnovations.com/careers/senior-software-engineer',
    remote: true,
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS'],
    experienceLevel: 'senior',
    industry: 'Technology',
    benefits: ['Health insurance', '401(k) matching', 'Unlimited PTO', 'Remote work options']
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Digital Solutions',
    location: 'New York, NY',
    description: 'Digital Solutions is seeking a Product Manager to lead our product development...',
    requirements: [
      '3+ years of product management experience',
      'Experience with agile methodologies',
      'Strong analytical and communication skills',
      'Technical background preferred'
    ],
    salary: {
      min: 110000,
      max: 140000,
      currency: 'USD',
      period: 'yearly'
    },
    employmentType: 'FULL_TIME',
    datePosted: '2025-03-05T00:00:00Z',
    applicationUrl: 'https://digitalsolutions.com/careers/product-manager',
    remote: false,
    skills: ['Product Management', 'Agile', 'User Research', 'Roadmapping', 'Analytics'],
    experienceLevel: 'mid',
    industry: 'Technology',
    benefits: ['Health insurance', 'Stock options', 'Flexible hours', 'Professional development']
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'Creative Designs Co.',
    location: 'Austin, TX',
    description: 'Join our design team to create beautiful and functional user experiences...',
    requirements: [
      'Portfolio demonstrating UX/UI design skills',
      'Experience with design tools (Figma, Sketch, Adobe XD)',
      'Understanding of user-centered design principles',
      'Ability to work collaboratively with developers'
    ],
    salary: {
      min: 90000,
      max: 120000,
      currency: 'USD',
      period: 'yearly'
    },
    employmentType: 'FULL_TIME',
    datePosted: '2025-03-10T00:00:00Z',
    applicationUrl: 'https://creativedesigns.com/careers/ux-ui-designer',
    remote: true,
    skills: ['UI Design', 'UX Research', 'Figma', 'Sketch', 'Prototyping'],
    experienceLevel: 'mid',
    industry: 'Design',
    benefits: ['Health insurance', 'Creative workspace', 'Flexible schedule', 'Design conferences']
  }
];

export const jobSearchService = {
  /**
   * Search for jobs using the Google Jobs API
   * @param filters Search filters
   * @param page Page number (1-based)
   * @param pageSize Number of results per page
   */
  async searchJobs(
    filters: JobSearchFilters,
    page: number = 1,
    pageSize: number = 10
  ): Promise<JobSearchResponse> {
    try {
      // In a real implementation, this would call the Google Jobs API
      // For now, we'll use mock data
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter mock data based on search criteria
      let filteredJobs = [...mockJobListings];
      
      // Apply filters
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(query) || 
          job.description.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query)
        );
      }
      
      if (filters.location) {
        const location = filters.location.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(location)
        );
      }
      
      if (filters.employmentTypes && filters.employmentTypes.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
          filters.employmentTypes?.includes(job.employmentType)
        );
      }
      
      if (filters.experienceLevels && filters.experienceLevels.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
          filters.experienceLevels?.includes(job.experienceLevel)
        );
      }
      
      if (filters.remote !== undefined) {
        filteredJobs = filteredJobs.filter(job => job.remote === filters.remote);
      }
      
      if (filters.salary) {
        if (filters.salary.min !== undefined) {
          filteredJobs = filteredJobs.filter(job => 
            job.salary && job.salary.min >= (filters.salary?.min || 0)
          );
        }
        
        if (filters.salary.max !== undefined) {
          filteredJobs = filteredJobs.filter(job => 
            job.salary && job.salary.max <= (filters.salary?.max || Infinity)
          );
        }
      }
      
      // Calculate pagination
      const totalResults = filteredJobs.length;
      const totalPages = Math.ceil(totalResults / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalResults);
      const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
      
      return {
        jobs: paginatedJobs,
        totalResults,
        pageSize,
        pageNumber: page,
        totalPages
      };
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw new Error('Failed to search jobs');
    }
  },
  
  /**
   * Get job details by ID
   * @param jobId Job ID
   */
  async getJobDetails(jobId: string): Promise<JobListing> {
    try {
      // In a real implementation, this would call the Google Jobs API
      // For now, we'll use mock data
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const job = mockJobListings.find(job => job.id === jobId);
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      return job;
    } catch (error) {
      console.error('Error getting job details:', error);
      throw new Error('Failed to get job details');
    }
  },
  
  /**
   * Get similar jobs based on a job ID
   * @param jobId Job ID
   * @param limit Number of similar jobs to return
   */
  async getSimilarJobs(jobId: string, limit: number = 3): Promise<JobListing[]> {
    try {
      // In a real implementation, this would call the Google Jobs API
      // For now, we'll use mock data
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const job = mockJobListings.find(job => job.id === jobId);
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      // Find jobs with similar skills or industry
      const similarJobs = mockJobListings
        .filter(j => j.id !== jobId) // Exclude the current job
        .sort((a, b) => {
          // Calculate similarity score based on matching skills
          const aMatchingSkills = a.skills.filter(skill => 
            job.skills.includes(skill)
          ).length;
          
          const bMatchingSkills = b.skills.filter(skill => 
            job.skills.includes(skill)
          ).length;
          
          // Add industry match bonus
          const aIndustryMatch = a.industry === job.industry ? 2 : 0;
          const bIndustryMatch = b.industry === job.industry ? 2 : 0;
          
          return (bMatchingSkills + bIndustryMatch) - (aMatchingSkills + aIndustryMatch);
        })
        .slice(0, limit);
      
      return similarJobs;
    } catch (error) {
      console.error('Error getting similar jobs:', error);
      throw new Error('Failed to get similar jobs');
    }
  }
};
