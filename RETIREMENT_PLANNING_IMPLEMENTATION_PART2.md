# Retirement Planning Implementation - Part 2

Continuing from the previous implementation document, this file contains additional components and backend services needed for the retirement planning feature.

## Frontend Components (Continued)

### Meeting Scheduler Component (`src/components/retirement/MeetingScheduler.tsx`)

```tsx
import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Paper, Grid, Button, 
  FormControl, InputLabel, Select, MenuItem, 
  SelectChangeEvent, Tabs, Tab
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { format, addDays, addWeeks, startOfDay, isAfter, isBefore, isEqual } from 'date-fns';
import { retirementService } from '../../services/retirement';

interface MeetingSchedulerProps {
  onMeetingSelect: (date: Date) => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  dateTime: Date;
}

export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({ onMeetingSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  // Generate dates for the next 4 weeks for list view
  const generateDateList = () => {
    const dates: Date[] = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 28; i++) {
      const date = addDays(today, i);
      // Only include weekdays (Monday-Friday)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    
    return dates;
  };
  
  const dateList = generateDateList();
  
  // Group dates by week for tab navigation
  const weeks = [
    { label: 'This Week', dates: dateList.filter(date => isBefore(date, addWeeks(new Date(), 1))) },
    { label: 'Next Week', dates: dateList.filter(date => isAfter(date, addWeeks(new Date(), 0)) && isBefore(date, addWeeks(new Date(), 2))) },
    { label: 'In 2 Weeks', dates: dateList.filter(date => isAfter(date, addWeeks(new Date(), 1)) && isBefore(date, addWeeks(new Date(), 3))) },
    { label: 'In 3 Weeks', dates: dateList.filter(date => isAfter(date, addWeeks(new Date(), 2)) && isBefore(date, addWeeks(new Date(), 4))) },
  ];
  
  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      setSelectedTime(null);
      
      // In a real implementation, this would call an API to get available slots
      // For now, we'll simulate it with a timeout and random availability
      const fetchAvailableSlots = async () => {
        try {
          const slots = await retirementService.getAvailableTimeSlots(selectedDate);
          setAvailableTimeSlots(slots);
        } catch (error) {
          console.error('Error fetching time slots:', error);
          // Fallback to generated slots if API fails
          generateMockTimeSlots();
        } finally {
          setLoading(false);
        }
      };
      
      // Mock implementation for demo purposes
      const generateMockTimeSlots = () => {
        const slots: TimeSlot[] = [];
        const startHour = 9; // 9 AM
        const endHour = 17; // 5 PM
        
        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const dateTime = new Date(selectedDate);
            dateTime.setHours(hour, minute, 0, 0);
            
            // Random availability (70% chance of being available)
            const available = Math.random() > 0.3;
            
            slots.push({
              time: format(dateTime, 'h:mm a'),
              available,
              dateTime
            });
          }
        }
        
        setAvailableTimeSlots(slots);
      };
      
      // Use the API in production, fallback to mock for development
      if (process.env.NODE_ENV === 'production') {
        fetchAvailableSlots();
      } else {
        setTimeout(generateMockTimeSlots, 500); // Simulate API delay
      }
    }
  }, [selectedDate]);
  
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  
  const handleTimeSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTime(slot.dateTime);
      onMeetingSelect(slot.dateTime);
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleViewModeChange = (mode: 'calendar' | 'list') => {
    setViewMode(mode);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Schedule Your Retirement Planning Consultation
      </Typography>
      
      <Typography variant="body1" paragraph>
        Select a date and time for your initial 30-minute consultation with one of our retirement planning specialists.
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant={viewMode === 'calendar' ? 'contained' : 'outlined'} 
          size="small"
          onClick={() => handleViewModeChange('calendar')}
          sx={{ mr: 1 }}
        >
          Calendar View
        </Button>
        <Button 
          variant={viewMode === 'list' ? 'contained' : 'outlined'} 
          size="small"
          onClick={() => handleViewModeChange('list')}
        >
          List View
        </Button>
      </Box>
      
      {viewMode === 'calendar' ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar
                  value={selectedDate}
                  onChange={handleDateChange}
                  disablePast
                  // Disable weekends
                  shouldDisableDate={(date) => {
                    const day = date.getDay();
                    return day === 0 || day === 6;
                  }}
                />
              </LocalizationProvider>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              {selectedDate ? (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Available Times for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </Typography>
                  
                  {loading ? (
                    <Typography>Loading available times...</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {availableTimeSlots.map((slot, index) => (
                        <Button
                          key={index}
                          variant={selectedTime && isEqual(selectedTime, slot.dateTime) ? 'contained' : 'outlined'}
                          color={slot.available ? 'primary' : 'inherit'}
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot)}
                          sx={{ minWidth: '90px' }}
                        >
                          {slot.time}
                        </Button>
                      ))}
                      
                      {availableTimeSlots.length === 0 && (
                        <Typography>No available time slots for this date.</Typography>
                      )}
                    </Box>
                  )}
                </>
              ) : (
                <Typography>Please select a date to view available times.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            {weeks.map((week, index) => (
              <Tab key={index} label={week.label} />
            ))}
          </Tabs>
          
          <Grid container spacing={2}>
            {weeks[tabValue].dates.map((date, dateIndex) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dateIndex}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    bgcolor: selectedDate && isEqual(startOfDay(selectedDate), startOfDay(date)) ? 'primary.light' : 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => handleDateChange(date)}
                >
                  <Typography variant="subtitle1" align="center">
                    {format(date, 'EEEE')}
                  </Typography>
                  <Typography variant="h6" align="center">
                    {format(date, 'MMMM d')}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          {selectedDate && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Available Times for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </Typography>
              
              {loading ? (
                <Typography>Loading available times...</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableTimeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedTime && isEqual(selectedTime, slot.dateTime) ? 'contained' : 'outlined'}
                      color={slot.available ? 'primary' : 'inherit'}
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect(slot)}
                      sx={{ minWidth: '90px' }}
                    >
                      {slot.time}
                    </Button>
                  ))}
                  
                  {availableTimeSlots.length === 0 && (
                    <Typography>No available time slots for this date.</Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Paper>
      )}
      
      {selectedTime && (
        <Paper sx={{ p: 2, mt: 3, bgcolor: 'success.light' }}>
          <Typography variant="subtitle1">
            You've selected: {format(selectedTime, 'EEEE, MMMM d, yyyy')} at {format(selectedTime, 'h:mm a')}
          </Typography>
          <Typography variant="body2">
            Your consultation will be approximately 30 minutes. A retirement planning specialist will contact you to confirm this appointment.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
```

