/**
 * Common Feature Module
 *
 * This module exports all common components, pages, and utilities.
 */

// Export pages
export { LandingPage } from './pages/LandingPage';

// Export components
export { default as MainLayout } from './components/MainLayout';

// Export utilities
export * from './utils/s3Uploader';
export * from './utils/multiRegionS3Client';
