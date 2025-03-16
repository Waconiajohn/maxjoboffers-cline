import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import SectionSelector from './SectionSelector';
import ContentEditor from './ContentEditor';
import JobTitleInput from './JobTitleInput';
import IndustryInput from './IndustryInput';
import UploadArea from './UploadArea';
import { jobSearchService } from '../../services/jobSearch';
import { useLocation } from 'react-router-dom';

interface LinkedInProfileEditorProps {
  userId: string;
}

interface ProfileContent {
  [key: string]: string;
}

/**
 * LinkedIn Profile Editor Component
 * 
 * This component provides a UI for creating and editing LinkedIn profiles with AI assistance.
 */
const LinkedInProfileEditor: React.FC<LinkedInProfileEditorProps> = ({ userId }) => {
  const theme = useTheme();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("Headline");
  const [profileContent, setProfileContent] = useState<ProfileContent>({});
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [resumeContent, setResumeContent] = useState("");
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    type: 'info'
  });

  // Check for jobId in URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const jobId = queryParams.get('jobId');
    
    if (jobId) {
      fetchJobDetailsForProfile(jobId);
    }
  }, [location]);

  // Fetch job details and use them for profile creation
  const fetchJobDetailsForProfile = async (jobId: string) => {
    try {
      // Get job details
      const jobDetails = await jobSearchService.getJobDetails(jobId);
      
      // Set job title
      setJobTitles([jobDetails.title]);
      
      // Set industry
      setIndustries([jobDetails.industry]);
      
      // Create resume content from job details
      const formattedJobContent = `
        Job Title: ${jobDetails.title}
        Company: ${jobDetails.company}
        Description: ${jobDetails.description}
        Requirements: ${jobDetails.requirements.join(', ')}
        Skills: ${jobDetails.skills.join(', ')}
      `;
      
      setResumeContent(formattedJobContent);
      
      setNotification({
        open: true,
        message: `Job details loaded for "${jobDetails.title}" at ${jobDetails.company}`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error fetching job details:', error);
      setNotification({
        open: true,
        message: 'Failed to fetch job details',
        type: 'error'
      });
    }
  };

  const handleSaveContent = (content: string) => {
    setProfileContent(prev => ({
      ...prev,
      [activeSection]: content
    }));
  };

  const handleJobTitlesChange = (newJobTitles: string[]) => {
    setJobTitles(newJobTitles);
  };

  const handleIndustriesChange = (newIndustries: string[]) => {
    setIndustries(newIndustries);
  };

  const handleResumeContentExtracted = (content: string) => {
    setResumeContent(content);
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        LinkedIn Profile Builder
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Upload your resume and let our AI help you create a compelling LinkedIn profile
        that stands out to recruiters and hiring managers.
      </Typography>

      <Box sx={{ mb: 4 }}>
        {/* Resume Upload Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <UploadArea onContentExtracted={handleResumeContentExtracted} />
        </Paper>

        {/* Job Title and Industry Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <JobTitleInput onJobTitlesChange={handleJobTitlesChange} initialJobTitles={jobTitles} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <IndustryInput onIndustriesChange={handleIndustriesChange} initialIndustries={industries} />
            </Paper>
          </Grid>
        </Grid>

        {/* Main Working Area */}
        <Grid container spacing={3}>
          {/* Section Selector */}
          <Grid item xs={12} lg={3}>
            <Paper sx={{ p: 3 }}>
              <SectionSelector 
                onSelect={setActiveSection} 
                completedSections={Object.keys(profileContent)}
                activeSection={activeSection}
              />
            </Paper>
          </Grid>

          {/* Content Editor Area */}
          <Grid item xs={12} lg={9}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>{activeSection}</Typography>
              <ContentEditor
                section={activeSection}
                onSave={handleSaveContent}
                jobTitles={jobTitles}
                industries={industries}
                resumeContent={resumeContent}
              />
            </Paper>

            {/* Profile Preview Section */}
            {Object.keys(profileContent).length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Profile Preview</Typography>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(profileContent).map(([section, content]) => (
                    <Box key={section} sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="subtitle1" gutterBottom>{section}</Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{content}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>

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

export default LinkedInProfileEditor;
