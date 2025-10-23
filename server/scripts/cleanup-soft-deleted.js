#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Configuration
const config = {
  gracePeriodDays: parseInt(process.env.SOFT_DELETE_GRACE_PERIOD_DAYS) || 30,
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose'),
};

const prisma = new PrismaClient();

/**
 * Log message with timestamp
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

/**
 * Calculate cutoff date for permanent deletion
 */
function getCutoffDate() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - config.gracePeriodDays);
  return cutoffDate;
}

/**
 * Permanently delete soft-deleted users
 */
async function cleanupSoftDeletedUsers() {
  const cutoffDate = getCutoffDate();
  
  log(`Cleaning up users soft-deleted before: ${cutoffDate.toISOString()}`);
  
  try {
    // Find users eligible for permanent deletion
    const eligibleUsers = await prisma.user.findMany({
      where: {
        deletedAt: {
          not: null,
          lt: cutoffDate,
        },
      },
      select: {
        id: true,
        email: true,
        deletedAt: true,
        deletedBy: true,
      },
    });

    if (eligibleUsers.length === 0) {
      log('No users eligible for permanent deletion');
      return { deleted: 0 };
    }

    log(`Found ${eligibleUsers.length} users eligible for permanent deletion`);

    if (config.dryRun) {
      log('DRY RUN: Would permanently delete the following users:');
      eligibleUsers.forEach(user => {
        log(`  - ${user.email} (deleted: ${user.deletedAt?.toISOString()})`);
      });
      return { deleted: eligibleUsers.length };
    }

    // Permanently delete users
    const result = await prisma.user.deleteMany({
      where: {
        deletedAt: {
          not: null,
          lt: cutoffDate,
        },
      },
    });

    log(`✅ Permanently deleted ${result.count} users`);
    
    if (config.verbose) {
      eligibleUsers.forEach(user => {
        log(`  - Deleted: ${user.email}`);
      });
    }

    return { deleted: result.count };
  } catch (error) {
    log(`Failed to cleanup users: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Permanently delete soft-deleted drafts
 */
async function cleanupSoftDeletedDrafts() {
  const cutoffDate = getCutoffDate();
  
  log(`Cleaning up drafts soft-deleted before: ${cutoffDate.toISOString()}`);
  
  try {
    // Find drafts eligible for permanent deletion
    const eligibleDrafts = await prisma.draft.findMany({
      where: {
        deletedAt: {
          not: null,
          lt: cutoffDate,
        },
      },
      select: {
        id: true,
        title: true,
        deletedAt: true,
        deletedBy: true,
      },
    });

    if (eligibleDrafts.length === 0) {
      log('No drafts eligible for permanent deletion');
      return { deleted: 0 };
    }

    log(`Found ${eligibleDrafts.length} drafts eligible for permanent deletion`);

    if (config.dryRun) {
      log('DRY RUN: Would permanently delete the following drafts:');
      eligibleDrafts.forEach(draft => {
        log(`  - ${draft.title} (deleted: ${draft.deletedAt?.toISOString()})`);
      });
      return { deleted: eligibleDrafts.length };
    }

    // Permanently delete drafts
    const result = await prisma.draft.deleteMany({
      where: {
        deletedAt: {
          not: null,
          lt: cutoffDate,
        },
      },
    });

    log(`✅ Permanently deleted ${result.count} drafts`);
    
    if (config.verbose) {
      eligibleDrafts.forEach(draft => {
        log(`  - Deleted: ${draft.title}`);
      });
    }

    return { deleted: result.count };
  } catch (error) {
    log(`Failed to cleanup drafts: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Cleanup orphaned refresh tokens
 */
async function cleanupOrphanedRefreshTokens() {
  log('Cleaning up orphaned refresh tokens...');
  
  try {
    // Find refresh tokens for deleted users
    const orphanedTokens = await prisma.refreshToken.findMany({
      where: {
        user: {
          deletedAt: {
            not: null,
          },
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (orphanedTokens.length === 0) {
      log('No orphaned refresh tokens found');
      return { deleted: 0 };
    }

    log(`Found ${orphanedTokens.length} orphaned refresh tokens`);

    if (config.dryRun) {
      log('DRY RUN: Would delete orphaned refresh tokens');
      return { deleted: orphanedTokens.length };
    }

    // Delete orphaned refresh tokens
    const result = await prisma.refreshToken.deleteMany({
      where: {
        user: {
          deletedAt: {
            not: null,
          },
        },
      },
    });

    log(`✅ Deleted ${result.count} orphaned refresh tokens`);
    return { deleted: result.count };
  } catch (error) {
    log(`Failed to cleanup orphaned tokens: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Generate cleanup report
 */
function generateReport(results) {
  const totalDeleted = Object.values(results).reduce((sum, result) => sum + result.deleted, 0);
  
  log('\n📊 Cleanup Report:');
  log(`  Users deleted: ${results.users.deleted}`);
  log(`  Drafts deleted: ${results.drafts.deleted}`);
  log(`  Orphaned tokens deleted: ${results.tokens.deleted}`);
  log(`  Total records deleted: ${totalDeleted}`);
  
  if (config.dryRun) {
    log('\n⚠️  This was a DRY RUN - no actual deletions were performed');
  }
}

/**
 * Main cleanup function
 */
async function runCleanup() {
  log('🚀 Starting soft delete cleanup...');
  log(`Grace period: ${config.gracePeriodDays} days`);
  log(`Dry run: ${config.dryRun ? 'YES' : 'NO'}`);
  
  const results = {
    users: { deleted: 0 },
    drafts: { deleted: 0 },
    tokens: { deleted: 0 },
  };
  
  try {
    // Cleanup users
    results.users = await cleanupSoftDeletedUsers();
    
    // Cleanup drafts
    results.drafts = await cleanupSoftDeletedDrafts();
    
    // Cleanup orphaned tokens
    results.tokens = await cleanupOrphanedRefreshTokens();
    
    // Generate report
    generateReport(results);
    
    log('🎉 Cleanup completed successfully!');
    
  } catch (error) {
    log(`💥 Cleanup failed: ${error.message}`, 'error');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run cleanup if called directly
if (require.main === module) {
  runCleanup().catch(console.error);
}

module.exports = {
  runCleanup,
  cleanupSoftDeletedUsers,
  cleanupSoftDeletedDrafts,
  cleanupOrphanedRefreshTokens,
};
