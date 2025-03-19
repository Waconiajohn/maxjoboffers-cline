import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Input,
  IconButton
} from '@mui/material';
import {
  Work as WorkIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  ArrowForward as ArrowForwardIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { interviewPrepService } from '../../services/interviewPrep';
import { jobSearchService } from '../../services/jobSearch';
import { resumeParserService } from '../../services/resumeParser';
import { InterviewPrepGenerationParams } from '../../types/interviewPrep';
import { JobListing } from '../../types/jobSearch';

/**
 * Interview Prep Generator Component
 * 
 * This component allows users to create new interview preparation guides.
 */
export const InterviewPrepGenerator: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    type: 'info'
  });
  
  // Form state
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [manualJobTitle, setManualJobTitle] = useState<string>('');
  const [manualCompanyName, setManualCompanyName] = useState<string>('');
  const [manualJobDescription, setManualJobDescription] = useState<string>('');
  const [manualResumeContent, setManualResumeContent] = useState<string>('');
  const [useManualEntry, setUseManualEntry] = useState<boolean>(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [isParsingResume, setIsParsingResume] = useState<boolean>(false);
  
  // Data for dropdowns
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);
  const [savedResumes, setSavedResumes] = useState<{ id: string; name: string }[]>([]);
  
  const navigate = useNavigate();
  
  // Load saved jobs and resumes on component mount
  useEffect(() => {
    loadSavedJobs();
    loadSavedResumes();
  }, []);
  
  const loadSavedJobs = async () => {
    try {
      // In a real implementation, this would fetch from the job tracking service
      // For now, we'll use mock data
      const jobs = [
        {
          id: 'job1',
          title: 'Software Engineer',
          company: 'Tech Innovations Inc.',
          location: 'San Francisco, CA',
          description: 'We are looking for a skilled Software Engineer to join our team...',
          requirements: ['5+ years of experience', 'JavaScript expertise', 'React knowledge'],
          skills: ['JavaScript', 'React', 'Node.js'],
          industry: 'Technology'
        },
        {
          id: 'job2',
          title: 'Product Manager',
          company: 'Digital Solutions',
          location: 'New York, NY',
          description: 'Seeking an experienced Product Manager to lead our product development...',
          requirements: ['3+ years in product management', 'Agile methodology', 'Technical background'],
          skills: ['Product Strategy', 'Agile', 'User Research'],
          industry: 'Software'
        }
      ];
      
      setSavedJobs(jobs as JobListing[]);
    } catch (err) {
      console.error('Error loading saved jobs:', err);
      setError('Failed to load saved jobs. Please try again.');
    }
  };
  
  const loadSavedResumes = async () => {
    try {
      // In a real implementation, this would fetch from the resume service
      // For now, we'll use mock data
      const resumes = [
        { id: 'resume1', name: 'Software Developer Resume' },
        { id: 'resume2', name: 'Product Manager Resume' }
      ];
      
      setSavedResumes(resumes);
    } catch (err) {
      console.error('Error loading saved resumes:', err);
      setError('Failed to load saved resumes. Please try again.');
    }
  };
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleToggleManualEntry = () => {
    setUseManualEntry(!useManualEntry);
  };
  
  const handleJobSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedJobId(event.target.value as string);
  };
  
  const handleResumeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedResumeId(event.target.value as string);
  };
  
  const handleGenerateGuide = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let params: InterviewPrepGenerationParams;
      
      if (useManualEntry) {
        // Use manually entered data
        params = {
          jobId: 'manual',
          jobTitle: manualJobTitle,
          companyName: manualCompanyName,
          jobDescription: manualJobDescription,
          resumeContent: manualResumeContent
        };
      } else {
        // Use selected job and resume
        if (!selectedJobId) {
          setError('Please select a job');
          setIsLoading(false);
          return;
        }
        
        const selectedJob = savedJobs.find(job => job.id === selectedJobId);
        
        if (!selectedJob) {
          setError('Selected job not found');
          setIsLoading(false);
          return;
        }
        
        params = {
          jobId: selectedJobId,
          resumeId: selectedResumeId,
          jobTitle: selectedJob.title,
          companyName: selectedJob.company,
          jobDescription: selectedJob.description
        };
      }
      
      const guide = await interviewPrepService.generateGuide(params);
      
      setNotification({
        open: true,
        message: 'Interview guide generated successfully',
        type: 'success'
      });
      
      // Navigate to the view page for the new guide
      navigate(`/interview/view/${guide.id}`);
    } catch (err) {
      console.error('Error generating guide:', err);
      setError('Failed to generate interview guide. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/interview');
  };
  
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  const handleResumeFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) {
        return;
      }
      
      const file = files[0];
      setResumeFile(file);
      setResumeFileName(file.name);
      setIsParsingResume(true);
      setError(null);
      
      try {
        // Parse the resume file
        const content = await resumeParserService.parseResumeFile(file);
        
        // Set the parsed content
        setManualResumeContent(content);
        
        setNotification({
          open: true,
          message: 'Resume parsed successfully',
          type: 'success'
        });
      } catch (err) {
        console.error('Error parsing resume file:', err);
        setError('Failed to parse resume file. Please try again or enter the content manually.');
        setResumeFile(null);
        setResumeFileName('');
      } finally {
        setIsParsingResume(false);
      }
    } catch (err) {
      console.error('Error handling resume file upload:', err);
      setError('An error occurred while handling the resume file. Please try again.');
      setIsParsingResume(false);
    }
  };
  
  const handleClearResumeFile = () => {
    setResumeFile(null);
    setResumeFileName('');
    // Keep the parsed content in case the user wants to edit it
  };
  
  const steps = [
    {
      label: 'Select Job',
      description: 'Choose a job from your saved jobs or enter job details manually.',
      content: (
        <Box sx={{ mt: 2 }}>
          <Button
            variant={useManualEntry ? 'outlined' : 'contained'}
            color="primary"
            onClick={() => setUseManualEntry(false)}
            sx={{ mr: 2, mb: 2 }}
          >
            Use Saved Job
          </Button>
          <Button
            variant={useManualEntry ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setUseManualEntry(true)}
            sx={{ mb: 2 }}
          >
            Enter Manually
          </Button>
          
          {useManualEntry ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={manualJobTitle}
                  onChange={(e) => setManualJobTitle(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={manualCompanyName}
                  onChange={(e) => setManualCompanyName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  value={manualJobDescription}
                  onChange={(e) => setManualJobDescription(e.target.value)}
                  multiline
                  rows={6}
                  required
                />
              </Grid>
            </Grid>
          ) : (
            <FormControl fullWidth>
              <InputLabel id="job-select-label">Select Job</InputLabel>
              <Select
                labelId="job-select-label"
                value={selectedJobId}
                onChange={handleJobSelect}
                label="Select Job"
              >
                {savedJobs.map((job) => (
                  <MenuItem key={job.id} value={job.id}>
                    {job.title} at {job.company}
                  </MenuItem>
                ))}
              </Select>
              
              {selectedJobId && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Selected Job Details
                  </Typography>
                  {(() => {
                    const job = savedJobs.find(j => j.id === selectedJobId);
                    return job ? (
                      <Card variant="outlined" sx={{ mt: 1 }}>
                        <CardContent>
                          <Typography variant="h6">{job.title}</Typography>
                          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            {job.company}
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {job.description.substring(0, 200)}...
                          </Typography>
                        </CardContent>
                      </Card>
                    ) : null;
                  })()}
                </Box>
              )}
            </FormControl>
          )}
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={useManualEntry ? 
                !(manualJobTitle && manualCompanyName && manualJobDescription) : 
                !selectedJobId
              }
            >
              Continue
            </Button>
          </Box>
        </Box>
      )
    },
    {
      label: 'Select Resume',
      description: 'Choose a resume or enter resume content manually.',
      content: (
        <Box sx={{ mt: 2 }}>
          <Button
            variant={useManualEntry ? 'outlined' : 'contained'}
            color="primary"
            onClick={() => setUseManualEntry(false)}
            sx={{ mr: 2, mb: 2 }}
          >
            Use Saved Resume
          </Button>
          <Button
            variant={useManualEntry ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setUseManualEntry(true)}
            sx={{ mb: 2 }}
          >
            Enter Manually
          </Button>
          
          {useManualEntry ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadIcon />}
                  sx={{ mr: 2 }}
                >
                  Upload Resume
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx,.txt,.rtf"
                    onChange={handleResumeFileUpload}
                  />
                </Button>
                {resumeFileName && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {resumeFileName}
                    </Typography>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={handleClearResumeFile}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload a resume file (PDF, DOC, DOCX, TXT, RTF) or enter your resume content manually below.
              </Typography>
              <TextField
                fullWidth
                label="Resume Content"
                value={manualResumeContent}
                onChange={(e) => setManualResumeContent(e.target.value)}
                multiline
                rows={10}
                required={!resumeFileName}
                disabled={isParsingResume}
                placeholder={isParsingResume ? "Parsing resume..." : "Enter your resume content here..."}
              />
            </Box>
          ) : (
            <FormControl fullWidth>
              <InputLabel id="resume-select-label">Select Resume</InputLabel>
              <Select
                labelId="resume-select-label"
                value={selectedResumeId}
                onChange={handleResumeSelect}
                label="Select Resume"
              >
                {savedResumes.map((resume) => (
                  <MenuItem key={resume.id} value={resume.id}>
                    {resume.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={useManualEntry ? !manualResumeContent : !selectedResumeId}
            >
              Continue
            </Button>
          </Box>
        </Box>
      )
    },
    {
      label: 'Generate Guide',
      description: 'Review your selections and generate the interview preparation guide.',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            You're about to generate an interview preparation guide with the following details:
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WorkIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="subtitle1">Job Details</Typography>
                </Box>
                <Typography variant="body2">
                  <strong>Title:</strong> {useManualEntry ? manualJobTitle : savedJobs.find(j => j.id === selectedJobId)?.title}
                </Typography>
                <Typography variant="body2">
                  <strong>Company:</strong> {useManualEntry ? manualCompanyName : savedJobs.find(j => j.id === selectedJobId)?.company}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DescriptionIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="subtitle1">Resume</Typography>
                </Box>
                <Typography variant="body2">
                  {useManualEntry ? 
                    'Manually entered resume content' : 
                    `Selected resume: ${savedResumes.find(r => r.id === selectedResumeId)?.name}`
                  }
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" paragraph>
              The AI will analyze these details to generate a comprehensive interview preparation guide including:
            </Typography>
            <ul>
              <li>Company research and background</li>
              <li>Key competitors analysis</li>
              <li>Growth trajectory insights</li>
              <li>Potential risks and challenges</li>
              <li>How your role can help the company</li>
              <li>Tailored interview questions and answers</li>
              <li>Interview preparation tips</li>
            </ul>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateGuide}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <SchoolIcon />}
            >
              {isLoading ? 'Generating...' : 'Generate Guide'}
            </Button>
          </Box>
        </Box>
      )
    }
  ];
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Interview Guide
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate a comprehensive interview preparation guide tailored to your resume and the job description.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                {step.content}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleCancel}
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
      </Box>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InterviewPrepGenerator;
