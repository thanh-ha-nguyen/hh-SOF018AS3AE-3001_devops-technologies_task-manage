import { Request, Response, NextFunction } from 'express';
import { log } from '../observability/logger.js';

export const errorHandler = (
  err: Error,
  // @ts-expect-error - unused parameter required for Express error handler signature
  req: Request,
  res: Response,
  // @ts-expect-error - unused parameter required for Express error handler signature
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  log('error', 'request_failed', {
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};
