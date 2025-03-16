import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Snackbar,
  useTheme
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Edit as EditIcon,
  Compare as CompareIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { ResumeManager as AIResumeManager, ResumeFormat, ResumeReviewStage } from '../../../ai';

interface ResumeManagerProps {
  userId: string;
}

/**
 * Resume Manager Component
 * 
 * This component provides a UI for managing resumes, including creation, optimization,
 * version control, and format selection.
 */
const ResumeManager: React.FC<ResumeManagerProps> = ({ userId }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [resumeManager, setResumeManager] = useState<AIResumeManager | null>(null);
  const [activeResume, setActiveResume] = useState<string | null>(null);
  const [reviewStage, setReviewStage] = useState<ResumeReviewStage | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    type: 'info'
  });
  
  // Initialize the resume manager
  useEffect(() => {
    const manager = new AIResumeManager(
      userId,
      (notification) => {
        setNotification({
          open: true,
          message: notification.message,
          type: notification.type
        });
      }
    );
    setResumeManager(manager);
    
    // Check for jobId in URL query params
    const queryParams = new URLSearchParams(location.search);
    const jobId = queryParams.get('jobId');
    
    if (jobId) {
      // Set tab to optimize
      setTabValue(2);
      
      // Fetch job details and start optimization
      fetchJobDetailsAndOptimize(jobId);
    }
  }, [userId, location]);
  
  // Function to fetch job details and start optimization
  const fetchJobDetailsAndOptimize = async (jobId: string) => {
    try {
      // Import the job search service
      const { jobSearchService } = await import('../../../services/jobSearch');
      
      // Get job details
      const jobDetails = await jobSearchService.getJobDetails(jobId);
      
      // Show notification
      setNotification({
        open: true,
        message: `Preparing to optimize resume for "${jobDetails.title}" at ${jobDetails.company}`,
        type: 'info'
      });
      
      // Start the optimization process with the job description
      const resumeContent = ""; // In a real app, this would be loaded from the user's saved resumes
      const jobDescription = `
        Job Title: ${jobDetails.title}
        Company: ${jobDetails.company}
        Description: ${jobDetails.description}
        Requirements: ${jobDetails.requirements.join(', ')}
        Skills: ${jobDetails.skills.join(', ')}
      `;
      
      // Determine industry from job
      const industry = jobDetails.industry.toLowerCase();
      
      // Start the review process
      if (resumeManager) {
        const versionId = await resumeManager.startReviewProcess(
          resumeContent,
          jobDescription,
          industry
        );
        
        setActiveResume(versionId);
        setReviewStage(ResumeReviewStage.INITIAL_ANALYSIS);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      setNotification({
        open: true,
        message: 'Failed to fetch job details for optimization',
        type: 'error'
      });
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  const handleStartReviewProcess = async () => {
    if (!resumeManager) return;
    
    // Check if we have a job ID in the URL
    const queryParams = new URLSearchParams(location.search);
    const jobId = queryParams.get('jobId');
    
    if (jobId) {
      // If we have a job ID, we've already started the process in fetchJobDetailsAndOptimize
      return;
    }
    
    const resumeContent = "Sample resume content"; // In a real app, this would be loaded from a file or form
    const jobDescription = "Sample job description"; // In a real app, this would be loaded from a form
    const industry = "software-development";
    
    try {
      const versionId = await resumeManager.startReviewProcess(
        resumeContent,
        jobDescription,
        industry
      );
      
      setActiveResume(versionId);
      setReviewStage(ResumeReviewStage.INITIAL_ANALYSIS);
    } catch (error) {
      console.error('Error starting review process:', error);
      setNotification({
        open: true,
        message: 'Failed to start review process',
        type: 'error'
      });
    }
  };
  
  const handleRunNextStage = async () => {
    if (!resumeManager) return;
    
    try {
      const result = await resumeManager.runNextReviewStage();
      setReviewStage(result.currentStage);
    } catch (error) {
      console.error('Error running next stage:', error);
      setNotification({
        open: true,
        message: 'Failed to run next stage',
        type: 'error'
      });
    }
  };
  
  const handleSetFormat = (format: ResumeFormat) => {
    if (!resumeManager) return;
    
    resumeManager.setFormat(format);
    setNotification({
      open: true,
      message: `Resume format set to ${format}`,
      type: 'success'
    });
  };
  
  // Sample resume data for the UI
  const sampleResumes = [
    {
      id: '1',
      title: 'Software Engineer Resume',
      lastUpdated: '2025-03-10',
      score: 85,
      versions: 3
    },
    {
      id: '2',
      title: 'Product Manager Resume',
      lastUpdated: '2025-03-05',
      score: 78,
      versions: 2
    }
  ];
  
  // Sample ATS systems for the UI
  const sampleATSSystems = [
    { name: 'Taleo', score: 92 },
    { name: 'Workday', score: 88 },
    { name: 'Greenhouse', score: 85 },
    { name: 'Lever', score: 90 }
  ];
  
  // Sample formats for the UI
  const sampleFormats = [
    { id: ResumeFormat.STANDARD, name: 'Standard', atsScore: 90 },
    { id: ResumeFormat.MODERN, name: 'Modern', atsScore: 85 },
    { id: ResumeFormat.CREATIVE, name: 'Creative', atsScore: 70 },
    { id: ResumeFormat.EXECUTIVE, name: 'Executive', atsScore: 85 },
    { id: ResumeFormat.TECHNICAL, name: 'Technical', atsScore: 95 },
    { id: ResumeFormat.ATS_OPTIMIZED, name: 'ATS Optimized', atsScore: 100 }
  ];
  
  // Get the active step for the stepper
  const getActiveStep = () => {
    switch (reviewStage) {
      case ResumeReviewStage.INITIAL_ANALYSIS:
        return 0;
      case ResumeReviewStage.TECHNICAL_OPTIMIZATION:
        return 1;
      case ResumeReviewStage.ATS_OPTIMIZATION:
        return 2;
      case ResumeReviewStage.EXECUTIVE_IMPACT:
        return 3;
      case ResumeReviewStage.FINAL_INTEGRATION:
        return 4;
      default:
        return -1;
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Resume Management
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="My Resumes" />
          <Tab label="Create & Edit" />
          <Tab label="Optimize" />
          <Tab label="Versions" />
          <Tab label="Templates" />
        </Tabs>
      </Paper>
      
      {/* My Resumes Tab */}
      {tabValue === 0 && (
        <Box>
          <Grid container spacing={3}>
            {sampleResumes.map((resume) => (
              <Grid item xs={12} sm={6} md={4} key={resume.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DescriptionIcon sx={{ mr: 1 }} color="primary" />
                      <Typography variant="h6">{resume.title}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Last updated: {resume.lastUpdated}
                    </Typography>
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography variant="body2" gutterBottom>
                        ATS Score
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={resume.score} 
                            color={resume.score > 80 ? 'success' : resume.score > 60 ? 'warning' : 'error'} 
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {resume.score}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {resume.versions} versions
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<EditIcon />}>
                      Edit
                    </Button>
                    <Button size="small" startIcon={<CompareIcon />}>
                      Versions
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                p: 3,
                border: '2px dashed',
                borderColor: 'divider',
                backgroundColor: 'background.default'
              }}>
                <Typography variant="h6" gutterBottom>
                  Create New Resume
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                >
                  Create Resume
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
      
      {/* Optimize Tab */}
      {tabValue === 2 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resume Optimization Process
            </Typography>
            <Typography variant="body2" paragraph>
              Our AI-powered resume optimization process analyzes your resume against the job description
              and provides tailored recommendations to increase your chances of getting an interview.
            </Typography>
            
            <Stepper activeStep={getActiveStep()} orientation="vertical">
              <Step>
                <StepLabel>Initial Analysis</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Analyzes your resume format, content, achievements, and keywords.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={activeResume ? handleRunNextStage : handleStartReviewProcess}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {activeResume ? 'Continue' : 'Start Optimization'}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Technical Optimization</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Optimizes technical aspects of your resume for your industry.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleRunNextStage}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Continue
                    </Button>
                  </Box>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>ATS Optimization</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Optimizes your resume for Applicant Tracking Systems.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleRunNextStage}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Continue
                    </Button>
                  </Box>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Executive Impact Enhancement</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Enhances the executive impact of your resume.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleRunNextStage}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Continue
                    </Button>
                  </Box>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Final Integration</StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    Integrates all optimizations into your final resume.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleRunNextStage}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Complete
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          </Paper>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  ATS Compatibility
                </Typography>
                <Typography variant="body2" paragraph>
                  Your resume will be optimized for these Applicant Tracking Systems:
                </Typography>
                <List>
                  {sampleATSSystems.map((system) => (
                    <ListItem key={system.name}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={system.name} 
                        secondary={`Compatibility Score: ${system.score}%`} 
                      />
                      <Chip 
                        label={`${system.score}%`} 
                        color={system.score > 90 ? 'success' : 'primary'} 
                        size="small" 
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Resume Format
                </Typography>
                <Typography variant="body2" paragraph>
                  Choose a format for your resume:
                </Typography>
                <Grid container spacing={2}>
                  {sampleFormats.map((format) => (
                    <Grid item xs={12} sm={6} key={format.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: 'transparent',
                          '&:hover': {
                            borderColor: 'primary.main',
                          }
                        }}
                        onClick={() => handleSetFormat(format.id)}
                      >
                        <CardContent>
                          <Typography variant="subtitle1">{format.name}</Typography>
                          <Chip 
                            label={`ATS: ${format.atsScore}%`} 
                            color={format.atsScore > 90 ? 'success' : 'primary'} 
                            size="small" 
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
      
      {/* Versions Tab */}
      {tabValue === 3 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resume Versions
            </Typography>
            <Typography variant="body2" paragraph>
              Track and compare different versions of your resume.
            </Typography>
            
            <List>
              {[1, 2, 3].map((version) => (
                <React.Fragment key={version}>
                  <ListItem>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Version ${version}`} 
                      secondary={`Created on March ${10 - version}, 2025`} 
                    />
                    <Chip 
                      label={`Score: ${75 + version * 5}%`} 
                      color="primary" 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<CompareIcon />}
                    >
                      Compare
                    </Button>
                  </ListItem>
                  {version < 3 && (
                    <Box sx={{ display: 'flex', ml: 8, my: 1 }}>
                      <ArrowForwardIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {version === 1 ? 'Added technical skills and improved job descriptions' : 'Optimized for ATS and enhanced achievements'}
                      </Typography>
                    </Box>
                  )}
                  {version < 3 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      )}
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default ResumeManager;
