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
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { LanguagesSection } from './sections/LanguagesSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CVFormProps {
  evaluation: Evaluation | null;
}

export function CVForm({ evaluation }: CVFormProps) {
  const { sectionVisibility, toggleSection } = useCVStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Lebenslauf bearbeiten</h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="personal">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <span>Persönliche Daten</span>
              <Switch
                checked={sectionVisibility.personal}
                onCheckedChange={() => toggleSection('personal')}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <PersonalSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="profile">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <span>Profil</span>
              <Switch
                checked={sectionVisibility.profile}
                onCheckedChange={() => toggleSection('profile')}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ProfileSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <span>Berufserfahrung</span>
              <Switch
                checked={sectionVisibility.experience}
                onCheckedChange={() => toggleSection('experience')}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ExperienceSection evaluation={evaluation} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <span>Ausbildung</span>
              <Switch
                checked={sectionVisibility.education}
                onCheckedChange={() => toggleSection('education')}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <EducationSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <span>Fähigkeiten</span>
              <Switch
                checked={sectionVisibility.skills}
                onCheckedChange={() => toggleSection('skills')}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SkillsSection evaluation={evaluation} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <span>Sprachkenntnisse</span>
              <Switch
                checked={sectionVisibility.languages}
                onCheckedChange={() => toggleSection('languages')}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <LanguagesSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}