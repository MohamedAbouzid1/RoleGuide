const logger = require('../config/logger');
const { AppError } = require('../utils/errors');

/**
 * Handle Prisma errors and convert them to AppError
 */
const handlePrismaError = (error) => {
  logger.error('Prisma error occurred', {
    code: error.code,
    meta: error.meta,
    message: error.message,
  });

  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const field = error.meta?.target?.[0] || 'field';
      return new AppError(`A record with this ${field} already exists`, 409);

    case 'P2025':
      // Record not found
      return new AppError('The requested resource was not found', 404);

    case 'P2003':
      // Foreign key constraint failed
      return new AppError('Related resource not found', 404);

    case 'P2014':
      // Invalid ID
      return new AppError('Invalid ID provided', 400);

    case 'P2021':
      // Table does not exist
      return new AppError('Database configuration error', 500);

    case 'P2024':
      // Connection timeout
      return new AppError('Database connection timeout', 503);

    default:
      return new AppError('Database operation failed', 500);
  }
};

/**
 * Handle JWT errors
 */
const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return new AppError('Invalid authentication token', 401);
  }
  if (error.name === 'TokenExpiredError') {
    return new AppError('Your session has expired. Please login again', 401);
  }
  return new AppError('Authentication failed', 401);
};

/**
 * Handle validation errors from express-validator
 */
const handleValidationError = (errors) => {
  const messages = errors.map((err) => err.msg).join(', ');
  return new AppError(`Validation failed: ${messages}`, 400);
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, req, res) => {
  logger.error('Error in development', {
    error: err,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
  });

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    details: err.details || undefined,
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    logger.warn('Operational error', {
      message: err.message,
      statusCode: err.statusCode,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
    });

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  } else {
    // Programming or unknown error: don't leak error details
    logger.error('Programming error', {
      error: err,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userId: req.user?.id,
    });

    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle different types of errors
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  // Prisma errors
  if (err.code?.startsWith('P')) {
    error = handlePrismaError(err);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = handleJWTError(err);
  }

  // Mongoose/Validation errors (if using)
  if (err.name === 'ValidationError') {
    error = new AppError('Invalid input data', 400);
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new AppError('File too large', 400);
    } else {
      error = new AppError('File upload failed', 400);
    }
  }

  // Send error response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

/**
 * Handle 404 - Not Found errors
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    404
  );
  next(error);
};

/**
 * Async error handler wrapper
 * Use this to wrap async route handlers to catch errors automatically
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
