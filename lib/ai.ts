import { CV, Evaluation } from './types';
import { scoreCV } from './scoring';
import { EVALUATION_PROMPT, IMPROVEMENT_PROMPT } from './prompts';

// Mock AI service - replace with actual Claude API call later
export async function evaluateResume(cv: CV): Promise<Evaluation> {
  // Get baseline score from deterministic scorer
  const baselineEvaluation = scoreCV(cv);
  
  // Mock AI enhancement (replace with actual API call)
  const aiEnhancements = await mockAIEvaluation(cv);
  
  // Merge baseline with AI insights
  return {
    ...baselineEvaluation,
    ...aiEnhancements,
    overallScore: Math.round(
      (baselineEvaluation.overallScore + (aiEnhancements.overallScore ?? baselineEvaluation.overallScore)) / 2
    ),
    atsScore: Math.round(
      (baselineEvaluation.atsScore + (aiEnhancements.atsScore ?? baselineEvaluation.atsScore)) / 2
    )
  };
}

export async function suggestImprovements(cv: CV): Promise<Evaluation> {
  // For now, this uses the same logic as evaluate
  // Later can be enhanced with different prompts
  return evaluateResume(cv);
}

// Mock AI evaluation - returns realistic looking results
async function mockAIEvaluation(cv: CV): Promise<Partial<Evaluation>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    overallScore: Math.floor(Math.random() * 20) + 70,
    atsScore: Math.floor(Math.random() * 20) + 75,
    redFlags: [
      'Fehlende Quantifizierung in Berufserfahrung',
      'Zu wenige branchenspezifische Keywords'
    ],
    quickWins: [
      'Fügen Sie 2-3 messbare Erfolge hinzu',
      'Verwenden Sie mehr Aktionsverben',
      'Ergänzen Sie relevante Zertifikate'
    ],
    sectionFeedback: [
      {
        section: 'Berufserfahrung',
        comments: [
          'Verwenden Sie die STAR-Methode für Ihre Aufzählungspunkte',
          'Beginnen Sie jeden Punkt mit einem starken Aktionsverb'
        ]
      },
      {
        section: 'Fähigkeiten',
        comments: [
          'Gruppieren Sie Fähigkeiten nach Kategorien (Technisch, Soft Skills)',
          'Priorisieren Sie die wichtigsten Fähigkeiten für die Zielposition'
        ]
      }
    ],
    improvedBullets: [
      {
        section: 'Berufserfahrung',
        original: 'Verantwortlich für Kundenbetreuung',
        suggestion: 'Betreute 50+ Geschäftskunden und steigerte die Kundenzufriedenheit um 23%',
        rationale: 'Quantifizierung und konkretes Ergebnis hinzugefügt'
      }
    ],
    keywordsToAdd: [
      'Agiles Projektmanagement',
      'Datenanalyse',
      'Stakeholder-Management'
    ]
  };
}

// Export function to swap AI providers later
export function setAIProvider(provider: 'mock' | 'claude' | 'openai') {
  // Implementation for switching providers
  console.log(`AI provider set to: ${provider}`);
}