### PowerPoint Presentation Component (`src/components/retirement/PresentationViewer.tsx`)

```tsx
import React, { useState } from 'react';
import { Typography, Box, Button, Paper, MobileStepper } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

// Sample presentation slides
const slides = [
  {
    title: 'Why Retirement Planning Matters',
    content: 'Retirement planning is essential for ensuring financial security in your later years. Without proper planning, you may face challenges in maintaining your lifestyle after you stop working.',
    imageUrl: '/images/retirement/slide1.jpg',
  },
  {
    title: 'The Power of Compound Interest',
    content: 'Starting early allows your investments to grow exponentially through compound interest. Even small contributions can grow significantly over time.',
    imageUrl: '/images/retirement/slide2.jpg',
  },
  {
    title: 'Understanding Your Retirement Accounts',
    content: 'Different retirement accounts (401(k), IRA, Roth IRA) offer various tax advantages. Knowing how to optimize these accounts can save you thousands in taxes.',
    imageUrl: '/images/retirement/slide3.jpg',
  },
  {
    title: 'Creating a Retirement Income Strategy',
    content: 'Your retirement plan should include strategies for generating reliable income during retirement, including Social Security optimization, withdrawal strategies, and possibly annuities.',
    imageUrl: '/images/retirement/slide4.jpg',
  },
  {
    title: 'Our Approach to Retirement Planning',
    content: 'We take a holistic approach that considers your current financial situation, future goals, risk tolerance, and tax situation to create a personalized retirement plan.',
    imageUrl: '/images/retirement/slide5.jpg',
  },
];

export const PresentationViewer: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = slides.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Retirement Planning Essentials
      </Typography>
      
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="h6">{slides[activeStep].title}</Typography>
      </Paper>
      
      <Box
        sx={{
          height: 400,
          width: '100%',
          p: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          component="img"
          sx={{
            height: { xs: 200, md: 300 },
            width: { xs: '100%', md: '50%' },
            objectFit: 'contain',
            mb: { xs: 2, md: 0 },
            mr: { xs: 0, md: 2 },
          }}
          src={slides[activeStep].imageUrl}
          alt={slides[activeStep].title}
        />
        
        <Typography
          variant="body1"
          sx={{
            width: { xs: '100%', md: '50%' },
            p: 2,
          }}
        >
          {slides[activeStep].content}
        </Typography>
      </Box>
      
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button variant="outlined" color="primary">
          Download Full Presentation
        </Button>
      </Box>
    </Box>
  );
};
```

## Backend Services

### Retirement Service Types (`src/types/retirement.ts`)

