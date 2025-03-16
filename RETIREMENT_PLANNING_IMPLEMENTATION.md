# Retirement Planning Component Implementation

This document outlines the implementation plan for adding a comprehensive retirement planning component to the MaxJobOffers platform. This component will serve as a key business driver, offering free job search and career services to clients who engage with our retirement planning services.

## Component Overview

The retirement planning section will include:

1. Educational resources
2. Case studies and success stories
3. Service offerings and incentives
4. Client onboarding process
5. Document upload functionality
6. Meeting scheduling system
7. Account management dashboard

## Technical Implementation

### 1. Frontend Components

#### Retirement Planning Dashboard (`src/components/retirement/RetirementDashboard.tsx`)

```tsx
import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RetirementVideo } from './RetirementVideo';
import { CaseStudies } from './CaseStudies';
import { IncentiveCalculator } from './IncentiveCalculator';
import { ServiceOfferings } from './ServiceOfferings';

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
```

#### Educational Video Component (`src/components/retirement/RetirementVideo.tsx`)

```tsx
import React from 'react';
import { Typography, Box } from '@mui/material';

export const RetirementVideo: React.FC = () => {
  return (
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
};
```

#### Case Studies Component (`src/components/retirement/CaseStudies.tsx`)

```tsx
import React, { useState } from 'react';
import { Typography, Box, Tabs, Tab, Card, CardContent, CardHeader, Avatar } from '@mui/material';

interface CaseStudy {
  id: string;
  name: string;
  age: number;
  profession: string;
  challenge: string;
  solution: string;
  outcome: string;
  testimonial: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: '1',
    name: 'Michael R.',
    age: 52,
    profession: 'Former Marketing Executive',
    challenge: 'Facing job loss after 20 years at the same company with inadequate retirement savings.',
    solution: 'Optimized 401(k) rollover, created a diversified portfolio, and secured a new position with our career services.',
    outcome: 'Increased retirement readiness score from 64% to 92% and landed a new role with 15% higher compensation.',
    testimonial: 'MaxJobOffers didn't just help me find a new job – they transformed my financial future.'
  },
  {
    id: '2',
    name: 'Jennifer T.',
    age: 45,
    profession: 'IT Project Manager',
    challenge: 'Multiple retirement accounts from previous employers with no coherent strategy.',
    solution: 'Consolidated accounts, optimized asset allocation, and improved LinkedIn profile to attract better opportunities.',
    outcome: 'Reduced fees by 0.8%, increased projected retirement income by 24%, and received 3 job offers within 60 days.',
    testimonial: 'The dual approach to my career and retirement planning was exactly what I needed at this stage of my life.'
  },
  {
    id: '3',
    name: 'Robert K.',
    age: 58,
    profession: 'Healthcare Administrator',
    challenge: 'Needed to maximize earnings in final working years while preparing for retirement within 7 years.',
    solution: 'Created a catch-up contribution strategy, optimized job search for higher-paying positions, and developed a retirement income plan.',
    outcome: 'Secured a position with a 22% salary increase and increased retirement savings by $215,000 over 5 years.',
    testimonial: 'I never thought I could significantly improve my retirement outlook this late in my career. The team proved me wrong.'
  }
];

export const CaseStudies: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Success Stories
      </Typography>
      
      <Tabs 
        value={selectedTab} 
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {caseStudies.map((study, index) => (
          <Tab key={study.id} label={study.name} id={`case-study-tab-${index}`} />
        ))}
      </Tabs>
      
      {caseStudies.map((study, index) => (
        <Box
          key={study.id}
          role="tabpanel"
          hidden={selectedTab !== index}
          id={`case-study-tabpanel-${index}`}
        >
          {selectedTab === index && (
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {study.name.charAt(0)}
                  </Avatar>
                }
                title={`${study.name}, ${study.age}`}
                subheader={study.profession}
              />
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Challenge:
                </Typography>
                <Typography variant="body2" paragraph>
                  {study.challenge}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Our Solution:
                </Typography>
                <Typography variant="body2" paragraph>
                  {study.solution}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Outcome:
                </Typography>
                <Typography variant="body2" paragraph>
                  {study.outcome}
                </Typography>
                
                <Typography variant="body1" color="primary" sx={{ fontStyle: 'italic', mt: 2 }}>
                  "{study.testimonial}"
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      ))}
    </Box>
  );
};
```

#### Incentive Calculator (`src/components/retirement/IncentiveCalculator.tsx`)

