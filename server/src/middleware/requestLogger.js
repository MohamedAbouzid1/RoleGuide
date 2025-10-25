const logger = require('../config/logger');
const crypto = require('crypto');

/**
 * Generate a simple unique ID for correlation
 */
const generateCorrelationId = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Generate or use existing correlation ID for request tracking
 */
const correlationIdMiddleware = (req, res, next) => {
  // Get correlation ID from header or generate new one
  const correlationId = req.headers['x-correlation-id'] || generateCorrelationId();

  // Attach to request
  req.correlationId = correlationId;

  // Add to response headers
  res.setHeader('X-Correlation-ID', correlationId);

  next();
};

/**
 * Log HTTP requests
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  logger.http('Incoming request', {
    correlationId: req.correlationId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'http';

    logger[logLevel]('Request completed', {
      correlationId: req.correlationId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
    });
  });

  next();
};

/**
 * Log slow requests (taking more than threshold)
 */
const slowRequestLogger = (threshold = 1000) => {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      if (duration > threshold) {
        logger.warn('Slow request detected', {
          correlationId: req.correlationId,
          method: req.method,
          url: req.originalUrl,
          duration: `${duration}ms`,
          threshold: `${threshold}ms`,
          userId: req.user?.id,
        });
      }
    });

    next();
  };
};

module.exports = {
  correlationIdMiddleware,
  requestLogger,
  slowRequestLogger,
};
