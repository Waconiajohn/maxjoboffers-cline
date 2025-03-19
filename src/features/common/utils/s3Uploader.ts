import { Upload } from '@aws-sdk/lib-storage';
import { 
  S3Client, 
  GetObjectCommand, 
  DeleteObjectCommand,
  CompleteMultipartUploadCommandOutput
} from '@aws-sdk/client-s3';

// Define the AWS region and bucket name from environment variables
const REGION = process.env.AWS_REGION || 'us-east-1';
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284-us-east-1';

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
];

// Create an S3 client
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

/**
 * Interface for file upload parameters
 */
interface UploadParams {
  file: File | Blob;
  key: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

/**
 * Validates a file before upload
 * @param file The file to validate
 * @param contentType The content type of the file
 * @returns An error message if validation fails, null otherwise
 */
const validateFile = (file: File | Blob, contentType?: string): string | null => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds the maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
  }

  // Check file type if contentType is provided
  if (contentType && !ALLOWED_FILE_TYPES.includes(contentType)) {
    return `File type ${contentType} is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`;
  }

  return null;
};

/**
 * Uploads a file to S3
 * @param params The upload parameters
 * @returns A promise that resolves to the S3 upload result
 * @throws Error if validation fails or upload fails
 */
export const uploadFile = async (params: UploadParams): Promise<CompleteMultipartUploadCommandOutput> => {
  const { file, key, contentType, metadata } = params;

  // Validate the file
  const validationError = validateFile(file, contentType);
  if (validationError) {
    throw new Error(validationError);
  }

  try {
    // Create the upload parameters
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType || 'application/octet-stream',
      Metadata: metadata
    };

    // Create a managed upload
    const upload = new Upload({
      client: s3Client,
      params: uploadParams
    });

    // Add event listeners for progress
    upload.on('httpUploadProgress', (progress) => {
      console.log(`Upload progress: ${Math.round((progress.loaded || 0) / (progress.total || 1) * 100)}%`);
    });

    // Execute the upload
    const result = await upload.done();
    console.log('File uploaded successfully:', result.Location);
    return result;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

/**
 * Generates a URL for accessing a file from S3
 * @param key The key of the file in S3
 * @returns The S3 URL for the file
 */
export const getDownloadUrl = (key: string): string => {
  return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${encodeURIComponent(key)}`;
};

/**
 * Deletes a file from S3
 * @param key The key of the file in S3
 * @returns A promise that resolves when the file is deleted
 */
export const deleteFile = async (key: string): Promise<void> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    await s3Client.send(command);
    console.log(`File ${key} deleted successfully`);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
};
