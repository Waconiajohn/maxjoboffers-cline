import { type UploadedFile } from 'wasp/server/fileUploads';
import { HttpError } from 'wasp/server';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Parses the content of a resume file
 * @param file The uploaded resume file
 * @returns The parsed content as a string
 */
export async function parseResumeContent(file: UploadedFile): Promise<string> {
  try {
    // Check file type
    if (file.mimetype === 'application/pdf') {
      return await parsePdfResume(file);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await parseDocxResume(file);
    } else {
      throw new HttpError(400, 'Unsupported file type. Please upload a PDF or DOCX file.');
    }
  } catch (error: any) {
    console.error('Error parsing resume:', error);
    throw new HttpError(500, 'Failed to parse resume: ' + error.message);
  }
}

/**
 * Parses a PDF resume file
 * @param file The uploaded PDF file
 * @returns The parsed content as a string
 */
async function parsePdfResume(file: UploadedFile): Promise<string> {
  // In a real implementation, you would use a PDF parsing library
  // For this example, we'll use OpenAI to extract text from the PDF
  
  try {
    // Convert file buffer to base64
    const base64File = file.buffer.toString('base64');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract all text content from this resume PDF. Include all sections, bullet points, and formatting. Return only the extracted text content." },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${base64File}`,
              },
            },
          ],
        },
      ],
      max_tokens: 4096,
    });
    
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error parsing PDF with OpenAI:', error);
    throw new Error('Failed to parse PDF resume');
  }
}

/**
 * Parses a DOCX resume file
 * @param file The uploaded DOCX file
 * @returns The parsed content as a string
 */
async function parseDocxResume(file: UploadedFile): Promise<string> {
  // In a real implementation, you would use a DOCX parsing library
  // For this example, we'll use OpenAI to extract text from the DOCX
  
  try {
    // Convert file buffer to base64
    const base64File = file.buffer.toString('base64');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract all text content from this resume DOCX. Include all sections, bullet points, and formatting. Return only the extracted text content." },
            {
              type: "image_url",
              image_url: {
                url: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64File}`,
              },
            },
          ],
        },
      ],
      max_tokens: 4096,
    });
    
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error parsing DOCX with OpenAI:', error);
    throw new Error('Failed to parse DOCX resume');
  }
}

/**
 * Extracts key information from a resume
 * @param content The parsed resume content
 * @returns Structured resume information
 */
export async function extractResumeInfo(content: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert resume parser. Extract structured information from the resume text."
        },
        {
          role: "user",
          content: `Extract key information from this resume: ${content}`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "extractResumeInfo",
            description: "Extracts structured information from a resume",
            parameters: {
              type: "object",
              properties: {
                contactInfo: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" },
                    location: { type: "string" }
                  }
                },
                summary: { type: "string" },
                skills: {
                  type: "array",
                  items: { type: "string" }
                },
                experience: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      company: { type: "string" },
                      location: { type: "string" },
                      startDate: { type: "string" },
                      endDate: { type: "string" },
                      description: { type: "string" }
                    }
                  }
                },
                education: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      degree: { type: "string" },
                      institution: { type: "string" },
                      location: { type: "string" },
                      graduationDate: { type: "string" }
                    }
                  }
                },
                certifications: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["contactInfo", "skills", "experience", "education"]
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "extractResumeInfo" }
      }
    });
    
    const infoArgs = response.choices[0]?.message?.tool_calls?.[0]?.function.arguments;
    if (!infoArgs) {
      throw new Error('Failed to extract resume information');
    }
    
    return JSON.parse(infoArgs);
  } catch (error) {
    console.error('Error extracting resume info:', error);
    throw new Error('Failed to extract resume information');
  }
}
