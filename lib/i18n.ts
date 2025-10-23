export type Language = 'en' | 'de';

export interface Translations {
  // Navigation & UI
  dashboard: string;
  login: string;
  register: string;
  logout: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  remove: string;
  loading: string;
  error: string;
  success: string;
  
  // Dashboard
  welcome: string;
  welcomeBack: string;
  createNewCV: string;
  createNewCVDescription: string;
  cvEvaluation: string;
  cvEvaluationDescription: string;
  comingSoon: string;
  recentActivity: string;
  noActivityYet: string;
  createFirstCV: string;
  selectLanguage: string;
  cvLanguage: string;
  
  // CV Sections
  personal: string;
  profile: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  
  // Personal Section
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  nationality: string;
  profilePicture: string;
  
  // Profile Section
  summary: string;
  professionalSummary: string;
  
  // Experience Section
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  current: string;
  description: string;
  responsibilities: string;
  
  // Education Section
  degree: string;
  institution: string;
  graduationDate: string;
  gpa: string;
  
  // Skills Section
  skillName: string;
  skillLevel: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  expert: string;
  
  // Languages Section
  language: string;
  proficiency: string;
  native: string;
  fluent: string;
  conversational: string;
  basic: string;
  
  // CV Builder
  cvBuilder: string;
  preview: string;
  exportPDF: string;
  evaluate: string;
  saving: string;
  saved: string;
  evaluating: string;
  exporting: string;
  exported: string;
  
  // Authentication
  signIn: string;
  signUp: string;
  password: string;
  name: string;
  createAccount: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  
  // Messages
  loginRequired: string;
  mustSignIn: string;
  registrationFailed: string;
  loginFailed: string;
  saveFailed: string;
  exportFailed: string;
  evaluationFailed: string;
  
  // PDF Export
  downloadPDF: string;
  pdfGenerated: string;
  
  // Form validation
  required: string;
  invalidEmail: string;
  passwordTooShort: string;
  nameRequired: string;
  
  // Additional keys
  overallScore: string;
  noEvaluation: string;
  
  // New dashboard keys
  resume: string;
  coverLetter: string;
  settings: string;
  myAccount: string;
  plansPricing: string;
  myResumes: string;
  newResume: string;
  creating: string;
  pleaseWait: string;
  untitledCV: string;
  editedYesterday: string;
  editedDaysAgo: string;
  overall: string;
  download: string;
  duplicate: string;
  deleting: string;
  confirmDeleteCV: string;
  deleteError: string;
  duplicateError: string;
  downloadFeatureComingSoon: string;
  downloadError: string;
  createCVError: string;
  tryAgain: string;
  noCVsYet: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation & UI
    dashboard: 'Dashboard',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Dashboard
    welcome: 'Welcome',
    welcomeBack: 'Welcome back',
    createNewCV: 'Create New CV',
    createNewCVDescription: 'Create a new CV from scratch.',
    cvEvaluation: 'CV Evaluation',
    cvEvaluationDescription: 'Let our AI evaluate your CV.',
    comingSoon: 'Coming Soon',
    recentActivity: 'Recent Activity',
    noActivityYet: 'No activities yet',
    createFirstCV: 'Create your first CV to get started!',
    selectLanguage: 'Select Language',
    cvLanguage: 'CV Language',
    
    // CV Sections
    personal: 'Personal Information',
    profile: 'Professional Profile',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    
    // Personal Section
    firstName: 'First Name',
    lastName: 'Last Name',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    dateOfBirth: 'Date of Birth',
    nationality: 'Nationality',
    profilePicture: 'Profile Picture',
    
    // Profile Section
    summary: 'Summary',
    professionalSummary: 'Professional Summary',
    
    // Experience Section
    jobTitle: 'Job Title',
    company: 'Company',
    startDate: 'Start Date',
    endDate: 'End Date',
    current: 'Current',
    description: 'Description',
    responsibilities: 'Responsibilities',
    
    // Education Section
    degree: 'Degree',
    institution: 'Institution',
    graduationDate: 'Graduation Date',
    gpa: 'GPA',
    
    // Skills Section
    skillName: 'Skill Name',
    skillLevel: 'Skill Level',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
    
