import React from 'react';
import { Box, Grid, Paper, Typography, LinearProgress, Chip, Avatar } from '@mui/material';
import { ResourcesAndEventsContainer } from './ResourcesAndEventsContainer';

interface DashboardContainerProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    membershipTier?: string;
  };
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ user }) => {
  // Sample data for the dashboard
  const resumeProgress = 85;
  const jobApplications = 12;
  const interviews = 3;
  const connections = 152;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar 
              src={user?.avatarUrl} 
              alt={user?.name || 'User'} 
              sx={{ width: 64, height: 64 }}
            >
              {!user?.avatarUrl && (user?.name?.charAt(0) || 'U')}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4">
              Welcome back, {user?.name || 'User'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Let's continue your job search journey
            </Typography>
          </Grid>
          <Grid item>
            <Chip 
              label={user?.membershipTier || 'Free Plan'} 
              color="primary" 
              variant="outlined" 
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Progress Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Career Progress
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={resumeProgress} 
              color="primary" 
              sx={{ height: 10, mb: 2, borderRadius: 5 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary">
                    2
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resumes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary">
                    {jobApplications}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Applications
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary">
                    {interviews}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Interviews
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resume Optimization
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={resumeProgress} 
              color={resumeProgress > 80 ? 'success' : resumeProgress > 60 ? 'primary' : 'warning'} 
              sx={{ height: 10, mb: 2, borderRadius: 5 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary">
                    {resumeProgress}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ATS Score
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary">
                    {connections}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connections
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary">
                    {Math.round(resumeProgress * 0.9)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Match Rate
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Resources and Events Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Resources & Events
        </Typography>
        <ResourcesAndEventsContainer />
      </Box>
    </Box>
  );
};

export default DashboardContainer;
