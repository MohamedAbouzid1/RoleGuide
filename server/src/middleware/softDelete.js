const { PrismaClient } = require('@prisma/client');

/**
 * Soft Delete Middleware for Prisma
 * Automatically filters out soft-deleted records unless explicitly requested
 */
function createSoftDeleteMiddleware() {
  return async (params, next) => {
    // Only apply to models that have soft delete fields
    const softDeleteModels = ['User', 'Draft'];
    
    if (!softDeleteModels.includes(params.model)) {
      return next(params);
    }

    // Handle different operation types
    switch (params.action) {
      case 'findMany':
      case 'findFirst':
      case 'findUnique':
        // Add deletedAt: null filter unless explicitly requesting deleted items
        if (params.args && !params.args.where?.deletedAt) {
          if (!params.args.where) {
            params.args.where = {};
          }
          params.args.where.deletedAt = null;
        }
        break;

      case 'count':
        // Add deletedAt: null filter for count operations
        if (params.args && !params.args.where?.deletedAt) {
          if (!params.args.where) {
            params.args.where = {};
          }
          params.args.where.deletedAt = null;
        }
        break;

      case 'update':
      case 'updateMany':
        // Prevent updating soft-deleted records
        if (params.args && !params.args.where?.deletedAt) {
          if (!params.args.where) {
            params.args.where = {};
          }
          params.args.where.deletedAt = null;
        }
        break;

      case 'delete':
      case 'deleteMany':
        // Convert hard deletes to soft deletes
        return handleSoftDelete(params, next);

      case 'upsert':
        // Handle upsert operations
        if (params.args && !params.args.where?.deletedAt) {
          if (!params.args.where) {
            params.args.where = {};
          }
          params.args.where.deletedAt = null;
        }
        break;
    }

    return next(params);
  };
}

/**
 * Handle soft delete operations
 */
async function handleSoftDelete(params, next) {
  const { model, args } = params;
  
  // Get the current user ID from context (you'll need to pass this)
  const currentUserId = global.currentUserId || 'system';
  
  // Convert delete to update with deletedAt timestamp
  const softDeleteData = {
    deletedAt: new Date(),
    deletedBy: currentUserId,
  };

  // Update the operation to be an update instead of delete
  const updateParams = {
    ...params,
    action: params.action === 'delete' ? 'update' : 'updateMany',
    args: {
      ...args,
      data: softDeleteData,
    },
  };

  return next(updateParams);
}

/**
 * Utility functions for soft delete operations
 */
class SoftDeleteUtils {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Soft delete a record
   */
  async softDelete(model, id, deletedBy = 'system', reason = null) {
    const data = {
      deletedAt: new Date(),
      deletedBy,
    };

    if (reason) {
      data.deletionReason = reason;
    }

    return this.prisma[model.toLowerCase()].update({
      where: { id },
      data,
    });
  }

  /**
   * Restore a soft-deleted record
   */
  async restore(model, id) {
    return this.prisma[model.toLowerCase()].update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        deletionReason: null,
      },
    });
  }

  /**
   * Permanently delete a record (use with caution)
   */
  async hardDelete(model, id) {
    return this.prisma[model.toLowerCase()].delete({
      where: { id },
    });
  }

  /**
   * Find records including soft-deleted ones
   */
  async findWithDeleted(model, args = {}) {
    const where = { ...args.where };
    delete where.deletedAt; // Remove the deletedAt filter

    return this.prisma[model.toLowerCase()].findMany({
      ...args,
      where,
    });
  }

  /**
   * Find only soft-deleted records
   */
  async findOnlyDeleted(model, args = {}) {
    return this.prisma[model.toLowerCase()].findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: { not: null },
      },
    });
  }

  /**
   * Count soft-deleted records
   */
  async countDeleted(model, args = {}) {
    return this.prisma[model.toLowerCase()].count({
      ...args,
      where: {
        ...args.where,
        deletedAt: { not: null },
      },
    });
  }

  /**
   * Export user data for GDPR compliance
   */
  async exportUserData(userId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        drafts: {
          include: {
            snapshots: true,
          },
        },
        refreshTokens: true,
        accounts: true,
        sessions: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Remove sensitive fields
    const exportData = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      drafts: user.drafts.map(draft => ({
        id: draft.id,
        title: draft.title,
        data: draft.data,
        lastEvaluation: draft.lastEvaluation,
        overallScore: draft.overallScore,
        atsScore: draft.atsScore,
        createdAt: draft.createdAt,
        updatedAt: draft.updatedAt,
        snapshots: draft.snapshots.map(snapshot => ({
          id: snapshot.id,
          data: snapshot.data,
          createdAt: snapshot.createdAt,
        })),
      })),
      accounts: user.accounts.map(account => ({
        id: account.id,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        expiresAt: account.expires_at,
        tokenType: account.token_type,
        scope: account.scope,
      })),
    };

    return exportData;
  }

  /**
   * Anonymize user data (replace with anonymized values)
   */
  async anonymizeUser(userId) {
    const anonymizedData = {
      email: `anonymized_${userId}@deleted.local`,
      name: 'Deleted User',
      image: null,
      password: null,
    };

    return this.prisma.user.update({
      where: { id: userId },
      data: anonymizedData,
    });
  }
}

/**
 * Create Prisma client with soft delete middleware
 */
function createPrismaClientWithSoftDelete() {
  const prisma = new PrismaClient();
  
  // Add soft delete middleware
  prisma.$use(createSoftDeleteMiddleware());
  
  // Add soft delete utilities
  prisma.softDelete = new SoftDeleteUtils(prisma);
  
  return prisma;
}

module.exports = {
  createSoftDeleteMiddleware,
  SoftDeleteUtils,
  createPrismaClientWithSoftDelete,
};
