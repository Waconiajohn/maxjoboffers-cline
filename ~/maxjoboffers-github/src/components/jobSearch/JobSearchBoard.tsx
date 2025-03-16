import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Pagination,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Chip
} from '@mui/material';
import { JobSearchFilters } from './JobSearchFilters';
import { JobCard } from './JobCard';
import { jobSearchService } from '../../services/jobSearch';
import { jobTrackingService } from '../../services/jobTracking';
import { JobListing, JobSearchFilters as JobSearchFiltersType, JobSearchResponse } from '../../types/jobSearch';

const initialFilters: JobSearchFiltersType = {
  query: '',
  location: '',
  radius: 25,
  remote: false,
  datePosted: 'anytime',
  employmentTypes: [],
  experienceLevels: [],
  industries: [],
  skills: []
};

export const JobSearchBoard: React.FC = () => {
  const [filters, setFilters] = useState<JobSearchFiltersType>(initialFilters);
  const [searchResults, setSearchResults] = useState<JobSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  useEffect(() => {
    handleSearch();
  }, [page]);
  
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const results = await jobSearchService.searchJobs(filters, page, 10);
      setSearchResults(results);
      
      // Reset to page 1 if it's a new search (not a page change)
      if (page !== 1) {
        setPage(1);
      }
    } catch (err) {
      setError('Failed to search jobs. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters: JobSearchFiltersType) => {
    setFilters(newFilters);
  };
  
  const handleClearFilters = () => {
    setFilters(initialFilters);
  };
  
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  const handleSaveJob = async (job: JobListing) => {
    try {
      if (savedJobs.includes(job.id)) {
        // Remove from saved jobs
        setSavedJobs(savedJobs.filter(id => id !== job.id));
        setSnackbar({
          open: true,
          message: 'Job removed from saved jobs',
          severity: 'success'
        });
      } else {
        // Add to saved jobs
        setSavedJobs([...savedJobs, job.id]);
        
        // Create a job tracker in the tracking system
        try {
          await jobTrackingService.createTracker(job.id);
          
          setSnackbar({
            open: true,
            message: 'Job saved and added to tracking system',
            severity: 'success'
          });
        } catch (trackerErr) {
          console.error('Failed to create job tracker:', trackerErr);
          setSnackbar({
            open: true,
            message: 'Job saved but failed to add to tracking system',
            severity: 'warning'
          });
        }
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to save job',
        severity: 'error'
      });
      console.error(err);
    }
  };
  
  const handleApplyJob = async (job: JobListing) => {
    try {
      // Open the application URL in a new tab
      window.open(job.applicationUrl, '_blank');
      
      // If the job is already saved, update its status to 'applied'
      if (savedJobs.includes(job.id)) {
        try {
          // Get the tracker for this job
          const tracker = await jobTrackingService.getTracker(job.id);
          
          // Update the status to 'applied'
          await jobTrackingService.updateTrackerStatus(
            job.id,
            'applied',
            `Applied via ${new URL(job.applicationUrl).hostname} on ${new Date().toLocaleDateString()}`
          );
          
          setSnackbar({
            open: true,
            message: 'Job application status updated in tracking system',
            severity: 'success'
          });
        } catch (trackerErr) {
          console.error('Failed to update job tracker:', trackerErr);
        }
      } else {
        // If not saved, ask if user wants to save and track this application
        const shouldSave = window.confirm(
          'Would you like to save this job and track your application?'
        );
        
        if (shouldSave) {
          await handleSaveJob(job);
          
          // Now update the status to applied
          try {
            await jobTrackingService.updateTrackerStatus(
              job.id,
              'applied',
              `Applied via ${new URL(job.applicationUrl).hostname} on ${new Date().toLocaleDateString()}`
            );
          } catch (trackerErr) {
            console.error('Failed to update job tracker status:', trackerErr);
          }
        }
      }
    } catch (err) {
      console.error('Error in apply process:', err);
    }
  };
  
  const handleViewJobDetails = (job: JobListing) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const handleCloseJobDetails = () => {
    setJobDetailsOpen(false);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Job Search
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Search for jobs using Google Jobs API and find the perfect match for your skills and experience.
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <JobSearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClear={handleClearFilters}
        />
      </Paper>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : searchResults ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {searchResults.totalResults} jobs found
            </Typography>
            {searchResults.totalPages > 1 && (
              <Pagination
                count={searchResults.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
              />
            )}
          </Box>
          
          <Grid container spacing={3}>
            {searchResults.jobs.map(job => (
              <Grid item xs={12} md={6} lg={4} key={job.id}>
                <JobCard
                  job={job}
                  isSaved={savedJobs.includes(job.id)}
                  onSave={handleSaveJob}
                  onApply={handleApplyJob}
                  onViewDetails={handleViewJobDetails}
                />
              </Grid>
            ))}
          </Grid>
          
          {searchResults.jobs.length === 0 && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No jobs found matching your criteria
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search filters or search for a different position
              </Typography>
            </Box>
          )}
          
          {searchResults.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={searchResults.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Enter search criteria and click Search to find jobs
          </Typography>
        </Box>
      )}
      
      {/* Job Details Dialog */}
      <Dialog
        open={jobDetailsOpen}
        onClose={handleCloseJobDetails}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        {selectedJob && (
          <>
            <DialogTitle>
              <Typography variant="h5">{selectedJob.title}</Typography>
              <Typography variant="subtitle1">{selectedJob.company}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Location
                </Typography>
                <Typography variant="body1">
                  {selectedJob.location}
                  {selectedJob.remote && ' (Remote)'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Salary
                </Typography>
                <Typography variant="body1">
                  {selectedJob.salary 
                    ? `${selectedJob.salary.min ? '$' + selectedJob.salary.min.toLocaleString() : ''} - ${selectedJob.salary.max ? '$' + selectedJob.salary.max.toLocaleString() : ''} per ${selectedJob.salary.period}`
                    : 'Salary not specified'
                  }
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Employment Type
                </Typography>
                <Typography variant="body1">
                  {selectedJob.employmentType.split('_').map(word => 
                    word.charAt(0) + word.slice(1).toLowerCase()
                  ).join(' ')}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedJob.description}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Requirements
                </Typography>
                <ul>
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index}>
                      <Typography variant="body1">{req}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedJob.skills.map((skill, index) => (
                    <Chip key={index} label={skill} />
                  ))}
                </Box>
              </Box>
              
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Benefits
                  </Typography>
                  <ul>
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index}>
                        <Typography variant="body1">{benefit}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseJobDetails}>
                Close
              </Button>
              <Button 
                variant="outlined"
                onClick={() => handleSaveJob(selectedJob)}
                color={savedJobs.includes(selectedJob.id) ? "primary" : "inherit"}
              >
                {savedJobs.includes(selectedJob.id) ? "Saved" : "Save Job"}
              </Button>
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={() => {
                  // Navigate to resume optimization with this job
                  window.location.href = `/resume/optimize?jobId=${selectedJob.id}`;
                }}
              >
                Optimize Resume
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => handleApplyJob(selectedJob)}
              >
                Apply Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Snackbar for notifications */}
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
    </Box>
  );
};
