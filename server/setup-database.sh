#!/bin/bash

# Database Setup Script for RoleGuide
# This script helps set up the database management system

set -e

echo "🚀 Setting up RoleGuide Database Management System"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "prisma" ]; then
    print_error "Please run this script from the server directory"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    print_error ".env file not found. Please create it first."
    exit 1
fi

print_status "Environment file found"

# Test database connection
echo "🔍 Testing database connection..."
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    print_status "Database connection successful"
else
    print_error "Database connection failed. Please check your DATABASE_URL"
    exit 1
fi

# Create migrations directory if it doesn't exist
mkdir -p prisma/migrations

# Check if migrations directory is empty
if [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
    print_warning "No migrations found. Creating baseline migration..."
    
    # Create a baseline migration
    BASELINE_DIR="prisma/migrations/$(date +%Y%m%d_%H%M%S)_init"
    mkdir -p "$BASELINE_DIR"
    
    # Create migration.sql file
    cat > "$BASELINE_DIR/migration.sql" << 'EOF'
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('oauth', 'email', 'credentials');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "image" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drafts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Mein Lebenslauf',
    "data" JSONB NOT NULL,
    "lastEvaluation" JSONB,
    "overallScore" INTEGER,
    "atsScore" INTEGER,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshots" (
    "id" TEXT NOT NULL,
    "draftId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "drafts_userId_idx" ON "drafts"("userId");

-- CreateIndex
CREATE INDEX "drafts_deleted_at_idx" ON "drafts"("deleted_at");

-- CreateIndex
CREATE INDEX "snapshots_draftId_idx" ON "snapshots"("draftId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snapshots" ADD CONSTRAINT "snapshots_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "drafts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EOF

    print_status "Baseline migration created: $BASELINE_DIR"
    
    # Create migration_lock.toml
    cat > "prisma/migrations/migration_lock.toml" << 'EOF'
# Please do not edit this file manually
# It should be added in your version-control system (i.e. Git)
provider = "postgresql"
EOF

    print_status "Migration lock file created"
    
    # Deploy the migration
    echo "🚀 Deploying baseline migration..."
    if npx prisma migrate deploy; then
        print_status "Baseline migration deployed successfully"
    else
        print_error "Failed to deploy baseline migration"
        exit 1
    fi
    
else
    print_status "Migrations directory already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
if npx prisma generate; then
    print_status "Prisma client generated successfully"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Test the setup
echo "🧪 Testing database setup..."
if npx prisma db execute --stdin <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" > /dev/null 2>&1; then
    print_status "Database setup test passed"
else
    print_error "Database setup test failed"
    exit 1
fi

# Create backup directory
mkdir -p backups
print_status "Backup directory created"

# Test backup system
echo "💾 Testing backup system..."
if npm run db:backup > /dev/null 2>&1; then
    print_status "Backup system test passed"
else
    print_warning "Backup system test failed (this is normal if pg_dump is not available)"
fi

# Test monitoring system
echo "📊 Testing monitoring system..."
if npm run db:monitor > /dev/null 2>&1; then
    print_status "Monitoring system test passed"
else
    print_warning "Monitoring system test failed (this is normal if pg_stat_statements is not enabled)"
fi

echo ""
echo "🎉 Database Management System Setup Complete!"
echo "=============================================="
echo ""
echo "Available commands:"
echo "  npm run db:migrate:dev     - Run migrations in development"
echo "  npm run db:migrate:deploy  - Deploy migrations to production"
echo "  npm run db:migrate:status  - Check migration status"
echo "  npm run db:backup          - Create database backup"
echo "  npm run db:restore         - Restore from backup"
echo "  npm run db:cleanup         - Clean up soft-deleted records"
echo "  npm run db:monitor         - Run database monitoring"
echo "  npm run db:studio          - Open Prisma Studio"
echo ""
echo "Next steps:"
echo "  1. Review the DATABASE_MANAGEMENT_GUIDE.md for detailed usage"
echo "  2. Set up automated backups with cron jobs"
echo "  3. Configure monitoring alerts"
echo "  4. Test the soft delete functionality"
echo ""
print_status "Setup completed successfully!"
