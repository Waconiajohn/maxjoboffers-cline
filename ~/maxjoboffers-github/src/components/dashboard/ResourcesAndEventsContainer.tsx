import React, { useState, useEffect } from 'react';
import { Grid, Alert, Snackbar } from '@mui/material';
import { ResourceLibrary } from '../resources/ResourceLibrary';
import { UpcomingEvents } from '../events/UpcomingEvents';
import { resourceService, eventService } from '../../services/resourcesAndEvents';
import { Resource, ResourceFilters, Event } from '../../types';

// Mock auth hook for now
const useAuth = () => {
  return {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com'
    }
  };
};

export const ResourcesAndEventsContainer: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for snackbar feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Fetch resources with filters
  const fetchResources = async (filters: ResourceFilters) => {
    try {
      setIsLoadingResources(true);
      const data = await resourceService.getResources(filters);
      setResources(data);
    } catch (err) {
      setError('Failed to load resources');
      console.error(err);
    } finally {
      setIsLoadingResources(false);
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const data = await eventService.getUpcomingEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchResources({ type: [], category: [], searchQuery: '' });
    fetchEvents();
  }, []);

  // Handle resource selection
  const handleResourceSelect = async (resource: Resource) => {
    try {
      const details = await resourceService.getResourceDetails(resource.id);
      // Handle resource details (e.g., open in modal, navigate to detail page)
      console.log('Resource details:', details);
    } catch (err) {
      showNotification('Failed to load resource details', 'error');
    }
  };

  // Handle event registration
  const handleEventRegister = async (eventId: string) => {
    try {
      await eventService.registerForEvent(eventId);
      await fetchEvents(); // Refresh events list
      showNotification('Successfully registered for event', 'success');
    } catch (err) {
      showNotification('Failed to register for event', 'error');
    }
  };

  // Handle event cancellation
  const handleEventCancel = async (eventId: string) => {
    try {
      await eventService.cancelEventRegistration(eventId);
      await fetchEvents(); // Refresh events list
      showNotification('Successfully cancelled event registration', 'success');
    } catch (err) {
      showNotification('Failed to cancel event registration', 'error');
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ResourceLibrary
            resources={resources}
            onResourceSelect={handleResourceSelect}
            onFilterChange={fetchResources}
            isLoading={isLoadingResources}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <UpcomingEvents
            events={events}
            onEventRegister={handleEventRegister}
            onEventCancel={handleEventCancel}
            userTimezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
            isLoading={isLoadingEvents}
          />
        </Grid>
      </Grid>

      {/* Error handling */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Feedback snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
