import { JobTracker, JobTrackerStep, JobTrackerNotification } from '../types/jobTracking';

const API_BASE = '/api/job-tracking';

export const jobTrackingService = {
  async createTracker(jobId: string): Promise<JobTracker> {
    const response = await fetch(`${API_BASE}/trackers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jobId })
    });
    
    if (!response.ok) throw new Error('Failed to create job tracker');
    return response.json();
  },

  async getTracker(trackerId: string): Promise<JobTracker> {
    const response = await fetch(`${API_BASE}/trackers/${trackerId}`);
    if (!response.ok) throw new Error('Failed to fetch job tracker');
    return response.json();
  },

  async updateTrackerStatus(
    trackerId: string,
    status: JobTracker['status'],
    notes?: string
  ): Promise<JobTracker> {
    const response = await fetch(`${API_BASE}/trackers/${trackerId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, notes })
    });
    
    if (!response.ok) throw new Error('Failed to update tracker status');
    return response.json();
  },

  async addTrackerStep(
    trackerId: string,
    step: Omit<JobTrackerStep, 'id'>
  ): Promise<JobTracker> {
    const response = await fetch(`${API_BASE}/trackers/${trackerId}/steps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(step)
    });
    
    if (!response.ok) throw new Error('Failed to add tracker step');
    return response.json();
  },

  async completeTrackerStep(
    trackerId: string,
    stepId: string,
    notes?: string
  ): Promise<JobTracker> {
    const response = await fetch(
      `${API_BASE}/trackers/${trackerId}/steps/${stepId}/complete`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
      }
    );
    
    if (!response.ok) throw new Error('Failed to complete tracker step');
    return response.json();
  },

  async getNotifications(): Promise<JobTrackerNotification[]> {
    const response = await fetch(`${API_BASE}/notifications`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  async markNotificationRead(notificationId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE}/notifications/${notificationId}/read`,
      {
        method: 'PATCH'
      }
    );
    
    if (!response.ok) throw new Error('Failed to mark notification as read');
  }
};
