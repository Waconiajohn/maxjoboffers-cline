import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Skeleton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  ErrorOutline,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fetchDashboardData } from '../services/mockDashboardData';

// Theme Configuration
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
  },
});

// Types
interface DashboardData {
  user: {
    first_name: string;
    last_name: string;
    avatar?: string;
    membership_tier: string;
  };
  careerProgress: {
    goalsCompleted: number;
    totalGoals: number;
    metrics: {
      resumesCreated: number;
      connectionsBuilt: number;
      interviewsPracticed: number;
    };
  };
  resumeProgress: {
    atsScore: number;
    lastOptimized: string;
  };
  networking: {
    upcomingEvents: Array<{
      title: string;
      date: string;
      type: string;
      participants: number;
    }>;
  };
  coaching: {
    upcomingSessions: Array<{
      coachName: string;
      date: string;
      focus: string;
      duration: number;
    }>;
  };
  resources: {
    recommendedContent: Array<{
      title: string;
      type: string;
      relevanceScore: number;
    }>;
  };
}

// Styles
const styles = {
  paper: {
    p: 3,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    '& .MuiLinearProgress-bar': {
      borderRadius: 4,
      backgroundColor: '#1976d2',
    },
  },
  sectionTitle: {
    variant: 'h6' as const,
    fontWeight: 600,
    marginBottom: 2,
  },
  metricValue: {
    variant: 'h4' as const,
    color: 'primary.main',
  },
  metricLabel: {
    variant: 'body2' as const,
    color: 'text.secondary',
  },
};

// Loading Skeleton Component
const DashboardSkeleton = () => (
  <Grid container spacing={3}>
    {[...Array(6)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ borderRadius: 2 }}
        />
      </Grid>
    ))}
  </Grid>
);

// Error Boundary Component
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
        <Typography>Failed to load dashboard data</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Reload Dashboard
        </Button>
      </Paper>
    );
  }

  return <>{children}</>;
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Use the mock data service instead of a real API call
        const jsonData = await fetchDashboardData();
        setData(jsonData as DashboardData);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return null;

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* Header Section */}
          <Paper sx={styles.paper}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  src={data.user.avatar}
                  sx={{ width: 64, height: 64 }}
                  alt={`${data.user.first_name} ${data.user.last_name}`}
                >
                  {data.user.first_name[0]}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4">
                  Welcome back, {data.user.first_name}!
                </Typography>
                <Chip
                  label={data.user.membership_tier}
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Main Content Grid */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {/* Career Progress Section */}
            <Grid item xs={12} md={8}>
              <Paper sx={styles.paper}>
                <Typography sx={styles.sectionTitle}>Career Progress</Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Overall Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(data.careerProgress.goalsCompleted / data.careerProgress.totalGoals) * 100}
                    sx={styles.progressBar}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {data.careerProgress.goalsCompleted} of {data.careerProgress.totalGoals} goals completed
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={styles.card}>
                      <CardContent>
                        <Typography sx={styles.metricValue}>
                          {data.careerProgress.metrics.resumesCreated}
                        </Typography>
                        <Typography sx={styles.metricLabel}>
                          Resumes Created
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={styles.card}>
                      <CardContent>
                        <Typography sx={styles.metricValue}>
                          {data.careerProgress.metrics.connectionsBuilt}
                        </Typography>
                        <Typography sx={styles.metricLabel}>
                          Connections Built
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={styles.card}>
                      <CardContent>
                        <Typography sx={styles.metricValue}>
                          {data.careerProgress.metrics.interviewsPracticed}
                        </Typography>
                        <Typography sx={styles.metricLabel}>
                          Interviews Practiced
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Resume Status Section */}
            <Grid item xs={12} md={4}>
              <Paper sx={styles.paper}>
                <Typography sx={styles.sectionTitle}>Resume Status</Typography>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={data.resumeProgress.atsScore}
                    size={120}
                    thickness={4}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    ATS Score: {data.resumeProgress.atsScore}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last optimized: {new Date(data.resumeProgress.lastOptimized).toLocaleDateString()}
                  </Typography>
                </Box>
                <Button variant="contained" fullWidth>
                  Optimize Resume
                </Button>
              </Paper>
            </Grid>

            {/* Networking Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={styles.paper}>
                <Typography sx={styles.sectionTitle}>Upcoming Events</Typography>
                <List>
                  {data.networking.upcomingEvents.map((event, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <EventIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={`${new Date(event.date).toLocaleDateString()} • ${event.participants} participants`}
                      />
                      <Chip label={event.type} size="small" color="primary" variant="outlined" />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Coaching Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={styles.paper}>
                <Typography sx={styles.sectionTitle}>Coaching Sessions</Typography>
                <List>
                  {data.coaching.upcomingSessions.map((session, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <PersonIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={session.focus}
                        secondary={`${session.coachName} • ${new Date(session.date).toLocaleDateString()}`}
                      />
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={`${session.duration} min`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Resources Section */}
            <Grid item xs={12}>
              <Paper sx={styles.paper}>
                <Typography sx={styles.sectionTitle}>Recommended Resources</Typography>
                <Grid container spacing={3}>
                  {data.resources.recommendedContent.map((resource, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Card sx={styles.card}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {resource.title}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip
                              label={resource.type}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Typography variant="body2" color="text.secondary">
                              Relevance: {resource.relevanceScore}%
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;
