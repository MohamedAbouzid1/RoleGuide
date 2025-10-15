const React = require('react');
const { Document, Page, Text, View, StyleSheet, Font, Image, Link } = require('@react-pdf/renderer');

// Register fonts - using Helvetica which is built-in and similar to Calibri
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica', fontWeight: 'normal' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: '18mm',
    lineHeight: 1.5,
  },
  // Header
  header: {
    marginBottom: 24,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 4,
  },
  contactGrid: {
    marginTop: 16,
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  contactLabel: {
    width: 140,
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#374151',
  },
  contactValue: {
    flex: 1,
    fontSize: 12,
    color: '#1f2937',
    lineHeight: 1.4,
  },
  linkText: {
    color: '#1d4ed8',
    textDecoration: 'underline',
  },
  photo: {
    width: 110,
    height: 110,
    border: '1px solid #d1d5db',
    borderRadius: 2,
  },
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#111827',
    minWidth: 'auto',
  },
  sectionLine: {
    height: 2,
    backgroundColor: '#1f2937',
    flex: 1,
    marginLeft: 16,
  },
  // Profile section
  profileText: {
    fontSize: 13,
    color: '#1f2937',
    lineHeight: 1.6,
  },
  // Experience & Education - 2 column grid
  entryContainer: {
    marginBottom: 16,
  },
  entryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  entryLeft: {
    width: 170,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#374151',
  },
  entryRight: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 13,
    color: '#111827',
  },
  entryCompany: {
    fontSize: 13,
    color: '#111827',
  },
  entrySubtext: {
    fontSize: 12,
    color: '#1f2937',
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 20,
  },
  bullet: {
    fontSize: 12,
    color: '#1f2937',
    marginBottom: 2,
    lineHeight: 1.4,
  },
  // Skills
  skillCategory: {
    marginBottom: 12,
  },
  skillCategoryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  skillGrid: {
    marginTop: 4,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  skillName: {
    width: 160,
    fontSize: 12,
    color: '#1f2937',
  },
  skillDots: {
    flexDirection: 'row',
    gap: 4,
  },
  skillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  skillDotFilled: {
    backgroundColor: '#111827',
  },
  skillDotEmpty: {
    border: '1px solid #9ca3af',
    backgroundColor: 'transparent',
  },
  // Languages
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageItem: {
    width: '48%',
    fontSize: 12,
    color: '#111827',
    marginBottom: 4,
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
    color: '#1f2937',
  },
  datePlaceText: {
    fontSize: 12,
    color: '#1f2937',
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
            React.createElement(Text, { style: styles.name }, cv.personal?.fullName || 'Ihr Name'),
            cv.personal?.role && React.createElement(Text, { style: styles.role }, cv.personal.role),
            React.createElement(
              View,
              { style: styles.contactGrid },
              // Contact info
              (cv.personal?.phone || cv.personal?.email) && React.createElement(
                View,
                { style: styles.contactRow },
                React.createElement(Text, { style: styles.contactLabel }, 'Kontaktdaten'),
                React.createElement(
                  Text,
                  { style: styles.contactValue },
                  [cv.personal.phone, cv.personal.email].filter(Boolean).join(' • ')
                )
              ),
              // Address
              (cv.personal?.address?.street || cv.personal?.address?.city || cv.personal?.address?.country) && React.createElement(
                View,
                { style: styles.contactRow },
                React.createElement(Text, { style: styles.contactLabel }, 'Adresse'),
                React.createElement(
                  View,
                  { style: styles.contactValue },
                  React.createElement(
                    Text,
                    null,
                    [cv.personal.address?.street, cv.personal.address?.postalCode].filter(Boolean).join(', ')
                  ),
                  React.createElement(
                    Text,
                    null,
                    [cv.personal.address?.city, cv.personal.address?.country].filter(Boolean).join(', ')
                  )
                )
              ),
              // Links
              (cv.personal?.websiteUrl || cv.personal?.linkedinUrl || cv.personal?.githubUrl) && React.createElement(
                View,
                { style: styles.contactRow },
                React.createElement(Text, { style: styles.contactLabel }, 'Links'),
                React.createElement(
                  View,
                  { style: [styles.contactValue, { flexDirection: 'row', gap: 12 }] },
                  cv.personal.websiteUrl && React.createElement(
                    Link,
                    { src: cv.personal.websiteUrl, style: styles.linkText },
                    'Website'
                  ),
                  cv.personal.linkedinUrl && React.createElement(
                    Link,
                    { src: cv.personal.linkedinUrl, style: styles.linkText },
                    'LinkedIn'
                  ),
                  cv.personal.githubUrl && React.createElement(
                    Link,
                    { src: cv.personal.githubUrl, style: styles.linkText },
                    'GitHub'
                  )
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
          React.createElement(Text, { style: styles.sectionTitle }, 'PROFIL'),
          React.createElement(View, { style: styles.sectionLine })
        ),
        React.createElement(
          Text,
          { style: styles.profileText },
          cv.profile.summary
        )
      ),

      // Experience/Beruf
      cv.experience && cv.experience.length > 0 && React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.sectionHeader },
          React.createElement(Text, { style: styles.sectionTitle }, 'BERUF'),
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
                `${exp.start} – ${exp.end || 'laufend'}`
              ),
              React.createElement(
                View,
                { style: styles.entryRight },
                React.createElement(
                  Text,
                  { style: styles.entryTitle },
                  React.createElement(Text, { style: { fontWeight: 'bold' } }, exp.role),
                  ' bei ',
                  React.createElement(Text, { style: { fontWeight: 'bold' } }, exp.company),
                  exp.city ? `, ${exp.city}` : ''
                ),
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

      // Education/Studium & Ausbildung
      cv.education && cv.education.length > 0 && React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.sectionHeader },
          React.createElement(Text, { style: styles.sectionTitle }, 'STUDIUM & AUSBILDUNG'),
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
                edu.graduation || ''
              ),
              React.createElement(
                View,
                { style: styles.entryRight },
                React.createElement(
                  Text,
                  { style: [styles.entryTitle, { fontWeight: 'bold' }] },
                  edu.degree
                ),
                React.createElement(
                  Text,
                  { style: styles.entrySubtext },
                  `${edu.school}${edu.city ? `, ${edu.city}` : ''}`
                )
              )
            )
          )
        )
      ),

      // Skills/Fähigkeiten
      cv.skills && cv.skills.length > 0 && React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.sectionHeader },
          React.createElement(Text, { style: styles.sectionTitle }, 'FÄHIGKEITEN'),
          React.createElement(View, { style: styles.sectionLine })
        ),
        ...cv.skills.map((cat, i) =>
          React.createElement(
            View,
            { key: i, style: styles.skillCategory },
            React.createElement(
              Text,
              { style: styles.skillCategoryTitle },
              cat.category || 'Kategorie'
            ),
            React.createElement(
              View,
              { style: styles.skillGrid },
              ...cat.items.map((item, j) =>
                React.createElement(
                  View,
                  { key: j, style: styles.skillRow },
                  React.createElement(
                    Text,
                    { style: styles.skillName },
                    item.name
                  ),
                  React.createElement(
                    View,
                    { style: styles.skillDots },
                    ...Array.from({ length: 10 }).map((_, k) => {
                      const filled = item.level >= (k + 1) * 10;
                      return React.createElement(View, {
                        key: k,
                        style: filled ? [styles.skillDot, styles.skillDotFilled] : [styles.skillDot, styles.skillDotEmpty],
                      });
                    })
                  )
                )
              )
            )
          )
        )
      ),

      // Languages/Sprachkenntnisse
      cv.languages && cv.languages.length > 0 && React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.sectionHeader },
          React.createElement(Text, { style: styles.sectionTitle }, 'SPRACHKENNTNISSE'),
          React.createElement(View, { style: styles.sectionLine })
        ),
        React.createElement(
          View,
          { style: styles.languagesGrid },
          ...cv.languages.map((lang, i) =>
            React.createElement(
              Text,
              { key: i, style: styles.languageItem },
              React.createElement(Text, { style: styles.languageName }, lang.name),
              `: ${lang.level}`
            )
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
            [cv.closing?.place, cv.closing?.date].filter(Boolean).join(', ')
          )
        )
      )
    )
  );
}

module.exports = { CVTemplate };
