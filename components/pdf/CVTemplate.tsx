import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, PDFViewer, Image } from '@react-pdf/renderer';
import { CV } from '@/lib/types';

// Language-specific labels
const labels = {
  de: {
    personal: 'PERSÖNLICHE ANGABEN',
    profile: 'BERUFLICHES PROFIL',
    experience: 'BERUFSERFAHRUNG',
    education: 'AUSBILDUNG',
    skills: 'FÄHIGKEITEN',
    languages: 'SPRACHEN',
    certificates: 'ZERTIFIKATE',
    projects: 'PROJEKTE',
    volunteering: 'EHRENAMT',
    references: 'REFERENZEN',
    current: 'Aktuell',
    present: 'Heute',
    native: 'Muttersprache',
    fluent: 'Fließend',
    conversational: 'Konversation',
    basic: 'Grundkenntnisse',
  },
  en: {
    personal: 'PERSONAL INFORMATION',
    profile: 'PROFESSIONAL PROFILE',
    experience: 'WORK EXPERIENCE',
    education: 'EDUCATION',
    skills: 'SKILLS',
    languages: 'LANGUAGES',
    certificates: 'CERTIFICATES',
    projects: 'PROJECTS',
    volunteering: 'VOLUNTEERING',
    references: 'REFERENCES',
    current: 'Current',
    present: 'Present',
    native: 'Native',
    fluent: 'Fluent',
    conversational: 'Conversational',
    basic: 'Basic',
  },
};

// Register fonts
Font.register({
  family: 'Calibri',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/calibri/v20/KFOlCnqEu92Fr1MmWUlfBBc4.woff2', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/calibri/v20/KFOmCnqEu92Fr1Mu4mxK.woff2', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Calibri',
    fontSize: 11,
    padding: '18mm',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: 'ultrabold',
    marginBottom: 2,
    color: '#111827',
  },
  role: {
    fontSize: 14,
    fontWeight: 'semibold',
    color: '#374151',
    marginTop: 2,
    marginBottom: 12,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 2,
    border: '1px solid #d1d5db',
  },
  contactGrid: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 1.4,
  },
  contactLabel: {
    fontWeight: 'semibold',
    fontStyle: 'italic',
    color: '#374151',
    marginBottom: 2,
  },
  contactValue: {
    color: '#1f2937',
    marginBottom: 4,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'ultrabold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#111827',
  },
  sectionLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#1f2937',
  },
  profileText: {
    fontSize: 13,
    lineHeight: 1.6,
    color: '#1f2937',
  },
  experienceItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  dateColumn: {
    width: 170,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#374151',
  },
  contentColumn: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 13,
    color: '#111827',
  },
  jobTitleBold: {
    fontWeight: 'semibold',
  },
  company: {
    fontSize: 13,
    color: '#111827',
  },
  companyBold: {
    fontWeight: 'bold',
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 15,
  },
  bullet: {
    fontSize: 12,
    color: '#1f2937',
    marginBottom: 2,
    lineHeight: 1.4,
  },
  educationItem: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 12,
  },
  degree: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  school: {
    fontSize: 12,
    color: '#1f2937',
  },
  skillCategory: {
    marginBottom: 10,
  },
  skillCategoryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  skillItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
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
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotFilled: {
    backgroundColor: '#111827',
  },
  dotEmpty: {
    border: '1px solid #9ca3af',
    backgroundColor: 'transparent',
  },
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  language: {
    fontSize: 12,
    width: '45%',
    color: '#111827',
  },
  languageName: {
    fontWeight: 'semibold',
  },
  closing: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signature: {
    width: 120,
    height: 50,
    marginBottom: 6,
  },
  closingText: {
    fontSize: 12,
    color: '#1f2937',
  },
});

interface CVTemplateProps {
  cv: CV;
}

