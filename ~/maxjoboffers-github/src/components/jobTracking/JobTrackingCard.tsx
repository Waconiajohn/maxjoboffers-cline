import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack,
  Box,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Note as NoteIcon
} from '@mui/icons-material';
import { JobTracker } from '../../types/jobTracking';

interface JobTrackingCardProps {
  tracker: JobTracker;
  onStatusUpdate: (status: JobTracker['status'], notes?: string) => Promise<void>;
  onAddStep: (step: { type: string; dueDate: string; notes?: string }) => Promise<void>;
}

const statusColors = {
  saved: 'info',
  applied: 'primary',
  interviewing: 'warning',
  offered: 'success',
  rejected: 'error'
} as const;

export const JobTrackingCard: React.FC<JobTrackingCardProps> = ({
  tracker,
  onStatusUpdate,
  onAddStep
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [newStep, setNewStep] = useState({
    type: 'resume-update',
    dueDate: '',
    notes: ''
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (status: JobTracker['status']) => {
    handleMenuClose();
    setNoteDialogOpen(true);
  };

  const handleNoteSubmit = async () => {
    await onStatusUpdate(tracker.status, newNote);
    setNoteDialogOpen(false);
    setNewNote('');
  };

  const handleStepSubmit = async () => {
    await onAddStep(newStep);
    setStepDialogOpen(false);
    setNewStep({
      type: 'resume-update',
      dueDate: '',
      notes: ''
    });
  };

  const calculateProgress = () => {
    const completedSteps = tracker.nextSteps.filter(
      step => step.status === 'completed'
    ).length;
    return (completedSteps / tracker.nextSteps.length) * 100;
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom>
            {tracker.jobId}
          </Typography>
          <Chip
            label={tracker.status}
            color={statusColors[tracker.status]}
            size="small"
          />
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={calculateProgress()}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Stack spacing={1} sx={{ mt: 2 }}>
          {tracker.nextSteps.map(step => (
            <Chip
              key={step.id}
              icon={<ScheduleIcon />}
              label={`${step.type} - ${new Date(step.dueDate).toLocaleDateString()}`}
              variant={step.status === 'completed' ? 'filled' : 'outlined'}
              color={step.status === 'completed' ? 'success' : 'default'}
            />
          ))}
        </Stack>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          startIcon={<AssignmentIcon />}
          onClick={() => setStepDialogOpen(true)}
        >
          Add Step
        </Button>
        <Button
          size="small"
          startIcon={<NoteIcon />}
          onClick={() => setNoteDialogOpen(true)}
        >
          Add Note
        </Button>
        <IconButton
          size="small"
          onClick={handleMenuClick}
          sx={{ marginLeft: 'auto' }}
        >
          <MoreVertIcon />
        </IconButton>
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('applied')}>
          Mark as Applied
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('interviewing')}>
          Mark as Interviewing
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('offered')}>
          Mark as Offered
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('rejected')}>
          Mark as Rejected
        </MenuItem>
      </Menu>

      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)}>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Note"
            fullWidth
            multiline
            rows={4}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleNoteSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={stepDialogOpen} onClose={() => setStepDialogOpen(false)}>
        <DialogTitle>Add Step</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Step Type"
              fullWidth
              value={newStep.type}
              onChange={(e) => setNewStep({ ...newStep, type: e.target.value })}
            >
              <MenuItem value="resume-update">Update Resume</MenuItem>
              <MenuItem value="apply">Apply</MenuItem>
              <MenuItem value="interview-prep">Interview Prep</MenuItem>
              <MenuItem value="interview">Interview</MenuItem>
              <MenuItem value="follow-up">Follow Up</MenuItem>
            </TextField>
            <TextField
              type="date"
              label="Due Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newStep.dueDate}
              onChange={(e) => setNewStep({ ...newStep, dueDate: e.target.value })}
            />
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={2}
              value={newStep.notes}
              onChange={(e) => setNewStep({ ...newStep, notes: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStepDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStepSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
