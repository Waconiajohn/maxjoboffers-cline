/**
 * Resources Feature Module
 * 
 * This module exports all resources-related components, services, and types.
 * It includes functionality for resource library and events management.
 */

// Export services
export { resourcesService } from './services/resourcesService';

// Export types
export * from './types';

// Export components
export { default as ResourceLibrary } from './components/ResourceLibrary';
