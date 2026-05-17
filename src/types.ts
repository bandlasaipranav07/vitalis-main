export type View = 'dashboard' | 'assistant' | 'symptom-checker' | 'medication' | 'emergency' | 'general-health' | 'legal-resources' | 'trust-privacy' | 'premium-upgrade' | 'help' | 'medical-history';

export type UserTier = 'free' | 'premium';

export type Language = 'en' | 'hi' | 'te' | 'ta' | 'bn' | 'ml' | 'kn' | 'mr' | 'gu' | 'es' | 'fr';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
] as const;

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isEmergency?: boolean;
}

export interface ClinicalSummary {
  symptoms: string[];
  duration: string;
  severity: string;
  triageCategory: string;
  keyConcerns: string[];
  suggestedQuestionsForDoctor: string[];
}

export interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: 'nutrition' | 'exercise' | 'mental-health' | 'sleep';
}
