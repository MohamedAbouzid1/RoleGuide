const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const crypto = require('crypto');
const { prisma } = require('../config/database');
const logger = require('../config/logger');
const { ValidationError, AuthenticationError, ConflictError, NotFoundError } = require('../utils/errors');
const { asyncHandler } = require('../middleware/errorHandler');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Helper function to generate secure refresh token
const generateRefreshToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Helper function to generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
};

// Helper function to create refresh token in database
const createRefreshToken = async (userId) => {
  const token = generateRefreshToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days default

  return await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};

// Helper function to revoke all refresh tokens for a user
const revokeAllRefreshTokens = async (userId) => {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
};

const register = asyncHandler(async (req, res) => {
  // Validate input
  const validationResult = registerSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError('Invalid registration data', validationResult.error.errors);
  }

  const { email, password, name } = validationResult.data;

  logger.info('Registration attempt', { email, hasName: !!name });

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    logger.warn('Registration failed - user already exists', { email });
    throw new ConflictError('A user with this email already exists');
  }

  // Hash password and create user
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name },
    select: { id: true, email: true, name: true },
  });

  logger.info('User registered successfully', { userId: user.id, email: user.email });

  // Generate access token and refresh token
  const accessToken = generateAccessToken(user);
  const refreshTokenRecord = await createRefreshToken(user.id);

  logger.debug('Tokens generated for new user', { userId: user.id });

  return res.status(201).json({
    user,
    accessToken,
    refreshToken: refreshTokenRecord.token
  });
});

const login = asyncHandler(async (req, res) => {
  // Validate input
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError('Invalid login data', validationResult.error.errors);
  }

  const { email, password } = validationResult.data;

  logger.info('Login attempt', { email });

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    logger.warn('Login failed - user not found or no password', { email });
    throw new AuthenticationError('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    logger.warn('Login failed - invalid password', { email, userId: user.id });
    throw new AuthenticationError('Invalid email or password');
  }

  logger.info('User logged in successfully', { userId: user.id, email: user.email });

  // Generate access token and refresh token
  const accessToken = generateAccessToken(user);
  const refreshTokenRecord = await createRefreshToken(user.id);

  logger.debug('Tokens generated for user', { userId: user.id });

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    },
    accessToken,
    refreshToken: refreshTokenRecord.token,
  });
});

const getSession = asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  logger.debug('Get session attempt', { hasToken: !!token });

  if (!token) {
    logger.warn('Get session failed - no token provided');
    throw new AuthenticationError('No authentication token provided');
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET);
  logger.debug('Token decoded successfully', { userId: decoded.id, email: decoded.email });

  // Find user
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, name: true, image: true },
  });

  if (!user) {
    logger.warn('Get session failed - user not found', { userId: decoded.id });
    throw new NotFoundError('User not found');
  }

  logger.debug('Session retrieved successfully', { userId: user.id, email: user.email });
  return res.json({ user });
});

// Refresh token endpoint
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    logger.warn('Refresh token attempt without token');
    throw new AuthenticationError('Refresh token required');
  }

  logger.debug('Refresh token attempt');

  // Find the refresh token in database
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
    logger.warn('Refresh token failed - invalid or expired token');
    throw new AuthenticationError('Invalid or expired refresh token');
  }

  logger.info('Token refreshed successfully', { userId: tokenRecord.userId });

  // Generate new access token
  const accessToken = generateAccessToken(tokenRecord.user);

  // Rotate refresh token (generate new one and revoke old)
  const newRefreshTokenRecord = await createRefreshToken(tokenRecord.userId);

  // Revoke the old refresh token
  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { revoked: true },
  });

  return res.json({
    accessToken,
    refreshToken: newRefreshTokenRecord.token,
  });
});

// Logout endpoint
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Revoke the specific refresh token
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
    logger.info('User logged out - token revoked');
  } else {
    logger.info('User logged out - no token provided');
  }

  return res.json({ message: 'Logged out successfully' });
});

// Revoke all tokens endpoint (for security purposes)
const revokeAllTokens = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  logger.info('Revoking all tokens for user', { userId });

  await revokeAllRefreshTokens(userId);

  logger.info('All tokens revoked successfully', { userId });

  return res.json({ message: 'All tokens revoked successfully' });
});

module.exports = { register, login, getSession, refreshToken, logout, revokeAllTokens };
