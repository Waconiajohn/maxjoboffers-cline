/**
 * Resources Feature Types
 * 
 * This file contains all types related to resources and events functionality.
 */

/**
 * Resource category
 */
export enum ResourceCategory {
  Article = 'article',
  Video = 'video',
  Podcast = 'podcast',
  Course = 'course',
  Ebook = 'ebook',
  Template = 'template',
  Tool = 'tool',
  Community = 'community',
  Other = 'other'
}

/**
 * Resource difficulty level
 */
export enum ResourceDifficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  AllLevels = 'all_levels'
}

/**
 * Resource
 */
export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  category: ResourceCategory;
  difficulty: ResourceDifficulty;
  tags: string[];
  duration?: number; // in minutes
  author?: string;
  publishedDate?: string;
  isFeatured: boolean;
  isRecommended: boolean;
  rating: number; // 1-5
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Resource filter
 */
export interface ResourceFilter {
  categories?: ResourceCategory[];
  difficulties?: ResourceDifficulty[];
  tags?: string[];
  searchQuery?: string;
  featuredOnly?: boolean;
  recommendedOnly?: boolean;
  minRating?: number;
}

/**
 * Event type
 */
export enum EventType {
  Webinar = 'webinar',
  Workshop = 'workshop',
  Conference = 'conference',
  Networking = 'networking',
  CareerFair = 'career_fair',
  Interview = 'interview',
  Other = 'other'
}

/**
 * Event format
 */
export enum EventFormat {
  InPerson = 'in_person',
  Virtual = 'virtual',
  Hybrid = 'hybrid'
}

/**
 * Event
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  format: EventFormat;
  startDate: string;
  endDate: string;
  timezone: string;
  location?: string;
  url?: string;
  imageUrl?: string;
  organizer: string;
  isFeatured: boolean;
  isRecommended: boolean;
  tags: string[];
  maxAttendees?: number;
  currentAttendees?: number;
  price?: number;
  currency?: string;
  isRegistered?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Event filter
 */
export interface EventFilter {
  types?: EventType[];
  formats?: EventFormat[];
  tags?: string[];
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  featuredOnly?: boolean;
  recommendedOnly?: boolean;
  freeOnly?: boolean;
  registeredOnly?: boolean;
}

/**
 * Resource collection
 */
export interface ResourceCollection {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  resources: Resource[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * User resource interaction
 */
export interface UserResourceInteraction {
  userId: string;
  resourceId: string;
  isSaved: boolean;
  isCompleted: boolean;
  rating?: number;
  review?: string;
  progress?: number; // 0-100
  lastInteractedAt: string;
}

/**
 * User event interaction
 */
export interface UserEventInteraction {
  userId: string;
  eventId: string;
  isRegistered: boolean;
  isAttended: boolean;
  reminder?: string; // ISO date string
  notes?: string;
  lastInteractedAt: string;
}

/**
 * Resource recommendation
 */
export interface ResourceRecommendation {
  userId: string;
  resources: Resource[];
  reason: string;
  createdAt: string;
}

/**
 * Event recommendation
 */
export interface EventRecommendation {
  userId: string;
  events: Event[];
  reason: string;
  createdAt: string;
}
