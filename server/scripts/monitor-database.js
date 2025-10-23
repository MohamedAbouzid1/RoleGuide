#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Configuration
const config = {
  monitoringEnabled: process.env.DB_MONITORING_ENABLED === 'true',
  alertThresholds: {
    connectionTime: parseInt(process.env.DB_CONNECTION_TIME_THRESHOLD) || 5000, // 5 seconds
    queryTime: parseInt(process.env.DB_QUERY_TIME_THRESHOLD) || 10000, // 10 seconds
    connectionCount: parseInt(process.env.DB_CONNECTION_COUNT_THRESHOLD) || 15, // 15 connections
  },
};

const prisma = new PrismaClient();

/**
 * Monitor database connection performance
 */
async function monitorConnectionPerformance() {
  const startTime = Date.now();
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    const connectionTime = Date.now() - startTime;
    
    console.log(`📊 Connection Performance:`);
    console.log(`  Response time: ${connectionTime}ms`);
    
    if (connectionTime > config.alertThresholds.connectionTime) {
      console.log(`⚠️  Slow connection detected: ${connectionTime}ms`);
    }
    
    return { success: true, responseTime: connectionTime };
  } catch (error) {
    console.error(`❌ Connection test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Monitor database query performance
 */
async function monitorQueryPerformance() {
  const queries = [
    { name: 'User Count', query: prisma.user.count() },
    { name: 'Draft Count', query: prisma.draft.count() },
    { name: 'Refresh Token Count', query: prisma.refreshToken.count() },
  ];
  
  const results = [];
  
  for (const { name, query } of queries) {
    const startTime = Date.now();
    
    try {
      const result = await query;
      const queryTime = Date.now() - startTime;
      
      console.log(`📊 Query Performance - ${name}:`);
      console.log(`  Result: ${result} records`);
      console.log(`  Response time: ${queryTime}ms`);
      
      if (queryTime > config.alertThresholds.queryTime) {
        console.log(`⚠️  Slow query detected: ${queryTime}ms`);
      }
      
      results.push({ name, success: true, result, responseTime: queryTime });
    } catch (error) {
      console.error(`❌ Query failed - ${name}: ${error.message}`);
      results.push({ name, success: false, error: error.message });
    }
  }
  
  return results;
}

/**
 * Monitor database connection pool status
 */
async function monitorConnectionPool() {
  try {
    // Get connection pool statistics
    const poolStats = await prisma.$queryRaw`
      SELECT 
        state,
        COUNT(*) as count
      FROM pg_stat_activity 
      WHERE datname = current_database()
      GROUP BY state
    `;
    
    console.log(`📊 Connection Pool Status:`);
    
    let totalConnections = 0;
    poolStats.forEach(stat => {
      console.log(`  ${stat.state}: ${stat.count} connections`);
      totalConnections += parseInt(stat.count);
    });
    
    console.log(`  Total: ${totalConnections} connections`);
    
    if (totalConnections > config.alertThresholds.connectionCount) {
      console.log(`⚠️  High connection count detected: ${totalConnections}`);
    }
    
    return { success: true, stats: poolStats, totalConnections };
  } catch (error) {
    console.error(`❌ Connection pool monitoring failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Monitor database disk usage
 */
async function monitorDiskUsage() {
  try {
    const diskUsage = await prisma.$queryRaw`
      SELECT 
        pg_size_pretty(pg_database_size(current_database())) as database_size,
        pg_size_pretty(pg_total_relation_size('users')) as users_table_size,
        pg_size_pretty(pg_total_relation_size('drafts')) as drafts_table_size,
        pg_size_pretty(pg_total_relation_size('refresh_tokens')) as refresh_tokens_table_size
    `;
    
    console.log(`📊 Disk Usage:`);
    console.log(`  Database size: ${diskUsage[0].database_size}`);
    console.log(`  Users table: ${diskUsage[0].users_table_size}`);
    console.log(`  Drafts table: ${diskUsage[0].drafts_table_size}`);
    console.log(`  Refresh tokens table: ${diskUsage[0].refresh_tokens_table_size}`);
    
    return { success: true, usage: diskUsage[0] };
  } catch (error) {
    console.error(`❌ Disk usage monitoring failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Monitor slow queries
 */
async function monitorSlowQueries() {
  try {
    const slowQueries = await prisma.$queryRaw`
      SELECT 
        query,
        mean_time,
        calls,
        total_time
      FROM pg_stat_statements 
      WHERE mean_time > 1000  -- Queries taking more than 1 second on average
      ORDER BY mean_time DESC
      LIMIT 10
    `;
    
    if (slowQueries.length > 0) {
      console.log(`📊 Slow Queries (top 10):`);
      slowQueries.forEach((query, index) => {
        console.log(`  ${index + 1}. Mean time: ${query.mean_time}ms, Calls: ${query.calls}`);
        console.log(`     Query: ${query.query.substring(0, 100)}...`);
      });
    } else {
      console.log(`📊 No slow queries detected`);
    }
    
    return { success: true, slowQueries };
  } catch (error) {
    console.error(`❌ Slow query monitoring failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Generate monitoring report
 */
function generateReport(results) {
  const timestamp = new Date().toISOString();
  
  console.log(`\n📋 Database Monitoring Report - ${timestamp}`);
  console.log(`==========================================`);
  
  const summary = {
    connectionPerformance: results.connectionPerformance.success ? '✅' : '❌',
    queryPerformance: results.queryPerformance.filter(r => r.success).length === results.queryPerformance.length ? '✅' : '❌',
    connectionPool: results.connectionPool.success ? '✅' : '❌',
    diskUsage: results.diskUsage.success ? '✅' : '❌',
    slowQueries: results.slowQueries.success ? '✅' : '❌',
  };
  
  console.log(`Connection Performance: ${summary.connectionPerformance}`);
  console.log(`Query Performance: ${summary.queryPerformance}`);
  console.log(`Connection Pool: ${summary.connectionPool}`);
  console.log(`Disk Usage: ${summary.diskUsage}`);
  console.log(`Slow Queries: ${summary.slowQueries}`);
  
  // Check for alerts
  const alerts = [];
  
  if (!results.connectionPerformance.success) {
    alerts.push('Database connection failed');
  }
  
  if (results.connectionPerformance.responseTime > config.alertThresholds.connectionTime) {
    alerts.push(`Slow connection: ${results.connectionPerformance.responseTime}ms`);
  }
  
  if (results.connectionPool.totalConnections > config.alertThresholds.connectionCount) {
    alerts.push(`High connection count: ${results.connectionPool.totalConnections}`);
  }
  
  if (alerts.length > 0) {
    console.log(`\n⚠️  Alerts:`);
    alerts.forEach(alert => console.log(`  - ${alert}`));
  } else {
    console.log(`\n✅ No alerts - Database is healthy`);
  }
}

/**
 * Main monitoring function
 */
async function runMonitoring() {
  if (!config.monitoringEnabled) {
    console.log('⚠️  Database monitoring is disabled (DB_MONITORING_ENABLED=false)');
    return;
  }
  
  console.log('🚀 Starting database monitoring...');
  
  try {
    const results = {
      connectionPerformance: await monitorConnectionPerformance(),
      queryPerformance: await monitorQueryPerformance(),
      connectionPool: await monitorConnectionPool(),
      diskUsage: await monitorDiskUsage(),
      slowQueries: await monitorSlowQueries(),
    };
    
    generateReport(results);
    
    console.log('\n🎉 Database monitoring completed!');
    
  } catch (error) {
    console.error('💥 Database monitoring failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run monitoring if called directly
if (require.main === module) {
  runMonitoring().catch(console.error);
}

module.exports = {
  runMonitoring,
  monitorConnectionPerformance,
  monitorQueryPerformance,
  monitorConnectionPool,
  monitorDiskUsage,
  monitorSlowQueries,
};
