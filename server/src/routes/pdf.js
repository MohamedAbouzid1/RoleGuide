const express = require('express');
const { exportPDF } = require('../controllers/pdfController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/export', authenticateToken, exportPDF);

module.exports = router;
