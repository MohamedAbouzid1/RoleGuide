import { describe, it, expect } from 'vitest';
import { scoreCV, isValidDateFormat, validateBulletPoint } from '../lib/scoring';
import { CV } from '../lib/types';

describe('CV Scoring', () => {
  const mockCV: CV = {
    personal: {
      fullName: 'Max Mustermann',
      city: 'Berlin',
      email: 'max@example.com',
      phone: '+49 123 456789',
    },
    experience: [
      {
        role: 'Software Engineer',
        company: 'Tech GmbH',
        city: 'Berlin',
        start: '01.2022',
        end: '12.2023',
        bullets: [
          'Entwickelte neue Features und steigerte die Performance um 30%',
          'Leitete ein Team von 5 Entwicklern',
        ],
      },
    ],
    education: [
      {
        degree: 'B.Sc. Informatik',
        school: 'TU Berlin',
        graduation: '09.2021',
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL'],
    languages: [
      { name: 'Deutsch', level: 'C2' },
      { name: 'Englisch', level: 'C1' },
    ],
  };

  it('should score a well-formed CV highly', () => {
    const evaluation = scoreCV(mockCV);
    expect(evaluation.overallScore).toBeGreaterThan(70);
    expect(evaluation.atsScore).toBeGreaterThan(70);
  });

  it('should penalize missing required sections', () => {
    const incompleteCV: CV = {
      ...mockCV,
      experience: [],
      education: [],
    };
    const evaluation = scoreCV(incompleteCV);
    expect(evaluation.overallScore).toBeLessThan(50);
    expect(evaluation.redFlags).toContain('Keine Berufserfahrung angegeben');
    expect(evaluation.redFlags).toContain('Keine Ausbildung angegeben');
  });

  it('should detect missing quantification', () => {
    const cvWithoutNumbers: CV = {
      ...mockCV,
      experience: [
        {
          ...mockCV.experience[0],
          bullets: [
            'Entwickelte neue Features',
            'Leitete ein Team',
          ],
        },
      ],
    };
    const evaluation = scoreCV(cvWithoutNumbers);
    expect(evaluation.quickWins).toContain('Quantifizieren Sie Ihre Erfolge mit Zahlen und Prozentangaben');
  });
});

describe('Date Format Validation', () => {
  it('should validate correct date format', () => {
    expect(isValidDateFormat('01.2024')).toBe(true);
    expect(isValidDateFormat('12.2023')).toBe(true);
    expect(isValidDateFormat('06.2022')).toBe(true);
  });

  it('should reject invalid date formats', () => {
    expect(isValidDateFormat('2024-01')).toBe(false);
    expect(isValidDateFormat('13.2024')).toBe(false);
    expect(isValidDateFormat('1.2024')).toBe(false);
    expect(isValidDateFormat('01/2024')).toBe(false);
  });
});

describe('Bullet Point Validation', () => {
  it('should validate good bullet points', () => {
    const result = validateBulletPoint('Entwickelte neue Features und steigerte die Performance um 30%');
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('should detect issues with poor bullet points', () => {
    const result = validateBulletPoint('verantwortlich für verschiedene aufgaben');
    expect(result.valid).toBe(false);
    expect(result.issues).toContain('Sollte mit Großbuchstaben beginnen');
    expect(result.issues).toContain('Keine Quantifizierung gefunden');
  });

  it('should detect too short bullet points', () => {
    const result = validateBulletPoint('Team geleitet');
    expect(result.valid).toBe(false);
    expect(result.issues).toContain('Zu kurz - mindestens 20 Zeichen');
  });

  it('should detect too long bullet points', () => {
    const longBullet = 'A'.repeat(160);
    const result = validateBulletPoint(longBullet);
    expect(result.valid).toBe(false);
    expect(result.issues).toContain('Zu lang - maximal 150 Zeichen');
  });
});