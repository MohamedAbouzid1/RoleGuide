const { PrismaClient } = require('@prisma/client');
const { createSoftDeleteMiddleware, SoftDeleteUtils } = require('../middleware/softDelete');

// Connection pool configuration
const getConnectionConfig = () => {
  const baseUrl = process.env.DATABASE_URL;
  
  // Parse existing URL to add connection pool parameters
  try {
    const url = new URL(baseUrl);
    
    // Add connection pool parameters
    const poolParams = new URLSearchParams({
      connection_limit: process.env.DB_POOL_MAX || '20',
      pool_timeout: process.env.DB_POOL_CONNECTION_TIMEOUT || '20',
      connect_timeout: process.env.DB_CONNECT_TIMEOUT || '10',
      statement_timeout: process.env.DB_QUERY_TIMEOUT || '60000',
      idle_in_transaction_session_timeout: process.env.DB_IDLE_TIMEOUT || '600000',
    });
    
    // Combine with existing parameters
    const existingParams = new URLSearchParams(url.search);
    poolParams.forEach((value, key) => {
      existingParams.set(key, value);
    });
    
    url.search = existingParams.toString();
    return url.toString();
  } catch (error) {
    console.warn('Failed to parse DATABASE_URL for connection pooling:', error.message);
    return baseUrl;
  }
};

const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: getConnectionConfig(),
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Add soft delete middleware
prisma.$use(createSoftDeleteMiddleware());

// Add soft delete utilities
prisma.softDelete = new SoftDeleteUtils(prisma);

// Connection management
let connectionAttempts = 0;
const maxConnectionAttempts = 3;

const connectWithRetry = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    connectionAttempts = 0;
  } catch (err) {
    connectionAttempts++;
    console.error(`Database connection error (attempt ${connectionAttempts}/${maxConnectionAttempts}):`, err.message);
    
    if (connectionAttempts < maxConnectionAttempts) {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Max connection attempts reached. Database will connect on first query (Neon auto-wake)');
    }
  }
};

// Handle connection timeout for Neon's sleep/wake behavior
connectWithRetry();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = { prisma };
