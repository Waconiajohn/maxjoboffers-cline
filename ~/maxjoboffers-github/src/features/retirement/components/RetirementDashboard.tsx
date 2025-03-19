import React, { useState, useEffect } from 'react';
import {
  RetirementProfile,
  RetirementProjection,
  RetirementReadiness,
  RetirementRecommendation,
  YearlyProjection,
  RetirementReadinessStatus,
  SavingsRateStatus,
  AssetClass
} from '../types';
import { retirementService } from '../services/retirementService';

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
const LinearProgress = ({ value, color, sx }: any) => (
  <div style={{ 
    width: '100%', 
    height: '8px', 
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    ...(sx || {})
  }}>
    <div style={{
      width: `${value}%`,
      height: '100%',
      backgroundColor: color === 'success' ? '#4caf50' : 
                       color === 'warning' ? '#ff9800' : 
                       color === 'error' ? '#f44336' : '#2196f3'
    }} />
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
const List = ({ children, sx }: any) => (
  <ul style={{ 
    listStyle: 'none',
    padding: 0,
    margin: 0,
    ...(sx || {})
  }}>
    {children}
  </ul>
);
const ListItem = ({ children, sx }: any) => (
  <li style={{ 
    padding: '8px 0',
    ...(sx || {})
  }}>
    {children}
  </li>
);
const ListItemText = ({ primary, secondary, sx }: any) => (
  <div style={{ ...(sx || {}) }}>
    <div style={{ fontWeight: 'bold' }}>{primary}</div>
    {secondary && <div style={{ color: '#666' }}>{secondary}</div>}
  </div>
);
const Chip = ({ label, color, sx }: any) => (
  <span style={{ 
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '16px',
    fontSize: '0.75rem',
    backgroundColor: color === 'success' ? '#e8f5e9' : 
                     color === 'warning' ? '#fff8e1' : 
                     color === 'error' ? '#ffebee' : '#e3f2fd',
    color: color === 'success' ? '#2e7d32' : 
           color === 'warning' ? '#f57f17' : 
           color === 'error' ? '#c62828' : '#1565c0',
    ...(sx || {})
  }}>
    {label}
  </span>
);

/**
 * Retirement Summary Card Component
 */
interface RetirementSummaryCardProps {
  profile: RetirementProfile;
  projection: RetirementProjection;
  readiness: RetirementReadiness;
}

const RetirementSummaryCard: React.FC<RetirementSummaryCardProps> = ({ 
  profile, 
  projection, 
  readiness 
}) => {
  const getReadinessColor = (status: RetirementReadinessStatus) => {
    switch (status) {
      case RetirementReadinessStatus.Critical:
        return 'error';
      case RetirementReadinessStatus.AtRisk:
        return 'warning';
      case RetirementReadinessStatus.OnTrack:
        return 'info';
      case RetirementReadinessStatus.Good:
      case RetirementReadinessStatus.Excellent:
        return 'success';
      default:
        return 'info';
    }
  };

  const getSavingsRateColor = (status: SavingsRateStatus) => {
    switch (status) {
      case SavingsRateStatus.Low:
        return 'error';
      case SavingsRateStatus.BelowTarget:
        return 'warning';
      case SavingsRateStatus.OnTarget:
        return 'info';
      case SavingsRateStatus.AboveTarget:
      case SavingsRateStatus.Excellent:
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Retirement Summary
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">
              Retirement Readiness
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LinearProgress 
                value={readiness.score} 
                color={getReadinessColor(readiness.status)} 
                sx={{ flexGrow: 1, mr: 2 }}
              />
              <Chip 
                label={readiness.status.replace('_', ' ')} 
                color={getReadinessColor(readiness.status)}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Score: {readiness.score.toFixed(0)}/100
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">
              Savings Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LinearProgress 
                value={Math.min(100, projection.savingsRate * 5)} 
                color={getSavingsRateColor(projection.savingsRateStatus)} 
                sx={{ flexGrow: 1, mr: 2 }}
              />
              <Chip 
                label={projection.savingsRateStatus.replace('_', ' ')} 
                color={getSavingsRateColor(projection.savingsRateStatus)}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {projection.savingsRate.toFixed(1)}% of income
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2">
              Current Age
            </Typography>
            <Typography variant="h6">
              {profile.currentAge}
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2">
              Target Retirement
            </Typography>
            <Typography variant="h6">
              {profile.targetRetirementAge}
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2">
              Years to Retirement
            </Typography>
            <Typography variant="h6">
              {projection.yearsToRetirement}
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2">
              Monthly Savings
            </Typography>
            <Typography variant="h6">
              ${profile.monthlySavings.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">
              Current Savings
            </Typography>
            <Typography variant="h6">
              ${profile.currentSavings.toLocaleString()}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">
              Projected Savings
            </Typography>
            <Typography variant="h6">
              ${projection.projectedSavings.toLocaleString()}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">
              Projected Monthly Income
            </Typography>
            <Typography variant="h6">
              ${projection.projectedMonthlyIncome.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      
      <CardActions>
        <Button variant="outlined" color="primary">
          Update Profile
        </Button>
      </CardActions>
    </Card>
  );
};

/**
 * Retirement Recommendations Card Component
 */
interface RecommendationsCardProps {
  recommendations: RetirementRecommendation[];
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Recommendations
        </Typography>
        
        <List>
          {recommendations.map(recommendation => (
            <ListItem key={recommendation.id}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">
                    {recommendation.title}
                  </Typography>
                  <Chip 
                    label={`${recommendation.impact} impact`} 
                    color={getImpactColor(recommendation.impact)}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {recommendation.description}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Action Items:
                </Typography>
                <List>
                  {recommendation.actionItems.map((item, index) => (
                    <ListItem key={index}>
                      <Typography variant="body2">
                        • {item}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
              
              {recommendation.id !== recommendations[recommendations.length - 1].id && (
                <Divider sx={{ my: 2 }} />
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

/**
 * Retirement Projection Chart Component
 */
interface ProjectionChartProps {
  projectionByYear: YearlyProjection[];
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ projectionByYear }) => {
  // In a real implementation, this would use a charting library like Chart.js or Recharts
  // For this example, we'll create a simple table
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Retirement Projection
        </Typography>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Age</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Year</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Contributions</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Employer Match</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Returns</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Total Savings</th>
              </tr>
            </thead>
            <tbody>
              {projectionByYear.map((year, index) => (
                <tr 
                  key={index} 
                  style={{ 
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: index % 5 === 0 ? '#f5f5f5' : 'transparent'
                  }}
                >
                  <td style={{ padding: '8px' }}>{year.age}</td>
                  <td style={{ padding: '8px' }}>{year.year}</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>${year.contributions.toLocaleString()}</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>${year.employerMatch.toLocaleString()}</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>${year.returns.toLocaleString()}</td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>${year.totalSavings.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Asset Allocation Card Component
 */
interface AssetAllocationCardProps {
  profile: RetirementProfile;
}

const AssetAllocationCard: React.FC<AssetAllocationCardProps> = ({ profile }) => {
  const getAssetClassColor = (assetClass: AssetClass) => {
    switch (assetClass) {
      case AssetClass.Cash:
        return '#4caf50'; // Green
      case AssetClass.Bonds:
        return '#2196f3'; // Blue
      case AssetClass.Stocks:
        return '#f44336'; // Red
      case AssetClass.RealEstate:
        return '#ff9800'; // Orange
      case AssetClass.Commodities:
        return '#9c27b0'; // Purple
      case AssetClass.Alternatives:
        return '#795548'; // Brown
      default:
        return '#9e9e9e'; // Grey
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Asset Allocation
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          {/* In a real implementation, this would be a pie chart */}
          <div style={{ display: 'flex', height: '20px', width: '100%', borderRadius: '4px', overflow: 'hidden' }}>
            {profile.investmentAllocations.map((allocation, index) => (
              <div 
                key={index}
                style={{ 
                  width: `${allocation.percentage}%`, 
                  height: '100%', 
                  backgroundColor: getAssetClassColor(allocation.assetClass)
                }}
              />
            ))}
          </div>
        </Box>
        
        <List>
          {profile.investmentAllocations.map((allocation, index) => (
            <ListItem key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <div 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: getAssetClassColor(allocation.assetClass),
                      marginRight: '8px',
                      borderRadius: '2px'
                    }}
                  />
                  <Typography variant="body2">
                    {allocation.assetClass.replace('_', ' ')}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {allocation.percentage}%
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Expected Annual Return: {profile.investmentAllocations.reduce(
            (sum, allocation) => sum + (allocation.percentage / 100) * allocation.expectedReturn,
            0
          ).toFixed(2)}%
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Based on your {profile.riskTolerance.replace('_', ' ')} risk tolerance
        </Typography>
      </CardContent>
      
      <CardActions>
        <Button variant="outlined" color="primary">
          Adjust Allocation
        </Button>
      </CardActions>
    </Card>
  );
};

/**
 * Retirement Dashboard Component
 * 
 * This component displays a comprehensive retirement planning dashboard.
 */
const RetirementDashboard: React.FC = () => {
  const [userId] = useState('user-1'); // In a real app, this would come from auth
  const [profile, setProfile] = useState<RetirementProfile | null>(null);
  const [projection, setProjection] = useState<RetirementProjection | null>(null);
  const [readiness, setReadiness] = useState<RetirementReadiness | null>(null);
  const [recommendations, setRecommendations] = useState<RetirementRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadRetirementData();
  }, []);

  const loadRetirementData = async () => {
    setLoading(true);
    try {
      // Load profile
      const userProfile = await retirementService.getProfile(userId);
      if (!userProfile) {
        setError('No retirement profile found. Please create one.');
        setLoading(false);
        return;
      }
      
      setProfile(userProfile);
      
      // Load projection
      const userProjection = await retirementService.generateProjection(userProfile.id);
      if (userProjection) {
        setProjection(userProjection);
      }
      
      // Load readiness
      const userReadiness = await retirementService.calculateRetirementReadiness(userProfile.id);
      if (userReadiness) {
        setReadiness(userReadiness);
      }
      
      // Load recommendations
      const userRecommendations = await retirementService.generateRecommendations(userProfile.id);
      setRecommendations(userRecommendations);
      
      setError(null);
    } catch (err) {
      console.error('Error loading retirement data:', err);
      setError('Failed to load retirement data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          {error}
        </Alert>
        <Button variant="contained" color="primary" onClick={() => {}}>
          Create Retirement Profile
        </Button>
      </Container>
    );
  }

  if (!profile || !projection || !readiness) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">
          Retirement data is incomplete. Please update your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Retirement Planning
        </Typography>
        
        <RetirementSummaryCard 
          profile={profile} 
          projection={projection} 
          readiness={readiness} 
        />
        
        <Box sx={{ mt: 4, mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(e: React.ChangeEvent<{}>, newValue: number) => setActiveTab(newValue)}
          >
            <Tab 
              label="Recommendations" 
              value={0} 
              onClick={() => setActiveTab(0)}
            />
            <Tab 
              label="Projection" 
              value={1} 
              onClick={() => setActiveTab(1)}
            />
            <Tab 
              label="Asset Allocation" 
              value={2} 
              onClick={() => setActiveTab(2)}
            />
          </Tabs>
        </Box>
        
        {activeTab === 0 && (
          <RecommendationsCard recommendations={recommendations} />
        )}
        
        {activeTab === 1 && (
          <ProjectionChart projectionByYear={projection.projectionByYear} />
        )}
        
        {activeTab === 2 && (
          <AssetAllocationCard profile={profile} />
        )}
      </Box>
    </Container>
  );
};

export default RetirementDashboard;
