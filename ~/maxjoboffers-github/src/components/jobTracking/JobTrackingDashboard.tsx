import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { JobTrackingCard } from './JobTrackingCard';
import { jobTrackingService } from '../../services/jobTracking';
import { JobTracker } from '../../types/jobTracking';

export const JobTrackingDashboard: React.FC = () => {
  const [trackers, setTrackers] = useState<JobTracker[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrackers();
  }, []);

  const loadTrackers = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would fetch from your API
      // For now, we'll use mock data
      const mockTrackers: JobTracker[] = [
        {
          id: '1',
          jobId: 'Senior Engineering Manager',
          userId: 'user1',
          status: 'applied',
          notes: 'Applied via company website',
          nextSteps: [
            {
              id: 'step1',
              type: 'interview-prep',
              status: 'pending',
              dueDate: '2025-03-20T00:00:00Z'
            }
          ],
          timeline: [],
          lastUpdated: new Date().toISOString()
        }
      ];
      setTrackers(mockTrackers);
    } catch (err) {
      setError('Failed to load job trackers');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    trackerId: string,
    status: JobTracker['status'],
    notes?: string
  ) => {
    try {
      const updatedTracker = await jobTrackingService.updateTrackerStatus(
        trackerId,
        status,
        notes
      );
      setTrackers(current =>
        current.map(tracker =>
          tracker.id === trackerId ? updatedTracker : tracker
        )
      );
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
    }
  };

  const handleAddStep = async (
    trackerId: string,
    step: { type: string; dueDate: string; notes?: string }
  ) => {
    try {
      // Cast the step type to the expected type
      const stepType = step.type as 'resume-update' | 'apply' | 'interview-prep' | 'interview' | 'follow-up';
      
      const updatedTracker = await jobTrackingService.addTrackerStep(trackerId, {
        type: stepType,
        dueDate: step.dueDate,
        notes: step.notes,
        status: 'pending'
      });
      setTrackers(current =>
        current.map(tracker =>
          tracker.id === trackerId ? updatedTracker : tracker
        )
      );
    } catch (err) {
      setError('Failed to add step');
      console.error(err);
    }
  };

  const filteredTrackers = trackers.filter(tracker => {
    if (activeTab === 'all') return true;
    return tracker.status === activeTab;
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Job Applications
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="All" value="all" />
          <Tab label="Saved" value="saved" />
          <Tab label="Applied" value="applied" />
          <Tab label="Interviewing" value="interviewing" />
          <Tab label="Offered" value="offered" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {filteredTrackers.map(tracker => (
          <Grid item xs={12} md={6} lg={4} key={tracker.id}>
            <JobTrackingCard
              tracker={tracker}
              onStatusUpdate={(status, notes) =>
                handleStatusUpdate(tracker.id, status, notes)
              }
              onAddStep={step => handleAddStep(tracker.id, step)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
