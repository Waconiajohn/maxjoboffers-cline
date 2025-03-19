import { v4 as uuidv4 } from 'uuid';
import {
  JobApplication,
  ApplicationStatus,
  ContactPerson,
  Interview,
  InterviewType,
  FollowUp,
  FollowUpType,
  ApplicationTask,
  TaskPriority,
  Job
} from '../types';
import { jobSearchService } from './jobSearchService';

/**
 * Service for handling job application tracking functionality
 */
class JobTrackingService {
  private applications: JobApplication[] = [];

  constructor() {
    this.initializeMockApplications();
  }

  /**
   * Get all job applications
   */
  async getApplications(): Promise<JobApplication[]> {
    return this.applications;
  }

  /**
   * Get a job application by ID
   */
  async getApplicationById(id: string): Promise<JobApplication | null> {
    const application = this.applications.find(a => a.id === id);
    return application || null;
  }

  /**
   * Get job applications by status
   */
  async getApplicationsByStatus(status: ApplicationStatus): Promise<JobApplication[]> {
    return this.applications.filter(a => a.status === status);
  }

  /**
   * Create a new job application
   */
  async createApplication(jobId: string, resumeId?: string, coverLetterId?: string): Promise<JobApplication | null> {
    const job = await jobSearchService.getJobById(jobId);
    if (!job) return null;

    const newApplication: JobApplication = {
      id: uuidv4(),
      jobId,
      job,
      status: ApplicationStatus.Saved,
      appliedDate: new Date().toISOString(),
      resumeId,
      coverLetterId,
      contacts: [],
      interviews: [],
      followUps: [],
      notes: '',
      tasks: [
        {
          id: uuidv4(),
          title: 'Review job description',
          completed: false,
          priority: TaskPriority.High
        },
        {
          id: uuidv4(),
          title: 'Research company',
          completed: false,
          priority: TaskPriority.Medium
        },
        {
          id: uuidv4(),
          title: 'Customize resume',
          completed: false,
          priority: TaskPriority.High
        },
        {
          id: uuidv4(),
          title: 'Prepare cover letter',
          completed: false,
          priority: TaskPriority.Medium
        }
      ],
      lastUpdated: new Date().toISOString(),
      favorite: false
    };

    this.applications.push(newApplication);
    await jobSearchService.markJobAsApplied(jobId);

    return newApplication;
  }

