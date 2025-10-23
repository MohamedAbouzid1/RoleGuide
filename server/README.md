# RoleGuide Backend Server

Express.js backend (JavaScript/Node.js) for the RoleGuide CV builder application with comprehensive security features.

## Setup

### Prerequisites

- Node.js 20+ and pnpm (or npm)
- PostgreSQL database

### Installation

1. **Install dependencies**

   ```bash
   cd server
   pnpm install
   # or: npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:

   ```
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/lebenslaufpro

   # JWT Secrets (generate with: openssl rand -base64 32)
   ACCESS_TOKEN_SECRET=your-access-token-secret-here
   REFRESH_TOKEN_SECRET=your-refresh-token-secret-here
   JWT_SECRET=your-legacy-jwt-secret-here

   # Token Expiry
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d

   # Server Configuration
   PORT=4000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000

   # Security Configuration
   CSRF_SECRET=your-csrf-secret-here
   SESSION_SECRET=your-session-secret-here

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Setup database**

   ```bash
   # For development (creates initial migration)
   pnpm db:migrate:dev

   # For production (deploy migrations)
   pnpm db:migrate:deploy

   # Legacy command (not recommended for production)
   pnpm db:push
   ```

4. **Start the server**

   ```bash
   # Development mode (with hot reload via nodemon)
   pnpm dev

   # Production mode
   pnpm start
   ```

The server will run on `http://localhost:4000` by default.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user (rate limited: 3/hour)
- `POST /api/auth/login` - Login user (rate limited: 5/15min)
- `POST /api/auth/refresh` - Refresh access token (rate limited: 10/15min)
- `POST /api/auth/logout` - Logout user (revokes refresh token)
- `GET /api/auth/session` - Get current user session (requires auth)
- `POST /api/auth/revoke-all` - Revoke all user tokens (requires auth)

### Security

- `GET /api/csrf-token` - Get CSRF token for forms

### Drafts

All draft endpoints require `Authorization: Bearer <token>` header.

- `GET /api/drafts` - Get all user drafts
- `POST /api/drafts` - Create new draft
- `GET /api/drafts/:id` - Get draft by ID
- `PUT /api/drafts/:id` - Update draft (full)
- `PATCH /api/drafts/:id` - Update draft evaluation scores
- `DELETE /api/drafts/:id` - Delete draft
- `POST /api/drafts/:id/snapshot` - Create snapshot

### PDF Export

