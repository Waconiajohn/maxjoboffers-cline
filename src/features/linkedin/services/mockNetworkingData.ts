/**
 * Mock Networking Data Service
 * 
 * This file provides mock data for the networking manager component.
 * In a real application, this would be replaced with actual API calls.
 */

import { v4 as uuidv4 } from 'uuid';

// Types
export interface NetworkContact {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  lastContactDate: string;
  nextFollowUp?: string;
  notes: string;
  status: 'active' | 'pending' | 'inactive';
  tags: string[];
  avatarUrl?: string;
}

export interface NetworkingEvent {
  id: string;
  title: string;
  type: 'webinar' | 'conference' | 'meetup' | 'coffee_chat';
  date: string;
  location: string;
  description: string;
  attendees: number;
  maxAttendees?: number;
  isVirtual: boolean;
  status: 'upcoming' | 'in-progress' | 'completed';
  organizerId: string;
  tags: string[];
}

export interface NetworkingStats {
  totalContacts: number;
  activeContacts: number;
  pendingFollowUps: number;
  upcomingEvents: number;
  recentConnections: number;
}

// Mock data
export const mockContacts: NetworkContact[] = [
  {
    id: uuidv4(),
    name: 'Sarah Johnson',
    title: 'Senior Product Manager',
    company: 'TechCorp',
    email: 'sarah.johnson@example.com',
    phone: '555-123-4567',
    linkedIn: 'linkedin.com/in/sarahjohnson',
    lastContactDate: '2025-03-10T14:30:00Z',
    nextFollowUp: '2025-03-25T10:00:00Z',
    notes: 'Met at TechConf 2025. Interested in product management roles.',
    status: 'active',
    tags: ['product', 'tech', 'manager'],
    avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  {
    id: uuidv4(),
    name: 'Michael Chen',
    title: 'Software Engineer',
    company: 'InnovateSoft',
    email: 'michael.chen@example.com',
    linkedIn: 'linkedin.com/in/michaelchen',
    lastContactDate: '2025-02-15T09:45:00Z',
    notes: 'Referred by Sarah. Expertise in React and Node.js.',
    status: 'pending',
    tags: ['engineering', 'react', 'node'],
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: uuidv4(),
    name: 'Emily Rodriguez',
    title: 'HR Director',
    company: 'Global Enterprises',
    email: 'emily.rodriguez@example.com',
    phone: '555-987-6543',
    lastContactDate: '2025-03-05T16:15:00Z',
    nextFollowUp: '2025-04-05T11:30:00Z',
    notes: 'Connected on LinkedIn. Discussed potential job openings.',
    status: 'active',
    tags: ['hr', 'recruiting', 'director'],
    avatarUrl: 'https://randomuser.me/api/portraits/women/45.jpg'
  },
  {
    id: uuidv4(),
    name: 'David Wilson',
    title: 'CTO',
    company: 'StartupX',
    email: 'david.wilson@example.com',
    linkedIn: 'linkedin.com/in/davidwilson',
    lastContactDate: '2025-01-20T13:00:00Z',
    notes: 'Met at startup networking event. Looking for senior engineers.',
    status: 'inactive',
    tags: ['executive', 'tech', 'startup'],
    avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg'
  },
  {
    id: uuidv4(),
    name: 'Jessica Lee',
    title: 'Marketing Manager',
    company: 'BrandBoost',
    email: 'jessica.lee@example.com',
    phone: '555-234-5678',
    linkedIn: 'linkedin.com/in/jessicalee',
    lastContactDate: '2025-03-15T10:30:00Z',
    nextFollowUp: '2025-03-30T14:00:00Z',
    notes: 'Connected through mutual contact. Interested in collaboration.',
    status: 'active',
    tags: ['marketing', 'manager', 'branding'],
    avatarUrl: 'https://randomuser.me/api/portraits/women/33.jpg'
  }
];

export const mockEvents: NetworkingEvent[] = [
  {
    id: uuidv4(),
    title: 'Tech Industry Mixer',
    type: 'meetup',
    date: '2025-03-25T18:00:00Z',
    location: 'Downtown Convention Center',
    description: 'Networking event for tech professionals. Great opportunity to meet industry leaders and potential employers.',
    attendees: 45,
    maxAttendees: 75,
    isVirtual: false,
    status: 'upcoming',
    organizerId: mockContacts[0].id,
    tags: ['tech', 'networking', 'career']
  },
  {
    id: uuidv4(),
    title: 'Career Fair - Software Engineering',
    type: 'conference',
    date: '2025-04-02T10:00:00Z',
    location: 'Virtual',
    description: 'Virtual career fair focused on software engineering roles. Multiple companies will be present with job openings.',
    attendees: 120,
    maxAttendees: 200,
    isVirtual: true,
    status: 'upcoming',
    organizerId: mockContacts[2].id,
    tags: ['career fair', 'software', 'jobs']
  },
  {
    id: uuidv4(),
    title: 'Resume Workshop',
    type: 'webinar',
    date: '2025-03-28T15:00:00Z',
    location: 'Zoom',
    description: 'Learn how to optimize your resume for ATS systems and stand out to recruiters.',
    attendees: 30,
    maxAttendees: 50,
    isVirtual: true,
    status: 'upcoming',
    organizerId: mockContacts[4].id,
    tags: ['resume', 'workshop', 'career']
  },
  {
    id: uuidv4(),
    title: 'Coffee Chat with Industry Leaders',
    type: 'coffee_chat',
    date: '2025-03-20T09:00:00Z',
    location: 'Cafe Central',
    description: 'Informal coffee chat with tech industry leaders. Limited spots available.',
    attendees: 8,
    maxAttendees: 10,
    isVirtual: false,
    status: 'upcoming',
    organizerId: mockContacts[3].id,
    tags: ['networking', 'mentorship', 'leadership']
  }
];

export const mockStats: NetworkingStats = {
  totalContacts: mockContacts.length,
  activeContacts: mockContacts.filter(c => c.status === 'active').length,
  pendingFollowUps: mockContacts.filter(c => c.nextFollowUp).length,
  upcomingEvents: mockEvents.filter(e => e.status === 'upcoming').length,
  recentConnections: 3
};

/**
 * Mock API function to simulate fetching networking contacts
 * @returns Promise that resolves to the mock contacts
 */
export const fetchNetworkContacts = (): Promise<NetworkContact[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockContacts);
    }, 800);
  });
};

