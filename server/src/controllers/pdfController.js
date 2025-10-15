const { renderToBuffer } = require('@react-pdf/renderer');
const React = require('react');
const { CVTemplate } = require('../pdf/CVTemplate');

const exportPDF = async (req, res) => {
  try {
    const cvData = req.body;

    // Validate that cvData has required structure
    if (!cvData || !cvData.personal) {
      return res.status(400).json({ error: 'Invalid CV data' });
    }

    // Create PDF buffer
    const pdfBuffer = await renderToBuffer(React.createElement(CVTemplate, { cv: cvData }));

    // Return PDF as response
    const filename = `${cvData.personal?.fullName || 'Lebenslauf'}.pdf`;
    const sanitizedFilename = filename.replace(/[^a-z0-9äöüß_\-\.]/gi, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}"`);

    return res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({
      error: 'Failed to generate PDF',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { exportPDF };
