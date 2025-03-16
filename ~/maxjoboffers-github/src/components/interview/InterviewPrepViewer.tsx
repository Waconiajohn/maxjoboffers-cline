import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Work as WorkIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Lightbulb as LightbulbIcon,
  ExpandMore as ExpandMoreIcon,
  Print as PrintIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewPrepService } from '../../services/interviewPrep';
import { InterviewPrepGuide } from '../../types/interviewPrep';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`interview-tabpanel-${index}`}
      aria-labelledby={`interview-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * Interview Prep Viewer Component
 * 
 * This component displays a generated interview preparation guide.
 */
export const InterviewPrepViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<InterviewPrepGuide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
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
  
  // Load guide on component mount
  useEffect(() => {
    if (id) {
      loadGuide(id);
    }
  }, [id]);
  
  const loadGuide = async (guideId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const loadedGuide = await interviewPrepService.getGuideById(guideId);
      
      if (!loadedGuide) {
        setError('Interview guide not found');
      } else {
        setGuide(loadedGuide);
      }
    } catch (err) {
      console.error('Error loading guide:', err);
      setError('Failed to load interview guide. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleBack = () => {
    navigate('/interview');
  };
  
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !guide) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ my: 2 }}>
          {error || 'Guide not found'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">{guide.jobTitle}</Typography>
          <Typography variant="h5" color="text.secondary">{guide.companyName}</Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<BusinessIcon />} label="Company Research" />
          <Tab icon={<TrendingUpIcon />} label="Growth & Risks" />
          <Tab icon={<WorkIcon />} label="Role Impact" />
          <Tab icon={<QuestionAnswerIcon />} label="Questions & Answers" />
          <Tab icon={<LightbulbIcon />} label="Tips" />
        </Tabs>
      </Paper>
      
      {/* Company Research Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Company Overview</Typography>
              <Typography variant="body1" paragraph>
                {guide.companyResearch.overview}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>Focus Areas</Typography>
              <List>
                {guide.companyResearch.focusAreas.map((area, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <BusinessIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={area} />
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>Customer Service & Community Ties</Typography>
              <Typography variant="body1">
                {guide.companyResearch.customerService}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Key Competitors</Typography>
              <Grid container spacing={2}>
                {guide.competitors.map((competitor, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {competitor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {competitor.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Growth & Risks Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Where Their Growth Is Heading</Typography>
              </Box>
              
              {guide.growthAreas.map((area, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {index + 1}. {area.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {area.description}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Biggest Risks</Typography>
              </Box>
              
              {guide.risks.map((risk, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {index + 1}. {risk.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {risk.description}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Role Impact Tab */}
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            How This Role Can Help the Company
          </Typography>
          
          <Typography variant="body1" paragraph>
            As a <strong>{guide.jobTitle}</strong>, you will:
          </Typography>
          
          <Grid container spacing={2}>
            {guide.roleImpacts.map((impact, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {index + 1}. {impact.title}
                    </Typography>
                    <Typography variant="body2">
                      {impact.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </TabPanel>
      
      {/* Questions & Answers Tab */}
      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Potential Interview Questions
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            {guide.questions.map((question, index) => (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`question-content-${index}`}
                  id={`question-header-${index}`}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <QuestionAnswerIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1">
                        {question.question}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Category: {question.category}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    {question.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Paper>
      </TabPanel>
      
      {/* Tips Tab */}
      <TabPanel value={tabValue} index={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Final Tips for Interview Success
          </Typography>
          
          <List>
            {guide.tips.map((tip, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemIcon>
                  <LightbulbIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={tip.title}
                  secondary={tip.description}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </TabPanel>
      
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

export default InterviewPrepViewer;
