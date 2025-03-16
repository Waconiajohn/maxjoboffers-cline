import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RetirementDashboard from '../../components/retirement/RetirementDashboard';
import OnboardingForm from '../../components/retirement/OnboardingForm';
import { retirementService } from '../../services/retirement';

// Mock the retirement service
vi.mock('../../services/retirement', () => ({
  retirementService: {
    getAvailableTimeSlots: vi.fn(),
    uploadDocument: vi.fn(),
    createRetirementPlanRequest: vi.fn(),
    scheduleAppointment: vi.fn(),
    calculateIncentiveAmount: vi.fn((amount) => {
      if (amount >= 1000000) return 4000;
      if (amount >= 500000) return 3000;
      if (amount >= 250000) return 2000;
      if (amount >= 100000) return 1000;
      if (amount >= 50000) return 500;
      return 0;
    })
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
  
  it.skip('completes the full retirement planning flow', async () => {
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
      fireEvent.change(ageInput, { target: { value: '45' } });
      
      const retirementAgeInput = screen.getByLabelText('Expected Retirement Age');
      fireEvent.change(retirementAgeInput, { target: { value: '65' } });
      
      const currentSavingsInput = screen.getByLabelText('Current Retirement Savings');
      fireEvent.change(currentSavingsInput, { target: { value: '250000' } });
    });
    
    await fireEvent.click(nextButton);
    
    // Act - Step 4: Upload documents
    await waitFor(() => {
      const uploadButton = screen.getByText('Upload Documents');
      
      // Mock file upload
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText(/Upload Documents/);
      
      Object.defineProperty(fileInput, 'files', {
        value: [file]
      });
      
      fireEvent.change(fileInput);
    });
    
    await fireEvent.click(nextButton);
    
    // Act - Step 5: Schedule meeting
    await waitFor(() => {
      // Select a date
      const dateButton = screen.getByText('Select Date');
      fireEvent.click(dateButton);
      
      // Check consent
      const consentCheckbox = screen.getByLabelText(/I consent to be contacted/);
      fireEvent.click(consentCheckbox);
    });
    
    // Submit the form
    const submitButton = screen.getByText('Submit');
    await fireEvent.click(submitButton);
    
    // Wait for the service calls to be made
    await waitFor(() => {
      expect(retirementService.createRetirementPlanRequest).toHaveBeenCalled();
      expect(retirementService.uploadDocument).toHaveBeenCalled();
      expect(retirementService.scheduleAppointment).toHaveBeenCalled();
    });
    
    // Verify service calls
    expect(retirementService.createRetirementPlanRequest).toHaveBeenCalled();
    expect(retirementService.uploadDocument).toHaveBeenCalled();
    expect(retirementService.scheduleAppointment).toHaveBeenCalled();
  });
});
