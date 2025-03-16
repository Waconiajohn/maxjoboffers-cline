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

interface IndustryInputProps {
  onIndustriesChange?: (industries: string[]) => void;
  initialIndustries?: string[];
}

/**
 * Industry Input Component
 * 
 * This component provides a UI for adding and managing industries for LinkedIn profile creation.
 */
const IndustryInput: React.FC<IndustryInputProps> = ({ 
  onIndustriesChange,
  initialIndustries = []
}) => {
  const [industries, setIndustries] = useState<string[]>(initialIndustries);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update industries when initialIndustries changes
  useEffect(() => {
    if (initialIndustries.length > 0 && industries.length === 0) {
      setIndustries(initialIndustries);
    }
  }, [initialIndustries]);

  const updateIndustries = (newIndustries: string[]) => {
    setIndustries(newIndustries);
    onIndustriesChange?.(newIndustries);
  };

  const handleAdd = () => {
    if (currentInput.trim()) {
      const newIndustries = [...industries, currentInput.trim()];
      updateIndustries(newIndustries);
      setCurrentInput("");
      handleGetSuggestions(currentInput.trim());
    }
  };

  const handleRemove = (index: number) => {
    const newIndustries = industries.filter((_, i) => i !== index);
    updateIndustries(newIndustries);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!industries.includes(suggestion)) {
      const newIndustries = [...industries, suggestion];
      updateIndustries(newIndustries);
      setSuggestions(prev => prev.filter(s => s !== suggestion));
    }
  };

  const handleGetSuggestions = async (newIndustry?: string) => {
    try {
      setIsLoading(true);
      const currentIndustries = newIndustry 
        ? [...industries, newIndustry]
        : industries;

      if (currentIndustries.length === 0) {
        return;
      }

      // In a real implementation, this would call an AI service
      // For now, we'll simulate suggestions
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Common industries
      const allIndustries = [
        "Technology",
        "Software Development",
        "Information Technology",
        "Financial Services",
        "Healthcare",
        "Education",
        "Manufacturing",
        "Retail",
        "Marketing",
        "Consulting",
        "E-commerce",
        "Telecommunications",
        "Media",
        "Entertainment",
        "Automotive"
      ];
      
      // Filter out industries that are already selected
      const newSuggestions = allIndustries
        .filter(industry => !currentIndustries.includes(industry))
        .slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error getting industry suggestions:', error);
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
      <Typography variant="h6" gutterBottom>Industries</Typography>
      
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="Enter industry"
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
        {industries.map((industry, index) => (
          <Chip
            key={index}
            label={industry}
            onDelete={() => handleRemove(index)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>

      {suggestions.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>Suggested Industries:</Typography>
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

export default IndustryInput;
