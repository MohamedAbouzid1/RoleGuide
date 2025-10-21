import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, PDFViewer, Image, Svg, Path } from '@react-pdf/renderer';
import { CV } from '@/lib/types';

// SVG Icon components for PDF
const EmailIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#000000"/>
  </Svg>
);

const LocationIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#000000"/>
  </Svg>
);

const PhoneIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="#000000"/>
  </Svg>
);

const LanguageIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.92 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" fill="#000000"/>
  </Svg>
);

const LinkedInIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#000000"/>
  </Svg>
);

const GitHubIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="#000000"/>
  </Svg>
);

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
  nameRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  role: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    border: '1px solid #000000',
  },
  contactGrid: {
    flexDirection: 'row',
    gap: 32,
  },
  contactColumn: {
    flex: 1,
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 8,
    color: '#000000',
    fontWeight: 'bold',
  },
  contactValue: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  sectionLine: {
    height: 1,
    backgroundColor: '#000000',
    width: '100%',
  },
  profileText: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 1.3,
  },
  experienceItem: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  dateColumn: {
    width: 150,
    fontSize: 12,
    color: '#000000',
  },
  contentColumn: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  company: {
    fontSize: 12,
    color: '#000000',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 0,
  },
  bullet: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 2,
    lineHeight: 1.4,
    textIndent: -8,
    paddingLeft: 8,
  },
  educationItem: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  school: {
    fontSize: 12,
    color: '#000000',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  skillCategory: {
    marginBottom: 16,
  },
  skillCategoryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  skillsGrid: {
    flexDirection: 'row',
    gap: 32,
  },
  skillColumn: {
    flex: 1,
  },
  skillItem: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 4,
  },
  languagesGrid: {
    flexDirection: 'row',
    gap: 32,
  },
  language: {
    fontSize: 12,
    flex: 1,
    color: '#000000',
  },
  languageName: {
    fontWeight: 'bold',
  },
  closing: {
    marginTop: 32,
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
    color: '#000000',
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
        {/* Header with name and title on same line, contact info in grid, photo on right */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Name and title on same line */}
            <View style={styles.nameRow}>
              <Text style={styles.name}>{cv.personal.fullName || 'Ihr Name'}</Text>
              {cv.personal.role && (
                <Text style={styles.role}>{cv.personal.role}</Text>
              )}
            </View>
            
            {/* Contact info in two-column grid with icons */}
            <View style={styles.contactGrid}>
              {/* Left column */}
              <View style={styles.contactColumn}>
                {cv.personal.email && (
                  <View style={styles.contactRow}>
                    <EmailIcon />
                    <Text style={styles.contactValue}>{cv.personal.email}</Text>
                  </View>
                )}
                {(cv.personal.address?.street || cv.personal.address?.city) && (
                  <View style={styles.contactRow}>
                    <LocationIcon />
                    <Text style={styles.contactValue}>
                      {[cv.personal.address?.street, cv.personal.address?.postalCode].filter(Boolean).join(', ')}
                      {cv.personal.address?.city && `, ${cv.personal.address.city}`}
                    </Text>
                  </View>
                )}
                {cv.personal.linkedinUrl && (
                  <View style={styles.contactRow}>
                    <LinkedInIcon />
                    <Text style={styles.contactValue}>LinkedIn</Text>
                  </View>
                )}
              </View>
              
              {/* Right column */}
              <View style={styles.contactColumn}>
                {cv.personal.phone && (
                  <View style={styles.contactRow}>
                    <PhoneIcon />
                    <Text style={styles.contactValue}>{cv.personal.phone}</Text>
                  </View>
                )}
                {cv.personal.nationality && (
                  <View style={styles.contactRow}>
                    <LanguageIcon />
                    <Text style={styles.contactValue}>{cv.personal.nationality}</Text>
                  </View>
                )}
                {cv.personal.githubUrl && (
                  <View style={styles.contactRow}>
                    <GitHubIcon />
                    <Text style={styles.contactValue}>GitHub</Text>
                  </View>
                )}
              </View>
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

        {/* Software Projects */}
        {cv.projects && cv.projects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Softwareprojekte</Text>
              <View style={styles.sectionLine} />
            </View>
            {cv.projects.map((project, i) => (
              <View key={i} style={styles.experienceItem}>
                <Text style={styles.dateColumn}>{project.date || '2025'}</Text>
                <View style={styles.contentColumn}>
                  <Text style={styles.jobTitle}>{project.name}</Text>
                  <Text style={styles.company}>{project.description}</Text>
                  {project.bullets && project.bullets.length > 0 && (
                    <View style={styles.bulletList}>
                      {project.bullets.map((bullet, j) => (
                        <Text key={j} style={styles.bullet}>• {bullet}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Berufserfahrung</Text>
              <View style={styles.sectionLine} />
            </View>
            {cv.experience.map((exp, i) => (
              <View key={i} style={styles.experienceItem}>
                <Text style={styles.dateColumn}>
                  {exp.start} - {exp.end || '10.2025'}
                  {exp.city && `\n${exp.city}`}
                </Text>
                <View style={styles.contentColumn}>
                  <Text style={styles.jobTitle}>{exp.role}</Text>
                  <Text style={styles.company}>{exp.company}</Text>
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

        {/* Education */}
        {cv.education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ausbildung</Text>
              <View style={styles.sectionLine} />
            </View>
            {cv.education.map((edu, i) => (
              <View key={i} style={styles.educationItem}>
                <Text style={styles.dateColumn}>
                  {edu.graduation || '10.2023 - 10.2025'}
                  {edu.city && `\n${edu.city}`}
                </Text>
                <View style={styles.contentColumn}>
                  <Text style={styles.degree}>{edu.degree}</Text>
                  <Text style={styles.school}>{edu.school}</Text>
                  {edu.notes && edu.notes.length > 0 && (
                    <View>
                      {edu.notes.map((note, j) => (
                        <Text key={j} style={styles.school}>{note}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Technical Skills */}
        {cv.skills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Technische Kenntnisse</Text>
              <View style={styles.sectionLine} />
            </View>
            <View style={styles.skillsGrid}>
              {cv.skills.map((cat, i) => (
                <View key={i} style={styles.skillColumn}>
                  <Text style={styles.skillCategoryTitle}>{cat.category || 'Kategorie'}</Text>
                  {cat.items.map((item, j) => (
                    <Text key={j} style={styles.skillItem}>
                      {item.name}
                      {item.level >= 80 ? ' (fortgeschritten)' : 
                       item.level >= 60 ? ' (Grundkenntnisse)' : 
                       item.level >= 40 ? ' (Grundlagen)' : ''}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Internships */}
        {cv.internships && cv.internships.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Praktika</Text>
              <View style={styles.sectionLine} />
            </View>
            {cv.internships.map((internship, i) => (
              <View key={i} style={styles.experienceItem}>
                <Text style={styles.dateColumn}>
                  {internship.start} - {internship.end || 'Heute'}
                  {internship.city && `\n${internship.city}`}
                </Text>
                <View style={styles.contentColumn}>
                  <Text style={styles.jobTitle}>{internship.role}</Text>
                  <Text style={styles.company}>{internship.company}</Text>
                  {internship.bullets.length > 0 && (
                    <View style={styles.bulletList}>
                      {internship.bullets.map((bullet, j) => (
                        <Text key={j} style={styles.bullet}>• {bullet}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {cv.languages.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sprachen</Text>
              <View style={styles.sectionLine} />
            </View>
            <View style={styles.languagesGrid}>
              {cv.languages.map((lang, i) => (
                <Text key={i} style={styles.language}>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  {'\n'}
                  {lang.level === 'C2' ? 'Verhandlungssicher' :
                   lang.level === 'C1' ? 'Verhandlungssicher' :
                   lang.level === 'B2' ? 'Verhandlungssicher' :
                   lang.level === 'A1' ? 'Muttersprache' :
                   lang.level}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Interests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interessen</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.skillsGrid}>
            <View style={styles.skillColumn}>
              <Text style={styles.skillItem}>• Open-Source-Entwicklung</Text>
              <Text style={styles.skillItem}>• Backend-Architekturen</Text>
            </View>
            <View style={styles.skillColumn}>
              <Text style={styles.skillItem}>• Cloud-native Anwendungen</Text>
              <Text style={styles.skillItem}>• Content-creation</Text>
            </View>
          </View>
        </View>

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