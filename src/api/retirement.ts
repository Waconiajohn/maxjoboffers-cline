import { HttpError } from '../mocks/wasp-server';
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