    // Languages Section
    language: 'Language',
    proficiency: 'Proficiency',
    native: 'Native',
    fluent: 'Fluent',
    conversational: 'Conversational',
    basic: 'Basic',
    
    // CV Builder
    cvBuilder: 'CV Builder',
    preview: 'Preview',
    exportPDF: 'Export as PDF',
    evaluate: 'Evaluate',
    saving: 'Saving...',
    saved: 'Saved',
    evaluating: 'Evaluating...',
    exporting: 'Exporting...',
    exported: 'Exported',
    
    // Authentication
    signIn: 'Sign In',
    signUp: 'Sign Up',
    password: 'Password',
    name: 'Name',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    
    // Messages
    loginRequired: 'Login Required',
    mustSignIn: 'You must sign in to use the dashboard.',
    registrationFailed: 'Registration failed',
    loginFailed: 'Login failed',
    saveFailed: 'Save failed',
    exportFailed: 'Export failed',
    evaluationFailed: 'Evaluation failed',
    
    // PDF Export
    downloadPDF: 'Download PDF',
    pdfGenerated: 'Your CV has been downloaded as PDF',
    
    // Form validation
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email',
    passwordTooShort: 'Password must be at least 6 characters',
    nameRequired: 'Name is required',
    
    // Additional keys
    overallScore: 'Overall Score',
    noEvaluation: 'No evaluation yet',
    
