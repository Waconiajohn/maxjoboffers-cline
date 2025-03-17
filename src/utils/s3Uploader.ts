import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';

/**
 * S3Uploader - A utility class for handling file uploads to AWS S3
 *
 * This class provides methods for uploading files to S3 with proper error handling
 * progress tracking and validation.
 */
export class S3Uploader {
  private s3Client: S3Client;
  private bucket: string;

  /**
   * Constructor
   * @param region AWS region
   * @param accessKeyId AWS access key ID
   * @param secretAccessKey AWS secret access key
   * @param bucket S3 bucket name
   */
  constructor(
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucket: string
  ) {
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });

    this.bucket = bucket;
  }

  /**
   * Create an instance from environment variables
   * @returns S3Uploader instance
   */
  static fromEnv(): S3Uploader {
    const region = process.env.AWS_REGION || 'us-east-1';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucket = process.env.AWS_S3_BUCKET || 'maxjoboffers-uploads';

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials not found in environment variables');
    }

    return new S3Uploader(region, accessKeyId, secretAccessKey, bucket);
  }

  /**
   * Upload a file to S3
   * @param filePath Path to the file to upload
   * @param key S3 key (path in the bucket)
   * @param contentType Content type of the file
   * @returns Promise resolving to the upload result
   */
  async uploadFile(filePath: string, key: string, contentType?: string): Promise<any> {
    const fileStream = fs.createReadStream(filePath);
    
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: fileStream,
      ContentType: contentType || this.getContentType(filePath)
    };

    try {
      const uploader = new Upload({
        client: this.s3Client,
        params
      });

      // Track upload progress
      uploader.on('httpUploadProgress', (progress) => {
        console.log(`Upload progress: ${progress.loaded} / ${progress.total}`);
      });

      const result = await uploader.done();
      return result;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }

  /**
   * Get content type based on file extension
   * @param filePath Path to the file
   * @returns Content type string
   */
  private getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.json': 'application/json'
    };

    return contentTypes[ext] || 'application/octet-stream';
  }

  /**
   * Validate file before upload
   * @param filePath Path to the file
   * @param maxSizeBytes Maximum file size in bytes
   * @param allowedTypes Array of allowed file extensions
   * @returns True if file is valid
   */
  validateFile(filePath: string, maxSizeBytes: number, allowedTypes: string[]): boolean {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Check file size
    const stats = fs.statSync(filePath);
    if (stats.size > maxSizeBytes) {
      throw new Error(`File too large: ${stats.size} bytes (max: ${maxSizeBytes} bytes)`);
    }

    // Check file type
    const ext = path.extname(filePath).toLowerCase();
    if (allowedTypes.length > 0 && !allowedTypes.includes(ext)) {
      throw new Error(`File type not allowed: ${ext} (allowed: ${allowedTypes.join(', ')})`);
    }

    return true;
  }
}

export default S3Uploader;
