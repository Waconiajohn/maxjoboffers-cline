import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  CircularProgress, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { interviewPrepService } from '../../services/interviewPrep';
import { 
  InterviewPrepRequest, 
  InterviewPrepResponse, 
  InterviewType, 
  DifficultyLevel 
} from '../../types/interviewPrep';

interface InterviewPrepGeneratorProps {
  userId: string;
  resumeId?: string;
  jobDescription?: string;
  onPrepGenerated?: (prep: InterviewPrepResponse) => void;
}

const InterviewPrepGenerator: React.FC<InterviewPrepGeneratorProps> = ({
  userId,
  resumeId,
  jobDescription: initialJobDescription,
  onPrepGenerated
}) => {
  const [jobDescription, setJobDescription] = useState(initialJobDescription || '');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [interviewType, setInterviewType] = useState<InterviewType>(InterviewType.BEHAVIORAL);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(DifficultyLevel.MEDIUM);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [newFocusArea, setNewFocusArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [generatedPrep, setGeneratedPrep] = useState<InterviewPrepResponse | null>(null);

  useEffect(() => {
    if (initialJobDescription) {
      setJobDescription(initialJobDescription);
    }
  }, [initialJobDescription]);

  const handleAddFocusArea = () => {
    if (newFocusArea.trim() && !focusAreas.includes(newFocusArea.trim())) {
      setFocusAreas([...focusAreas, newFocusArea.trim()]);
      setNewFocusArea('');
    }
  };

  const handleRemoveFocusArea = (areaToRemove: string) => {
    setFocusAreas(focusAreas.filter(area => area !== areaToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFocusArea();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobDescription.trim()) {
      setError('Job description is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const request: InterviewPrepRequest = {
        userId,
        jobDescription,
        jobTitle: jobTitle.trim() || undefined,
        company: company.trim() || undefined,
        resumeId,
        interviewType,
        difficultyLevel,
        focusAreas: focusAreas.length > 0 ? focusAreas : undefined
      };
      
      const response = await interviewPrepService.generateInterviewPrep(request);
      
      setGeneratedPrep(response);
      setSuccess(true);
      
      if (onPrepGenerated) {
        onPrepGenerated(response);
      }
    } catch (err) {
      console.error('Error generating interview prep:', err);
      setError('Failed to generate interview preparation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Generate Interview Preparation
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Job Title"
              fullWidth
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Company"
              fullWidth
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Tech Innovations Inc."
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Job Description"
              multiline
              rows={6}
              fullWidth
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              error={!jobDescription.trim()}
              helperText={!jobDescription.trim() ? 'Job description is required' : ''}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Interview Type</InputLabel>
              <Select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                label="Interview Type"
              >
                <MenuItem value={InterviewType.BEHAVIORAL}>Behavioral</MenuItem>
                <MenuItem value={InterviewType.TECHNICAL}>Technical</MenuItem>
                <MenuItem value={InterviewType.CASE_STUDY}>Case Study</MenuItem>
                <MenuItem value={InterviewType.SITUATIONAL}>Situational</MenuItem>
                <MenuItem value={InterviewType.PANEL}>Panel</MenuItem>
                <MenuItem value={InterviewType.PHONE_SCREEN}>Phone Screen</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value as DifficultyLevel)}
                label="Difficulty Level"
              >
                <MenuItem value={DifficultyLevel.EASY}>Easy</MenuItem>
                <MenuItem value={DifficultyLevel.MEDIUM}>Medium</MenuItem>
                <MenuItem value={DifficultyLevel.HARD}>Hard</MenuItem>
                <MenuItem value={DifficultyLevel.EXPERT}>Expert</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Focus Areas (Optional)
            </Typography>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                label="Add Focus Area"
                value={newFocusArea}
                onChange={(e) => setNewFocusArea(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
                placeholder="e.g. Leadership, Problem Solving, React"
              />
              <Button 
                variant="contained" 
                onClick={handleAddFocusArea}
                disabled={!newFocusArea.trim()}
                sx={{ ml: 1 }}
              >
                Add
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {focusAreas.map((area) => (
                <Chip
                  key={area}
                  label={area}
                  onDelete={() => handleRemoveFocusArea(area)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || !jobDescription.trim()}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
              fullWidth
            >
              {loading ? 'Generating...' : 'Generate Interview Prep'}
            </Button>
          </Grid>
        </Grid>
      </form>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Interview preparation generated successfully!
        </Alert>
      </Snackbar>
      
      {generatedPrep && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Generated Interview Preparation
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Your interview preparation has been generated and saved. You can view it in the Interview Prep section.
          </Typography>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => {
              if (onPrepGenerated && generatedPrep) {
                onPrepGenerated(generatedPrep);
              }
            }}
          >
            View Preparation
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default InterviewPrepGenerator;
