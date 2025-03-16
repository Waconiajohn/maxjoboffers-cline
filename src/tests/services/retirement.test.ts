import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { RetirementPlanStatus } from '../../types/retirement';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Import the service after mocking dependencies
import { retirementService } from '../../services/retirement';

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
