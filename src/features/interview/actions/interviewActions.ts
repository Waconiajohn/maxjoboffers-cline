import {
  uploadInterviewRecording,
  uploadInterviewNotes,
  uploadInterviewTranscript,
  uploadInterviewFeedback
} from '../../../actions/interview';

// Re-export the original interview functions
export {
  uploadInterviewRecording,
  uploadInterviewNotes,
  uploadInterviewTranscript,
  uploadInterviewFeedback
};

// Note: createMockInterview is used in the InterviewPrep component
// but is not defined in the interview.ts file. It might be defined elsewhere
// or imported from a different module.
export const createMockInterview = (params: any) => {
  console.warn('createMockInterview is not implemented yet');
  return Promise.resolve({ id: 'mock-interview-id' });
};
