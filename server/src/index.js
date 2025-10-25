const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Import configuration
const logger = require('./config/logger');
const { initSentry } = require('./config/sentry');

// Import routes
const authRoutes = require('./routes/auth');
const draftsRoutes = require('./routes/drafts');
const pdfRoutes = require('./routes/pdf');

// Import middleware
const { prisma } = require('./config/database');
const { generalLimiter } = require('./middleware/rateLimiting');
const { doubleCsrfProtection, generateCsrfToken } = require('./middleware/csrf');
const { correlationIdMiddleware, requestLogger, slowRequestLogger } = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Sentry (must be first)
const sentryHandlers = initSentry(app);

// Sentry request handler (testing tracing handler)
app.use(sentryHandlers.requestHandler);
app.use(sentryHandlers.tracingHandler);

// Correlation ID middleware (for request tracking)
app.use(correlationIdMiddleware);

// Request logging middleware
app.use(requestLogger);

// Slow request detection (log requests taking > 1 second)
app.use(slowRequestLogger(1000));

// Middleware
// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for PDF generation
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CSRF protection (temporarily disabled for development)
// app.use(doubleCsrfProtection);
// app.use(generateCsrfToken);

// Serve static files (thumbnails)
app.use('/thumbnails', express.static(path.join(__dirname, '../public/thumbnails')));

// Health check
app.get('/health', (req, res) => {
  logger.debug('Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// CSRF token endpoint (temporarily disabled)
// app.get('/api/csrf-token', (req, res) => {
//   res.json({ csrfToken: res.locals.csrfToken });
// });

// Database connectivity health check (does NOT expose secrets)
app.get('/health/db', async (req, res) => {
  const dbUrl = process.env.DATABASE_URL || '';
  let dbHost = 'unknown';
  try {
    if (dbUrl) {
      const u = new URL(dbUrl);
      dbHost = u.host;
    }
  } catch (_) {}

  try {
    // Simple connectivity probe
    await prisma.$queryRaw`SELECT 1`;
    logger.debug('Database health check successful');
    return res.json({ status: 'ok', dbHost });
  } catch (err) {
    logger.error('Database health check failed', { error: err.message });
    return res.status(500).json({ status: 'error', dbHost, message: err?.message || 'DB connection failed' });
  }
});

// Development-only endpoints
if (process.env.NODE_ENV === 'development') {
  // Clear rate limit for development testing
  app.post('/api/dev/clear-rate-limit', (req, res) => {
    // This is a simple way to reset rate limits in development
    // In production, you'd need to clear the rate limit store
    res.json({ message: 'Rate limit cleared for development' });
  });

  // Debug validation endpoint
  app.post('/api/dev/test-validation', (req, res) => {
    res.json({
      body: req.body,
      contentType: req.get('Content-Type'),
      headers: req.headers,
      message: 'Validation test endpoint'
    });
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drafts', draftsRoutes);
app.use('/api/pdf', pdfRoutes);

// 404 handler for unknown routes (must be after all routes)
app.use(notFoundHandler);

// Sentry error handler (must be before other error handlers)
app.use(sentryHandlers.errorHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    logger.info('Starting server initialization...');
    
    // Wait for database connection
    logger.info('Connecting to database...');
    await prisma.$connect();
    logger.info('Database connection verified');
    
    logger.info('Starting HTTP server...');
    app.listen(PORT, () => {
      logger.info('Server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

logger.info('About to start server...');
startServer();

module.exports = app;