    // New dashboard keys
    resume: 'Resume',
    coverLetter: 'Cover Letter',
    settings: 'Settings',
    myAccount: 'My Account',
    plansPricing: 'Plans & Pricing',
    myResumes: 'My Resumes',
    newResume: 'New Resume',
    creating: 'Creating...',
    pleaseWait: 'Please wait...',
    untitledCV: 'Untitled CV',
    editedYesterday: 'Edited yesterday',
    editedDaysAgo: 'Edited {days} days ago',
    overall: 'Overall',
    download: 'Download',
    duplicate: 'Duplicate',
    deleting: 'Deleting...',
    confirmDeleteCV: 'Are you sure you want to delete this CV?',
    deleteError: 'Failed to delete CV',
    duplicateError: 'Failed to duplicate CV',
    downloadFeatureComingSoon: 'Download feature coming soon',
    downloadError: 'Failed to download CV',
    createCVError: 'Failed to create CV',
    tryAgain: 'Try again',
    noCVsYet: 'No CVs yet',
  },
  
  de: {
    // Navigation & UI
    dashboard: 'Dashboard',
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    remove: 'Entfernen',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolgreich',
    
    // Dashboard
    welcome: 'Willkommen',
    welcomeBack: 'Willkommen zurück',
    createNewCV: 'Neuen Lebenslauf erstellen',
    createNewCVDescription: 'Erstellen Sie einen neuen Lebenslauf von Grund auf.',
    cvEvaluation: 'Lebenslauf bewerten',
    cvEvaluationDescription: 'Lassen Sie Ihren Lebenslauf von unserer KI bewerten.',
    comingSoon: 'Bald verfügbar',
    recentActivity: 'Letzte Aktivitäten',
    noActivityYet: 'Noch keine Aktivitäten vorhanden',
    createFirstCV: 'Erstellen Sie Ihren ersten Lebenslauf, um loszulegen!',
    selectLanguage: 'Sprache auswählen',
    cvLanguage: 'Lebenslauf-Sprache',
    
    // CV Sections
    personal: 'Persönliche Angaben',
    profile: 'Berufliches Profil',
    experience: 'Berufserfahrung',
    education: 'Ausbildung',
    skills: 'Fähigkeiten',
    languages: 'Sprachen',
    
    // Personal Section
    firstName: 'Vorname',
    lastName: 'Nachname',
    fullName: 'Vollständiger Name',
    email: 'E-Mail',
    phone: 'Telefon',
    address: 'Adresse',
    dateOfBirth: 'Geburtsdatum',
    nationality: 'Staatsangehörigkeit',
    profilePicture: 'Profilbild',
    
    // Profile Section
    summary: 'Zusammenfassung',
    professionalSummary: 'Berufliche Zusammenfassung',
    
    // Experience Section
    jobTitle: 'Stellenbezeichnung',
    company: 'Unternehmen',
    startDate: 'Startdatum',
    endDate: 'Enddatum',
    current: 'Aktuell',
    description: 'Beschreibung',
    responsibilities: 'Aufgaben',
    
    // Education Section
    degree: 'Abschluss',
    institution: 'Institution',
    graduationDate: 'Abschlussdatum',
    gpa: 'Notendurchschnitt',
    
    // Skills Section
    skillName: 'Fähigkeit',
    skillLevel: 'Niveau',
    beginner: 'Anfänger',
    intermediate: 'Mittelstufe',
    advanced: 'Fortgeschritten',
    expert: 'Experte',
    
    // Languages Section
    language: 'Sprache',
    proficiency: 'Niveau',
    native: 'Muttersprache',
    fluent: 'Fließend',
    conversational: 'Konversation',
    basic: 'Grundkenntnisse',
    
    // CV Builder
    cvBuilder: 'Lebenslauf-Builder',
    preview: 'Vorschau',
    exportPDF: 'Als PDF exportieren',
    evaluate: 'Bewerten',
    saving: 'Speichern...',
    saved: 'Gespeichert',
    evaluating: 'Bewerten...',
    exporting: 'Exportieren...',
    exported: 'Exportiert',
    
    // Authentication
    signIn: 'Anmelden',
    signUp: 'Registrieren',
    password: 'Passwort',
    name: 'Name',
    createAccount: 'Konto erstellen',
    alreadyHaveAccount: 'Haben Sie bereits ein Konto?',
    dontHaveAccount: 'Haben Sie noch kein Konto?',
    
    // Messages
    loginRequired: 'Anmeldung erforderlich',
    mustSignIn: 'Sie müssen sich anmelden, um das Dashboard zu verwenden.',
    registrationFailed: 'Registrierung fehlgeschlagen',
    loginFailed: 'Anmeldung fehlgeschlagen',
    saveFailed: 'Speichern fehlgeschlagen',
    exportFailed: 'Export fehlgeschlagen',
    evaluationFailed: 'Bewertung fehlgeschlagen',
    
    // PDF Export
    downloadPDF: 'PDF herunterladen',
    pdfGenerated: 'Ihr Lebenslauf wurde als PDF heruntergeladen',
    
    // Form validation
    required: 'Dieses Feld ist erforderlich',
    invalidEmail: 'Bitte geben Sie eine gültige E-Mail ein',
    passwordTooShort: 'Passwort muss mindestens 6 Zeichen lang sein',
    nameRequired: 'Name ist erforderlich',
    
    // Additional keys
    overallScore: 'Gesamtbewertung',
    noEvaluation: 'Noch keine Bewertung',
    
    // New dashboard keys
    resume: 'Lebenslauf',
    coverLetter: 'Anschreiben',
    settings: 'Einstellungen',
    myAccount: 'Mein Konto',
    plansPricing: 'Pläne & Preise',
    myResumes: 'Meine Lebensläufe',
    newResume: 'Neuer Lebenslauf',
    creating: 'Erstellen...',
    pleaseWait: 'Bitte warten...',
    untitledCV: 'Unbenannter Lebenslauf',
    editedYesterday: 'Gestern bearbeitet',
    editedDaysAgo: 'Vor {days} Tagen bearbeitet',
    overall: 'Gesamt',
    download: 'Herunterladen',
    duplicate: 'Duplizieren',
    deleting: 'Löschen...',
    confirmDeleteCV: 'Sind Sie sicher, dass Sie diesen Lebenslauf löschen möchten?',
    deleteError: 'Lebenslauf konnte nicht gelöscht werden',
    duplicateError: 'Lebenslauf konnte nicht dupliziert werden',
    downloadFeatureComingSoon: 'Download-Funktion kommt bald',
    downloadError: 'Lebenslauf konnte nicht heruntergeladen werden',
    createCVError: 'Lebenslauf konnte nicht erstellt werden',
    tryAgain: 'Erneut versuchen',
    noCVsYet: 'Noch keine Lebensläufe',
  },
};

export const getTranslation = (lang: Language, key: keyof Translations): string => {
  return translations[lang][key] || key;
};
