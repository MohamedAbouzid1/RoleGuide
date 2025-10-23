# Database Management Guide

## Overview

This guide covers the production-ready database management system implemented for the RoleGuide application, including migrations, connection pooling, backup strategies, and GDPR compliance features.

## Table of Contents

1. [Migration System](#migration-system)
2. [Connection Pooling](#connection-pooling)
3. [Backup Strategy](#backup-strategy)
4. [Soft Deletes & GDPR Compliance](#soft-deletes--gdpr-compliance)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Environment Configuration](#environment-configuration)
7. [Troubleshooting](#troubleshooting)

## Migration System

### Overview

The application uses Prisma migrations for schema management instead of `db push` to ensure production safety and rollback capabilities.

### Available Commands

```bash
# Development
npm run db:migrate:dev          # Run migrations in development
npm run db:migrate:create       # Create new migration (create-only)
npm run db:migrate:status       # Check migration status

# Production
npm run db:migrate:deploy       # Deploy migrations to production
npm run db:migrate:resolve      # Resolve migration conflicts

# Utilities
npm run db:studio              # Open Prisma Studio
npm run db:seed                # Run database seeding
```

### Migration Workflow

#### 1. Creating Migrations

```bash
# Create a new migration
npm run db:migrate:create

# This will prompt for a migration name
# Example: "add_user_soft_delete_fields"
```

#### 2. Development Workflow

```bash
# Make schema changes in prisma/schema.prisma
# Run migration in development
npm run db:migrate:dev

# This will:
# - Create migration files
# - Apply changes to development database
# - Generate new Prisma client
```

#### 3. Production Deployment

```bash
# Deploy migrations to production
npm run db:migrate:deploy

# This will:
# - Apply pending migrations
# - NOT generate Prisma client (run separately)
# - Use transactions for safety
```

### Migration Best Practices

1. **Always test migrations on staging first**
2. **Create backups before running migrations**
3. **Use descriptive migration names**
4. **Never use `db push` in production**
5. **Review generated SQL before applying**

### Migration Naming Convention

```
YYYYMMDD_HHMMSS_descriptive_name.sql
```

Examples:

- `20241201_143022_add_user_soft_delete_fields.sql`
- `20241201_143045_create_refresh_tokens_table.sql`
- `20241201_143102_add_draft_indexes.sql`

## Connection Pooling

### Configuration

Connection pooling is configured through environment variables and URL parameters:

```bash
# Environment Variables
DB_POOL_MAX=20                    # Maximum connections
DB_POOL_CONNECTION_TIMEOUT=20     # Connection timeout (seconds)
DB_CONNECT_TIMEOUT=10             # Initial connection timeout (seconds)
DB_QUERY_TIMEOUT=60000            # Query timeout (milliseconds)
DB_IDLE_TIMEOUT=600000            # Idle timeout (milliseconds)
```

### Connection Pool Settings by Environment

#### Development

- **Pool Size**: 5-10 connections
- **Timeout**: 10-30 seconds
- **Purpose**: Development and testing

#### Staging

- **Pool Size**: 10-20 connections
- **Timeout**: 20-60 seconds
- **Purpose**: Pre-production testing

#### Production

- **Pool Size**: Calculated as `(core_count * 2) + effective_spindle_count`
- **Timeout**: 30-60 seconds
- **Purpose**: High availability and performance

### Connection Management Features

1. **Automatic Retry**: Failed connections are retried up to 3 times
2. **Graceful Shutdown**: Connections are properly closed on process termination
3. **Health Monitoring**: Connection health is monitored and reported
4. **Error Handling**: Comprehensive error handling for connection issues

## Backup Strategy

### Automated Backup System

The backup system provides automated daily backups with configurable retention policies.

### Configuration

```bash
# Backup Settings
BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 2 * * *"        # 2 AM daily (cron format)
BACKUP_RETENTION_DAYS=7
BACKUP_DIR=./backups

# S3 Configuration (Optional)
BACKUP_S3_BUCKET=your-backup-bucket
BACKUP_S3_REGION=us-east-1

# Encryption (Optional)
BACKUP_ENCRYPTION_ENABLED=true
BACKUP_ENCRYPTION_KEY=your-encryption-key
```

### Backup Commands

```bash
# Manual backup
npm run db:backup

# Restore from backup
npm run db:restore

# List available backups
npm run db:restore -- --list
```

### Backup Features

1. **Compression**: Backups are compressed using gzip
2. **Encryption**: Optional encryption for sensitive data
3. **S3 Upload**: Automatic upload to cloud storage
4. **Retention Policy**: Automatic cleanup of old backups
5. **Verification**: Backup integrity verification

### Backup Retention Policy

- **Daily Backups**: Keep for 7 days
- **Weekly Backups**: Keep for 4 weeks
- **Monthly Backups**: Keep for 12 months

### Restore Process

1. **List Available Backups**: `npm run db:restore -- --list`
2. **Select Backup**: Choose from available backups
3. **Confirm Restore**: Confirm the restore operation
4. **Verify Data**: Verify restored data integrity

## Soft Deletes & GDPR Compliance

### Overview

The application implements soft deletes to meet GDPR "right to be forgotten" requirements while maintaining data integrity and audit trails.

### Soft Delete Fields

All relevant models include soft delete fields:

```prisma
model User {
  // ... other fields

  // Soft delete fields
  deletedAt     DateTime?     @map("deleted_at")
  deletedBy     String?       @map("deleted_by")

  // Timestamps
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  @@index([deletedAt])
}
```

### Soft Delete Operations

#### Automatic Filtering

The Prisma middleware automatically filters out soft-deleted records:

```javascript
// This will only return non-deleted users
const users = await prisma.user.findMany();

// To include deleted users
const allUsers = await prisma.user.findMany({
  where: {
    deletedAt: { not: null },
  },
});
```

#### Manual Operations

```javascript
// Soft delete a user
await prisma.softDelete.softDelete(
  "User",
  userId,
  currentUserId,
  "User requested deletion"
);

// Restore a user
await prisma.softDelete.restore("User", userId);

// Permanently delete (use with caution)
await prisma.softDelete.hardDelete("User", userId);
```

### GDPR Compliance Features

#### 1. Right to be Forgotten

- Users can request account deletion
- 30-day grace period before permanent deletion
- Scheduled cleanup job removes old soft-deleted records

#### 2. Data Export

```javascript
// Export all user data
const userData = await prisma.softDelete.exportUserData(userId);
```

#### 3. Data Anonymization

```javascript
// Anonymize user data
await prisma.softDelete.anonymizeUser(userId);
```

### Cleanup Commands

```bash
# Clean up soft-deleted records
npm run db:cleanup

# Dry run (see what would be deleted)
npm run db:cleanup -- --dry-run

# Verbose output
npm run db:cleanup -- --verbose
```

### Cleanup Configuration

```bash
# Cleanup Settings
SOFT_DELETE_GRACE_PERIOD_DAYS=30
PERMANENT_DELETE_SCHEDULE="0 3 * * *"  # 3 AM daily
```

## Monitoring & Maintenance

### Database Monitoring

The monitoring system tracks database performance and health metrics.

### Monitoring Commands

```bash
# Run database monitoring
npm run db:monitor
```

### Monitored Metrics

1. **Connection Performance**: Response time and success rate
2. **Query Performance**: Individual query execution times
3. **Connection Pool**: Active and idle connections
4. **Disk Usage**: Database and table sizes
5. **Slow Queries**: Queries exceeding performance thresholds

### Monitoring Configuration

```bash
# Monitoring Settings
DB_MONITORING_ENABLED=true
DB_CONNECTION_TIME_THRESHOLD=5000      # 5 seconds
DB_QUERY_TIME_THRESHOLD=10000          # 10 seconds
DB_CONNECTION_COUNT_THRESHOLD=15       # 15 connections
```

### Alerting

The monitoring system generates alerts for:

- Slow database connections
- High connection counts
- Failed queries
- Performance degradation

## Environment Configuration

### Required Environment Variables

```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public&connection_limit=10&pool_timeout=20"
SHADOW_DATABASE_URL="postgresql://user:password@host:5432/shadow?schema=public"

# Connection Pooling
DB_POOL_MAX=20
DB_POOL_CONNECTION_TIMEOUT=20
DB_CONNECT_TIMEOUT=10
DB_QUERY_TIMEOUT=60000
DB_IDLE_TIMEOUT=600000

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 2 * * *"
BACKUP_RETENTION_DAYS=7
BACKUP_S3_BUCKET=your-backup-bucket
BACKUP_S3_REGION=us-east-1
BACKUP_ENCRYPTION_ENABLED=true
BACKUP_ENCRYPTION_KEY=your-encryption-key

# Soft Delete Configuration
SOFT_DELETE_GRACE_PERIOD_DAYS=30
PERMANENT_DELETE_SCHEDULE="0 3 * * *"

# Monitoring
DB_MONITORING_ENABLED=true
DB_CONNECTION_TIME_THRESHOLD=5000
DB_QUERY_TIME_THRESHOLD=10000
DB_CONNECTION_COUNT_THRESHOLD=15
```

### Environment-Specific Settings

#### Development

```bash
NODE_ENV=development
DB_POOL_MAX=5
BACKUP_ENABLED=false
DB_MONITORING_ENABLED=false
```

#### Staging

```bash
NODE_ENV=staging
DB_POOL_MAX=10
BACKUP_ENABLED=true
BACKUP_RETENTION_DAYS=3
```

#### Production

```bash
NODE_ENV=production
DB_POOL_MAX=20
BACKUP_ENABLED=true
BACKUP_RETENTION_DAYS=7
DB_MONITORING_ENABLED=true
```

## Troubleshooting

### Common Issues

#### 1. Migration Failures

**Problem**: Migration fails to apply
**Solution**:

```bash
# Check migration status
npm run db:migrate:status

# Resolve conflicts
npm run db:migrate:resolve

# Rollback if needed
npm run db:migrate:rollback
```

#### 2. Connection Pool Exhaustion

**Problem**: Too many database connections
**Solution**:

- Check connection pool settings
- Monitor active connections
- Increase pool size if needed
- Review connection usage patterns

#### 3. Backup Failures

**Problem**: Backup process fails
**Solution**:

- Check database connectivity
- Verify backup directory permissions
- Check S3 credentials (if using S3)
- Review backup logs

#### 4. Soft Delete Issues

**Problem**: Soft-deleted records still appearing
**Solution**:

- Verify middleware is properly configured
- Check query filters
- Review soft delete implementation

### Performance Optimization

#### 1. Query Optimization

- Use database indexes effectively
- Monitor slow queries
- Optimize complex queries
- Use connection pooling

#### 2. Connection Management

- Configure appropriate pool sizes
- Monitor connection usage
- Implement connection retry logic
- Use connection timeouts

#### 3. Backup Optimization

- Schedule backups during off-peak hours
- Use compression to reduce storage
- Implement incremental backups
- Monitor backup performance

### Emergency Procedures

#### 1. Database Recovery

1. **Stop Application**: Prevent further data corruption
2. **Assess Damage**: Determine extent of data loss
3. **Restore Backup**: Use most recent backup
4. **Verify Data**: Check data integrity
5. **Restart Application**: Resume normal operations

#### 2. Migration Rollback

1. **Stop Application**: Prevent further issues
2. **Rollback Migration**: Use migration rollback
3. **Verify Schema**: Check database schema
4. **Restart Application**: Resume operations

#### 3. Connection Pool Reset

1. **Restart Application**: Reset connection pool
2. **Monitor Connections**: Check connection health
3. **Adjust Settings**: Modify pool configuration if needed

## Security Considerations

### Database Security

1. **Connection Security**: Use SSL/TLS for database connections
2. **Access Control**: Limit database access by IP whitelist
3. **Credential Management**: Never commit database credentials
4. **Audit Logging**: Log all database operations

### Backup Security

1. **Encryption**: Encrypt backups containing sensitive data
2. **Access Control**: Restrict backup access
3. **Secure Storage**: Use secure cloud storage
4. **Regular Testing**: Test restore procedures regularly

### GDPR Compliance

1. **Data Minimization**: Only collect necessary data
2. **Consent Management**: Track user consent
3. **Data Retention**: Implement data retention policies
4. **Right to be Forgotten**: Provide data deletion capabilities

## Best Practices

### Development

1. **Use Migrations**: Never use `db push` in production
2. **Test Migrations**: Always test on staging first
3. **Backup Before Changes**: Create backups before major changes
4. **Monitor Performance**: Monitor database performance regularly

### Production

1. **Automated Backups**: Set up automated backup schedules
2. **Monitoring**: Implement comprehensive monitoring
3. **Alerting**: Set up alerts for critical issues
4. **Documentation**: Maintain up-to-date documentation

### Maintenance

1. **Regular Cleanup**: Clean up old soft-deleted records
2. **Performance Tuning**: Optimize database performance
3. **Security Updates**: Keep database software updated
4. **Capacity Planning**: Plan for future growth

## Support

For database-related issues:

1. **Check Logs**: Review application and database logs
2. **Monitor Metrics**: Check monitoring dashboards
3. **Run Diagnostics**: Use monitoring scripts
4. **Contact Support**: Escalate critical issues

## Conclusion

This database management system provides a robust, production-ready foundation for the RoleGuide application with comprehensive features for migrations, connection pooling, backups, and GDPR compliance. Regular monitoring and maintenance ensure optimal performance and data protection.
