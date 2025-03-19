import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Rating,
  Autocomplete,
  Stack,
  Divider,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  LinkedIn as LinkedInIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

// Import mock data service
import {
  LinkedInProfile,
  Experience,
  Education,
  Skill,
  Accomplishment,
  Recommendation,
  fetchLinkedInProfile,
  updateLinkedInProfile
} from '../services/mockLinkedInProfileData';

// Styles
const styles = {
  container: {
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
  },
  section: {
    mb: 4,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
  },
  dragItem: {
    mb: 2,
    '&:hover': {
      '& .drag-handle': {
        opacity: 1,
      },
    },
  },
  dragHandle: {
    opacity: 0,
    transition: 'opacity 0.2s',
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing',
    },
  },
  previewCard: {
    mb: 2,
    '&:hover': {
      boxShadow: 3,
    },
  },
};

// LinkedIn Profile Builder Component
const LinkedInProfileBuilder: React.FC = () => {
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [activeSection, setActiveSection] = useState<string>('headline');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchLinkedInProfile();
        setProfile(data);
      } catch (err) {
        setError('Failed to load LinkedIn profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      const updatedProfile = await updateLinkedInProfile(profile);
      setProfile(updatedProfile);
      // Show success message or notification here
    } catch (err) {
      setError('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
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
  
  if (!profile) return null;

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box sx={styles.section}>
        <Typography variant="h5" gutterBottom>
          LinkedIn Profile Builder
        </Typography>
        <LinearProgress
          variant="determinate"
          value={profile.profileStrength}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Profile Strength: {profile.profileStrength}%
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={previewMode ? <EditIcon /> : <PreviewIcon />}
          onClick={() => setPreviewMode(!previewMode)}
          sx={{ mr: 1 }}
        >
          {previewMode ? 'Edit' : 'Preview'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </Box>

      {previewMode ? (
        <ProfilePreview profile={profile} />
      ) : (
        <>
          {/* Headline & Summary */}
          <Box sx={styles.section}>
            <Typography variant="h6" gutterBottom>
              Headline & Summary
            </Typography>
            <TextField
              fullWidth
              label="Professional Headline"
              value={profile.headline}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Professional Summary"
              value={profile.summary}
              onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            />
          </Box>

          {/* Experience Section */}
          <ExperienceSection
            experiences={profile.experience}
            onUpdate={(experiences) => setProfile({ ...profile, experience: experiences })}
          />

          {/* Education Section */}
          <EducationSection
            education={profile.education}
            onUpdate={(education) => setProfile({ ...profile, education: education })}
          />

          {/* Skills Section */}
          <SkillsSection
            skills={profile.skills}
            onUpdate={(skills) => setProfile({ ...profile, skills: skills })}
          />

          {/* Accomplishments Section */}
          <AccomplishmentsSection
            accomplishments={profile.accomplishments}
            onUpdate={(accomplishments) => setProfile({ ...profile, accomplishments: accomplishments })}
          />

          {/* Recommendations Section */}
          <RecommendationsSection
            recommendations={profile.recommendations}
            onUpdate={(recommendations) => setProfile({ ...profile, recommendations: recommendations })}
          />
        </>
      )}
    </Box>
  );
};

// Experience Section Component
const ExperienceSection: React.FC<{
  experiences: Experience[];
  onUpdate: (experiences: Experience[]) => void;
}> = ({ experiences, onUpdate }) => {
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(experiences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdate(items);
  };

  return (
    <Box sx={styles.section}>
      <Box sx={styles.sectionTitle}>
        <Typography variant="h6">Experience</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setEditingExperience({
            id: '',
            title: '',
            company: '',
            location: '',
            startDate: '',
            current: true,
            description: '',
            highlights: [],
            skills: [],
          })}
        >
          Add Experience
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="experiences">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {experiences.map((experience, index) => (
                <Draggable
                  key={experience.id}
                  draggableId={experience.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={styles.dragItem}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            {...provided.dragHandleProps}
                            className="drag-handle"
                            sx={styles.dragHandle}
                          >
                            <DragIndicatorIcon />
                          </IconButton>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{experience.title}</Typography>
                            <Typography color="text.secondary">
                              {experience.company} • {experience.location}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(experience.startDate).toLocaleDateString()} - 
                              {experience.current ? 'Present' : new Date(experience.endDate!).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <IconButton onClick={() => setEditingExperience(experience)}>
                            <EditIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {editingExperience && (
        <ExperienceDialog
          experience={editingExperience}
          onSave={(updatedExperience) => {
            const newExperiences = editingExperience.id
              ? experiences.map(e => e.id === updatedExperience.id ? updatedExperience : e)
              : [...experiences, { ...updatedExperience, id: uuidv4() }];
            onUpdate(newExperiences);
            setEditingExperience(null);
          }}
          onDelete={() => {
            onUpdate(experiences.filter(e => e.id !== editingExperience.id));
            setEditingExperience(null);
          }}
          onClose={() => setEditingExperience(null)}
        />
      )}
    </Box>
  );
};

// Experience Dialog Component
const ExperienceDialog: React.FC<{
  experience: Experience;
  onSave: (experience: Experience) => void;
  onDelete?: () => void;
  onClose: () => void;
}> = ({ experience, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState(experience);
  const [newHighlight, setNewHighlight] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, newHighlight.trim()]
      });
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index)
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {experience.id ? 'Edit Experience' : 'Add Experience'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Job Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate ? formData.startDate.substring(0, 10) : ''}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                />
              }
              label="Current Position"
            />
          </Grid>
          {!formData.current && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.endDate ? formData.endDate.substring(0, 10) : ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required={!formData.current}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Key Achievements/Highlights
            </Typography>
            <Box sx={{ mb: 2 }}>
              {formData.highlights.map((highlight, index) => (
                <Chip
                  key={index}
                  label={highlight}
                  onDelete={() => handleRemoveHighlight(index)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Add Highlight"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
              />
              <Button variant="outlined" onClick={handleAddHighlight}>
                Add
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Skills Used
            </Typography>
            <Box sx={{ mb: 2 }}>
              {formData.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Add Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <Button variant="outlined" onClick={handleAddSkill}>
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {onDelete && formData.id && (
          <Button color="error" onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSave(formData)}
          disabled={!formData.title || !formData.company || !formData.startDate || (!formData.current && !formData.endDate)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Education Section Component
const EducationSection: React.FC<{
  education: Education[];
  onUpdate: (education: Education[]) => void;
}> = ({ education, onUpdate }) => {
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(education);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdate(items);
  };

  return (
    <Box sx={styles.section}>
      <Box sx={styles.sectionTitle}>
        <Typography variant="h6">Education</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setEditingEducation({
            id: '',
            school: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            activities: [],
            description: '',
          })}
        >
          Add Education
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="education">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {education.map((edu, index) => (
                <Draggable
                  key={edu.id}
                  draggableId={edu.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={styles.dragItem}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            {...provided.dragHandleProps}
                            className="drag-handle"
                            sx={styles.dragHandle}
                          >
                            <DragIndicatorIcon />
                          </IconButton>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{edu.school}</Typography>
                            <Typography color="text.secondary">
                              {edu.degree} in {edu.field}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(edu.startDate).toLocaleDateString()} - 
                              {new Date(edu.endDate!).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <IconButton onClick={() => setEditingEducation(edu)}>
                            <EditIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {editingEducation && (
        <EducationDialog
          education={editingEducation}
          onSave={(updatedEducation) => {
            const newEducation = editingEducation.id
              ? education.map(e => e.id === updatedEducation.id ? updatedEducation : e)
              : [...education, { ...updatedEducation, id: uuidv4() }];
            onUpdate(newEducation);
            setEditingEducation(null);
          }}
          onDelete={() => {
            onUpdate(education.filter(e => e.id !== editingEducation.id));
            setEditingEducation(null);
          }}
          onClose={() => setEditingEducation(null)}
        />
      )}
    </Box>
  );
};

// Education Dialog Component
const EducationDialog: React.FC<{
  education: Education;
  onSave: (education: Education) => void;
  onDelete?: () => void;
  onClose: () => void;
}> = ({ education, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState(education);
  const [newActivity, setNewActivity] = useState('');

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      setFormData({
        ...formData,
        activities: [...formData.activities, newActivity.trim()]
      });
      setNewActivity('');
    }
  };

  const handleRemoveActivity = (index: number) => {
    setFormData({
      ...formData,
      activities: formData.activities.filter((_, i) => i !== index)
    });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {education.id ? 'Edit Education' : 'Add Education'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="School"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Degree"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Field of Study"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate ? formData.startDate.substring(0, 10) : ''}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={formData.endDate ? formData.endDate.substring(0, 10) : ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Activities and Societies
            </Typography>
            <Box sx={{ mb: 2 }}>
              {formData.activities.map((activity, index) => (
                <Chip
                  key={index}
                  label={activity}
                  onDelete={() => handleRemoveActivity(index)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Add Activity"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
              />
              <Button variant="outlined" onClick={handleAddActivity}>
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {onDelete && formData.id && (
          <Button color="error" onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSave(formData)}
          disabled={!formData.school || !formData.degree || !formData.field || !formData.startDate || !formData.endDate}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Skills Section Component
const SkillsSection: React.FC<{
  skills: Skill[];
  onUpdate: (skills: Skill[]) => void;
}> = ({ skills, onUpdate }) => {
  const [newSkill, setNewSkill] = useState('');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    const skillExists = skills.some(s => s.name.toLowerCase() === newSkill.trim().toLowerCase());
    if (skillExists) {
      // Could show an error message here
      return;
    }

    onUpdate([
      ...skills,
      {
        id: uuidv4(),
        name: newSkill.trim(),
        endorsements: 0,
        level: 'Beginner',
      },
    ]);
    setNewSkill('');
  };

  return (
    <Box sx={styles.section}>
      <Typography variant="h6" gutterBottom>
        Skills
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Add Skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          InputProps={{
            endAdornment: (
              <Button onClick={handleAddSkill}>
                Add
              </Button>
            ),
          }}
        />
      </Box>
      <Grid container spacing={1}>
        {skills.map((skill) => (
          <Grid item key={skill.id}>
            <Chip
              label={`${skill.name} (${skill.level})`}
              onDelete={() => onUpdate(skills.filter(s => s.id !== skill.id))}
              onClick={() => setEditingSkill(skill)}
            />
          </Grid>
        ))}
      </Grid>

      {editingSkill && (
        <SkillDialog
          skill={editingSkill}
          onSave={(updatedSkill) => {
            onUpdate(skills.map(s => s.id === updatedSkill.id ? updatedSkill : s));
            setEditingSkill(null);
          }}
          onClose={() => setEditingSkill(null)}
        />
      )}
    </Box>
  );
};

// Skill Dialog Component
const SkillDialog: React.FC<{
  skill: Skill;
  onSave: (skill: Skill) => void;
  onClose: () => void;
}> = ({ skill, onSave, onClose }) => {
  const [formData, setFormData] = useState(skill);

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Skill</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Skill Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Proficiency Level</InputLabel>
              <Select
                value={formData.level}
                label="Proficiency Level"
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
                <MenuItem value="Expert">Expert</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Endorsements"
              value={formData.endorsements}
              onChange={(e) => setFormData({ ...formData, endorsements: parseInt(e.target.value) || 0 })}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSave(formData)}
          disabled={!formData.name}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Accomplishments Section Component
const AccomplishmentsSection: React.FC<{
  accomplishments: Accomplishment[];
  onUpdate: (accomplishments: Accomplishment[]) => void;
}> = ({ accomplishments, onUpdate }) => {
  const [editingAccomplishment, setEditingAccomplishment] = useState<Accomplishment | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(accomplishments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdate(items);
  };

  return (
    <Box sx={styles.section}>
      <Box sx={styles.sectionTitle}>
        <Typography variant="h6">Accomplishments</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setEditingAccomplishment({
            id: '',
            type: 'certification',
            title: '',
            date: '',
            description: '',
          })}
        >
          Add Accomplishment
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="accomplishments">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {accomplishments.map((accomplishment, index) => (
                <Draggable
                  key={accomplishment.id}
                  draggableId={accomplishment.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={styles.dragItem}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            {...provided.dragHandleProps}
                            className="drag-handle"
                            sx={styles.dragHandle}
                          >
                            <DragIndicatorIcon />
                          </IconButton>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{accomplishment.title}</Typography>
                            <Typography color="text.secondary">
                              {accomplishment.type.charAt(0).toUpperCase() + accomplishment.type.slice(1)}
                              {accomplishment.issuer && ` • ${accomplishment.issuer}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(accomplishment.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <IconButton onClick={() => setEditingAccomplishment(accomplishment)}>
                            <EditIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {editingAccomplishment && (
        <AccomplishmentDialog
          accomplishment={editingAccomplishment}
          onSave={(updatedAccomplishment) => {
            const newAccomplishments = editingAccomplishment.id
              ? accomplishments.map(a => a.id === updatedAccomplishment.id ? updatedAccomplishment : a)
              : [...accomplishments, { ...updatedAccomplishment, id: uuidv4() }];
            onUpdate(newAccomplishments);
            setEditingAccomplishment(null);
          }}
          onDelete={() => {
            onUpdate(accomplishments.filter(a => a.id !== editingAccomplishment.id));
            setEditingAccomplishment(null);
          }}
          onClose={() => setEditingAccomplishment(null)}
        />
      )}
    </Box>
  );
};

// Accomplishment Dialog Component
const AccomplishmentDialog: React.FC<{
  accomplishment: Accomplishment;
  onSave: (accomplishment: Accomplishment) => void;
  onDelete?: () => void;
  onClose: () => void;
}> = ({ accomplishment, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState(accomplishment);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {accomplishment.id ? 'Edit Accomplishment' : 'Add Accomplishment'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <MenuItem value="certification">Certification</MenuItem>
                <MenuItem value="award">Award</MenuItem>
                <MenuItem value="publication">Publication</MenuItem>
                <MenuItem value="patent">Patent</MenuItem>
                <MenuItem value="project">Project</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date ? formData.date.substring(0, 10) : ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          {(formData.type === 'certification' || formData.type === 'award' || formData.type === 'publication') && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Issuer"
                value={formData.issuer || ''}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Grid>
          {(formData.type === 'publication' || formData.type === 'project') && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        {onDelete && formData.id && (
          <Button color="error" onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSave(formData)}
          disabled={!formData.title || !formData.date}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Recommendations Section Component
const RecommendationsSection: React.FC<{
  recommendations: Recommendation[];
  onUpdate: (recommendations: Recommendation[]) => void;
}> = ({ recommendations, onUpdate }) => {
  const [editingRecommendation, setEditingRecommendation] = useState<Recommendation | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(recommendations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdate(items);
  };

  return (
    <Box sx={styles.section}>
      <Box sx={styles.sectionTitle}>
        <Typography variant="h6">Recommendations</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setEditingRecommendation({
            id: '',
            author: {
              name: '',
              title: '',
              company: '',
              relationship: '',
            },
            content: '',
            date: new Date().toISOString().substring(0, 10),
          })}
        >
          Add Recommendation
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="recommendations">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {recommendations.map((recommendation, index) => (
                <Draggable
                  key={recommendation.id}
                  draggableId={recommendation.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={styles.dragItem}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            {...provided.dragHandleProps}
                            className="drag-handle"
                            sx={styles.dragHandle}
                          >
                            <DragIndicatorIcon />
                          </IconButton>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{recommendation.author.name}</Typography>
                            <Typography color="text.secondary">
                              {recommendation.author.title} at {recommendation.author.company}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {recommendation.author.relationship} • {new Date(recommendation.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <IconButton onClick={() => setEditingRecommendation(recommendation)}>
                            <EditIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {editingRecommendation && (
        <RecommendationDialog
          recommendation={editingRecommendation}
          onSave={(updatedRecommendation) => {
            const newRecommendations = editingRecommendation.id
              ? recommendations.map(r => r.id === updatedRecommendation.id ? updatedRecommendation : r)
              : [...recommendations, { ...updatedRecommendation, id: uuidv4() }];
            onUpdate(newRecommendations);
            setEditingRecommendation(null);
          }}
          onDelete={() => {
            onUpdate(recommendations.filter(r => r.id !== editingRecommendation.id));
            setEditingRecommendation(null);
          }}
          onClose={() => setEditingRecommendation(null)}
        />
      )}
    </Box>
  );
};

// Recommendation Dialog Component
const RecommendationDialog: React.FC<{
  recommendation: Recommendation;
  onSave: (recommendation: Recommendation) => void;
  onDelete?: () => void;
  onClose: () => void;
}> = ({ recommendation, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState(recommendation);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {recommendation.id ? 'Edit Recommendation' : 'Add Recommendation'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Author Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={formData.author.name}
              onChange={(e) => setFormData({
                ...formData,
                author: { ...formData.author, name: e.target.value }
              })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              value={formData.author.title}
              onChange={(e) => setFormData({
                ...formData,
                author: { ...formData.author, title: e.target.value }
              })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company"
              value={formData.author.company}
              onChange={(e) => setFormData({
                ...formData,
                author: { ...formData.author, company: e.target.value }
              })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Relationship</InputLabel>
              <Select
                value={formData.author.relationship}
                label="Relationship"
                onChange={(e) => setFormData({
                  ...formData,
                  author: { ...formData.author, relationship: e.target.value }
                })}
              >
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Colleague">Colleague</MenuItem>
                <MenuItem value="Client">Client</MenuItem>
                <MenuItem value="Business Partner">Business Partner</MenuItem>
                <MenuItem value="Former Manager">Former Manager</MenuItem>
                <MenuItem value="Former Colleague">Former Colleague</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date ? formData.date.substring(0, 10) : ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Recommendation Content"
              multiline
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {onDelete && formData.id && (
          <Button color="error" onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSave(formData)}
          disabled={!formData.author.name || !formData.author.title || !formData.author.company || !formData.content}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Profile Preview Component
const ProfilePreview: React.FC<{
  profile: LinkedInProfile;
}> = ({ profile }) => {
  return (
    <Box>
      <Card sx={styles.previewCard}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {profile.headline}
          </Typography>
          <Typography variant="body1" paragraph>
            {profile.summary}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Experience
          </Typography>
          {profile.experience.map((exp) => (
            <Box key={exp.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                {exp.title} at {exp.company}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {exp.location} • {new Date(exp.startDate).toLocaleDateString()} - 
                {exp.current ? 'Present' : new Date(exp.endDate!).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                {exp.description}
              </Typography>
              {exp.highlights.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Key Achievements:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {exp.highlights.map((highlight, index) => (
                      <li key={index}>
                        <Typography variant="body2">{highlight}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Education
          </Typography>
          {profile.education.map((edu) => (
            <Box key={edu.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                {edu.school}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {edu.degree} in {edu.field} • {new Date(edu.startDate).toLocaleDateString()} - 
                {new Date(edu.endDate!).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                {edu.description}
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {profile.skills.map((skill) => (
              <Chip
                key={skill.id}
                label={`${skill.name} (${skill.endorsements})`}
                variant="outlined"
              />
            ))}
          </Box>
        </CardContent>
      </Card>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        startIcon={<LinkedInIcon />}
      >
        Export to LinkedIn
      </Button>
    </Box>
  );
};

export default LinkedInProfileBuilder;
