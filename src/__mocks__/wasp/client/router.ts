import React from 'react';

// Mock Link component
export const Link: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}> = ({ to, children, className, onClick, ...rest }) => {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
      {...rest}
    >
      {children}
    </a>
  );
};

// Mock useParams hook
export const useParams = jest.fn(() => ({}));

// Mock useLocation hook
export const useLocation = jest.fn(() => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
}));

// Mock useHistory hook
export const useHistory = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  listen: jest.fn(),
}));

// Mock Route component
export const Route: React.FC<{
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}> = ({ component: Component }) => {
  return <Component />;
};

// Mock Routes component
export const Routes: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

// Mock Navigate component
export const Navigate: React.FC<{
  to: string;
  replace?: boolean;
}> = () => null;

// Mock useNavigate hook
export const useNavigate = jest.fn(() => jest.fn());
