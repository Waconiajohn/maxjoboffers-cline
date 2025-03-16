import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Avatar, 
  Box, 
  Menu, 
  MenuItem, 
  Divider,
  Badge,
  useTheme
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    membershipTier?: string;
  };
  onMenuToggle?: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

/**
 * Header Component
 * 
 * This component displays the application header with navigation, user profile, and notifications.
 */
const Header: React.FC<HeaderProps> = ({ 
  user, 
  onMenuToggle, 
  isAuthenticated = false,
  onLogout
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleProfileMenuClose();
    if (onLogout) {
      onLogout();
    }
  };
  
  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar>
        {isAuthenticated && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MaxJobOffers
        </Typography>
        
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              color="inherit" 
              aria-label="notifications"
              onClick={handleNotificationsOpen}
            >
              <Badge badgeContent={3} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleProfileMenuOpen}>
              <Avatar 
                src={user?.avatarUrl} 
                alt={user?.name || 'User'} 
                sx={{ width: 32, height: 32 }}
              >
                {!user?.avatarUrl && (user?.name?.charAt(0) || <AccountCircleIcon />)}
              </Avatar>
              <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
                {user?.name || 'User'}
              </Typography>
            </Box>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                elevation: 3,
                sx: { minWidth: 200 }
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1">{user?.name}</Typography>
                <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                {user?.membershipTier && (
                  <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                    {user.membershipTier} Plan
                  </Typography>
                )}
              </Box>
              <Divider />
              <MenuItem onClick={handleProfileMenuClose}>
                <DashboardIcon fontSize="small" sx={{ mr: 1 }} />
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                My Resumes
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                Job Applications
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
                Networking
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
                Interview Prep
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleProfileMenuClose}>
                <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToAppIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
            
            <Menu
              anchorEl={notificationsAnchorEl}
              open={Boolean(notificationsAnchorEl)}
              onClose={handleNotificationsClose}
              PaperProps={{
                elevation: 3,
                sx: { minWidth: 300, maxWidth: 350 }
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1">Notifications</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleNotificationsClose}>
                <Box>
                  <Typography variant="body2">Your resume has been optimized</Typography>
                  <Typography variant="caption" color="text.secondary">2 minutes ago</Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleNotificationsClose}>
                <Box>
                  <Typography variant="body2">New job match found</Typography>
                  <Typography variant="caption" color="text.secondary">1 hour ago</Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleNotificationsClose}>
                <Box>
                  <Typography variant="body2">Interview preparation reminder</Typography>
                  <Typography variant="caption" color="text.secondary">Yesterday</Typography>
                </Box>
              </MenuItem>
              <Divider />
              <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
                <Button size="small" onClick={handleNotificationsClose}>
                  View All Notifications
                </Button>
              </Box>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button color="inherit">Login</Button>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ ml: 1 }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
