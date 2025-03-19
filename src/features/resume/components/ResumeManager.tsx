import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

// Import mock data service
import {
  ResumeVersion,
  JobRequirement,
  ValidationError,
  ResumeSection,
  fetchResumeVersions,
  fetchJobRequirements,
  createResumeVersion,
  updateResumeVersion,
  deleteResumeVersion
} from '../services/mockResumeData';

// Styles
const styles = {
  container: {
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
  },
  versionCard: {
    position: 'relative',
    p: 2,
    mb: 2,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    '&:hover': {
      borderColor: 'primary.main',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
  },
  sectionContainer: {
    position: 'relative',
    mb: 3,
    '&:hover .section-actions': {
      opacity: 1,
    },
  },
  sectionContent: {
    p: 2,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    minHeight: 100,
  },
  sectionActions: {
    position: 'absolute',
    right: 8,
    top: 8,
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  dragHandle: {
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing',
    },
  },
};

// Resume Manager Component
const ResumeManager: React.FC = () => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<ResumeVersion | null>(null);
  const [requirements, setRequirements] = useState<JobRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [versionsData, requirementsData] = await Promise.all([
          fetchResumeVersions(),
          fetchJobRequirements(),
        ]);
        setVersions(versionsData);
        setRequirements(requirementsData);
      } catch (err) {
        setError('Failed to load resume data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateVersion = async () => {
    try {
      const newVersion = await createResumeVersion('New Version');
      setVersions([...versions, newVersion]);
    } catch (err) {
      setError('Failed to create new version');
    }
  };

  const handleDeleteVersion = async (id: string) => {
    try {
      await deleteResumeVersion(id);
      setVersions(versions.filter(v => v.id !== id));
      if (selectedVersion?.id === id) {
        setSelectedVersion(null);
      }
    } catch (err) {
      setError('Failed to delete version');
    }
  };

  const handleSaveVersion = (updatedVersion: ResumeVersion) => {
    setVersions(versions.map(v =>
      v.id === updatedVersion.id ? updatedVersion : v
    ));
    setSelectedVersion(null);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Box sx={{ p: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );

  return (
    <Box sx={styles.container}>
      <Typography variant="h5" gutterBottom>Resume Versions</Typography>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleCreateVersion}
        sx={{ mb: 3 }}
      >
        Create New Version
      </Button>
      
      {versions.map(version => (
        <Paper key={version.id} sx={styles.versionCard}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs>
              <Typography variant="h6">{version.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: {new Date(version.updatedAt).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item>
              <Chip 
                label={version.status} 
                color={
                  version.status === 'complete' ? 'success' : 
                  version.status === 'review' ? 'warning' : 
                  'default'
                } 
                size="small" 
              />
            </Grid>
            <Grid item>
              <IconButton
                size="small"
                onClick={() => setSelectedVersion(version)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteVersion(version.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}

      {selectedVersion && (
        <ResumeEditor
          version={selectedVersion}
          requirements={requirements}
          onSave={handleSaveVersion}
          onCancel={() => setSelectedVersion(null)}
        />
      )}
    </Box>
  );
};

// Resume Editor Component
const ResumeEditor: React.FC<{
  version: ResumeVersion;
  requirements: JobRequirement[];
  onSave: (version: ResumeVersion) => void;
  onCancel: () => void;
}> = ({ version, requirements, onSave, onCancel }) => {
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(version.title);

  useEffect(() => {
    // Load sections from version content
    try {
      const loadedSections = JSON.parse(version.content);
      setSections(loadedSections);
    } catch (err) {
      setErrors([{
        id: 'parse-error',
        section: 'general',
        message: 'Failed to parse resume content',
        severity: 'error',
      }]);
    }
  }, [version]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedSections = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setSections(updatedSections);
  };

  const handleSectionUpdate = (sectionId: string, content: string) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, content } : section
    ));
  };

  const validateSections = useCallback(() => {
    const newErrors: ValidationError[] = [];
    
    sections.forEach(section => {
      if (!section.content.trim()) {
        newErrors.push({
          id: `${section.id}-empty`,
          section: section.id,
          message: `${section.title} section cannot be empty`,
          severity: 'error',
        });
      }

      if (section.type === 'experience' && !section.content.includes('achievements')) {
        newErrors.push({
          id: `${section.id}-achievements`,
          section: section.id,
          message: 'Consider adding specific achievements',
          severity: 'warning',
        });
      }
    });

    setErrors(newErrors);
    return newErrors.filter(e => e.severity === 'error').length === 0;
  }, [sections]);

  const handleSave = async () => {
    if (!validateSections()) return;

    setSaving(true);
    try {
      const updatedVersion = await updateResumeVersion({
        ...version,
        title,
        content: JSON.stringify(sections),
      });
      onSave(updatedVersion);
    } catch (err) {
      setErrors([...errors, {
        id: 'save-error',
        section: 'general',
        message: 'Failed to save changes',
        severity: 'error',
      }]);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = () => {
    const newSection: ResumeSection = {
      id: uuidv4(),
      type: 'experience',
      title: 'New Section',
      content: '',
      order: sections.length,
    };
    setSections([...sections, newSection]);
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  return (
    <Dialog open fullWidth maxWidth="md">
      <DialogTitle>
        <TextField
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}
        />
      </DialogTitle>
      <DialogContent>
        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Please fix the following issues:
            <List dense>
              {errors.map(error => (
                <ListItem key={error.id}>
                  <ListItemIcon>
                    {error.severity === 'error' ? <WarningIcon color="error" /> : <WarningIcon color="warning" />}
                  </ListItemIcon>
                  <ListItemText primary={error.message} />
                </ListItem>
              ))}
            </List>
          </Alert>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {sections.map((section, index) => (
                  <Draggable
                    key={section.id}
                    draggableId={section.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <Box sx={styles.sectionContainer}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <IconButton
                                {...provided.dragHandleProps}
                                sx={styles.dragHandle}
                              >
                                <DragIndicatorIcon />
                              </IconButton>
                            </Grid>
                            <Grid item xs>
                              <Typography variant="h6">{section.title}</Typography>
                            </Grid>
                            <Grid item>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteSection(section.id)}
                                className="section-actions"
                                sx={{ opacity: 0 }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                          <TextField
                            multiline
                            fullWidth
                            minRows={4}
                            value={section.content}
                            onChange={(e) => handleSectionUpdate(section.id, e.target.value)}
                            sx={{ mt: 1 }}
                            error={errors.some(e => e.section === section.id)}
                            helperText={errors.find(e => e.section === section.id)?.message}
                          />
                        </Box>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Button
          startIcon={<AddIcon />}
          onClick={handleAddSection}
          sx={{ mt: 2 }}
        >
          Add Section
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Job Requirements Analysis</Typography>
          <Grid container spacing={1}>
            {requirements.map(req => (
              <Grid item key={req.id}>
                <Chip
                  label={req.skill}
                  color={req.matched ? 'success' : 'default'}
                  variant={req.importance === 'required' ? 'filled' : 'outlined'}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResumeManager;
