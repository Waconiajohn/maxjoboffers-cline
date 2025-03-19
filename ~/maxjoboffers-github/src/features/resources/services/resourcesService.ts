import { v4 as uuidv4 } from 'uuid';
import {
  Resource,
  ResourceCategory,
  ResourceDifficulty,
  ResourceFilter,
  Event,
  EventType,
  EventFormat,
  EventFilter,
  ResourceCollection,
  UserResourceInteraction,
  UserEventInteraction,
  ResourceRecommendation,
  EventRecommendation
} from '../types';

/**
 * Service for handling resources and events functionality
 */
class ResourcesService {
  private resources: Resource[] = [];
  private events: Event[] = [];
  private collections: ResourceCollection[] = [];
  private userResourceInteractions: UserResourceInteraction[] = [];
  private userEventInteractions: UserEventInteraction[] = [];
  private resourceRecommendations: ResourceRecommendation[] = [];
  private eventRecommendations: EventRecommendation[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Get all resources
   */
  async getResources(filter?: ResourceFilter): Promise<Resource[]> {
    let filteredResources = [...this.resources];

    if (filter) {
      if (filter.categories && filter.categories.length > 0) {
        filteredResources = filteredResources.filter(resource => 
          filter.categories!.includes(resource.category)
        );
      }

      if (filter.difficulties && filter.difficulties.length > 0) {
        filteredResources = filteredResources.filter(resource => 
          filter.difficulties!.includes(resource.difficulty)
        );
      }

      if (filter.tags && filter.tags.length > 0) {
        filteredResources = filteredResources.filter(resource => 
          filter.tags!.some(tag => resource.tags.includes(tag))
        );
      }

      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        filteredResources = filteredResources.filter(resource => 
          resource.title.toLowerCase().includes(query) || 
          resource.description.toLowerCase().includes(query) ||
          resource.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      if (filter.featuredOnly) {
        filteredResources = filteredResources.filter(resource => resource.isFeatured);
      }

      if (filter.recommendedOnly) {
        filteredResources = filteredResources.filter(resource => resource.isRecommended);
      }

      if (filter.minRating) {
        filteredResources = filteredResources.filter(resource => resource.rating >= filter.minRating!);
      }
    }

    return filteredResources;
  }

  /**
   * Get a resource by ID
   */
  async getResourceById(id: string): Promise<Resource | null> {
    const resource = this.resources.find(r => r.id === id);
    return resource || null;
  }

  /**
   * Create a new resource
   */
  async createResource(
    title: string,
    description: string,
    url: string,
    category: ResourceCategory,
    difficulty: ResourceDifficulty,
    tags: string[],
    imageUrl?: string,
    duration?: number,
    author?: string,
    publishedDate?: string
  ): Promise<Resource> {
    const now = new Date().toISOString();
    
    const newResource: Resource = {
      id: uuidv4(),
      title,
      description,
      url,
      imageUrl,
      category,
      difficulty,
      tags,
      duration,
      author,
      publishedDate,
      isFeatured: false,
      isRecommended: false,
      rating: 0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now
    };

    this.resources.push(newResource);
    return newResource;
  }

  /**
   * Update a resource
   */
  async updateResource(
    id: string,
    updates: Partial<Omit<Resource, 'id' | 'createdAt'>>
  ): Promise<Resource | null> {
    const resourceIndex = this.resources.findIndex(r => r.id === id);
    if (resourceIndex === -1) return null;

    this.resources[resourceIndex] = {
      ...this.resources[resourceIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.resources[resourceIndex];
  }

  /**
   * Delete a resource
   */
  async deleteResource(id: string): Promise<boolean> {
    const initialLength = this.resources.length;
    this.resources = this.resources.filter(r => r.id !== id);
    
    // Also remove from collections
    this.collections.forEach(collection => {
      collection.resources = collection.resources.filter(r => r.id !== id);
    });
    
    // Also remove interactions
    this.userResourceInteractions = this.userResourceInteractions.filter(
      interaction => interaction.resourceId !== id
    );
    
    return initialLength > this.resources.length;
  }

  /**
   * Get all events
   */
  async getEvents(filter?: EventFilter): Promise<Event[]> {
    let filteredEvents = [...this.events];

    if (filter) {
      if (filter.types && filter.types.length > 0) {
        filteredEvents = filteredEvents.filter(event => 
          filter.types!.includes(event.type)
        );
      }

      if (filter.formats && filter.formats.length > 0) {
        filteredEvents = filteredEvents.filter(event => 
          filter.formats!.includes(event.format)
        );
      }

      if (filter.tags && filter.tags.length > 0) {
        filteredEvents = filteredEvents.filter(event => 
          filter.tags!.some(tag => event.tags.includes(tag))
        );
      }

      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(query) || 
          event.description.toLowerCase().includes(query) ||
          event.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      if (filter.startDate) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.startDate) >= new Date(filter.startDate!)
        );
      }

      if (filter.endDate) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.endDate) <= new Date(filter.endDate!)
        );
      }

