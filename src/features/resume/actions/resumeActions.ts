import { uploadResume as originalUploadResume } from '../../../actions/resume';

// Re-export the original uploadResume function
export const uploadResume = originalUploadResume;

// Note: analyzeResume and changeResumeFormat are referenced in tests
// but not found in the actual implementation. They would be added here
// when implementing those features.
