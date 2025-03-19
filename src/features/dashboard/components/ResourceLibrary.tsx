import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  Chip,
  Stack,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Skeleton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccessTime as AccessTimeIcon,
  PlayArrow as PlayArrowIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';

// Import mock data service
import {
  Resource,
  ResourceFilters,
  resourceCategories,
  resourceTypes,
  fetchResources,
  fetchResourceById
} from '../services/mockResourceData';

// Styles
const styles = {
  container: {
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
  },
  filterBar: {
    display: 'flex',
    gap: 2,
    mb: 3,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  resourceGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)',
    },
    gap: 3,
  },
  resourceCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 3,
    },
  },
  chipContainer: {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
    mt: 1,
  },
};

// Filter Chips Component
const FilterChips: React.FC<{
  selectedTypes: string[];
  selectedCategories: string[];
  onTypeChange: (types: string[]) => void;
  onCategoryChange: (categories: string[]) => void;
}> = ({ selectedTypes, selectedCategories, onTypeChange, onCategoryChange }) => {
  return (
    <Box sx={styles.chipContainer}>
      {resourceTypes.map((type) => (
        <Chip
          key={type}
          label={type}
          color={selectedTypes.includes(type) ? 'primary' : 'default'}
          onClick={() => {
            const newTypes = selectedTypes.includes(type)
              ? selectedTypes.filter(t => t !== type)
              : [...selectedTypes, type];
            onTypeChange(newTypes);
          }}
          variant={selectedTypes.includes(type) ? 'filled' : 'outlined'}
        />
      ))}
      {resourceCategories.map((category) => (
        <Chip
          key={category}
          label={category}
          color={selectedCategories.includes(category) ? 'secondary' : 'default'}
          onClick={() => {
            const newCategories = selectedCategories.includes(category)
              ? selectedCategories.filter(c => c !== category)
              : [...selectedCategories, category];
            onCategoryChange(newCategories);
          }}
          variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
        />
      ))}
    </Box>
  );
};

// Resource Card Component
const ResourceCard: React.FC<{
  resource: Resource;
  onClick: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
}> = ({ resource, onClick, onBookmark, isBookmarked }) => (
  <Card sx={styles.resourceCard}>
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
      <Button size="small" color="primary" onClick={onClick}>
        Learn More
      </Button>
      {resource.type === 'video' && (
        <IconButton size="small" color="primary">
          <PlayArrowIcon />
        </IconButton>
      )}
      <Box sx={{ flexGrow: 1 }} />
      <IconButton size="small" onClick={onBookmark}>
        {isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
      </IconButton>
      <IconButton size="small">
        <ShareIcon />
      </IconButton>
    </CardActions>
  </Card>
);

// Resource Grid Skeleton
const ResourceGridSkeleton = () => (
  <Grid container spacing={3}>
    {[...Array(8)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <Card>
          <Skeleton variant="rectangular" height={140} />
          <CardContent>
            <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} width="60%" />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Resource Details Dialog
const ResourceDetailsDialog: React.FC<{
  resource: Resource | null;
  onClose: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
}> = ({ resource, onClose, onBookmark, isBookmarked }) => {
  if (!resource) return null;

  return (
    <Dialog open maxWidth="md" fullWidth onClose={onClose}>
      <DialogTitle>{resource.title}</DialogTitle>
      <DialogContent>
        {resource.thumbnailUrl && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <img
              src={resource.thumbnailUrl}
              alt={resource.title}
              style={{ width: '100%', borderRadius: 8 }}
            />
            {resource.type === 'video' && (
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
                size="large"
              >
                <PlayArrowIcon fontSize="large" />
              </IconButton>
            )}
          </Box>
        )}
        <Typography variant="body1" gutterBottom>
          {resource.description}
        </Typography>
        <Box sx={styles.chipContainer}>
          <Chip label={resource.type} color="primary" />
          <Chip label={resource.category} />
          {resource.tags.map((tag) => (
            <Chip key={tag} label={tag} variant="outlined" size="small" />
          ))}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Added on {new Date(resource.dateAdded).toLocaleDateString()}
            {resource.authorName && ` • By ${resource.authorName}`}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={onBookmark}>
          {isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={resource.type === 'video' ? <PlayArrowIcon /> : <DownloadIcon />}
        >
          {resource.type === 'video' ? 'Watch Now' : 'Download'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Resource Library Component
const ResourceLibrary: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filters, setFilters] = useState<ResourceFilters>({
    type: [],
    category: [],
    searchQuery: '',
  });
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'popularity'>('date');

  // Load resources on mount and when filters change
  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      try {
        const data = await fetchResources(filters);
        
        // Sort resources
        const sortedData = [...data].sort((a, b) => {
          if (sortBy === 'date') {
            return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
          } else {
            return b.popularity - a.popularity;
          }
        });
        
        setResources(sortedData);
        setError(null);
      } catch (err) {
        setError('Failed to load resources. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [filters, sortBy]);

  const handleFilterChange = (newFilters: Partial<ResourceFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSort = (type: 'date' | 'popularity') => {
    setSortBy(type);
    setSortAnchorEl(null);
  };

  const handleToggleBookmark = (resourceId: string) => {
    setBookmarkedResources(prev => 
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  return (
    <Box sx={styles.container}>
      {/* Header and Search */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Resource Library
        </Typography>
        <TextField
          fullWidth
          placeholder="Search resources..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Filter Bar */}
      <Box sx={styles.filterBar}>
        <Button
          startIcon={<FilterIcon />}
          variant="outlined"
          onClick={() => {/* Implement filter dialog */}}
        >
          Filters
        </Button>
        <Button
          startIcon={<SortIcon />}
          variant="outlined"
          onClick={(e) => setSortAnchorEl(e.currentTarget)}
        >
          Sort By: {sortBy === 'date' ? 'Date Added' : 'Popularity'}
        </Button>
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
        >
          <MenuItem onClick={() => handleSort('date')}>Date Added</MenuItem>
          <MenuItem onClick={() => handleSort('popularity')}>Popularity</MenuItem>
        </Menu>
        <FilterChips
          selectedTypes={filters.type}
          selectedCategories={filters.category}
          onTypeChange={(types) => handleFilterChange({ type: types })}
          onCategoryChange={(categories) => handleFilterChange({ category: categories })}
        />
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Resource Grid */}
      {loading ? (
        <ResourceGridSkeleton />
      ) : resources.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No resources found matching your criteria.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your filters or search query.
          </Typography>
        </Box>
      ) : (
        <Box sx={styles.resourceGrid}>
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onClick={() => setSelectedResource(resource)}
              onBookmark={() => handleToggleBookmark(resource.id)}
              isBookmarked={bookmarkedResources.includes(resource.id)}
            />
          ))}
        </Box>
      )}

      {/* Resource Details Dialog */}
      {selectedResource && (
        <ResourceDetailsDialog
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onBookmark={() => handleToggleBookmark(selectedResource.id)}
          isBookmarked={bookmarkedResources.includes(selectedResource.id)}
        />
      )}
    </Box>
  );
};

export default ResourceLibrary;