/**
 * Mock API function to simulate fetching networking events
 * @returns Promise that resolves to the mock events
 */
export const fetchNetworkEvents = (): Promise<NetworkingEvent[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockEvents);
    }, 600);
  });
};

/**
 * Mock API function to simulate fetching networking stats
 * @returns Promise that resolves to the mock stats
 */
export const fetchNetworkStats = (): Promise<NetworkingStats> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockStats);
    }, 500);
  });
};

/**
 * Mock API function to simulate creating a new contact
 * @param contact The contact to create
 * @returns Promise that resolves to the created contact
 */
export const createNetworkContact = (contact: Omit<NetworkContact, 'id'>): Promise<NetworkContact> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const newContact: NetworkContact = {
        ...contact,
        id: uuidv4(),
      };
      
      // In a real app, we would add this to the database
      // For this mock, we'll just return the new contact
      resolve(newContact);
    }, 1000);
  });
};

/**
 * Mock API function to simulate updating a contact
 * @param contact The contact to update
 * @returns Promise that resolves to the updated contact
 */
export const updateNetworkContact = (contact: NetworkContact): Promise<NetworkContact> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // In a real app, we would update this in the database
      // For this mock, we'll just return the updated contact
      resolve(contact);
    }, 1000);
  });
};

/**
 * Mock API function to simulate deleting a contact
 * @param id The ID of the contact to delete
 * @returns Promise that resolves to a success message
 */
export const deleteNetworkContact = (id: string): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // In a real app, we would delete this from the database
      // For this mock, we'll just return success
      resolve({ success: true });
    }, 800);
  });
};

/**
 * Mock API function to simulate creating a new event
 * @param event The event to create
 * @returns Promise that resolves to the created event
 */
export const createNetworkEvent = (event: Omit<NetworkingEvent, 'id'>): Promise<NetworkingEvent> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const newEvent: NetworkingEvent = {
        ...event,
        id: uuidv4(),
      };
      
      // In a real app, we would add this to the database
      // For this mock, we'll just return the new event
      resolve(newEvent);
    }, 1000);
  });
};

/**
 * Mock API function to simulate updating an event
 * @param event The event to update
 * @returns Promise that resolves to the updated event
 */
export const updateNetworkEvent = (event: NetworkingEvent): Promise<NetworkingEvent> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // In a real app, we would update this in the database
      // For this mock, we'll just return the updated event
      resolve(event);
    }, 1000);
  });
};

/**
 * Mock API function to simulate deleting an event
 * @param id The ID of the event to delete
 * @returns Promise that resolves to a success message
 */
export const deleteNetworkEvent = (id: string): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // In a real app, we would delete this from the database
      // For this mock, we'll just return success
      resolve({ success: true });
    }, 800);
  });
};
