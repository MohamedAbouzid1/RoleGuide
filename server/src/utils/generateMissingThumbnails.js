const { prisma } = require('../config/database');
const { generateContentHash } = require('./hash');
const { generateCVThumbnailHTML } = require('./generateCVThumbnailHTML');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Generate thumbnails for all drafts that don't have one
 */
async function generateMissingThumbnails() {
  try {
    console.log('Finding drafts without thumbnails...');

    // Get all drafts without thumbnailUrl or where we want to force regeneration
    const drafts = await prisma.draft.findMany({
      where: {
        AND: [
          { deletedAt: null }, // Not soft-deleted
          {
            OR: [
              { thumbnailUrl: null },
              { thumbnailUrl: '' }
            ]
          }
        ]
      },
      select: {
        id: true,
        title: true,
        data: true,
      },
    });

    console.log(`Found ${drafts.length} drafts without thumbnails`);

    if (drafts.length === 0) {
      console.log('All drafts already have thumbnails!');
      return;
    }

    // Create thumbnails directory if it doesn't exist
    const thumbnailsDir = path.join(__dirname, '../../public/thumbnails');
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
      console.log('Created thumbnails directory');
    }

    let successCount = 0;
    let errorCount = 0;

    for (const draft of drafts) {
      try {
        console.log(`\nGenerating thumbnail for draft: ${draft.id} - "${draft.title}"`);

        const cvData = draft.data;

        // Validate CV data
        if (!cvData || typeof cvData !== 'object' || !cvData.personal) {
          console.log(`  ⚠ Skipping - invalid CV data`);
          errorCount++;
          continue;
        }

        // Generate content hash
        const contentHash = generateContentHash(cvData);

        // Use draft ID as filename
        const filename = `${draft.id}.png`;
        const thumbnailPath = path.join(thumbnailsDir, filename);

        // Generate HTML template matching the actual CV layout
        const htmlTemplate = generateCVThumbnailHTML(cvData);

        // Launch Puppeteer and generate thumbnail
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

        // Update database
        const thumbnailUrl = `/thumbnails/${filename}`;

        await prisma.draft.update({
          where: { id: draft.id },
          data: {
            thumbnailUrl,
            thumbnailHash: contentHash,
          },
        });

        console.log(`  ✓ Generated thumbnail: ${thumbnailUrl}`);
        successCount++;

      } catch (error) {
        console.error(`  ✗ Error generating thumbnail for ${draft.id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Total drafts processed: ${drafts.length}`);
    console.log(`Successfully generated: ${successCount}`);
    console.log(`Errors: ${errorCount}`);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// If run directly, execute the generation
if (require.main === module) {
  generateMissingThumbnails()
    .then(() => {
      console.log('\nDone!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Generation failed:', error);
      process.exit(1);
    });
}

module.exports = { generateMissingThumbnails };
