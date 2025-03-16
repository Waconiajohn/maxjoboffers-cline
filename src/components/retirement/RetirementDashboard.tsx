import React from 'react';
import { Typography, Grid, Paper, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IncentiveCalculator } from './IncentiveCalculator';

// These components would be implemented in separate files
const RetirementVideo = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Why Retirement Planning Matters
    </Typography>
    
    <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', mb: 2 }}>
      <iframe 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        src="https://www.youtube.com/embed/your-video-id"
        title="Retirement Planning Overview"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </Box>
    
    <Typography variant="body1">
      Our retirement planning experts can help you secure your financial future while maximizing your career potential today. Watch this video to learn how our integrated approach works.
    </Typography>
  </Box>
);

const CaseStudies = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Success Stories
    </Typography>
    <Typography variant="body1">
      See how our clients have benefited from our retirement planning services while advancing their careers.
    </Typography>
  </Box>
);

const ServiceOfferings = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      What You'll Receive
    </Typography>
    <Typography variant="body1">
      Our comprehensive retirement planning services include investment portfolio review, income strategy, tax efficiency analysis, and more.
    </Typography>
  </Box>
);

const RetirementDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Retirement Planning Services
      </Typography>
      
      <Typography variant="subtitle1" paragraph>
        Get free access to all our job search tools and personalized coaching when you explore our retirement planning services.
      </Typography>
      
      <Grid container spacing={3}>
        {/* Educational Video Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <RetirementVideo />
          </Paper>
        </Grid>
        
        {/* Case Studies */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <CaseStudies />
          </Paper>
        </Grid>
        
        {/* Service Offerings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <ServiceOfferings />
          </Paper>
        </Grid>
        
        {/* Incentive Calculator */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <IncentiveCalculator />
          </Paper>
        </Grid>
        
        {/* Call to Action */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/retirement/onboarding')}
            >
              Get Started with Your Free Retirement Plan
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RetirementDashboard;
