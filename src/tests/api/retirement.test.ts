import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpError } from '../../mocks/wasp-server';
import { createRetirementPlan, getAvailableTimeSlots, uploadDocument, scheduleAppointment } from '../../api/retirement';

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
