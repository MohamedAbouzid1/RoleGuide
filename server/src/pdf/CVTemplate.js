const React = require('react');
const { Document, Page, Text, View, StyleSheet, Font, Image, Link, Svg, Path } = require('@react-pdf/renderer');

// Register Roboto as a fallback (close to Calibri)
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
      fontWeight: 'normal'
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf',
      fontWeight: 'bold'
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf',
      fontStyle: 'italic',
      fontWeight: 'normal'
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf',
      fontStyle: 'italic',
      fontWeight: 'bold'
    },
  ],
});

// SVG Icon components for PDF
const EmailIcon = () => React.createElement(Svg, { width: "12", height: "12", viewBox: "0 0 24 24" },
  React.createElement(Path, { d: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z", fill: "#000000" })
);

const LocationIcon = () => React.createElement(Svg, { width: "12", height: "12", viewBox: "0 0 24 24" },
  React.createElement(Path, { d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z", fill: "#000000" })
);

const PhoneIcon = () => React.createElement(Svg, { width: "12", height: "12", viewBox: "0 0 24 24" },
  React.createElement(Path, { d: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z", fill: "#000000" })
);

const LanguageIcon = () => React.createElement(Svg, { width: "12", height: "12", viewBox: "0 0 24 24" },
  React.createElement(Path, { d: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.92 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z", fill: "#000000" })
);

const LinkedInIcon = () => React.createElement(Svg, { width: "12", height: "12", viewBox: "0 0 24 24" },
  React.createElement(Path, { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", fill: "#000000" })
);

const GitHubIcon = () => React.createElement(Svg, { width: "12", height: "12", viewBox: "0 0 24 24" },
  React.createElement(Path, { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z", fill: "#000000" })
);

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 11.5,
    padding: '16mm',
    lineHeight: 1.4,
  },
  // Header
  header: {
    marginBottom: 16,
    paddingBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  headerLeft: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  role: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  contactGrid: {
    flexDirection: 'row',
    gap: 40,
  },
  contactColumn: {
    flex: 1,
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
  },
  contactValue: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 1.4,
  },
  linkText: {
    color: '#000000',
    textDecoration: 'underline',
  },
  photo: {
    width: 100,
    height: 100,
    border: '1px solid #000000',
    borderRadius: 50,
    objectFit: 'cover',
  },
  // Sections
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  sectionLine: {
    height: 1.5,
    backgroundColor: '#000000',
    width: '100%',
  },
  // Profile section
  profileText: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 1.35,
    paddingTop: 4,
  },
  // Experience & Education - 2 column grid
  entryContainer: {
    marginBottom: 14,
  },
  entryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  entryLeft: {
    width: 120,
    fontSize: 12,
    color: '#000000',
  },
  entryRight: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  entryCompany: {
    fontSize: 12,
    color: '#000000',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  entrySubtext: {
    fontSize: 12,
    color: '#000000',
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 0,
  },
  bullet: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 3,
    lineHeight: 1.35,
    textIndent: -10,
    paddingLeft: 10,
  },
  // Skills
  skillCategory: {
    marginBottom: 16,
  },
  skillCategoryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  skillGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  skillColumn: {
    flex: 1,
  },
  skillItem: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 6,
  },
  // Languages
  languagesGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  languageItem: {
    flex: 1,
    fontSize: 12,
    color: '#000000',
  },
  languageName: {
    fontWeight: 'bold',
  },
  // Closing/Signature
  closingSection: {
    marginTop: 32,
  },
  closingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureArea: {},
  signatureImage: {
    width: 120,
    height: 50,
  },
  signatureName: {
    marginTop: 8,
    fontSize: 12,
    color: '#000000',
  },
  datePlaceText: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'right',
  },
});

function CVTemplate({ cv }) {
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },

      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          { style: styles.headerRow },
          React.createElement(
            View,
            { style: styles.headerLeft },
            // Name and role in column layout
            React.createElement(
              View,
              { style: styles.nameRow },
              React.createElement(Text, { style: styles.name }, cv.personal?.fullName || 'Ihr Name'),
              cv.personal?.role && React.createElement(Text, { style: styles.role }, cv.personal.role)
            ),
            // Contact info in two columns
            React.createElement(
              View,
              { style: styles.contactGrid },
              // Left column
              React.createElement(
                View,
                { style: styles.contactColumn },
                cv.personal?.email && React.createElement(
                  View,
                  { style: styles.contactRow },
                  React.createElement(EmailIcon),
                  React.createElement(Text, { style: styles.contactValue }, cv.personal.email)
                ),
                (cv.personal?.address?.street || cv.personal?.address?.city) && React.createElement(
                  View,
                  { style: styles.contactRow },
                  React.createElement(LocationIcon),
                  React.createElement(
                    Text,
                    { style: styles.contactValue },
                    [
                      [cv.personal.address?.street, cv.personal.address?.postalCode].filter(Boolean).join(', '),
                      cv.personal.address?.city
                    ].filter(Boolean).join(' ')
                  )
                ),
                cv.personal?.linkedinUrl && React.createElement(
                  View,
                  { style: styles.contactRow },
                  React.createElement(LinkedInIcon),
                  React.createElement(Link, { src: cv.personal.linkedinUrl, style: styles.contactValue }, 'LinkedIn')
                )
              ),
              // Right column
              React.createElement(
                View,
                { style: styles.contactColumn },
                cv.personal?.phone && React.createElement(
                  View,
                  { style: styles.contactRow },
                  React.createElement(PhoneIcon),
                  React.createElement(Text, { style: styles.contactValue }, cv.personal.phone)
                ),
                cv.personal?.nationality && React.createElement(
                  View,
                  { style: styles.contactRow },
                  React.createElement(LanguageIcon),
                  React.createElement(Text, { style: styles.contactValue }, cv.personal.nationality)
                ),
                cv.personal?.githubUrl && React.createElement(
                  View,
                  { style: styles.contactRow },
                  React.createElement(GitHubIcon),
                  React.createElement(Link, { src: cv.personal.githubUrl, style: styles.contactValue }, 'GitHub')
                )
              )
            )
          ),
          cv.personal?.includePhoto && cv.personal?.photoUrl && React.createElement(
            Image,
            { src: cv.personal.photoUrl, style: styles.photo }
          )
        )
      ),

      // Profile/Profil
      cv.profile?.summary && React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.sectionHeader },
          React.createElement(Text, { style: styles.sectionTitle }, 'Profil'),
          React.createElement(View, { style: styles.sectionLine })
        ),
        React.createElement(
          Text,
          { style: styles.profileText },
          cv.profile.summary
        )
      ),

      // Software Projects
      cv.projects && cv.projects.length > 0 && React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.sectionHeader },
          React.createElement(Text, { style: styles.sectionTitle }, 'Softwareprojekte'),
          React.createElement(View, { style: styles.sectionLine })
        ),
        ...cv.projects.map((project, i) =>
          React.createElement(
            View,
            { key: i, style: styles.entryContainer },
            React.createElement(Text, { style: styles.entryLeft }, project.date || '2025'),
            React.createElement(
              View,
              { style: styles.entryRight },
              React.createElement(Text, { style: styles.entryTitle }, project.name || ''),
              React.createElement(Text, { style: styles.entryCompany }, project.description || ''),
              project.bullets && project.bullets.length > 0 && React.createElement(
                View,
                { style: styles.bulletList },
                ...project.bullets.map((bullet, j) =>
                  React.createElement(
                    Text,
                    { key: j, style: styles.bullet },
                    `• ${bullet}`
                  )
                )
              )
            )
          )
        )
      ),

      // Experience/Berufserfahrung
      cv.experience && cv.experience.length > 0 && React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.sectionHeader },
          React.createElement(Text, { style: styles.sectionTitle }, 'Berufserfahrung'),
          React.createElement(View, { style: styles.sectionLine })
        ),
        ...cv.experience.map((exp, i) =>
          React.createElement(
            View,
            { key: i, style: styles.entryContainer },
            React.createElement(
              View,
              { style: styles.entryGrid },
              React.createElement(
                Text,
                { style: styles.entryLeft },
                `${exp.start || ''} - ${exp.end || '10.2025'}${exp.city ? `\n${exp.city}` : ''}`
              ),
              React.createElement(
                View,
                { style: styles.entryRight },
                React.createElement(Text, { style: styles.entryTitle }, exp.role || ''),
                React.createElement(Text, { style: styles.entryCompany }, exp.company || ''),
                exp.bullets && exp.bullets.length > 0 && React.createElement(
                  View,
                  { style: styles.bulletList },
                  ...exp.bullets.map((bullet, j) =>
                    React.createElement(
                      Text,
                      { key: j, style: styles.bullet },
                      `• ${bullet}`
                    )
                  )
                )
              )
            )
          )
        )
      ),

      // Education/Ausbildung
      cv.education && cv.education.length > 0 && React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.sectionHeader },
          React.createElement(Text, { style: styles.sectionTitle }, 'Ausbildung'),
          React.createElement(View, { style: styles.sectionLine })
        ),
        ...cv.education.map((edu, i) =>
          React.createElement(
            View,
            { key: i, style: styles.entryContainer },
            React.createElement(
              View,
              { style: styles.entryGrid },
              React.createElement(
                Text,
                { style: styles.entryLeft },
                `${edu.graduation || '10.2023 - 10.2025'}${edu.city ? `\n${edu.city}` : ''}`
              ),
              React.createElement(
                View,
                { style: styles.entryRight },
                React.createElement(Text, { style: styles.entryTitle }, edu.degree || ''),
                React.createElement(Text, { style: styles.entryCompany }, edu.school || ''),
                edu.notes && edu.notes.length > 0 && React.createElement(
                  View,
                  { style: styles.entrySubtext },
                  ...edu.notes.map((note, j) =>
                    React.createElement(Text, { key: j }, note)
                  )
                )
              )
            )
          )
        )
      ),

      // Skills/Technische Kenntnisse
      cv.skills && cv.skills.length > 0 && React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.sectionHeader },
          React.createElement(Text, { style: styles.sectionTitle }, 'Technische Kenntnisse'),
          React.createElement(View, { style: styles.sectionLine })
        ),
        React.createElement(
          View,
          { style: styles.skillGrid },
          ...cv.skills.map((cat, i) =>
            React.createElement(
              View,
              { key: i, style: styles.skillColumn },
              React.createElement(
                Text,
                { style: styles.skillCategoryTitle },
                cat.category || 'Kategorie'
              ),
              ...cat.items.map((item, j) =>
                React.createElement(
                  Text,
                  { key: j, style: styles.skillItem },
                  `${item.name || ''}${item.level >= 80 ? ' (fortgeschritten)' : 
                    item.level >= 60 ? ' (Grundkenntnisse)' : 
                    item.level >= 40 ? ' (Grundlagen)' : ''}`
                )
              )
            )
          )
        )
      ),

      // Internships/Praktika
      cv.internships && cv.internships.length > 0 && React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.sectionHeader },
          React.createElement(Text, { style: styles.sectionTitle }, 'Praktika'),
          React.createElement(View, { style: styles.sectionLine })
        ),
        ...cv.internships.map((internship, i) =>
          React.createElement(
            View,
            { style: styles.entryContainer },
            React.createElement(
              View,
              { style: styles.entryGrid },
              React.createElement(
                Text,
                { style: styles.entryLeft },
                `${internship.start} - ${internship.end || 'Heute'}${internship.city ? `\n${internship.city}` : ''}`
              ),
              React.createElement(
                View,
                { style: styles.entryRight },
                React.createElement(Text, { style: styles.entryTitle }, internship.role),
                React.createElement(Text, { style: styles.entryCompany }, internship.company),
                internship.bullets.length > 0 && React.createElement(
                  View,
                  { style: styles.bulletList },
                  ...internship.bullets.map((bullet, j) =>
                    React.createElement(Text, { key: j, style: styles.bullet }, `• ${bullet}`)
                  )
                )
              )
            )
          )
        )
      ),

      // Languages/Sprachen
      cv.languages && cv.languages.length > 0 && React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.sectionHeader },
          React.createElement(Text, { style: styles.sectionTitle }, 'Sprachen'),
          React.createElement(View, { style: styles.sectionLine })
        ),
        React.createElement(
          View,
          { style: styles.languagesGrid },
          ...cv.languages.map((lang, i) =>
            React.createElement(
              View,
              { key: i, style: styles.languageItem },
              React.createElement(Text, { style: styles.languageName }, lang.name || ''),
              React.createElement(
                Text,
                {},
                lang.level === 'C2' ? 'Verhandlungssicher' :
                lang.level === 'C1' ? 'Verhandlungssicher' :
                lang.level === 'B2' ? 'Verhandlungssicher' :
                lang.level === 'A1' ? 'Muttersprache' :
                lang.level || ''
              )
            )
          )
        )
      ),

      // Interests/Interessen
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.sectionHeader },
          React.createElement(Text, { style: styles.sectionTitle }, 'Interessen'),
          React.createElement(View, { style: styles.sectionLine })
        ),
        React.createElement(
          View,
          { style: styles.skillGrid },
          React.createElement(
            View,
            { style: styles.skillColumn },
            React.createElement(Text, { style: styles.skillItem }, '• Open-Source-Entwicklung'),
            React.createElement(Text, { style: styles.skillItem }, '• Backend-Architekturen')
          ),
          React.createElement(
            View,
            { style: styles.skillColumn },
            React.createElement(Text, { style: styles.skillItem }, '• Cloud-native Anwendungen'),
            React.createElement(Text, { style: styles.skillItem }, '• Content-creation')
          )
        )
      ),

      // Closing/Signature
      (cv.personal?.signatureUrl || cv.closing?.place || cv.closing?.date) && React.createElement(
        View,
        { style: styles.closingSection },
        React.createElement(
          View,
          { style: styles.closingGrid },
          React.createElement(
            View,
            { style: styles.signatureArea },
            cv.personal?.signatureUrl && React.createElement(
              Image,
              { src: cv.personal.signatureUrl, style: styles.signatureImage }
            ),
            React.createElement(
              Text,
              { style: styles.signatureName },
              cv.personal?.fullName || ''
            )
          ),
          React.createElement(
            Text,
            { style: styles.datePlaceText },
            [cv.closing?.place, cv.closing?.date].filter(Boolean).join(', ') || ''
          )
        )
      )
    )
  );
}

module.exports = { CVTemplate };
