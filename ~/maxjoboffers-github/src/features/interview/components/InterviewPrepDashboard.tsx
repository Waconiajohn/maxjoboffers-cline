import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  School as SchoolIcon,
  Business as BusinessIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { interviewPrepService } from '../../services/interviewPrep';
import { InterviewPrepGuide } from '../../types/interviewPrep';

/**
 * Interview Prep Dashboard Component
 * 
 * This component displays all interview preparation guides and allows the user to create new ones.
 */
export const InterviewPrepDashboard: React.FC = () => {
  const [guides, setGuides] = useState<InterviewPrepGuide[]>([]);
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
  
  const navigate = useNavigate();
  
  // Load guides on component mount
  useEffect(() => {
    loadGuides();
  }, []);
  
  const loadGuides = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const loadedGuides = await interviewPrepService.getGuides();
      setGuides(loadedGuides);
    } catch (err) {
      console.error('Error loading guides:', err);
      setError('Failed to load interview guides. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateGuide = () => {
    navigate('/interview/create');
  };
  
  const handleViewGuide = (guideId: string) => {
    navigate(`/interview/view/${guideId}`);
  };
  
  const handleDeleteGuide = async (guideId: string) => {
    try {
      await interviewPrepService.deleteGuide(guideId);
      setGuides(guides.filter(guide => guide.id !== guideId));
      
      setNotification({
        open: true,
        message: 'Interview guide deleted successfully',
        type: 'success'
      });
    } catch (err) {
      console.error('Error deleting guide:', err);
      
      setNotification({
        open: true,
        message: 'Failed to delete interview guide',
        type: 'error'
      });
    }
  };
  
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Interview Preparation</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateGuide}
        >
          Create New Guide
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Prepare for your interviews with AI-generated guides tailored to your resume and job descriptions.
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : guides.length > 0 ? (
        <Grid container spacing={3}>
          {guides.map((guide) => (
            <Grid item xs={12} md={6} lg={4} key={guide.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="h6">{guide.companyName}</Typography>
                  </Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {guide.jobTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Created: {new Date(guide.createdAt).toLocaleDateString()}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip 
                      icon={<BusinessIcon fontSize="small" />} 
                      label={`${guide.competitors.length} Competitors`} 
                      size="small" 
                    />
                    <Chip 
                      icon={<QuestionAnswerIcon fontSize="small" />} 
                      label={`${guide.questions.length} Questions`} 
                      size="small" 
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => handleViewGuide(guide.id)}
                  >
                    View Guide
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleDeleteGuide(guide.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Interview Guides Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Create your first interview preparation guide to get started.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateGuide}
          >
            Create New Guide
          </Button>
        </Paper>
      )}
      
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

export default InterviewPrepDashboard;