```tsx
import React, { useState, useEffect } from 'react';
import { Typography, Box, Slider, TextField, Paper, Grid, InputAdornment } from '@mui/material';

export const IncentiveCalculator: React.FC = () => {
  const [rolloverAmount, setRolloverAmount] = useState<number>(100000);
  const [incentiveAmount, setIncentiveAmount] = useState<number>(0);
  
  // Calculate incentive based on tiered structure
  useEffect(() => {
    let calculatedIncentive = 0;
    
    if (rolloverAmount >= 50000 && rolloverAmount < 100000) {
      calculatedIncentive = 500;
    } else if (rolloverAmount >= 100000 && rolloverAmount < 250000) {
      calculatedIncentive = 1000;
    } else if (rolloverAmount >= 250000 && rolloverAmount < 500000) {
      calculatedIncentive = 2000;
    } else if (rolloverAmount >= 500000 && rolloverAmount < 1000000) {
      calculatedIncentive = 3000;
    } else if (rolloverAmount >= 1000000) {
      calculatedIncentive = 4000;
    }
    
    setIncentiveAmount(calculatedIncentive);
  }, [rolloverAmount]);
  
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setRolloverAmount(newValue as number);
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value.replace(/[^0-9]/g, ''));
    setRolloverAmount(value);
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Rollover Incentive Calculator
      </Typography>
      
      <Typography variant="body1" paragraph>
        See how much you could receive when you roll over your retirement accounts to our firm.
      </Typography>
      
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            label="Rollover Amount"
            value={rolloverAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            onChange={handleInputChange}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <Slider
            value={rolloverAmount}
            onChange={handleSliderChange}
            min={0}
            max={1500000}
            step={10000}
            aria-labelledby="rollover-amount-slider"
            sx={{ mt: 3 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption">$0</Typography>
            <Typography variant="caption">$500K</Typography>
            <Typography variant="caption">$1M+</Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Your Incentive Amount
            </Typography>
            <Typography variant="h3">
              ${incentiveAmount.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              *Subject to 12-month holding period and other terms
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Incentive Tiers:
        </Typography>
        <Typography variant="body2">
          • $50,000 – $99,999: $500 incentive<br />
          • $100,000 – $249,999: $1,000 incentive<br />
          • $250,000 – $499,999: $2,000 incentive<br />
          • $500,000 – $999,999: $3,000 incentive<br />
          • $1,000,000 and above: $4,000 incentive (maximum)
        </Typography>
      </Box>
    </Box>
  );
};
```

#### Service Offerings (`src/components/retirement/ServiceOfferings.tsx`)

```tsx
import React from 'react';
import { Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const ServiceOfferings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        What You'll Receive
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        When you work with our retirement planning team:
      </Typography>
      
      <List>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Comprehensive Retirement Plan" 
            secondary="Personalized analysis and recommendations for your retirement goals"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Investment Portfolio Review" 
            secondary="Analysis of your current investments with optimization recommendations"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Income Strategy" 
            secondary="Plan for generating reliable income during retirement"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Tax Efficiency Analysis" 
            secondary="Strategies to minimize tax impact on your retirement savings"
          />
        </ListItem>
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Plus, get FREE access to our premium career services:
      </Typography>
      
      <List>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="secondary" />
          </ListItemIcon>
          <ListItemText 
            primary="Professional Resume Rewrite" 
            secondary="Our experts will completely rewrite your resume for maximum impact"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="secondary" />
          </ListItemIcon>
          <ListItemText 
            primary="LinkedIn Profile Optimization" 
            secondary="Complete LinkedIn makeover to attract recruiters and opportunities"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="secondary" />
          </ListItemIcon>
          <ListItemText 
            primary="1-on-1 Interview Coaching" 
            secondary="Personalized interview preparation with industry experts"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="secondary" />
          </ListItemIcon>
          <ListItemText 
            primary="Job Search Strategy" 
            secondary="Custom job search plan tailored to your career goals"
          />
        </ListItem>
      </List>
    </Box>
  );
};
```

#### Onboarding Form (`src/components/retirement/OnboardingForm.tsx`)

