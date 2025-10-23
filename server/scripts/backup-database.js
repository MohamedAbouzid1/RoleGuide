#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

// Configuration
const config = {
  backupEnabled: process.env.BACKUP_ENABLED === 'true',
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 7,
  s3Bucket: process.env.BACKUP_S3_BUCKET,
  s3Region: process.env.BACKUP_S3_REGION || 'us-east-1',
  encryptionEnabled: process.env.BACKUP_ENCRYPTION_ENABLED === 'true',
  encryptionKey: process.env.BACKUP_ENCRYPTION_KEY,
  backupDir: process.env.BACKUP_DIR || './backups',
  databaseUrl: process.env.DATABASE_URL,
};

// Ensure backup directory exists
if (!fs.existsSync(config.backupDir)) {
  fs.mkdirSync(config.backupDir, { recursive: true });
}

/**
 * Parse database URL to extract connection details
 */
function parseDatabaseUrl(url) {
  try {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: urlObj.port || 5432,
      database: urlObj.pathname.slice(1),
      username: urlObj.username,
      password: urlObj.password,
    };
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL: ${error.message}`);
  }
}

/**
 * Generate backup filename with timestamp
 */
function generateBackupFilename() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `backup-${timestamp}.sql`;
}

/**
 * Create database backup using pg_dump
 */
function createDatabaseBackup() {
  const dbConfig = parseDatabaseUrl(config.databaseUrl);
  const filename = generateBackupFilename();
  const filepath = path.join(config.backupDir, filename);

  console.log(`Creating backup: ${filename}`);

  // Set environment variables for pg_dump
  const env = {
    ...process.env,
    PGPASSWORD: dbConfig.password,
  };

  // Build pg_dump command
  const command = [
    'pg_dump',
    `--host=${dbConfig.host}`,
    `--port=${dbConfig.port}`,
    `--username=${dbConfig.username}`,
    `--dbname=${dbConfig.database}`,
    '--verbose',
    '--no-password',
    '--format=custom',
    '--compress=9',
    `--file=${filepath}`,
  ].join(' ');

  try {
    execSync(command, { env, stdio: 'inherit' });
    console.log(`✅ Backup created successfully: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error(`❌ Backup failed: ${error.message}`);
    console.log('💡 Tip: Make sure pg_dump is installed and accessible');
    console.log('💡 Tip: Check database credentials and permissions');
    throw error;
  }
}

/**
 * Compress backup file
 */
function compressBackup(filepath) {
  const compressedPath = `${filepath}.gz`;
  
  console.log(`Compressing backup...`);
  
  try {
    execSync(`gzip "${filepath}"`);
    console.log(`✅ Backup compressed: ${compressedPath}`);
    return compressedPath;
  } catch (error) {
    console.error(`❌ Compression failed: ${error.message}`);
    throw error;
  }
}

/**
 * Encrypt backup file
 */
function encryptBackup(filepath) {
  if (!config.encryptionEnabled || !config.encryptionKey) {
    return filepath;
  }

  const encryptedPath = `${filepath}.enc`;
  
  console.log(`Encrypting backup...`);
  
  try {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(config.encryptionKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    cipher.setAAD(Buffer.from('backup-data'));
    
    const input = fs.createReadStream(filepath);
    const output = fs.createWriteStream(encryptedPath);
    
    input.pipe(cipher).pipe(output);
    
    // Store IV for decryption
    fs.writeFileSync(`${encryptedPath}.iv`, iv);
    
    console.log(`✅ Backup encrypted: ${encryptedPath}`);
    return encryptedPath;
  } catch (error) {
    console.error(`❌ Encryption failed: ${error.message}`);
    throw error;
  }
}

/**
 * Upload backup to S3 (if configured)
 */
async function uploadToS3(filepath) {
  if (!config.s3Bucket) {
    console.log('⚠️  S3 upload not configured, skipping...');
    return;
  }

  console.log(`Uploading to S3: s3://${config.s3Bucket}/backups/`);
  
  try {
    const filename = path.basename(filepath);
    const s3Key = `backups/${filename}`;
    
    const command = `aws s3 cp "${filepath}" "s3://${config.s3Bucket}/${s3Key}" --region ${config.s3Region}`;
    execSync(command, { stdio: 'inherit' });
    
    console.log(`✅ Uploaded to S3: s3://${config.s3Bucket}/${s3Key}`);
  } catch (error) {
    console.error(`❌ S3 upload failed: ${error.message}`);
    throw error;
  }
}

/**
 * Clean up old backups
 */
function cleanupOldBackups() {
  console.log(`Cleaning up backups older than ${config.retentionDays} days...`);
  
  try {
    const files = fs.readdirSync(config.backupDir);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - config.retentionDays);
    
    let deletedCount = 0;
    
    files.forEach(file => {
      const filepath = path.join(config.backupDir, file);
      const stats = fs.statSync(filepath);
      
      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filepath);
        console.log(`🗑️  Deleted old backup: ${file}`);
        deletedCount++;
      }
    });
    
    console.log(`✅ Cleaned up ${deletedCount} old backups`);
  } catch (error) {
    console.error(`❌ Cleanup failed: ${error.message}`);
  }
}

/**
 * Send notification (placeholder for monitoring systems)
 */
function sendNotification(success, message) {
  // This is a placeholder - integrate with your monitoring system
  console.log(`📧 Notification: ${success ? 'SUCCESS' : 'FAILURE'} - ${message}`);
  
  // Example integrations:
  // - Slack webhook
  // - Email service
  // - PagerDuty
  // - Custom monitoring system
}

/**
 * Main backup function
 */
async function runBackup() {
  if (!config.backupEnabled) {
    console.log('⚠️  Backup is disabled (BACKUP_ENABLED=false)');
    return;
  }

  console.log('🚀 Starting database backup...');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  
  let backupPath = null;
  
  try {
    // Create backup
    backupPath = createDatabaseBackup();
    
    // Compress backup
    backupPath = compressBackup(backupPath);
    
    // Encrypt backup (if enabled)
    backupPath = encryptBackup(backupPath);
    
    // Upload to S3 (if configured)
    await uploadToS3(backupPath);
    
    // Clean up old backups
    cleanupOldBackups();
    
    // Send success notification
    sendNotification(true, `Backup completed successfully: ${path.basename(backupPath)}`);
    
    console.log('🎉 Backup process completed successfully!');
    
  } catch (error) {
    console.error('💥 Backup process failed:', error.message);
    
    // Send failure notification
    sendNotification(false, `Backup failed: ${error.message}`);
    
    // Clean up failed backup files
    if (backupPath && fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
    
    process.exit(1);
  }
}

// Run backup if called directly
if (require.main === module) {
  runBackup().catch(console.error);
}

module.exports = {
  runBackup,
  createDatabaseBackup,
  compressBackup,
  encryptBackup,
  uploadToS3,
  cleanupOldBackups,
};
