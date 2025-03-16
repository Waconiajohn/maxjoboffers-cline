import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface UploadedFile {
  file: File;
  type: 'resume' | 'portfolio' | 'projects';
}

interface UploadAreaProps {
  onContentExtracted?: (content: string) => void;
}

/**
 * Upload Area Component
 * 
 * This component provides a UI for uploading resume and other documents for LinkedIn profile creation.
 */
const UploadArea: React.FC<UploadAreaProps> = ({ onContentExtracted }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    type: 'info'
  });

  const handleUpload = (e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'portfolio' | 'projects') => {
    e.preventDefault();
    
    let uploadedFile: File | null = null;
    
    if ('dataTransfer' in e) {
      uploadedFile = e.dataTransfer.files[0];
    } else if ('target' in e && e.target.files) {
      uploadedFile = e.target.files[0];
    }

    if (!uploadedFile) {
      setNotification({
        open: true,
        message: 'No file selected',
        type: 'error'
      });
      return;
    }

    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = uploadedFile.name.toLowerCase().substring(uploadedFile.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      setNotification({
        open: true,
        message: 'Please upload a PDF or Word document',
        type: 'error'
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (uploadedFile.size > maxSize) {
      setNotification({
        open: true,
        message: 'Maximum file size is 5MB',
        type: 'error'
      });
      return;
    }

    setFiles(prev => [...prev, { file: uploadedFile, type }]);
    
    // Call onContentExtracted when a file is uploaded
    if (type === 'resume' && onContentExtracted) {
      // In a real implementation, this would extract the content from the file
      // For now, we'll just pass the filename as a placeholder
      onContentExtracted(`Sample content extracted from ${uploadedFile.name}`);
    }

    setNotification({
      open: true,
      message: `${uploadedFile.name} uploaded successfully`,
      type: 'success'
    });
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const hasResume = files.some(f => f.type === 'resume');

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Upload Documents</Typography>
      
      {!hasResume ? (
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover'
            }
          }}
          onDrop={(e) => handleUpload(e, 'resume')}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('resume-upload')?.click()}
        >
          <input
            type="file"
            id="resume-upload"
            hidden
            onChange={(e) => handleUpload(e, 'resume')}
            accept=".pdf,.doc,.docx"
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>Upload your resume</Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop or click to upload
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Supported formats: PDF, DOC, DOCX (max 5MB)
          </Typography>
        </Box>
      ) : (
        <Box>
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
                  <DescriptionIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={file.file.name}
                  secondary={`${file.type} • ${(file.file.size / 1024).toFixed(1)} KB`}
                />
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => document.getElementById('portfolio-upload')?.click()}
            >
              Add Portfolio
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => document.getElementById('projects-upload')?.click()}
            >
              Add Project List
            </Button>
          </Box>
          
          <input
            type="file"
            id="portfolio-upload"
            hidden
            onChange={(e) => handleUpload(e, 'portfolio')}
            accept=".pdf,.doc,.docx"
          />
          <input
            type="file"
            id="projects-upload"
            hidden
            onChange={(e) => handleUpload(e, 'projects')}
            accept=".pdf,.doc,.docx"
          />
        </Box>
      )}

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

export default UploadArea;
