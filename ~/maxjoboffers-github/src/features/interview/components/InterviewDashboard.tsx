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
import { interviewPrepService } from '../services/interviewPrep';
import { InterviewPrepGuide } from '../types/interviewPrep';

/**
 * Interview Dashboard Component
 *
 * This component displays all interview preparation guides and allows the user to create new ones.
 */
const InterviewDashboard: React.FC = () => {
  const [guides, setGuides] = useState<InterviewPrepGuide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    setIsLoading(true);
    try {
      const fetchedGuides = await interviewPrepService.getAllGuides();
      setGuides(fetchedGuides);
      setError(null);
    } catch (err) {
      setError('Failed to load interview guides. Please try again later.');
      console.error('Error fetching interview guides:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/interview/create');
  };

  const handleViewGuide = (guideId: string) => {
    navigate(`/interview/view/${guideId}`);
  };

  const handleDeleteGuide = async (guideId: string) => {
    try {
      await interviewPrepService.deleteGuide(guideId);
      setNotification('Interview guide deleted successfully');
      // Refresh the list
      fetchGuides();
    } catch (err) {
      setError('Failed to delete the guide. Please try again.');
      console.error('Error deleting guide:', err);
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (isLoading && guides.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Interview Preparation
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
        >
          Create New Guide
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={handleCloseError} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {guides.length === 0 && !isLoading ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No interview guides yet
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Create your first interview preparation guide to get started.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            Create New Guide
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {guides.map((guide) => (
            <Grid item xs={12} sm={6} md={4} key={guide.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {guide.jobTitle}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <BusinessIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {guide.companyName || 'General'}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      icon={<SchoolIcon />}
                      label={`${guide.questions.length} Questions`}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      icon={<QuestionAnswerIcon />}
                      label="Interview Prep"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1.5 }}>
                    {guide.companyResearch?.overview?.substring(0, 100)}
                    {guide.companyResearch?.overview && guide.companyResearch.overview.length > 100 ? '...' : ''}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleViewGuide(guide.id)}>
                    View
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteGuide(guide.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        message={notification}
      />
    </Box>
  );
};

export default InterviewDashboard;
