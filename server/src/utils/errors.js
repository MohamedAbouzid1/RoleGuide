/**
 * Base AppError class for operational errors
 * All custom errors should extend this class
 */
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * ValidationError - 400 Bad Request
 * Used when client sends invalid data
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 400);
    this.name = 'ValidationError';
    this.details = details;
  }
}

/**
 * AuthenticationError - 401 Unauthorized
 * Used when authentication fails or token is invalid
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * AuthorizationError - 403 Forbidden
 * Used when user is authenticated but not authorized
 */
class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to access this resource') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * NotFoundError - 404 Not Found
 * Used when requested resource doesn't exist
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * ConflictError - 409 Conflict
 * Used when there's a conflict (e.g., duplicate email)
 */
class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * DatabaseError - 500 Internal Server Error
 * Used when database operations fail
 */
class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', originalError = null) {
    super(message, 500, false);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

/**
 * ExternalServiceError - 502 Bad Gateway
 * Used when external service (API) fails
 */
class ExternalServiceError extends AppError {
  constructor(message = 'External service error', service = null) {
    super(message, 502, false);
    this.name = 'ExternalServiceError';
    this.service = service;
  }
}

/**
 * RateLimitError - 429 Too Many Requests
 * Used when rate limit is exceeded
 */
class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  ExternalServiceError,
  RateLimitError,
};
