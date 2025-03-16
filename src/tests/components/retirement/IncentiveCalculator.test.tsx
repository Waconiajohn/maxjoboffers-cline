import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IncentiveCalculator } from '../../../components/retirement/IncentiveCalculator';

describe('IncentiveCalculator', () => {
  it('renders with default values', () => {
    // Arrange & Act
    render(<IncentiveCalculator />);
    
    // Assert
    expect(screen.getByText('Rollover Incentive Calculator')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument(); // Default incentive for $100,000
  });
  
  it('updates incentive amount when slider is moved', () => {
    // Arrange
    render(<IncentiveCalculator />);
    
    // Act
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 500000 } });
    
    // Assert
    expect(screen.getByText('$3,000')).toBeInTheDocument(); // Incentive for $500,000
  });
  
  it('updates incentive amount when input value changes', () => {
    // Arrange
    render(<IncentiveCalculator />);
    
    // Act
    const input = screen.getByLabelText('Rollover Amount');
    fireEvent.change(input, { target: { value: '$1,000,000' } });
    
    // Assert
    expect(screen.getByText('$4,000')).toBeInTheDocument(); // Incentive for $1,000,000
  });
  
  it('displays all incentive tiers', () => {
    // Arrange & Act
    render(<IncentiveCalculator />);
    
    // Assert
    expect(screen.getByText(/\$50,000 – \$99,999: \$500 incentive/)).toBeInTheDocument();
    expect(screen.getByText(/\$100,000 – \$249,999: \$1,000 incentive/)).toBeInTheDocument();
    expect(screen.getByText(/\$250,000 – \$499,999: \$2,000 incentive/)).toBeInTheDocument();
    expect(screen.getByText(/\$500,000 – \$999,999: \$3,000 incentive/)).toBeInTheDocument();
    expect(screen.getByText(/\$1,000,000 and above: \$4,000 incentive/)).toBeInTheDocument();
  });
});
