import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// Since we might not have type declarations for wasp/server, we'll define our own HttpError class
class HttpError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }
}

// Define allowed file types and size limits
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// S3 configuration from environment variables
const s3Config = {
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
};

// S3 bucket name from environment variable
const S3_BUCKET = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284';

// Create S3 client
const s3Client = new S3Client(s3Config);

/**
 * Interface for file upload options
 */
export interface S3UploadOptions {
  file: Buffer | Blob;
  fileName: string;
  contentType: string;
  path?: string;
}

/**
 * Interface for file upload result
 */
export interface S3UploadResult {
  url: string;
  key: string;
}

/**
 * Validates file type and size
 * @param contentType The file's content type
 * @param size The file's size in bytes
 */
export function validateFile(contentType: string, size: number): void {
  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(contentType)) {
    throw new HttpError(
      400,
      `Unsupported file type: ${contentType}. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
    );
  }

  // Validate file size
  if (size > MAX_FILE_SIZE) {
    throw new HttpError(
      400,
      `File too large: ${(size / (1024 * 1024)).toFixed(2)}MB. Maximum size: ${
        MAX_FILE_SIZE / (1024 * 1024)
      }MB`
    );
  }
}

/**
 * Uploads a file to S3
 * @param options Upload options
 * @returns Promise resolving to upload result
 */
export async function uploadToS3(options: S3UploadOptions): Promise<S3UploadResult> {
  const { file, fileName, contentType, path = 'uploads' } = options;

  // Generate a unique key for the file
  const timestamp = Date.now();
  const key = `${path}/${timestamp}-${fileName}`;

  try {
    // Validate file before uploading
    const size = file instanceof Blob ? file.size : file.length;
    validateFile(contentType, size);

    // Create upload parameters
    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType
    };

    // Upload file to S3 using multipart upload
    const upload = new Upload({
      client: s3Client,
      params
    });

    // Add event listeners for progress and errors
    upload.on('httpUploadProgress', (progress: { loaded: number; total: number }) => {
      console.log(`Upload progress: ${progress.loaded}/${progress.total}`);
    });

    // Complete the upload
    await upload.done();

    // Generate the URL for the uploaded file
    const url = `https://${S3_BUCKET}.s3.${s3Config.region}.amazonaws.com/${key}`;

    return { url, key };
  } catch (error: any) {
    // Handle specific AWS errors
    if (error.name === 'AccessDenied') {
      console.error('S3 access denied:', error);
      throw new HttpError(500, 'Access denied to S3 bucket. Check AWS credentials.');
    }

    if (error.name === 'NoSuchBucket') {
      console.error('S3 bucket not found:', error);
      throw new HttpError(500, `S3 bucket '${S3_BUCKET}' not found.`);
    }

    // If it's already an HttpError, rethrow it
    if (error instanceof HttpError) {
      throw error;
    }

    // Log the error for debugging
    console.error('Error uploading file to S3:', error);
    
    // Throw a generic error for other cases
    throw new HttpError(500, `Failed to upload file: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Deletes a file from S3
 * @param key The key of the file to delete
 */
export async function deleteFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key
    });

    await s3Client.send(command);
  } catch (error: any) {
    console.error('Error deleting file from S3:', error);
    throw new HttpError(500, `Failed to delete file: ${error.message || 'Unknown error'}`);
  }
}
