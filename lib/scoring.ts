import { CV, Evaluation } from './types';

const ACTION_VERBS = [
  'entwickelte', 'implementierte', 'führte', 'optimierte', 'reduzierte',
  'steigerte', 'koordinierte', 'analysierte', 'verbesserte', 'automatisierte',
  'initiierte', 'verwaltete', 'organisierte', 'leitete', 'gestaltete'
];

const VAGUE_WORDS = [
  'verschiedene', 'einige', 'mehrere', 'diverse', 'unterschiedliche',
  'verantwortlich', 'zuständig', 'teamplayer', 'motiviert', 'engagiert'
];

export function scoreCV(cv: CV): Evaluation {
  const structureScore = evaluateStructure(cv);
  const contentScore = evaluateContent(cv);
  const languageScore = evaluateLanguage(cv);
  const atsScore = evaluateATS(cv);
  const complianceScore = evaluateCompliance(cv);

  const overallScore = Math.round(
    structureScore * 0.25 +
    contentScore * 0.25 +
    languageScore * 0.20 +
    atsScore * 0.20 +
    complianceScore * 0.10
  );

  const evaluation: Evaluation = {
    overallScore,
    atsScore,
    redFlags: [],
    quickWins: [],
    sectionFeedback: [],
    improvedBullets: [],
    keywordsToAdd: []
  };

  // Red flags
  if (!cv.personal.fullName) {
    evaluation.redFlags.push('Name fehlt');
  }
  if (!cv.personal.email) {
    evaluation.redFlags.push('E-Mail-Adresse fehlt');
  }
  if (cv.experience.length === 0) {
    evaluation.redFlags.push('Keine Berufserfahrung angegeben');
  }
  if (cv.education.length === 0) {
    evaluation.redFlags.push('Keine Ausbildung angegeben');
  }

  // Quick wins
  if (cv.skills.length < 5) {
    evaluation.quickWins.push('Fügen Sie mehr relevante Fähigkeiten hinzu (mindestens 5-8)');
  }
  if (cv.languages.length === 0) {
    evaluation.quickWins.push('Sprachkenntnisse hinzufügen mit GER-Stufen');
  }
  
  // Check for quantification in bullets
  const hasNumbers = cv.experience.some(exp => 
    exp.bullets.some(bullet => /\d+/.test(bullet))
  );
  if (!hasNumbers) {
    evaluation.quickWins.push('Quantifizieren Sie Ihre Erfolge mit Zahlen und Prozentangaben');
  }

  // Section feedback
  if (cv.experience.length > 0) {
    const experienceFeedback = [];
    for (const exp of cv.experience) {
      if (exp.bullets.length < 2) {
        experienceFeedback.push(`Position "${exp.role}" braucht mindestens 2-3 Aufzählungspunkte`);
      }
      if (!isValidDateFormat(exp.start)) {
        experienceFeedback.push(`Falsches Datumsformat bei "${exp.role}" - verwenden Sie MM.YYYY`);
      }
    }
    if (experienceFeedback.length > 0) {
      evaluation.sectionFeedback.push({
        section: 'Berufserfahrung',
        comments: experienceFeedback
      });
    }
  }

  // Improved bullets suggestions (mock)
  if (cv.experience.length > 0 && cv.experience[0].bullets.length > 0) {
    const firstBullet = cv.experience[0].bullets[0];
    if (!firstBullet.match(/^[A-Z]/)) {
      evaluation.improvedBullets.push({
        section: 'Berufserfahrung',
        original: firstBullet,
        suggestion: 'Entwickelte und implementierte neue Prozesse, die die Effizienz um 25% steigerten',
        rationale: 'Beginnen Sie mit einem Aktionsverb und quantifizieren Sie das Ergebnis'
      });
    }
  }

  // Keywords to add (based on common German CV keywords)
  evaluation.keywordsToAdd = [
    'Projektmanagement',
    'Teamführung',
    'Prozessoptimierung',
    'Kundenbetreuung',
    'Qualitätssicherung'
  ].filter(keyword => !cv.skills.some(category => 
    category.items.some(item => item.name.toLowerCase().includes(keyword.toLowerCase()))
  )).slice(0, 3);

  return evaluation;
}

