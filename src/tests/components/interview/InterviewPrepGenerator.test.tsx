import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InterviewPrepGenerator from '../../../components/interview/InterviewPrepGenerator';
import { interviewPrepService } from '../../../services/interviewPrep';
import { 
  InterviewType, 
  DifficultyLevel,
  InterviewPrepResponse
} from '../../../types/interviewPrep';

// Mock the services
vi.mock('../../../services/interviewPrep', () => ({
  interviewPrepService: {
    generateInterviewPrep: vi.fn().mockResolvedValue({
      id: 'prep123',
      userId: 'user123',
      jobTitle: 'Software Engineer',
      company: 'Test Company',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      interviewType: 'behavioral',
      difficultyLevel: 'medium',
      questions: [
        {
          id: 'q1',
          question: 'Tell me about a time you faced a challenge.',
          type: 'behavioral',
          difficultyLevel: 'medium',
          category: 'Problem Solving',
          suggestedAnswer: 'Your answer should include a specific situation...'
        }
      ],
      keySkills: ['Communication', 'Problem Solving'],
      preparationTips: ['Research the company', 'Practice your answers'],
      commonMistakes: ['Not providing specific examples'],
      suggestedTopics: ['Company culture', 'Technical skills']
    })
  }
}));

describe('InterviewPrepGenerator', () => {
  const mockUserId = 'user123';
  const mockResumeId = 'resume123';
  const mockJobDescription = 'This is a test job description';
  const mockOnPrepGenerated = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the component correctly', () => {
    render(
      <MemoryRouter>
        <InterviewPrepGenerator 
          userId={mockUserId}
          resumeId={mockResumeId}
          jobDescription={mockJobDescription}
          onPrepGenerated={mockOnPrepGenerated}
        />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Generate Interview Preparation')).toBeInTheDocument();
    expect(screen.getByText('Job Title')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    // Use getByRole instead of getByLabelText for the multiline text field
    expect(screen.getByRole('textbox', { name: /job description/i })).toBeInTheDocument();
    expect(screen.getByText('Interview Type')).toBeInTheDocument();
    expect(screen.getByText('Difficulty Level')).toBeInTheDocument();
    expect(screen.getByText('Focus Areas (Optional)')).toBeInTheDocument();
  });
  
  it('initializes with job description from props', () => {
    render(
      <MemoryRouter>
        <InterviewPrepGenerator 
          userId={mockUserId}
          resumeId={mockResumeId}
          jobDescription={mockJobDescription}
          onPrepGenerated={mockOnPrepGenerated}
        />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('textbox', { name: /job description/i })).toHaveValue(mockJobDescription);
  });
  
  it('allows adding and removing focus areas', () => {
    render(
      <MemoryRouter>
        <InterviewPrepGenerator 
          userId={mockUserId}
          resumeId={mockResumeId}
          jobDescription={mockJobDescription}
          onPrepGenerated={mockOnPrepGenerated}
        />
      </MemoryRouter>
    );
    
    // Add a focus area
    fireEvent.change(screen.getByRole('textbox', { name: /add focus area/i }), { 
      target: { value: 'Leadership' } 
    });
    fireEvent.click(screen.getByText('Add'));
    
    expect(screen.getByText('Leadership')).toBeInTheDocument();
    
    // Add another focus area
    fireEvent.change(screen.getByRole('textbox', { name: /add focus area/i }), { 
      target: { value: 'Problem Solving' } 
    });
    fireEvent.click(screen.getByText('Add'));
    
    expect(screen.getByText('Problem Solving')).toBeInTheDocument();
    
    // Remove a focus area by clicking the delete icon in the chip
    // First find all the chips
    const chips = screen.getAllByRole('button');
    // Find the Leadership chip and click its delete button
    const leadershipChip = chips.find(chip => chip.textContent?.includes('Leadership'));
    // Click the delete button within the chip
    const deleteButton = leadershipChip?.querySelector('[aria-label="delete"]');
    if (deleteButton) {
      fireEvent.click(deleteButton);
    }
    
    expect(screen.queryByText('Leadership')).not.toBeInTheDocument();
    expect(screen.getByText('Problem Solving')).toBeInTheDocument();
  });
  
  it('submits the form and generates interview prep', async () => {
    render(
      <MemoryRouter>
        <InterviewPrepGenerator 
          userId={mockUserId}
          resumeId={mockResumeId}
          jobDescription={mockJobDescription}
          onPrepGenerated={mockOnPrepGenerated}
        />
      </MemoryRouter>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByRole('textbox', { name: /job title/i }), { 
      target: { value: 'Software Engineer' } 
    });
    fireEvent.change(screen.getByRole('textbox', { name: /company/i }), { 
      target: { value: 'Test Company' } 
    });
    
    // Select interview type (Behavioral is default)
    
    // Select difficulty level (Medium is default)
    
    // Add a focus area
    fireEvent.change(screen.getByRole('textbox', { name: /add focus area/i }), { 
      target: { value: 'Leadership' } 
    });
    fireEvent.click(screen.getByText('Add'));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /generate interview prep/i }));
    
    // Verify that the service was called with the correct parameters
    await waitFor(() => {
      expect(interviewPrepService.generateInterviewPrep).toHaveBeenCalledWith({
        userId: mockUserId,
        jobDescription: mockJobDescription,
        jobTitle: 'Software Engineer',
        company: 'Test Company',
        resumeId: mockResumeId,
        interviewType: InterviewType.BEHAVIORAL,
        difficultyLevel: DifficultyLevel.MEDIUM,
        focusAreas: ['Leadership']
      });
    });
    
    // Verify that the success message is displayed
    await waitFor(() => {
      expect(screen.getByText('Interview preparation generated successfully!')).toBeInTheDocument();
    });
    
    // Verify that the onPrepGenerated callback was called
    await waitFor(() => {
      expect(mockOnPrepGenerated).toHaveBeenCalled();
    });
  });
  
  it('displays an error message when submission fails', async () => {
    // Mock the service to reject
    (interviewPrepService.generateInterviewPrep as any).mockRejectedValueOnce(new Error('API Error'));
    
    render(
      <MemoryRouter>
        <InterviewPrepGenerator 
          userId={mockUserId}
          resumeId={mockResumeId}
          jobDescription={mockJobDescription}
          onPrepGenerated={mockOnPrepGenerated}
        />
      </MemoryRouter>
    );
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /generate interview prep/i }));
    
    // Verify that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to generate interview preparation. Please try again.')).toBeInTheDocument();
    });
  });
  
  it('disables the submit button when job description is empty', () => {
    render(
      <MemoryRouter>
        <InterviewPrepGenerator 
          userId={mockUserId}
          resumeId={mockResumeId}
          jobDescription=""
          onPrepGenerated={mockOnPrepGenerated}
        />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('button', { name: /generate interview prep/i })).toBeDisabled();
  });
});
