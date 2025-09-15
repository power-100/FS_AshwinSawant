import winston from 'winston';
import path from 'path';

const { combine, timestamp, errors, json, simple, colorize, printf } = winston.format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create logs directory if it doesn't exist
const logDir = process.env.LOG_DIR || 'logs';

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each log level
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(logColors);

// Create the logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { 
    service: 'student-commute-optimizer',
    version: process.env.API_VERSION || 'v1'
  },
  transports: [
    // Error logs - separate file for errors only
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        json()
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),

    // Combined logs - all levels
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        json()
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      tailable: true
    }),

    // HTTP request logs
    new winston.transports.File({
      filename: path.join(logDir, 'http.log'),
      level: 'http',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        json()
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        json()
      )
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        json()
      )
    })
  ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'HH:mm:ss' }),
      errors({ stack: true }),
      consoleFormat
    )
  }));
}

// Create a stream object for Morgan HTTP logging
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  }
};

// Utility functions for structured logging
export const logUserAction = (userId: string, action: string, details?: any) => {
  logger.info('User action', {
    userId,
    action,
    details,
    timestamp: new Date().toISOString()
  });
};

export const logApiRequest = (method: string, url: string, userId?: string, duration?: number) => {
  logger.http('API request', {
    method,
    url,
    userId,
    duration,
    timestamp: new Date().toISOString()
  });
};

export const logSecurityEvent = (event: string, details: any, level: 'warn' | 'error' = 'warn') => {
  logger.log(level, 'Security event', {
    event,
    details,
    timestamp: new Date().toISOString()
  });
};

export const logDatabaseOperation = (operation: string, collection: string, details?: any) => {
  logger.debug('Database operation', {
    operation,
    collection,
    details,
    timestamp: new Date().toISOString()
  });
};

export const logWebSocketEvent = (event: string, userId?: string, details?: any) => {
  logger.debug('WebSocket event', {
    event,
    userId,
    details,
    timestamp: new Date().toISOString()
  });
};

export const logMatchingOperation = (operation: string, details: any) => {
  logger.info('Route matching', {
    operation,
    details,
    timestamp: new Date().toISOString()
  });
};

export const logGeocodingOperation = (operation: string, address?: string, coordinates?: [number, number], success?: boolean) => {
  logger.debug('Geocoding operation', {
    operation,
    address,
    coordinates,
    success,
    timestamp: new Date().toISOString()
  });
};