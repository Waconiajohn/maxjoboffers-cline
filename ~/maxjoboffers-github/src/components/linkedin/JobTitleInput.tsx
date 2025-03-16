import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface JobTitleInputProps {
  onJobTitlesChange?: (jobTitles: string[]) => void;
  initialJobTitles?: string[];
}

/**
 * Job Title Input Component
 * 
 * This component provides a UI for adding and managing job titles for LinkedIn profile creation.
 */
const JobTitleInput: React.FC<JobTitleInputProps> = ({ 
  onJobTitlesChange,
  initialJobTitles = []
}) => {
  const [jobTitles, setJobTitles] = useState<string[]>(initialJobTitles);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update job titles when initialJobTitles changes
  useEffect(() => {
    if (initialJobTitles.length > 0 && jobTitles.length === 0) {
      setJobTitles(initialJobTitles);
    }
  }, [initialJobTitles]);

  const updateJobTitles = (newJobTitles: string[]) => {
    setJobTitles(newJobTitles);
    onJobTitlesChange?.(newJobTitles);
  };

  const handleAdd = () => {
    if (currentInput.trim()) {
      const newJobTitles = [...jobTitles, currentInput.trim()];
      updateJobTitles(newJobTitles);
      setCurrentInput("");
      handleGetSuggestions(currentInput.trim());
    }
  };

  const handleRemove = (index: number) => {
    const newJobTitles = jobTitles.filter((_, i) => i !== index);
    updateJobTitles(newJobTitles);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!jobTitles.includes(suggestion)) {
      const newJobTitles = [...jobTitles, suggestion];
      updateJobTitles(newJobTitles);
      setSuggestions(prev => prev.filter(s => s !== suggestion));
    }
  };

  const handleGetSuggestions = async (newJobTitle?: string) => {
    try {
      setIsLoading(true);
      const currentTitles = newJobTitle 
        ? [...jobTitles, newJobTitle]
        : jobTitles;

      if (currentTitles.length === 0) {
        return;
      }

      // In a real implementation, this would call an AI service
      // For now, we'll simulate suggestions
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate some related job titles based on the current ones
      const baseSuggestions = [
        "Senior " + (currentTitles[0] || "Developer"),
        "Lead " + (currentTitles[0] || "Engineer"),
        currentTitles[0]?.includes("Senior") ? currentTitles[0].replace("Senior", "Principal") : "Principal Engineer",
        "Technical " + (currentTitles[0]?.includes("Manager") ? "Director" : "Manager"),
        currentTitles[0] + " Specialist"
      ];
      
      // Filter out any suggestions that are already in the job titles
      const newSuggestions = baseSuggestions
        .filter(s => s && !currentTitles.includes(s));
      
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error getting job title suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Job Titles</Typography>
      
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="Enter job title"
          onKeyPress={handleKeyPress}
          size="small"
        />
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAdd}
          sx={{ ml: 1 }}
        >
          <AddIcon />
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {jobTitles.map((title, index) => (
          <Chip
            key={index}
            label={title}
            onDelete={() => handleRemove(index)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>

      {suggestions.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>Suggested Job Titles:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                variant="outlined"
                clickable
                color="secondary"
                icon={<AddIcon />}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default JobTitleInput;
