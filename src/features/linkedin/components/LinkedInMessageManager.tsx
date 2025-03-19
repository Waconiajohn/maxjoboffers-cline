import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
} from '@mui/material';
import {
  Message as MessageIcon,
  Person as PersonIcon,
  ContentCopy as CopyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  LinkedIn as LinkedInIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

// Message template types
interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  type: 'connection' | 'follow-up' | 'introduction' | 'job-inquiry' | 'thank-you';
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MessageVariable {
  name: string;
  description: string;
  defaultValue: string;
}

// Sample message variables
const messageVariables: MessageVariable[] = [
  { name: '{recipient_name}', description: 'Recipient\'s name', defaultValue: 'John' },
  { name: '{recipient_title}', description: 'Recipient\'s job title', defaultValue: 'Hiring Manager' },
  { name: '{recipient_company}', description: 'Recipient\'s company', defaultValue: 'Acme Inc.' },
  { name: '{your_name}', description: 'Your name', defaultValue: 'Sarah' },
  { name: '{your_title}', description: 'Your job title', defaultValue: 'Software Engineer' },
  { name: '{mutual_connection}', description: 'Name of mutual connection', defaultValue: 'Alex Johnson' },
  { name: '{job_title}', description: 'Job title you\'re interested in', defaultValue: 'Senior Developer' },
  { name: '{custom_note}', description: 'Custom personalized note', defaultValue: 'I noticed your recent article on AI development and found it insightful.' },
];

// Sample message templates
const sampleTemplates: MessageTemplate[] = [
  {
    id: uuidv4(),
    title: 'Connection Request - Mutual Connection',
    content: `Hi {recipient_name},

I noticed we're both connected with {mutual_connection}. I'm a {your_title} interested in connecting with professionals in your industry.

{custom_note}

Would you be open to connecting?

Best regards,
{your_name}`,
    type: 'connection',
    tags: ['networking', 'mutual connection'],
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Job Application Follow-up',
    content: `Hi {recipient_name},

I recently applied for the {job_title} position at {recipient_company} and wanted to follow up on my application.

I'm particularly excited about the opportunity because {custom_note}

I'd be happy to provide any additional information that might be helpful in your decision-making process.

Thank you for your consideration,
{your_name}`,
    type: 'follow-up',
    tags: ['job search', 'follow-up'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Thank You After Interview',
    content: `Dear {recipient_name},

Thank you for taking the time to interview me for the {job_title} position today. I enjoyed our conversation about {custom_note} and am even more excited about the possibility of joining your team.

The role seems like a great match for my skills and experience, particularly in the areas we discussed.

I look forward to hearing about the next steps in the process.

Best regards,
{your_name}`,
    type: 'thank-you',
    tags: ['interview', 'thank you'],
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Informational Interview Request',
    content: `Hello {recipient_name},

I'm {your_name}, a {your_title} who is interested in learning more about {recipient_company} and the industry.

{custom_note}

Would you be open to a brief 15-20 minute call to share your insights? I'm particularly interested in hearing about your career path and any advice you might have for someone looking to grow in this field.

Thank you for considering my request.

Best regards,
{your_name}`,
    type: 'introduction',
    tags: ['networking', 'career advice'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Job Inquiry - No Open Position',
    content: `Hi {recipient_name},

I've been following {recipient_company} for some time and have been impressed by {custom_note}.

I'm a {your_title} with experience in [relevant skills/experience]. While I don't see any open positions that match my background at the moment, I wanted to reach out to express my interest in joining your team should an appropriate opportunity arise.

Would you be open to keeping my resume on file or connecting me with the appropriate person in your HR department?

Thank you for your time,
{your_name}`,
    type: 'job-inquiry',
    tags: ['job search', 'proactive'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Styles
const styles = {
  container: {
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 3,
    },
  },
  messageItem: {
    borderRadius: 1,
    mb: 1,
    '&:hover': {
      bgcolor: 'action.hover',
    },
  },
  previewCard: {
    p: 2,
    mb: 2,
    borderLeft: 4,
    borderColor: 'primary.main',
    bgcolor: 'background.paper',
  },
  variableChip: {
    m: 0.5,
    cursor: 'pointer',
  },
};

// Main LinkedIn Message Manager Component
const LinkedInMessageManager: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>(sampleTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<MessageTemplate | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Initialize variable values with defaults
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    messageVariables.forEach(variable => {
      initialValues[variable.name] = variable.defaultValue;
    });
    setVariableValues(initialValues);
  }, []);

  // Generate preview content when template or variables change
  useEffect(() => {
    if (previewTemplate) {
      let content = previewTemplate.content;
      Object.entries(variableValues).forEach(([variable, value]) => {
        content = content.replace(new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
      });
      setPreviewContent(content);
    }
  }, [previewTemplate, variableValues]);

  const handleCreateTemplate = () => {
    const newTemplate: MessageTemplate = {
      id: '',
      title: 'New Message Template',
      content: 'Enter your message here...',
      type: 'connection',
      tags: [],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSelectedTemplate(newTemplate);
  };

  const handleSaveTemplate = (template: MessageTemplate) => {
    setLoading(true);
    setTimeout(() => {
      try {
        if (template.id) {
          // Update existing template
          setTemplates(templates.map(t => t.id === template.id ? { ...template, updatedAt: new Date().toISOString() } : t));
        } else {
          // Create new template
          const newTemplate = { ...template, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
          setTemplates([...templates, newTemplate]);
        }
        setSelectedTemplate(null);
      } catch (err) {
        setError('Failed to save template');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleDeleteTemplate = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      try {
        setTemplates(templates.filter(t => t.id !== id));
        if (selectedTemplate?.id === id) {
          setSelectedTemplate(null);
        }
        if (previewTemplate?.id === id) {
          setPreviewTemplate(null);
        }
      } catch (err) {
        setError('Failed to delete template');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleToggleFavorite = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    ));
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // Success message could be shown here
      },
      () => {
        setError('Failed to copy to clipboard');
      }
    );
  };

  const filteredTemplates = templates.filter(template => {
    // Filter by type
    if (filterType !== 'all' && template.type !== filterType) {
      return false;
    }
    
    // Filter by favorites
    if (showOnlyFavorites && !template.isFavorite) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        template.title.toLowerCase().includes(query) ||
        template.content.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  if (loading && !selectedTemplate && !previewTemplate) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Typography variant="h5" gutterBottom>LinkedIn Message Templates</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        {/* Left Column - Template List */}
        <Grid item xs={12} md={previewTemplate ? 6 : 12}>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Search templates"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter by type</InputLabel>
                  <Select
                    value={filterType}
                    label="Filter by type"
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="all">All types</MenuItem>
                    <MenuItem value="connection">Connection requests</MenuItem>
                    <MenuItem value="follow-up">Follow-ups</MenuItem>
                    <MenuItem value="introduction">Introductions</MenuItem>
                    <MenuItem value="job-inquiry">Job inquiries</MenuItem>
                    <MenuItem value="thank-you">Thank you notes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleCreateTemplate}
              >
                Create Template
              </Button>
              <Button
                startIcon={showOnlyFavorites ? <StarIcon /> : <StarBorderIcon />}
                variant="outlined"
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              >
                {showOnlyFavorites ? 'Show All' : 'Favorites Only'}
              </Button>
            </Box>
          </Box>
          
          <List>
            {filteredTemplates.map(template => (
              <ListItem
                key={template.id}
                sx={styles.messageItem}
                secondaryAction={
                  <Box>
                    <IconButton onClick={() => handleToggleFavorite(template.id)}>
                      {template.isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
                    </IconButton>
                    <IconButton onClick={() => setSelectedTemplate(template)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => setPreviewTemplate(template)}>
                      <MessageIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemIcon>
                  {template.type === 'connection' && <PersonIcon color="primary" />}
                  {template.type === 'follow-up' && <MessageIcon color="secondary" />}
                  {template.type === 'introduction' && <LinkedInIcon color="primary" />}
                  {template.type === 'job-inquiry' && <WorkIcon color="action" />}
                  {template.type === 'thank-you' && <CheckIcon color="success" />}
                </ListItemIcon>
                <ListItemText
                  primary={template.title}
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      {template.tags.map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
          
          {filteredTemplates.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No templates found. Try adjusting your filters or create a new template.
              </Typography>
            </Box>
          )}
        </Grid>
        
        {/* Right Column - Preview */}
        {previewTemplate && (
          <Grid item xs={12} md={6}>
            <Paper sx={styles.container}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{previewTemplate.title}</Typography>
                <Button
                  startIcon={<CopyIcon />}
                  onClick={() => handleCopyToClipboard(previewContent)}
                >
                  Copy
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>Customize Variables:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {messageVariables.map(variable => (
                  <Grid item xs={12} sm={6} key={variable.name}>
                    <TextField
                      fullWidth
                      size="small"
                      label={variable.description}
                      value={variableValues[variable.name] || ''}
                      onChange={(e) => setVariableValues({
                        ...variableValues,
                        [variable.name]: e.target.value
                      })}
                    />
                  </Grid>
                ))}
              </Grid>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>Preview:</Typography>
              <Paper sx={styles.previewCard}>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {previewContent}
                </Typography>
              </Paper>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={() => setPreviewTemplate(null)}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CopyIcon />}
                  onClick={() => handleCopyToClipboard(previewContent)}
                >
                  Copy to Clipboard
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* Template Editor Dialog */}
      {selectedTemplate && (
        <TemplateEditorDialog
          template={selectedTemplate}
          onSave={handleSaveTemplate}
          onDelete={selectedTemplate.id ? () => handleDeleteTemplate(selectedTemplate.id) : undefined}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </Box>
  );
};

// Template Editor Dialog Component
const TemplateEditorDialog: React.FC<{
  template: MessageTemplate;
  onSave: (template: MessageTemplate) => void;
  onDelete?: () => void;
  onClose: () => void;
}> = ({ template, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState(template);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleInsertVariable = (variable: string) => {
    setFormData({
      ...formData,
      content: formData.content + variable
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {template.id ? 'Edit Template' : 'Create Template'}
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
              <InputLabel>Template Type</InputLabel>
              <Select
                value={formData.type}
                label="Template Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <MenuItem value="connection">Connection Request</MenuItem>
                <MenuItem value="follow-up">Follow-up</MenuItem>
                <MenuItem value="introduction">Introduction</MenuItem>
                <MenuItem value="job-inquiry">Job Inquiry</MenuItem>
                <MenuItem value="thank-you">Thank You</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>Favorite:</Typography>
              <IconButton 
                onClick={() => setFormData({ ...formData, isFavorite: !formData.isFavorite })}
                color={formData.isFavorite ? 'warning' : 'default'}
              >
                {formData.isFavorite ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Available Variables:</Typography>
            <Box sx={{ mb: 2 }}>
              {messageVariables.map(variable => (
                <Tooltip key={variable.name} title={variable.description}>
                  <Chip
                    label={variable.name}
                    onClick={() => handleInsertVariable(variable.name)}
                    sx={styles.variableChip}
                  />
                </Tooltip>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Message Content"
              multiline
              rows={10}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              placeholder="Write your message template here. Use variables like {recipient_name} that will be replaced when using the template."
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Tags</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {formData.tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                label="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button onClick={handleAddTag} variant="outlined" size="small">
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {onDelete && (
          <Button
            color="error"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !formData.title || !formData.content}
        >
          {saving ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkedInMessageManager;
