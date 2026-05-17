import { Language } from './types';

export interface Translations {
  welcome: string;
  assistant: string;
  dashboard: string;
  symptomChecker: string;
  medication: string;
  trustPrivacy: string;
  logout: string;
  premium: string;
  healthId: string;
  nextStep: string;
  askAnything: string;
  analyzing: string;
  emergencyWarning: string;
  searchMedication: string;
  guestUser: string;
  continueAsGuest: string;
  signIn: string;
  aiHealthCompanion: string;
  language: string;
  medicalHistory: string;
  medicalNotice?: string;
  medicalNoticeText?: string;
  vitalStatus?: string;
  heartRate?: string;
  dailySteps?: string;
  wellnessTips?: string;
  quickAccess?: string;
  sos?: string;
  wellness?: string;
  legal?: string;
  privacyHub?: string;
  technicalHelp?: string;
}

export const translations: Record<Language, Partial<Translations>> = {
  en: {
    welcome: "Welcome",
    assistant: "Assistant",
    dashboard: "Dashboard",
    symptomChecker: "Symptom Checker",
    medication: "Medication",
    trustPrivacy: "Trust & Privacy",
    logout: "Logout",
    premium: "Premium",
    healthId: "Health ID",
    nextStep: "Recommended Next Step",
    askAnything: "Ask anything about your health...",
    analyzing: "Analyzing...",
    emergencyWarning: "EMERGENCY: Call 102/108 immediately if life-threatening.",
    searchMedication: "Search medication status...",
    guestUser: "Guest User",
    continueAsGuest: "Continue as Guest",
    signIn: "Sign In",
    aiHealthCompanion: "Your AI health companion.",
    language: "Language",
    medicalHistory: "Medical History"
  },
  hi: {
    welcome: "स्वागत है",
    assistant: "सहायक",
    dashboard: "डैशबोर्ड",
    symptomChecker: "लक्षण जांचक",
    medication: "दवा",
    trustPrivacy: "विश्वास और गोपनीयता",
    logout: "लॉगआउट",
    premium: "प्रीमियम",
    healthId: "स्वास्थ्य आईडी",
    nextStep: "अनुशंसित अगला कदम",
    askAnything: "अपने स्वास्थ्य के बारे में कुछ भी पूछें...",
    analyzing: "विश्लेषण कर रहा है...",
    emergencyWarning: "आपातकाल: जीवन के लिए खतरा होने पर तुरंत 102/108 पर कॉल करें।",
    searchMedication: "दवा की स्थिति खोजें...",
    guestUser: "अतिथि उपयोगकर्ता",
    continueAsGuest: "अतिथि के रूप में जारी रखें",
    signIn: "साइन इन करें",
    aiHealthCompanion: "आपका एआई स्वास्थ्य साथी।",
    language: "भाषा"
  },
  te: {
    welcome: "స్వాగతం",
    assistant: "అసిస్టెంట్",
    dashboard: "డ్యాష్‌బోర్డ్",
    symptomChecker: "లక్షణాల తనిఖీ",
    medication: "మందులు",
    trustPrivacy: "నమ్మకం & గోప్యత",
    logout: "లాగ్ అవుట్",
    premium: "ప్రీమియం",
    healthId: "హెల్త్ ఐడి",
    nextStep: "సిఫార్సు చేయబడిన తదుపరి దశ",
    askAnything: "మీ ఆరోగ్యం గురించి ఏదైనా అడగండి...",
    analyzing: "విశ్లేషిస్తోంది...",
    emergencyWarning: "అత్యవసర పరిస్థితి: ప్రాణాపాయం ఉంటే వెంటనే 102/108 కి కాల్ చేయండి.",
    searchMedication: "మందుల స్థితిని శోధించండి...",
    guestUser: "అతిథి వినియోగదారు",
    continueAsGuest: "అతిథిగా కొనసాగండి",
    signIn: "సైన్ ఇన్",
    aiHealthCompanion: "మీ AI ఆరోగ్య తోడు.",
    language: "భాష",
    medicalHistory: "వైద్య చరిత్ర",
    wellness: "వెల్నెస్",
    sos: "SOS",
    legal: "చట్టపరమైన",
    privacyHub: "గోప్యతా హబ్",
    technicalHelp: "సాంకేతిక సహాయం"
  },
  es: {
    welcome: "Bienvenido",
    assistant: "Asistente",
    dashboard: "Panel",
    symptomChecker: "Verificador de Síntomas",
    medication: "Medicación",
    trustPrivacy: "Confianza y Privacidad",
    logout: "Cerrar sesión",
    premium: "Premium",
    healthId: "ID de Salud",
    nextStep: "Siguiente paso recomendado",
    askAnything: "Pregunta cualquier cosa sobre tu salud...",
    analyzing: "Analizando...",
    emergencyWarning: "EMERGENCIA: Llame al 102/108 inmediatamente si hay peligro de muerte.",
    searchMedication: "Buscar estado de medicación...",
    guestUser: "Usuario Invitado",
    continueAsGuest: "Continuar como Invitado",
    signIn: "Iniciar Sesión",
    aiHealthCompanion: "Tu compañero de salud AI.",
    language: "Idioma"
  },
  fr: {
    welcome: "Bienvenue",
    assistant: "Assistant",
    dashboard: "Tableau de bord",
    symptomChecker: "Vérificateur de symptômes",
    medication: "Médicament",
    trustPrivacy: "Confiance & Confidentialité",
    logout: "Déconnexion",
    premium: "Premium",
    healthId: "ID Santé",
    nextStep: "Étape suivante recommandée",
    askAnything: "Posez n'importe quelle question sur votre santé...",
    analyzing: "Analyse en cours...",
    emergencyWarning: "URGENCE : Appelez immédiatement le 102/108 en cas de danger de mort.",
    searchMedication: "Rechercher l'état du médicament...",
    guestUser: "Utilisateur Invité",
    continueAsGuest: "Continuer en tant qu'invité",
    signIn: "Se connecter",
    aiHealthCompanion: "Votre compagnon de santé IA.",
    language: "Langue"
  },
  ta: {},
  bn: {},
  ml: {},
  kn: {},
  mr: {},
  gu: {}
};

export function getTranslations(lang: Language): Translations {
  return {
    ...translations.en,
    ...(translations[lang] || {}),
  } as Translations;
}
