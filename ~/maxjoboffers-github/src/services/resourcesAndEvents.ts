import { Resource, ResourceFilters, Event } from '../types';

const API_BASE_URL = '/api';

export const resourceService = {
  async getResources(filters: ResourceFilters): Promise<Resource[]> {
    const queryParams = new URLSearchParams();
    if (filters.type.length) queryParams.set('types', filters.type.join(','));
    if (filters.category.length) queryParams.set('categories', filters.category.join(','));
    if (filters.searchQuery) queryParams.set('search', filters.searchQuery);

    const response = await fetch(`${API_BASE_URL}/resources?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }
    return response.json();
  },

  async getResourceDetails(id: string): Promise<Resource> {
    const response = await fetch(`${API_BASE_URL}/resources/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch resource details');
    }
    return response.json();
  }
};

export const eventService = {
  async getUpcomingEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events/upcoming`);
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming events');
    }
    return response.json();
  },

  async registerForEvent(eventId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to register for event');
    }
  },

  async cancelEventRegistration(eventId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/cancel`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to cancel event registration');
    }
  }
};
