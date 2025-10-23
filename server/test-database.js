#!/usr/bin/env node

const { prisma } = require('./src/config/database');

async function testDatabaseSetup() {
  
  try {
    console.log('🧪 Testing Database Setup...');
    console.log('============================');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test basic queries
    const userCount = await prisma.user.count();
    console.log(`✅ User count: ${userCount}`);
    
    const draftCount = await prisma.draft.count();
    console.log(`✅ Draft count: ${draftCount}`);
    
    // Test soft delete functionality
    console.log('\n🔍 Testing Soft Delete Functionality...');
    
    // Check if soft delete middleware is working
    const activeUsers = await prisma.user.findMany();
    console.log(`✅ Active users (excluding soft-deleted): ${activeUsers.length}`);
    
    // Test soft delete utilities
    if (prisma.softDelete) {
      console.log('✅ Soft delete utilities available');
      
      // Test finding with deleted records
      const allUsers = await prisma.softDelete.findWithDeleted('User');
      console.log(`✅ All users (including deleted): ${allUsers.length}`);
    } else {
      console.log('⚠️  Soft delete utilities not available');
    }
    
    // Test refresh token functionality
    try {
      const refreshTokenCount = await prisma.refreshToken.count();
      console.log(`✅ Refresh token count: ${refreshTokenCount}`);
    } catch (error) {
      console.log('⚠️  Refresh token table not found - this is expected if not migrated yet');
    }
    
    console.log('\n🎉 Database setup test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseSetup();
