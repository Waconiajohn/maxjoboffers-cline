import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Grid, 
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import HistoryIcon from '@mui/icons-material/History';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TemplateIcon from '@mui/icons-material/DesignServices';

import { 
  ResumeData, 
  ResumeVersion, 
  ResumeTemplate, 
  ResumeFormat,
  ResumeExportFormat,
  ResumeSection,
  ResumeAnalysis
} from '../types';
import { resumeService } from '../services/resumeService';
import ResumeEditor from './ResumeEditor';
import ResumeVersionHistory from './ResumeVersionHistory';
import ResumeAnalytics from './ResumeAnalytics';
import ResumeTemplates from './ResumeTemplates';
import AIAssistant from './AIAssistant';
import ResumePreview from './ResumePreview';

interface ResumeManagerProps {
  userId: string;
}

const ResumeManager: React.FC<ResumeManagerProps> = ({ userId }) => {
  // State for resumes
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  
  // State for versions
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  
  // State for templates
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  
  // State for analyses
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  
  // UI state
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Load user's resumes on component mount
  useEffect(() => {
    const loadResumes = async () => {
      try {
        setLoading(true);
        const userResumes = await resumeService.getResumes(userId);
        setResumes(userResumes);
        
        // Select the first resume by default if available
        if (userResumes.length > 0) {
          setSelectedResumeId(userResumes[0].id);
        }
      } catch (err) {
        setError('Failed to load resumes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadResumes();
  }, [userId]);
  
  // Load selected resume details when selectedResumeId changes
  useEffect(() => {
    if (!selectedResumeId) {
      setSelectedResume(null);
      setVersions([]);
      setAnalyses([]);
      return;
    }
    
    const loadResumeDetails = async () => {
      try {
        setLoading(true);
        
        // Load resume
        const resume = await resumeService.getResumeById(selectedResumeId);
        setSelectedResume(resume);
        
        // Load versions
        const resumeVersions = await resumeService.getResumeVersions(selectedResumeId);
        setVersions(resumeVersions);
        
        // Load analyses
        const resumeAnalyses = await resumeService.getResumeAnalyses(selectedResumeId);
        setAnalyses(resumeAnalyses);
      } catch (err) {
        setError('Failed to load resume details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadResumeDetails();
  }, [selectedResumeId]);
  
  // Load templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const resumeTemplates = await resumeService.getResumeTemplates();
        setTemplates(resumeTemplates);
      } catch (err) {
        setError('Failed to load templates');
        console.error(err);
      }
    };
    
    loadTemplates();
  }, []);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Handle resume selection
  const handleResumeSelect = (resumeId: string) => {
    setSelectedResumeId(resumeId);
    setIsCreatingNew(false);
  };
  
  // Handle create new resume
  const handleCreateNew = () => {
    setSelectedResumeId(null);
    setIsCreatingNew(true);
    setActiveTab(0); // Switch to editor tab
  };
  
  // Handle save new resume
  const handleSaveNewResume = async (resumeData: Partial<ResumeData>) => {
    try {
      setLoading(true);
      
      const newResume = await resumeService.createResume(
        userId,
        resumeData.name || 'Untitled Resume',
        resumeData.format || ResumeFormat.Standard,
        resumeData
      );
      
      setResumes([...resumes, newResume]);
      setSelectedResumeId(newResume.id);
      setIsCreatingNew(false);
      setSuccess('Resume created successfully');
    } catch (err) {
      setError('Failed to create resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle update resume
  const handleUpdateResume = async (resumeData: Partial<ResumeData>) => {
    if (!selectedResumeId) return;
    
    try {
      setLoading(true);
      
      const updatedResume = await resumeService.updateResume(
        selectedResumeId,
        resumeData
      );
      
      if (updatedResume) {
        setSelectedResume(updatedResume);
        setResumes(resumes.map(r => r.id === updatedResume.id ? updatedResume : r));
        setSuccess('Resume updated successfully');
        
        // Refresh versions
        const resumeVersions = await resumeService.getResumeVersions(selectedResumeId);
        setVersions(resumeVersions);
      }
    } catch (err) {
      setError('Failed to update resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete resume
  const handleDeleteResume = async () => {
    if (!selectedResumeId) return;
    
    try {
      setLoading(true);
      
      const success = await resumeService.deleteResume(selectedResumeId);
      
      if (success) {
        const updatedResumes = resumes.filter(r => r.id !== selectedResumeId);
        setResumes(updatedResumes);
        
        // Select another resume if available
        if (updatedResumes.length > 0) {
          setSelectedResumeId(updatedResumes[0].id);
        } else {
          setSelectedResumeId(null);
        }
        
        setSuccess('Resume deleted successfully');
      }
    } catch (err) {
      setError('Failed to delete resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle export resume
  const handleExportResume = async (format: ResumeExportFormat) => {
    if (!selectedResumeId) return;
    
    try {
      setLoading(true);
      
      const result = await resumeService.exportResume(selectedResumeId, {
        format,
        includeReferences: true
      });
      
      if (result) {
        // In a real app, this would trigger a download
        console.log('Downloading resume:', result.url);
        setSuccess(`Resume exported as ${result.filename}`);
      }
    } catch (err) {
      setError('Failed to export resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle apply template
  const handleApplyTemplate = async (templateId: string) => {
    if (!selectedResumeId) return;
    
    try {
      setLoading(true);
      
      const updatedResume = await resumeService.applyTemplate(selectedResumeId, templateId);
      
      if (updatedResume) {
        setSelectedResume(updatedResume);
        setResumes(resumes.map(r => r.id === updatedResume.id ? updatedResume : r));
        
        // Refresh versions
        const resumeVersions = await resumeService.getResumeVersions(selectedResumeId);
        setVersions(resumeVersions);
        
        setSuccess('Template applied successfully');
      }
    } catch (err) {
      setError('Failed to apply template');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle restore version
  const handleRestoreVersion = async (versionId: string) => {
    try {
      setLoading(true);
      
      const version = await resumeService.setActiveVersion(versionId);
      
      if (version) {
        // Refresh resume
        const resume = await resumeService.getResumeById(version.resumeId);
        setSelectedResume(resume);
        setResumes(resumes.map(r => r.id === version.resumeId ? resume! : r));
        
        // Refresh versions
        const resumeVersions = await resumeService.getResumeVersions(version.resumeId);
        setVersions(resumeVersions);
        
        setSuccess('Version restored successfully');
      }
    } catch (err) {
      setError('Failed to restore version');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle analyze resume
  const handleAnalyzeResume = async (jobTitle?: string, jobDescription?: string) => {
    if (!selectedResumeId) return;
    
    try {
      setLoading(true);
      
      const analysis = await resumeService.analyzeResume(
        selectedResumeId,
        jobTitle,
        jobDescription
      );
      
      setAnalyses([analysis, ...analyses]);
      setActiveTab(2); // Switch to analytics tab
      setSuccess('Resume analyzed successfully');
    } catch (err) {
      setError('Failed to analyze resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle AI rewrite
  const handleAIRewrite = async (section: ResumeSection | 'all', jobTitle?: string, jobDescription?: string) => {
    if (!selectedResumeId) return;
    
    try {
      setLoading(true);
      
      const response = await resumeService.requestAIRewrite({
        resumeId: selectedResumeId,
        section,
        jobTitle,
        jobDescription
      });
      
      const updatedResume = await resumeService.applyAIRewrite(
        selectedResumeId,
        response.id
      );
      
      if (updatedResume) {
        setSelectedResume(updatedResume);
        setResumes(resumes.map(r => r.id === updatedResume.id ? updatedResume : r));
        
        // Refresh versions
        const resumeVersions = await resumeService.getResumeVersions(selectedResumeId);
        setVersions(resumeVersions);
        
        setSuccess(`${section === 'all' ? 'Resume' : section} rewritten successfully`);
      }
    } catch (err) {
      setError('Failed to rewrite resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };
  
  // Render resume list
  const renderResumeList = () => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          My Resumes
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {resumes.map(resume => (
            <Paper
              key={resume.id}
              elevation={selectedResumeId === resume.id ? 3 : 1}
              sx={{
                p: 2,
                cursor: 'pointer',
                bgcolor: selectedResumeId === resume.id ? 'primary.light' : 'background.paper',
                color: selectedResumeId === resume.id ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: selectedResumeId === resume.id ? 'primary.main' : 'action.hover'
                }
              }}
              onClick={() => handleResumeSelect(resume.id)}
            >
              <Typography variant="subtitle1">{resume.name}</Typography>
              <Typography variant="body2" color={selectedResumeId === resume.id ? 'inherit' : 'text.secondary'}>
                {resume.header.title}
              </Typography>
              <Typography variant="caption" color={selectedResumeId === resume.id ? 'inherit' : 'text.secondary'}>
                Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
              </Typography>
            </Paper>
          ))}
        </Box>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          sx={{ mt: 2 }}
          fullWidth
        >
          Create New Resume
        </Button>
      </Box>
    );
  };
  
  // Render main content
  const renderContent = () => {
    if (loading && !selectedResume && !isCreatingNew) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (!selectedResume && !isCreatingNew) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No resume selected
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            Create New Resume
          </Button>
        </Box>
      );
    }
    
    return (
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="resume tabs">
            <Tab icon={<AutoFixHighIcon />} label="Editor" />
            <Tab icon={<HistoryIcon />} label="Versions" />
            <Tab icon={<AnalyticsIcon />} label="Analytics" />
            <Tab icon={<TemplateIcon />} label="Templates" />
            <Tab icon={<DownloadIcon />} label="Export" />
          </Tabs>
        </Box>
        
        {/* Editor Tab */}
        {activeTab === 0 && (
          <ResumeEditor
            resume={selectedResume}
            isNew={isCreatingNew}
            onSave={isCreatingNew ? handleSaveNewResume : handleUpdateResume}
            onDelete={handleDeleteResume}
            onAnalyze={handleAnalyzeResume}
            onAIRewrite={handleAIRewrite}
            loading={loading}
          />
        )}
        
        {/* Versions Tab */}
        {activeTab === 1 && (
          <ResumeVersionHistory
            versions={versions}
            onRestore={handleRestoreVersion}
            loading={loading}
          />
        )}
        
        {/* Analytics Tab */}
        {activeTab === 2 && (
          <ResumeAnalytics
            analyses={analyses}
            onAnalyze={handleAnalyzeResume}
            loading={loading}
          />
        )}
        
        {/* Templates Tab */}
        {activeTab === 3 && (
          <ResumeTemplates
            templates={templates}
            currentFormat={selectedResume?.format}
            onApply={handleApplyTemplate}
            loading={loading}
          />
        )}
        
        {/* Export Tab */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Export Resume
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExportResume(ResumeExportFormat.PDF)}
                  fullWidth
                >
                  Export as PDF
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExportResume(ResumeExportFormat.DOCX)}
                  fullWidth
                >
                  Export as DOCX
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExportResume(ResumeExportFormat.TXT)}
                  fullWidth
                >
                  Export as TXT
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExportResume(ResumeExportFormat.JSON)}
                  fullWidth
                >
                  Export as JSON
                </Button>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Preview
              </Typography>
              <Paper sx={{ p: 3, maxHeight: '600px', overflow: 'auto' }}>
                {selectedResume && <ResumePreview resume={selectedResume} />}
              </Paper>
            </Box>
          </Box>
        )}
      </Box>
    );
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Resume Manager
      </Typography>
      
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          {renderResumeList()}
          
          <Divider sx={{ my: 3 }} />
          
          <AIAssistant
            onAIRewrite={handleAIRewrite}
            onAnalyze={handleAnalyzeResume}
            disabled={!selectedResumeId}
          />
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {renderContent()}
        </Grid>
      </Grid>
      
      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
      
      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumeManager;
