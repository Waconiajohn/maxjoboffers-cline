/**
 * Dashboard Feature Types
 */

export interface UserStats {
  jobApplications: number;
  interviews: number;
  linkedinPosts: number;
  financialPlans: number;
  recentActivity: Activity[];
  resources: Resource[];
}

export interface Activity {
  id: string;
  type: 'job' | 'interview' | 'linkedin' | 'financial' | 'other';
  title: string;
  description: string;
  date: string;
  link: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardFilters {
  timeRange: 'today' | 'week' | 'month' | 'year' | 'all';
  activityTypes: string[];
}

export interface ResourceFilters {
  category: string | null;
  searchQuery: string;
}
