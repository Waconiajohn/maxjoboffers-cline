/**
 * Dashboard Feature Module
 * 
 * This module exports all dashboard-related components, services, and types.
 */

// Export components
export { default as Dashboard } from './components/Dashboard';
export { default as ResourcesComponent } from './components/ResourcesComponent';
export { default as ResourceLibrary } from './components/ResourceLibrary';

// Export pages
export { default as DashboardPage } from './pages/DashboardPage';
export { default as ResourcesPage } from './pages/ResourcesPage';
export { default as ResourceLibraryPage } from './pages/ResourceLibraryPage';

// Export services
export * from './services/dashboardService';
export * from './services/mockDashboardData';
// Export resource services with renamed types to avoid conflicts
export { 
  fetchResources,
  fetchResourceById,
  mockResources,
  resourceCategories,
  resourceTypes
} from './services/mockResourceData';
// Re-export resource types with prefixes to avoid naming conflicts
export type { 
  Resource as ResourceItem,
  ResourceFilters as ResourceItemFilters
} from './services/mockResourceData';

// Export types
export * from './types';
