const express = require('express');
const { exportPDF, generateThumbnail } = require('../controllers/pdfController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/export', authenticateToken, exportPDF);
router.post('/thumbnail', authenticateToken, generateThumbnail);

module.exports = router;
