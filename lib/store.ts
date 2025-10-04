import { create } from 'zustand';
import { CV, SectionVisibility } from './types';

interface CVStore {
  cv: CV;
  sectionVisibility: SectionVisibility;
  isDirty: boolean;
  lastSaved: Date | null;
  
  updateCV: (updates: Partial<CV>) => void;
  updateSection: <K extends keyof CV>(
    section: K,
    data: CV[K]
  ) => void;
  toggleSection: (section: keyof SectionVisibility) => void;
  setDirty: (isDirty: boolean) => void;
  setLastSaved: (date: Date) => void;
  reset: () => void;
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
  skills: true,
  languages: true,
  certificates: false,
  projects: false,
  volunteering: false,
  references: false
};

export const useCVStore = create<CVStore>((set) => ({
  cv: initialCV,
  sectionVisibility: initialVisibility,
  isDirty: false,
  lastSaved: null,
  
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
    lastSaved: null
  })
}));