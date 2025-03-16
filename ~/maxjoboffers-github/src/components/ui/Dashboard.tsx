import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Avatar,
  useTheme,
  Tab,
  Tabs
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  VideoCall as VideoCallIcon,
  MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { ResourceLibrary } from '../resources/ResourceLibrary';
import { UpcomingEvents } from '../events/UpcomingEvents';
import { mockResources, mockEvents } from '../../mocks/resourcesAndEvents';
import { ResourceFilters } from '../../types';

interface DashboardProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    membershipTier?: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

/**
 * Dashboard Component
 * 
 * This component displays the main dashboard of the application, including
 * resume progress, job applications, networking, and interview preparation.
 */
const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [filteredResources, setFilteredResources] = useState(mockResources);
  
  // Sample data for the dashboard
  const resumeProgress = 85;
  const jobApplications = 12;
  const interviews = 3;
  const connections = 152;
  
  // Sample resume data
  const resumes = [
    { id: '1', title: 'Software Engineer Resume', score: 85 },
    { id: '2', title: 'Product Manager Resume', score: 78 }
  ];
  
  // Sample job application data
  const applications = [
    { id: '1', company: 'Tech Innovations Inc.', position: 'Senior Software Engineer', status: 'Applied', date: '2025-03-10' },
    { id: '2', company: 'Digital Solutions', position: 'Product Manager', status: 'Interview', date: '2025-03-05' }
  ];
  
  // Sample networking events
  const events = [
    { id: '1', title: 'Tech Meetup', date: '2025-03-20', type: 'Networking' },
    { id: '2', title: 'Industry Conference', date: '2025-04-15', type: 'Conference' }
  ];
  
  // Sample coaching sessions
  const coachingSessions = [
    { id: '1', title: 'Mock Interview', date: '2025-03-18', type: 'Interview Prep' },
    { id: '2', title: 'Resume Review', date: '2025-03-25', type: 'Resume' }
  ];
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleResourceSelect = (resource: any) => {
    console.log('Selected resource:', resource);
  };
  
  const handleFilterChange = (filters: ResourceFilters) => {
    let filtered = [...mockResources];
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(query) || 
        resource.description.toLowerCase().includes(query)
      );
    }
    
    if (filters.type.length > 0) {
      filtered = filtered.filter(resource => 
        filters.type.includes(resource.type)
      );
    }
    
    if (filters.category.length > 0) {
      filtered = filtered.filter(resource => 
        filters.category.includes(resource.category)
      );
    }
    
    setFilteredResources(filtered);
  };
  
  const handleEventRegister = async (eventId: string) => {
    console.log('Registering for event:', eventId);
  };
  
  const handleEventCancel = async (eventId: string) => {
    console.log('Canceling event registration:', eventId);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<TrendingUpIcon />} label="Overview" />
          <Tab icon={<MenuBookIcon />} label="Resources" />
          <Tab icon={<EventIcon />} label="Events" />
        </Tabs>
      </Paper>
      
      <TabPanel value={tabValue} index={0}>
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
                    {resumes.length}
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
      
      {/* Main Content - Overview Tab */}
      <Grid container spacing={3}>
        {/* Resumes Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                My Resumes
              </Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            <List>
              {resumes.map((resume) => (
                <React.Fragment key={resume.id}>
                  <ListItem>
                    <ListItemIcon>
                      <DescriptionIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={resume.title} 
                      secondary={`ATS Score: ${resume.score}%`} 
                    />
                    <Chip 
                      label={`${resume.score}%`} 
                      color={resume.score > 80 ? 'success' : 'primary'} 
                      size="small" 
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="contained" color="primary">
                Create New Resume
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Job Applications Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Job Applications
              </Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            <List>
              {applications.map((application) => (
                <React.Fragment key={application.id}>
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${application.position} at ${application.company}`} 
                      secondary={`Applied: ${application.date}`} 
                    />
                    <Chip 
                      label={application.status} 
                      color={application.status === 'Interview' ? 'success' : 'primary'} 
                      size="small" 
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="contained" color="primary">
                Find Jobs
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Networking Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Networking Events
              </Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            <List>
              {events.map((event) => (
                <React.Fragment key={event.id}>
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={event.title} 
                      secondary={`Date: ${event.date}`} 
                    />
                    <Chip 
                      label={event.type} 
                      color="primary" 
                      size="small" 
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="contained" color="primary">
                Find Events
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Interview Prep Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Coaching Sessions
              </Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            <List>
              {coachingSessions.map((session) => (
                <React.Fragment key={session.id}>
                  <ListItem>
                    <ListItemIcon>
                      <VideoCallIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={session.title} 
                      secondary={`Date: ${session.date}`} 
                    />
                    <Chip 
                      label={session.type} 
                      color="primary" 
                      size="small" 
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="contained" color="primary">
                Schedule Session
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {/* Resources Tab */}
        <ResourceLibrary 
          resources={filteredResources}
          onResourceSelect={handleResourceSelect}
          onFilterChange={handleFilterChange}
          isLoading={false}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {/* Events Tab */}
        <UpcomingEvents 
          events={mockEvents}
          onEventRegister={handleEventRegister}
          onEventCancel={handleEventCancel}
          userTimezone="America/New_York"
          isLoading={false}
        />
      </TabPanel>
    </Box>
  );
};

export default Dashboard;
