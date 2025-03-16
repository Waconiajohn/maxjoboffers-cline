import React, { useState, useEffect } from 'react';
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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  TextField,
  IconButton,
  LinearProgress,
  Alert,
  Snackbar,
  useTheme
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Message as MessageIcon,
  Article as ArticleIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { 
  NetworkingStrategySystem, 
  ConnectionAnalyzer, 
  CampaignManager, 
  MessageOptimizer, 
  ContentStrategist, 
  GroupEngagementStrategist 
} from '../../../ai';

interface NetworkingManagerProps {
  userId: string;
}

/**
 * Networking Manager Component
 * 
 * This component provides a UI for managing networking activities, including connection analysis,
 * campaign management, message optimization, content strategy, and group engagement.
 */
const NetworkingManager: React.FC<NetworkingManagerProps> = ({ userId }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [networkingSystem, setNetworkingSystem] = useState<NetworkingStrategySystem | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    type: 'info'
  });
  
  // Initialize the networking system
  useEffect(() => {
    const system = new NetworkingStrategySystem();
    setNetworkingSystem(system);
  }, []);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  const showNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    setNotification({
      open: true,
      message,
      type
    });
  };
  
  // Sample connections data for the UI
  const sampleConnections = [
    {
      id: '1',
      name: 'John Smith',
      title: 'Senior Software Engineer',
      company: 'Tech Innovations Inc.',
      connectionStrength: 85,
      mutualConnections: 12,
      lastContact: '2025-03-01'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      title: 'Product Manager',
      company: 'Digital Solutions',
      connectionStrength: 72,
      mutualConnections: 8,
      lastContact: '2025-02-15'
    },
    {
      id: '3',
      name: 'Michael Chen',
      title: 'CTO',
      company: 'StartUp Ventures',
      connectionStrength: 65,
      mutualConnections: 5,
      lastContact: '2025-01-20'
    }
  ];
  
  // Sample companies data for the UI
  const sampleCompanies = [
    {
      id: '1',
      name: 'Tech Innovations Inc.',
      industry: 'Software Development',
      connections: 15,
      openPositions: 3,
      targetScore: 92
    },
    {
      id: '2',
      name: 'Digital Solutions',
      industry: 'IT Consulting',
      connections: 8,
      openPositions: 2,
      targetScore: 85
    },
    {
      id: '3',
      name: 'StartUp Ventures',
      industry: 'FinTech',
      connections: 5,
      openPositions: 5,
      targetScore: 78
    }
  ];
  
  // Sample messages data for the UI
  const sampleMessages = [
    {
      id: '1',
      recipient: 'John Smith',
      subject: 'Connection Request',
      content: 'Hi John, I noticed your work on AI systems and would love to connect.',
      status: 'draft',
      optimizationScore: 75
    },
    {
      id: '2',
      recipient: 'Sarah Johnson',
      subject: 'Follow-up on our conversation',
      content: 'Hi Sarah, it was great speaking with you last week about product management strategies.',
      status: 'sent',
      optimizationScore: 92,
      sentDate: '2025-03-05'
    }
  ];
  
  // Sample content ideas for the UI
  const sampleContentIdeas = [
    {
      id: '1',
      title: 'The Future of AI in Software Development',
      type: 'Article',
      targetAudience: 'Tech professionals',
      engagementScore: 88,
      status: 'draft'
    },
    {
      id: '2',
      title: '5 Tips for Effective Networking in the Digital Age',
      type: 'Post',
      targetAudience: 'Professionals',
      engagementScore: 92,
      status: 'published',
      publishDate: '2025-02-28'
    }
  ];
  
  // Sample groups for the UI
  const sampleGroups = [
    {
      id: '1',
      name: 'Software Engineering Professionals',
      members: 15000,
      relevanceScore: 95,
      activity: 'high'
    },
    {
      id: '2',
      name: 'Product Management Network',
      members: 8500,
      relevanceScore: 85,
      activity: 'medium'
    },
    {
      id: '3',
      name: 'Tech Startups Community',
      members: 12000,
      relevanceScore: 78,
      activity: 'high'
    }
  ];
  
  // Handle message optimization
  const handleOptimizeMessage = async (messageId: string) => {
    if (!networkingSystem) return;
    
    const message = sampleMessages.find(m => m.id === messageId);
    if (!message) return;
    
    try {
      const messageOptimizer = networkingSystem.getMessageOptimizer();
      const { enhancedMessage, result } = await messageOptimizer.enhanceMessage(
        message.content,
        { name: message.recipient }
      );
      
      showNotification('Message optimized successfully', 'success');
    } catch (error) {
      console.error('Error optimizing message:', error);
      showNotification('Failed to optimize message', 'error');
    }
  };
  
  // Handle content development
  const handleDevelopContent = async (contentId: string) => {
    if (!networkingSystem) return;
    
    const content = sampleContentIdeas.find(c => c.id === contentId);
    if (!content) return;
    
    try {
      const contentStrategist = networkingSystem.getContentStrategist();
      const { content: developedContent, result } = await contentStrategist.developContent(
        content.title,
        { audience: content.targetAudience }
      );
      
      showNotification('Content developed successfully', 'success');
    } catch (error) {
      console.error('Error developing content:', error);
      showNotification('Failed to develop content', 'error');
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Networking Strategy
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<PeopleIcon />} label="Connections" />
          <Tab icon={<BusinessIcon />} label="Companies" />
          <Tab icon={<MessageIcon />} label="Messages" />
          <Tab icon={<ArticleIcon />} label="Content" />
          <Tab icon={<GroupIcon />} label="Groups" />
        </Tabs>
      </Paper>
      
      {/* Connections Tab */}
      {tabValue === 0 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                My Connections
              </Typography>
              <Box>
                <TextField 
                  size="small" 
                  placeholder="Search connections" 
                  sx={{ mr: 1 }}
                  InputProps={{
                    startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                >
                  Add Connection
                </Button>
              </Box>
            </Box>
            
            <List>
              {sampleConnections.map((connection) => (
                <React.Fragment key={connection.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{connection.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" component="span">
                            {connection.name}
                          </Typography>
                          <Chip 
                            label={`${connection.connectionStrength}%`} 
                            color={connection.connectionStrength > 80 ? 'success' : 'primary'} 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="span" color="text.primary">
                            {connection.title} at {connection.company}
                          </Typography>
                          <Typography variant="body2" component="div" color="text.secondary">
                            {connection.mutualConnections} mutual connections • Last contact: {connection.lastContact}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <Box>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ mr: 1 }}
                      >
                        Message
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small"
                      >
                        Analyze
                      </Button>
                    </Box>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Connection Paths
            </Typography>
            <Typography variant="body2" paragraph>
              Find the best paths to connect with target individuals.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Target Person"
                  placeholder="Enter name or company"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Button 
                  variant="contained" 
                  fullWidth
                >
                  Find Connection Paths
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Connection Strength Metrics
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={75} color="success" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        75%
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      1st degree connections: 152
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      2nd degree connections: 4,587
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      3rd degree connections: 28,945
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
      
      {/* Companies Tab */}
      {tabValue === 1 && (
        <Box>
          <Grid container spacing={3}>
            {sampleCompanies.map((company) => (
              <Grid item xs={12} sm={6} md={4} key={company.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BusinessIcon sx={{ mr: 1 }} color="primary" />
                      <Typography variant="h6">{company.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Industry: {company.industry}
                    </Typography>
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography variant="body2" gutterBottom>
                        Target Score
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={company.targetScore} 
                            color={company.targetScore > 90 ? 'success' : 'primary'} 
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {company.targetScore}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {company.connections} connections at this company
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {company.openPositions} open positions
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">
                      View Connections
                    </Button>
                    <Button size="small">
                      Create Campaign
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
                  Add Target Company
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  startIcon={<AddIcon />}
                >
                  Add Company
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
      
      {/* Messages Tab */}
      {tabValue === 2 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Message Drafts
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
              >
                New Message
              </Button>
            </Box>
            
            <List>
              {sampleMessages.map((message) => (
                <React.Fragment key={message.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" component="span">
                            To: {message.recipient}
                          </Typography>
                          {message.status === 'draft' ? (
                            <Chip 
                              label="Draft" 
                              color="default" 
                              size="small" 
                              sx={{ ml: 1 }}
                            />
                          ) : (
                            <Chip 
                              label="Sent" 
                              color="success" 
                              size="small" 
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="span" color="text.primary">
                            {message.subject}
                          </Typography>
                          <Typography variant="body2" component="div" color="text.secondary" sx={{ mt: 1 }}>
                            {message.content}
                          </Typography>
                          {message.status === 'sent' && message.sentDate && (
                            <Typography variant="caption" component="div" color="text.secondary" sx={{ mt: 1 }}>
                              Sent on: {message.sentDate}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography variant="body2" component="span" color="text.secondary">
                              Optimization Score:
                            </Typography>
                            <Box sx={{ width: 100, mx: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={message.optimizationScore} 
                                color={message.optimizationScore > 90 ? 'success' : message.optimizationScore > 70 ? 'primary' : 'warning'} 
                              />
                            </Box>
                            <Typography variant="body2" component="span" color="text.secondary">
                              {message.optimizationScore}%
                            </Typography>
                          </Box>
                        </React.Fragment>
                      }
                    />
                    <Box>
                      {message.status === 'draft' && (
                        <>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOptimizeMessage(message.id)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="primary" 
                            sx={{ mr: 1 }}
                          >
                            <SendIcon />
                          </IconButton>
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Message Optimization
            </Typography>
            <Typography variant="body2" paragraph>
              Our AI-powered message optimization enhances your outreach messages for better response rates.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Draft Message"
                  placeholder="Enter your message"
                  variant="outlined"
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
                <Button 
                  variant="contained" 
                  fullWidth
                >
                  Optimize Message
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Optimization Tips
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>1</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Personalize your message with specific details" />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>2</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Keep messages concise and focused" />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>3</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Include a clear call-to-action" />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>4</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Highlight mutual connections or interests" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
      
      {/* Content Tab */}
      {tabValue === 3 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Content Ideas
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
              >
                New Content
              </Button>
            </Box>
            
            <List>
              {sampleContentIdeas.map((content) => (
                <React.Fragment key={content.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" component="span">
                            {content.title}
                          </Typography>
                          <Chip 
                            label={content.type} 
                            color="primary" 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                          {content.status === 'draft' ? (
                            <Chip 
                              label="Draft" 
                              color="default" 
                              size="small" 
                              sx={{ ml: 1 }}
                            />
                          ) : (
                            <Chip 
                              label="Published" 
                              color="success" 
                              size="small" 
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="div" color="text.secondary">
                            Target Audience: {content.targetAudience}
                          </Typography>
                          {content.status === 'published' && content.publishDate && (
                            <Typography variant="caption" component="div" color="text.secondary">
                              Published on: {content.publishDate}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography variant="body2" component="span" color="text.secondary">
                              Engagement Score:
                            </Typography>
                            <Box sx={{ width: 100, mx: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={content.engagementScore} 
                                color={content.engagementScore > 90 ? 'success' : 'primary'} 
                              />
                            </Box>
                            <Typography variant="body2" component="span" color="text.secondary">
                              {content.engagementScore}%
                            </Typography>
                          </Box>
                        </React.Fragment>
                      }
                    />
                    <Box>
                      {content.status === 'draft' && (
                        <>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            sx={{ mr: 1 }}
                            onClick={() => handleDevelopContent(content.id)}
                          >
                            Develop
                          </Button>
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                      {content.status === 'published' && (
                        <Button 
                          variant="outlined" 
                          size="small"
                        >
                          Analytics
                        </Button>
                      )}
                    </Box>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Content Strategy
            </Typography>
            <Typography variant="body2" paragraph>
              Our AI-powered content strategy helps you create engaging professional content.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Content Topic"
                  placeholder="Enter a topic for your content"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Target Audience"
                  placeholder="Who is your target audience?"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button 
                  variant="contained" 
                  fullWidth
                >
                  Generate Content Ideas
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Content Performance Metrics
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Your content has reached 1,245 professionals in your network
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TimelineIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Average engagement rate: 4.2%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Top performing content: "5 Tips for Effective Networking"
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
      
      {/* Groups Tab */}
      {tabValue === 4 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recommended Groups
              </Typography>
              <TextField 
                size="small" 
                placeholder="Search groups" 
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
            
            <List>
              {sampleGroups.map((group) => (
                <React.Fragment key={group.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar><GroupIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" component="span">
                            {group.name}
                          </Typography>
                          <Chip 
                            label={`${group.relevanceScore}%`} 
                            color={group.relevanceScore > 90 ? 'success' : 'primary'} 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="div" color="text.secondary">
                            {group.members.toLocaleString()} members • Activity: {group.activity}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <Box>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ mr: 1 }}
                      >
                        Join
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small"
                      >
                        Analyze
                      </Button>
                    </Box>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Group Engagement Strategy
            </Typography>
            <Typography variant="body2" paragraph>
              Our AI-powered group engagement strategy helps you maximize your networking presence in professional groups.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Group Name"
                  placeholder="Enter a group name"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button 
                  variant="contained" 
                  fullWidth
                >
                  Generate Engagement Strategy
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Engagement Tips
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>1</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Participate regularly in group discussions" />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>2</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Share valuable content and insights" />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>3</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Connect with active group members" />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>4</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Look for leadership opportunities" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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

export default NetworkingManager;
