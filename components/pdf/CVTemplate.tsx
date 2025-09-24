import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, PDFViewer, Image } from '@react-pdf/renderer';
import { CV } from '@/lib/types';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 11,
    padding: 40,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  photo: {
    width: 110,
    height: 110,
    border: '1px solid #ddd',
  },
  contactInfo: {
    fontSize: 10,
    color: '#666',
    flexDirection: 'row',
    gap: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
    color: '#333',
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dates: {
    fontSize: 10,
    color: '#666',
  },
  company: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  bulletList: {
    paddingLeft: 15,
  },
  bullet: {
    fontSize: 10,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  skillsContainer: {
    flexDirection: 'column',
    gap: 6,
  },
  skillRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  skillName: { width: 120, fontSize: 10 },
  skillBarBg: { height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, flexGrow: 1 },
  skillBarFill: { height: 6, backgroundColor: '#111827', borderRadius: 3 },
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  language: {
    fontSize: 10,
    width: '45%',
  },
});

interface CVTemplateProps {
  cv: CV;
}

export function CVTemplate({ cv }: CVTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{cv.personal.fullName}</Text>
            <View style={styles.contactInfo}>
              {cv.personal.email && <Text>{cv.personal.email}</Text>}
              {cv.personal.phone && <Text>{cv.personal.phone}</Text>}
            </View>
          </View>
          {cv.personal.includePhoto && cv.personal.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            // @ts-ignore react-pdf Image component via Text is not used here
            <Image src={cv.personal.photoUrl} style={styles.photo} />
          ) : null}
        </View>

        {/* Adresse block under contact */}
        {(cv.personal.address?.street || cv.personal.address?.city || cv.personal.address?.country) && (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 10 }}>
              {[cv.personal.address?.street, cv.personal.address?.postalCode].filter(Boolean).join(', ')}
            </Text>
            <Text style={{ fontSize: 10 }}>
              {[cv.personal.address?.city, cv.personal.address?.country].filter(Boolean).join(', ')}
            </Text>
          </View>
        )}

        {/* Berufserfahrung */}
        {cv.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beruf</Text>
            {cv.experience.map((exp, i) => (
              <View key={i} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{exp.role}</Text>
                  <Text style={styles.dates}>
                    {exp.start} – {exp.end || 'Heute'}
                  </Text>
                </View>
                <Text style={styles.company}>
                  {exp.company} {exp.city && `| ${exp.city}`}
                </Text>
                {exp.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.bullets.map((bullet, j) => (
                      <Text key={j} style={styles.bullet}>
                        • {bullet}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Ausbildung */}
        {cv.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ausbildung</Text>
            {cv.education.map((edu, i) => (
              <View key={i} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{edu.degree}</Text>
                  {edu.graduation && (
                    <Text style={styles.dates}>{edu.graduation}</Text>
                  )}
                </View>
                <Text style={styles.company}>
                  {edu.school} {edu.city && `| ${edu.city}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Fähigkeiten */}
        {cv.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fähigkeiten</Text>
            {cv.skills.map((cat, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{cat.category}</Text>
                <View style={styles.skillsContainer}>
                  {cat.items.map((it, j) => (
                    <View key={j} style={styles.skillRow}>
                      <Text style={styles.skillName}>{it.name}</Text>
                      <View style={{ flexDirection: 'row', gap: 2 }}>
                        {Array.from({ length: 10 }).map((_, k) => (
                          <View key={k} style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: it.level >= (k + 1) * 10 ? '#111827' : 'transparent',
                            borderWidth: it.level >= (k + 1) * 10 ? 0 : 1,
                            borderColor: '#9ca3af',
                          }} />
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Closing */}
        {(cv.closing?.place || cv.closing?.date || (cv.personal.signatureUrl)) && (
          <View style={[styles.section, { marginTop: 24 }]}>            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View>
                {cv.personal.signatureUrl ? (
                  <Image src={cv.personal.signatureUrl} style={{ width: 120, height: 50 }} />
                ) : null}
                <Text style={{ fontSize: 10, marginTop: 4 }}>{cv.personal.fullName}</Text>
              </View>
              <Text style={{ fontSize: 10 }}>{[cv.closing?.place, cv.closing?.date].filter(Boolean).join(', ')}</Text>
            </View>
          </View>
        )}

        {/* Sprachkenntnisse */}
        {cv.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sprachkenntnisse</Text>
            <View style={styles.languagesGrid}>
              {cv.languages.map((lang, i) => (
                <Text key={i} style={styles.language}>
                  {lang.name}: {lang.level}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}