const React = require('react');
const { Document, Page, Text, View, StyleSheet, Font, Image, Link } = require('@react-pdf/renderer');

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

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 11,
    padding: '18mm',
    lineHeight: 1.5,
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
  name: {
    fontSize: 28,
    fontWeight: 'ultrabold',
    color: '#111827',
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    fontWeight: 'semibold',
    color: '#374151',
    marginTop: 2,
  },
  contactGrid: {
    marginTop: 12,
    flexDirection: 'column',
    gap: 4,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  contactLabel: {
    width: 140,
    fontSize: 12,
    fontWeight: 'semibold',
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
    objectFit: 'cover',
  },
  // Sections
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'ultrabold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#111827',
    minWidth: 'auto',
  },
  sectionLine: {
    height: 2,
    backgroundColor: '#1f2937',
    flex: 1,
    marginLeft: 12,
  },
  // Profile section
  profileText: {
    fontSize: 13,
    color: '#1f2937',
    lineHeight: 1.6,
  },
  // Experience & Education - 2 column grid
  entryContainer: {
    marginBottom: 12,
  },
  entryGrid: {
    flexDirection: 'row',
    gap: 12,
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
    marginBottom: 10,
  },
  skillCategoryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  skillGrid: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  skillRow: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 10,
  },
  skillName: {
    width: 140,
    fontSize: 12,
    color: '#1f2937',
  },
  skillDots: {
    flexDirection: 'row',
    gap: 2,
  },
  skillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
    gap: 12,
  },
  languageItem: {
    width: '45%',
    fontSize: 12,
    color: '#111827',
    marginBottom: 4,
  },
  languageName: {
    fontWeight: 'semibold',
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
                  Text,
                  { style: styles.contactValue },
                  [
                    [cv.personal.address?.street, cv.personal.address?.postalCode].filter(Boolean).join(', '),
                    [cv.personal.address?.city, cv.personal.address?.country].filter(Boolean).join(', ')
                  ].filter(Boolean).join('\n')
                )
              ),
              // Links
              (cv.personal?.websiteUrl || cv.personal?.linkedinUrl || cv.personal?.githubUrl) && React.createElement(
                View,
                { style: styles.contactRow },
                React.createElement(Text, { style: styles.contactLabel }, 'Links'),
                React.createElement(
                  Text,
                  { style: styles.contactValue },
                  [
                    cv.personal.websiteUrl && 'Website',
                    cv.personal.linkedinUrl && 'LinkedIn',
                    cv.personal.githubUrl && 'GitHub'
                  ].filter(Boolean).join(' • ')
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
                  `${exp.start || ''} – ${exp.end || 'laufend'}`
                ),
              React.createElement(
                View,
                { style: styles.entryRight },
                React.createElement(
                  Text,
                  { style: styles.entryTitle },
                  [
                    React.createElement(Text, { key: 'role', style: { fontWeight: 'semibold' } }, exp.role || ''),
                    ' bei ',
                    React.createElement(Text, { key: 'company', style: { fontWeight: 'bold' } }, exp.company || ''),
                    exp.city ? `, ${exp.city}` : null
                  ].filter(Boolean)
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
                  edu.degree || ''
                ),
                React.createElement(
                  Text,
                  { style: styles.entrySubtext },
                  `${edu.school || ''}${edu.city ? `, ${edu.city}` : ''}`
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
              ...cat.items.map((item, j) => {
                const filled = (level) => item.level >= level * 10;
                return React.createElement(
                  View,
                  { key: j, style: styles.skillRow },
                  React.createElement(
                    Text,
                    { style: styles.skillName },
                    item.name || ''
                  ),
                  React.createElement(
                    View,
                    { style: styles.skillDots },
                    ...Array.from({ length: 10 }).map((_, k) =>
                      React.createElement(View, {
                        key: k,
                        style: filled(k + 1) ? [styles.skillDot, styles.skillDotFilled] : [styles.skillDot, styles.skillDotEmpty],
                      })
                    )
                  )
                );
              })
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
              [
                React.createElement(Text, { key: 'name', style: styles.languageName }, lang.name || ''),
                lang.level ? `: ${lang.level}` : null
              ].filter(Boolean)
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
            [cv.closing?.place, cv.closing?.date].filter(Boolean).join(', ') || ''
          )
        )
      )
    )
  );
}

module.exports = { CVTemplate };