  /**
   * Update a job application
   */
  async updateApplication(
    id: string,
    updates: Partial<Omit<JobApplication, 'id' | 'jobId' | 'job'>>
  ): Promise<JobApplication | null> {
    const applicationIndex = this.applications.findIndex(a => a.id === id);
    if (applicationIndex === -1) return null;

    this.applications[applicationIndex] = {
      ...this.applications[applicationIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    return this.applications[applicationIndex];
  }

  /**
   * Update application status
   */
  async updateStatus(id: string, status: ApplicationStatus): Promise<JobApplication | null> {
    return this.updateApplication(id, { status });
  }

  /**
   * Add a contact person to an application
   */
  async addContact(applicationId: string, contact: Omit<ContactPerson, 'id'>): Promise<JobApplication | null> {
    const application = await this.getApplicationById(applicationId);
    if (!application) return null;

    const newContact: ContactPerson = {
      id: uuidv4(),
      ...contact
    };

    return this.updateApplication(applicationId, {
      contacts: [...application.contacts, newContact]
    });
  }

  /**
   * Update a contact person
   */
  async updateContact(
    applicationId: string,
    contactId: string,
    updates: Partial<Omit<ContactPerson, 'id'>>
  ): Promise<JobApplication | null> {
    const application = await this.getApplicationById(applicationId);
    if (!application) return null;

    const contactIndex = application.contacts.findIndex(c => c.id === contactId);
    if (contactIndex === -1) return null;

    const updatedContacts = [...application.contacts];
    updatedContacts[contactIndex] = {
      ...updatedContacts[contactIndex],
      ...updates
    };

    return this.updateApplication(applicationId, {
      contacts: updatedContacts
    });
  }

  /**
   * Remove a contact person
   */
  async removeContact(applicationId: string, contactId: string): Promise<JobApplication | null> {
    const application = await this.getApplicationById(applicationId);
    if (!application) return null;

    return this.updateApplication(applicationId, {
      contacts: application.contacts.filter(c => c.id !== contactId)
    });
  }

  /**
   * Add an interview to an application
   */
  async addInterview(
    applicationId: string,
    interview: Omit<Interview, 'id' | 'interviewers'>
  ): Promise<JobApplication | null> {
    const application = await this.getApplicationById(applicationId);
    if (!application) return null;

    const newInterview: Interview = {
      id: uuidv4(),
      ...interview,
      interviewers: []
    };

    return this.updateApplication(applicationId, {
      interviews: [...application.interviews, newInterview],
      status: ApplicationStatus.Interview
    });
  }

  /**
   * Update an interview
   */
  async updateInterview(
    applicationId: string,
    interviewId: string,
    updates: Partial<Omit<Interview, 'id'>>
  ): Promise<JobApplication | null> {
    const application = await this.getApplicationById(applicationId);
    if (!application) return null;

    const interviewIndex = application.interviews.findIndex(i => i.id === interviewId);
    if (interviewIndex === -1) return null;

    const updatedInterviews = [...application.interviews];
    updatedInterviews[interviewIndex] = {
      ...updatedInterviews[interviewIndex],
      ...updates
    };

    return this.updateApplication(applicationId, {
      interviews: updatedInterviews
    });
  }

  /**
   * Remove an interview
   */
  async removeInterview(applicationId: string, interviewId: string): Promise<JobApplication | null> {
    const application = await this.getApplicationById(applicationId);
    if (!application) return null;

    return this.updateApplication(applicationId, {
      interviews: application.interviews.filter(i => i.id !== interviewId)
    });
  }

  /**
   * Add a follow-up to an application
   */
  async addFollowUp(
    applicationId: string,
    followUp: Omit<FollowUp, 'id'>
  ): Promise<JobApplication | null> {
    const application = await this.getApplicationById(applicationId);
    if (!application) return null;

    const newFollowUp: FollowUp = {
      id: uuidv4(),
      ...followUp
    };

    return this.updateApplication(applicationId, {
      followUps: [...application.followUps, newFollowUp]
    });
  }

  /**
   * Update a follow-up
   */
  async updateFollowUp(
    applicationId: string,
    followUpId: string,
    updates: Partial<Omit<FollowUp, 'id'>>
  ): Promise<JobApplication | null> {
    const application = await this.getApplicationById(applicationId);
    if (!application) return null;

    const followUpIndex = application.followUps.findIndex(f => f.id === followUpId);
    if (followUpIndex === -1) return null;

    const updatedFollowUps = [...application.followUps];
    updatedFollowUps[followUpIndex] = {
      ...updatedFollowUps[followUpIndex],
      ...updates
    };

    return this.updateApplication(applicationId, {
      followUps: updatedFollowUps
    });
  }

  /**
   * Remove a follow-up
   */
  async removeFollowUp(applicationId: string, followUpId: string): Promise<JobApplication | null> {
    const application = await this.getApplicationById(applicationId);
    if (!application) return null;

    return this.updateApplication(applicationId, {
      followUps: application.followUps.filter(f => f.id !== followUpId)
    });
  }

  /**
   * Add a task to an application
   */
  async addTask(
    applicationId: string,
    task: Omit<ApplicationTask, 'id'>
  ): Promise<JobApplication | null> {
    const application = await this.getApplicationById(applicationId);
    if (!application) return null;

    const newTask: ApplicationTask = {
      id: uuidv4(),
      ...task
    };

    return this.updateApplication(applicationId, {
      tasks: [...application.tasks, newTask]
    });
  }

  /**
   * Update a task
   */
  async updateTask(
    applicationId: string,
    taskId: string,
    updates: Partial<Omit<ApplicationTask, 'id'>>
  ): Promise<JobApplication | null> {
    const application = await this.getApplicationById(applicationId);
    if (!application) return null;

    const taskIndex = application.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    const updatedTasks = [...application.tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      ...updates
    };

    return this.updateApplication(applicationId, {
      tasks: updatedTasks
    });
  }

  /**
   * Remove a task
   */
  async removeTask(applicationId: string, taskId: string): Promise<JobApplication | null> {
    const application = await this.getApplicationById(applicationId);
    if (!application) return null;

    return this.updateApplication(applicationId, {
      tasks: application.tasks.filter(t => t.id !== taskId)
    });
  }

  /**
   * Delete an application
   */
  async deleteApplication(id: string): Promise<boolean> {
    const initialLength = this.applications.length;
    this.applications = this.applications.filter(a => a.id !== id);
    return initialLength > this.applications.length;
  }

  /**
   * Initialize mock applications for development and testing
   */
  private async initializeMockApplications() {
    // Get mock jobs from job search service
    const mockJobs = (await jobSearchService.searchJobs({
      query: '',
      location: '',
      remote: null,
      jobType: null,
      experienceLevel: null,
      salary: null,
      datePosted: null,
      tags: null,
      favorite: null,
      applied: null
    })).jobs;
    if (mockJobs.length === 0) return;

    // Create mock applications for the first two jobs
    const mockApplications: JobApplication[] = [
      {
        id: uuidv4(),
        jobId: mockJobs[0].id,
        job: mockJobs[0],
        status: ApplicationStatus.Applied,
        appliedDate: '2025-03-15T10:30:00Z',
        resumeId: 'resume-1',
        coverLetterId: 'cover-letter-1',
        contacts: [
          {
            id: uuidv4(),
            name: 'Sarah Johnson',
            title: 'HR Manager',
            company: mockJobs[0].company,
            email: 'sarah.johnson@example.com',
            phone: '(555) 123-4567',
            notes: 'Initial contact via LinkedIn. Very responsive and helpful.'
          }
        ],
        interviews: [
          {
            id: uuidv4(),
            type: InterviewType.Phone,
            date: '2025-03-20T14:00:00Z',
            duration: 30,
            virtual: true,
            meetingLink: 'https://zoom.us/j/123456789',
            interviewers: [
              {
                id: uuidv4(),
                name: 'Michael Chen',
                title: 'Technical Lead',
                company: mockJobs[0].company
              }
            ],
            notes: 'Prepare to discuss recent projects and technical skills.',
            completed: false
          }
        ],
        followUps: [
          {
            id: uuidv4(),
            date: '2025-03-16T09:00:00Z',
            type: FollowUpType.ThankYou,
            notes: 'Sent thank you email after submitting application.',
            completed: true
          }
        ],
        notes: 'This position aligns well with my skills and career goals. The company culture seems great based on research.',
        tasks: [
          {
            id: uuidv4(),
            title: 'Research company values and recent news',
            description: 'Look for recent press releases and company blog posts',
            dueDate: '2025-03-18T00:00:00Z',
            completed: true,
            priority: TaskPriority.High
          },
          {
            id: uuidv4(),
            title: 'Prepare for technical interview',
            description: 'Review algorithms and system design concepts',
            dueDate: '2025-03-19T00:00:00Z',
            completed: false,
            priority: TaskPriority.High
          }
        ],
        lastUpdated: '2025-03-16T15:45:00Z',
        favorite: true
      },
      {
        id: uuidv4(),
        jobId: mockJobs[1].id,
        job: mockJobs[1],
        status: ApplicationStatus.Saved,
        appliedDate: '2025-03-17T08:15:00Z',
        contacts: [],
        interviews: [],
        followUps: [],
        notes: 'Interesting startup with innovative product. Need to customize resume to highlight relevant experience.',
        tasks: [
          {
            id: uuidv4(),
            title: 'Customize resume for this position',
            completed: false,
            priority: TaskPriority.Medium
          },
          {
            id: uuidv4(),
            title: 'Draft cover letter',
            completed: false,
            priority: TaskPriority.Medium
          }
        ],
        lastUpdated: '2025-03-17T08:15:00Z',
        favorite: false
      }
    ];

    this.applications = mockApplications;
  }
}

export const jobTrackingService = new JobTrackingService();
