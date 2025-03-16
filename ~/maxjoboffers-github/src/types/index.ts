export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'template' | 'worksheet';
  category: string;
  tags: string[];
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  dateAdded: string;
  popularity: number;
  authorName?: string;
}

export interface ResourceFilters {
  type: string[];
  category: string[];
  searchQuery: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'webinar' | 'workshop' | 'networking' | 'coaching';
  startDate: string;
  endDate: string;
  timezone: string;
  host: {
    name: string;
    title: string;
    avatarUrl?: string;
  };
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  registrationUrl: string;
  recordingUrl?: string;
}