```tsx
import React, { useState } from 'react';
import { 
  Typography, Box, Paper, Stepper, Step, StepLabel, Button, 
  TextField, Grid, FormControlLabel, Checkbox, Alert
} from '@mui/material';
import { DocumentUpload } from './DocumentUpload';
import { MeetingScheduler } from './MeetingScheduler';

const steps = ['Personal Information', 'Financial Information', 'Document Upload', 'Schedule Meeting'];

const OnboardingForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    age: '',
    retirementAge: '',
    currentSavings: '',
    monthlyContribution: '',
    employerMatch: '',
    hasAdvisor: false,
    consentToContact: false
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [meetingTime, setMeetingTime] = useState<Date | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const validateCurrentStep = () => {
    const errors: string[] = [];
    
    if (activeStep === 0) {
      if (!formData.firstName) errors.push('First name is required');
      if (!formData.lastName) errors.push('Last name is required');
      if (!formData.email) errors.push('Email is required');
      if (!formData.phone) errors.push('Phone number is required');
    } else if (activeStep === 1) {
      if (!formData.age) errors.push('Current age is required');
      if (!formData.retirementAge) errors.push('Expected retirement age is required');
      if (!formData.currentSavings) errors.push('Current retirement savings is required');
    } else if (activeStep === 2) {
      if (documents.length === 0) errors.push('Please upload at least one retirement account statement');
    } else if (activeStep === 3) {
      if (!meetingTime) errors.push('Please select a meeting time');
      if (!formData.consentToContact) errors.push('You must consent to be contacted');
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };
  
  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = async () => {
    if (validateCurrentStep()) {
      try {
        // Submit form data, documents, and meeting time to backend
        console.log('Form submitted:', { formData, documents, meetingTime });
        
        // Move to completion step
        setActiveStep(steps.length);
      } catch (error) {
        console.error('Error submitting form:', error);
        setFormErrors(['There was an error submitting your information. Please try again.']);
      }
    }
  };
  
  const handleDocumentsChange = (files: File[]) => {
    setDocuments(files);
  };
  
  const handleMeetingSelect = (date: Date) => {
    setMeetingTime(date);
  };
  
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="state"
                label="State"
                value={formData.state}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="zip"
                label="ZIP Code"
                value={formData.zip}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="age"
                label="Current Age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="retirementAge"
                label="Expected Retirement Age"
                type="number"
                value={formData.retirementAge}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="currentSavings"
                label="Current Retirement Savings"
                type="number"
                value={formData.currentSavings}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="monthlyContribution"
                label="Monthly Contribution"
                type="number"
                value={formData.monthlyContribution}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="employerMatch"
                label="Employer Match (%)"
                type="number"
                value={formData.employerMatch}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  endAdornment: <span>%</span>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="hasAdvisor"
                    checked={formData.hasAdvisor}
                    onChange={handleChange}
                  />
                }
                label="I currently work with a financial advisor"
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <DocumentUpload onDocumentsChange={handleDocumentsChange} />
        );
      case 3:
        return (
          <>
            <MeetingScheduler onMeetingSelect={handleMeetingSelect} />
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="consentToContact"
                    checked={formData.consentToContact}
                    onChange={handleChange}
                    required
                  />
                }
                label="I consent to be contacted by a retirement planning specialist"
              />
            </Box>
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Get Started with Your Retirement Plan
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === steps.length ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Thank You!
            </Typography>
            <Typography variant="body1" paragraph>
              Your information has been submitted successfully. A retirement planning specialist will contact you soon to confirm your appointment on {meetingTime?.toLocaleDateString()} at {meetingTime?.toLocaleTimeString()}.
            </Typography>
            <Typography variant="body1">
              In the meantime, you have full access to all our premium job search and career tools!
            </Typography>
          </Box>
        ) : (
          <>
            {formErrors.length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}
            
            {renderStepContent()}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default OnboardingForm;
```

#### Document Upload Component (`src/components/retirement/DocumentUpload.tsx`)

```tsx
import React, { useState } from 'react';
import { Typography, Box, Button, List, ListItem, ListItemIcon, ListItemText, IconButton, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';

interface DocumentUploadProps {
  onDocumentsChange: (files: File[]) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentsChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onDocumentsChange(updatedFiles);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onDocumentsChange(updatedFiles);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Your Retirement Account Statements
      </Typography>
      
      <Typography variant="body1" paragraph>
        Please upload your most recent retirement account statements (401(k), IRA, etc.) to help us create your personalized retirement plan.
      </Typography>
      
      <Paper sx={{ p: 3, bgcolor: 'background.default', textAlign: 'center', mb: 3 }}>
        <input
          accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx"
          style={{ display: 'none' }}
          id="upload-retirement-documents"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="upload-retirement-documents">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Upload Documents
          </Button>
        </label>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Accepted formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
        </Typography>
      </Paper>
      
      {files.length > 0 && (
        <List>
          {files.map((file, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
              />
            </ListItem>
          ))}
        </List>
      )}
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Why we need these documents:
        </Typography>
        <Typography variant="body2">
          Your retirement account statements help us understand your current financial situation and create a personalized retirement plan. We'll analyze your current investments, asset allocation, fees, and potential growth to provide tailored recommendations.
        </Typography>
      </Box>
    </Box>
  );
};
