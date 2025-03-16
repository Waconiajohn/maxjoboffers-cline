import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import PromptWindow from './PromptWindow';

interface ContentEditorProps {
  section: string;
  onSave: (content: string) => void;
  jobTitles?: string[];
  industries?: string[];
  resumeContent?: string;
}

/**
 * Content Editor Component
 * 
 * This component provides a UI for editing LinkedIn profile content with AI assistance.
 */
const ContentEditor: React.FC<ContentEditorProps> = ({ 
  section, 
  onSave, 
  jobTitles = [], 
  industries = [], 
  resumeContent = "" 
}) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    type: 'info'
  });

  const generateSectionPrompt = (section: string) => {
    const context = `
      Context:
      Resume Content: ${resumeContent}
      Job Titles: ${jobTitles.join(", ")}
      Industries: ${industries.join(", ")}
    `;

    let sectionSpecificPrompt = "";
    
    if (section === "Experience") {
      sectionSpecificPrompt = `
        1. FIRST, carefully locate the work history/experience section from the resume content.
        2. If found, extract and use that EXACT content as the primary source - do not modify or enhance it.
        3. If no experience section is found, only then create new content based on the job titles and industries.
        4. Return ONLY the experience content, preserving the original format and structure from the resume.
      `;
    } else if (section === "Education") {
      sectionSpecificPrompt = `
        1. FIRST, carefully locate the education section from the resume content.
        2. If found, extract and use that EXACT content as the primary source - do not modify or enhance it.
        3. If no education section is found, only then create new content based on the context provided.
        4. Return ONLY the education content, preserving the original format and structure from the resume.
      `;
    } else {
      sectionSpecificPrompt = `
        1. Analyze the resume content thoroughly for any information related to the "${section}" section
        2. Consider ALL provided job titles and their career levels
        3. Take into account ALL listed industries and their specific requirements
        
        If you find relevant ${section} content in the resume:
        - Use it as your primary source
        - Enhance it using insights from the job titles and industries
        - Optimize it for LinkedIn's format
        
        If no relevant ${section} content exists in the resume:
        - Start your response with "Suggested Content:"
        - Create appropriate content using ALL provided job titles and industries
        - Ensure suggestions align with the career level indicated by the job titles
      `;
    }

    return `${context}\n${sectionSpecificPrompt}\n\nReturn only the final content, with "Suggested Content:" prefix if appropriate.`;
  };

  const handleGenerateContent = async () => {
    try {
      setIsLoading(true);
      const prompt = generateSectionPrompt(section);
      
      // In a real implementation, this would call an AI service
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const simulatedResponse = `Suggested Content:
${section === 'Headline' 
  ? `${jobTitles[0] || 'Professional'} with expertise in ${industries[0] || 'Technology'}`
  : section === 'About'
  ? `Experienced ${jobTitles[0] || 'Professional'} with a passion for ${industries[0] || 'Technology'} and a track record of success.`
  : `This is simulated content for the ${section} section based on your job titles (${jobTitles.join(', ')}) and industries (${industries.join(', ')}).`
}`;
      
      setContent(simulatedResponse);
      
      setNotification({
        open: true,
        message: `New ${section} content has been generated.`,
        type: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to generate content. Please try again.',
        type: 'error'
      });
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setContent("");
  };

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
      setNotification({
        open: true,
        message: `${section} content has been saved successfully.`,
        type: 'success'
      });
    } else {
      setNotification({
        open: true,
        message: 'Please generate or enter content before saving.',
        type: 'warning'
      });
    }
  };

  const handleContentUpdate = (newContent: string) => {
    setContent(newContent);
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          minRows={6}
          maxRows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Enter your ${section} content here...`}
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleGenerateContent}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Content"}
        </Button>
        <Button 
          variant="outlined" 
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button 
          variant="contained" 
          color="success"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>

      <PromptWindow 
        activeSection={section}
        onContentUpdate={handleContentUpdate}
        currentContent={content}
        jobTitles={jobTitles}
        industries={industries}
        resumeContent={resumeContent}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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

export default ContentEditor;
