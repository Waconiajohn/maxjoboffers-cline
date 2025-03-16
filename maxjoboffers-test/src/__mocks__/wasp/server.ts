export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }
}

export const handleError = (error: any) => {
  console.error('Server error:', error);
  if (error instanceof HttpError) {
    return {
      statusCode: error.statusCode,
      message: error.message
    };
  }
  return {
    statusCode: 500,
    message: 'Internal server error'
  };
};

export const requireAuth = (fn: Function) => {
  return (args: any, context: any) => {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
    }
    return fn(args, context);
  };
};

export const requireAdmin = (fn: Function) => {
  return (args: any, context: any) => {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
    }
    if (!context.user.isAdmin) {
      throw new HttpError(403, 'Forbidden');
    }
    return fn(args, context);
  };
};

export const validateInput = (schema: any) => {
  return (fn: Function) => {
    return (args: any, context: any) => {
      const result = schema.safeParse(args);
      if (!result.success) {
        throw new HttpError(400, 'Invalid input');
      }
      return fn(args, context);
    };
  };
};
