/**
 * Dashboard Service
 * 
 * This service provides functions for managing dashboard data and resources.
 */

import { UserStats, Activity, Resource, DashboardFilters, ResourceFilters } from '../types';

/**
 * Format date for display
 * @param dateString Date string
 * @returns Formatted date
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Format time ago for display
 * @param dateString Date string
 * @returns Formatted time ago
 */
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `${interval} year${interval === 1 ? '' : 's'} ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} month${interval === 1 ? '' : 's'} ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} day${interval === 1 ? '' : 's'} ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} hour${interval === 1 ? '' : 's'} ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} minute${interval === 1 ? '' : 's'} ago`;
  }
  
  return `${Math.floor(seconds)} second${Math.floor(seconds) === 1 ? '' : 's'} ago`;
};

/**
 * Get activity icon color based on activity type
 * @param type Activity type
 * @returns CSS color class
 */
export const getActivityIconColor = (type: Activity['type']): string => {
  switch (type) {
    case 'job':
      return 'bg-blue-100 text-blue-600';
    case 'interview':
      return 'bg-purple-100 text-purple-600';
    case 'linkedin':
      return 'bg-indigo-100 text-indigo-600';
    case 'financial':
      return 'bg-yellow-100 text-yellow-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

/**
 * Filter activities based on dashboard filters
 * @param activities List of activities
 * @param filters Dashboard filters
 * @returns Filtered activities
 */
export const filterActivities = (activities: Activity[], filters: DashboardFilters): Activity[] => {
  return activities.filter(activity => {
    // Filter by time range
    const activityDate = new Date(activity.date);
    const now = new Date();
    
    let timeRangeMatch = true;
    if (filters.timeRange === 'today') {
      timeRangeMatch = activityDate.toDateString() === now.toDateString();
    } else if (filters.timeRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      timeRangeMatch = activityDate >= weekAgo;
    } else if (filters.timeRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      timeRangeMatch = activityDate >= monthAgo;
    } else if (filters.timeRange === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      timeRangeMatch = activityDate >= yearAgo;
    }
    
    // Filter by activity type
    const typeMatch = filters.activityTypes.length === 0 || filters.activityTypes.includes(activity.type);
    
    return timeRangeMatch && typeMatch;
  });
};

/**
 * Filter resources based on resource filters
 * @param resources List of resources
 * @param filters Resource filters
 * @returns Filtered resources
 */
export const filterResources = (resources: Resource[], filters: ResourceFilters): Resource[] => {
  return resources.filter(resource => {
    // Filter by category
    const categoryMatch = !filters.category || resource.category === filters.category;
    
    // Filter by search query
    const searchMatch = !filters.searchQuery || 
      resource.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });
};

/**
 * Get unique categories from resources
 * @param resources List of resources
 * @returns Array of unique categories
 */
export const getResourceCategories = (resources: Resource[]): string[] => {
  return Array.from(new Set(resources.map(resource => resource.category)));
};

/**
 * Get resource count by category
 * @param resources List of resources
 * @returns Object with category counts
 */
export const getResourceCountByCategory = (resources: Resource[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  resources.forEach(resource => {
    if (counts[resource.category]) {
      counts[resource.category]++;
    } else {
      counts[resource.category] = 1;
    }
  });
  
  return counts;
};
