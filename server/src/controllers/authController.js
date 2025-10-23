const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const crypto = require('crypto');
const { prisma } = require('../config/database');

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

const register = async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
      select: { id: true, email: true, name: true },
    });

    // Generate access token and refresh token
    const accessToken = generateAccessToken(user);
    const refreshTokenRecord = await createRefreshToken(user.id);

    return res.status(201).json({ 
      user, 
      accessToken,
      refreshToken: refreshTokenRecord.token 
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: err.errors });
    }
    console.error('Registration error:', err);
    return res.status(400).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate access token and refresh token
    const accessToken = generateAccessToken(user);
    const refreshTokenRecord = await createRefreshToken(user.id);

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
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: err.errors });
    }
    console.error('Login error:', err);
    return res.status(401).json({ error: 'Login failed' });
  }
};

const getSession = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('getSession - Authorization header:', authHeader);
    console.log('getSession - Extracted token:', token ? `${token.substring(0, 20)}...` : 'none');

    if (!token) {
      console.log('getSession - No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET);
    console.log('getSession - Token decoded successfully for user:', decoded.email);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, image: true },
    });

    if (!user) {
      console.log('getSession - User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('getSession - User found:', user.email);
    return res.json({ user });
  } catch (error) {
    console.log('getSession - Error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Refresh token endpoint
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Find the refresh token in database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(tokenRecord.user);

    // Optionally rotate refresh token (generate new one and revoke old)
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
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(401).json({ error: 'Token refresh failed' });
  }
};

// Logout endpoint
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Revoke the specific refresh token
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    }

    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Logout failed' });
  }
};

// Revoke all tokens endpoint (for security purposes)
const revokeAllTokens = async (req, res) => {
  try {
    const userId = req.user.id;
    await revokeAllRefreshTokens(userId);

    return res.json({ message: 'All tokens revoked successfully' });
  } catch (error) {
    console.error('Revoke tokens error:', error);
    return res.status(500).json({ error: 'Token revocation failed' });
  }
};

module.exports = { register, login, getSession, refreshToken, logout, revokeAllTokens };
