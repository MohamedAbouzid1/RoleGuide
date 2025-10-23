const express = require('express');
const { register, login, getSession, refreshToken, logout, revokeAllTokens } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter, registerLimiter, refreshLimiter } = require('../middleware/rateLimiting');
const { 
  authSchemas, 
  authValidationChains, 
  validateRequest, 
  validateWithZod, 
  sanitizeInput,
  validateContentType 
} = require('../middleware/validation');

const router = express.Router();

// Apply content type validation and input sanitization to all routes
router.use(validateContentType());
router.use(sanitizeInput);

router.post('/register', 
  registerLimiter, 
  authValidationChains.register, 
  validateRequest,
  validateWithZod(authSchemas.register),
  register
);

router.post('/login', 
  authLimiter, 
  authValidationChains.login, 
  validateRequest,
  validateWithZod(authSchemas.login),
  login
);

router.post('/refresh', 
  refreshLimiter, 
  validateWithZod(authSchemas.refreshToken),
  refreshToken
);

router.post('/logout', 
  validateWithZod(authSchemas.logout),
  logout
);

router.get('/session', getSession);
router.post('/revoke-all', authenticateToken, revokeAllTokens);

module.exports = router;
