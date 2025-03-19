# Resources Feature

This feature module provides resource library and events functionality for the MaxJobOffers application.

## Overview

The resources feature helps users discover and engage with career development resources and events by:

1. Browsing and filtering a curated collection of resources (articles, videos, courses, etc.)
2. Saving resources for later reference
3. Tracking progress through resources
4. Discovering and registering for upcoming events
5. Managing resource collections

## Directory Structure

```
resources/
├── components/           # UI components
│   └── ResourceLibrary.tsx
├── services/             # Business logic
│   └── resourcesService.ts
├── types/                # TypeScript interfaces and types
│   └── index.ts
├── api/                  # API integration
│   └── resourcesApi.ts   # (to be implemented)
├── index.ts              # Feature exports
└── README.md             # Documentation
```

## Usage

### Resource Library

The resource library component provides a comprehensive view of available resources with filtering capabilities:

```tsx
import { ResourceLibrary } from 'src/features/resources';

// In your component
const MyComponent = () => {
  return <ResourceLibrary />;
};
```

### Resources Service

The resources service provides methods for managing resources and events:

```tsx
import { resourcesService } from 'src/features/resources';

// Get resources with filtering
const getResources = async () => {
  const resources = await resourcesService.getResources({
    categories: ['article', 'video'],
    difficulties: ['beginner'],
    featuredOnly: true
  });
  console.log(resources);
};

// Get upcoming events
const getUpcomingEvents = async () => {
  const events = await resourcesService.getUpcomingEvents(5);
  console.log(events);
};

// Save a resource for a user
const saveResource = async (userId, resourceId) => {
  await resourcesService.saveUserResourceInteraction(userId, resourceId, {
    isSaved: true
  });
};

// Register for an event
const registerForEvent = async (userId, eventId) => {
  await resourcesService.saveUserEventInteraction(userId, eventId, {
    isRegistered: true
  });
};
```

## Types

The feature exports various TypeScript types for resources and events:

- `Resource`: Represents a learning resource (article, video, course, etc.)
- `ResourceCategory`: Enum of resource categories
- `ResourceDifficulty`: Enum of resource difficulty levels
- `ResourceFilter`: Interface for filtering resources
- `Event`: Represents an event (webinar, workshop, career fair, etc.)
- `EventType`: Enum of event types
- `EventFormat`: Enum of event formats (in-person, virtual, hybrid)
- `EventFilter`: Interface for filtering events
- `ResourceCollection`: Represents a collection of related resources
- `UserResourceInteraction`: Represents a user's interaction with a resource
- `UserEventInteraction`: Represents a user's interaction with an event
- `ResourceRecommendation`: Represents resource recommendations for a user
- `EventRecommendation`: Represents event recommendations for a user

## Components

- `ResourceLibrary`: Main component for browsing and filtering resources
  - `ResourceCard`: Displays a resource card
  - `FilterPanel`: Provides filtering options for resources
  - `UpcomingEvents`: Displays upcoming events

## Services

### resourcesService

Provides methods for managing resources and events:

- `getResources(filter?)`: Get resources with optional filtering
- `getResourceById(id)`: Get a resource by ID
- `createResource(...)`: Create a new resource
- `updateResource(id, updates)`: Update a resource
- `deleteResource(id)`: Delete a resource
- `getEvents(filter?)`: Get events with optional filtering
- `getEventById(id)`: Get an event by ID
- `createEvent(...)`: Create a new event
- `updateEvent(id, updates)`: Update an event
- `deleteEvent(id)`: Delete an event
- `getResourceCollections()`: Get all resource collections
- `getResourceCollectionById(id)`: Get a resource collection by ID
- `createResourceCollection(...)`: Create a new resource collection
- `updateResourceCollection(id, updates)`: Update a resource collection
- `addResourcesToCollection(collectionId, resourceIds)`: Add resources to a collection
- `removeResourcesFromCollection(collectionId, resourceIds)`: Remove resources from a collection
- `deleteResourceCollection(id)`: Delete a resource collection
- `getUserResourceInteractions(userId)`: Get a user's resource interactions
- `getUserResourceInteraction(userId, resourceId)`: Get a specific user resource interaction
- `saveUserResourceInteraction(userId, resourceId, updates)`: Save a user resource interaction
- `deleteUserResourceInteraction(userId, resourceId)`: Delete a user resource interaction
- `getUserEventInteractions(userId)`: Get a user's event interactions
- `getUserEventInteraction(userId, eventId)`: Get a specific user event interaction
- `saveUserEventInteraction(userId, eventId, updates)`: Save a user event interaction
- `deleteUserEventInteraction(userId, eventId)`: Delete a user event interaction
- `getResourceRecommendations(userId)`: Get resource recommendations for a user
- `getEventRecommendations(userId)`: Get event recommendations for a user
- `getUpcomingEvents(limit?)`: Get upcoming events
- `getFeaturedResources(limit?)`: Get featured resources
- `getPopularResources(limit?)`: Get popular resources
- `getResourceCategoriesWithCounts()`: Get resource categories with counts
- `getEventTypesWithCounts()`: Get event types with counts

## Future Enhancements

- Resource rating and review system
- Resource progress tracking
- Event reminder notifications
- Resource sharing functionality
- Resource recommendation engine
- Event calendar view
- Resource collections management UI
- Resource content preview
