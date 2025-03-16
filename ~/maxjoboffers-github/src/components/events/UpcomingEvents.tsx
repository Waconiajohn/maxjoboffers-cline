import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Chip,
  Stack,
  Button,
  Skeleton
} from '@mui/material';
import { Event } from '../../types';

const eventStyles = {
  container: {
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1
  },
  eventList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  eventCard: {
    p: 2,
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      borderColor: 'primary.main',
      backgroundColor: 'action.hover'
    }
  },
  dateChip: {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    fontWeight: 'bold'
  },
  hostAvatar: {
    width: 24,
    height: 24,
    marginRight: 1
  }
};

interface UpcomingEventsProps {
  events: Event[];
  onEventRegister: (eventId: string) => Promise<void>;
  onEventCancel: (eventId: string) => Promise<void>;
  userTimezone: string;
  isLoading?: boolean;
}

const EventSkeleton = () => (
  <Paper sx={eventStyles.eventCard}>
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Skeleton variant="rectangular" width={100} height={32} />
      </Grid>
      <Grid item xs>
        <Skeleton variant="text" height={28} width="60%" />
        <Skeleton variant="text" height={20} width="80%" />
        <Box mt={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={100} />
            <Skeleton variant="rectangular" width={80} height={24} />
          </Stack>
        </Box>
      </Grid>
      <Grid item>
        <Skeleton variant="rectangular" width={100} height={36} />
      </Grid>
    </Grid>
  </Paper>
);

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  events,
  onEventRegister,
  onEventCancel,
  userTimezone,
  isLoading = false
}) => {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }, [events]);

  const formatEventDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: userTimezone
    });
  };

  if (isLoading) {
    return (
      <Box sx={eventStyles.container}>
        <Typography variant="h6" gutterBottom>
          Upcoming Events
        </Typography>
        <Box sx={eventStyles.eventList}>
          {[...Array(3)].map((_, index) => (
            <EventSkeleton key={index} />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={eventStyles.container}>
      <Typography variant="h6" gutterBottom>
        Upcoming Events
      </Typography>
      <Box sx={eventStyles.eventList}>
        {sortedEvents.map((event) => (
          <Paper key={event.id} sx={eventStyles.eventCard}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Chip
                  label={formatEventDate(event.startDate)}
                  sx={eventStyles.dateChip}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="subtitle1">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
                <Box mt={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      src={event.host.avatarUrl}
                      alt={event.host.name}
                      sx={eventStyles.hostAvatar}
                    />
                    <Typography variant="body2">
                      {event.host.name}
                    </Typography>
                    <Chip
                      label={event.type}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {event.currentParticipants}/{event.maxParticipants} participants
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
              <Grid item>
                {event.status === 'upcoming' ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onEventRegister(event.id)}
                    disabled={event.currentParticipants >= event.maxParticipants}
                  >
                    Register
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onEventCancel(event.id)}
                  >
                    Cancel
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
