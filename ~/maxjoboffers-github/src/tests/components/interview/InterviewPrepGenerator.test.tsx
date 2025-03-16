import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InterviewPrepGenerator } from '../../../components/interview/InterviewPrepGenerator';
import { interviewPrepService } from '../../../services/interviewPrep';
import { resumeParserService } from '../../../services/resumeParser';

// Mock the services
vi.mock('../../../services/interviewPrep', () => ({
  interviewPrepService: {
    generateGuide: vi.fn().mockResolvedValue({
      id: 'guide123',
      jobId: 'job123',
      resumeId: 'resume123',
      jobTitle: 'Software Engineer',
      companyName: 'Test Company',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      companyResearch: {
        overview: 'Test Company is a leading company in its industry.',
        focusAreas: ['Area 1', 'Area 2', 'Area 3'],
        customerService: 'Test Company is known for exceptional customer service.'
      },
      competitors: [
        {
          name: 'Competitor A',
          description: 'Major player in the industry.'
        }
      ],
      growthAreas: [
        {
          title: 'Market Expansion',
          description: 'Expanding into new markets.'
        }
      ],
      risks: [
        {
          title: 'Market Volatility',
          description: 'Economic uncertainties affecting business operations.'
        }
      ],
      roleImpacts: [
        {
          title: 'Drive Innovation',
          description: 'Help drive innovation in key areas.'
        }
      ],
      questions: [
        {
          category: 'Technical Skills',
          question: 'What experience do you have?',
          answer: 'Your answer should highlight your relevant experience.'
        }
      ],
      tips: [
        {
          title: 'Research Thoroughly',
          description: 'Learn everything you can about the company.'
        }
      ]
    })
  }
}));

vi.mock('../../../services/resumeParser', () => ({
  resumeParserService: {
    parseResumeFile: vi.fn().mockResolvedValue('Parsed resume content'),
    parseResumeText: vi.fn().mockImplementation((text) => Promise.resolve(text))
  }
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('InterviewPrepGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the component correctly', () => {
    render(
      <MemoryRouter>
        <InterviewPrepGenerator />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Create Interview Guide')).toBeInTheDocument();
    expect(screen.getByText('Select Job')).toBeInTheDocument();
  });
  
  it('allows manual job entry', async () => {
    render(
      <MemoryRouter>
        <InterviewPrepGenerator />
      </MemoryRouter>
    );
    
    // Click the "Enter Manually" button
    fireEvent.click(screen.getByText('Enter Manually'));
    
    // Fill in the job details
    fireEvent.change(screen.getByLabelText('Job Title'), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText('Company Name'), { target: { value: 'Test Company' } });
    fireEvent.change(screen.getByLabelText('Job Description'), { 
      target: { value: 'We are looking for a skilled Software Engineer...' } 
    });
    
    // Continue to the next step
    fireEvent.click(screen.getByText('Continue'));
    
    // Verify that we're now on the resume step
    await waitFor(() => {
      expect(screen.getByText('Select Resume')).toBeInTheDocument();
    });
  });
  
  it('allows manual resume entry', async () => {
    render(
      <MemoryRouter>
        <InterviewPrepGenerator />
      </MemoryRouter>
    );
    
    // Click the "Enter Manually" button for job
    fireEvent.click(screen.getByText('Enter Manually'));
    
    // Fill in the job details
    fireEvent.change(screen.getByLabelText('Job Title'), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText('Company Name'), { target: { value: 'Test Company' } });
    fireEvent.change(screen.getByLabelText('Job Description'), { 
      target: { value: 'We are looking for a skilled Software Engineer...' } 
    });
    
    // Continue to the next step
    fireEvent.click(screen.getByText('Continue'));
    
    // Click the "Enter Manually" button for resume
    fireEvent.click(screen.getByText('Enter Manually'));
    
    // Fill in the resume content
    fireEvent.change(screen.getByLabelText('Resume Content'), { 
      target: { value: 'Experienced software engineer with 5+ years of experience...' } 
    });
    
    // Continue to the next step
    fireEvent.click(screen.getByText('Continue'));
    
    // Verify that we're now on the generate step
    await waitFor(() => {
      expect(screen.getByText('Generate Guide')).toBeInTheDocument();
    });
  });
  
  it('generates a guide and navigates to the view page', async () => {
    render(
      <MemoryRouter>
        <InterviewPrepGenerator />
      </MemoryRouter>
    );
    
    // Click the "Enter Manually" button for job
    fireEvent.click(screen.getByText('Enter Manually'));
    
    // Fill in the job details
    fireEvent.change(screen.getByLabelText('Job Title'), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText('Company Name'), { target: { value: 'Test Company' } });
    fireEvent.change(screen.getByLabelText('Job Description'), { 
      target: { value: 'We are looking for a skilled Software Engineer...' } 
    });
    
    // Continue to the next step
    fireEvent.click(screen.getByText('Continue'));
    
    // Click the "Enter Manually" button for resume
    fireEvent.click(screen.getByText('Enter Manually'));
    
    // Fill in the resume content
    fireEvent.change(screen.getByLabelText('Resume Content'), { 
      target: { value: 'Experienced software engineer with 5+ years of experience...' } 
    });
    
    // Continue to the next step
    fireEvent.click(screen.getByText('Continue'));
    
    // Click the "Generate Guide" button
    fireEvent.click(screen.getByText('Generate Guide'));
    
    // Verify that the service was called with the correct parameters
    await waitFor(() => {
      expect(interviewPrepService.generateGuide).toHaveBeenCalledWith({
        jobId: 'manual',
        jobTitle: 'Software Engineer',
        companyName: 'Test Company',
        jobDescription: 'We are looking for a skilled Software Engineer...',
        resumeContent: 'Experienced software engineer with 5+ years of experience...'
      });
    });
    
    // Verify that we navigate to the view page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/interview/view/guide123');
    });
  });
  
  it('handles resume file upload', async () => {
    render(
      <MemoryRouter>
        <InterviewPrepGenerator />
      </MemoryRouter>
    );
    
    // Click the "Enter Manually" button for job
    fireEvent.click(screen.getByText('Enter Manually'));
    
    // Fill in the job details
    fireEvent.change(screen.getByLabelText('Job Title'), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText('Company Name'), { target: { value: 'Test Company' } });
    fireEvent.change(screen.getByLabelText('Job Description'), { 
      target: { value: 'We are looking for a skilled Software Engineer...' } 
    });
    
    // Continue to the next step
    fireEvent.click(screen.getByText('Continue'));
    
    // Click the "Enter Manually" button for resume
    fireEvent.click(screen.getByText('Enter Manually'));
    
    // Create a mock file
    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
    
    // Upload the file
    const fileInput = screen.getByLabelText('Upload Resume');
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Verify that the resume parser service was called
    await waitFor(() => {
      expect(resumeParserService.parseResumeFile).toHaveBeenCalledWith(file);
    });
    
    // Verify that the parsed content is displayed
    await waitFor(() => {
      expect(screen.getByLabelText('Resume Content')).toHaveValue('Parsed resume content');
    });
  });
});
