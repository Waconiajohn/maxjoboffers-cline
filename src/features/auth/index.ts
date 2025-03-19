/**
 * Auth Feature Module
 *
 * This module exports all auth-related components, services, and types.
 */

// Export pages
export { default as LoginPage } from './pages/LoginPage';
export { default as SignupPage } from './pages/SignupPage';
export { default as ForgotPasswordPage } from './pages/ForgotPasswordPage';
export { default as ResetPasswordPage } from './pages/ResetPasswordPage';
export { default as EmailVerificationPage } from './pages/EmailVerificationPage';
export { default as UserProfilePage } from './pages/UserProfilePage';

// Export services
export * from './services/userQueries';

// Export config
export * from './config/emails';
export { getGoogleAuthConfig } from './config/google';
export { getLinkedInAuthConfig } from './config/linkedin';