```typescript
export interface RetirementPlanRequest {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  age: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution?: number;
  employerMatch?: number;
  hasAdvisor: boolean;
  documentIds: string[];
  appointmentDateTime: string;
}

export interface RetirementPlan {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: RetirementPlanStatus;
  appointmentDateTime: string;
  appointmentConfirmed: boolean;
  advisorId?: string;
  advisorName?: string;
  documentIds: string[];
  recommendations?: RetirementRecommendations;
}

export enum RetirementPlanStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface RetirementRecommendations {
  monthlySavingsGoal: number;
  retirementIncomeEstimate: number;
  retirementReadinessScore: number;
  investmentRecommendations: InvestmentRecommendation[];
  actionItems: ActionItem[];
  additionalNotes: string;
}

export interface InvestmentRecommendation {
  category: string;
  allocation: number;
  description: string;
}

export interface ActionItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  dateTime: Date;
}

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  fileUrl: string;
}

export interface RolloverIncentive {
  tier1Amount: number;  // $50,000 – $99,999
  tier2Amount: number;  // $100,000 – $249,999
  tier3Amount: number;  // $250,000 – $499,999
  tier4Amount: number;  // $500,000 – $999,999
  tier5Amount: number;  // $1,000,000 and above
  holdingPeriodMonths: number;
}
```

### Retirement Service (`src/services/retirement.ts`)

