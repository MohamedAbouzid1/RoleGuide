# Quick Start Guide - Error Handling & Logging

## ⚡ Get Started in 2 Minutes

### 1. Update Your .env File
Add these lines to `server/.env`:

```env
# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# Sentry (Optional - leave empty for now)
SENTRY_DSN=
SENTRY_ENVIRONMENT=development
```

### 2. Start the Server
```bash
cd server
pnpm dev
```

### 3. Verify It's Working
Open a new terminal and run:
```bash
# Check if logs directory was created
ls -la server/logs/

# Make a test request
curl http://localhost:4000/health

# View the logs
tail server/logs/combined-*.log
```

You should see log entries with timestamps, levels, and messages!

---

## 📖 What Changed?

### All console.log → logger
**Before**:
```javascript
console.log('User logged in');
console.error('Error:', error);
```

**After**:
```javascript
logger.info('User logged in', { userId, email });
logger.error('Error occurred', { error: error.message, userId });
```

### Error Handling
**Before**:
```javascript
try {
  const draft = await getDraft(id);
  res.json(draft);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
```

**After**:
```javascript
const getDraft = asyncHandler(async (req, res) => {
  const draft = await prisma.draft.findUnique({ where: { id } });

  if (!draft) {
    throw new NotFoundError('Draft not found');
  }

  res.json(draft);
});
```

---

## 🔍 Monitoring Your Application

### View All Logs
```bash
tail -f server/logs/combined-*.log
```

### View Only Errors
```bash
tail -f server/logs/error-*.log
```

### Search for Specific User
```bash
grep "userId.*abc123" server/logs/combined-*.log
```

### Filter by Log Level
```bash
grep '"level":"error"' server/logs/combined-*.log
grep '"level":"warn"' server/logs/combined-*.log
```

---

## 🐛 Debugging

### Every request has a Correlation ID
This helps you track a single request through your entire application:

```bash
# Find all logs for a specific request
grep "abc123def456" server/logs/combined-*.log
```

### Logs include context
```json
{
  "timestamp": "2025-10-25 21:48:30",
  "level": "info",
  "message": "User logged in successfully",
  "userId": "user123",
  "email": "user@example.com",
  "correlationId": "abc123def456"
}
```

---

## 🚀 Production Setup

### Before Deploying

1. **Set NODE_ENV=production**
   ```env
   NODE_ENV=production
   ```

2. **Adjust Log Level** (optional)
   ```env
   LOG_LEVEL=warn  # or 'error' for production
   ```

3. **Add Sentry DSN** (optional but recommended)
   - Sign up at https://sentry.io
   - Create a new project
   - Copy the DSN
   ```env
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   SENTRY_ENVIRONMENT=production
   ```

4. **Test Error Responses**
   - In production, errors don't leak sensitive data
   - No stack traces visible to users
   - All errors still logged to files

---

## 📚 Common Tasks

### Add Logging to New Controller
```javascript
// 1. Import at top
const logger = require('../config/logger');
const { asyncHandler } = require('../middleware/errorHandler');
const { NotFoundError, ValidationError } = require('../utils/errors');

// 2. Wrap function with asyncHandler
const myFunction = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // 3. Add logging
  logger.info('Starting operation', { userId });

  // 4. Throw custom errors instead of sending responses
  if (!data) {
    throw new NotFoundError('Data not found');
  }

  // 5. Log success
  logger.info('Operation completed', { userId, result });

  res.json(result);
});
```

### Handle Different Error Types
```javascript
// Validation Error (400)
if (!email) {
  throw new ValidationError('Email is required');
}

// Authentication Error (401)
if (!token) {
  throw new AuthenticationError('No token provided');
}

// Authorization Error (403)
if (resource.userId !== req.user.id) {
  throw new AuthorizationError('You do not own this resource');
}

// Not Found (404)
if (!resource) {
  throw new NotFoundError('Resource not found');
}

// Conflict (409)
if (existingUser) {
  throw new ConflictError('User already exists');
}
```

---

## ❓ FAQ

**Q: Where are logs stored?**
A: In `server/logs/` directory. Files rotate daily and are kept for 14 days.

**Q: How do I disable console logs in production?**
A: They're automatically disabled! When `NODE_ENV=production`, only file logging is active.

**Q: What if I don't want to use Sentry?**
A: That's fine! Leave `SENTRY_DSN` empty. The logger will work perfectly without it.

**Q: How do I see logs in real-time?**
A: Use `tail -f server/logs/combined-*.log`

**Q: Can I change the log retention period?**
A: Yes! Edit `server/src/config/logger.js` and change `maxFiles: '14d'` to your preferred duration.

**Q: What's a correlation ID?**
A: A unique ID for each request. Use it to track all logs related to a single API call.

---

## 📝 Cheat Sheet

### Log Levels
```javascript
logger.error('Critical error', { error });     // Red - Immediate attention
logger.warn('Warning message', { details });   // Yellow - Be aware
logger.info('Important event', { userId });    // Green - Business events
logger.http('Request completed');              // Magenta - Auto-logged
logger.debug('Debug info', { data });          // White - Dev only
```

### Custom Errors
```javascript
ValidationError      // 400 - Bad Request
AuthenticationError  // 401 - Unauthorized
AuthorizationError   // 403 - Forbidden
NotFoundError        // 404 - Not Found
ConflictError        // 409 - Conflict
DatabaseError        // 500 - Internal Server Error
ExternalServiceError // 502 - Bad Gateway
RateLimitError       // 429 - Too Many Requests
```

---

## ✅ You're All Set!

Your application now has:
- ✅ Professional logging system
- ✅ Proper error handling
- ✅ Request tracking
- ✅ Production-ready setup
- ✅ Zero console.logs

**Need more help?** Check `ERROR_HANDLING_IMPLEMENTATION.md` for detailed documentation.

**Everything working?** Check `IMPLEMENTATION_COMPLETE.md` for testing instructions and usage examples.
