import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resumeParserService } from '../../services/resumeParser';

describe('ResumeParserService', () => {
  // Mock FileReader
  const mockFileReader = {
    readAsText: vi.fn(),
    readAsArrayBuffer: vi.fn(),
    onload: null as any,
    onerror: null as any
  };
  
  beforeEach(() => {
    // Mock the FileReader constructor
    global.FileReader = vi.fn(() => mockFileReader) as any;
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe('parseResumeFile', () => {
    it('should throw an error for unsupported file types', async () => {
      const file = new File(['test content'], 'test.xyz', { type: 'application/xyz' });
      
      await expect(resumeParserService.parseResumeFile(file)).rejects.toThrow(
        'Unsupported file type: application/xyz. Please upload a PDF, DOC, or DOCX file.'
      );
    });
    
    it('should parse text files correctly', async () => {
      const content = 'This is a test resume content';
      const file = new File([content], 'resume.txt', { type: 'text/plain' });
      
      const parsePromise = resumeParserService.parseResumeFile(file);
      
      // Simulate successful file read
      mockFileReader.onload = { target: { result: content } } as any;
      mockFileReader.onload(new Event('load'));
      
      const result = await parsePromise;
      expect(result).toBe(content);
      expect(mockFileReader.readAsText).toHaveBeenCalledWith(file);
    });
    
    it('should handle binary files (PDF, DOC, DOCX)', async () => {
      const file = new File(['binary content'], 'resume.pdf', { type: 'application/pdf' });
      
      const parsePromise = resumeParserService.parseResumeFile(file);
      
      // Simulate successful file read with ArrayBuffer result
      const arrayBuffer = new ArrayBuffer(10);
      mockFileReader.onload = { target: { result: arrayBuffer } } as any;
      mockFileReader.onload(new Event('load'));
      
      const result = await parsePromise;
      expect(result).toBe(`[Resume content extracted from resume.pdf]`);
      expect(mockFileReader.readAsArrayBuffer).toHaveBeenCalledWith(file);
    });
    
    it('should handle file read errors', async () => {
      const file = new File(['content'], 'resume.txt', { type: 'text/plain' });
      
      const parsePromise = resumeParserService.parseResumeFile(file);
      
      // Simulate file read error
      mockFileReader.onerror(new Event('error'));
      
      await expect(parsePromise).rejects.toThrow('Error reading file');
    });
  });
  
  describe('parseResumeText', () => {
    it('should return the input text as is', async () => {
      const text = 'This is a test resume content';
      const result = await resumeParserService.parseResumeText(text);
      expect(result).toBe(text);
    });
  });
});
