// Mock useQuery hook
export const useQuery = (queryFn: any, args?: any) => {
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(null)
  };
};

// Mock useAction hook
export const useAction = (actionFn: any) => {
  const actionExecutor = (args?: any) => Promise.resolve({});
  return [
    actionExecutor,
    {
      isLoading: false,
      error: null
    }
  ];
};

// Mock createQuery function
export const createQuery = (queryFn: any, options?: any) => {
  return (args?: any) => {
    return {
      data: null,
      isLoading: false,
      error: null,
      refetch: () => Promise.resolve(null)
    };
  };
};

// Mock createAction function
export const createAction = (actionFn: any, options?: any) => {
  return (args?: any) => {
    const actionExecutor = (actionArgs?: any) => Promise.resolve({});
    return [
      actionExecutor,
      {
        isLoading: false,
        error: null
      }
    ];
  };
};

// Mock QueryClientProvider component
export const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Mock QueryClient class
export class QueryClient {
  constructor() {}
  
  setQueryData = jest.fn();
  getQueryData = jest.fn();
  invalidateQueries = jest.fn();
  prefetchQuery = jest.fn();
  resetQueries = jest.fn();
  clear = jest.fn();
}
