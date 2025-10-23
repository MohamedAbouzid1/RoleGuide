const rateLimit = require('express-rate-limit');

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || (isDevelopment ? 1000 : 100), // More lenient in development
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
    });
  }
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 50 : 5, // More lenient in development
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: 900
    });
  }
});

// Registration rate limiter (more restrictive)
const registerLimiter = rateLimit({
  windowMs: isDevelopment ? 5 * 60 * 1000 : 60 * 60 * 1000, // 5 minutes in dev, 1 hour in production
  max: isDevelopment ? 20 : 3, // Much more lenient in development
  message: {
    error: 'Too many registration attempts, please try again later.',
    retryAfter: isDevelopment ? 300 : 3600 // 5 minutes in dev, 1 hour in production
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many registration attempts, please try again later.',
      retryAfter: isDevelopment ? 300 : 3600
    });
  }
});

// Refresh token rate limiter
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 100 : 10, // More lenient in development
  message: {
    error: 'Too many token refresh attempts, please try again later.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many token refresh attempts, please try again later.',
      retryAfter: 900
    });
  }
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: isDevelopment ? 5 * 60 * 1000 : 60 * 60 * 1000, // 5 minutes in dev, 1 hour in production
  max: isDevelopment ? 10 : 3, // More lenient in development
  message: {
    error: 'Too many password reset attempts, please try again later.',
    retryAfter: isDevelopment ? 300 : 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many password reset attempts, please try again later.',
      retryAfter: isDevelopment ? 300 : 3600
    });
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  registerLimiter,
  refreshLimiter,
  passwordResetLimiter
};
