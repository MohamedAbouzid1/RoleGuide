# Error Handling and Logging Implementation

## ✅ Completed

### 1. Winston Logging System
- **File**: `server/src/config/logger.js`
- **Features**:
  - Multiple log levels (error, warn, info, http, debug)
  - Daily rotating files with 14-day retention
  - Separate error logs
  - Colored console output for development
  - Correlation ID support
  - User context tracking
  - Exception and rejection handlers

### 2. Custom Error Classes
- **File**: `server/src/utils/errors.js`
- **Classes**:
  - `AppError` - Base class for operational errors
  - `ValidationError` (400) - Invalid client data
  - `AuthenticationError` (401) - Authentication failures
  - `AuthorizationError` (403) - Permission denied
  - `NotFoundError` (404) - Resource not found
  - `ConflictError` (409) - Resource conflicts
  - `DatabaseError` (500) - Database operation failures
  - `ExternalServiceError` (502) - External API failures
  - `RateLimitError` (429) - Rate limit exceeded

### 3. Centralized Error Handling
- **File**: `server/src/middleware/errorHandler.js`
- **Features**:
  - Global error handler for all errors
  - Prisma error translation
  - JWT error handling
  - Different responses for dev vs production
  - 404 handler for unknown routes
  - `asyncHandler` wrapper for async routes

### 4. Request Logging Middleware
- **File**: `server/src/middleware/requestLogger.js`
- **Features**:
  - Correlation ID generation/tracking
  - HTTP request/response logging
  - Slow request detection (>1 second)
  - Duration tracking

### 5. Sentry Integration (Backend)
- **File**: `server/src/config/sentry.js`
- **Features**:
  - Error tracking and monitoring
  - Performance profiling
  - Sensitive data filtering (passwords, tokens)
  - Environment-based sampling
  - Manual exception capture
  - User context tracking
  - Breadcrumb support

### 6. Server Integration
- **File**: `server/src/index.js`
- **Updates**:
  - Integrated Sentry handlers
  - Added correlation ID middleware
  - Added request logging
  - Added slow request detection
  - Replaced console.log with logger
  - Added 404 handler
  - Added centralized error handler

### 7. Auth Controller
- **File**: `server/src/controllers/authController.js`
- **Updates**:
  - Replaced try-catch with `asyncHandler`
  - Added comprehensive logging
  - Throw custom error classes
  - Removed all console.log statements

### 8. Auth Middleware
- **File**: `server/src/middleware/auth.js`
- **Updates**:
  - Added logging
  - Throw custom errors
  - Better JWT error handling
  - Removed console.log statements

## 🚧 Remaining Tasks

### 9. Update Controllers
Need to update remaining controllers with proper error handling:

#### draftsController.js
```javascript
// Add imports
const logger = require('../config/logger');
const { ValidationError, NotFoundError, AuthorizationError } = require('../utils/errors');
const { asyncHandler } = require('../middleware/errorHandler');

// Wrap all functions with asyncHandler
// Add logging for important operations
// Throw custom errors instead of returning error responses
// Remove all console.log statements
```

#### pdfController.js
```javascript
// Add imports
const logger = require('../config/logger');
const { ValidationError, ExternalServiceError } = require('../utils/errors');
const { asyncHandler } = require('../middleware/errorHandler');

// Wrap all functions with asyncHandler
// Add logging for PDF generation
// Handle PDF generation errors properly
// Remove console.log statements
```

### 10. Remove Console.logs from Backend
Search and replace in these locations:
```bash
# Find all console.log in backend
cd server/src
grep -r "console\." . --include="*.js"

# Files to check:
- routes/*.js
- middleware/*.js (csrf.js, rateLimiting.js, softDelete.js, validation.js)
- config/database.js
- Any other utility files
```

### 11. Frontend Sentry Integration
```bash
# Install dependencies
pnpm add @sentry/nextjs

# Create files:
- sentry.client.config.js
- sentry.server.config.js
- sentry.edge.config.js

# Update next.config.mjs with withSentryConfig
```

### 12. Update Frontend API Client
**File**: `lib/api-client.ts`

Add:
- Better error handling
- Error logging (console.error for dev, Sentry for prod)
- Network error handling
- Timeout handling
- Retry logic for certain errors

