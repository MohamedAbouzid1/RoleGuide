const { renderToBuffer } = require('@react-pdf/renderer');
const React = require('react');

const exportPDF = async (req, res) => {
  try {
    const cvData = req.body;

    // Import CVTemplate - you'll need to adjust the path or copy it to the server
    // For now, this is a placeholder
    const { CVTemplate } = require('../../components/pdf/CVTemplate');

    // Create PDF buffer
    const pdfBuffer = await renderToBuffer(React.createElement(CVTemplate, { cv: cvData }));

    // Return PDF as response
    const filename = cvData.personal?.fullName || 'Lebenslauf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);

    return res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

module.exports = { exportPDF };