export function CVTemplate({ cv }: CVTemplateProps) {
  const lang = cv.language || 'de';
  const t = labels[lang];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with name on left, photo on right */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{cv.personal.fullName || 'Ihr Name'}</Text>
            {cv.personal.role && (
              <Text style={styles.role}>{cv.personal.role}</Text>
            )}

            {/* Contact Grid */}
            <View style={styles.contactGrid}>
              {/* Kontaktdaten */}
              {(cv.personal.phone || cv.personal.email) && (
                <View>
                  <Text style={styles.contactLabel}>Kontaktdaten</Text>
                  <Text style={styles.contactValue}>
                    {[cv.personal.phone, cv.personal.email].filter(Boolean).join(' • ')}
                  </Text>
                </View>
              )}

              {/* Adresse */}
              {(cv.personal.address?.street || cv.personal.address?.city || cv.personal.address?.country) && (
                <View>
                  <Text style={styles.contactLabel}>Adresse</Text>
                  <Text style={styles.contactValue}>
                    {[cv.personal.address?.street, cv.personal.address?.postalCode].filter(Boolean).join(', ')}
                  </Text>
                  <Text style={styles.contactValue}>
                    {[cv.personal.address?.city, cv.personal.address?.country].filter(Boolean).join(', ')}
                  </Text>
                </View>
              )}

              {/* Links */}
              {(cv.personal.websiteUrl || cv.personal.linkedinUrl || cv.personal.githubUrl) && (
                <View>
                  <Text style={styles.contactLabel}>Links</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {cv.personal.websiteUrl && (
                      <Text style={{ color: '#1d4ed8', textDecoration: 'underline' }}>Website</Text>
                    )}
                    {cv.personal.linkedinUrl && (
                      <Text style={{ color: '#1d4ed8', textDecoration: 'underline' }}>LinkedIn</Text>
                    )}
                    {cv.personal.githubUrl && (
                      <Text style={{ color: '#1d4ed8', textDecoration: 'underline' }}>GitHub</Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Photo */}
          {cv.personal.includePhoto && cv.personal.photoUrl && (
            <Image src={cv.personal.photoUrl} style={styles.photo} />
          )}
        </View>

        {/* Profile */}
        {cv.profile?.summary && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Profil</Text>
              <View style={styles.sectionLine} />
            </View>
            <Text style={styles.profileText}>{cv.profile.summary}</Text>
          </View>
        )}

        {/* Beruf */}
        {cv.experience.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Beruf</Text>
              <View style={styles.sectionLine} />
            </View>
            {cv.experience.map((exp, i) => (
              <View key={i} style={styles.experienceItem}>
                <Text style={styles.dateColumn}>
                  {exp.start} – {exp.end || 'laufend'}
                </Text>
                <View style={styles.contentColumn}>
                  <Text style={styles.jobTitle}>
                    <Text style={styles.jobTitleBold}>{exp.role}</Text>
                    {' bei '}
                    <Text style={styles.companyBold}>{exp.company}</Text>
                    {exp.city ? `, ${exp.city}` : ''}
                  </Text>
                  {exp.bullets.length > 0 && (
                    <View style={styles.bulletList}>
                      {exp.bullets.map((bullet, j) => (
                        <Text key={j} style={styles.bullet}>• {bullet}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Studium & Ausbildung */}
        {cv.education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Studium & Ausbildung</Text>
              <View style={styles.sectionLine} />
            </View>
            {cv.education.map((edu, i) => (
              <View key={i} style={styles.educationItem}>
                <Text style={styles.dateColumn}>{edu.graduation || ''}</Text>
                <View style={styles.contentColumn}>
                  <Text style={styles.degree}>{edu.degree}</Text>
                  <Text style={styles.school}>
                    {edu.school}{edu.city ? `, ${edu.city}` : ''}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Fähigkeiten */}
        {cv.skills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Fähigkeiten</Text>
              <View style={styles.sectionLine} />
            </View>
            {cv.skills.map((cat, i) => (
              <View key={i} style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>{cat.category || 'Kategorie'}</Text>
                <View style={styles.skillsGrid}>
                  {cat.items.map((item, j) => (
                    <View key={j} style={styles.skillItem}>
                      <Text style={styles.skillName}>{item.name}</Text>
                      <View style={styles.skillDots}>
                        {Array.from({ length: 10 }).map((_, k) => {
                          const filled = item.level >= (k + 1) * 10;
                          return (
                            <View
                              key={k}
                              style={[styles.dot, filled ? styles.dotFilled : styles.dotEmpty]}
                            />
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Sprachkenntnisse */}
        {cv.languages.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sprachkenntnisse</Text>
              <View style={styles.sectionLine} />
            </View>
            <View style={styles.languagesGrid}>
              {cv.languages.map((language, i) => (
                <Text key={i} style={styles.language}>
                  <Text style={styles.languageName}>{language.name}</Text>: {language.level}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Closing with signature */}
        {(cv.personal.signatureUrl || cv.closing?.place || cv.closing?.date) && (
          <View style={styles.closing}>
            <View>
              {cv.personal.signatureUrl && (
                <Image src={cv.personal.signatureUrl} style={styles.signature} />
              )}
              <Text style={styles.closingText}>{cv.personal.fullName}</Text>
            </View>
            <Text style={styles.closingText}>
              {[cv.closing?.place, cv.closing?.date].filter(Boolean).join(', ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}