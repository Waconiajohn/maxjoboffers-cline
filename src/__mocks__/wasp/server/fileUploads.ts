// Mock types for file uploads
export interface UploadedFile {
  name: string;
  mimetype: string;
  buffer: Buffer;
  size?: number;
}

export interface UploadFileOptions {
  file: UploadedFile;
  key: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface UploadFileResult {
  url: string;
  key: string;
  contentType: string;
  metadata?: Record<string, string>;
}

// Mock implementation of uploadFile function
export const uploadFile = jest.fn(async (options: UploadFileOptions): Promise<UploadFileResult> => {
  const { file, key, contentType = file.mimetype, metadata = {} } = options;
  
  return {
    url: `https://example-bucket.s3.amazonaws.com/${key}`,
    key,
    contentType,
    metadata
  };
});

// Mock implementation of getFileUrl function
export const getFileUrl = jest.fn(async (key: string): Promise<string> => {
  return `https://example-bucket.s3.amazonaws.com/${key}`;
});

// Mock implementation of deleteFile function
export const deleteFile = jest.fn(async (key: string): Promise<void> => {
  return;
});

// Mock implementation of listFiles function
export const listFiles = jest.fn(async (prefix: string): Promise<string[]> => {
  return [`${prefix}/example-file-1.pdf`, `${prefix}/example-file-2.pdf`];
});
