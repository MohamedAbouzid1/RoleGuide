'use client';

import { useCVStore } from '@/lib/store';
import { Evaluation } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PersonalSection } from './sections/PersonalSection';
import { ProfileSection } from './sections/ProfileSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { InternshipsSection } from './sections/InternshipsSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { LanguagesSection } from './sections/LanguagesSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CVFormProps {
  evaluation: Evaluation | null;
}

const sectionOrder = ['personal', 'profile', 'experience', 'education', 'skills', 'languages'];
const sectionTitles = {
  personal: 'Persönliche Daten',
  profile: 'Profil',
  experience: 'Berufserfahrung',
  education: 'Ausbildung',
  skills: 'Fähigkeiten',
  languages: 'Sprachkenntnisse'
};

const nextSectionTitles = {
  personal: 'Profil',
  profile: 'Berufserfahrung',
  experience: 'Ausbildung',
  education: 'Fähigkeiten',
  skills: 'Sprachkenntnisse',
  languages: 'Fertig'
};

export function CVForm({ evaluation }: CVFormProps) {
  const { 
    cv, 
    sectionVisibility, 
    toggleSection, 
    completedSections, 
    currentSection, 
    openSections, 
    setCompletedSections, 
    setCurrentSection, 
    setOpenSections, 
    openNextSection 
  } = useCVStore();

  // Section validation logic
  const isSectionComplete = (sectionName: string): boolean => {
    switch(sectionName) {
      case 'personal':
        return !!(cv.personal.fullName && cv.personal.email);
      case 'profile':
        return !!(cv.profile?.summary && cv.profile.summary.length > 20);
      case 'experience':
        return cv.experience.length > 0 && cv.experience.some(exp => 
          exp.role && exp.company && exp.bullets.length > 0
        );
      case 'education':
        return cv.education.length > 0 && cv.education.some(edu => 
          edu.degree && edu.school
        );
      case 'skills':
        return cv.skills.length > 0 && cv.skills.some(skill => 
          skill.items.length > 0
        );
      case 'languages':
        return cv.languages.length > 0;
      default:
        return false;
    }
  };

  // Update completed sections when CV data changes
  useEffect(() => {
    const newCompletedSections = new Set<string>();
    sectionOrder.forEach(section => {
      if (isSectionComplete(section)) {
        newCompletedSections.add(section);
      }
    });
    setCompletedSections(newCompletedSections);
  }, [cv]);

  const handleContinueToNext = (currentSectionName: string) => {
    if (isSectionComplete(currentSectionName)) {
      openNextSection();
      
      // Auto-scroll to the next section after a short delay
      setTimeout(() => {
        const nextSectionElement = document.querySelector(`[data-section="${currentSection}"]`);
        if (nextSectionElement) {
          nextSectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const getSectionPreview = (sectionName: string): string => {
    switch(sectionName) {
      case 'personal':
        return cv.personal.fullName && cv.personal.email 
          ? `${cv.personal.fullName} • ${cv.personal.email}`
          : '';
      case 'profile':
        return cv.profile?.summary 
          ? cv.profile.summary.substring(0, 50) + (cv.profile.summary.length > 50 ? '...' : '')
          : '';
      case 'experience':
        return cv.experience.length > 0 
          ? `${cv.experience.length} Position${cv.experience.length > 1 ? 'en' : ''}`
          : '';
      case 'education':
        return cv.education.length > 0 
          ? `${cv.education.length} Abschluss${cv.education.length > 1 ? 'e' : ''}`
          : '';
      case 'skills':
        return cv.skills.length > 0 
          ? `${cv.skills.reduce((acc, skill) => acc + skill.items.length, 0)} Fähigkeiten`
          : '';
      case 'languages':
        return cv.languages.length > 0 
          ? `${cv.languages.length} Sprache${cv.languages.length > 1 ? 'n' : ''}`
          : '';
      default:
        return '';
    }
  };

  const currentStepNumber = sectionOrder.indexOf(currentSection) + 1;
  const totalSteps = sectionOrder.length;
  const progressPercentage = (completedSections.size / totalSteps) * 100;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Lebenslauf bearbeiten</h2>
      
      {/* Progress Indicator */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Schritt {currentStepNumber} von {totalSteps}</span>
          <span>{Math.round(progressPercentage)}% abgeschlossen</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      <Accordion 
        type="multiple" 
        value={openSections} 
        onValueChange={setOpenSections}
        className="w-full"
      >
        {sectionOrder.map((sectionName, index) => {
          const isCompleted = completedSections.has(sectionName);
          const isCurrent = currentSection === sectionName;
          const preview = getSectionPreview(sectionName);
          const isLastSection = index === sectionOrder.length - 1;

          return (
            <AccordionItem key={sectionName} value={sectionName} data-section={sectionName}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full mr-4">
                  <div className="flex items-center gap-3">
                    {isCompleted && (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    )}
                    <span className={isCurrent ? 'font-semibold text-blue-600' : ''}>
                      {sectionTitles[sectionName as keyof typeof sectionTitles]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {!openSections.includes(sectionName) && preview && (
                      <span className="text-sm text-gray-500 truncate max-w-xs">
                        {preview}
                      </span>
                    )}
                    <Switch
                      checked={sectionVisibility[sectionName as keyof typeof sectionVisibility]}
                      onCheckedChange={() => toggleSection(sectionName as keyof typeof sectionVisibility)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {sectionName === 'personal' && <PersonalSection />}
                {sectionName === 'profile' && <ProfileSection />}
                {sectionName === 'experience' && <ExperienceSection evaluation={evaluation} />}
                {sectionName === 'education' && <EducationSection />}
                {sectionName === 'skills' && <SkillsSection evaluation={evaluation} />}
                {sectionName === 'languages' && <LanguagesSection />}
                
                {/* Continue Button */}
                <div className="flex justify-end pt-4 border-t mt-4">
                  <Button 
                    onClick={() => handleContinueToNext(sectionName)}
                    disabled={!isSectionComplete(sectionName)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLastSection ? 'Fertig' : `Weiter zu ${nextSectionTitles[sectionName as keyof typeof nextSectionTitles]}`}
                    {!isLastSection && <ChevronRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}