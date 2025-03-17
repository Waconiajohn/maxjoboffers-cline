import S3Uploader from '../utils/s3Uploader';
import fs from 'fs';
import path from 'path';

/**
 * Upload a resume file to S3
 * @param filePath Path to the resume file
 * @param userId User ID for organizing files
 * @param onProgress Progress callback
 * @returns Promise resolving to the URL of the uploaded file
 */
export async function uploadResume(
  filePath: string,
  userId: string,
  onProgress?: (progress: { loaded?: number; total?: number }) => void
): Promise<string> {
  // Create S3 uploader instance from environment variables
  const s3Uploader = S3Uploader.fromEnv();
  
  // Validate file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Resume file not found: ${filePath}`);
  }
  
  // Validate file type
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  if (!s3Uploader.validateFileType(filePath, allowedTypes)) {
    throw new Error(`Invalid resume file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  // Validate file size (10MB max)
  const maxSizeBytes = 10 * 1024 * 1024;
  if (!s3Uploader.validateFileSize(filePath, maxSizeBytes)) {
    throw new Error(`Resume file too large. Maximum size: ${maxSizeBytes / (1024 * 1024)}MB`);
  }
  
  // Generate S3 key
  const fileName = path.basename(filePath);
  const key = s3Uploader.generateKey(fileName, `resumes/${userId}/`);
  
  // Upload file to S3
  try {
    const url = await s3Uploader.uploadFile(filePath, key, undefined, onProgress);
    return url;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw new Error(`Failed to upload resume: ${(error as Error).message}`);
  }
}

/**
 * Upload a resume version to S3
 * @param resumeContent Resume content as a string
 * @param userId User ID for organizing files
 * @param versionName Version name or identifier
 * @returns Promise resolving to the URL of the uploaded file
 */
export async function uploadResumeVersion(
  resumeContent: string,
  userId: string,
  versionName: string
): Promise<string> {
  // Create S3 uploader instance from environment variables
  const s3Uploader = S3Uploader.fromEnv();
  
  // Convert content to buffer
  const buffer = Buffer.from(resumeContent, 'utf-8');
  
  // Generate S3 key
  const sanitizedVersionName = versionName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `resumes/${userId}/versions/${Date.now()}-${sanitizedVersionName}.txt`;
  
  // Upload buffer to S3
  try {
    const url = await s3Uploader.uploadBuffer(buffer, key, 'text/plain');
    return url;
  } catch (error) {
    console.error('Error uploading resume version:', error);
    throw new Error(`Failed to upload resume version: ${(error as Error).message}`);
  }
}

/**
 * Upload a resume image to S3
 * @param imageBuffer Image buffer
 * @param userId User ID for organizing files
 * @param fileName Original file name
 * @param contentType Content type of the image
 * @returns Promise resolving to the URL of the uploaded image
 */
export async function uploadResumeImage(
  imageBuffer: Buffer,
  userId: string,
  fileName: string,
  contentType: string
): Promise<string> {
  // Create S3 uploader instance from environment variables
  const s3Uploader = S3Uploader.fromEnv();
  
  // Generate S3 key
  const key = s3Uploader.generateKey(fileName, `resumes/${userId}/images/`);
  
  // Upload buffer to S3
  try {
    const url = await s3Uploader.uploadBuffer(imageBuffer, key, contentType);
    return url;
  } catch (error) {
    console.error('Error uploading resume image:', error);
    throw new Error(`Failed to upload resume image: ${(error as Error).message}`);
  }
}
