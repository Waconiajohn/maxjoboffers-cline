import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Grid,
  Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Resource, ResourceFilters } from '../../types';
import { FilterChips } from './FilterChips';

const resourceStyles = {
  container: {
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1
  },
  filterBar: {
    display: 'flex',
    gap: 2,
    mb: 3,
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  resourceGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)'
    },
    gap: 3
  },
  resourceCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 3
    }
  }
};

interface ResourceLibraryProps {
  resources: Resource[];
  onResourceSelect: (resource: Resource) => void;
  onFilterChange: (filters: ResourceFilters) => void;
  isLoading: boolean;
}

const ResourceGridSkeleton = () => (
  <Grid container spacing={3}>
    {[...Array(8)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <Card>
          <Skeleton variant="rectangular" height={140} />
          <CardContent>
            <Skeleton variant="text" height={32} width="80%" />
            <Skeleton variant="text" height={20} width="100%" />
            <Skeleton variant="text" height={20} width="60%" />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const ResourceCard: React.FC<{ resource: Resource; onClick: () => void }> = ({
  resource,
  onClick
}) => (
  <Card sx={resourceStyles.resourceCard} onClick={onClick}>
    {resource.thumbnailUrl && (
      <CardMedia
        component="img"
        height="140"
        image={resource.thumbnailUrl}
        alt={resource.title}
      />
    )}
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" gutterBottom>
        {resource.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {resource.description}
      </Typography>
      <Stack direction="row" spacing={1} mt={1}>
        <Chip
          label={resource.type}
          size="small"
          color="primary"
          variant="outlined"
        />
        {resource.duration && (
          <Chip
            label={`${resource.duration} min`}
            size="small"
            icon={<AccessTimeIcon />}
          />
        )}
      </Stack>
    </CardContent>
    <CardActions>
      <Button size="small" color="primary">
        Learn More
      </Button>
      {resource.type === 'video' && (
        <IconButton size="small" color="primary">
          <PlayArrowIcon />
        </IconButton>
      )}
    </CardActions>
  </Card>
);

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({
  resources,
  onResourceSelect,
  onFilterChange,
  isLoading
}) => {
  const [filters, setFilters] = useState<ResourceFilters>({
    type: [],
    category: [],
    searchQuery: ''
  });

  const handleFilterChange = (newFilters: Partial<ResourceFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Box sx={resourceStyles.container}>
      {/* Filter Bar */}
      <Box sx={resourceStyles.filterBar}>
        <TextField
          placeholder="Search resources..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          size="small"
        />
        <FilterChips
          selectedTypes={filters.type}
          selectedCategories={filters.category}
          onTypeChange={(types) => handleFilterChange({ type: types })}
          onCategoryChange={(categories) => handleFilterChange({ category: categories })}
        />
      </Box>

      {/* Resource Grid */}
      {isLoading ? (
        <ResourceGridSkeleton />
      ) : (
        <Box sx={resourceStyles.resourceGrid}>
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onClick={() => onResourceSelect(resource)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
