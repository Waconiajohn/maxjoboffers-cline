import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
  Badge,
  Divider,
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  BusinessCenter as BusinessIcon,
  LinkedIn as LinkedInIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  VideoCall as VideoCallIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { v4 as uuidv4 } from 'uuid';

// Import mock data service
import {
  NetworkContact,
  NetworkingEvent,
  NetworkingStats,
  fetchNetworkContacts,
  fetchNetworkEvents,
  fetchNetworkStats,
  createNetworkContact,
  updateNetworkContact,
  deleteNetworkContact,
  createNetworkEvent,
  updateNetworkEvent,
  deleteNetworkEvent
} from '../services/mockNetworkingData';

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
  contactItem: {
    borderRadius: 1,
    mb: 1,
    '&:hover': {
      bgcolor: 'action.hover',
    },
  },
  eventCard: {
    mb: 2,
    borderLeft: 4,
    borderColor: (theme: any) => ({
      upcoming: theme.palette.primary.main,
      'in-progress': theme.palette.success.main,
      completed: theme.palette.grey[300],
    }),
  },
  statsCard: {
    textAlign: 'center',
    p: 2,
  },
};

// Main Networking Component
const NetworkingManager: React.FC = () => {
  const [contacts, setContacts] = useState<NetworkContact[]>([]);
  const [events, setEvents] = useState<NetworkingEvent[]>([]);
  const [stats, setStats] = useState<NetworkingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<NetworkContact | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<NetworkingEvent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contactsData, eventsData, statsData] = await Promise.all([
          fetchNetworkContacts(),
          fetchNetworkEvents(),
          fetchNetworkStats(),
        ]);
        
        setContacts(contactsData);
        setEvents(eventsData);
        setStats(statsData);
      } catch (err) {
        setError('Failed to load networking data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateContact = async (contact: Omit<NetworkContact, 'id'>) => {
    try {
      const newContact = await createNetworkContact(contact);
      setContacts([...contacts, newContact]);
      return newContact;
    } catch (err) {
      setError('Failed to create contact');
      throw err;
    }
  };

  const handleUpdateContact = async (contact: NetworkContact) => {
    try {
      const updatedContact = await updateNetworkContact(contact);
      setContacts(contacts.map(c => c.id === contact.id ? updatedContact : c));
      return updatedContact;
    } catch (err) {
      setError('Failed to update contact');
      throw err;
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteNetworkContact(id);
      setContacts(contacts.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete contact');
      throw err;
    }
  };

  const handleCreateEvent = async (event: Omit<NetworkingEvent, 'id'>) => {
    try {
      const newEvent = await createNetworkEvent(event);
      setEvents([...events, newEvent]);
      return newEvent;
    } catch (err) {
      setError('Failed to create event');
      throw err;
    }
  };

  const handleUpdateEvent = async (event: NetworkingEvent) => {
    try {
      const updatedEvent = await updateNetworkEvent(event);
      setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
      return updatedEvent;
    } catch (err) {
      setError('Failed to update event');
      throw err;
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteNetworkEvent(id);
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      setError('Failed to delete event');
      throw err;
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

  return (
    <Box sx={styles.container}>
      <Grid container spacing={3}>
        {/* Stats Section */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {stats && (
              <>
                <Grid item xs={12} sm={4}>
                  <Card sx={styles.statsCard}>
                    <Typography variant="h4" color="primary">
                      {stats.totalContacts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Contacts
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={styles.statsCard}>
                    <Typography variant="h4" color="success.main">
                      {stats.activeContacts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Contacts
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={styles.statsCard}>
                    <Typography variant="h4" color="warning.main">
                      {stats.pendingFollowUps}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Follow-ups
                    </Typography>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>

        {/* Contacts Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={styles.container}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Contacts</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setSelectedContact({
                  id: '',
                  name: '',
                  title: '',
                  company: '',
                  email: '',
                  notes: '',
                  status: 'active',
                  tags: [],
                  lastContactDate: new Date().toISOString()
                })}
              >
                Add Contact
              </Button>
            </Box>
            <List>
              {contacts.map(contact => (
                <ListItem
                  key={contact.id}
                  sx={styles.contactItem}
                  secondaryAction={
                    <IconButton onClick={() => setSelectedContact(contact)}>
                      <EditIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <Avatar src={contact.avatarUrl}>{contact.name[0]}</Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={contact.name}
                    secondary={
                      <>
                        {contact.title} at {contact.company}
                        <Box sx={{ mt: 0.5 }}>
                          {contact.tags.map(tag => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Events Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={styles.container}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Upcoming Events</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setSelectedEvent({
                  id: '',
                  title: '',
                  type: 'webinar',
                  date: new Date().toISOString(),
                  location: '',
                  description: '',
                  attendees: 0,
                  isVirtual: true,
                  status: 'upcoming',
                  organizerId: contacts.length > 0 ? contacts[0].id : '',
                  tags: []
                })}
              >
                Add Event
              </Button>
            </Box>
            {events.map(event => (
              <Card 
                key={event.id} 
                sx={{
                  ...styles.eventCard,
                  borderLeftColor: 
                    event.status === 'upcoming' ? 'primary.main' : 
                    event.status === 'in-progress' ? 'success.main' : 
                    'grey.300'
                }}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">{event.title}</Typography>
                        <IconButton size="small" onClick={() => setSelectedEvent(event)}>
                          <EditIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(event.date).toLocaleDateString()} at{' '}
                        {new Date(event.date).toLocaleTimeString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          icon={event.isVirtual ? <VideoCallIcon /> : <LocationIcon />}
                          label={event.isVirtual ? 'Virtual' : event.location}
                          size="small"
                        />
                        <Chip
                          icon={<GroupIcon />}
                          label={`${event.attendees}${event.maxAttendees ? `/${event.maxAttendees}` : ''} attendees`}
                          size="small"
                        />
                        <Chip
                          label={event.type.replace('_', ' ')}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Contact Dialog */}
      {selectedContact && (
        <ContactDialog
          contact={selectedContact}
          onSave={async (updatedContact) => {
            try {
              if (updatedContact.id) {
                await handleUpdateContact(updatedContact);
              } else {
                await handleCreateContact(updatedContact);
              }
              setSelectedContact(null);
            } catch (err) {
              // Error is already handled in the handler functions
            }
          }}
          onDelete={async (id) => {
            try {
              await handleDeleteContact(id);
              setSelectedContact(null);
            } catch (err) {
              // Error is already handled in the handler functions
            }
          }}
          onClose={() => setSelectedContact(null)}
        />
      )}

      {/* Event Dialog */}
      {selectedEvent && (
        <EventDialog
          event={selectedEvent}
          contacts={contacts}
          onSave={async (updatedEvent) => {
            try {
              if (updatedEvent.id) {
                await handleUpdateEvent(updatedEvent);
              } else {
                await handleCreateEvent(updatedEvent);
              }
              setSelectedEvent(null);
            } catch (err) {
              // Error is already handled in the handler functions
            }
          }}
          onDelete={async (id) => {
            try {
              await handleDeleteEvent(id);
              setSelectedEvent(null);
            } catch (err) {
              // Error is already handled in the handler functions
            }
          }}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </Box>
  );
};

// Contact Dialog Component
const ContactDialog: React.FC<{
  contact: NetworkContact;
  onSave: (contact: NetworkContact) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}> = ({ contact, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState(contact);
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
        {contact.id ? 'Edit Contact' : 'Add Contact'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
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
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="LinkedIn"
              value={formData.linkedIn || ''}
              onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Status</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {(['active', 'pending', 'inactive'] as const).map((status) => (
                  <Chip
                    key={status}
                    label={status}
                    onClick={() => setFormData({ ...formData, status })}
                    color={formData.status === status ? 'primary' : 'default'}
                    variant={formData.status === status ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
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
        {contact.id && (
          <Button
            color="error"
            onClick={() => onDelete(contact.id)}
          >
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !formData.name || !formData.email || !formData.company || !formData.title}
        >
          {saving ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Event Dialog Component
const EventDialog: React.FC<{
  event: NetworkingEvent;
  contacts: NetworkContact[];
  onSave: (event: NetworkingEvent) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}> = ({ event, contacts, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState(event);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(event.date));

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
        {event.id ? 'Edit Event' : 'Add Event'}
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Date & Time"
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                  if (newValue) {
                    setFormData({ ...formData, date: newValue.toISOString() });
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Event Type</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {(['webinar', 'conference', 'meetup', 'coffee_chat'] as const).map((type) => (
                  <Chip
                    key={type}
                    label={type.replace('_', ' ')}
                    onClick={() => setFormData({ ...formData, type })}
                    color={formData.type === type ? 'primary' : 'default'}
                    variant={formData.type === type ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Virtual Event</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label="Virtual"
                  onClick={() => setFormData({ ...formData, isVirtual: true })}
                  color={formData.isVirtual ? 'primary' : 'default'}
                  variant={formData.isVirtual ? 'filled' : 'outlined'}
                />
                <Chip
                  label="In-person"
                  onClick={() => setFormData({ ...formData, isVirtual: false })}
                  color={!formData.isVirtual ? 'primary' : 'default'}
                  variant={!formData.isVirtual ? 'filled' : 'outlined'}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Attendees"
              type="number"
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value) || 0 })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Max Attendees"
              type="number"
              value={formData.maxAttendees || ''}
              onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) || undefined })}
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
        {event.id && (
          <Button
            color="error"
            onClick={() => onDelete(event.id)}
          >
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !formData.title || !formData.location}
        >
          {saving ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NetworkingManager;
