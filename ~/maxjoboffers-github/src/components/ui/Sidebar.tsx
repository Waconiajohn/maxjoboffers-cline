import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Collapse,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  ExpandLess,
  ExpandMore,
  Assignment as AssignmentIcon,
  FileCopy as FileCopyIcon,
  Edit as EditIcon,
  Compare as CompareIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Article as ArticleIcon,
  VideoCall as VideoCallIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Folder as FolderIcon,
  Search as SearchIcon
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

/**
 * Sidebar Component
 * 
 * This component displays the application sidebar with navigation links.
 */
const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  variant = 'temporary',
  activeItem = 'dashboard',
  onItemClick
}) => {
  const theme = useTheme();
  const [resumeOpen, setResumeOpen] = React.useState(false);
  const [jobsOpen, setJobsOpen] = React.useState(false);
  const [networkingOpen, setNetworkingOpen] = React.useState(false);
  const [interviewOpen, setInterviewOpen] = React.useState(false);
  
  const handleResumeClick = () => {
    setResumeOpen(!resumeOpen);
  };
  
  const handleNetworkingClick = () => {
    setNetworkingOpen(!networkingOpen);
  };
  
  const handleInterviewClick = () => {
    setInterviewOpen(!interviewOpen);
  };
  
  const handleItemClick = (item: string) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };
  
  const drawerWidth = 280;
  
  const drawerContent = (
    <Box sx={{ width: drawerWidth, overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div">
          MaxJobOffers
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem 
          button 
          selected={activeItem === 'dashboard'} 
          onClick={() => handleItemClick('dashboard')}
        >
          <ListItemIcon>
            <DashboardIcon color={activeItem === 'dashboard' ? 'primary' : undefined} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        
        <ListItem button onClick={handleResumeClick}>
          <ListItemIcon>
            <DescriptionIcon color={activeItem.startsWith('resume') ? 'primary' : undefined} />
          </ListItemIcon>
          <ListItemText primary="Resume Management" />
          {resumeOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={resumeOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'resume-create'} 
              onClick={() => handleItemClick('resume-create')}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Create & Edit" />
            </ListItem>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'resume-optimize'} 
              onClick={() => handleItemClick('resume-optimize')}
            >
              <ListItemIcon>
                <AssignmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Optimize" />
            </ListItem>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'resume-versions'} 
              onClick={() => handleItemClick('resume-versions')}
            >
              <ListItemIcon>
                <CompareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Versions" />
            </ListItem>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'resume-templates'} 
              onClick={() => handleItemClick('resume-templates')}
            >
              <ListItemIcon>
                <FileCopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Templates" />
            </ListItem>
          </List>
        </Collapse>
        
        <ListItem button onClick={() => setJobsOpen(!jobsOpen)}>
          <ListItemIcon>
            <WorkIcon color={activeItem.startsWith('jobs') ? 'primary' : undefined} />
          </ListItemIcon>
          <ListItemText primary="Job Search" />
          {jobsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={jobsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'jobs-search'} 
              onClick={() => handleItemClick('jobs-search')}
            >
              <ListItemIcon>
                <SearchIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Find Jobs" />
            </ListItem>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'jobs-tracking'} 
              onClick={() => handleItemClick('jobs-tracking')}
            >
              <ListItemIcon>
                <AssignmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Application Tracking" />
            </ListItem>
          </List>
        </Collapse>
        
        <ListItem button onClick={handleNetworkingClick}>
          <ListItemIcon>
            <PeopleIcon color={activeItem.startsWith('networking') ? 'primary' : undefined} />
          </ListItemIcon>
          <ListItemText primary="Networking" />
          {networkingOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={networkingOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'networking-connections'} 
              onClick={() => handleItemClick('networking-connections')}
            >
              <ListItemIcon>
                <GroupIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Connections" />
            </ListItem>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'networking-companies'} 
              onClick={() => handleItemClick('networking-companies')}
            >
              <ListItemIcon>
                <BusinessIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Companies" />
            </ListItem>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'networking-messages'} 
              onClick={() => handleItemClick('networking-messages')}
            >
              <ListItemIcon>
                <MessageIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItem>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'networking-content'} 
              onClick={() => handleItemClick('networking-content')}
            >
              <ListItemIcon>
                <ArticleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Content" />
            </ListItem>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'networking-linkedin'} 
              onClick={() => handleItemClick('networking-linkedin')}
            >
              <ListItemIcon>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="LinkedIn Profile" />
            </ListItem>
          </List>
        </Collapse>
        
        <ListItem button onClick={handleInterviewClick}>
          <ListItemIcon>
            <SchoolIcon color={activeItem.startsWith('interview') ? 'primary' : undefined} />
          </ListItemIcon>
          <ListItemText primary="Interview Prep" />
          {interviewOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={interviewOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'interview-practice'} 
              onClick={() => handleItemClick('interview-practice')}
            >
              <ListItemIcon>
                <VideoCallIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Practice Sessions" />
            </ListItem>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'interview-questions'} 
              onClick={() => handleItemClick('interview-questions')}
            >
              <ListItemIcon>
                <QuestionAnswerIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Question Bank" />
            </ListItem>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              selected={activeItem === 'interview-research'} 
              onClick={() => handleItemClick('interview-research')}
            >
              <ListItemIcon>
                <FolderIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Company Research" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );
  
  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
