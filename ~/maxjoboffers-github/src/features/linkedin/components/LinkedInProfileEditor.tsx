import React, { useState, useEffect } from 'react';
import {
  LinkedInProfile,
  LinkedInSection,
  LinkedInSectionType,
  LinkedInOptimizationParams,
  OptimizationResult,
  OptimizationTone,
  OptimizationLength,
  OptimizationFocus
} from '../types';
import { linkedInService } from '../services/linkedInService';

// Mock components for demonstration purposes
const Box = ({ sx, children }: any) => <div style={sx}>{children}</div>;
const Typography = ({ variant, component, color, gutterBottom, children, sx }: any) => 
  <div style={{ marginBottom: gutterBottom ? '1rem' : 0, ...(sx || {}) }}>{children}</div>;
const TextField = ({ label, value, onChange, multiline, rows, fullWidth, sx }: any) => (
  <div style={{ marginBottom: '1rem', ...(sx || {}) }}>
    <label>{label}</label>
    <textarea 
      value={value} 
      onChange={onChange} 
      rows={rows || 4} 
      style={{ width: fullWidth ? '100%' : 'auto' }}
    />
  </div>
);
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
const Select = ({ label, value, onChange, options, fullWidth, sx }: any) => (
  <div style={{ marginBottom: '1rem', ...(sx || {}) }}>
    <label>{label}</label>
    <select 
      value={value} 
      onChange={onChange}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
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
    ...(sx || {})
  }}>
    {children}
  </div>
);
const CardContent = ({ children }: any) => <div>{children}</div>;
const CardActions = ({ children }: any) => <div style={{ marginTop: '16px' }}>{children}</div>;
const Tabs = ({ value, onChange, children }: any) => (
  <div style={{ borderBottom: '1px solid #e0e0e0' }}>
    <div style={{ display: 'flex' }}>{children}</div>
  </div>
);
const Tab = ({ label, value, onClick }: any) => (
  <div 
    onClick={onClick}
    style={{ 
      padding: '8px 16px',
      cursor: 'pointer',
      borderBottom: '2px solid transparent'
    }}
  >
    {label}
  </div>
);

/**
 * Interface for section editor props
 */
interface SectionEditorProps {
  profile: LinkedInProfile;
  section: LinkedInSection;
  onUpdate: (sectionId: string, content: string) => void;
  onOptimize: (sectionId: string) => void;
}

/**
 * Section editor component
 */
const SectionEditor: React.FC<SectionEditorProps> = ({ 
  profile, 
  section, 
  onUpdate, 
  onOptimize 
}) => {
  const [content, setContent] = useState(section.content);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    onUpdate(section.id, content);
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {section.title}
        </Typography>
        
        <TextField
          label="Content"
          value={content}
          onChange={handleContentChange}
          multiline
          rows={6}
          fullWidth
        />
        
        {section.originalContent && (
          <Alert severity="info" sx={{ mt: 2 }}>
            This section has been optimized. You can view the original content in the history.
          </Alert>
        )}
      </CardContent>
      
      <CardActions>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          sx={{ mr: 1 }}
        >
          Save
        </Button>
        
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => onOptimize(section.id)}
        >
          Optimize
        </Button>
      </CardActions>
    </Card>
  );
};

/**
 * LinkedIn Profile Editor Component
 * 
 * This component allows users to edit and optimize their LinkedIn profile.
 */
