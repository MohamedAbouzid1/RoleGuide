const express = require('express');
const { register, login, getSession } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/session', getSession);

module.exports = router;
