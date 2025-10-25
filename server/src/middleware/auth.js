const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const { AuthenticationError } = require('../utils/errors');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    logger.debug('Authentication attempt', {
      hasAuthHeader: !!authHeader,
      hasToken: !!token,
      correlationId: req.correlationId,
    });

    if (!token) {
      logger.warn('Authentication failed - no token provided', {
        correlationId: req.correlationId,
        ip: req.ip,
      });
      throw new AuthenticationError('No authentication token provided');
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET);

    logger.debug('Token verified successfully', {
      userId: decoded.id,
      email: decoded.email,
      correlationId: req.correlationId,
    });

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    // Handle JWT specific errors
    if (error.name === 'JsonWebTokenError') {
      logger.warn('Authentication failed - invalid token', {
        error: error.message,
        correlationId: req.correlationId,
        ip: req.ip,
      });
      return next(new AuthenticationError('Invalid authentication token'));
    }

    if (error.name === 'TokenExpiredError') {
      logger.warn('Authentication failed - expired token', {
        expiredAt: error.expiredAt,
        correlationId: req.correlationId,
        ip: req.ip,
      });
      return next(new AuthenticationError('Your session has expired. Please login again'));
    }

    // Pass error to error handler
    next(error);
  }
};

module.exports = { authenticateToken };
