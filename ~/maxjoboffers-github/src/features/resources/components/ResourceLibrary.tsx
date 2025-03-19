import React, { useState, useEffect } from 'react';
import {
  Resource,
  ResourceCategory,
  ResourceDifficulty,
  ResourceFilter,
  Event
} from '../types';
import { resourcesService } from '../services/resourcesService';

// Mock components for demonstration purposes
const Box = ({ sx, children }: any) => <div style={sx}>{children}</div>;
const Typography = ({ variant, component, color, gutterBottom, children, sx }: any) => 
  <div style={{ marginBottom: gutterBottom ? '1rem' : 0, ...(sx || {}) }}>{children}</div>;
const Button = ({ variant, color, onClick, disabled, children, sx }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    style={{ 
      backgroundColor: color === 'primary' ? '#1976d2' : 'transparent',
      color: color === 'primary' ? 'white' : '#1976d2',
      border: variant === 'outlined' ? '1px solid #1976d2' : 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.7 : 1,
      ...(sx || {})
    }}
  >
    {children}
  </button>
);
const CircularProgress = () => <div>Loading...</div>;
const Alert = ({ severity, sx, children }: any) => (
  <div style={{ 
    padding: '8px 16px',
    marginBottom: '1rem',
    borderRadius: '4px',
    backgroundColor: severity === 'success' ? '#e8f5e9' : 
                     severity === 'error' ? '#ffebee' : 
                     severity === 'warning' ? '#fff8e1' : '#e3f2fd',
    color: severity === 'success' ? '#2e7d32' : 
           severity === 'error' ? '#c62828' : 
           severity === 'warning' ? '#f57f17' : '#1565c0',
    ...(sx || {})
  }}>
    {children}
  </div>
);
const Container = ({ maxWidth, children }: any) => (
  <div style={{ 
    maxWidth: maxWidth === 'lg' ? '1200px' : 
              maxWidth === 'md' ? '900px' : 
              maxWidth === 'sm' ? '600px' : '100%',
    margin: '0 auto',
    padding: '0 16px'
  }}>
    {children}
  </div>
);
const Grid = ({ container, item, spacing, xs, md, children }: any) => (
  <div style={{ 
    display: container ? 'flex' : 'block',
    flexWrap: 'wrap',
    margin: container && spacing ? `-${spacing * 4}px` : 0,
    padding: item && spacing ? `${spacing * 4}px` : 0,
    width: xs === 12 ? '100%' : 
           xs === 6 ? '50%' : 
           xs === 4 ? '33.33%' : 
           xs === 3 ? '25%' : 'auto'
  }}>
    {children}
  </div>
);
const Card = ({ children, sx }: any) => (
  <div style={{ 
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    ...(sx || {})
  }}>
    {children}
  </div>
);
const CardContent = ({ children, sx }: any) => (
  <div style={{ 
    flexGrow: 1,
    ...(sx || {})
  }}>
    {children}
  </div>
);
const CardMedia = ({ component, image, alt, height, sx }: any) => (
  <div style={{ 
    height: height || '140px',
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '4px 4px 0 0',
    ...(sx || {})
  }} />
);
const CardActions = ({ children, sx }: any) => (
  <div style={{ 
    display: 'flex',
    padding: '8px 0 0 0',
    ...(sx || {})
  }}>
    {children}
  </div>
);
const TextField = ({ label, value, onChange, placeholder, fullWidth, sx }: any) => (
  <div style={{ 
    marginBottom: '16px',
    width: fullWidth ? '100%' : 'auto',
    ...(sx || {})
  }}>
    {label && <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>}
    <input 
      type="text" 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      style={{ 
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}
    />
  </div>
);
const Select = ({ label, value, onChange, options, fullWidth, sx }: any) => (
  <div style={{ 
    marginBottom: '16px',
    width: fullWidth ? '100%' : 'auto',
    ...(sx || {})
  }}>
    {label && <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>}
    <select 
      value={value} 
      onChange={onChange}
      style={{ 
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
const Chip = ({ label, color, onClick, onDelete, sx }: any) => (
  <span style={{ 
    display: 'inline-block',
    padding: '4px 8px',
    margin: '0 4px 4px 0',
    borderRadius: '16px',
    fontSize: '0.75rem',
    backgroundColor: color === 'primary' ? '#e3f2fd' : 
                     color === 'secondary' ? '#f3e5f5' : 
                     color === 'success' ? '#e8f5e9' : 
                     color === 'warning' ? '#fff8e1' : 
                     color === 'error' ? '#ffebee' : '#f5f5f5',
    color: color === 'primary' ? '#1565c0' : 
           color === 'secondary' ? '#7b1fa2' : 
           color === 'success' ? '#2e7d32' : 
           color === 'warning' ? '#f57f17' : 
           color === 'error' ? '#c62828' : '#333',
    cursor: onClick || onDelete ? 'pointer' : 'default',
    ...(sx || {})
  }}>
    {label}
    {onDelete && (
      <span 
        onClick={onDelete}
        style={{ 
          marginLeft: '4px',
          fontWeight: 'bold'
        }}
      >
        ×
      </span>
    )}
  </span>
);
const Rating = ({ value, readOnly, onChange, sx }: any) => (
  <div style={{ 
    display: 'inline-flex',
    ...(sx || {})
  }}>
    {[1, 2, 3, 4, 5].map(star => (
      <span 
        key={star}
        onClick={!readOnly ? () => onChange(star) : undefined}
        style={{ 
          cursor: !readOnly ? 'pointer' : 'default',
          color: star <= value ? '#faaf00' : '#ccc',
          fontSize: '1.25rem'
        }}
      >
        ★
      </span>
    ))}
  </div>
);
const Divider = ({ sx }: any) => (
  <div style={{ 
    width: '100%', 
    height: '1px', 
    backgroundColor: '#e0e0e0',
    margin: '16px 0',
    ...(sx || {})
  }} />
);
const Pagination = ({ count, page, onChange, sx }: any) => (
  <div style={{ 
    display: 'flex',
    justifyContent: 'center',
    margin: '16px 0',
    ...(sx || {})
  }}>
    {Array.from({ length: count }, (_, i) => i + 1).map(p => (
      <button 
        key={p}
        onClick={() => onChange(p)}
        style={{ 
          width: '32px',
          height: '32px',
          margin: '0 4px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: p === page ? '#1976d2' : 'white',
          color: p === page ? 'white' : '#333',
          cursor: 'pointer'
        }}
      >
        {p}
      </button>
    ))}
  </div>
);

/**
 * Resource Card Component
 */
interface ResourceCardProps {
  resource: Resource;
  onSave?: () => void;
  onView?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onSave, onView }) => {
  const getCategoryColor = (category: ResourceCategory) => {
    switch (category) {
      case ResourceCategory.Article:
        return 'primary';
      case ResourceCategory.Video:
        return 'error';
      case ResourceCategory.Podcast:
        return 'secondary';
      case ResourceCategory.Course:
        return 'success';
      case ResourceCategory.Ebook:
        return 'info';
      case ResourceCategory.Template:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getDifficultyColor = (difficulty: ResourceDifficulty) => {
    switch (difficulty) {
      case ResourceDifficulty.Beginner:
        return 'success';
      case ResourceDifficulty.Intermediate:
        return 'warning';
      case ResourceDifficulty.Advanced:
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Card>
      {resource.imageUrl && (
        <CardMedia
          component="div"
          image={resource.imageUrl}
          alt={resource.title}
          height="140"
        />
      )}
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {resource.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Chip 
            label={resource.category.replace('_', ' ')} 
            color={getCategoryColor(resource.category)}
          />
          <Chip 
            label={resource.difficulty.replace('_', ' ')} 
            color={getDifficultyColor(resource.difficulty)}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {resource.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={resource.rating} readOnly />
          <Typography variant="body2" sx={{ ml: 1 }}>
            ({resource.reviewCount})
          </Typography>
        </Box>
        
        {resource.author && (
          <Typography variant="body2" color="text.secondary">
            By {resource.author}
          </Typography>
        )}
        
        {resource.duration && (
          <Typography variant="body2" color="text.secondary">
            Duration: {resource.duration} min
          </Typography>
        )}
      </CardContent>
      
      <CardActions>
        <Button variant="outlined" color="primary" onClick={onView}>
          View
        </Button>
        <Button variant="outlined" color="primary" onClick={onSave} sx={{ ml: 1 }}>
          Save
        </Button>
      </CardActions>
    </Card>
  );
};

/**
 * Filter Panel Component
 */
interface FilterPanelProps {
  filter: ResourceFilter;
  onFilterChange: (filter: ResourceFilter) => void;
  categories: { category: ResourceCategory; count: number }[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filter, onFilterChange, categories }) => {
  const [searchQuery, setSearchQuery] = useState(filter.searchQuery || '');
  const [selectedCategories, setSelectedCategories] = useState<ResourceCategory[]>(
    filter.categories || []
  );
  const [selectedDifficulties, setSelectedDifficulties] = useState<ResourceDifficulty[]>(
    filter.difficulties || []
  );
  const [minRating, setMinRating] = useState<number>(filter.minRating || 0);
  const [featuredOnly, setFeaturedOnly] = useState(filter.featuredOnly || false);
  const [recommendedOnly, setRecommendedOnly] = useState(filter.recommendedOnly || false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryToggle = (category: ResourceCategory) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
  };

  const handleDifficultyToggle = (difficulty: ResourceDifficulty) => {
    const newDifficulties = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter(d => d !== difficulty)
      : [...selectedDifficulties, difficulty];
    
    setSelectedDifficulties(newDifficulties);
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
  };

  const handleFeaturedToggle = () => {
    setFeaturedOnly(!featuredOnly);
  };

  const handleRecommendedToggle = () => {
    setRecommendedOnly(!recommendedOnly);
  };

  const applyFilters = () => {
    onFilterChange({
      searchQuery,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      difficulties: selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
      minRating: minRating > 0 ? minRating : undefined,
      featuredOnly: featuredOnly || undefined,
      recommendedOnly: recommendedOnly || undefined
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setMinRating(0);
    setFeaturedOnly(false);
    setRecommendedOnly(false);
    
    onFilterChange({});
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      
      <TextField
        label="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search resources..."
        fullWidth
      />
      
      <Typography variant="subtitle2" gutterBottom>
        Categories
      </Typography>
      <Box sx={{ mb: 2 }}>
        {categories.map(({ category, count }) => (
          <Chip
            key={category}
            label={`${category.replace('_', ' ')} (${count})`}
            color={selectedCategories.includes(category) ? 'primary' : 'default'}
            onClick={() => handleCategoryToggle(category)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>
      
      <Typography variant="subtitle2" gutterBottom>
        Difficulty
      </Typography>
      <Box sx={{ mb: 2 }}>
        {Object.values(ResourceDifficulty).map(difficulty => (
          <Chip
            key={difficulty}
            label={difficulty.replace('_', ' ')}
            color={selectedDifficulties.includes(difficulty) ? 'primary' : 'default'}
            onClick={() => handleDifficultyToggle(difficulty)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>
      
      <Typography variant="subtitle2" gutterBottom>
        Minimum Rating
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Rating
          value={minRating}
          onChange={handleRatingChange}
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Button
          variant={featuredOnly ? 'contained' : 'outlined'}
          color="primary"
          onClick={handleFeaturedToggle}
          sx={{ mr: 1, mb: 1 }}
        >
          Featured Only
        </Button>
        <Button
          variant={recommendedOnly ? 'contained' : 'outlined'}
          color="primary"
          onClick={handleRecommendedToggle}
          sx={{ mr: 1, mb: 1 }}
        >
          Recommended Only
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" color="primary" onClick={resetFilters}>
          Reset
        </Button>
        <Button variant="contained" color="primary" onClick={applyFilters}>
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
};

/**
 * Upcoming Events Component
 */
interface UpcomingEventsProps {
  events: Event[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  if (events.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upcoming Events
      </Typography>
      
      <Grid container spacing={2}>
        {events.map(event => (
          <Grid item xs={12} md={4} key={event.id}>
            <Card>
              {event.imageUrl && (
                <CardMedia
                  component="div"
                  image={event.imageUrl}
                  alt={event.title}
                  height="100"
                />
              )}
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {event.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formatDate(event.startDate)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {event.format.replace('_', ' ')} • {event.type.replace('_', ' ')}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {event.description.length > 100
                    ? `${event.description.substring(0, 100)}...`
                    : event.description}
                </Typography>
              </CardContent>
              
              <CardActions>
                <Button variant="outlined" color="primary">
                  View Details
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ ml: 1 }}
                  disabled={event.maxAttendees !== undefined && event.currentAttendees !== undefined && event.currentAttendees >= event.maxAttendees}
                >
                  {event.isRegistered ? 'Registered' : 'Register'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

/**
 * Resource Library Component
 * 
 * This component displays a library of resources with filtering capabilities.
 */
const ResourceLibrary: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<{ category: ResourceCategory; count: number }[]>([]);
  const [filter, setFilter] = useState<ResourceFilter>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const resourcesPerPage = 9;

  useEffect(() => {
    loadResources();
    loadUpcomingEvents();
    loadCategories();
  }, []);

  useEffect(() => {
    loadResources();
  }, [filter]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const fetchedResources = await resourcesService.getResources(filter);
      setResources(fetchedResources);
      setError(null);
    } catch (err) {
      console.error('Error loading resources:', err);
      setError('Failed to load resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadUpcomingEvents = async () => {
    try {
      const events = await resourcesService.getUpcomingEvents(3);
      setUpcomingEvents(events);
    } catch (err) {
      console.error('Error loading upcoming events:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesWithCounts = await resourcesService.getResourceCategoriesWithCounts();
      setCategories(categoriesWithCounts);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleFilterChange = (newFilter: ResourceFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSaveResource = async (resourceId: string) => {
    try {
      await resourcesService.saveUserResourceInteraction('user-1', resourceId, {
        isSaved: true
      });
      // Show success message or update UI
    } catch (err) {
      console.error('Error saving resource:', err);
      // Show error message
    }
  };

  const handleViewResource = (resourceId: string) => {
    // Navigate to resource detail page or open in new tab
    window.open(resources.find(r => r.id === resourceId)?.url, '_blank');
  };

  // Calculate pagination
  const totalPages = Math.ceil(resources.length / resourcesPerPage);
  const paginatedResources = resources.slice(
    (page - 1) * resourcesPerPage,
    page * resourcesPerPage
  );

  if (loading && resources.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resource Library
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Explore our curated collection of resources to help you in your job search and career development.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <UpcomingEvents events={upcomingEvents} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <FilterPanel
              filter={filter}
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </Grid>
          
          <Grid item xs={12} md={9}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : paginatedResources.length === 0 ? (
              <Alert severity="info">
                No resources found matching your filters. Try adjusting your search criteria.
              </Alert>
            ) : (
              <>
                <Grid container spacing={3}>
                  {paginatedResources.map(resource => (
                    <Grid item xs={12} md={4} key={resource.id}>
                      <ResourceCard
                        resource={resource}
                        onSave={() => handleSaveResource(resource.id)}
                        onView={() => handleViewResource(resource.id)}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    sx={{ mt: 4 }}
                  />
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ResourceLibrary;
