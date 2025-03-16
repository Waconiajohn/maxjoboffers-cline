import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Message as MessageIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

interface PromptWindowProps {
  activeSection: string;
  onContentUpdate?: (content: string) => void;
  currentContent?: string;
  jobTitles?: string[];
  industries?: string[];
  resumeContent?: string;
}

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
      id={`prompt-tabpanel-${index}`}
      aria-labelledby={`prompt-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * Prompt Window Component
 * 
 * This component provides a UI for interacting with AI prompts to generate LinkedIn profile content.
 */
const PromptWindow: React.FC<PromptWindowProps> = ({ 
  activeSection, 
  onContentUpdate,
  currentContent = "",
  jobTitles = [],
  industries = [],
  resumeContent = ""
}) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  // Sample prompts for different sections
  const sectionPrompts: Record<string, { basic: string[], advanced: string[] }> = {
    "Headline": {
      basic: [
        "Make it more concise",
        "Add industry keywords",
        "Highlight my expertise"
      ],
      advanced: [
        "Optimize for recruiters in my industry",
        "Make it more achievement-oriented",
        "Include my unique value proposition"
      ]
    },
    "About": {
      basic: [
        "Summarize my experience",
        "Make it more engaging",
        "Add relevant keywords"
      ],
      advanced: [
        "Tell a compelling career story",
        "Highlight my unique approach",
        "Focus on quantifiable achievements"
      ]
    },
    "Experience": {
      basic: [
        "Focus on achievements",
        "Add metrics and results",
        "Make it more concise"
      ],
      advanced: [
        "Highlight leadership experience",
        "Emphasize transferable skills",
        "Tailor to target industry"
      ]
    },
    "Skills": {
      basic: [
        "Add technical skills",
        "Add soft skills",
        "Prioritize most relevant skills"
      ],
      advanced: [
        "Align with industry standards",
        "Include emerging skills in my field",
        "Balance technical and soft skills"
      ]
    }
  };
  
  // Default prompts if section not found
  const defaultPrompts = {
    basic: [
      "Improve this section",
      "Make it more professional",
      "Add relevant keywords"
    ],
    advanced: [
      "Tailor to my target industry",
      "Make it more achievement-oriented",
      "Optimize for ATS systems"
    ]
  };
  
  const currentPrompts = sectionPrompts[activeSection] || defaultPrompts;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePromptSubmission = async (prompt: string) => {
    if (!prompt.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      
      const fullPrompt = `
        Context:
        Current Content: ${currentContent}
        Resume Content: ${resumeContent}
        Job Titles: ${jobTitles.join(", ")}
        Industries: ${industries.join(", ")}
        
        You are a professional LinkedIn profile writer.
        For the ${activeSection} section of a LinkedIn profile:
        1. Review ALL provided context above thoroughly
        2. ${prompt}
        3. Use ALL available information to make the content relevant and personalized
        4. If no relevant content exists in the resume, start with "Suggested Content:"
        
        Ensure the content is professional, engaging, and optimized for LinkedIn.
        Return only the formatted content without any additional explanations.
      `;
      
      // In a real implementation, this would call an AI service
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const simulatedResponse = `Suggested Content:
${activeSection === 'Headline' 
  ? `${jobTitles[0] || 'Professional'} with expertise in ${industries[0] || 'Technology'} | ${prompt}`
  : `This is simulated content for the ${activeSection} section based on your prompt: "${prompt}"`
}`;
      
      if (simulatedResponse && onContentUpdate) {
        onContentUpdate(simulatedResponse);
      }
    } catch (error) {
      console.error('Error processing prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setCustomPrompt(prompt);
    handlePromptSubmission(prompt);
  };

  const handleCustomPromptSubmit = () => {
    handlePromptSubmission(customPrompt);
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <MessageIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">AI Assistant</Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          placeholder="Enter your prompt here..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          color="primary"
          fullWidth
          onClick={handleCustomPromptSubmit}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
        >
          {isLoading ? "Processing..." : "Submit Prompt"}
        </Button>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="prompt tabs">
            <Tab label="Basic Prompts" />
            <Tab label="Advanced Prompts" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {currentPrompts.basic.map((prompt, index) => (
              <Button
                key={index}
                variant="outlined"
                size="small"
                onClick={() => handlePromptClick(prompt)}
                disabled={isLoading}
                sx={{ mb: 1 }}
              >
                {prompt}
              </Button>
            ))}
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {currentPrompts.advanced.map((prompt, index) => (
              <Button
                key={index}
                variant="outlined"
                size="small"
                onClick={() => handlePromptClick(prompt)}
                disabled={isLoading}
                sx={{ mb: 1 }}
              >
                {prompt}
              </Button>
            ))}
          </Box>
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default PromptWindow;
