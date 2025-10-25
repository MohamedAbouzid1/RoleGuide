const { prisma } = require('../config/database');
const logger = require('../config/logger');
const { ValidationError, NotFoundError, AuthorizationError } = require('../utils/errors');
const { asyncHandler } = require('../middleware/errorHandler');
const fs = require('fs');
const path = require('path');

const getDrafts = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  logger.info('Fetching drafts', { userId });

  const drafts = await prisma.draft.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      overallScore: true,
      atsScore: true,
      thumbnailUrl: true,
      thumbnailHash: true,
      data: true, // Include data for thumbnail generation
    },
  });

  logger.debug('Drafts fetched successfully', { userId, count: drafts.length });

  return res.json(drafts);
});

const createDraft = asyncHandler(async (req, res) => {
  const { title, data } = req.body;
  const userId = req.user.id;

  logger.info('Creating draft', { userId, hasData: !!data });

  const draft = await prisma.draft.create({
    data: {
      title: title || 'Mein Lebenslauf',
      data: data || {},
      userId,
    },
  });

  logger.info('Draft created successfully', { userId, draftId: draft.id, title: draft.title });

  return res.status(201).json(draft);
});

const getDraft = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  logger.debug('Fetching draft', { userId, draftId: id });

  const draft = await prisma.draft.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!draft) {
    logger.warn('Draft not found', { userId, draftId: id });
    throw new NotFoundError('Draft not found');
  }

  logger.debug('Draft fetched successfully', { userId, draftId: id });

  return res.json(draft);
});

const updateDraft = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, data } = req.body;
  const userId = req.user.id;

  logger.info('Updating draft', { userId, draftId: id, hasTitle: !!title, hasData: !!data });

  // First verify ownership
  const existingDraft = await prisma.draft.findFirst({
    where: { id, userId },
  });

  if (!existingDraft) {
    logger.warn('Draft not found or unauthorized', { userId, draftId: id });
    throw new NotFoundError('Draft not found');
  }

  const draft = await prisma.draft.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(data !== undefined && { data }),
    },
  });

  logger.info('Draft updated successfully', { userId, draftId: id });

  return res.json(draft);
});

const patchDraft = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { overallScore, atsScore, lastEvaluation } = req.body;
  const userId = req.user.id;

  logger.info('Patching draft evaluation', {
    userId,
    draftId: id,
    hasOverallScore: overallScore !== undefined,
    hasAtsScore: atsScore !== undefined
  });

  // First verify ownership
  const existingDraft = await prisma.draft.findFirst({
    where: { id, userId },
  });

  if (!existingDraft) {
    logger.warn('Draft not found or unauthorized', { userId, draftId: id });
    throw new NotFoundError('Draft not found');
  }

  const draft = await prisma.draft.update({
    where: { id },
    data: {
      ...(overallScore !== undefined && { overallScore }),
      ...(atsScore !== undefined && { atsScore }),
      ...(lastEvaluation !== undefined && { lastEvaluation }),
    },
  });

  logger.info('Draft evaluation updated successfully', {
    userId,
    draftId: id,
    overallScore: draft.overallScore,
    atsScore: draft.atsScore
  });

  return res.json(draft);
});

const deleteDraft = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  logger.info('Deleting draft', { userId, draftId: id });

  // Get draft to find thumbnail before deletion
  const draft = await prisma.draft.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      id: true,
      thumbnailUrl: true,
    },
  });

  if (!draft) {
    logger.warn('Draft not found or unauthorized for deletion', { userId, draftId: id });
    throw new NotFoundError('Draft not found');
  }

  // Delete thumbnail file if exists
  if (draft.thumbnailUrl) {
    const thumbnailPath = path.join(__dirname, '../../public', draft.thumbnailUrl);

    if (fs.existsSync(thumbnailPath)) {
      try {
        fs.unlinkSync(thumbnailPath);
        logger.info('Deleted thumbnail file', { userId, draftId: id, path: thumbnailPath });
      } catch (err) {
        logger.error('Error deleting thumbnail file', {
          userId,
          draftId: id,
          error: err.message,
          path: thumbnailPath
        });
        // Continue with draft deletion even if thumbnail deletion fails
      }
    } else {
      logger.debug('Thumbnail file not found, skipping deletion', {
        userId,
        draftId: id,
        path: thumbnailPath
      });
    }
  }

  // Delete draft from database
  await prisma.draft.delete({
    where: { id },
  });

  logger.info('Draft deleted successfully', { userId, draftId: id });

  return res.status(204).send();
});

const createSnapshot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  const userId = req.user.id;

  logger.info('Creating snapshot', { userId, draftId: id });

  // Verify the draft belongs to the user
  const draft = await prisma.draft.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!draft) {
    logger.warn('Draft not found for snapshot creation', { userId, draftId: id });
    throw new NotFoundError('Draft not found');
  }

  const snapshot = await prisma.snapshot.create({
    data: {
      draftId: id,
      data: data || {},
    },
    select: {
      id: true,
      createdAt: true,
    },
  });

  logger.info('Snapshot created successfully', {
    userId,
    draftId: id,
    snapshotId: snapshot.id
  });

  return res.status(201).json(snapshot);
});

module.exports = {
  getDrafts,
  createDraft,
  getDraft,
  updateDraft,
  patchDraft,
  deleteDraft,
  createSnapshot,
};
