# LinkedIn Feature

This feature module provides LinkedIn content creation and networking functionality for the MaxJobOffers application.

## Overview

The LinkedIn feature helps users enhance their professional presence on LinkedIn by:

1. Generating engaging LinkedIn posts tailored to specific industries and audiences
2. Creating personalized networking strategies based on career goals
3. Managing and tracking LinkedIn content
4. Optimizing networking efforts for career advancement

## Directory Structure

```
linkedin/
├── actions/         # LinkedIn-related actions
├── components/      # UI components
├── pages/           # Page components
├── services/        # Business logic
├── types/           # TypeScript interfaces and types
├── index.ts         # Feature exports
└── README.md        # Documentation
```

## Components

- **LinkedInContent**: Component for generating and managing LinkedIn content
- **LinkedInMessageManager**: Modern Material-UI based component for creating and managing LinkedIn message templates with:
  - Template management with categorization and favorites
  - Variable substitution for personalization
  - Real-time preview with customizable variables
  - Template editor with variable insertion
  - Copy to clipboard functionality
- **LinkedInProfileBuilder**: Modern Material-UI based component for creating and managing LinkedIn profiles with:
  - Professional headline and summary editing
  - Experience management with drag-and-drop reordering
  - Education history management
  - Skills management with endorsement tracking
  - Accomplishments tracking (certifications, awards, publications, projects)
  - Recommendations management
  - Profile strength indicator
  - Real-time preview mode
  - LinkedIn export capability
- **NetworkingManager**: Modern Material-UI based component for managing professional contacts and networking events with:
  - Contact management with status indicators and tagging
  - Networking event scheduling and management
  - Virtual and in-person event support
  - Networking statistics dashboard
  - Tag-based organization system
- **LinkedInPostDetail**: Component for displaying LinkedIn post details (to be implemented)
- **NetworkingStrategyDetail**: Component for displaying networking strategy details (to be implemented)

## Actions

- **generateLinkedInPost**: Action for generating LinkedIn posts
- **generateNetworkingStrategy**: Action for generating networking strategies

## Usage

```tsx
// Import components
import { 
  LinkedInContent, 
  NetworkingManager,
  LinkedInMessageManager,
  LinkedInProfileBuilder
} from 'src/features/linkedin';

// Import pages
import { 
  LinkedInContentPage, 
  NetworkingManagerPage,
  LinkedInMessageManagerPage,
  LinkedInProfileBuilderPage
} from 'src/features/linkedin';

// Import actions
import { 
  generateLinkedInPost, 
  generateNetworkingStrategy 
} from 'src/features/linkedin';

// Import services
import {
  fetchNetworkContacts,
  fetchNetworkEvents,
  fetchNetworkStats,
  fetchLinkedInProfile,
  updateLinkedInProfile
} from 'src/features/linkedin';

// Import types
import { 
  LinkedInPost, 
  NetworkingStrategy,
  NetworkContact,
  NetworkingEvent,
  LinkedInProfile,
  Experience,
  Education,
  Skill,
  Accomplishment,
  Recommendation
} from 'src/features/linkedin';

// Use the LinkedInContent component
const ContentComponent = () => {
  return <LinkedInContent />;
};

// Use the NetworkingManager component
const NetworkingComponent = () => {
  return <NetworkingManager />;
};

// Use the LinkedInMessageManager component
const MessageComponent = () => {
  return <LinkedInMessageManager />;
};

// Use the LinkedInProfileBuilder component
const ProfileBuilderComponent = () => {
  return <LinkedInProfileBuilder />;
};

// Use the page components
const ContentPage = () => {
  return <LinkedInContentPage />;
};

const NetworkingPage = () => {
  return <NetworkingManagerPage />;
};

const MessagePage = () => {
  return <LinkedInMessageManagerPage />;
};

const ProfileBuilderPage = () => {
  return <LinkedInProfileBuilderPage />;
};
```

## Future Enhancements

- Advanced profile analytics and optimization suggestions
- Advanced message analytics and performance tracking
- AI-powered message personalization
- Content engagement analytics
- Scheduled posting functionality
- Integration with LinkedIn API
- Message sequence automation
- A/B testing for message templates
- Bulk import/export of profile data
- Resume to LinkedIn profile conversion
