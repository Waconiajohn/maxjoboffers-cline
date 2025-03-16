import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface SectionSelectorProps {
  onSelect: (section: string) => void;
  completedSections: string[];
  activeSection: string;
}

const sections = [
  "Headline",
  "About",
  "Experience",
  "Education",
  "Skills",
  "Projects",
  "Licenses & Certifications",
  "Volunteer Experience",
  "Recommendations",
];

/**
 * Section Selector Component
 * 
 * This component provides a UI for selecting different sections of a LinkedIn profile.
 */
const SectionSelector: React.FC<SectionSelectorProps> = ({ 
  onSelect, 
  completedSections, 
  activeSection 
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Profile Sections</Typography>
      <List>
        {sections.map((section) => (
          <ListItem
            key={section}
            button
            selected={activeSection === section}
            onClick={() => onSelect(section)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              bgcolor: activeSection === section ? 'primary.main' : 'transparent',
              color: activeSection === section ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                bgcolor: activeSection === section ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            <ListItemText primary={section} />
            {completedSections.includes(section) && (
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <CheckCircleIcon 
                  color={activeSection === section ? 'inherit' : 'primary'} 
                  fontSize="small" 
                />
              </ListItemIcon>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SectionSelector;
