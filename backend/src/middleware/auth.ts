import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types/api';
import { logger, logSecurityEvent } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    anonymousUsername: string;
    verificationStatus: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logSecurityEvent('AUTH_MISSING_TOKEN', { 
        ip: req.ip, 
        userAgent: req.get('User-Agent'),
        path: req.path 
      });
      
      res.status(401).json({
        success: false,
        error: {
          message: 'Access denied. No token provided.',
          code: 'AUTH_001'
        }
      } as ApiResponse<null>);
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET not configured');
      res.status(500).json({
        success: false,
        error: {
          message: 'Authentication service unavailable',
          code: 'AUTH_CONFIG_ERROR'
        }
      } as ApiResponse<null>);
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    // Add user info to request
    req.userId = decoded.userId;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      anonymousUsername: decoded.anonymousUsername,
      verificationStatus: decoded.verificationStatus
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logSecurityEvent('AUTH_TOKEN_EXPIRED', { 
        ip: req.ip, 
        userAgent: req.get('User-Agent') 
      });
      
      res.status(401).json({
        success: false,
        error: {
          message: 'Token expired',
          code: 'AUTH_001',
          details: { reason: 'Token expired' }
        }
      } as ApiResponse<null>);
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      logSecurityEvent('AUTH_INVALID_TOKEN', { 
        ip: req.ip, 
        userAgent: req.get('User-Agent'),
        error: error.message 
      });
      
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token',
          code: 'AUTH_001',
          details: { reason: 'Invalid token' }
        }
      } as ApiResponse<null>);
      return;
    }

    logger.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Authentication service error',
        code: 'AUTH_ERROR'
      }
    } as ApiResponse<null>);
  }
};