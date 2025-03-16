import React, { useState, useEffect } from 'react';
import { Typography, Box, Slider, TextField, Paper, Grid, InputAdornment } from '@mui/material';
import { retirementService } from '../../services/retirement';

export const IncentiveCalculator: React.FC = () => {
  const [rolloverAmount, setRolloverAmount] = useState<number>(100000);
  const [incentiveAmount, setIncentiveAmount] = useState<number>(1000); // Default to $1,000 (for $100,000)
  
  // Calculate incentive based on tiered structure
  useEffect(() => {
    try {
      const calculatedIncentive = retirementService.calculateIncentiveAmount(rolloverAmount);
      setIncentiveAmount(calculatedIncentive);
    } catch (error) {
      console.error('Error calculating incentive amount:', error);
      // Keep the default incentive amount
    }
  }, [rolloverAmount]);
  
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setRolloverAmount(newValue as number);
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters (like $ and ,)
    const value = Number(event.target.value.replace(/[^0-9]/g, ''));
    setRolloverAmount(value);
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Rollover Incentive Calculator
      </Typography>
      
      <Typography variant="body1" paragraph>
        See how much you could receive when you roll over your retirement accounts to our firm.
      </Typography>
      
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            label="Rollover Amount"
            value={rolloverAmount ? rolloverAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '$0'}
            onChange={handleInputChange}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <Slider
            value={rolloverAmount}
            onChange={handleSliderChange}
            min={0}
            max={1500000}
            step={10000}
            aria-labelledby="rollover-amount-slider"
            sx={{ mt: 3 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption">$0</Typography>
            <Typography variant="caption">$500K</Typography>
            <Typography variant="caption">$1M+</Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Your Incentive Amount
            </Typography>
            <Typography variant="h3">
              ${incentiveAmount ? incentiveAmount.toLocaleString() : '0'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              *Subject to 12-month holding period and other terms
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Incentive Tiers:
        </Typography>
        <Typography variant="body2">
          • $50,000 – $99,999: $500 incentive<br />
          • $100,000 – $249,999: $1,000 incentive<br />
          • $250,000 – $499,999: $2,000 incentive<br />
          • $500,000 – $999,999: $3,000 incentive<br />
          • $1,000,000 and above: $4,000 incentive (maximum)
        </Typography>
      </Box>
    </Box>
  );
};
