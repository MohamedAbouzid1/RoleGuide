const fs = require('fs');
const path = require('path');
const { prisma } = require('../config/database');

/**
 * Clean up orphaned thumbnail files that no longer have a corresponding draft
 */
async function cleanupOrphanedThumbnails() {
  try {
    const thumbnailsDir = path.join(__dirname, '../../public/thumbnails');

    if (!fs.existsSync(thumbnailsDir)) {
      console.log('Thumbnails directory does not exist');
      return;
    }

    // Get all thumbnail files
    const files = fs.readdirSync(thumbnailsDir);

    // Get all draft IDs with thumbnails
    const drafts = await prisma.draft.findMany({
      select: { id: true },
    });

    const draftIds = new Set(drafts.map(d => d.id));

    let deletedCount = 0;

    for (const file of files) {
      // Extract draft ID from filename (format: {draftId}.png)
      const draftId = file.replace('.png', '');

      // If draft doesn't exist, delete the thumbnail
      if (!draftIds.has(draftId)) {
        const filePath = path.join(thumbnailsDir, file);
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`Deleted orphaned thumbnail: ${file}`);
      }
    }

    console.log(`Cleanup complete. Deleted ${deletedCount} orphaned thumbnails.`);
  } catch (error) {
    console.error('Error cleaning up thumbnails:', error);
  }
}

/**
 * Clean up old thumbnails for drafts that have been updated
 * This removes thumbnail files that don't match the current thumbnail URL in the database
 */
async function cleanupOutdatedThumbnails() {
  try {
    const thumbnailsDir = path.join(__dirname, '../../public/thumbnails');

    if (!fs.existsSync(thumbnailsDir)) {
      console.log('Thumbnails directory does not exist');
      return;
    }

    // Get all drafts with thumbnail URLs
    const drafts = await prisma.draft.findMany({
      select: {
        id: true,
        thumbnailUrl: true,
      },
    });

    // Create a map of expected thumbnail files
    const expectedFiles = new Set();
    drafts.forEach(draft => {
      if (draft.thumbnailUrl) {
        const filename = path.basename(draft.thumbnailUrl);
        expectedFiles.add(filename);
      }
    });

    // Get all thumbnail files
    const files = fs.readdirSync(thumbnailsDir);

    let deletedCount = 0;

    for (const file of files) {
      // Skip non-PNG files
      if (!file.endsWith('.png')) {
        continue;
      }

      // If file is not expected, delete it
      if (!expectedFiles.has(file)) {
        const filePath = path.join(thumbnailsDir, file);
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`Deleted outdated thumbnail: ${file}`);
      }
    }

    console.log(`Cleanup complete. Deleted ${deletedCount} outdated thumbnails.`);
  } catch (error) {
    console.error('Error cleaning up outdated thumbnails:', error);
  }
}

/**
 * Run all cleanup operations
 */
async function runFullCleanup() {
  console.log('Starting thumbnail cleanup...');
  await cleanupOrphanedThumbnails();
  await cleanupOutdatedThumbnails();
  console.log('Thumbnail cleanup finished.');
}

// If run directly, execute the cleanup
if (require.main === module) {
  runFullCleanup()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = {
  cleanupOrphanedThumbnails,
  cleanupOutdatedThumbnails,
  runFullCleanup,
};
