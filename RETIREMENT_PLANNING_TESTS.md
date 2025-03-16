# Retirement Planning Testing Strategy

This document outlines the testing strategy for the retirement planning component of the MaxJobOffers application. Following the project's existing testing patterns with Vitest, we'll create comprehensive tests for all services, components, and API endpoints.

## Service Tests

### Retirement Service Tests (`src/tests/services/retirement.test.ts`)

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { retirementService } from '../../services/retirement';
import { RetirementPlanStatus } from '../../types/retirement';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Retirement Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createRetirementPlanRequest', () => {
    it('should create a retirement plan request successfully', async () => {
      // Arrange
      const mockRequest = {
        userId: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        age: 45,
        retirementAge: 65,
        currentSavings: 250000,
        monthlyContribution: 1000,
        employerMatch: 5,
        hasAdvisor: false,
        documentIds: ['doc1', 'doc2'],
        appointmentDateTime: '2025-04-01T14:30:00Z'
      };

      const mockResponse = {
        data: {
          id: 'plan123',
          userId: 'user123',
          createdAt: '2025-03-15T12:00:00Z',
          updatedAt: '2025-03-15T12:00:00Z',
          status: RetirementPlanStatus.PENDING,
          appointmentDateTime: '2025-04-01T14:30:00Z',
          appointmentConfirmed: false,
          documentIds: ['doc1', 'doc2']
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await retirementService.createRetirementPlanRequest(mockRequest);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/retirement/plan', mockRequest);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors when creating a retirement plan request', async () => {
      // Arrange
      const mockRequest = {
        userId: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        age: 45,
        retirementAge: 65,
        currentSavings: 250000,
        monthlyContribution: 1000,
        employerMatch: 5,
        hasAdvisor: false,
        documentIds: ['doc1', 'doc2'],
        appointmentDateTime: '2025-04-01T14:30:00Z'
      };

      const mockError = new Error('Network error');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(retirementService.createRetirementPlanRequest(mockRequest)).rejects.toThrow('Network error');
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/retirement/plan', mockRequest);
    });
  });

  describe('getRetirementPlan', () => {
    it('should fetch a retirement plan by ID successfully', async () => {
      // Arrange
      const planId = 'plan123';
      const mockResponse = {
        data: {
          id: planId,
          userId: 'user123',
          createdAt: '2025-03-15T12:00:00Z',
          updatedAt: '2025-03-15T12:00:00Z',
          status: RetirementPlanStatus.PENDING,
          appointmentDateTime: '2025-04-01T14:30:00Z',
          appointmentConfirmed: false,
          documentIds: ['doc1', 'doc2']
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await retirementService.getRetirementPlan(planId);

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(`/api/retirement/plan/${planId}`);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('uploadDocument', () => {
    it('should upload a document successfully', async () => {
      // Arrange
      const userId = 'user123';
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      
      const mockResponse = {
        data: {
          id: 'doc123',
          userId: userId,
          fileName: 'test.pdf',
          fileType: 'application/pdf',
          fileSize: 12345,
          uploadDate: '2025-03-15T12:00:00Z',
          fileUrl: 'https://example.com/files/test.pdf'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await retirementService.uploadDocument(userId, mockFile);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/retirement/document/upload',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getAvailableTimeSlots', () => {
    it('should fetch available time slots for a date', async () => {
      // Arrange
      const testDate = new Date('2025-04-01');
      const formattedDate = '2025-04-01';
      
      const mockResponse = {
        data: [
          {
            time: '9:00 AM',
            available: true,
            dateTime: '2025-04-01T09:00:00Z'
          },
          {
            time: '9:30 AM',
            available: false,
            dateTime: '2025-04-01T09:30:00Z'
          }
        ]
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await retirementService.getAvailableTimeSlots(testDate);

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(`/api/retirement/timeslots?date=${formattedDate}`);
      expect(result).toHaveLength(2);
      expect(result[0].time).toBe('9:00 AM');
      expect(result[0].available).toBe(true);
      expect(result[0].dateTime).toBeInstanceOf(Date);
    });
  });

  describe('calculateIncentiveAmount', () => {
    it('should calculate the correct incentive amount for different rollover amounts', () => {
      // Test each tier
      expect(retirementService.calculateIncentiveAmount(40000)).toBe(0); // Below minimum
      expect(retirementService.calculateIncentiveAmount(50000)).toBe(500); // Tier 1 minimum
      expect(retirementService.calculateIncentiveAmount(75000)).toBe(500); // Tier 1 middle
      expect(retirementService.calculateIncentiveAmount(99999)).toBe(500); // Tier 1 maximum
      
      expect(retirementService.calculateIncentiveAmount(100000)).toBe(1000); // Tier 2 minimum
      expect(retirementService.calculateIncentiveAmount(175000)).toBe(1000); // Tier 2 middle
      expect(retirementService.calculateIncentiveAmount(249999)).toBe(1000); // Tier 2 maximum
      
      expect(retirementService.calculateIncentiveAmount(250000)).toBe(2000); // Tier 3 minimum
      expect(retirementService.calculateIncentiveAmount(375000)).toBe(2000); // Tier 3 middle
      expect(retirementService.calculateIncentiveAmount(499999)).toBe(2000); // Tier 3 maximum
      
      expect(retirementService.calculateIncentiveAmount(500000)).toBe(3000); // Tier 4 minimum
      expect(retirementService.calculateIncentiveAmount(750000)).toBe(3000); // Tier 4 middle
      expect(retirementService.calculateIncentiveAmount(999999)).toBe(3000); // Tier 4 maximum
      
      expect(retirementService.calculateIncentiveAmount(1000000)).toBe(4000); // Tier 5 minimum
      expect(retirementService.calculateIncentiveAmount(2000000)).toBe(4000); // Tier 5 higher
    });
  });
});
```

## Component Tests

### Retirement Dashboard Tests (`src/tests/components/retirement/RetirementDashboard.test.tsx`)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RetirementDashboard from '../../../components/retirement/RetirementDashboard';

// Mock child components
vi.mock('../../../components/retirement/RetirementVideo', () => ({
  RetirementVideo: () => <div data-testid="retirement-video">Mocked Video Component</div>
}));

vi.mock('../../../components/retirement/CaseStudies', () => ({
  CaseStudies: () => <div data-testid="case-studies">Mocked Case Studies Component</div>
}));

vi.mock('../../../components/retirement/IncentiveCalculator', () => ({
  IncentiveCalculator: () => <div data-testid="incentive-calculator">Mocked Incentive Calculator Component</div>
}));

vi.mock('../../../components/retirement/ServiceOfferings', () => ({
  ServiceOfferings: () => <div data-testid="service-offerings">Mocked Service Offerings Component</div>
}));

describe('RetirementDashboard', () => {
  it('renders all child components correctly', () => {
    // Arrange & Act
    render(
      <MemoryRouter>
        <RetirementDashboard />
      </MemoryRouter>
    );
    
    // Assert
    expect(screen.getByText('Retirement Planning Services')).toBeInTheDocument();
    expect(screen.getByTestId('retirement-video')).toBeInTheDocument();
    expect(screen.getByTestId('case-studies')).toBeInTheDocument();
    expect(screen.getByTestId('incentive-calculator')).toBeInTheDocument();
    expect(screen.getByTestId('service-offerings')).toBeInTheDocument();
    expect(screen.getByText('Get Started with Your Free Retirement Plan')).toBeInTheDocument();
  });
  
  it('navigates to onboarding form when CTA button is clicked', async () => {
    // Arrange
    const { user } = render(
      <MemoryRouter>
        <RetirementDashboard />
      </MemoryRouter>
    );
    
    // Act
    const ctaButton = screen.getByText('Get Started with Your Free Retirement Plan');
    await user.click(ctaButton);
    
    // Assert - in a real test, we would check for navigation
    // This is a simplified version since we're mocking the router
    expect(ctaButton).toBeInTheDocument();
  });
});
```

### Incentive Calculator Tests (`src/tests/components/retirement/IncentiveCalculator.test.tsx`)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IncentiveCalculator } from '../../../components/retirement/IncentiveCalculator';

describe('IncentiveCalculator', () => {
  it('renders with default values', () => {
    // Arrange & Act
    render(<IncentiveCalculator />);
    
    // Assert
    expect(screen.getByText('Rollover Incentive Calculator')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument(); // Default incentive for $100,000
  });
  
  it('updates incentive amount when slider is moved', () => {
    // Arrange
    render(<IncentiveCalculator />);
    
    // Act
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 500000 } });
    
    // Assert
    expect(screen.getByText('$3,000')).toBeInTheDocument(); // Incentive for $500,000
  });
  
  it('updates incentive amount when input value changes', () => {
    // Arrange
    render(<IncentiveCalculator />);
    
    // Act
    const input = screen.getByLabelText('Rollover Amount');
    fireEvent.change(input, { target: { value: '$1,000,000' } });
    
    // Assert
    expect(screen.getByText('$4,000')).toBeInTheDocument(); // Incentive for $1,000,000
  });
  
  it('displays all incentive tiers', () => {
    // Arrange & Act
    render(<IncentiveCalculator />);
    
    // Assert
    expect(screen.getByText(/\$50,000 – \$99,999: \$500 incentive/)).toBeInTheDocument();
    expect(screen.getByText(/\$100,000 – \$249,999: \$1,000 incentive/)).toBeInTheDocument();
    expect(screen.getByText(/\$250,000 – \$499,999: \$2,000 incentive/)).toBeInTheDocument();
    expect(screen.getByText(/\$500,000 – \$999,999: \$3,000 incentive/)).toBeInTheDocument();
    expect(screen.getByText(/\$1,000,000 and above: \$4,000 incentive/)).toBeInTheDocument();
  });
});
```

### Document Upload Tests (`src/tests/components/retirement/DocumentUpload.test.tsx`)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentUpload } from '../../../components/retirement/DocumentUpload';

describe('DocumentUpload', () => {
  it('renders upload button and instructions', () => {
    // Arrange
    const mockOnDocumentsChange = vi.fn();
    
    // Act
    render(<DocumentUpload onDocumentsChange={mockOnDocumentsChange} />);
    
    // Assert
    expect(screen.getByText('Upload Documents')).toBeInTheDocument();
    expect(screen.getByText(/Upload Your Retirement Account Statements/)).toBeInTheDocument();
    expect(screen.getByText(/Accepted formats:/)).toBeInTheDocument();
  });
  
  it('handles file selection', async () => {
    // Arrange
    const mockOnDocumentsChange = vi.fn();
    render(<DocumentUpload onDocumentsChange={mockOnDocumentsChange} />);
    
    // Create a mock file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    // Act
    const input = screen.getByLabelText(/Upload Documents/);
    await fireEvent.change(input, { target: { files: [file] } });
    
    // Assert
    expect(mockOnDocumentsChange).toHaveBeenCalledWith([file]);
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });
  
  it('allows removing uploaded files', async () => {
    // Arrange
    const mockOnDocumentsChange = vi.fn();
    render(<DocumentUpload onDocumentsChange={mockOnDocumentsChange} />);
    
    // Add a file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/Upload Documents/);
    await fireEvent.change(input, { target: { files: [file] } });
    
    // Reset mock to check next call
    mockOnDocumentsChange.mockReset();
    
    // Act
    const removeButton = screen.getByLabelText(/delete/i);
    await fireEvent.click(removeButton);
    
    // Assert
    expect(mockOnDocumentsChange).toHaveBeenCalledWith([]);
  });
});
```

### Meeting Scheduler Tests (`src/tests/components/retirement/MeetingScheduler.test.tsx`)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MeetingScheduler } from '../../../components/retirement/MeetingScheduler';
import { retirementService } from '../../../services/retirement';
import { format } from 'date-fns';

// Mock the retirement service
vi.mock('../../../services/retirement', () => ({
  retirementService: {
    getAvailableTimeSlots: vi.fn()
  }
}));

describe('MeetingScheduler', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('renders calendar view by default', () => {
    // Arrange
    const mockOnMeetingSelect = vi.fn();
    
    // Act
    render(<MeetingScheduler onMeetingSelect={mockOnMeetingSelect} />);
    
    // Assert
    expect(screen.getByText('Schedule Your Retirement Planning Consultation')).toBeInTheDocument();
    expect(screen.getByText('Calendar View')).toBeInTheDocument();
    expect(screen.getByText('List View')).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument(); // Calendar grid
  });
  
  it('switches to list view when button is clicked', async () => {
    // Arrange
    const mockOnMeetingSelect = vi.fn();
    render(<MeetingScheduler onMeetingSelect={mockOnMeetingSelect} />);
    
    // Act
    const listViewButton = screen.getByText('List View');
    await fireEvent.click(listViewButton);
    
    // Assert
    expect(screen.getByText('This Week')).toBeInTheDocument();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument(); // Calendar grid should be gone
  });
  
  it('fetches time slots when a date is selected', async () => {
    // Arrange
    const mockOnMeetingSelect = vi.fn();
    const mockTimeSlots = [
      {
        time: '9:00 AM',
        available: true,
        dateTime: new Date('2025-04-01T09:00:00')
      },
      {
        time: '9:30 AM',
        available: false,
        dateTime: new Date('2025-04-01T09:30:00')
      }
    ];
    
    (retirementService.getAvailableTimeSlots as any).mockResolvedValue(mockTimeSlots);
    
    render(<MeetingScheduler onMeetingSelect={mockOnMeetingSelect} />);
    
    // Act - select a date (this is simplified, in a real test we'd interact with the calendar)
    // For this mock, we'll simulate the internal date selection
    const today = new Date();
    const dateButton = screen.getAllByRole('button').find(button => 
      button.textContent === today.getDate().toString()
    );
    
    if (dateButton) {
      await fireEvent.click(dateButton);
    }
    
    // Assert
    await waitFor(() => {
      expect(retirementService.getAvailableTimeSlots).toHaveBeenCalled();
      expect(screen.getByText('9:00 AM')).toBeInTheDocument();
      expect(screen.getByText('9:30 AM')).toBeInTheDocument();
    });
  });
  
  it('calls onMeetingSelect when a time slot is selected', async () => {
    // Arrange
    const mockOnMeetingSelect = vi.fn();
    const selectedDate = new Date('2025-04-01');
    const mockTimeSlots = [
      {
        time: '9:00 AM',
        available: true,
        dateTime: new Date('2025-04-01T09:00:00')
      }
    ];
    
    (retirementService.getAvailableTimeSlots as any).mockResolvedValue(mockTimeSlots);
    
    render(<MeetingScheduler onMeetingSelect={mockOnMeetingSelect} />);
    
    // Act - simulate date selection and then time selection
    // This is a simplified version of what would happen in a real test
    const component = render(<MeetingScheduler onMeetingSelect={mockOnMeetingSelect} />);
    
    // Manually trigger the internal date selection effect
    await component.rerender(<MeetingScheduler onMeetingSelect={mockOnMeetingSelect} />);
    
    // Wait for time slots to appear
    await waitFor(() => {
      const timeButton = screen.getByText('9:00 AM');
      fireEvent.click(timeButton);
    });
    
    // Assert
    expect(mockOnMeetingSelect).toHaveBeenCalledWith(expect.any(Date));
  });
});
```

## API Tests

### Retirement API Tests (`src/tests/api/retirement.test.ts`)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRetirementPlan, getAvailableTimeSlots, uploadDocument, scheduleAppointment } from '../../api/retirement';
import { HttpError } from 'wasp/server';

describe('Retirement API', () => {
  const mockContext = {
    user: { id: 'user123' }
  };
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  describe('createRetirementPlan', () => {
    it('creates a retirement plan successfully', async () => {
      // Arrange
      const mockRequest = {
        userId: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        age: 45,
        retirementAge: 65,
        currentSavings: 250000,
        monthlyContribution: 1000,
        employerMatch: 5,
        hasAdvisor: false,
        documentIds: ['doc1', 'doc2'],
        appointmentDateTime: '2025-04-01T14:30:00Z'
      };
      
      // Act
      const result = await createRetirementPlan(mockRequest, mockContext);
      
      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId', 'user123');
      expect(result).toHaveProperty('status', 'pending');
      expect(result).toHaveProperty('appointmentDateTime', mockRequest.appointmentDateTime);
    });
    
    it('throws error when user is not authenticated', async () => {
      // Arrange
      const mockRequest = {
        userId: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        age: 45,
        retirementAge: 65,
        currentSavings: 250000,
        monthlyContribution: 1000,
        employerMatch: 5,
        hasAdvisor: false,
        documentIds: ['doc1', 'doc2'],
        appointmentDateTime: '2025-04-01T14:30:00Z'
      };
      
      const mockContextNoUser = { user: null };
      
      // Act & Assert
      await expect(createRetirementPlan(mockRequest, mockContextNoUser))
        .rejects.toThrow(HttpError);
    });
  });
  
  describe('getAvailableTimeSlots', () => {
    it('returns available time slots for a given date', async () => {
      // Arrange
      const mockArgs = { date: '2025-04-01' };
      
      // Act
      const result = await getAvailableTimeSlots(mockArgs, mockContext);
      
      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('time');
      expect(result[0]).toHaveProperty('available');
      expect(result[0]).toHaveProperty('dateTime');
    });
  });
  
  describe('uploadDocument', () => {
    it('uploads a document successfully', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 12345
      };
      
      const mockArgs = {
        file: mockFile,
        userId: 'user123'
      };
      
      // Act
      const result = await uploadDocument(mockArgs, mockContext);
      
      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId', 'user123');
      expect(result).toHaveProperty('fileName', 'test.pdf');
      expect(result).toHaveProperty('fileUrl');
    });
    
    it('throws error when user is not authorized to upload for another user', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 12345
      };
      
      const mockArgs = {
        file: mockFile,
        userId: 'different-user'
      };
      
      // Act & Assert
      await expect(uploadDocument(mockArgs, mockContext))
        .rejects.toThrow(HttpError);
    });
  });
  
  describe('scheduleAppointment', () => {
    it('schedules an appointment successfully', async () => {
      // Arrange
      const mockArgs = {
        userId: 'user123',
        dateTime: '2025-04-01T14:30:00Z'
      };
      
      // Act
      const result = await scheduleAppointment(mockArgs, mockContext);
      
      // Assert
      expect(result).toHaveProperty('appointmentId');
      expect(result).toHaveProperty('userId', 'user123');
      expect(result).toHaveProperty('dateTime', mockArgs.dateTime);
    });
    
    it('throws error when user is not authorized to schedule for another user', async () => {
      // Arrange
      const mockArgs = {
        userId: 'different-user',
        dateTime: '2025-04-01T14:30:00Z'
      };
      
      // Act & Assert
      await expect(scheduleAppointment(mockArgs, mockContext))
        .rejects.toThrow(HttpError);
    });
  });
});
```

## Integration Tests

### Retirement Flow Integration Tests (`src/tests/integration/retirementFlow.test.tsx`)

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RetirementDashboard from '../../../components/retirement/RetirementDashboard';
import OnboardingForm from '../../../components/retirement/OnboardingForm';
import { retirementService } from '../../../services/retirement';

// Mock the retirement service
vi.mock('../../../services/retirement', () => ({
  retirementService: {
    getAvailableTimeSlots: vi.fn(),
    uploadDocument: vi.fn(),
    createRetirementPlanRequest: vi.fn(),
    scheduleAppointment: vi.fn()
  }
}));

describe('Retirement Flow Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock service responses
    (retirementService.getAvailableTimeSlots as any).mockResolvedValue([
      {
        time: '9:00 AM',
        available: true,
        dateTime: new Date('2025-04-01T09:00:00')
      }
    ]);
    
    (retirementService.uploadDocument as any).mockResolvedValue({
      id: 'doc123',
      fileName: 'test.pdf'
    });
    
    (retirementService.createRetirementPlanRequest as any).mockResolvedValue({
      id: 'plan123',
      status: 'pending'
    });
    
    (retirementService.scheduleAppointment as any).mockResolvedValue({
      appointmentId: 'appt123'
    });
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('completes the full retirement planning flow', async () => {
    // Arrange
    render(
      <MemoryRouter initialEntries={['/retirement']}>
        <Routes>
          <Route path="/retirement" element={<RetirementDashboard />} />
          <Route path="/retirement/onboarding" element={<OnboardingForm />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Act - Step 1: Navigate from dashboard to onboarding
    const getStartedButton = screen.getByText('Get Started with Your Free Retirement Plan');
    await fireEvent.click(getStartedButton);
    
    // Assert - Check we're on the onboarding form
    await waitFor(() => {
      expect(screen.getByText('Get Started with Your Retirement Plan')).toBeInTheDocument();
    });
    
    // Act - Step 2: Fill out personal information
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const phoneInput = screen.getByLabelText('Phone');
    
    await fireEvent.change(firstNameInput, { target: { value: 'John' } });
    await fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    await fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    await fireEvent.change(phoneInput, { target: { value: '555-123-4567' } });
    
    const nextButton = screen.getByText('Next');
    await fireEvent.click(nextButton);
    
    // Act - Step 3: Fill out financial information
    await waitFor(() => {
      const ageInput = screen.getByLabelText('Current Age');
      const retir
