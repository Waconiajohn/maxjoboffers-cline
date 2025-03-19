/**
 * Financial Feature Module
 * 
 * This module exports all financial-related components, services, and types.
 */

// Export components
export { default as FinancialPlanForm } from './components/FinancialPlanForm';
export { default as RetirementCalculator } from './components/RetirementCalculator';

// Export pages
export { default as FinancialPlanPage } from './pages/FinancialPlanPage';
export { default as RetirementCalculatorPage } from './pages/RetirementCalculatorPage';

// Export actions
export * from './actions/financialActions';

// Export services
export * from './services/financialService';

// Export types
export * from './types';
