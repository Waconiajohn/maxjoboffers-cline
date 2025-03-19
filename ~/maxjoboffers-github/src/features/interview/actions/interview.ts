import S3Uploader from '../utils/s3Uploader';
import fs from 'fs';
import path from 'path';

/**
 * Upload an interview recording to S3
 * @param filePath Path to the interview recording file
 * @param userId User ID for organizing files
 * @param interviewId Interview ID for organizing files
 * @param onProgress Progress callback
 * @returns Promise resolving to the URL of the uploaded file
 */
export async function uploadInterviewRecording(
  filePath: string,
  userId: string,
  interviewId: string,
  onProgress?: (progress: { loaded?: number; total?: number }) => void
): Promise<string> {
  // Create S3 uploader instance from environment variables
  const s3Uploader = S3Uploader.fromEnv();
  
  // Validate file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Interview recording file not found: ${filePath}`);
  }
  
  // Validate file type
  const allowedTypes = ['.mp3', '.mp4', '.wav', '.webm'];
  if (!s3Uploader.validateFileType(filePath, allowedTypes)) {
    throw new Error(`Invalid recording file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  // Validate file size (100MB max)
  const maxSizeBytes = 100 * 1024 * 1024;
  if (!s3Uploader.validateFileSize(filePath, maxSizeBytes)) {
    throw new Error(`Recording file too large. Maximum size: ${maxSizeBytes / (1024 * 1024)}MB`);
  }
  
  // Generate S3 key
  const fileName = path.basename(filePath);
  const key = s3Uploader.generateKey(fileName, `interviews/${userId}/${interviewId}/recordings/`);
  
  // Upload file to S3
  try {
    const url = await s3Uploader.uploadFile(filePath, key, undefined, onProgress);
    return url;
  } catch (error) {
    console.error('Error uploading interview recording:', error);
    throw new Error(`Failed to upload interview recording: ${(error as Error).message}`);
  }
}

/**
 * Upload interview notes to S3
 * @param notesContent Notes content as a string
 * @param userId User ID for organizing files
 * @param interviewId Interview ID for organizing files
 * @returns Promise resolving to the URL of the uploaded file
 */
export async function uploadInterviewNotes(
  notesContent: string,
  userId: string,
  interviewId: string
): Promise<string> {
  // Create S3 uploader instance from environment variables
  const s3Uploader = S3Uploader.fromEnv();
  
  // Convert content to buffer
  const buffer = Buffer.from(notesContent, 'utf-8');
  
  // Generate S3 key
  const timestamp = Date.now();
  const key = `interviews/${userId}/${interviewId}/notes/${timestamp}-notes.txt`;
  
  // Upload buffer to S3
  try {
    const url = await s3Uploader.uploadBuffer(buffer, key, 'text/plain');
    return url;
  } catch (error) {
    console.error('Error uploading interview notes:', error);
    throw new Error(`Failed to upload interview notes: ${(error as Error).message}`);
  }
}

/**
 * Upload interview transcript to S3
 * @param transcriptContent Transcript content as a string
 * @param userId User ID for organizing files
 * @param interviewId Interview ID for organizing files
 * @returns Promise resolving to the URL of the uploaded file
 */
export async function uploadInterviewTranscript(
  transcriptContent: string,
  userId: string,
  interviewId: string
): Promise<string> {
  // Create S3 uploader instance from environment variables
  const s3Uploader = S3Uploader.fromEnv();
  
  // Convert content to buffer
  const buffer = Buffer.from(transcriptContent, 'utf-8');
  
  // Generate S3 key
  const timestamp = Date.now();
  const key = `interviews/${userId}/${interviewId}/transcripts/${timestamp}-transcript.txt`;
  
  // Upload buffer to S3
  try {
    const url = await s3Uploader.uploadBuffer(buffer, key, 'text/plain');
    return url;
  } catch (error) {
    console.error('Error uploading interview transcript:', error);
    throw new Error(`Failed to upload interview transcript: ${(error as Error).message}`);
  }
}

/**
 * Upload interview feedback to S3
 * @param feedbackContent Feedback content as a string
 * @param userId User ID for organizing files
 * @param interviewId Interview ID for organizing files
 * @returns Promise resolving to the URL of the uploaded file
 */
export async function uploadInterviewFeedback(
  feedbackContent: string,
  userId: string,
  interviewId: string
): Promise<string> {
  // Create S3 uploader instance from environment variables
  const s3Uploader = S3Uploader.fromEnv();
  
  // Convert content to buffer
  const buffer = Buffer.from(feedbackContent, 'utf-8');
  
  // Generate S3 key
  const timestamp = Date.now();
  const key = `interviews/${userId}/${interviewId}/feedback/${timestamp}-feedback.txt`;
  
  // Upload buffer to S3
  try {
    const url = await s3Uploader.uploadBuffer(buffer, key, 'text/plain');
    return url;
  } catch (error) {
    console.error('Error uploading interview feedback:', error);
    throw new Error(`Failed to upload interview feedback: ${(error as Error).message}`);
  }
}
