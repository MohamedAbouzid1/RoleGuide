const Sentry = require('@sentry/node');
const logger = require('./logger');

// Try to load ProfilingIntegration, but don't fail if it's not available
let ProfilingIntegration;
try {
  ProfilingIntegration = require('@sentry/profiling-node').ProfilingIntegration;
} catch (error) {
  logger.debug('ProfilingIntegration not available', { error: error.message });
}

/**
 * Initialize Sentry for error tracking
 * Call this before any other middleware
 */
const initSentry = (app) => {
  // Only initialize if DSN is provided
  if (!process.env.SENTRY_DSN) {
    logger.info('Sentry DSN not provided, skipping Sentry initialization');
    return { 
      requestHandler: (req, res, next) => next(), 
      tracingHandler: (req, res, next) => next(),
      errorHandler: (err, req, res, next) => next(err) 
    };
  }

  const sentryOptions = {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',

    // Set sample rate for error events (1.0 = 100%)
    sampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0.5,

    // Set sample rate for performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Enable profiling
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    integrations: [
      // HTTP integration for tracing
      new Sentry.Integrations.Http({ tracing: true }),

      // Express integration (only if app is provided)
      ...(app ? [new Sentry.Integrations.Express({ app })] : []),

      // Profiling integration (only if available)
      ...(ProfilingIntegration ? [new ProfilingIntegration()] : []),
    ],

    // Filter out sensitive data
    beforeSend(event, hint) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
        delete event.request.headers['x-api-key'];
      }

      // Remove sensitive data from request body
      if (event.request?.data) {
        const data = typeof event.request.data === 'string'
          ? JSON.parse(event.request.data)
          : event.request.data;

        if (data.password) data.password = '[FILTERED]';
        if (data.token) data.token = '[FILTERED]';
        if (data.refreshToken) data.refreshToken = '[FILTERED]';

        event.request.data = typeof event.request.data === 'string'
          ? JSON.stringify(data)
          : data;
      }

      // Log that error was sent to Sentry
      logger.debug('Error sent to Sentry', {
        eventId: event.event_id,
        level: event.level,
      });

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser errors that don't apply to Node.js
      'Non-Error promise rejection captured',
      // Add more patterns to ignore
      /ECONNREFUSED/,
      /ETIMEDOUT/,
    ],
  };

  // Initialize Sentry
  Sentry.init(sentryOptions);

  logger.info('Sentry initialized', {
    environment: sentryOptions.environment,
    sampleRate: sentryOptions.sampleRate,
  });

  // Return handlers to be used in middleware
  return {
    requestHandler: Sentry.Handlers.requestHandler(),
    tracingHandler: Sentry.Handlers.tracingHandler(),
    errorHandler: Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        // Send all errors with status code >= 500 to Sentry
        // Also send operational errors that are marked as important
        return error.statusCode >= 500 || !error.isOperational;
      },
    }),
  };
};

/**
 * Manually capture exception to Sentry
 */
const captureException = (error, context = {}) => {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.captureException(error, {
    tags: context.tags,
    extra: context.extra,
    user: context.user,
    level: context.level || 'error',
  });
};

/**
 * Manually capture message to Sentry
 */
const captureMessage = (message, level = 'info', context = {}) => {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.captureMessage(message, {
    level,
    tags: context.tags,
    extra: context.extra,
    user: context.user,
  });
};

/**
 * Set user context for Sentry
 */
const setUser = (user) => {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
};

/**
 * Clear user context
 */
const clearUser = () => {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.setUser(null);
};

/**
 * Add breadcrumb for debugging
 */
const addBreadcrumb = (breadcrumb) => {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.addBreadcrumb(breadcrumb);
};

module.exports = {
  initSentry,
  captureException,
  captureMessage,
  setUser,
  clearUser,
  addBreadcrumb,
};