function evaluateStructure(cv: CV): number {
  let score = 100;
  
  // Check required sections
  if (!cv.personal.fullName) score -= 20;
  if (!cv.personal.email) score -= 20;
  if (cv.experience.length === 0) score -= 15;
  if (cv.education.length === 0) score -= 15;
  if (cv.skills.length === 0) score -= 10;
  
  // Check date formats
  for (const exp of cv.experience) {
    if (!isValidDateFormat(exp.start)) score -= 5;
    if (exp.end && exp.end !== 'Present' && !isValidDateFormat(exp.end)) score -= 5;
  }
  
  return Math.max(0, score);
}

function evaluateContent(cv: CV): number {
  let score = 100;
  
  // Check for action verbs
  let actionVerbCount = 0;
  for (const exp of cv.experience) {
    for (const bullet of exp.bullets) {
      if (ACTION_VERBS.some(verb => bullet.toLowerCase().includes(verb))) {
        actionVerbCount++;
      }
    }
  }
  
  if (actionVerbCount === 0) score -= 30;
  else if (actionVerbCount < 3) score -= 15;
  
  // Check for quantification
  let quantifiedBullets = 0;
  for (const exp of cv.experience) {
    for (const bullet of exp.bullets) {
      if (/\d+/.test(bullet)) {
        quantifiedBullets++;
      }
    }
  }
  
  if (quantifiedBullets === 0) score -= 25;
  else if (quantifiedBullets < 2) score -= 10;
  
  // Check for vague words
  let vagueWordCount = 0;
  for (const exp of cv.experience) {
    for (const bullet of exp.bullets) {
      if (VAGUE_WORDS.some(word => bullet.toLowerCase().includes(word))) {
        vagueWordCount++;
      }
    }
  }
  
  score -= vagueWordCount * 5;
  
  return Math.max(0, score);
}

function evaluateLanguage(cv: CV): number {
  let score = 100;
  
  // Check bullet length (should be concise, max 2 lines ~150 chars)
  for (const exp of cv.experience) {
    for (const bullet of exp.bullets) {
      if (bullet.length > 150) score -= 3;
      if (bullet.length < 20) score -= 5;
    }
  }
  
  // Check for consistent capitalization
  for (const exp of cv.experience) {
    for (const bullet of exp.bullets) {
      if (bullet.length > 0 && !bullet.match(/^[A-ZÄÖÜ]/)) {
        score -= 2;
      }
    }
  }
  
  return Math.max(0, score);
}

function evaluateATS(cv: CV): number {
  let score = 100;
  
  // Check for ATS-friendly format
  if (!cv.personal.email || !cv.personal.email.includes('@')) score -= 20;
  if (!cv.personal.phone || !cv.personal.phone.match(/[\d\s\+\-\(\)]+/)) score -= 10;
  
  // Check skills are comma-free tokens
  for (const category of cv.skills) {
    for (const item of category.items) {
      if (item.name.includes(',')) score -= 2;
    }
  }
  
  // Check for standard section presence
  if (cv.experience.length === 0) score -= 20;
  if (cv.education.length === 0) score -= 20;
  const totalSkills = cv.skills.reduce((sum, category) => sum + category.items.length, 0);
  if (totalSkills < 5) score -= 10;
  
  return Math.max(0, score);
}

function evaluateCompliance(cv: CV): number {
  let score = 100;
  
  // Privacy-friendly (no DOB, marital status, religion by default)
  // Since our schema doesn't include these, we start at 100
  
  // Check for GDPR-compliant contact info
  if (!cv.personal.email) score -= 30;
  if (cv.personal.includePhoto && !cv.personal.photoUrl) score -= 10;
  
  return Math.max(0, score);
}

export function isValidDateFormat(date: string): boolean {
  // Check for MM.YYYY format
  return /^(0[1-9]|1[0-2])\.\d{4}$/.test(date);
}

export function validateBulletPoint(bullet: string): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (bullet.length < 20) {
    issues.push('Zu kurz - mindestens 20 Zeichen');
  }
  if (bullet.length > 150) {
    issues.push('Zu lang - maximal 150 Zeichen');
  }
  if (!bullet.match(/^[A-ZÄÖÜ]/)) {
    issues.push('Sollte mit Großbuchstaben beginnen');
  }
  if (!/\d+/.test(bullet) && !bullet.includes('%')) {
    issues.push('Keine Quantifizierung gefunden');
  }
  
  const hasActionVerb = ACTION_VERBS.some(verb => 
    bullet.toLowerCase().includes(verb)
  );
  if (!hasActionVerb) {
    issues.push('Kein Aktionsverb gefunden');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}