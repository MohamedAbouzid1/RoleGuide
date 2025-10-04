export type CV = {
    personal: {
      fullName: string;
      role?: string; // Professional role/title
      city?: string; // legacy
      address?: {
        street?: string;
        postalCode?: string;
        city?: string;
        country?: string;
      };
      email: string;
      phone?: string;
      photoUrl?: string;
      includePhoto?: boolean;
      websiteUrl?: string;
      linkedinUrl?: string;
      githubUrl?: string;
      links?: { label: string; url: string }[];
      signatureUrl?: string;
    };
    profile?: {
      summary: string; // Professional summary/profile text
    };
    experience: {
      role: string;
      company: string;
      city?: string;
      start: string; // "MM.YYYY"
      end?: string; // "MM.YYYY" or "Present"
      bullets: string[];
    }[];
    education: {
      degree: string;
      school: string;
      city?: string;
      graduation?: string; // "MM.YYYY"
      notes?: string[];
    }[];
    skills: { category: string; items: { name: string; level: number }[] }[];
    languages: { name: string; level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" }[];
    certificates?: { name: string; issuer?: string; date?: string }[];
    projects?: { name: string; description: string; bullets?: string[]; date?: string }[];
    volunteering?: { org: string; role: string; bullets?: string[]; date?: string }[];
    references?: { note: string }[];
    closing?: { place?: string; date?: string };
    language?: 'en' | 'de'; // CV language
  };
  
  export type Evaluation = {
    overallScore: number; // 0–100
    atsScore: number; // 0–100
    redFlags: string[];
    quickWins: string[];
    sectionFeedback: {
      section: string;
      comments: string[];
    }[];
    improvedBullets: {
      section: "Berufserfahrung" | "Projekte";
      original: string;
      suggestion: string;
      rationale: string;
    }[];
    keywordsToAdd: string[];
  };
  
  export type SectionVisibility = {
    personal: boolean;
    profile: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    languages: boolean;
    certificates: boolean;
    projects: boolean;
    volunteering: boolean;
    references: boolean;
  };