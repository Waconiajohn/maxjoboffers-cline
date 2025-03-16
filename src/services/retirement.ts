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
