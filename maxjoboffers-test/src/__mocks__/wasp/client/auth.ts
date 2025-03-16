// Mock user type
export interface User {
  id: string;
  email: string;
  username?: string;
  isEmailVerified: boolean;
  isAdmin: boolean;
  subscriptionStatus?: string;
  subscriptionPlanId?: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock useAuth hook
export const useAuth = () => {
  return {
    data: {
      id: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      isEmailVerified: true,
      isAdmin: false,
      subscriptionStatus: 'active',
      subscriptionPlanId: 'professional',
      credits: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    isLoading: false,
    error: null
  };
};

// Mock login function
export const login = async (email: string, password: string) => {
  if (email === 'test@example.com' && password === 'password') {
    return {
      success: true,
      user: {
        id: 'user-123',
        email: 'test@example.com'
      }
    };
  }
  throw new Error('Invalid credentials');
};

// Mock signup function
export const signup = async (email: string, password: string, username?: string) => {
  return {
    success: true,
    user: {
      id: 'user-123',
      email,
      username
    }
  };
};

// Mock logout function
export const logout = async () => {
  return { success: true };
};

// Mock useUser hook
export const useUser = () => {
  return {
    data: {
      id: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      isEmailVerified: true,
      isAdmin: false,
      subscriptionStatus: 'active',
      subscriptionPlanId: 'professional',
      credits: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    isLoading: false,
    error: null
  };
};

// Mock isAuthenticated function
export const isAuthenticated = () => true;

// Mock useRequireAuth hook
export const useRequireAuth = () => {
  return {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    isEmailVerified: true,
    isAdmin: false,
    subscriptionStatus: 'active',
    subscriptionPlanId: 'professional',
    credits: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};
