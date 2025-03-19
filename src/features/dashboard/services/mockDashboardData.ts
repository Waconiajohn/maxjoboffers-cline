/**
 * Mock Dashboard Data Service
 * 
 * This file provides mock data for the dashboard component.
 * In a real application, this would be replaced with actual API calls.
 */

export const mockDashboardData = {
  user: {
    first_name: "John",
    last_name: "Doe",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    membership_tier: "Professional"
  },
  careerProgress: {
    goalsCompleted: 7,
    totalGoals: 10,
    metrics: {
      resumesCreated: 3,
      connectionsBuilt: 24,
      interviewsPracticed: 5
    }
  },
  resumeProgress: {
    atsScore: 85,
    lastOptimized: "2025-03-10T14:30:00Z"
  },
  networking: {
    upcomingEvents: [
      {
        title: "Tech Industry Mixer",
        date: "2025-03-25T18:00:00Z",
        type: "Networking",
        participants: 45
      },
      {
        title: "Career Fair - Software Engineering",
        date: "2025-04-02T10:00:00Z",
        type: "Career Fair",
        participants: 120
      },
      {
        title: "Resume Workshop",
        date: "2025-03-28T15:00:00Z",
        type: "Workshop",
        participants: 30
      }
    ]
  },
  coaching: {
    upcomingSessions: [
      {
        coachName: "Sarah Johnson",
        date: "2025-03-22T13:00:00Z",
        focus: "Interview Preparation",
        duration: 60
      },
      {
        coachName: "Michael Chen",
        date: "2025-03-29T11:00:00Z",
        focus: "Salary Negotiation",
        duration: 45
      }
    ]
  },
  resources: {
    recommendedContent: [
      {
        title: "Mastering Technical Interviews",
        type: "Article",
        relevanceScore: 95
      },
      {
        title: "Networking for Introverts",
        type: "Video",
        relevanceScore: 88
      },
      {
        title: "Resume Keywords for Tech Roles",
        type: "Guide",
        relevanceScore: 92
      },
      {
        title: "Effective LinkedIn Profiles",
        type: "Webinar",
        relevanceScore: 85
      }
    ]
  }
};

/**
 * Mock API function to simulate fetching dashboard data
 * @returns Promise that resolves to the mock dashboard data
 */
export const fetchDashboardData = () => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockDashboardData);
    }, 1000);
  });
};