### 13. Remove Console.logs from Frontend
Search and replace:
```bash
# Find all console.log in frontend
grep -r "console\." components lib app --include="*.ts" --include="*.tsx"

# Replace with:
- Remove unnecessary logs
- Keep console.error for development
- Add Sentry.captureException for errors
```

### 14. Environment Variables

#### Backend (.env)
Add to `server/.env`:
```env
# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# Sentry
SENTRY_DSN=
SENTRY_ENVIRONMENT=development
```

#### Frontend (.env.local)
Add:
```env
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

#### Update .env.example files
Both `server/.env.example` and `.env.example` (root) need the new variables

### 15. Create .sentryclirc (Root)
```
[defaults]
org=your-org
project=lebenslaufpro
```

### 16. Documentation Updates
- Update CLAUDE.md with logging and error tracking info
- Update README.md with:
  - Logging setup
  - Log file locations
  - Sentry setup
  - Environment variables
- Create server/LOGGING.md with:
  - How to use logger
  - Log levels
  - Log file rotation
  - Debugging tips

### 17. Testing Checklist
- [ ] Start server and verify logs are created in `server/logs/`
- [ ] Test different log levels work correctly
- [ ] Trigger errors and verify they're logged properly
- [ ] Verify error responses don't leak info in production mode
- [ ] Test 404 handling
- [ ] Test database errors (invalid ID, duplicate, etc.)
- [ ] Test JWT errors (expired, invalid)
- [ ] Test Sentry captures errors (create test endpoint)
- [ ] Verify no console.logs in production build
- [ ] Test correlation IDs are tracked through requests
- [ ] Test slow request logging

## Usage Examples

### Using Logger in Controllers
```javascript
const logger = require('../config/logger');

// Info level
logger.info('User created CV', { userId, draftId });

// Warning level
logger.warn('Failed validation', { userId, field: 'email' });

// Error level
logger.error('Database error', {
  error: err.message,
  userId,
  operation: 'createDraft'
});

// Debug level (only in development)
logger.debug('Processing data', { dataSize: data.length });
```

### Using Custom Errors
```javascript
const { ValidationError, NotFoundError, AuthorizationError } = require('../utils/errors');

// Validation error
if (!email) {
  throw new ValidationError('Email is required');
}

// Not found
const draft = await prisma.draft.findUnique({ where: { id } });
if (!draft) {
  throw new NotFoundError('Draft not found');
}

// Authorization
if (draft.userId !== req.user.id) {
  throw new AuthorizationError('You do not have permission to access this draft');
}
```

### Using AsyncHandler
```javascript
const { asyncHandler } = require('../middleware/errorHandler');

// Wrap async route handlers
const getDraft = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const draft = await prisma.draft.findUnique({ where: { id } });
  if (!draft) {
    throw new NotFoundError('Draft not found');
  }

  res.json(draft);
});
```

## Log Files

Logs are stored in `server/logs/`:
- `combined-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only
- `exceptions-YYYY-MM-DD.log` - Uncaught exceptions
- `rejections-YYYY-MM-DD.log` - Unhandled promise rejections

Files rotate daily and are kept for 14 days. Max file size is 20MB.

## Environment-Specific Behavior

### Development
- Console logs are visible (colored)
- Detailed error responses with stack traces
- All log levels enabled (debug, http, info, warn, error)
- Sentry sampling reduced

### Production
- No console logs (file only)
- Minimal error responses (no stack traces)
- Log level: info, warn, error only
- Sentry full sampling
- File rotation active

## Next Steps

1. Complete remaining controller updates (drafts, pdf)
2. Remove all console.logs from backend
3. Integrate Sentry on frontend
4. Update frontend API client
5. Remove console.logs from frontend
6. Update environment variable documentation
7. Run comprehensive tests
8. Update CLAUDE.md and README.md

## Dependencies Installed

### Backend
```json
{
  "winston": "^3.18.3",
  "winston-daily-rotate-file": "^5.0.0",
  "@sentry/node": "^10.22.0",
  "@sentry/profiling-node": "^10.22.0"
}
```

### Frontend (to install)
```json
{
  "@sentry/nextjs": "^10.22.0"
}
```
