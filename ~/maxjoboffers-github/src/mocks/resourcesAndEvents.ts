import { Resource, Event } from '../types';

export const mockResources: Resource[] = [
  {
    id: "1",
    title: "Advanced Resume Writing Techniques",
    description: "Learn how to craft a compelling resume that stands out to recruiters and passes ATS systems.",
    type: "video",
    category: "Resume Writing",
    tags: ["resume", "ats", "job search"],
    url: "/resources/resume-writing-techniques",
    thumbnailUrl: "/images/resume-writing.jpg",
    duration: 45,
    dateAdded: "2025-03-01",
    popularity: 98,
    authorName: "Sarah Wilson"
  },
  {
    id: "2",
    title: "Executive Interview Question Bank",
    description: "Comprehensive collection of interview questions specifically tailored for executive positions.",
    type: "template",
    category: "Interview Prep",
    tags: ["interview", "executive", "leadership"],
    url: "/resources/interview-question-bank",
    thumbnailUrl: "/images/interview-prep.jpg",
    dateAdded: "2025-03-05",
    popularity: 85,
    authorName: "Michael Chen"
  },
  {
    id: "3",
    title: "Networking Strategy Worksheet",
    description: "Interactive worksheet to help you plan and track your professional networking efforts.",
    type: "worksheet",
    category: "Networking",
    tags: ["networking", "career growth", "relationships"],
    url: "/resources/networking-worksheet",
    thumbnailUrl: "/images/networking.jpg",
    dateAdded: "2025-03-10",
    popularity: 75,
    authorName: "Emily Rodriguez"
  },
  {
    id: "4",
    title: "Leadership Presence in Virtual Meetings",
    description: "Expert tips on maintaining executive presence in remote and hybrid work environments.",
    type: "article",
    category: "Leadership",
    tags: ["leadership", "virtual", "communication"],
    url: "/resources/virtual-leadership",
    thumbnailUrl: "/images/virtual-leadership.jpg",
    dateAdded: "2025-03-12",
    popularity: 92,
    authorName: "David Thompson"
  }
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Executive Networking Masterclass",
    description: "Join top industry leaders for an exclusive networking session focused on building meaningful professional relationships.",
    type: "networking",
    startDate: "2025-03-20T18:00:00Z",
    endDate: "2025-03-20T20:00:00Z",
    timezone: "America/New_York",
    host: {
      name: "Jennifer Adams",
      title: "Senior Executive Coach",
      avatarUrl: "/images/hosts/jennifer-adams.jpg"
    },
    maxParticipants: 50,
    currentParticipants: 35,
    status: "upcoming",
    registrationUrl: "/events/networking-masterclass/register"
  },
  {
    id: "2",
    title: "Resume Workshop: ATS Optimization",
    description: "Learn how to optimize your executive resume for modern ATS systems while maintaining its impact for human readers.",
    type: "workshop",
    startDate: "2025-03-25T15:00:00Z",
    endDate: "2025-03-25T17:00:00Z",
    timezone: "America/New_York",
    host: {
      name: "Robert Chen",
      title: "Resume Writing Expert",
      avatarUrl: "/images/hosts/robert-chen.jpg"
    },
    maxParticipants: 30,
    currentParticipants: 28,
    status: "upcoming",
    registrationUrl: "/events/resume-workshop/register"
  },
  {
    id: "3",
    title: "Leadership in Tech: Panel Discussion",
    description: "Distinguished tech leaders share insights on navigating executive roles in the technology sector.",
    type: "webinar",
    startDate: "2025-04-01T19:00:00Z",
    endDate: "2025-04-01T20:30:00Z",
    timezone: "America/New_York",
    host: {
      name: "Maria Garcia",
      title: "Tech Leadership Coach",
      avatarUrl: "/images/hosts/maria-garcia.jpg"
    },
    maxParticipants: 100,
    currentParticipants: 45,
    status: "upcoming",
    registrationUrl: "/events/tech-leadership-panel/register"
  }
];

export const resourceCategories = [
  "Resume Writing",
  "Interview Prep",
  "Networking",
  "Leadership",
  "Career Strategy",
  "Personal Branding",
  "Negotiation",
  "Industry Insights"
];

export const resourceTypes = [
  "video",
  "article",
  "template",
  "worksheet"
] as const;

export const eventTypes = [
  "webinar",
  "workshop",
  "networking",
  "coaching"
] as const;

export const eventStatus = [
  "upcoming",
  "in-progress",
  "completed",
  "cancelled"
] as const;
