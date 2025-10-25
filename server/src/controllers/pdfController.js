const { renderToBuffer } = require('@react-pdf/renderer');
const React = require('react');
const { CVTemplate } = require('../pdf/CVTemplate');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');
const { ValidationError, ExternalServiceError } = require('../utils/errors');
const { asyncHandler } = require('../middleware/errorHandler');
const { generateContentHash, sanitizeFilename } = require('../utils/hash');
const { prisma } = require('../config/database');
const { generateCVThumbnailHTML } = require('../utils/generateCVThumbnailHTML');

const exportPDF = asyncHandler(async (req, res) => {
  const cvData = req.body;
  const userId = req.user?.id;

  logger.info('PDF export request', { userId, hasPersonal: !!cvData?.personal });

  // Validate that cvData has required structure
  if (!cvData || !cvData.personal) {
    logger.warn('Invalid CV data for PDF export', { userId, hasData: !!cvData });
    throw new ValidationError('Invalid CV data - personal information is required');
  }

  logger.debug('Generating PDF', { userId, fullName: cvData.personal.fullName });

  try {
    // Create PDF buffer
    const pdfBuffer = await renderToBuffer(React.createElement(CVTemplate, { cv: cvData }));

    // Return PDF as response
    const filename = `${cvData.personal?.fullName || 'Lebenslauf'}.pdf`;
    const sanitizedFilename = filename.replace(/[^a-z0-9äöüß_\-\.]/gi, '_');

    logger.info('PDF generated successfully', {
      userId,
      filename: sanitizedFilename,
      bufferSize: pdfBuffer.length
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}"`);

    return res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    logger.error('PDF generation failed', {
      userId,
      error: error.message,
      stack: error.stack
    });
    throw new ExternalServiceError('Failed to generate PDF', '@react-pdf/renderer');
  }
});

const generateThumbnail = asyncHandler(async (req, res) => {
  const { draftId, cvData } = req.body;
  const userId = req.user?.id;

  logger.info('Thumbnail generation request', { userId, draftId, hasPersonal: !!cvData?.personal });

  // Validate input
  if (!draftId) {
    logger.warn('Missing draftId', { userId });
    throw new ValidationError('draftId is required');
  }

  if (!cvData || !cvData.personal) {
    logger.warn('Invalid CV data for thumbnail generation', { userId, draftId, hasData: !!cvData });
    throw new ValidationError('Invalid CV data - personal information is required');
  }

  // Verify draft ownership
  const draft = await prisma.draft.findFirst({
    where: {
      id: draftId,
      userId: userId,
    },
    select: {
      id: true,
      thumbnailUrl: true,
      thumbnailHash: true,
    },
  });

  if (!draft) {
    logger.warn('Draft not found or access denied', { userId, draftId });
    throw new ValidationError('Draft not found');
  }

  // Generate content hash
  const contentHash = generateContentHash(cvData);
  logger.debug('Generated content hash', { userId, draftId, hash: contentHash });

  // Check if existing thumbnail is still valid
  if (draft.thumbnailUrl && draft.thumbnailHash === contentHash) {
    // Check if file still exists
    const thumbnailPath = path.join(__dirname, '../../public', draft.thumbnailUrl);

    if (fs.existsSync(thumbnailPath)) {
      logger.info('Using cached thumbnail', { userId, draftId, url: draft.thumbnailUrl });
      return res.json({
        thumbnail: draft.thumbnailUrl,
        cached: true,
        message: 'Using existing thumbnail',
      });
    } else {
      logger.warn('Thumbnail file missing, regenerating', { userId, draftId, path: thumbnailPath });
    }
  }

  // Create thumbnails directory if it doesn't exist
  const thumbnailsDir = path.join(__dirname, '../../public/thumbnails');
  if (!fs.existsSync(thumbnailsDir)) {
    logger.debug('Creating thumbnails directory', { path: thumbnailsDir });
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }

  // Use draft ID as filename (consistent, no collisions)
  const filename = `${draftId}.png`;
  const thumbnailPath = path.join(thumbnailsDir, filename);

  // Delete old thumbnail if it exists (before generating new one)
  if (fs.existsSync(thumbnailPath)) {
    logger.debug('Deleting old thumbnail', { userId, draftId, path: thumbnailPath });
    fs.unlinkSync(thumbnailPath);
  }

  logger.debug('Generating new thumbnail', { userId, draftId, filename });

  // Generate HTML template matching the actual CV layout
  const htmlTemplate = generateCVThumbnailHTML(cvData);

  try {
    // Launch Puppeteer and generate thumbnail
    logger.debug('Launching Puppeteer', { userId, draftId });

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlTemplate);

    // A4 aspect ratio (210x297mm) scaled to 400px width = 565px height
    await page.screenshot({
      path: thumbnailPath,
      width: 400,
      height: 565,
      clip: { x: 0, y: 0, width: 400, height: 565 }
    });

    await browser.close();

    logger.info('Thumbnail generated successfully', {
      userId,
      draftId,
      filename,
      path: thumbnailPath
    });

    // Update database with new thumbnail URL and hash
    const thumbnailUrl = `/thumbnails/${filename}`;

    await prisma.draft.update({
      where: { id: draftId },
      data: {
        thumbnailUrl,
        thumbnailHash: contentHash,
      },
    });

    logger.info('Database updated with thumbnail info', { userId, draftId, url: thumbnailUrl });

    return res.json({
      thumbnail: thumbnailUrl,
      cached: false,
      message: 'Thumbnail generated successfully',
    });
  } catch (error) {
    logger.error('Thumbnail generation failed', {
      userId,
      draftId,
      error: error.message,
      stack: error.stack
    });
    throw new ExternalServiceError('Failed to generate thumbnail', 'puppeteer');
  }
});

module.exports = { exportPDF, generateThumbnail };