      if (filter.featuredOnly) {
        filteredEvents = filteredEvents.filter(event => event.isFeatured);
      }

      if (filter.recommendedOnly) {
        filteredEvents = filteredEvents.filter(event => event.isRecommended);
      }

      if (filter.freeOnly) {
        filteredEvents = filteredEvents.filter(event => !event.price || event.price === 0);
      }

      if (filter.registeredOnly) {
        filteredEvents = filteredEvents.filter(event => event.isRegistered);
      }
    }

    return filteredEvents;
  }

  /**
   * Get an event by ID
   */
  async getEventById(id: string): Promise<Event | null> {
    const event = this.events.find(e => e.id === id);
    return event || null;
  }

  /**
   * Create a new event
   */
  async createEvent(
    title: string,
    description: string,
    type: EventType,
    format: EventFormat,
    startDate: string,
    endDate: string,
    timezone: string,
    organizer: string,
    tags: string[],
    location?: string,
    url?: string,
    imageUrl?: string,
    maxAttendees?: number,
    price?: number,
    currency?: string
  ): Promise<Event> {
    const now = new Date().toISOString();
    
    const newEvent: Event = {
      id: uuidv4(),
      title,
      description,
      type,
      format,
      startDate,
      endDate,
      timezone,
      location,
      url,
      imageUrl,
      organizer,
      isFeatured: false,
      isRecommended: false,
      tags,
      maxAttendees,
      currentAttendees: 0,
      price,
      currency,
      isRegistered: false,
      createdAt: now,
      updatedAt: now
    };

    this.events.push(newEvent);
    return newEvent;
  }

  /**
   * Update an event
   */
  async updateEvent(
    id: string,
    updates: Partial<Omit<Event, 'id' | 'createdAt'>>
  ): Promise<Event | null> {
    const eventIndex = this.events.findIndex(e => e.id === id);
    if (eventIndex === -1) return null;

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.events[eventIndex];
  }

  /**
   * Delete an event
   */
  async deleteEvent(id: string): Promise<boolean> {
    const initialLength = this.events.length;
    this.events = this.events.filter(e => e.id !== id);
    
    // Also remove interactions
    this.userEventInteractions = this.userEventInteractions.filter(
      interaction => interaction.eventId !== id
    );
    
    return initialLength > this.events.length;
  }

  /**
   * Get all resource collections
   */
  async getResourceCollections(): Promise<ResourceCollection[]> {
    return this.collections;
  }

  /**
   * Get a resource collection by ID
   */
  async getResourceCollectionById(id: string): Promise<ResourceCollection | null> {
    const collection = this.collections.find(c => c.id === id);
    return collection || null;
  }

  /**
   * Create a new resource collection
   */
  async createResourceCollection(
    title: string,
    description: string,
    resourceIds: string[],
    imageUrl?: string
  ): Promise<ResourceCollection | null> {
    const resources = this.resources.filter(r => resourceIds.includes(r.id));
    if (resources.length === 0) return null;
    
    const now = new Date().toISOString();
    
    const newCollection: ResourceCollection = {
      id: uuidv4(),
      title,
      description,
      imageUrl,
      resources,
      isFeatured: false,
      createdAt: now,
      updatedAt: now
    };

    this.collections.push(newCollection);
    return newCollection;
  }

  /**
   * Update a resource collection
   */
  async updateResourceCollection(
    id: string,
    updates: Partial<Omit<ResourceCollection, 'id' | 'resources' | 'createdAt'>>
  ): Promise<ResourceCollection | null> {
    const collectionIndex = this.collections.findIndex(c => c.id === id);
    if (collectionIndex === -1) return null;

    this.collections[collectionIndex] = {
      ...this.collections[collectionIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.collections[collectionIndex];
  }

  /**
   * Add resources to a collection
   */
  async addResourcesToCollection(
    collectionId: string,
    resourceIds: string[]
  ): Promise<ResourceCollection | null> {
    const collectionIndex = this.collections.findIndex(c => c.id === collectionId);
    if (collectionIndex === -1) return null;

    const resources = this.resources.filter(r => resourceIds.includes(r.id));
    if (resources.length === 0) return null;
    
    // Add only resources that aren't already in the collection
    const existingResourceIds = this.collections[collectionIndex].resources.map(r => r.id);
    const newResources = resources.filter(r => !existingResourceIds.includes(r.id));
    
    this.collections[collectionIndex] = {
      ...this.collections[collectionIndex],
      resources: [...this.collections[collectionIndex].resources, ...newResources],
      updatedAt: new Date().toISOString()
    };

    return this.collections[collectionIndex];
  }

  /**
   * Remove resources from a collection
   */
  async removeResourcesFromCollection(
    collectionId: string,
    resourceIds: string[]
  ): Promise<ResourceCollection | null> {
    const collectionIndex = this.collections.findIndex(c => c.id === collectionId);
    if (collectionIndex === -1) return null;
    
    this.collections[collectionIndex] = {
      ...this.collections[collectionIndex],
      resources: this.collections[collectionIndex].resources.filter(
        r => !resourceIds.includes(r.id)
      ),
      updatedAt: new Date().toISOString()
    };

    return this.collections[collectionIndex];
  }

  /**
   * Delete a resource collection
   */
  async deleteResourceCollection(id: string): Promise<boolean> {
    const initialLength = this.collections.length;
    this.collections = this.collections.filter(c => c.id !== id);
    return initialLength > this.collections.length;
  }

  /**
   * Get user resource interactions
   */
  async getUserResourceInteractions(userId: string): Promise<UserResourceInteraction[]> {
    return this.userResourceInteractions.filter(interaction => interaction.userId === userId);
  }

  /**
   * Get user resource interaction
   */
  async getUserResourceInteraction(
    userId: string,
    resourceId: string
  ): Promise<UserResourceInteraction | null> {
    const interaction = this.userResourceInteractions.find(
      i => i.userId === userId && i.resourceId === resourceId
    );
    return interaction || null;
  }

  /**
   * Create or update user resource interaction
   */
  async saveUserResourceInteraction(
    userId: string,
    resourceId: string,
    updates: Partial<Omit<UserResourceInteraction, 'userId' | 'resourceId'>>
  ): Promise<UserResourceInteraction | null> {
    const resource = this.resources.find(r => r.id === resourceId);
    if (!resource) return null;
    
    const interactionIndex = this.userResourceInteractions.findIndex(
      i => i.userId === userId && i.resourceId === resourceId
    );
    
    if (interactionIndex === -1) {
      // Create new interaction
      const newInteraction: UserResourceInteraction = {
        userId,
        resourceId,
        isSaved: false,
        isCompleted: false,
        lastInteractedAt: new Date().toISOString(),
        ...updates
      };
      
      this.userResourceInteractions.push(newInteraction);
      return newInteraction;
    } else {
      // Update existing interaction
      this.userResourceInteractions[interactionIndex] = {
        ...this.userResourceInteractions[interactionIndex],
        ...updates,
        lastInteractedAt: new Date().toISOString()
      };
      
      return this.userResourceInteractions[interactionIndex];
    }
  }

  /**
   * Delete user resource interaction
   */
  async deleteUserResourceInteraction(
    userId: string,
    resourceId: string
  ): Promise<boolean> {
    const initialLength = this.userResourceInteractions.length;
    this.userResourceInteractions = this.userResourceInteractions.filter(
      i => !(i.userId === userId && i.resourceId === resourceId)
    );
    return initialLength > this.userResourceInteractions.length;
  }

  /**
   * Get user event interactions
   */
  async getUserEventInteractions(userId: string): Promise<UserEventInteraction[]> {
    return this.userEventInteractions.filter(interaction => interaction.userId === userId);
  }

  /**
   * Get user event interaction
   */
  async getUserEventInteraction(
    userId: string,
    eventId: string
  ): Promise<UserEventInteraction | null> {
    const interaction = this.userEventInteractions.find(
      i => i.userId === userId && i.eventId === eventId
    );
    return interaction || null;
  }

  /**
   * Create or update user event interaction
   */
  async saveUserEventInteraction(
    userId: string,
    eventId: string,
    updates: Partial<Omit<UserEventInteraction, 'userId' | 'eventId'>>
  ): Promise<UserEventInteraction | null> {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return null;
    
    const interactionIndex = this.userEventInteractions.findIndex(
      i => i.userId === userId && i.eventId === eventId
    );
    
    if (interactionIndex === -1) {
      // Create new interaction
      const newInteraction: UserEventInteraction = {
        userId,
        eventId,
        isRegistered: false,
        isAttended: false,
        lastInteractedAt: new Date().toISOString(),
        ...updates
      };
      
      this.userEventInteractions.push(newInteraction);
      
      // Update event registration status
      if (newInteraction.isRegistered) {
        const eventIndex = this.events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
          this.events[eventIndex] = {
            ...this.events[eventIndex],
            isRegistered: true,
            currentAttendees: (this.events[eventIndex].currentAttendees || 0) + 1
          };
        }
      }
      
      return newInteraction;
    } else {
      // Update existing interaction
      const wasRegistered = this.userEventInteractions[interactionIndex].isRegistered;
      
      this.userEventInteractions[interactionIndex] = {
        ...this.userEventInteractions[interactionIndex],
        ...updates,
        lastInteractedAt: new Date().toISOString()
      };
      
      // Update event registration status if changed
      if (!wasRegistered && this.userEventInteractions[interactionIndex].isRegistered) {
        const eventIndex = this.events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
          this.events[eventIndex] = {
            ...this.events[eventIndex],
            isRegistered: true,
            currentAttendees: (this.events[eventIndex].currentAttendees || 0) + 1
          };
        }
      } else if (wasRegistered && !this.userEventInteractions[interactionIndex].isRegistered) {
        const eventIndex = this.events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
          const currentAttendees = (this.events[eventIndex].currentAttendees || 1) - 1;
          this.events[eventIndex] = {
            ...this.events[eventIndex],
            currentAttendees
          };
        }
      }
      
      return this.userEventInteractions[interactionIndex];
    }
  }

  /**
   * Delete user event interaction
   */
  async deleteUserEventInteraction(
    userId: string,
    eventId: string
  ): Promise<boolean> {
    const interaction = this.userEventInteractions.find(
      i => i.userId === userId && i.eventId === eventId
    );
    
    if (interaction && interaction.isRegistered) {
      // Update event registration count
      const eventIndex = this.events.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        const currentAttendees = (this.events[eventIndex].currentAttendees || 1) - 1;
        this.events[eventIndex] = {
          ...this.events[eventIndex],
          currentAttendees
        };
      }
    }
    
    const initialLength = this.userEventInteractions.length;
    this.userEventInteractions = this.userEventInteractions.filter(
      i => !(i.userId === userId && i.eventId === eventId)
    );
    return initialLength > this.userEventInteractions.length;
  }

  /**
   * Get resource recommendations for a user
   */
  async getResourceRecommendations(userId: string): Promise<ResourceRecommendation[]> {
    return this.resourceRecommendations.filter(rec => rec.userId === userId);
  }

  /**
   * Get event recommendations for a user
   */
  async getEventRecommendations(userId: string): Promise<EventRecommendation[]> {
    return this.eventRecommendations.filter(rec => rec.userId === userId);
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit: number = 5): Promise<Event[]> {
    const now = new Date();
    
    return this.events
      .filter(event => new Date(event.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, limit);
  }

  /**
   * Get featured resources
   */
  async getFeaturedResources(limit: number = 5): Promise<Resource[]> {
    return this.resources
      .filter(resource => resource.isFeatured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * Get popular resources
   */
  async getPopularResources(limit: number = 5): Promise<Resource[]> {
    return this.resources
      .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
      .slice(0, limit);
  }

  /**
   * Get resource categories with counts
   */
  async getResourceCategoriesWithCounts(): Promise<{ category: ResourceCategory; count: number }[]> {
    const categories = Object.values(ResourceCategory);
    
    return categories.map(category => ({
      category,
      count: this.resources.filter(r => r.category === category).length
    }));
  }

  /**
   * Get event types with counts
   */
  async getEventTypesWithCounts(): Promise<{ type: EventType; count: number }[]> {
    const types = Object.values(EventType);
    
    return types.map(type => ({
      type,
      count: this.events.filter(e => e.type === type).length
    }));
  }

  /**
   * Initialize mock data for development and testing
   */
  private initializeMockData() {
    // Mock resources
    this.resources = [
      {
        id: uuidv4(),
        title: 'Resume Writing Guide',
        description: 'A comprehensive guide to writing an effective resume that gets you noticed by recruiters.',
        url: 'https://example.com/resume-guide',
        imageUrl: 'https://example.com/images/resume-guide.jpg',
        category: ResourceCategory.Article,
        difficulty: ResourceDifficulty.Beginner,
        tags: ['resume', 'job search', 'career'],
        duration: 15,
        author: 'Career Experts',
        publishedDate: '2025-01-15T00:00:00Z',
        isFeatured: true,
        isRecommended: true,
        rating: 4.8,
        reviewCount: 125,
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z'
      },
      {
        id: uuidv4(),
        title: 'Interview Preparation Masterclass',
        description: 'Learn how to prepare for and ace your job interviews with confidence.',
        url: 'https://example.com/interview-masterclass',
        imageUrl: 'https://example.com/images/interview-masterclass.jpg',
        category: ResourceCategory.Course,
        difficulty: ResourceDifficulty.Intermediate,
        tags: ['interview', 'job search', 'career'],
        duration: 120,
        author: 'Interview Pros',
        publishedDate: '2025-01-20T00:00:00Z',
        isFeatured: true,
        isRecommended: true,
        rating: 4.9,
        reviewCount: 87,
        createdAt: '2025-01-20T00:00:00Z',
        updatedAt: '2025-01-20T00:00:00Z'
      },
      {
        id: uuidv4(),
        title: 'Networking Strategies for Job Seekers',
        description: 'Effective networking strategies to help you find hidden job opportunities.',
        url: 'https://example.com/networking-strategies',
        imageUrl: 'https://example.com/images/networking.jpg',
        category: ResourceCategory.Video,
        difficulty: ResourceDifficulty.Beginner,
        tags: ['networking', 'job search', 'career'],
        duration: 45,
        author: 'Networking Academy',
        publishedDate: '2025-01-25T00:00:00Z',
        isFeatured: false,
        isRecommended: true,
        rating: 4.6,
        reviewCount: 62,
        createdAt: '2025-01-25T00:00:00Z',
        updatedAt: '2025-01-25T00:00:00Z'
      }
    ];

    // Mock events
    this.events = [
      {
        id: uuidv4(),
        title: 'Tech Career Fair',
        description: 'Connect with top tech companies hiring for various roles.',
        type: EventType.CareerFair,
        format: EventFormat.Virtual,
        startDate: '2025-04-15T09:00:00Z',
        endDate: '2025-04-15T17:00:00Z',
        timezone: 'America/New_York',
        url: 'https://example.com/tech-career-fair',
        imageUrl: 'https://example.com/images/tech-career-fair.jpg',
        organizer: 'Tech Recruiters Network',
        isFeatured: true,
        isRecommended: true,
        tags: ['tech', 'career fair', 'job search'],
        maxAttendees: 500,
        currentAttendees: 320,
        price: 0,
        currency: 'USD',
        isRegistered: false,
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z'
      },
      {
        id: uuidv4(),
        title: 'Resume Review Workshop',
        description: 'Get your resume reviewed by professional recruiters and career coaches.',
        type: EventType.Workshop,
        format: EventFormat.Virtual,
        startDate: '2025-03-20T18:00:00Z',
        endDate: '2025-03-20T20:00:00Z',
        timezone: 'America/New_York',
        url: 'https://example.com/resume-workshop',
        imageUrl: 'https://example.com/images/resume-workshop.jpg',
        organizer: 'Career Development Center',
        isFeatured: true,
        isRecommended: true,
        tags: ['resume', 'workshop', 'job search'],
        maxAttendees: 50,
        currentAttendees: 35,
        price: 25,
        currency: 'USD',
        isRegistered: false,
        createdAt: '2025-01-20T00:00:00Z',
        updatedAt: '2025-01-20T00:00:00Z'
      },
      {
        id: uuidv4(),
        title: 'Networking for Introverts',
        description: 'Learn effective networking strategies tailored for introverts.',
        type: EventType.Webinar,
        format: EventFormat.Virtual,
        startDate: '2025-03-25T19:00:00Z',
        endDate: '2025-03-25T20:30:00Z',
        timezone: 'America/New_York',
        url: 'https://example.com/networking-introverts',
        imageUrl: 'https://example.com/images/networking-introverts.jpg',
        organizer: 'Career Confidence Coaches',
        isFeatured: false,
        isRecommended: true,
        tags: ['networking', 'webinar', 'introverts'],
        maxAttendees: 100,
        currentAttendees: 65,
        price: 15,
        currency: 'USD',
        isRegistered: false,
        createdAt: '2025-01-25T00:00:00Z',
        updatedAt: '2025-01-25T00:00:00Z'
      }
    ];

    // Mock collections
    this.collections = [
      {
        id: uuidv4(),
        title: 'Job Search Essentials',
        description: 'Essential resources for your job search journey.',
        imageUrl: 'https://example.com/images/job-search-essentials.jpg',
        resources: this.resources.slice(0, 2),
        isFeatured: true,
        createdAt: '2025-01-30T00:00:00Z',
        updatedAt: '2025-01-30T00:00:00Z'
      }
    ];

    // Mock user resource interactions
    this.userResourceInteractions = [
      {
        userId: 'user-1',
        resourceId: this.resources[0].id,
        isSaved: true,
        isCompleted: true,
        rating: 5,
        review: 'Excellent resource! Helped me improve my resume significantly.',
        progress: 100,
        lastInteractedAt: '2025-02-01T00:00:00Z'
      }
    ];

    // Mock user event interactions
    this.userEventInteractions = [
      {
        userId: 'user-1',
        eventId: this.events[0].id,
        isRegistered: true,
        isAttended: false,
        reminder: '2025-04-14T09:00:00Z',
        notes: 'Prepare questions for tech companies',
        lastInteractedAt: '2025-02-01T00:00:00Z'
      }
    ];

    // Update event registration status
    const eventIndex = this.events.findIndex(e => e.id === this.events[0].id);
    if (eventIndex !== -1) {
      this.events[eventIndex] = {
        ...this.events[eventIndex],
        isRegistered: true
      };
    }

    // Mock resource recommendations
    this.resourceRecommendations = [
      {
        userId: 'user-1',
        resources: this.resources.slice(1, 3),
        reason: 'Based on your interest in job search resources',
        createdAt: '2025-02-05T00:00:00Z'
      }
    ];

    // Mock event recommendations
    this.eventRecommendations = [
      {
        userId: 'user-1',
        events: this.events.slice(1, 3),
        reason: 'Based on your interest in career development events',
        createdAt: '2025-02-05T00:00:00Z'
      }
    ];
  }
}

export const resourcesService = new ResourcesService();
