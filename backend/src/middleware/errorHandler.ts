import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Default error response
  const response: ApiResponse<null> = {
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    },
    timestamp: new Date().toISOString()
  };

  // Handle specific error types
  if (error.name === 'ValidationError') {
    response.error = {
      message: 'Validation failed',
      code: 'VALIDATION_001',
      details: error.details || error.message
    };
    res.status(400).json(response);
    return;
  }

  if (error.name === 'CastError') {
    response.error = {
      message: 'Invalid data format',
      code: 'VALIDATION_001'
    };
    res.status(400).json(response);
    return;
  }

  if (error.code === 11000) { // MongoDB duplicate key error
    response.error = {
      message: 'Duplicate entry',
      code: 'DUPLICATE_ENTRY'
    };
    res.status(409).json(response);
    return;
  }

  // Default to 500 Internal Server Error
  res.status(500).json(response);
};