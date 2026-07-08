import React from 'react';
import { Brain, Heart, Moon, Utensils, Activity, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import InfiniteCarousel from './InfiniteCarousel';
import { Language } from '../types';

interface GeneralHealthProps {
  language?: Language;
}

const LOCALIZED_DATA: Record<Language, {
  title: string;
  subtitle: string;
  topics: Array<{ title: string; desc: string }>;
  affirmations: string[];
  preventiveCare: string;
  annualCheckups: string;
  annualCheckupsDesc: string;
  checklistBtn: string;
  standardsTitle: string;
  standardsDesc: string;
  idealSleep: string;
  waterIntake: string;
  weeklyExercise: string;
}> = {
  en: {
    title: 'General Health',
    subtitle: 'Foundational wellness pillars aligned with WHO & NHS standards.',
    topics: [
      { title: 'Nutrition & Diet', desc: 'Balanced eating habits for long-term health.' },
      { title: 'Mental Wellness', desc: 'Strategies for stress management and focus.' },
      { title: 'Physical Activity', desc: 'Exercise routines for all fitness levels.' },
      { title: 'Sleep Science', desc: 'Optimizing your rest for peak performance.' }
    ],
    affirmations: [
      "My health is my greatest priority.",
      "I nourish my body with wholesome food.",
      "Every step I take brings me closer to wellness.",
      "I am grateful for my body's strength.",
      "I choose to be calm and centered.",
      "Consistency is the key to my health journey.",
      "I listen to my body's needs.",
      "Rest is a vital part of my productivity."
    ],
    preventiveCare: 'Preventive Care',
    annualCheckups: 'Annual Check-ups',
    annualCheckupsDesc: 'Regular screenings can detect issues early when they are most treatable. Schedule your yearly physical today.',
    checklistBtn: 'View Screening Checklist',
    standardsTitle: 'Evidence-Based Standards',
    standardsDesc: 'Our health recommendations are derived from globally recognized medical authorities including the World Health Organization (WHO), National Health Service (NHS), and the Ministry of Health and Family Welfare (MoHFW, India).',
    idealSleep: 'Ideal Sleep',
    waterIntake: 'Water Intake',
    weeklyExercise: 'Weekly Exercise'
  },
  te: {
    title: 'ఆరోగ్య సంరక్షణ',
    subtitle: 'WHO & NHS ప్రమాణాలకు అనుగుణంగా ప్రాథమిక ఆరోగ్య నియమాలు.',
    topics: [
      { title: 'పోషకాహారం & డైట్', desc: 'దీర్ఘకాలిక ఆరోగ్యం కోసం సమతుల్య ఆహారపు అలవాట్లు.' },
      { title: 'మానసిక ఆరోగ్యం', desc: 'ఒత్తిడి నిర్వహణ మరియు ఏకాగ్రత కోసం వ్యూహాలు.' },
      { title: 'శారీరక వ్యాయామం', desc: 'అన్ని ఫిట్‌నెస్ స్థాయిల కోసం వ్యాయామ దినచర్యలు.' },
      { title: 'నిద్ర విజ్ఞానం', desc: 'గరిష్ట పనితీరు కోసం మీ విశ్రాంతిని ఆప్టిమైజ్ చేసుకోండి.' }
    ],
    affirmations: [
      "నా ఆరోగ్యం నా మొదటి ప్రాధాన్యత.",
      "నేను నా శరీరానికి పౌష్టికాహారాన్ని అందిస్తాను.",
      "నేను వేసే ప్రతి అడుగు నన్ను ఆరోగ్యం వైపు నడిపిస్తుంది.",
      "నా శరీర బలానికి నేను కృతజ్ఞుడను.",
      "నేను ప్రశాంతంగా ఉండటానికి మొగ్గు చూపుతాను.",
      "స్థిరత్వమే నా ఆరోగ్య ప్రయాణానికి కీలకం.",
      "నేను నా శరీర అవసరాలను వింటాను.",
      "విశ్రాంతి నా ఉత్పాదకతలో ఒక ముఖ్యమైన భాగం."
    ],
    preventiveCare: 'ముందస్తు జాగ్రత్తలు',
    annualCheckups: 'వార్షిక తనిఖీలు',
    annualCheckupsDesc: 'క్రమం తప్పకుండా పరీక్షలు చేయించుకోవడం వల్ల సమస్యలను ముందుగానే గుర్తించవచ్చు. ఈరోజే మీ వార్షిక పరీక్షను షెడ్యూల్ చేయండి.',
    checklistBtn: 'స్క్రీనింగ్ చెక్‌లిస్ట్ చూడండి',
    standardsTitle: 'సాక్ష్య ఆధారిత ప్రమాణాలు',
    standardsDesc: 'మా ఆరోగ్య సిఫార్సులు ప్రపంచవ్యాప్తంగా గుర్తింపు పొందిన వైద్య సంస్థలైన ప్రపంచ ఆరోగ్య సంస్థ (WHO), నేషనల్ హెల్త్ సర్వీస్ (NHS), మరియు కుటుంబ సంక్షేమ మంత్రిత్వ శాఖ (MoHFW, భారతదేశం) నుండి తీసుకోబడ్డాయి.',
    idealSleep: 'ఆదర్శ నిద్ర',
    waterIntake: 'నీటి వినియోగం',
    weeklyExercise: 'వారపు వ్యాయామం'
  },
  hi: {
    title: 'सामान्य स्वास्थ्य',
    subtitle: 'डब्ल्यूएचओ और एनएचएस मानकों के अनुरूप बुनियादी स्वास्थ्य स्तंभ।',
    topics: [
      { title: 'पोषण और आहार', desc: 'दीर्घकालिक स्वास्थ्य के लिए संतुलित खान-पान की आदतें।' },
      { title: 'मानसिक कल्याण', desc: 'तनाव प्रबंधन और ध्यान केंद्रित करने की रणनीतियाँ।' },
      { title: 'शारीरिक गतिविधि', desc: 'सभी फिटनेस स्तरों के लिए व्यायाम दिनचर्या।' },
      { title: 'नींद विज्ञान', desc: 'सर्वोत्तम प्रदर्शन के लिए अपने आराम को अनुकूलित करना।' }
    ],
    affirmations: [
      "मेरा स्वास्थ्य मेरी सबसे बड़ी प्राथमिकता है।",
      "मैं अपने शरीर को पौष्टिक भोजन से पोषित करता हूँ।",
      "मेरा हर कदम मुझे कल्याण के करीब लाता है।",
      "मैं अपने शरीर की ताकत के लिए आभारी हूँ।",
      "मैं शांत और केंद्रित रहने का विकल्प चुनता हूँ।",
      "निरंतरता मेरी स्वास्थ्य यात्रा की कुंजी है।",
      "मैं अपने शरीर की आवश्यकताओं को सुनता हूँ।",
      "विश्राम मेरी उत्पादकता का एक महत्वपूर्ण हिस्सा है।"
    ],
    preventiveCare: 'निवारक देखभाल',
    annualCheckups: 'वार्षिक जांच',
    annualCheckupsDesc: 'नियमित जांच से समस्याओं का जल्द पता चल सकता है जब वे सबसे अधिक इलाज योग्य होती हैं। आज ही अपनी वार्षिक शारीरिक जांच निर्धारित करें।',
    checklistBtn: 'स्क्रीनिंग चेकलिस्ट देखें',
    standardsTitle: 'साक्ष्य-आधारित मानक',
    standardsDesc: 'हमारी स्वास्थ्य सिफारिशें विश्व स्वास्थ्य संगठन (WHO), राष्ट्रीय स्वास्थ्य सेवा (NHS) और स्वास्थ्य एवं परिवार कल्याण मंत्रालय (MoHFW, भारत) सहित वैश्विक स्तर पर मान्यता प्राप्त चिकित्सा अधिकारियों से ली गई हैं।',
    idealSleep: 'आदर्श नींद',
    waterIntake: 'पानी का सेवन',
    weeklyExercise: 'साप्ताहिक व्यायाम'
  },
  es: {
    title: 'Salud General',
    subtitle: 'Pilares fundamentales del bienestar alineados con los estándares de la OMS y el NHS.',
    topics: [
      { title: 'Nutrición y Dieta', desc: 'Hábitos alimenticios equilibrados para la salud a largo plazo.' },
      { title: 'Bienestar Mental', desc: 'Estrategias para el manejo del estrés y la concentración.' },
      { title: 'Actividad Física', desc: 'Rutinas de ejercicio para todos los niveles de condición física.' },
      { title: 'Ciencia del Sueño', desc: 'Optimizar el descanso para un rendimiento máximo.' }
    ],
    affirmations: [
      "Mi salud es mi mayor prioridad.",
      "Nutro mi cuerpo con alimentos sanos.",
      "Cada paso que doy me acerca al bienestar.",
      "Agradezco la fuerza de mi cuerpo.",
      "Elijo estar tranquilo y centrado.",
      "La constancia es la clave de mi viaje hacia la salud.",
      "Escucho las necesidades de mi cuerpo.",
      "El descanso es una parte vital de mi productividad."
    ],
    preventiveCare: 'Cuidado Preventivo',
    annualCheckups: 'Chequeos Anuales',
    annualCheckupsDesc: 'Las revisiones periódicas pueden detectar problemas a tiempo. Programe su examen físico anual hoy mismo.',
    checklistBtn: 'Ver Lista de Control',
    standardsTitle: 'Estándares Basados en Evidencia',
    standardsDesc: 'Nuestras recomendaciones de salud provienen de autoridades médicas reconocidas mundialmente, como la Organización Mundial de la Salud (OMS), el Servicio Nacional de Salud (NHS) y el Ministerio de Salud y Bienestar Familiar (MoHFW, India).',
    idealSleep: 'Sueño Ideal',
    waterIntake: 'Consumo de Agua',
    weeklyExercise: 'Ejercicio Semanal'
  },
  fr: {
    title: 'Santé Générale',
    subtitle: 'Piliers du bien-être alignés sur les normes de l\'OMS et du NHS.',
    topics: [
      { title: 'Nutrition et Régime', desc: 'Habitudes alimentaires équilibrées pour une santé à long terme.' },
      { title: 'Bien-être Mental', desc: 'Stratégies de gestion du stress et de concentration.' },
      { title: 'Activité Physique', desc: 'Exercices adaptés à tous les niveaux.' },
      { title: 'Science du Sommeil', desc: 'Optimiser le repos pour des performances maximales.' }
    ],
    affirmations: [
      "Ma santé est ma priorité absolue.",
      "Je nourris mon corps avec des aliments sains.",
      "Chaque pas me rapproche du bien-être.",
      "Je suis reconnaissant pour la force de mon corps.",
      "Je choisis de rester calme et centré.",
      "La régularité est la clé de mon parcours santé.",
      "J'écoute les besoins de mon corps.",
      "Le repos est essentiel à ma productivité."
    ],
    preventiveCare: 'Soins Préventifs',
    annualCheckups: 'Bilan Annuel',
    annualCheckupsDesc: 'Des examens réguliers permettent de détecter les problèmes tôt. Planifiez votre visite annuelle dès aujourd\'hui.',
    checklistBtn: 'Voir la Liste de Contrôle',
    standardsTitle: 'Normes Fondées sur des Preuves',
    standardsDesc: 'Nos recommandations de santé proviennent d\'autorités médicales reconnues mondialement, notamment l\'Organisation mondiale de la santé (OMS), le National Health Service (NHS) et le ministère de la Santé et de la Protection de la famille (MoHFW, Inde).',
    idealSleep: 'Sommeil Idéal',
    waterIntake: 'Apport en Eau',
    weeklyExercise: 'Exercice Hebdomadaire'
  },
  ta: {
    title: 'பொது சுகாதாரம்',
    subtitle: 'WHO & NHS தரநிலைகளுடன் சீரமைக்கப்பட்ட அடிப்படை ஆரோக்கிய தூண்கள்.',
    topics: [
      { title: 'ஊட்டச்சத்து & உணவுமுறை', desc: 'நீண்ட கால ஆரோக்கியத்திற்கான சமச்சீரான உணவுப் பழக்கம்.' },
      { title: 'மனநலம்', desc: 'மன அழுத்த மேலாண்மை மற்றும் கவனத்திற்கான உத்திகள்.' },
      { title: 'உடற்பயிற்சி', desc: 'அனைத்து உடற்தகுதி நிலைகளுக்கான உடற்பயிற்சி நடைமுறைகள்.' },
      { title: 'உறக்க அறிவியல்', desc: 'அதிகபட்ச செயல்திறனுக்காக உங்கள் ஓய்வை மேம்படுத்துதல்.' }
    ],
    affirmations: [
      "என் ஆரோக்கியமே என் முக்கிய முன்னுரிமை.",
      "சத்தான உணவுகளால் என் உடலை வளர்க்கிறேன்.",
      "நான் வைக்கும் ஒவ்வொரு அடியும் ஆரோக்கியத்தை நோக்கி நகர்த்துகிறது.",
      "என் உடலின் வலிமைக்கு நன்றி கூறுகிறேன்.",
      "அமைதியாகவும் ஒருமுகப்பட்டும் இருக்க தேர்வு செய்கிறேன்.",
      "ஆரோக்கியப் பயணத்தில் தொடர்ச்சி தான் முக்கியம்.",
      "என் உடலின் தேவைகளைக் கேட்கிறேன்.",
      "ஓய்வு என் உற்பத்தித்திறனின் ஒரு முக்கிய அங்கமாகும்."
    ],
    preventiveCare: 'தடுப்பு பராமரிப்பு',
    annualCheckups: 'ஆண்டு மருத்துவ பரிசோதனை',
    annualCheckupsDesc: 'வழக்கமான பரிசோதனைகள் மூலம் ஆரோக்கிய பிரச்சனைகளை ஆரம்பத்திலேயே கண்டறியலாம். உங்கள் ஆண்டு பரிசோதனையை இன்றே திட்டமிடுங்கள்.',
    checklistBtn: 'பரிசோதனை பட்டியலை காண்க',
    standardsTitle: 'ஆதார அடிப்படையிலான தரநிலைகள்',
    standardsDesc: 'உலக சுகாதார நிறுவனம் (WHO), தேசிய சுகாதார சேவை (NHS) மற்றும் சுகாதார மற்றும் குடும்ப நல அமைச்சகம் (MoHFW, இந்தியா) உட்பட உலகளவில் அங்கீகரிக்கப்பட்ட மருத்துவ அதிகாரிகளிடமிருந்து எங்கள் சுகாதார பரிந்துரைகள் பெறப்படுகின்றன.',
    idealSleep: 'சரியான உறக்கம்',
    waterIntake: 'நீர் உட்கொள்ளல்',
    weeklyExercise: 'வாராந்திர உடற்பயிற்சி'
  },
  bn: {
    title: 'সাধারণ স্বাস্থ্য',
    subtitle: 'WHO এবং NHS মানদণ্ডের সাথে সামঞ্জস্যপূর্ণ মৌলিক স্বাস্থ্য স্তম্ভ।',
    topics: [
      { title: 'পুষ্টি ও খাদ্য', desc: 'দীর্ঘমেয়াদী স্বাস্থ্যের জন্য সুষম খাদ্যভ্যাস।' },
      { title: 'মানসিক সুস্থতা', desc: 'মানসিক চাপ নিয়ন্ত্রণ এবং মনোযোগের কৌশল।' },
      { title: 'শারীরিক ক্রিয়াকলাপ', desc: 'সব স্তরের জন্য ব্যায়ামের রুটিন।' },
      { title: 'ঘুমের বিজ্ঞান', desc: 'সেরা কর্মক্ষমতার জন্য আপনার বিশ্রাম উন্নত করা।' }
    ],
    affirmations: [
      "আমার স্বাস্থ্যই আমার সবচেয়ে বড় অগ্রাধিকার।",
      "আমি আমার শরীরকে পুষ্টিকর খাবার দিয়ে পুষ্ট করি।",
      "আমার নেওয়া প্রতিটি পদক্ষেপ আমাকে সুস্থতার কাছাকাছি নিয়ে যায়।",
      "আমি আমার শরীরের শক্তির জন্য কৃতজ্ঞ।",
      "আমি শান্ত এবং কেন্দ্রীভূত থাকা বেছে নিই।",
      "স্থিরতাই আমার স্বাস্থ্য যাত্রার মূল চাবিকাঠি।",
      "আমি আমার শরীরের কথা শুনি।",
      "বিশ্রাম আমার উৎপাদনশীলতার একটি গুরুত্বপূর্ণ অংশ।"
    ],
    preventiveCare: 'প্রতিরোধমূলক যত্ন',
    annualCheckups: 'বার্ষিক পরীক্ষা',
    annualCheckupsDesc: 'নিয়মিত স্ক্রীনিংয়ের মাধ্যমে সমস্যাগুলি প্রথম দিকেই সনাক্ত করা সম্ভব। আজই আপনার বার্ষিক শারীরিক পরীক্ষা নির্ধারণ করুন।',
    checklistBtn: 'স্ক্রীনিং চেকলিস্ট দেখুন',
    standardsTitle: 'প্রমাণ-ভিত্তিক মানদণ্ড',
    standardsDesc: 'আমাদের স্বাস্থ্য সম্পর্কিত সুপারিশগুলি বিশ্ব স্বাস্থ্য সংস্থা (WHO), জাতীয় স্বাস্থ্য পরিষেবা (NHS), এবং স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রক (MoHFW, ভারত) সহ বিশ্বব্যাপী স্বীকৃত চিকিৎসা কর্তৃপক্ষ থেকে নেওয়া হয়েছে।',
    idealSleep: 'আদর্শ ঘুম',
    waterIntake: 'জল গ্রহণ',
    weeklyExercise: 'সাপ্তাহিক ব্যায়াম'
  },
  ml: {
    title: 'പൊതുജനാരോഗ്യം',
    subtitle: 'WHO, NHS മാനദണ്ഡങ്ങളുമായി പൊരുത്തപ്പെടുന്ന ആരോഗ്യ സ്തംഭങ്ങൾ.',
    topics: [
      { title: 'പോഷകാഹാരവും ഭക്ഷണക്രമവും', desc: 'ദീർഘകാല ആരോഗ്യത്തിനായി സമീകൃതാഹാരം ശീലമാക്കുക.' },
      { title: 'മാനസികാരോഗ്യം', desc: 'മാനസിക സമ്മർദ്ദം കുറയ്ക്കുന്നതിനും ശ്രദ്ധ കേന്ദ്രീകരിക്കുന്നതിനുമുള്ള വഴികൾ.' },
      { title: 'ശാരീരിക വ്യായാമം', desc: 'എല്ലാവർക്കും അനുയോജ്യമായ വ്യായാമമുറകൾ.' },
      { title: 'ഉറക്കത്തിന്റെ പ്രാധാന്യം', desc: 'മികച്ച പ്രവർത്തനക്ഷമതയ്ക്കായി ഉറക്കം മെച്ചപ്പെടുത്തുക.' }
    ],
    affirmations: [
      "എന്റെ ആരോഗ്യമാണ് എന്റെ ഏറ്റവും വലിയ മുൻഗണന.",
      "ഞാൻ എന്റെ ശരീരത്തിന് പോഷകഗുണമുള്ള ആഹാരം നൽകുന്നു.",
      "ഓരോ ചുവടും എന്നെ ആരോഗ്യത്തിലേക്ക് നയിക്കുന്നു.",
      "ശരീരത്തിന്റെ കരുത്തിന് ഞാൻ നന്ദിയുള്ളവനാണ്.",
      "ശാന്തതയോടെയും ശ്രദ്ധയോടെയും ഇരിക്കാൻ ഞാൻ ആഗ്രഹിക്കുന്നു.",
      "തുടർച്ചയായ പരിശ്രമമാണ് എന്റെ ആരോഗ്യയാത്രയുടെ വിജയം.",
      "ശരീരത്തിന്റെ ആവശ്യങ്ങൾ ഞാൻ മനസ്സിലാക്കുന്നു.",
      "വിശ്രമം എന്റെ ഉൽപ്പാദനക്ഷമതയുടെ പ്രധാന ഭാഗമാണ്."
    ],
    preventiveCare: 'രോഗപ്രതിരോധ പരിചരണം',
    annualCheckups: 'വാർഷിക പരിശോധന',
    annualCheckupsDesc: 'പതിവായ പരിശോധനകൾ രോഗങ്ങൾ നേരത്തെ കണ്ടെത്താൻ സഹായിക്കും. നിങ്ങളുടെ വാർഷിക പരിശോധന ഇന്നുതന്നെ നിശ്ചയിക്കുക.',
    checklistBtn: 'പരിശോധനാ പട്ടിക കാണുക',
    standardsTitle: 'ശാസ്ത്രീയ മാനദണ്ഡങ്ങൾ',
    standardsDesc: 'ലോകാരോഗ്യ സംഘടന (WHO), നാഷണൽ ഹെൽത്ത് സർവീസ് (NHS), ആരോഗ്യ കുടുംബക്ഷേമ മന്ത്രാലയം (MoHFW, ഇന്ത്യ) എന്നിവയുൾപ്പെടെ ആഗോളതലത്തിൽ അംഗീകരിക്കപ്പെട്ട ആരോഗ്യ സംഘടനകളുടെ നിർദ്ദേശങ്ങളെ അടിസ്ഥാനമാക്കിയാണ് വിവരങ്ങൾ നൽകുന്നത്.',
    idealSleep: 'ഉചിതമായ ഉറക്കം',
    waterIntake: 'വെള്ളം കുടിക്കുന്നത്',
    weeklyExercise: 'വാരത്തിലെ വ്യായാമം'
  },
  kn: {
    title: 'ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ',
    subtitle: 'WHO ಮತ್ತು NHS ಮಾನದಂಡಗಳಿಗೆ ಅನುಗುಣವಾಗಿರುವ ಆರೋಗ್ಯ ನಿಯಮಗಳು.',
    topics: [
      { title: 'ಪೌಷ್ಟಿಕಾಂಶ ಮತ್ತು ಆಹಾರ', desc: 'ದೀರ್ಘಕಾಲದ ಆರೋಗ್ಯಕ್ಕಾಗಿ ಸಮತೋಲಿತ ಆಹಾರ ಪದ್ಧತಿ.' },
      { title: 'ಮಾನಸಿಕ ಸ್ವಾಸ್ಥ್ಯ', desc: 'ಒತ್ತಡ ನಿರ್ವಹಣೆ ಮತ್ತು ಏಕಾಗ್ರತೆಗಾಗಿ ತಂತ್ರಗಳು.' },
      { title: 'ದೈಹಿಕ ಚಟುವಟಿಕೆ', desc: 'ಎಲ್ಲಾ ಹಂತದ ಫಿಟ್‌ನೆಸ್‌ಗಾಗಿ ವ್ಯಾಯಾಮ ಕ್ರಮಗಳು.' },
      { title: 'ನಿದ್ರೆಯ ವಿಜ್ಞಾನ', desc: 'ಉತ್ತಮ ಕಾರ್ಯಕ್ಷಮತೆಗಾಗಿ ನಿಮ್ಮ ನಿದ್ರೆಯನ್ನು ಉತ್ತಮಗೊಳಿಸಿ.' }
    ],
    affirmations: [
      "ನನ್ನ ಆರೋಗ್ಯವೇ ನನ್ನ ಮೊದಲ ಆದ್ಯತೆ.",
      "ನಾನು ನನ್ನದೇಹಕ್ಕೆ ಪೌಷ್ಟಿಕ ಆಹಾರವನ್ನು ನೀಡುತ್ತೇನೆ.",
      "ನಾನು ಇಡುವ ಪ್ರತಿ ಹೆಜ್ಜೆಯೂ ನನ್ನನ್ನು ಆರೋಗ್ಯದ ಕಡೆಗೆ ಕೊಂಡೊಯ್ಯುತ್ತದೆ.",
      "ನನ್ನ ದೇಹದ ಶಕ್ತಿಗಾಗಿ ನಾನು ಕೃತಜ್ಞನಾಗಿದ್ದೇನೆ.",
      "ನಾನು ಶಾಂತವಾಗಿ ಮತ್ತು ಕೇಂದ್ರೀಕೃತವಾಗಿರಲು ಬಯಸುತ್ತೇನೆ.",
      "ನಿರಂತರತೆಯೇ ನನ್ನ ಆರೋಗ್ಯ ಪ್ರಯಾಣದ ಪ್ರಮುಖ ಅಂಶ.",
      "ನಾನು ನನ್ನ ದೇಹದ ಅಗತ್ಯಗಳನ್ನು ಕೇಳುತ್ತೇನೆ.",
      "ವಿಶ್ರಾಂತಿ ನನ್ನ दिनನಿತ್ಯದ ಕೆಲಸದ ಪ್ರಮುಖ भागವಾಗಿದೆ."
    ],
    preventiveCare: 'ಮುನ್ನೆಚ್ಚರಿಕೆ కాళజి',
    annualCheckups: 'ವಾರ್ಷಿಕ ತಪಾಸಣೆ',
    annualCheckupsDesc: 'ನಿಯಮಿತ ತಪಾಸಣೆಗಳಿಂದ ಸಮಸ್ಯೆಗಳನ್ನು ಮೊದಲೇ ಪತ್ತೆಹಚ್ಚಬಹುದು. ಇಂದು ನಿಮ್ಮ ವಾರ್ಷಿಕ ತಪಾಸಣೆಯನ್ನು ನಿಗದಿಪಡಿಸಿ.',
    checklistBtn: 'ತಪಾಸಣೆ ಪಟ್ಟಿಯನ್ನು ನೋಡಿ',
    standardsTitle: 'ಆಧಾರಿತ ಪ್ರಮಾಣಗಳು',
    standardsDesc: 'ನಮ್ಮ ಆರೋಗ್ಯ ಶಿಫಾರಸುಗಳನ್ನು ವಿಶ್ವ ಆರೋಗ್ಯ ಸಂಸ್ಥೆ (WHO), ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಸೇವೆ (NHS) ಮತ್ತು ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಸಚಿವಾಲಯ (MoHFW, ಭಾರತ) ಒಳಗೊಂಡಂತೆ ಜಾಗತಿಕವಾಗಿ ಮಾನ್ಯತೆ ಪಡೆದ ವೈದ್ಯಕೀಯ ಸಂಸ್ಥೆಗಳಿಂದ ಪಡೆಯಲಾಗಿದೆ.',
    idealSleep: 'ಸೂಕ್ತ ನಿದ್ರೆ',
    waterIntake: 'ನೀರಿನ ಬಳಕೆ',
    weeklyExercise: 'ವಾರದ ವ್ಯಾಯಾಮ'
  },
  mr: {
    title: 'सामान्य आरोग्य',
    subtitle: 'WHO आणि NHS मानकांनुसार आरोग्याचे मूलभूत नियम.',
    topics: [
      { title: 'पोषण आणि आहार', desc: 'दीर्घकालीन आरोग्यासाठी संतुलित आहाराच्या सवयी.' },
      { title: 'मानसिक आरोग्य', desc: 'तणाव व्यवस्थापन आणि लक्ष केंद्रित करण्यासाठीचे मार्ग.' },
      { title: 'शारीरिक व्यायाम', desc: 'सर्व प्रकारच्या तंदुरुस्तीसाठी व्यायाम.' },
      { title: 'झोपेचे महत्त्व', desc: 'उत्तम कार्यक्षमतेसाठी झोप योग्य ठेवा.' }
    ],
    affirmations: [
      "माझे आरोग्य ही माझी सर्वात मोठी प्राथमिकता आहे.",
      "मी माझ्या शरीराला पौष्टिक अन्न देतो.",
      "माझे प्रत्येक पाऊल मला आरोग्याकडे घेऊन जाते.",
      "मी माझ्या शरीराच्या ताकदीसाठी कृतज्ञ आहे.",
      "मी शांत आणि केंद्रित राहणे पसंत करतो.",
      "सातत्य हा माझ्या आरोग्य प्रवासाचा मुख्य भाग आहे.",
      "मी माझ्या शरीराच्या गरजा ऐकतो.",
      "विश्रांती ही माझ्या कामाच्या कार्यक्षमतेचा महत्त्वाचा भाग आहे."
    ],
    preventiveCare: 'प्रतिबंधात्मक काळजी',
    annualCheckups: 'वार्षिक तपासणी',
    annualCheckupsDesc: 'नियमित तपासणीमुळे आजार लवकर शोधता येतात. आजच तुमची वार्षिक तपासणी निश्चित करा.',
    checklistBtn: 'तपासणी सूची पहा',
    standardsTitle: 'वैज्ञानिक मानके',
    standardsDesc: 'आमच्या आरोग्याविषयीच्या शिफारसी जागतिक आरोग्य संघटना (WHO), राष्ट्रीय आरोग्य सेवा (NHS), आणि आरोग्य व कुटुंब कल्याण मंत्रालय (MoHFW, भारत) या जागतिक स्तरावर मान्यताप्राप्त संस्थांवर आधारित आहेत.',
    idealSleep: 'योग्य झोप',
    waterIntake: 'पाण्याचे सेवन',
    weeklyExercise: 'साप्ताहिक व्यायाम'
  },
  gu: {
    title: 'સામાન્ય સ્વાસ્થ્ય',
    subtitle: 'WHO અને NHS ધોરણોને અનુરૂપ સામાન્ય સ્વાસ્થ્યના નિયમો.',
    topics: [
      { title: 'પોષણ અને આહાર', desc: 'લાંબા ગાળાના સ્વાસ્થ્ય માટે સંતુલિત આહારની ટેવ.' },
      { title: 'માનસિક તંદુરસ્તી', desc: 'તણાવ મુક્તિ અને એકાગ્રતા માટેની પદ્ધતિઓ.' },
      { title: 'शારીરિક પ્રવૃત્તિ', desc: 'દરેક પ્રકારની કસરત.' },
      { title: 'ઊંઘનું વિજ્ઞાન', desc: 'શ્રેષ્ઠ પ્રદર્શન માટે તમારી ઊંઘને સુધારો.' }
    ],
    affirmations: [
      "મારું સ્વાસ્થ્ય એ મારી સૌથી મોટી પ્રાથમિકતા છે.",
      "હું મારા શરીરને પૌષ્ટિક આહાર આપું છું.",
      "મારું દરેક પગલું મને તંદુરસ્તી તરફ દોરી જાય છે.",
      "હું મારા શરીરની શક્તિ માટે આભારી છું.",
      "હું શાંત અને કેન્દ્રિત રહેવાનું પસંદ કરું છું.",
      "નિયમિતતા એ મારી સ્વાસ્થ્ય યાત્રાની ચાવી છે.",
      "હું મારા શરીરની જરૂરિયાતોને સાંભળું છું.",
      "આરામ એ મારી કાર્યક્ષમતાનો મહત્વનો ભાગ છે."
    ],
    preventiveCare: 'નવારાત્મક સંભાળ',
    annualCheckups: 'વાર્ષિક તપાસ',
    annualCheckupsDesc: 'નિયમિત તપાસથી બીમારીઓ વહેલી શોધી શકાય છે. આજે જ તમારી વાર્ષિક શારીરિક તપાસ નક્કી કરો.',
    checklistBtn: 'તપાસ યાદી જુઓ',
    standardsTitle: 'વૈજ્ઞાનિક ધોરણો',
    standardsDesc: 'અમારી સ્વાસ્થ્ય સંબંધી ભલામણો વિશ્વ આરોગ્ય સંસ્થા (WHO), રાષ્ટ્રીય આરોગ્ય સેવા (NHS) અને આરોગ્ય અને પરિવાર કલ્યાણ મંત્રાલય (MoHFW, ભારત) સહિત વૈશ્વિક સ્તરે માન્યતા પ્રાપ્ત તબીબી સંસ્થાઓમાંથી મેળવવામાં આવી છે.',
    idealSleep: 'આદર્શ ઊંઘ',
    waterIntake: 'પાણીનો વપરાશ',
    weeklyExercise: 'સાપ્તાહિક કસરત'
  }
};

const ICONS = [
  <Utensils className="text-orange-500" />,
  <Brain className="text-purple-500" />,
  <Activity className="text-blue-500" />,
  <Moon className="text-indigo-500" />
];

const COLORS = [
  'bg-orange-50',
  'bg-purple-50',
  'bg-blue-50',
  'bg-indigo-50'
];

export default function GeneralHealth({ language = 'en' }: GeneralHealthProps) {
  const data = LOCALIZED_DATA[language] || LOCALIZED_DATA.en;

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-xl shadow-brand-500/5 border border-brand-100/50 overflow-hidden">
      <div className="px-8 py-6 border-b border-brand-50 bg-brand-50/30">
        <h2 className="font-display font-bold text-2xl text-slate-800 flex items-center gap-3">
          <Sparkles className="text-brand-600" />
          {data.title}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{data.subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        {/* Affirmations Carousel */}
        <div className="py-2 border-y border-slate-50">
          <InfiniteCarousel 
            speed={50}
            items={data.affirmations.map((text, i) => (
              <div key={`affirmation-${i}`} className="flex items-center gap-2 px-4 py-1">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{text}</span>
              </div>
            ))}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {data.topics.map((topic, i) => (
            <div key={topic.title} className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/5 transition-all group cursor-pointer hover-lift">
              <div className={`w-14 h-14 rounded-2xl ${COLORS[i % COLORS.length]} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
                {React.isValidElement(ICONS[i % ICONS.length]) ? React.cloneElement(ICONS[i % ICONS.length] as React.ReactElement<any>, { size: 28 }) : ICONS[i % ICONS.length]}
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800">{topic.title}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">{topic.desc}</p>
            </div>
          ))}
        </div>

        <section className="space-y-6">
          <h3 className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
            <Heart size={20} className="text-rose-500" />
            {data.preventiveCare}
          </h3>
          <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h4 className="text-xl font-bold">{data.annualCheckups}</h4>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                {data.annualCheckupsDesc}
              </p>
              <button className="px-6 py-3 bg-brand-600 hover:bg-brand-700 rounded-xl text-sm font-bold transition-colors">
                {data.checklistBtn}
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          </div>
        </section>

        <section className="p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 flex items-start gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-emerald-900">{data.standardsTitle}</h4>
            <p className="text-sm text-emerald-700 leading-relaxed">
              {data.standardsDesc}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 text-center hover:bg-white transition-colors group">
            <div className="text-3xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">8h</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{data.idealSleep}</div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 text-center hover:bg-white transition-colors group">
            <div className="text-3xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">2.5L</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{data.waterIntake}</div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 text-center hover:bg-white transition-colors group">
            <div className="text-3xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">150m</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{data.weeklyExercise}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
