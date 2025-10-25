const { doubleCsrf } = require('csrf-csrf');
const logger = require('../config/logger');

// CSRF protection configuration
const csrfProtection = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'fallback-secret-change-in-production',
  cookieName: '__Host-psifi.x-csrf-token', // Use secure cookie name
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  size: 64, // The size of the generated token in bytes
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], // Ignore these HTTP methods
  getTokenFromRequest: (req) => {
    // Try to get token from header first, then from body
    return req.headers['x-csrf-token'] || req.body?._csrf;
  },
});

// Extract the functions from the protection object
const {
  invalidCsrfTokenError,
  generateToken,
  validateRequest,
  doubleCsrfProtection,
} = csrfProtection;

// Middleware to generate CSRF token for GET requests
const generateCsrfToken = (req, res, next) => {
  if (req.method === 'GET') {
    try {
      const token = generateToken(res, req);
      res.locals.csrfToken = token;
    } catch (error) {
      logger.error('CSRF token generation error', { error: error.message });
      // Continue without token for GET requests
    }
  }
  next();
};

// Middleware to validate CSRF token for state-changing requests
const validateCsrfToken = (req, res, next) => {
  try {
    validateRequest(req, res);
    next();
  } catch (error) {
    if (error === invalidCsrfTokenError) {
      return res.status(403).json({
        error: 'Invalid CSRF token',
        message: 'The request could not be verified. Please refresh the page and try again.'
      });
    }
    return res.status(500).json({
      error: 'CSRF validation error',
      message: 'An error occurred during request validation.'
    });
  }
};

// Helper function to get CSRF token (for API responses)
const getCsrfToken = (req, res) => {
  try {
    return generateToken(res, req);
  } catch (error) {
    logger.error('CSRF token generation error', { error: error.message });
    return null;
  }
};

module.exports = {
  doubleCsrfProtection,
  generateCsrfToken,
  validateCsrfToken,
  getCsrfToken,
  invalidCsrfTokenError
};
