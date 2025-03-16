export interface JobTracker {
  id: string;
  jobId: string;
  userId: string;
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  notes: string;
  nextSteps: JobTrackerStep[];
  timeline: JobTrackerEvent[];
  lastUpdated: string;
}

export interface JobTrackerStep {
  id: string;
  type: 'resume-update' | 'apply' | 'interview-prep' | 'interview' | 'follow-up';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  completedDate?: string;
  notes?: string;
}

export interface JobTrackerEvent {
  id: string;
  type: 'status-change' | 'note-added' | 'step-completed' | 'reminder';
  timestamp: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface JobTrackerNotification {
  id: string;
  trackerId: string;
  type: 'reminder' | 'status-update' | 'next-step';
  message: string;
  timestamp: string;
  read: boolean;
}