- `POST /api/pdf/export` - Export CV as PDF (requires auth)

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js       # Prisma client setup
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── draftsController.js   # Drafts CRUD
│   │   └── pdfController.js      # PDF generation
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── drafts.js             # Draft routes
│   │   └── pdf.js                # PDF routes
│   └── index.js                  # Server entry point
├── prisma/
│   └── schema.prisma             # Database schema
├── package.json
└── .env.example
```

## Security Features

This backend implements comprehensive security measures for production deployment:

### 🔐 JWT Token Management

- **Access Tokens**: Short-lived (15 minutes) for API access
- **Refresh Tokens**: Long-lived (7 days) stored securely in database
- **Token Rotation**: New refresh token issued on each refresh
- **Token Revocation**: Ability to revoke individual or all user tokens
- **Strong Secrets**: Cryptographically secure JWT secrets

### 🛡️ Rate Limiting

- **General**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes per IP
- **Registration**: 3 registration attempts per hour per IP
- **Token Refresh**: 10 refresh attempts per 15 minutes per IP
- **Informative Headers**: Rate limit info included in responses

### 🔒 CSRF Protection

- **Double Submit Cookie Pattern**: Secure CSRF token implementation
- **Automatic Token Generation**: CSRF tokens generated for all requests
- **Form Protection**: All state-changing operations protected
- **API Endpoint**: `/api/csrf-token` for frontend token retrieval

### ✅ Input Validation & Sanitization

- **Zod Schemas**: Type-safe validation for all endpoints
- **Express Validator**: Additional validation chains
- **XSS Prevention**: Input sanitization and escaping
- **Content-Type Validation**: Ensures proper request formats
- **Password Strength**: Enforced strong password requirements

### 🛡️ Security Headers (Helmet.js)

- **Content Security Policy**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Strict-Transport-Security**: Enforces HTTPS in production
- **Referrer-Policy**: Controls referrer information

### 🔐 Additional Security Measures

- **Password Hashing**: bcrypt with salt rounds
- **CORS Configuration**: Restricted to frontend URL
- **Error Handling**: Sanitized error messages (no sensitive data leakage)
- **Database Security**: Refresh tokens stored with expiration and revocation

## Database Management

This backend implements a comprehensive database management system for production deployment:

### 🗄️ Migration System

- **Production-Safe Migrations**: Uses Prisma migrations instead of `db push`
- **Rollback Capability**: Can rollback migrations if needed
- **Migration History**: Tracks all schema changes
- **Zero-Downtime**: Supports zero-downtime migrations where possible

### 🔗 Connection Pooling

- **Optimized Performance**: Configurable connection pool sizes
- **Environment-Specific**: Different settings for dev/staging/production
- **Retry Logic**: Automatic connection retry with exponential backoff
- **Graceful Shutdown**: Proper connection cleanup on application shutdown

### 💾 Backup Strategy

- **Automated Backups**: Daily automated backups with configurable retention
- **Compression & Encryption**: Backups are compressed and optionally encrypted
- **Cloud Storage**: Automatic upload to S3 or other cloud storage
- **Point-in-Time Recovery**: Support for point-in-time recovery
- **Restore Testing**: Regular restore testing to verify backup integrity

### 🛡️ GDPR Compliance (Soft Deletes)

- **Right to be Forgotten**: Users can request account deletion
- **30-Day Grace Period**: Soft-deleted records kept for 30 days
- **Data Export**: Users can export all their data
- **Data Anonymization**: Option to anonymize instead of delete
- **Audit Trail**: Complete audit trail of all deletions

### 📊 Monitoring & Maintenance

- **Performance Monitoring**: Tracks connection and query performance
- **Health Checks**: Automated health checks for database connectivity
- **Slow Query Detection**: Identifies and reports slow queries
- **Connection Pool Monitoring**: Monitors connection pool utilization
- **Automated Cleanup**: Scheduled cleanup of old soft-deleted records

### Available Database Commands

```bash
# Migrations
npm run db:migrate:dev          # Run migrations in development
npm run db:migrate:deploy       # Deploy migrations to production
npm run db:migrate:create       # Create new migration
npm run db:migrate:status       # Check migration status

# Backup & Restore
npm run db:backup               # Create database backup
npm run db:restore              # Restore from backup

# Maintenance
npm run db:cleanup              # Clean up soft-deleted records
npm run db:monitor              # Run database monitoring

# Utilities
npm run db:studio               # Open Prisma Studio
npm run db:seed                 # Run database seeding
```

For detailed database management information, see [DATABASE_MANAGEMENT_GUIDE.md](../DATABASE_MANAGEMENT_GUIDE.md).

## Development Notes

### Authentication

- Uses JWT access/refresh token system instead of NextAuth sessions
- Access tokens stored in localStorage on frontend
- Refresh tokens stored in HTTP-only cookies (recommended)
- Token sent in `Authorization: Bearer <token>` header

### Database

- Shares the same PostgreSQL database with the frontend
- Uses Prisma ORM
- Run migrations from the server directory

### CORS

- Configured to allow requests from `FRONTEND_URL` (default: http://localhost:3000)
- Credentials enabled for cookie support if needed

## Migration from Next.js API Routes

This backend replaces the Next.js API routes with a standalone Express server written in plain JavaScript (not TypeScript). Key differences:

1. **Language**: Plain JavaScript with Node.js (no TypeScript compilation needed)
2. **Authentication**: JWT tokens instead of NextAuth sessions
3. **Separate Process**: Backend runs on port 4000, frontend on 3000
4. **API Client**: Frontend uses `lib/api-client.ts` to communicate with backend
5. **Hot Reload**: Uses nodemon for development hot reloading
