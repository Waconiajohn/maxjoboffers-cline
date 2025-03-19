# Dashboard Feature

This feature module provides a modern Material-UI based dashboard and resources functionality for the MaxJobOffers application.

## Overview

The dashboard feature serves as the central hub for users to:

1. View key statistics and metrics about their job search progress
2. Track career progress with visual indicators
3. Monitor resume ATS score and optimization status
4. View upcoming networking events and coaching sessions
5. Access personalized resource recommendations
6. Quickly navigate to important actions

## Directory Structure

```
dashboard/
├── components/      # UI components
├── pages/           # Page components
├── services/        # Business logic
├── types/           # TypeScript interfaces and types
├── index.ts         # Feature exports
└── README.md        # Documentation
```

## Components

- **Dashboard**: Modern Material-UI based dashboard with:
  - User profile header with avatar and membership tier
  - Career progress tracking with interactive progress bars
  - Resume status with ATS score visualization
  - Upcoming networking events list
  - Coaching sessions schedule
  - Recommended resources section
- **ResourcesComponent**: Component for browsing and searching career resources
- **ResourceLibrary**: Modern Material-UI based resource library with:
  - Filterable resource grid with cards
  - Search functionality
  - Category and type filtering with chips
  - Sorting by date or popularity
  - Resource details dialog
  - Bookmarking functionality
  - Loading states with skeleton placeholders
- **DashboardSkeleton**: Loading state component with skeleton placeholders
- **ErrorBoundary**: Error handling component for graceful error recovery

## Pages

- **DashboardPage**: Page component that renders the Dashboard
- **ResourcesPage**: Page component that renders the ResourcesComponent
- **ResourceLibraryPage**: Page component that renders the ResourceLibrary

## Services

The dashboard services include:

- **dashboardService**: Provides utility functions for:
  - Formatting dates and time ago
  - Filtering activities and resources
  - Getting activity icon colors
  - Categorizing resources

- **mockDashboardData**: Provides mock data for development and testing:
  - User profile information
  - Career progress metrics
  - Resume status data
  - Upcoming networking events
  - Coaching sessions
  - Recommended resources

- **mockResourceData**: Provides mock data for the resource library:
  - Resource items with metadata (videos, articles, templates, worksheets)
  - Resource categories and types
  - Functions for fetching and filtering resources

## Usage

```tsx
// Import components
import { 
  Dashboard, 
  ResourcesComponent, 
  ResourceLibrary 
} from 'src/features/dashboard';

// Import pages
import { 
  DashboardPage, 
  ResourcesPage, 
  ResourceLibraryPage 
} from 'src/features/dashboard';

// Import services
import { 
  formatDate, 
  formatTimeAgo, 
  fetchDashboardData, 
  mockDashboardData,
  fetchResources,
  resourceCategories,
  resourceTypes
} from 'src/features/dashboard';

// Import types
import { 
  DashboardData,
  ResourceItem,
  ResourceItemFilters
} from 'src/features/dashboard';

// Use the Dashboard component directly
const MyDashboardComponent = () => {
  return <Dashboard />;
};

// Use the ResourceLibrary component directly
const MyResourceLibraryComponent = () => {
  return <ResourceLibrary />;
};

// Use the page components
const MyDashboardPageComponent = () => {
  return <DashboardPage />;
};

const MyResourceLibraryPageComponent = () => {
  return <ResourceLibraryPage />;
};

// Use the mock data service in a custom component
const MyCustomDashboard = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadData = async () => {
      // Use the mock data service
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
      setLoading(false);
    };
    
    loadData();
  }, []);
  
  if (loading) return <p>Loading...</p>;
  
  return (
    <div>
      <h1>Welcome, {data.user.first_name}!</h1>
      <p>ATS Score: {data.resumeProgress.atsScore}%</p>
      {/* Render other dashboard data */}
    </div>
  );
};

// Use the resource data service in a custom component
const MyCustomResourceList = () => {
  const [resources, setResources] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadResources = async () => {
      // Use the resource data service with filters
      const resourceData = await fetchResources({
        type: ['video', 'article'],
        category: ['Resume Writing'],
        searchQuery: ''
      });
      setResources(resourceData);
      setLoading(false);
    };
    
    loadResources();
  }, []);
  
  if (loading) return <p>Loading resources...</p>;
  
  return (
    <div>
      <h2>Resume Writing Resources</h2>
      <ul>
        {resources.map(resource => (
          <li key={resource.id}>{resource.title}</li>
        ))}
      </ul>
    </div>
  );
};
```

## Future Enhancements

- Customizable dashboard widgets with drag-and-drop functionality
- Advanced data visualization with interactive charts and graphs
- Dark mode theme support with theme switching
- Real-time notifications and updates
- Animated transitions between dashboard states
- Mobile-optimized responsive design
- Accessibility improvements (ARIA support, keyboard navigation)
- Personalized resource recommendations using AI
- Activity and progress timeline with filtering options
- Goal setting and tracking with milestone celebrations