```typescript
import axios from 'axios';
import { 
  RetirementPlanRequest, 
  RetirementPlan, 
  TimeSlot,
  Document,
  RolloverIncentive
} from '../types/retirement';

class RetirementService {
  // Create a new retirement plan request
  async createRetirementPlanRequest(request: RetirementPlanRequest): Promise<RetirementPlan> {
    try {
      const response = await axios.post('/api/retirement/plan', request);
      return response.data;
    } catch (error) {
      console.error('Error creating retirement plan request:', error);
      throw error;
    }
  }
  
  // Get a retirement plan by ID
  async getRetirementPlan(planId: string): Promise<RetirementPlan> {
    try {
      const response = await axios.get(`/api/retirement/plan/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching retirement plan:', error);
      throw error;
    }
  }
  
  // Get all retirement plans for a user
  async getUserRetirementPlans(userId: string): Promise<RetirementPlan[]> {
    try {
      const response = await axios.get(`/api/retirement/plans/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user retirement plans:', error);
      throw error;
    }
  }
  
  // Update a retirement plan
  async updateRetirementPlan(planId: string, updates: Partial<RetirementPlan>): Promise<RetirementPlan> {
    try {
      const response = await axios.put(`/api/retirement/plan/${planId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating retirement plan:', error);
      throw error;
    }
  }
  
  // Cancel a retirement plan
  async cancelRetirementPlan(planId: string): Promise<RetirementPlan> {
    try {
      const response = await axios.post(`/api/retirement/plan/${planId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling retirement plan:', error);
      throw error;
    }
  }
  
  // Upload a document
  async uploadDocument(userId: string, file: File): Promise<Document> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      
      const response = await axios.post('/api/retirement/document/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }
  
  // Get available time slots for a date
  async getAvailableTimeSlots(date: Date): Promise<TimeSlot[]> {
    try {
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const response = await axios.get(`/api/retirement/timeslots?date=${formattedDate}`);
      
      // Convert string dates to Date objects
      return response.data.map((slot: any) => ({
        ...slot,
        dateTime: new Date(slot.dateTime)
      }));
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      throw error;
    }
  }
  
  // Schedule an appointment
  async scheduleAppointment(userId: string, dateTime: Date): Promise<{ appointmentId: string }> {
    try {
      const response = await axios.post('/api/retirement/appointment', {
        userId,
        dateTime: dateTime.toISOString()
      });
      
      return response.data;
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw error;
    }
  }
  
  // Get rollover incentive details
  async getRolloverIncentives(): Promise<RolloverIncentive> {
    try {
      const response = await axios.get('/api/retirement/incentives');
      return response.data;
    } catch (error) {
      console.error('Error fetching rollover incentives:', error);
      throw error;
    }
  }
  
  // Calculate incentive amount based on rollover amount
  calculateIncentiveAmount(rolloverAmount: number): number {
    if (rolloverAmount >= 1000000) {
      return 4000; // $1,000,000 and above
    } else if (rolloverAmount >= 500000) {
      return 3000; // $500,000 – $999,999
    } else if (rolloverAmount >= 250000) {
      return 2000; // $250,000 – $499,999
    } else if (rolloverAmount >= 100000) {
      return 1000; // $100,000 – $249,999
    } else if (rolloverAmount >= 50000) {
      return 500;  // $50,000 – $99,999
    } else {
      return 0;    // Below minimum threshold
    }
  }
}

export const retirementService = new RetirementService();
```

### API Routes (Server-side)

In a Wasp framework application, you would define the following API routes:

```typescript
// src/api/retirement.ts

import { HttpError } from 'wasp/server';
import { RetirementPlanRequest, RetirementPlan, TimeSlot } from '../types/retirement';

// Create a retirement plan request
export const createRetirementPlan = async (args: RetirementPlanRequest, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }
  
  // Implementation details for creating a retirement plan
  // This would include saving the request to the database
  // and potentially sending notifications to advisors
  
  return {
    id: 'plan123',
    userId: context.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'pending',
    appointmentDateTime: args.appointmentDateTime,
    appointmentConfirmed: false,
    documentIds: args.documentIds
  };
};

// Get available time slots
export const getAvailableTimeSlots = async (args: { date: string }, context: any) => {
  // Implementation details for fetching available time slots
  // This would typically involve checking a calendar system
  // or advisor availability database
  
  const slots: TimeSlot[] = [];
  const date = new Date(args.date);
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const dateTime = new Date(date);
      dateTime.setHours(hour, minute, 0, 0);
      
      // In a real implementation, you would check availability
      // against a database of booked appointments
      const available = Math.random() > 0.3; // Random availability for demo
      
      slots.push({
        time: `${hour}:${minute === 0 ? '00' : minute}`,
        available,
        dateTime
      });
    }
  }
  
  return slots;
};

// Upload document
export const uploadDocument = async (args: { file: any, userId: string }, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }
  
  if (context.user.id !== args.userId) {
    throw new HttpError(403, 'Not authorized to upload for this user');
  }
  
  // Implementation details for uploading a document
  // This would typically involve saving the file to S3
  // and recording the metadata in the database
  
  return {
    id: 'doc123',
    userId: args.userId,
    fileName: args.file.originalname,
    fileType: args.file.mimetype,
    fileSize: args.file.size,
    uploadDate: new Date().toISOString(),
    fileUrl: `https://example.com/files/${args.file.originalname}`
  };
};

// Schedule appointment
export const scheduleAppointment = async (args: { userId: string, dateTime: string }, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }
  
  if (context.user.id !== args.userId) {
    throw new HttpError(403, 'Not authorized to schedule for this user');
  }
  
  // Implementation details for scheduling an appointment
  // This would involve checking availability and creating
  // an appointment record in the database
  
  return {
    appointmentId: 'appt123',
    userId: args.userId,
    dateTime: args.dateTime,
    confirmed: false
  };
};
```

## Database Schema

In a Wasp application, you would define the following entities in your `main.wasp` file:

```
entity RetirementPlan {=psl
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  status      String   // pending, scheduled, in_progress, completed, cancelled
  appointmentDateTime DateTime?
  appointmentConfirmed Boolean @default(false)
  advisorId   String?
  advisorName String?
  documents   RetirementDocument[]
  recommendations RetirementRecommendations?
psl=}

entity RetirementDocument {=psl
  id          String   @id @default(uuid())
  planId      String
  plan        RetirementPlan @relation(fields: [planId], references: [id])
  fileName    String
  fileType    String
  fileSize    Int
  uploadDate  DateTime @default(now())
  fileUrl     String
psl=}

entity RetirementRecommendations {=psl
  id          String   @id @default(uuid())
  planId      String   @unique
  plan        RetirementPlan @relation(fields: [planId], references: [id])
  monthlySavingsGoal Decimal
  retirementIncomeEstimate Decimal
  retirementReadinessScore Int
  investmentRecommendations InvestmentRecommendation[]
  actionItems ActionItem[]
  additionalNotes String
psl=}

entity InvestmentRecommendation {=psl
  id          String   @id @default(uuid())
  recommendationsId String
  recommendations RetirementRecommendations @relation(fields: [recommendationsId], references: [id])
  category    String
  allocation  Decimal
  description String
psl=}

entity ActionItem {=psl
  id          String   @id @default(uuid())
  recommendationsId String
  recommendations RetirementRecommendations @relation(fields: [recommendationsId], references: [id])
  title       String
  description String
  priority    String  // high, medium, low
  completed   Boolean @default(false)
psl=}

entity Appointment {=psl
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  dateTime    DateTime
  confirmed   Boolean  @default(false)
  advisorId   String?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
psl=}
```

## Integration with Main Application

To integrate the retirement planning component with the main application, you'll need to:

1. Add a route in your routing configuration
2. Add a link in the navigation menu
3. Update the user permissions to access retirement planning features

### Routing Configuration

```typescript
// In your routing configuration file
import RetirementDashboard from '../components/retirement/RetirementDashboard';
import OnboardingForm from '../components/retirement/OnboardingForm';

const routes = [
  // ... existing routes
  {
    path: '/retirement',
    component: RetirementDashboard,
    exact: true,
    requireAuth: true
  },
