/**
 * Generate HTML template for CV thumbnail
 * This mirrors the actual CVTemplate.js layout for pixel-perfect thumbnails
 */
function generateCVThumbnailHTML(cvData) {
  const personal = cvData.personal || {};
  const profile = cvData.profile || {};
  const experience = cvData.experience || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const languages = cvData.languages || [];
  const interests = cvData.interests || [];
  const projects = cvData.projects || [];
  const internships = cvData.internships || [];

  // Fixed interests fallback
  const displayInterests = interests.length > 0 ? interests : [
    '• Open-Source-Entwicklung',
    '• Backend-Architekturen',
    '• Cloud-native Anwendungen',
    '• Content-creation'
  ];

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Roboto', 'Arial', sans-serif;
                font-size: 5px;
                line-height: 1.4;
                color: #000000;
                background: white;
                width: 400px;
                height: 565px;
                padding: 8px;
                overflow: hidden;
            }

            /* Header */
            .header {
                margin-bottom: 8px;
                padding-bottom: 3px;
            }
            .header-row {
                display: flex;
                justify-content: space-between;
                gap: 8px;
                margin-bottom: 8px;
            }
            .header-left {
                flex: 1;
            }
            .name {
                font-size: 14px;
                font-weight: bold;
                color: #000000;
                margin-bottom: 2px;
            }
            .role {
                font-size: 7px;
                color: #666666;
                font-style: italic;
                margin-bottom: 8px;
            }
            .contact-grid {
                display: flex;
                gap: 16px;
            }
            .contact-column {
                flex: 1;
            }
            .contact-row {
                display: flex;
                gap: 4px;
                align-items: center;
                margin-bottom: 4px;
                font-size: 5px;
            }
            .contact-icon {
                width: 6px;
                height: 6px;
                font-size: 6px;
            }
            .photo {
                width: 45px;
                height: 45px;
                border: 1px solid #000000;
                border-radius: 50%;
                object-fit: cover;
                flex-shrink: 0;
            }

            /* Sections */
            .section {
                margin-bottom: 8px;
            }
            .section-header {
                margin-bottom: 5px;
            }
            .section-title {
                font-size: 7px;
                font-weight: bold;
                color: #000000;
                margin-bottom: 2px;
            }
            .section-line {
                height: 0.75px;
                background-color: #000000;
                width: 100%;
            }

            /* Profile */
            .profile-text {
                font-size: 5px;
                color: #000000;
                line-height: 1.35;
                padding-top: 2px;
            }

            /* Entry (Experience, Education) */
            .entry-container {
                margin-bottom: 6px;
            }
            .entry-grid {
                display: flex;
                gap: 6px;
            }
            .entry-left {
                width: 55px;
                font-size: 5px;
                color: #000000;
                flex-shrink: 0;
            }
            .entry-right {
                flex: 1;
            }
            .entry-title {
                font-size: 5px;
                font-weight: bold;
                color: #000000;
                margin-bottom: 3px;
            }
            .entry-company {
                font-size: 5px;
                color: #000000;
                font-style: italic;
                margin-bottom: 4px;
            }
            .bullet-list {
                margin-top: 2px;
            }
            .bullet {
                font-size: 5px;
                color: #000000;
                margin-bottom: 1px;
                line-height: 1.35;
                padding-left: 5px;
                text-indent: -5px;
            }

            /* Skills & Interests Grid */
            .skill-grid {
                display: flex;
                gap: 12px;
            }
            .skill-column {
                flex: 1;
            }
            .skill-item {
                font-size: 5px;
                color: #000000;
                margin-bottom: 3px;
            }

            /* Empty state */
            .empty-section {
                font-size: 5px;
                color: #666666;
                font-style: italic;
                padding-top: 2px;
            }
        </style>
    </head>
    <body>
        <!-- Header -->
        <div class="header">
            <div class="header-row">
                <div class="header-left">
                    <div class="name">${personal.fullName || 'Ihr Name'}</div>
                    ${personal.role ? `<div class="role">${personal.role}</div>` : ''}

                    <!-- Contact Grid -->
                    <div class="contact-grid">
                        <!-- Left Column -->
                        <div class="contact-column">
                            ${personal.email ? `
                            <div class="contact-row">
                                <span class="contact-icon">📧</span>
                                <span>${personal.email}</span>
                            </div>
                            ` : ''}
                            ${personal.address?.street || personal.address?.city ? `
                            <div class="contact-row">
                                <span class="contact-icon">📍</span>
                                <span>${[personal.address?.street, personal.address?.postalCode].filter(Boolean).join(', ')} ${personal.address?.city || ''}</span>
                            </div>
                            ` : ''}
                            ${personal.linkedinUrl ? `
                            <div class="contact-row">
                                <span class="contact-icon">🔗</span>
                                <span>LinkedIn</span>
                            </div>
                            ` : ''}
                        </div>

                        <!-- Right Column -->
                        <div class="contact-column">
                            ${personal.phone ? `
                            <div class="contact-row">
                                <span class="contact-icon">📞</span>
                                <span>${personal.phone}</span>
                            </div>
                            ` : ''}
                            ${personal.nationality ? `
                            <div class="contact-row">
                                <span class="contact-icon">🌐</span>
                                <span>${personal.nationality}</span>
                            </div>
                            ` : ''}
                            ${personal.githubUrl ? `
                            <div class="contact-row">
                                <span class="contact-icon">💻</span>
                                <span>GitHub</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Profile Photo -->
                ${personal.includePhoto && personal.photoUrl ? `
                <img src="${personal.photoUrl}" class="photo" alt="Profile Photo">
                ` : ''}
            </div>
        </div>

        <!-- Profile Section -->
        ${profile.summary ? `
        <div class="section">
            <div class="section-header">
                <div class="section-title">Profil</div>
                <div class="section-line"></div>
            </div>
            <div class="profile-text">${profile.summary.substring(0, 200)}${profile.summary.length > 200 ? '...' : ''}</div>
        </div>
        ` : ''}

        <!-- Projects Section -->
        ${projects.length > 0 ? `
        <div class="section">
            <div class="section-header">
                <div class="section-title">Softwareprojekte</div>
                <div class="section-line"></div>
            </div>
            ${projects.slice(0, 2).map(project => `
                <div class="entry-container">
                    <div class="entry-grid">
                        <div class="entry-left">${project.date || '2025'}</div>
                        <div class="entry-right">
                            <div class="entry-title">${project.name || ''}</div>
                            ${project.description ? `<div class="entry-company">${project.description}</div>` : ''}
                            ${project.bullets && project.bullets.length > 0 ? `
                            <div class="bullet-list">
                                ${project.bullets.slice(0, 2).map(bullet => `<div class="bullet">• ${bullet}</div>`).join('')}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Experience Section -->
        <div class="section">
            <div class="section-header">
                <div class="section-title">Berufserfahrung</div>
                <div class="section-line"></div>
            </div>
            ${experience.length > 0 ? experience.slice(0, 2).map(exp => `
                <div class="entry-container">
                    <div class="entry-grid">
                        <div class="entry-left">${exp.start || ''} - ${exp.end || 'Heute'}${exp.city ? '<br>' + exp.city : ''}</div>
                        <div class="entry-right">
                            <div class="entry-title">${exp.role || ''}</div>
                            <div class="entry-company">${exp.company || ''}</div>
                            ${exp.bullets && exp.bullets.length > 0 ? `
                            <div class="bullet-list">
                                ${exp.bullets.slice(0, 2).map(bullet => `<div class="bullet">• ${bullet}</div>`).join('')}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('') : '<div class="empty-section">Noch keine Einträge</div>'}
        </div>

        <!-- Education Section -->
        <div class="section">
            <div class="section-header">
                <div class="section-title">Ausbildung</div>
                <div class="section-line"></div>
            </div>
            ${education.length > 0 ? education.slice(0, 2).map(edu => `
                <div class="entry-container">
                    <div class="entry-grid">
                        <div class="entry-left">${edu.graduation || 'Heute'}${edu.city ? '<br>' + edu.city : ''}</div>
                        <div class="entry-right">
                            <div class="entry-title">${edu.degree || ''}</div>
                            <div class="entry-company">${edu.school || ''}</div>
                        </div>
                    </div>
                </div>
            `).join('') : '<div class="empty-section">Noch keine Einträge</div>'}
        </div>

        <!-- Interests Section -->
        <div class="section">
            <div class="section-header">
                <div class="section-title">Interessen</div>
                <div class="section-line"></div>
            </div>
            <div class="skill-grid">
                <div class="skill-column">
                    ${displayInterests.slice(0, 2).map(interest => `
                        <div class="skill-item">${interest}</div>
                    `).join('')}
                </div>
                <div class="skill-column">
                    ${displayInterests.slice(2, 4).map(interest => `
                        <div class="skill-item">${interest}</div>
                    `).join('')}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

module.exports = { generateCVThumbnailHTML };
