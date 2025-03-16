// Mock for wasp/server
export class HttpError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }
}

export const fileUploads = {
  uploadFile: async (file: any) => {
    return { url: 'https://example.com/file.pdf' };
  }
};
