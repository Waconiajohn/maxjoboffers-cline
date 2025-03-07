# MaxJobOffers Implementation Details

This document provides detailed implementation specifications for each component of the MaxJobOffers application.

## Table of Contents

1. [Resume Management System](#resume-management-system)
2. [Job Search and Application](#job-search-and-application)
3. [Cover Letter Generation](#cover-letter-generation)
4. [Interview Preparation System](#interview-preparation-system)
5. [LinkedIn Tools](#linkedin-tools)
6. [Financial Planning Section](#financial-planning-section)
7. [User Management and Authentication](#user-management-and-authentication)
8. [Payment and Subscription System](#payment-and-subscription-system)

## Resume Management System

### Backend API Endpoints

#### Resume Upload
```typescript
// POST /api/resume/upload
export const uploadResume = async (req, res) => {
  try {
    const { file, title } = req.body;
    const userId = req.user.id;
    
    // Upload file to S3
    const fileKey = `resumes/${userId}/${Date.now()}-${file.name}`;
    const uploadResult = await uploadFileToS3(file, fileKey);
    
    // Parse resume content
    const content = await parseResumeContent(file);
    
    // Create resume record
    const resume = await prisma.resume.create({
      data: {
        title,
        content,
        fileUrl: uploadResult.url,
        user: { connect: { id: userId } }
      }
    });
    
    return res.status(200).json(resume);
  } catch (error) {
    console.error('Error uploading resume:', error);
    return res.status(500).json({ error: 'Failed to upload resume' });
  }
};
```

#### Resume Analysis
```typescript
// POST /api/resume/analyze
export const analyzeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    const userId = req.user.id;
    
    // Check user credits/subscription
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    const hasCredits = user.credits > 0;
    const hasValidSubscription = hasActiveSubscription(user);
    
    if (!hasCredits && !hasValidSubscription) {
      return res.status(402).json({ error: 'Insufficient credits or subscription' });
    }
    
    // Get resume
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId }
    });
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Use OpenAI for analysis
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert resume reviewer with deep experience in executive hiring."
        },
        {
          role: "user",
          content: `Analyze this resume for a job with the following description: ${jobDescription}\n\nResume content: ${resume.content}`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "analyzeResume",
            description: "Analyzes a resume against a job description",
            parameters: {
              type: "object",
              properties: {
                matchScore: {
                  type: "number",
                  description: "Score from 0-100 indicating how well the resume matches the job description"
                },
                strengths: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of resume strengths"
                },
                weaknesses: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of resume weaknesses"
                },
                improvementSuggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      section: { type: "string" },
                      suggestion: { type: "string" },
                      reason: { type: "string" }
                    }
                  },
                  description: "Specific suggestions for improvement"
                }
              },
              required: ["matchScore", "strengths", "weaknesses", "improvementSuggestions"]
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "analyzeResume" }
      }
    });
    
    // Decrement user credits if not on subscription
    if (!hasValidSubscription) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } }
      });
    }
    
    const analysisArgs = completion.choices[0]?.message?.tool_calls?.[0]?.function.arguments;
    if (!analysisArgs) {
      return res.status(500).json({ error: 'Failed to analyze resume' });
    }
    
    return res.status(200).json(JSON.parse(analysisArgs));
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return res.status(500).json({ error: 'Failed to analyze resume' });
  }
};
```

### Frontend Components

#### Resume Upload Component
```tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

export const ResumeUploader = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.split('.')[0]);
    
    try {
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }
      
      const resume = await response.json();
      onUploadComplete(resume);
    } catch (err) {
      setError('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });
  
  return (
    <Box
      {...getRootProps()}
      sx={{
        p: 3,
        textAlign: 'center',
        backgroundColor: isDragActive ? '#f0f7ff' : 'white',
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'grey.300',
        borderRadius: 2,
        cursor: 'pointer'
      }}
    >
      <input {...getInputProps()} />
      <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Supported formats: PDF, DOCX
      </Typography>
      {isUploading && <CircularProgress sx={{ mt: 2 }} />}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};
```

#### Resume Analysis Component
```tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Paper, Grid } from '@mui/material';

export const ResumeAnalyzer = ({ resumeId }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  
  const handleAnalyzeResume = async () => {
    if (!resumeId || !jobDescription) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeId,
          jobDescription
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }
      
      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={6}
        label="Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste job description here..."
        sx={{ mb: 2 }}
      />
      
      <Button
        variant="contained"
        onClick={handleAnalyzeResume}
        disabled={isAnalyzing || !jobDescription}
        sx={{ mb: 3 }}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
      </Button>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {analysis && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Analysis Results
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Match Score: {analysis.matchScore}%
            </Typography>
            <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 10 }}>
              <Box
                sx={{
                  width: `${analysis.matchScore}%`,
                  bgcolor: 'primary.main',
                  borderRadius: 1,
                  height: 10
                }}
              />
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="success.main" gutterBottom>
                Strengths
              </Typography>
              <ul>
                {analysis.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="error.main" gutterBottom>
                Weaknesses
              </Typography>
              <ul>
                {analysis.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Improvement Suggestions
            </Typography>
            {analysis.improvementSuggestions.map((suggestion, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'primary.50' }}>
                <Typography variant="subtitle2">{suggestion.section}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {suggestion.suggestion}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Why: {suggestion.reason}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};
```

## Job Search and Application

### Backend API Endpoints

#### Job Search
```typescript
// POST /api/jobs/search
export const searchJobs = async (req, res) => {
  try {
    const { query, location, radius, filters } = req.body;
    const userId = req.user.id;
    
    // Call Google Jobs API
    const apiKey = process.env.GOOGLE_JOBS_API_KEY;
    const response = await axios.get('https://jobs.googleapis.com/v4/jobs:search', {
      params: {
        query,
        location,
        radius,
        ...filters
      },
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    // Transform and store jobs
    const jobs = await Promise.all(response.data.jobs.map(async (job) => {
      // Check if job already exists
      let existingJob = await prisma.job.findFirst({
        where: { 
          title: job.title,
          company: job.company,
          location: job.location
        }
      });
      
      if (!existingJob) {
        existingJob = await prisma.job.create({
          data: {
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            requirements: job.requirements,
            salary: job.salary,
            applicationUrl: job.applicationUrl,
            source: 'google'
          }
        });
      }
      
      return existingJob;
    }));
    
    return res.status(200).json({
      jobs,
      totalCount: response.data.totalCount,
      nextPageToken: response.data.nextPageToken
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    return res.status(500).json({ error: 'Failed to search jobs' });
  }
};
```

#### Job Application
```typescript
// POST /api/jobs/apply
export const applyToJob = async (req, res) => {
  try {
    const { jobId, resumeId, coverLetterId } = req.body;
    const userId = req.user.id;
    
    // Create application record
    const application = await prisma.jobApplication.create({
      data: {
        user: { connect: { id: userId } },
        job: { connect: { id: jobId } },
        resume: resumeId ? { connect: { id: resumeId } } : undefined,
        coverLetter: coverLetterId ? { connect: { id: coverLetterId } } : undefined,
        status: 'applied'
      }
    });
    
    return res.status(200).json(application);
  } catch (error) {
    console.error('Error applying to job:', error);
    return res.status(500).json({ error: 'Failed to apply to job' });
  }
};
```

### Frontend Components

#### Job Search Component
```tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Slider, Typography, Card, CardContent } from '@mui/material';
import { Search as SearchIcon, LocationOn as LocationIcon, FilterList as FilterIcon } from '@mui/icons-material';

export const JobSearch = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: '',
    radius: 25,
    filters: {
      workType: 'all',
      datePosted: 'all',
      minSalary: 0,
      maxSalary: 500000
    }
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchParams)
      });
      
      if (!response.ok) {
        throw new Error('Failed to search jobs');
      }
      
      const result = await response.json();
      setJobs(result.jobs);
    } catch (err) {
      setError('Failed to search jobs. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleFilterChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSearchParams(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSearchParams(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Job Title / Keywords"
            value={searchParams.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Location"
            value={searchParams.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            InputProps={{
              startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={isSearching}
              sx={{ flexGrow: 1 }}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterIcon />}
            >
              Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {showFilters && (
        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Work Type</InputLabel>
                <Select
                  value={searchParams.filters.workType}
                  onChange={(e) => handleFilterChange('filters.workType', e.target.value)}
                  label="Work Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="remote">Remote</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                  <MenuItem value="onsite">On-site</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Date Posted</InputLabel>
                <Select
                  value={searchParams.filters.datePosted}
                  onChange={(e) => handleFilterChange('filters.datePosted', e.target.value)}
                  label="Date Posted"
                >
                  <MenuItem value="all">Any Time</MenuItem>
                  <MenuItem value="today">Past 24 hours</MenuItem>
                  <MenuItem value="week">Past Week</MenuItem>
                  <MenuItem value="month">Past Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Radius (miles)</Typography>
              <Slider
                value={searchParams.radius}
                onChange={(e, value) => handleFilterChange('radius', value)}
                min={5}
                max={100}
                step={5}
                marks={[
                  { value: 5, label: '5' },
                  { value: 25, label: '25' },
                  { value: 50, label: '50' },
                  { value: 100, label: '100' }
                ]}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography gutterBottom>Salary Range</Typography>
              <Slider
                value={[searchParams.filters.minSalary, searchParams.filters.maxSalary]}
                onChange={(e, value) => {
                  const [min, max] = value;
                  handleFilterChange('filters.minSalary', min);
                  handleFilterChange('filters.maxSalary', max);
                }}
                min={0}
                max={500000}
                step={10000}
                marks={[
                  { value: 0, label: '$0' },
                  { value: 100000, label: '$100k' },
                  { value: 250000, label: '$250k' },
                  { value: 500000, label: '$500k' }
                ]}
              />
            </Grid>
          </Grid>
        </Box>
      )}
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box>
        {jobs.map((job) => (
          <Card key={job.id} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography color="text.secondary">{job.company}</Typography>
                  <Typography color="text.secondary">{job.location}</Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {job.description.substring(0, 200)}...
                    </Typography>
                    
                    {job.salary && (
                      <Typography variant="body2">
                        Salary: ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Button
                    variant="contained"
                    sx={{ mb: 1 }}
                    onClick={() => {/* Handle apply */}}
                  >
                    Apply
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => {/* Handle save */}}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
        
        {jobs.length === 0 && !isSearching && (
          <Typography align="center" color="text.secondary">
            No jobs found. Try adjusting your search criteria.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
```

## Cover Letter Generation

### Backend API Endpoints

#### Generate Cover Letter
```typescript
// POST /api/cover-letter/generate
export const generateCoverLetter = async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;
    const userId = req.user.id;
    
    // Check user credits/subscription
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    const hasCredits = user.credits > 0;
    const hasValidSubscription = hasActiveSubscription(user);
    
    if (!hasCredits && !hasValidSubscription) {
      return res.status(402).json({ error: 'Insufficient credits or subscription' });
    }
    
    // Get resume and job
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId }
    });
    
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });
    
    if (!resume || !job) {
      return res.status(404).json({ error: 'Resume or job not found' });
    }
    
    // Use OpenAI to generate cover letter
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert cover letter writer for executives."
        },
        {
          role: "user",
          content: `Generate a professional cover letter for the following job: ${job.title} at ${job.company}. Job description: ${job.description}. Using this resume: ${resume.content}`
        }
      ]
    });
    
    const coverLetterContent = completion.choices[0]?.message?.content;
    if (!coverLetterContent) {
      return res.status(500).json({ error: 'Failed to generate cover letter' });
    }
    
    // Decrement user credits if not on subscription
    if (!hasValidSubscription) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } }
      });
    }
    
    // Create cover letter
    const coverLetter = await prisma.coverLetter.create({
      data: {
        title: `Cover Letter for ${job.title} at ${job.company}`,
        content: coverLetterContent,
        user: { connect: { id: userId } }
      }
    });
    
    return res.status(200).json(coverLetter);
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return res.status(500).json({ error: 'Failed to generate cover letter' });
  }
};
```

### Frontend Components

#### Cover Letter Generator Component
```tsx
import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export const CoverLetterGenerator = ({ jobId, resumes }) => {
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const handleGenerateCoverLetter = async () => {
    if (!jobId || !selectedResumeId) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          jobId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate cover letter');
      }
      
      const result = await response.json();
      setCoverLetter(result);
    } catch (err) {
      setError('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Generate Cover Letter
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Resume</InputLabel>
        <Select
          value={selectedResumeId}
          onChange={(e) => setSelectedResumeId(e.target.value)}
          label="Select Resume"
        >
          {resumes.map((resume) => (
            <MenuItem key={resume.id} value={resume.id}>
              {resume.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Button
        variant="contained"
        onClick={handleGenerateCoverLetter}
        disabled={isGenerating || !selectedResumeId}
        sx={{ mb: 3 }}
      >
        {isGenerating ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            Generating...
          </>
        ) : (
          'Generate Cover Letter'
        )}
      </Button>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {coverLetter && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {coverLetter.title}
          </Typography>
          
          <Box sx={{ whiteSpace: 'pre-wrap' }}>
            {coverLetter.content}
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => {/* Handle edit */}}>
              Edit
            </Button>
            
            <Button variant="outlined" onClick={() => {/* Handle download */}}>
              Download
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};
```

## Interview Preparation System

### Backend API Endpoints

#### Create Mock Interview
```typescript
// POST /api/interviews/create
export const createMockInterview = async (req, res) => {
  try {
    const { jobApplicationId, type } = req.body;
    const userId = req.user.id;
    
    // Get job application
    const jobApplication = await prisma.jobApplication.findUnique({
      where: { id: jobApplicationId },
      include: { job: true }
    });
    
    if (!jobApplication) {
      return res.status(404).json({ error: 'Job application not found' });
    }
    
    // Use OpenAI to generate questions
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert interviewer for ${type} interviews.`
        },
        {
          role: "user",
          content: `Generate 5 ${type} interview questions for a ${jobApplication.job.title} position at ${jobApplication.job.company}. Job description: ${jobApplication.job.description}`
        }
      ],
      tools
