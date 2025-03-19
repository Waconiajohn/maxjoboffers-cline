/**
 * Mock Resource Data Service
 * 
 * This file provides mock data for the resource library component.
 * In a real application, this would be replaced with actual API calls.
 */

import { v4 as uuidv4 } from 'uuid';

// Types
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

// Constants
export const resourceCategories = [
  "Resume Writing",
  "Interview Prep",
  "Networking",
  "Leadership",
  "Career Strategy",
  "Personal Branding",
  "Negotiation",
  "Industry Insights"
];

export const resourceTypes = [
  "video",
  "article",
  "template",
  "worksheet"
];

// Mock data
export const mockResources: Resource[] = [
  {
    id: uuidv4(),
    title: "Mastering the Technical Interview",
    description: "Learn how to prepare for and excel in technical interviews with this comprehensive guide.",
    type: "video",
    category: "Interview Prep",
    tags: ["technical", "coding", "algorithms", "interview tips"],
    url: "https://example.com/resources/technical-interview",
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: 45,
    dateAdded: "2025-03-01T10:30:00Z",
    popularity: 95,
    authorName: "Sarah Johnson"
  },
  {
    id: uuidv4(),
    title: "ATS-Optimized Resume Template",
    description: "A professionally designed resume template that's optimized to pass through Applicant Tracking Systems.",
    type: "template",
    category: "Resume Writing",
    tags: ["resume", "ATS", "job application"],
    url: "https://example.com/resources/ats-resume-template",
    thumbnailUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    dateAdded: "2025-02-15T14:45:00Z",
    popularity: 87
  },
  {
    id: uuidv4(),
    title: "Effective Networking Strategies",
    description: "Discover proven networking strategies to build meaningful professional relationships and advance your career.",
    type: "article",
    category: "Networking",
    tags: ["networking", "relationships", "career growth"],
    url: "https://example.com/resources/networking-strategies",
    thumbnailUrl: "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    dateAdded: "2025-03-10T09:15:00Z",
    popularity: 82,
    authorName: "Michael Chen"
  },
  {
    id: uuidv4(),
    title: "Salary Negotiation Worksheet",
    description: "A step-by-step worksheet to help you prepare for and navigate salary negotiations with confidence.",
    type: "worksheet",
    category: "Negotiation",
    tags: ["salary", "negotiation", "compensation"],
    url: "https://example.com/resources/salary-negotiation",
    thumbnailUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    dateAdded: "2025-02-28T16:20:00Z",
    popularity: 78
  },
  {
    id: uuidv4(),
    title: "Building Your Personal Brand",
    description: "Learn how to create and cultivate a strong personal brand that sets you apart in your industry.",
    type: "video",
    category: "Personal Branding",
    tags: ["branding", "social media", "professional image"],
    url: "https://example.com/resources/personal-branding",
    thumbnailUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: 38,
    dateAdded: "2025-03-05T11:30:00Z",
    popularity: 91,
    authorName: "Emily Rodriguez"
  },
  {
    id: uuidv4(),
    title: "Leadership Skills for New Managers",
    description: "Essential leadership skills and strategies for new managers to effectively lead teams and drive results.",
    type: "article",
    category: "Leadership",
    tags: ["leadership", "management", "team building"],
    url: "https://example.com/resources/leadership-skills",
    thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    dateAdded: "2025-02-20T13:45:00Z",
    popularity: 85,
    authorName: "David Wilson"
  },
  {
    id: uuidv4(),
    title: "Career Transition Planning Template",
    description: "A comprehensive template to help you plan and execute a successful career transition.",
    type: "template",
    category: "Career Strategy",
    tags: ["career change", "planning", "transition"],
    url: "https://example.com/resources/career-transition",
    thumbnailUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    dateAdded: "2025-03-12T10:00:00Z",
    popularity: 76
  },
  {
    id: uuidv4(),
    title: "Tech Industry Trends 2025",
    description: "An in-depth analysis of current trends and future predictions for the technology industry.",
    type: "article",
    category: "Industry Insights",
    tags: ["tech", "trends", "industry analysis"],
    url: "https://example.com/resources/tech-trends-2025",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    dateAdded: "2025-01-15T09:30:00Z",
    popularity: 89,
    authorName: "Jessica Lee"
  },
  {
    id: uuidv4(),
    title: "Behavioral Interview Questions and Answers",
    description: "Prepare for behavioral interviews with this comprehensive guide to common questions and effective answers.",
    type: "video",
    category: "Interview Prep",
    tags: ["behavioral", "interview", "STAR method"],
    url: "https://example.com/resources/behavioral-interviews",
    thumbnailUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: 52,
    dateAdded: "2025-02-25T15:15:00Z",
    popularity: 93,
    authorName: "Robert Taylor"
  },
  {
    id: uuidv4(),
    title: "LinkedIn Profile Optimization Guide",
    description: "Step-by-step guide to creating a standout LinkedIn profile that attracts recruiters and opportunities.",
    type: "worksheet",
    category: "Personal Branding",
    tags: ["LinkedIn", "social media", "profile"],
    url: "https://example.com/resources/linkedin-optimization",
    thumbnailUrl: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    dateAdded: "2025-03-08T12:45:00Z",
    popularity: 84
  },
  {
    id: uuidv4(),
    title: "Remote Work Success Strategies",
    description: "Proven strategies and best practices for thriving in a remote work environment.",
    type: "article",
    category: "Career Strategy",
    tags: ["remote work", "productivity", "work-life balance"],
    url: "https://example.com/resources/remote-work",
    thumbnailUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    dateAdded: "2025-02-10T11:00:00Z",
    popularity: 88,
    authorName: "Amanda Garcia"
  },
  {
    id: uuidv4(),
    title: "Networking Email Templates",
    description: "Ready-to-use email templates for various networking scenarios to help you build professional relationships.",
    type: "template",
    category: "Networking",
    tags: ["email", "outreach", "connections"],
    url: "https://example.com/resources/networking-emails",
    thumbnailUrl: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    dateAdded: "2025-03-15T14:00:00Z",
    popularity: 79
  }
];

/**
 * Mock API function to simulate fetching resources with filters
 * @param filters The filters to apply to the resources
 * @returns Promise that resolves to the filtered resources
 */
export const fetchResources = (filters: ResourceFilters): Promise<Resource[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      let filteredResources = [...mockResources];
      
      // Apply type filter
      if (filters.type.length > 0) {
        filteredResources = filteredResources.filter(resource => 
          filters.type.includes(resource.type)
        );
      }
      
      // Apply category filter
      if (filters.category.length > 0) {
        filteredResources = filteredResources.filter(resource => 
          filters.category.includes(resource.category)
        );
      }
      
      // Apply search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredResources = filteredResources.filter(resource => 
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      resolve(filteredResources);
    }, 800);
  });
};

/**
 * Mock API function to simulate fetching a resource by ID
 * @param id The ID of the resource to fetch
 * @returns Promise that resolves to the resource with the specified ID
 */
export const fetchResourceById = (id: string): Promise<Resource | null> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const resource = mockResources.find(r => r.id === id) || null;
      resolve(resource);
    }, 500);
  });
};
