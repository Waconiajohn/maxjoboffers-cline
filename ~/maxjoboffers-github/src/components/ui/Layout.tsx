import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import theme from './theme';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    membershipTier?: string;
  };
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

/**
 * Layout Component
 * 
 * This component provides the main layout for the application, including the header and sidebar.
 */
const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  isAuthenticated = false,
  onLogout
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };
  
  const handleItemClick = (item: string) => {
    setActiveItem(item);
    handleSidebarClose();
    
    // Handle navigation based on the selected item
    switch (item) {
      case 'dashboard':
        navigate('/');
        break;
      case 'resume-create':
      case 'resume-optimize':
      case 'resume-versions':
      case 'resume-templates':
        navigate('/resume');
        break;
      case 'jobs-search':
        navigate('/jobs/search');
        break;
      case 'jobs-tracking':
        navigate('/jobs/tracking');
        break;
      case 'networking-connections':
      case 'networking-companies':
      case 'networking-messages':
    case 'networking-content':
      navigate('/networking/content');
      break;
      case 'networking-linkedin':
      navigate('/networking/linkedin');
      break;
    case 'interview-practice':
      navigate('/interview');
      break;
    case 'interview-questions':
      navigate('/interview');
      break;
    case 'interview-research':
      navigate('/interview');
      break;
      default:
        // For other items, just stay on the current page
        break;
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        
        <Header 
          user={user} 
          isAuthenticated={isAuthenticated} 
          onMenuToggle={handleSidebarToggle}
          onLogout={onLogout}
        />
        
        {isAuthenticated && (
          <Sidebar 
            open={sidebarOpen} 
            onClose={handleSidebarClose}
            variant={isMobile ? 'temporary' : 'permanent'}
            activeItem={activeItem}
            onItemClick={handleItemClick}
          />
        )}
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            width: { sm: `calc(100% - ${isMobile ? 0 : 280}px)` },
            ml: { sm: isMobile ? 0 : `280px` },
            mt: '64px'
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
