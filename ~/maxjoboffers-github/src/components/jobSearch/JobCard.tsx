import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  Work as WorkIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  OpenInNew as OpenInNewIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { JobListing } from '../../types/jobSearch';

interface JobCardProps {
  job: JobListing;
  onSave?: (job: JobListing) => void;
  onApply?: (job: JobListing) => void;
  onViewDetails?: (job: JobListing) => void;
  isSaved?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSave,
  onApply,
  onViewDetails,
  isSaved = false
}) => {
  const formatSalary = (min?: number, max?: number, currency = 'USD', period = 'yearly') => {
    if (!min && !max) return 'Salary not specified';
    
    const formatValue = (value: number) => 
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
      }).format(value);
    
    let salaryText = '';
    
    if (min && max) {
      salaryText = `${formatValue(min)} - ${formatValue(max)}`;
    } else if (min) {
      salaryText = `${formatValue(min)}+`;
    } else if (max) {
      salaryText = `Up to ${formatValue(max)}`;
    }
    
    switch (period) {
      case 'hourly':
        salaryText += ' per hour';
        break;
      case 'daily':
        salaryText += ' per day';
        break;
      case 'weekly':
        salaryText += ' per week';
        break;
      case 'monthly':
        salaryText += ' per month';
        break;
      case 'yearly':
        salaryText += ' per year';
        break;
    }
    
    return salaryText;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  const formatEmploymentType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {job.title}
          </Typography>
          <Tooltip title={isSaved ? "Remove from saved jobs" : "Save job"}>
            <IconButton 
              size="small" 
              onClick={() => onSave && onSave(job)}
              color={isSaved ? "primary" : "default"}
            >
              {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography variant="subtitle1" color="text.primary" gutterBottom>
          {job.company}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {job.location}
            {job.remote && ' (Remote)'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SalaryIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {job.salary 
              ? formatSalary(job.salary.min, job.salary.max, job.salary.currency, job.salary.period)
              : 'Salary not specified'
            }
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WorkIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatEmploymentType(job.employmentType)}
          </Typography>
          <Box sx={{ mx: 1, color: 'text.secondary' }}>•</Box>
          <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(job.datePosted)}
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {job.description}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Skills
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
          {job.skills.slice(0, 5).map((skill, index) => (
            <Chip 
              key={index} 
              label={skill} 
              size="small" 
              variant="outlined" 
              sx={{ mb: 1 }}
            />
          ))}
          {job.skills.length > 5 && (
            <Chip 
              label={`+${job.skills.length - 5} more`} 
              size="small" 
              variant="outlined" 
              sx={{ mb: 1 }}
            />
          )}
        </Stack>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          variant="outlined"
          onClick={() => onViewDetails && onViewDetails(job)}
        >
          View Details
        </Button>
        <Button 
          size="small" 
          variant="contained" 
          color="primary"
          endIcon={<OpenInNewIcon />}
          onClick={() => onApply && onApply(job)}
        >
          Apply
        </Button>
      </CardActions>
    </Card>
  );
};
