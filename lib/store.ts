import { create } from 'zustand';
import { CV, SectionVisibility } from './types';

interface CVStore {
  cv: CV;
  sectionVisibility: SectionVisibility;
  isDirty: boolean;
  lastSaved: Date | null;
  completedSections: Set<string>;
  currentSection: string;
  openSections: string[];
  
  updateCV: (updates: Partial<CV>) => void;
  updateSection: <K extends keyof CV>(
    section: K,
    data: CV[K]
  ) => void;
  toggleSection: (section: keyof SectionVisibility) => void;
  setDirty: (isDirty: boolean) => void;
  setLastSaved: (date: Date) => void;
  reset: () => void;
  setCompletedSections: (sections: Set<string>) => void;
  setCurrentSection: (section: string) => void;
  setOpenSections: (sections: string[]) => void;
  openNextSection: () => void;
}

const initialCV: CV = {
  personal: {
    fullName: '',
    city: '',
    address: { street: '', postalCode: '', city: '', country: '' },
    email: '',
    phone: '',
    photoUrl: '',
    includePhoto: false,
    websiteUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    signatureUrl: '',
    links: []
  },
  profile: { summary: '' },
  experience: [],
  education: [],
  internships: [],
  skills: [],
  languages: [],
  certificates: [],
  projects: [],
  volunteering: [],
  references: [],
  closing: { place: '', date: '' },
  language: 'de'
};

const initialVisibility: SectionVisibility = {
  personal: true,
  profile: true,
  experience: true,
  education: true,
  internships: true,
  skills: true,
  languages: true,
  certificates: false,
  projects: false,
  volunteering: false,
  references: false
};

export const useCVStore = create<CVStore>((set, get) => ({
  cv: initialCV,
  sectionVisibility: initialVisibility,
  isDirty: false,
  lastSaved: null,
  completedSections: new Set(),
  currentSection: 'personal',
  openSections: ['personal'],
  
  updateCV: (updates) => set((state) => ({
    cv: { ...state.cv, ...updates },
    isDirty: true
  })),
  
  updateSection: (section, data) => set((state) => ({
    cv: { ...state.cv, [section]: data },
    isDirty: true
  })),
  
  toggleSection: (section) => set((state) => ({
    sectionVisibility: {
      ...state.sectionVisibility,
      [section]: !state.sectionVisibility[section]
    }
  })),
  
  setDirty: (isDirty) => set({ isDirty }),
  setLastSaved: (date) => set({ lastSaved: date, isDirty: false }),
  reset: () => set({
    cv: initialCV,
    sectionVisibility: initialVisibility,
    isDirty: false,
    lastSaved: null,
    completedSections: new Set(),
    currentSection: 'personal',
    openSections: ['personal']
  }),
  
  setCompletedSections: (sections) => set({ completedSections: sections }),
  setCurrentSection: (section) => set({ currentSection: section }),
  setOpenSections: (sections) => set({ openSections: sections }),
  
  openNextSection: () => {
    const { currentSection, openSections } = get();
    const sectionOrder = ['personal', 'profile', 'experience', 'education', 'skills', 'languages'];
    const currentIndex = sectionOrder.indexOf(currentSection);
    
    if (currentIndex < sectionOrder.length - 1) {
      const nextSection = sectionOrder[currentIndex + 1];
      const newOpenSections = [...openSections, nextSection];
      
      set({
        currentSection: nextSection,
        openSections: newOpenSections
      });
    }
  }
}));