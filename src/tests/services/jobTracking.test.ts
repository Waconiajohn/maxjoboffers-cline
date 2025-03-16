import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { jobTrackingService } from '../../services/jobTracking';
import { JobApplication, JobStatus } from '../../types/jobTracking';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

import axios from 'axios';

describe('JobTrackingService', () => {
  const userId = 'user123';
  
  const mockJobApplications: JobApplication[] = [
    {
      id: 'app1',
      userId: 'user123',
      jobId: 'job1',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Company A',
      location: 'San Francisco, CA',
      applicationDate: '2025-03-10T12:00:00Z',
      status: JobStatus.APPLIED,
      notes: 'Applied through company website',
      nextSteps: 'Follow up in a week',
      resumeId: 'resume1',
      coverLetterId: 'cover1',
      interviews: [
        {
          id: 'interview1',
          date: '2025-03-15T14:00:00Z',
          type: 'Phone Screen',
          notes: 'Spoke with HR',
          contacts: [
            {
              name: 'Jane Smith',
              title: 'HR Manager',
              email: 'jane@techcompanya.com'
            }
          ]
        }
      ],
      contacts: [
        {
          name: 'John Doe',
          title: 'Hiring Manager',
          email: 'john@techcompanya.com',
          phone: '555-123-4567',
          notes: 'Met at a conference'
        }
      ],
      lastUpdated: '2025-03-12T10:00:00Z'
    },
    {
      id: 'app2',
      userId: 'user123',
      jobId: 'job2',
      jobTitle: 'Full Stack Developer',
      company: 'Tech Company B',
      location: 'Remote',
      applicationDate: '2025-03-08T09:00:00Z',
      status: JobStatus.INTERVIEW,
      notes: 'Applied through LinkedIn',
      nextSteps: 'Prepare for technical interview',
      resumeId: 'resume2',
      coverLetterId: 'cover2',
      interviews: [],
      contacts: [],
      lastUpdated: '2025-03-09T15:30:00Z'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getApplications', () => {
    it('should return all job applications for a user', async () => {
      // Mock the axios.get response
      (axios.get as any).mockResolvedValueOnce({
        data: mockJobApplications
      });

      const result = await jobTrackingService.getApplications(userId);

      expect(result).toEqual(mockJobApplications);
      expect(axios.get).toHaveBeenCalledWith(`/api/applications?userId=${userId}`);
    });

    it('should handle errors when fetching applications', async () => {
      // Mock the axios.get to throw an error
      (axios.get as any).mockRejectedValueOnce(new Error('Failed to fetch applications'));

      await expect(jobTrackingService.getApplications(userId)).rejects.toThrow('Failed to fetch applications');
    });
  });

  describe('getApplicationById', () => {
    it('should return a specific job application', async () => {
      const applicationId = 'app1';
      
      // Mock the axios.get response
      (axios.get as any).mockResolvedValueOnce({
        data: mockJobApplications[0]
      });

      const result = await jobTrackingService.getApplicationById(applicationId);

      expect(result).toEqual(mockJobApplications[0]);
      expect(axios.get).toHaveBeenCalledWith(`/api/applications/${applicationId}`);
    });

    it('should handle errors when fetching an application', async () => {
      const applicationId = 'app1';
      
      // Mock the axios.get to throw an error
      (axios.get as any).mockRejectedValueOnce(new Error('Application not found'));

      await expect(jobTrackingService.getApplicationById(applicationId)).rejects.toThrow('Application not found');
    });
  });

  describe('createApplication', () => {
    it('should create a new job application', async () => {
      const newApplication = {
        userId: 'user123',
        jobId: 'job3',
        jobTitle: 'DevOps Engineer',
        company: 'Tech Company C',
        location: 'Chicago, IL',
        applicationDate: '2025-03-14T11:00:00Z',
        status: JobStatus.APPLIED,
        notes: 'Applied through company website',
        resumeId: 'resume3',
        coverLetterId: 'cover3'
      };
      
      const createdApplication = {
        ...newApplication,
        id: 'app3',
        interviews: [],
        contacts: [],
        nextSteps: '',
        lastUpdated: '2025-03-14T11:00:00Z'
      };
      
      // Mock the axios.post response
      (axios.post as any).mockResolvedValueOnce({
        data: createdApplication
      });

      const result = await jobTrackingService.createApplication(newApplication);

      expect(result).toEqual(createdApplication);
      expect(axios.post).toHaveBeenCalledWith('/api/applications', newApplication);
    });

    it('should handle errors when creating an application', async () => {
      const newApplication = {
        userId: 'user123',
        jobId: 'job3',
        jobTitle: 'DevOps Engineer',
        company: 'Tech Company C',
        location: 'Chicago, IL',
        applicationDate: '2025-03-14T11:00:00Z',
        status: JobStatus.APPLIED,
        notes: 'Applied through company website',
        resumeId: 'resume3',
        coverLetterId: 'cover3'
      };
      
      // Mock the axios.post to throw an error
      (axios.post as any).mockRejectedValueOnce(new Error('Failed to create application'));

      await expect(jobTrackingService.createApplication(newApplication)).rejects.toThrow('Failed to create application');
    });
  });

  describe('updateApplication', () => {
    it('should update an existing job application', async () => {
      const applicationId = 'app1';
      const updates = {
        status: JobStatus.INTERVIEW,
        notes: 'Updated notes',
        nextSteps: 'Prepare for interview'
      };
      
      const updatedApplication = {
        ...mockJobApplications[0],
        ...updates,
        lastUpdated: '2025-03-15T09:00:00Z'
      };
      
      // Mock the axios.put response
      (axios.put as any).mockResolvedValueOnce({
        data: updatedApplication
      });

      const result = await jobTrackingService.updateApplication(applicationId, updates);

      expect(result).toEqual(updatedApplication);
      expect(axios.put).toHaveBeenCalledWith(`/api/applications/${applicationId}`, updates);
    });

    it('should handle errors when updating an application', async () => {
      const applicationId = 'app1';
      const updates = {
        status: JobStatus.INTERVIEW,
        notes: 'Updated notes'
      };
      
      // Mock the axios.put to throw an error
      (axios.put as any).mockRejectedValueOnce(new Error('Failed to update application'));

      await expect(jobTrackingService.updateApplication(applicationId, updates)).rejects.toThrow('Failed to update application');
    });
  });

  describe('deleteApplication', () => {
    it('should delete a job application', async () => {
      const applicationId = 'app1';
      
      // Mock the axios.delete response
      (axios.delete as any).mockResolvedValueOnce({
        data: { success: true }
      });

      const result = await jobTrackingService.deleteApplication(applicationId);

      expect(result).toEqual({ success: true });
      expect(axios.delete).toHaveBeenCalledWith(`/api/applications/${applicationId}`);
    });

    it('should handle errors when deleting an application', async () => {
      const applicationId = 'app1';
      
      // Mock the axios.delete to throw an error
      (axios.delete as any).mockRejectedValueOnce(new Error('Failed to delete application'));

      await expect(jobTrackingService.deleteApplication(applicationId)).rejects.toThrow('Failed to delete application');
    });
  });

  describe('addInterview', () => {
    it('should add an interview to a job application', async () => {
      const applicationId = 'app2';
      const interview = {
        date: '2025-03-20T13:00:00Z',
        type: 'Technical Interview',
        notes: 'Will be interviewed by the tech lead',
        contacts: [
          {
            name: 'Bob Johnson',
            title: 'Tech Lead',
            email: 'bob@techcompanyb.com'
          }
        ]
      };
      
      const updatedApplication = {
        ...mockJobApplications[1],
        interviews: [interview],
        lastUpdated: '2025-03-15T09:00:00Z'
      };
      
      // Mock the axios.post response
      (axios.post as any).mockResolvedValueOnce({
        data: updatedApplication
      });

      const result = await jobTrackingService.addInterview(applicationId, interview);

      expect(result).toEqual(updatedApplication);
      expect(axios.post).toHaveBeenCalledWith(`/api/applications/${applicationId}/interviews`, interview);
    });

    it('should handle errors when adding an interview', async () => {
      const applicationId = 'app2';
      const interview = {
        date: '2025-03-20T13:00:00Z',
        type: 'Technical Interview',
        notes: 'Will be interviewed by the tech lead'
      };
      
      // Mock the axios.post to throw an error
      (axios.post as any).mockRejectedValueOnce(new Error('Failed to add interview'));

      await expect(jobTrackingService.addInterview(applicationId, interview)).rejects.toThrow('Failed to add interview');
    });
  });

  describe('addContact', () => {
    it('should add a contact to a job application', async () => {
      const applicationId = 'app2';
      const contact = {
        name: 'Alice Brown',
        title: 'HR Specialist',
        email: 'alice@techcompanyb.com',
        phone: '555-987-6543',
        notes: 'Initial contact'
      };
      
      const updatedApplication = {
        ...mockJobApplications[1],
        contacts: [contact],
        lastUpdated: '2025-03-15T09:00:00Z'
      };
      
      // Mock the axios.post response
      (axios.post as any).mockResolvedValueOnce({
        data: updatedApplication
      });

      const result = await jobTrackingService.addContact(applicationId, contact);

      expect(result).toEqual(updatedApplication);
      expect(axios.post).toHaveBeenCalledWith(`/api/applications/${applicationId}/contacts`, contact);
    });

    it('should handle errors when adding a contact', async () => {
      const applicationId = 'app2';
      const contact = {
        name: 'Alice Brown',
        title: 'HR Specialist',
        email: 'alice@techcompanyb.com'
      };
      
      // Mock the axios.post to throw an error
      (axios.post as any).mockRejectedValueOnce(new Error('Failed to add contact'));

      await expect(jobTrackingService.addContact(applicationId, contact)).rejects.toThrow('Failed to add contact');
    });
  });
});