const LinkedInProfileEditor: React.FC = () => {
  const [userId] = useState('user-1'); // In a real app, this would come from auth
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [optimizing, setOptimizing] = useState<string | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const userProfile = await linkedInService.getProfile(userId);
      
      if (userProfile) {
        setProfile(userProfile);
      } else {
        // Create a new profile if none exists
        const newProfile = await linkedInService.createProfile(
          userId,
          'Software Engineer',
          'Technology'
        );
        setProfile(newProfile);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading LinkedIn profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSection = async (sectionId: string, content: string) => {
    if (!profile) return;
    
    try {
      const updatedSection = await linkedInService.updateSection(
        profile.id,
        sectionId,
        { content }
      );
      
      if (updatedSection) {
        // Update the profile in state
        setProfile({
          ...profile,
          sections: profile.sections.map(s => 
            s.id === sectionId ? updatedSection : s
          )
        });
      }
    } catch (err) {
      console.error('Error updating section:', err);
      setError('Failed to update section. Please try again.');
    }
  };

  const handleOptimizeSection = async (sectionId: string) => {
    if (!profile) return;
    
    const section = profile.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    setOptimizing(sectionId);
    setOptimizationResult(null);
    
    try {
      const params: LinkedInOptimizationParams = {
        jobTitle: profile.jobTitle,
        industry: profile.industry,
        sectionType: section.type,
        tone: OptimizationTone.Professional,
        length: OptimizationLength.Moderate,
        focus: [OptimizationFocus.Keywords, OptimizationFocus.Achievements]
      };
      
      const result = await linkedInService.optimizeSection(
        profile.id,
        sectionId,
        params
      );
      
      if (result) {
        setOptimizationResult(result);
        
        // Update the profile in state
        setProfile({
          ...profile,
          sections: profile.sections.map(s => 
            s.id === sectionId ? {
              ...s,
              content: result.optimizedContent,
              originalContent: result.originalContent,
              isOptimized: true,
              lastUpdated: new Date().toISOString()
            } : s
          )
        });
      }
    } catch (err) {
      console.error('Error optimizing section:', err);
      setError('Failed to optimize section. Please try again.');
    } finally {
      setOptimizing(null);
    }
  };

  const handleAddSection = async () => {
    if (!profile) return;
    
    try {
      const newSection = await linkedInService.addSection(
        profile.id,
        LinkedInSectionType.Experience,
        'Experience',
        'Add your experience here...'
      );
      
      if (newSection) {
        // Update the profile in state
        setProfile({
          ...profile,
          sections: [...profile.sections, newSection]
        });
      }
    } catch (err) {
      console.error('Error adding section:', err);
      setError('Failed to add section. Please try again.');
    }
  };

  const handleUpdateProfile = async (updates: Partial<LinkedInProfile>) => {
    if (!profile) return;
    
    try {
      const updatedProfile = await linkedInService.updateProfile(
        profile.id,
        updates
      );
      
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          Failed to load profile. Please refresh the page and try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          LinkedIn Profile Editor
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {optimizationResult && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Section optimized successfully!
            </Typography>
            <Typography variant="body2">
              Improvements: {optimizationResult.improvements.join(', ')}
            </Typography>
            <Typography variant="body2">
              Keywords added: {optimizationResult.keywordsAdded.join(', ')}
            </Typography>
          </Alert>
        )}
        
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Job Title"
                  value={profile.jobTitle}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    handleUpdateProfile({ jobTitle: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Industry"
                  value={profile.industry}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    handleUpdateProfile({ industry: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Headline"
                  value={profile.headline}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    handleUpdateProfile({ headline: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Summary"
                  value={profile.summary}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    handleUpdateProfile({ summary: e.target.value })
                  }
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Profile Sections
          </Typography>
          
          <Tabs
            value={activeTab}
            onChange={(e: React.ChangeEvent<{}>, newValue: number) => setActiveTab(newValue)}
          >
            <Tab 
              label="All Sections" 
              value={0} 
              onClick={() => setActiveTab(0)}
            />
            <Tab 
              label="Experience" 
              value={1} 
              onClick={() => setActiveTab(1)}
            />
            <Tab 
              label="Education" 
              value={2} 
              onClick={() => setActiveTab(2)}
            />
            <Tab 
              label="Skills" 
              value={3} 
              onClick={() => setActiveTab(3)}
            />
          </Tabs>
        </Box>
        
        {profile.sections
          .filter(section => 
            activeTab === 0 || 
            (activeTab === 1 && section.type === LinkedInSectionType.Experience) ||
            (activeTab === 2 && section.type === LinkedInSectionType.Education) ||
            (activeTab === 3 && section.type === LinkedInSectionType.Skills)
          )
          .map(section => (
            <SectionEditor
              key={section.id}
              profile={profile}
              section={section}
              onUpdate={handleUpdateSection}
              onOptimize={handleOptimizeSection}
            />
          ))}
        
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddSection}
          >
            Add Section
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LinkedInProfileEditor;
