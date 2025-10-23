#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

// Configuration
const config = {
  databaseUrl: process.env.DATABASE_URL,
  backupDir: process.env.BACKUP_DIR || './backups',
  encryptionEnabled: process.env.BACKUP_ENCRYPTION_ENABLED === 'true',
  encryptionKey: process.env.BACKUP_ENCRYPTION_KEY,
};

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
 * List available backups
 */
function listBackups() {
  if (!fs.existsSync(config.backupDir)) {
    console.log('❌ Backup directory does not exist');
    return [];
  }

  const files = fs.readdirSync(config.backupDir)
    .filter(file => file.endsWith('.sql.gz') || file.endsWith('.sql.gz.enc'))
    .map(file => {
      const filepath = path.join(config.backupDir, file);
      const stats = fs.statSync(filepath);
      return {
        filename: file,
        filepath,
        size: stats.size,
        created: stats.mtime,
      };
    })
    .sort((a, b) => b.created - a.created);

  return files;
}

/**
 * Decrypt backup file
 */
function decryptBackup(encryptedPath) {
  if (!config.encryptionEnabled || !config.encryptionKey) {
    return encryptedPath;
  }

  const decryptedPath = encryptedPath.replace('.enc', '');
  
  console.log(`Decrypting backup...`);
  
  try {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(config.encryptionKey, 'salt', 32);
    const iv = fs.readFileSync(`${encryptedPath}.iv`);
    
    const decipher = crypto.createDecipher(algorithm, key);
    decipher.setAAD(Buffer.from('backup-data'));
    
    const input = fs.createReadStream(encryptedPath);
    const output = fs.createWriteStream(decryptedPath);
    
    input.pipe(decipher).pipe(output);
    
    console.log(`✅ Backup decrypted: ${decryptedPath}`);
    return decryptedPath;
  } catch (error) {
    console.error(`❌ Decryption failed: ${error.message}`);
    throw error;
  }
}

/**
 * Decompress backup file
 */
function decompressBackup(filepath) {
  const decompressedPath = filepath.replace('.gz', '');
  
  console.log(`Decompressing backup...`);
  
  try {
    execSync(`gunzip -c "${filepath}" > "${decompressedPath}"`);
    console.log(`✅ Backup decompressed: ${decompressedPath}`);
    return decompressedPath;
  } catch (error) {
    console.error(`❌ Decompression failed: ${error.message}`);
    throw error;
  }
}

/**
 * Restore database from backup
 */
function restoreDatabase(backupPath) {
  const dbConfig = parseDatabaseUrl(config.databaseUrl);
  
  console.log(`Restoring database from: ${path.basename(backupPath)}`);
  console.log(`⚠️  WARNING: This will replace all data in the database!`);
  
  // Set environment variables for pg_restore
  const env = {
    ...process.env,
    PGPASSWORD: dbConfig.password,
  };

  // Build pg_restore command
  const command = [
    'pg_restore',
    `--host=${dbConfig.host}`,
    `--port=${dbConfig.port}`,
    `--username=${dbConfig.username}`,
    `--dbname=${dbConfig.database}`,
    '--verbose',
    '--no-password',
    '--clean',
    '--if-exists',
    '--create',
    `"${backupPath}"`,
  ].join(' ');

  try {
    execSync(command, { env, stdio: 'inherit' });
    console.log(`✅ Database restored successfully`);
  } catch (error) {
    console.error(`❌ Restore failed: ${error.message}`);
    throw error;
  }
}

/**
 * Verify database connection
 */
function verifyDatabaseConnection() {
  const dbConfig = parseDatabaseUrl(config.databaseUrl);
  
  console.log(`Verifying database connection...`);
  
  const env = {
    ...process.env,
    PGPASSWORD: dbConfig.password,
  };

  const command = [
    'psql',
    `--host=${dbConfig.host}`,
    `--port=${dbConfig.port}`,
    `--username=${dbConfig.username}`,
    `--dbname=${dbConfig.database}`,
    '--command="SELECT version();"',
  ].join(' ');

  try {
    execSync(command, { env, stdio: 'inherit' });
    console.log(`✅ Database connection verified`);
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    throw error;
  }
}

/**
 * Interactive backup selection
 */
function selectBackup() {
  const backups = listBackups();
  
  if (backups.length === 0) {
    console.log('❌ No backups found');
    process.exit(1);
  }

  console.log('\n📋 Available backups:');
  backups.forEach((backup, index) => {
    const sizeMB = (backup.size / (1024 * 1024)).toFixed(2);
    console.log(`${index + 1}. ${backup.filename} (${sizeMB} MB) - ${backup.created.toISOString()}`);
  });

  // For automated scripts, use the latest backup
  if (process.argv.includes('--latest')) {
    return backups[0];
  }

  // For interactive use, prompt user
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('\nSelect backup to restore (number): ', (answer) => {
      const index = parseInt(answer) - 1;
      rl.close();
      
      if (index >= 0 && index < backups.length) {
        resolve(backups[index]);
      } else {
        console.log('❌ Invalid selection');
        process.exit(1);
      }
    });
  });
}

/**
 * Main restore function
 */
async function runRestore() {
  console.log('🚀 Starting database restore...');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  
  try {
    // Verify database connection
    verifyDatabaseConnection();
    
    // Select backup
    const backup = await selectBackup();
    console.log(`\n📁 Selected backup: ${backup.filename}`);
    
    // Confirm restore
    if (!process.argv.includes('--force')) {
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const confirmed = await new Promise((resolve) => {
        rl.question('⚠️  This will replace ALL data in the database. Continue? (yes/no): ', (answer) => {
          rl.close();
          resolve(answer.toLowerCase() === 'yes');
        });
      });

      if (!confirmed) {
        console.log('❌ Restore cancelled');
        process.exit(0);
      }
    }

    let backupPath = backup.filepath;
    
    // Decrypt if needed
    if (backupPath.endsWith('.enc')) {
      backupPath = decryptBackup(backupPath);
    }
    
    // Decompress if needed
    if (backupPath.endsWith('.gz')) {
      backupPath = decompressBackup(backupPath);
    }
    
    // Restore database
    restoreDatabase(backupPath);
    
    console.log('🎉 Database restore completed successfully!');
    
  } catch (error) {
    console.error('💥 Restore process failed:', error.message);
    process.exit(1);
  }
}

// Run restore if called directly
if (require.main === module) {
  runRestore().catch(console.error);
}

module.exports = {
  runRestore,
  listBackups,
  decryptBackup,
  decompressBackup,
  restoreDatabase,
  verifyDatabaseConnection,
};
