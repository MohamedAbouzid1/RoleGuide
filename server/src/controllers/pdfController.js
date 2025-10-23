const { renderToBuffer } = require('@react-pdf/renderer');
const React = require('react');
const { CVTemplate } = require('../pdf/CVTemplate');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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

const generateThumbnail = async (req, res) => {
  try {
    const cvData = req.body;

    // Validate that cvData has required structure
    if (!cvData || !cvData.personal) {
      return res.status(400).json({ error: 'Invalid CV data' });
    }

    // Create thumbnails directory if it doesn't exist
    const thumbnailsDir = path.join(__dirname, '../../public/thumbnails');
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
    }

    // Generate unique filename
    const filename = `${cvData.personal?.fullName || 'cv'}_${Date.now()}`;
    const sanitizedFilename = filename.replace(/[^a-z0-9äöüß_\-\.]/gi, '_');
    
    // Create HTML template for CV thumbnail
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: Arial, sans-serif; 
                background: white;
                width: 400px;
                height: 300px;
                overflow: hidden;
            }
            .cv-container {
                width: 100%;
                height: 100%;
                background: white;
                border: 1px solid #e5e7eb;
                position: relative;
            }
            .header {
                background: #1e40af;
                color: white;
                padding: 15px;
                text-align: center;
            }
            .name {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .role {
                font-size: 12px;
                opacity: 0.9;
            }
            .content {
                padding: 15px;
                font-size: 10px;
                line-height: 1.4;
            }
            .section {
                margin-bottom: 12px;
            }
            .section-title {
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 5px;
                font-size: 11px;
            }
            .contact-info {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 10px;
                font-size: 9px;
                color: #374151;
            }
            .profile {
                margin-bottom: 10px;
            }
            .profile-text {
                color: #374151;
                font-size: 9px;
                line-height: 1.3;
            }
            .experience-item {
                margin-bottom: 8px;
            }
            .job-title {
                font-weight: bold;
                color: #374151;
                font-size: 10px;
            }
            .company {
                color: #6b7280;
                font-size: 9px;
            }
            .education-item {
                margin-bottom: 6px;
            }
            .degree {
                font-weight: bold;
                color: #374151;
                font-size: 10px;
            }
            .institution {
                color: #6b7280;
                font-size: 9px;
            }
        </style>
    </head>
    <body>
        <div class="cv-container">
            <div class="header">
                <div class="name">${cvData.personal?.fullName || 'Name'}</div>
                ${cvData.personal?.role ? `<div class="role">${cvData.personal.role}</div>` : ''}
            </div>
            <div class="content">
                <div class="contact-info">
                    ${cvData.personal?.email ? `<span>📧 ${cvData.personal.email}</span>` : ''}
                    ${cvData.personal?.phone ? `<span>📞 ${cvData.personal.phone}</span>` : ''}
                    ${cvData.personal?.location ? `<span>📍 ${cvData.personal.location}</span>` : ''}
                </div>
                
                ${cvData.profile?.summary ? `
                <div class="section profile">
                    <div class="section-title">Profile</div>
                    <div class="profile-text">${cvData.profile.summary.substring(0, 150)}${cvData.profile.summary.length > 150 ? '...' : ''}</div>
                </div>
                ` : ''}
                
                ${cvData.experience && cvData.experience.length > 0 ? `
                <div class="section">
                    <div class="section-title">Experience</div>
                    ${cvData.experience.slice(0, 2).map(exp => `
                        <div class="experience-item">
                            <div class="job-title">${exp.title || 'Position'}</div>
                            <div class="company">${exp.company || 'Company'} • ${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${cvData.education && cvData.education.length > 0 ? `
                <div class="section">
                    <div class="section-title">Education</div>
                    ${cvData.education.slice(0, 1).map(edu => `
                        <div class="education-item">
                            <div class="degree">${edu.degree || 'Degree'}</div>
                            <div class="institution">${edu.institution || 'Institution'}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        </div>
    </body>
    </html>
    `;

    // Launch Puppeteer and generate thumbnail
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    
    const thumbnailPath = path.join(thumbnailsDir, `${sanitizedFilename}.png`);
    await page.screenshot({
      path: thumbnailPath,
      width: 400,
      height: 300,
      clip: { x: 0, y: 0, width: 400, height: 300 }
    });
    
    await browser.close();
    
    // Return the thumbnail URL
    const thumbnailUrl = `/thumbnails/${sanitizedFilename}.png`;
    
    return res.json({
      thumbnail: thumbnailUrl,
      name: cvData.personal?.fullName || 'CV Preview'
    });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return res.status(500).json({
      error: 'Failed to generate thumbnail',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { exportPDF, generateThumbnail };
