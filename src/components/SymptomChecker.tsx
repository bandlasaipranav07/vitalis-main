import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Search, ChevronRight, AlertCircle, AlertTriangle, CheckCircle2, Plus, X, Activity, Thermometer, Clock, Loader2, Info, User, RotateCcw, FileText, Crown } from 'lucide-react';
import { cn } from '../utils';
import { gemini } from '../services/gemini';
import { UserTier, Language } from '../types';
import { getTranslations } from '../translations';
import { useToast } from '../contexts/ToastContext';

const SYMPTOM_GROUPS = {
  'General': ['Fever', 'Chills', 'Fatigue', 'Weakness', 'Weight Loss', 'Weight Gain', 'Night Sweats', 'Body Ache'],
  'Respiratory': ['Cough', 'Shortness of Breath', 'Sore Throat', 'Runny Nose', 'Sneezing', 'Wheezing', 'Chest Tightness', 'Hoarseness', 'Nasal Congestion'],
  'Neurological': ['Headache', 'Dizziness', 'Confusion', 'Numbness', 'Tingling', 'Tremors', 'Fainting', 'Seizures', 'Memory Loss', 'Balance Issues'],
  'Digestive': ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Stomach Pain', 'Bloating', 'Heartburn', 'Loss of Appetite', 'Acid Reflux'],
  'Musculoskeletal': ['Muscle Pain', 'Joint Pain', 'Back Pain', 'Neck Pain', 'Stiff Neck', 'Swelling', 'Muscle Cramps'],
  'Skin & Eyes': ['Skin Rash', 'Itching', 'Blurred Vision', 'Red Eyes', 'Eye Pain', 'Skin Peeling', 'Dry Skin'],
  'Cardiovascular': ['Chest Pain', 'Palpitations', 'Cold Hands/Feet', 'Rapid Heartbeat'],
  'Other': ['Anxiety', 'Depression', 'Insomnia', 'Frequent Urination', 'Painful Urination', 'Difficulty Swallowing', 'Ear Pain']
};

const COMMON_SYMPTOMS = Object.values(SYMPTOM_GROUPS).flat();

const getLocalizedGroup = (group: string, lang: Language) => {
  const groups: Record<string, Partial<Record<Language, string>>> = {
    'General': { hi: 'सामान्य', te: 'సాధారణ', ta: 'பொதுவானவை', bn: 'সাধারণ', ml: 'പൊതുവായ', kn: 'ಸಾಮಾನ್ಯ', mr: 'सामान्य', gu: 'સામાન્ય', es: 'General', fr: 'Général' },
    'Respiratory': { hi: 'श्वसन', te: 'శ్వాసకోశ', ta: 'சுவாச', bn: 'শ্বাসযন্ত্রের', ml: 'ശ്വസന', kn: 'ಉಸಿರಾಟ', mr: 'श्वसन', gu: 'શ્વસન', es: 'Respiratorio', fr: 'Respiratoire' },
    'Neurological': { hi: 'तंत्रिका संबंधी', te: 'నాడీ సంబంధిత', ta: 'நரம்பியல்', bn: 'স্নায়বিক', ml: 'ന്യൂറോളജിക്കൽ', kn: 'ನರವೈಜ್ಞಾನಿಕ', mr: 'मज्जासंस्था', gu: 'ન્યુરોલોજીકલ', es: 'Neurológico', fr: 'Neurologique' },
    'Digestive': { hi: 'पाचन', te: 'జీర్ణ', ta: 'செரிமான', bn: 'পাচক', ml: 'ദഹന', kn: 'ಜೀರ್ಣಕಾರಿ', mr: 'पचन', gu: 'પાચન', es: 'Digestivo', fr: 'Digestif' },
    'Musculoskeletal': { hi: 'मांसपेशियों और हड्डियों का', te: 'కండరాల మరియు ఎముకల', ta: 'தசை மற்றும் எலும்பு', bn: 'পেশীবহুল', ml: 'മസ്കുലോസ്കെലെറ്റൽ', kn: 'ಸ್ನಾಯು ಮತ್ತು ಮೂಳೆ', mr: 'स्नायू आणि हाडे', gu: 'સ્નાયુ અને હાડકાં', es: 'Musculoesquelético', fr: 'Musculosquelettique' },
    'Skin & Eyes': { hi: 'त्वचा और आंखें', te: 'చర్మం & కళ్ళు', ta: 'தோல் & கண்கள்', bn: 'ত্বক এবং চোখ', ml: 'ചർമ്മവും കണ്ണുകളും', kn: 'ಚರ್ಮ & ಕಣ್ಣುಗಳು', mr: 'त्वचा आणि डोळे', gu: 'ત્વચા અને આંખો', es: 'Piel y Ojos', fr: 'Peau et Yeux' },
    'Cardiovascular': { hi: 'हृदय संबंधी', te: 'కార్డియోవాస్కులర్', ta: 'இதயவியல்', bn: 'কার্ডিওভাসকুলার', ml: 'ഹൃദയസംബന്ധമായ', kn: 'ಹೃದಯರಕ್ತನಾಳದ', mr: 'हृदय व रक्तवाहिन्यासंबंधी', gu: 'કાર્ડિયોવાસ્ક્યુલર', es: 'Cardiovascular', fr: 'Cardiovasculaire' },
    'Other': { hi: 'अन्य', te: 'ఇతర', ta: 'மற்றவை', bn: 'অন্যান্য', ml: 'മറ്റ്', kn: 'ಇತರೆ', mr: 'इतर', gu: 'અન્ય', es: 'Otro', fr: 'Autre' }
  };
  return groups[group]?.[lang] || group;
};

const getLocalizedSymptom = (symptom: string, lang: Language) => {
  const symptoms: Record<string, Partial<Record<Language, string>>> = {
    'Fever': { hi: 'बुखार', te: 'జ్వరం', ta: 'காய்ச்சல்', bn: 'জ্বর', ml: 'പനി', kn: 'ಜ್ವರ', mr: 'ताप', gu: 'તાવ', es: 'Fiebre', fr: 'Fièvre' },
    'Chills': { hi: 'ठंड लगना', te: 'చలి', ta: 'குளிர்', bn: 'ঠান্ডা লাগা', ml: 'കുളിര്', kn: 'ಚಳಿ', mr: 'थंडी', gu: 'ઠંડી', es: 'Escalofríos', fr: 'Frissons' },
    'Fatigue': { hi: 'थकान', te: 'అలసట', ta: 'சோர்வு', bn: 'ক্লান্তি', ml: 'ക്ഷീണം', kn: 'ಆಯಾಸ', mr: 'थकवा', gu: 'થાક', es: 'Fatiga', fr: 'Fatigue' },
    'Weakness': { hi: 'कमजोरी', te: 'బలహీనత', ta: 'பலவீனம்', bn: 'দুর্বলতা', ml: 'ബലഹീനത', kn: 'ದುರ್ಬಲತೆ', mr: 'अशक्तपणा', gu: 'નબળાઇ', es: 'Debilidad', fr: 'Faiblesse' },
    'Weight Loss': { hi: 'वजन कम होना', te: 'బరువు తగ్గడం', ta: 'எடை இழப்பு', bn: 'ওজন হ্রাস', ml: 'ഭാരം കുറയുക', kn: 'ತೂಕ ನಷ್ಟ', mr: 'वजन कमी होणे', gu: 'વજન ઘટાડવું', es: 'Pérdida de peso', fr: 'Perte de poids' },
    'Weight Gain': { hi: 'वजन बढ़ना', te: 'బరువు పెరగడం', ta: 'எடை அதிகரிப்பு', bn: 'ওজন বৃদ্ধি', ml: 'ഭാരം കൂടുക', kn: 'ತೂಕ ಹೆಚ್ಚಾಗುವುದು', mr: 'वजन वाढणे', gu: 'વજન વધવું', es: 'Aumento de peso', fr: 'Prise de poids' },
    'Night Sweats': { hi: 'रात में पसीना', te: 'రాత్రి చెమటలు', ta: 'இரவில் வியர்த்தல்', bn: 'রাতে ঘাম', ml: 'രാത്രിയിലെ വിയർപ്പ്', kn: 'ರಾತ್ರಿ ಬೆವರು', mr: 'रात्री घाम येणे', gu: 'રાત્રે પરસેવો', es: 'Sudores nocturnos', fr: 'Sueurs nocturnes' },
    'Body Ache': { hi: 'बदन दर्द', te: 'శరీర నొప్పి', ta: 'உடல் வலி', bn: 'গায়ে ব্যথা', ml: 'ശരീരവേദന', kn: 'ಮೈಕೈ ನೋವು', mr: 'अंगदुखी', gu: 'શરીરમાં દુખાવો', es: 'Dolor corporal', fr: 'Courbatures' },
    'Cough': { hi: 'खांसी', te: 'దగ్గు', ta: 'இருமல்', bn: 'কাশি', ml: 'ചുമ', kn: 'ಕೆಮ್ಮು', mr: 'खोकला', gu: 'ઉધરસ', es: 'Tos', fr: 'Toux' },
    'Shortness of Breath': { hi: 'सांस की तकलीफ', te: 'శ్వాస ఆడకపోవడం', ta: 'மூச்சுத் திணறல்', bn: 'শ্বাসকষ্ট', ml: 'ശ്വാസതടസ്സം', kn: 'ಉಸಿರಾಟದ ತೊಂದರೆ', mr: 'श्वास लागणे', gu: 'શ્વાસ લેવામાં તકલીફ', es: 'Falta de aire', fr: 'Essoufflement' },
    'Sore Throat': { hi: 'गले में खराश', te: 'గొంతు నొప్పి', ta: 'தொண்டை வலி', bn: 'গলা ব্যথা', ml: 'തൊണ്ട വേദന', kn: 'ಗಂಟಲು ನೋವು', mr: 'घसा खवखवणे', gu: 'ગળામાં દુખાવો', es: 'Dolor de garganta', fr: 'Mal de gorge' },
    'Runny Nose': { hi: 'बहती नाक', te: 'ముక్కు కారటం', ta: 'மூக்கு ஒழுகுதல்', bn: 'নাক দিয়ে জল পড়া', ml: 'മൂക്കൊലിപ്പ്', kn: 'ಮೂಗು ಸೋರುವಿಕೆ', mr: 'नाक गळणे', gu: 'વહેતું નાક', es: 'Secreción nasal', fr: 'Écoulement nasal' },
    'Sneezing': { hi: 'छींक आना', te: 'తుమ్ములు', ta: 'தும்மல்', bn: 'হাঁচি', ml: 'തുമ്മൽ', kn: 'ಸೀನು', mr: 'शिंका येणे', gu: 'છીંક આવવી', es: 'Estornudos', fr: 'Éternuements' },
    'Wheezing': { hi: 'घबराहट', te: 'ఉబ్బసం', ta: 'இளைப்பு', bn: 'হাঁপানি', ml: 'വലിവ്', kn: 'ಉಬ್ಬಸ', mr: 'धाप लागणे', gu: 'ઘરઘરાટી', es: 'Sibilancias', fr: 'Respiration sifflante' },
    'Chest Tightness': { hi: 'छाती में जकड़न', te: 'ఛాతీ బిగుతు', ta: 'நெஞ்சு இறுக்கம்', bn: 'বুকে চাপ', ml: 'നെഞ്ചെരിച്ചിൽ', kn: 'ಎದೆ ಬಿಗಿತ', mr: 'छातीत जडपणा', gu: 'છાતીમાં જકડાઈ જવું', es: 'Opresión en el pecho', fr: 'Oppression thoracique' },
    'Hoarseness': { hi: 'गला बैठना', te: 'బొంగురు గొంతు', ta: 'கரகரப்பான குரல்', bn: 'গলা ভাঙা', ml: 'ശബ്ദമടപ്പ്', kn: 'ಗಂಟಲು ಕಟ್ಟುವುದು', mr: 'आवाज बसणे', gu: 'ઘોઘરો અવાજ', es: 'Ronquera', fr: 'Enrouement' },
    'Nasal Congestion': { hi: 'नाक बंद', te: 'ముక్కు దిబ్బడ', ta: 'மூக்கடைப்பு', bn: 'নাক বন্ধ', ml: 'മൂക്കടപ്പ്', kn: 'ಮೂಗು ಕಟ್ಟುವುದು', mr: 'नाक बंद होणे', gu: 'નાક બંધ થવું', es: 'Congestión nasal', fr: 'Congestion nasale' },
    'Headache': { hi: 'सिरदर्द', te: 'తలనొప్పి', ta: 'தலைவலி', bn: 'মাথাব্যথা', ml: 'തലവേദന', kn: 'ತಲೆನೋವು', mr: 'डोकेदुखी', gu: 'માથાનો દુખાવો', es: 'Dolor de cabeza', fr: 'Maux de tête' },
    'Dizziness': { hi: 'चक्कर आना', te: 'తల తిరగడం', ta: 'தலைசுற்றல்', bn: 'মাথা ঘোরা', ml: 'തലകറക്കം', kn: 'ತಲೆತಿರುಗುವಿಕೆ', mr: 'चक्कर येणे', gu: 'ચક્કર આવવા', es: 'Mareos', fr: 'Vertiges' },
    'Confusion': { hi: 'भ्रम', te: 'గందరగోళం', ta: 'குழப்பம்', bn: 'বিভ্রান্তি', ml: 'ആശയക്കുഴപ്പം', kn: 'ಗೊಂದಲ', mr: 'गोंधळ', gu: 'મૂંઝવણ', es: 'Confusión', fr: 'Confusion' },
    'Numbness': { hi: 'सुन्न होना', te: 'తిమ్మిరి', ta: 'மரத்துப்போதல்', bn: 'অসাড়তা', ml: 'മരവിപ്പ്', kn: 'ಮರಗಟ್ಟುವಿಕೆ', mr: 'सुन्नपणा', gu: 'સુન્ન થઈ જવું', es: 'Entumecimiento', fr: 'Engourdissement' },
    'Tingling': { hi: 'झुनझुनी', te: 'జులజుల', ta: 'ஜிவ்வுதல்', bn: 'ঝিনঝিন করা', ml: 'തരിപ്പ്', kn: 'ಜುಮ್ಮೆನಿಸುವಿಕೆ', mr: 'मुंग्या येणे', gu: 'ઝણઝણાટી', es: 'Hormigueo', fr: 'Picotements' },
    'Tremors': { hi: 'कंपकंपी', te: 'వణుకు', ta: 'நடுக்கம்', bn: 'কাঁপুনি', ml: 'വിറയൽ', kn: 'ನಡುಕ', mr: 'थरथर', gu: 'ધ્રુજારી', es: 'Temblores', fr: 'Tremblements' },
    'Fainting': { hi: 'बेहोशी', te: 'మూర్ఛ', ta: 'மயக்கம்', bn: 'অজ্ঞান হওয়া', ml: 'ബോധക്ഷയം', kn: 'ಮೂರ್ಛೆ', mr: 'मूर्च्छा', gu: 'બેભાન થવું', es: 'Desmayo', fr: 'Évanouissement' },
    'Seizures': { hi: 'दौरे', te: 'ఫిట్స్', ta: 'வலிப்பு', bn: 'খিঁচুনি', ml: 'ഫിറ്റ്സ്', kn: 'ಮೂರ್ಛೆ ರೋಗ', mr: 'फेफरे', gu: 'આંચકી', es: 'Convulsiones', fr: 'Convulsions' },
    'Memory Loss': { hi: 'याददाश्त की कमी', te: 'జ్ఞాపకశక్తి కోల్పోవడం', ta: 'நினைவாற்றல் இழப்பு', bn: 'স্মৃতিশক্তি হ্রাস', ml: 'ഓർമ്മക്കുറവ്', kn: 'ನೆನಪಿನ ಶಕ್ತಿ ನಷ್ಟ', mr: 'स्मरणशक्ती कमी होणे', gu: 'યાદશક્તિ ગુમાવવી', es: 'Pérdida de memoria', fr: 'Perte de mémoire' },
    'Balance Issues': { hi: 'संतुलन की समस्या', te: 'సమతుల్యత సమస్యలు', ta: 'சமநிலை பிரச்சனைகள்', bn: 'ভারসাম্য সমস্যা', ml: 'സന്തുലിതാവസ്ഥ പ്രശ്നങ്ങൾ', kn: 'ಸಮತೋಲನ ಸಮಸ್ಯೆಗಳು', mr: 'तोल जाणे', gu: 'સંતુલન સમસ્યાઓ', es: 'Problemas de equilibrio', fr: 'Problèmes d\'équilibre' },
    'Nausea': { hi: 'मतली', te: 'వికారం', ta: 'குமட்டல்', bn: 'বমি ভাব', ml: 'ഓക്കാനം', kn: 'ವಾಕರಿಕೆ', mr: 'मळमळ', gu: 'ઉબકા', es: 'Náuseas', fr: 'Nausées' },
    'Vomiting': { hi: 'उल्टी', te: 'వాంతులు', ta: 'வாந்தி', bn: 'বমি', ml: 'ഛർദ്ദി', kn: 'ವಾಂತಿ', mr: 'उलट्या', gu: 'ઉલટી', es: 'Vómitos', fr: 'Vomissements' },
    'Diarrhea': { hi: 'दस्त', te: 'విరేచనాలు', ta: 'வயிற்றுப்போக்கு', bn: 'ডায়রিয়া', ml: 'അതിസാരം', kn: 'ಅತಿಸಾರ', mr: 'अतिसार', gu: 'ઝાડા', es: 'Diarrea', fr: 'Diarrhée' },
    'Constipation': { hi: 'कब्ज', te: 'మలబద్ధకం', ta: 'மலச்சிக்கல்', bn: 'কোষ্ঠকাঠিন্য', ml: 'മലബന്ധം', kn: 'ಮಲಬದ್ಧತೆ', mr: 'बद्धकोष्ठता', gu: 'કબજિયાત', es: 'Estreñimiento', fr: 'Constipation' },
    'Stomach Pain': { hi: 'पेट दर्द', te: 'కడుపు నొప్పి', ta: 'வயிற்று வலி', bn: 'পেট ব্যথা', ml: 'വയറുവേദന', kn: 'ಹೊಟ್ಟೆ ನೋವು', mr: 'पोटदुखी', gu: 'પેટનો દુખાવો', es: 'Dolor de estómago', fr: 'Maux d\'estomac' },
    'Bloating': { hi: 'पेट फूलना', te: 'ఉబ్బరం', ta: 'வயிறு உப்பசம்', bn: 'পেট ফোলা', ml: 'വയറു വീർക്കുക', kn: 'ಹೊಟ್ಟೆ ಉಬ್ಬರ', mr: 'पोट फुगणे', gu: 'પેટ ફૂલવું', es: 'Hinchazón', fr: 'Ballonnements' },
    'Heartburn': { hi: 'सीने में जलन', te: 'గుండెల్లో మంట', ta: 'நெஞ்செரிச்சல்', bn: 'বুকজ্বালা', ml: 'നെഞ്ചെരിച്ചിൽ', kn: 'ಎದೆಯುರಿ', mr: 'छातीत जळजळ', gu: 'છાતીમાં બળતરા', es: 'Acidez estomacal', fr: 'Brûlures d\'estomac' },
    'Loss of Appetite': { hi: 'भूख में कमी', te: 'ఆకలి లేకపోవడం', ta: 'பசியின்மை', bn: 'ক্ষুধা হ্রাস', ml: 'വിശപ്പില്ലായ്മ', kn: 'ಹಸಿವಾಗದಿರುವುದು', mr: 'भूक न लागणे', gu: 'ભૂખ ન લાગવી', es: 'Pérdida de apetito', fr: 'Perte d\'appétit' },
    'Acid Reflux': { hi: 'एसिड रिफ्लक्स', te: 'యాసిడ్ రిఫ్లక్స్', ta: 'அமில வீச்சு', bn: 'এসিড রিফ্লাক্স', ml: 'ആസിഡ് റിഫ്ലക്സ്', kn: 'ಆಸಿಡ್ ರಿಫ್ಲಕ್ಸ್', mr: 'आम्लपित्त', gu: 'એસિડ રિફ્લક્સ', es: 'Reflujo ácido', fr: 'Reflux gastrique' },
    'Muscle Pain': { hi: 'मांसपेशियों में दर्द', te: 'కండరాల నొప్పి', ta: 'தசை வலி', bn: 'পেশী ব্যথা', ml: 'പേശി വേദന', kn: 'ಸ್ನಾಯು ನೋವು', mr: 'स्नायू दुखणे', gu: 'સ્નાયુમાં દુખાવો', es: 'Dolor muscular', fr: 'Douleurs musculaires' },
    'Joint Pain': { hi: 'जोड़ों का दर्द', te: 'కీళ్ళ నొప్పి', ta: 'மூட்டு வலி', bn: 'জয়েন্টে ব্যথা', ml: 'സന്ധി വേദന', kn: 'ಕೀಲು ನೋವು', mr: 'सांधेदुखी', gu: 'સાંધાનો દુખાવો', es: 'Dolor articular', fr: 'Douleurs articulaires' },
    'Back Pain': { hi: 'पीठ दर्द', te: 'నడుము నొప్పి', ta: 'முதுகு வலி', bn: 'পিঠে ব্যথা', ml: 'നടുവേദന', kn: 'ಬೆನ್ನುನೋವು', mr: 'पाठदुखी', gu: 'પીઠનો દુખાવો', es: 'Dolor de espalda', fr: 'Mal de dos' },
    'Neck Pain': { hi: 'गर्दन में दर्द', te: 'మెడ నొప్పి', ta: 'கழுத்து வலி', bn: 'ঘাড় ব্যথা', ml: 'കഴുത്ത് വേദന', kn: 'ಕುತ್ತಿಗೆ ನೋವು', mr: 'मानदुखी', gu: 'ગરદનનો દુખાવો', es: 'Dolor de cuello', fr: 'Douleurs cervicales' },
    'Stiff Neck': { hi: 'गर्दन में अकड़न', te: 'మెడ పట్టుకోవడం', ta: 'கழுத்து பிடிப்பு', bn: 'ঘাড় শক্ত হওয়া', ml: 'കഴുത്ത് ഞരമ്പ് പിടുത്തം', kn: 'ಕುತ್ತಿಗೆ ಹಿಡಿತ', mr: 'मान आखडणे', gu: 'ગરદન જકડાઈ જવી', es: 'Cuello rígido', fr: 'Raideur de la nuque' },
    'Swelling': { hi: 'सूजन', te: 'వాపు', ta: 'வீக்கம்', bn: 'ফোলা', ml: 'വീക്കം', kn: 'ಊತ', mr: 'सूज', gu: 'સોજો', es: 'Hinchazón', fr: 'Gonflement' },
    'Muscle Cramps': { hi: 'मांसपेशियों में ऐंठन', te: 'కండరాల తిమ్మిరి', ta: 'தசைப்பிடிப்பு', bn: 'পেশীতে টান', ml: 'പേശി വലിവ്', kn: 'ಸ್ನಾಯು ಸೆಳೆತ', mr: 'स्नायू गोळे येणे', gu: 'સ્નાયુ ખેંચાણ', es: 'Calambres musculares', fr: 'Crampes musculaires' },
    'Skin Rash': { hi: 'त्वचा पर चकत्ते', te: 'చర్మం దద్దుర్లు', ta: 'தோல் தடிப்பு', bn: 'ত্বকে ফুসকুড়ি', ml: 'ചർമ്മത്തിൽ തിണർപ്പ്', kn: 'ಚರ್ಮದ ದದ್ದು', mr: 'त्वचेवर पुरळ', gu: 'ત્વચા પર ફોલ્લીઓ', es: 'Erupción cutánea', fr: 'Éruption cutanée' },
    'Itching': { hi: 'खुजली', te: 'దురద', ta: 'அரிப்பு', bn: 'চুলকানি', ml: 'ചൊറിച്ചിൽ', kn: 'ತುರಿಕೆ', mr: 'खाज सुटणे', gu: 'ખંજવાળ', es: 'Picazón', fr: 'Démangeaisons' },
    'Blurred Vision': { hi: 'धुंधली दृष्टि', te: 'మసక బారిన దృష్టి', ta: 'மங்கலான பார்வை', bn: 'অস্পষ্ট দৃষ্টি', ml: 'മങ്ങിയ കാഴ്ച', kn: 'ಮಂಜಾದ ದೃಷ್ಟಿ', mr: 'अंधुक दृष्टी', gu: 'ધૂંધળી દ્રષ્ટિ', es: 'Visión borrosa', fr: 'Vision floue' },
    'Red Eyes': { hi: 'लाल आंखें', te: 'కళ్ళు ఎర్రబడటం', ta: 'கண்கள் சிவத்தல்', bn: 'চোখ লাল হওয়া', ml: 'കണ്ണ് ചുവക്കൽ', kn: 'ಕೆಂಪು ಕಣ್ಣುಗಳು', mr: 'डोळे लाल होणे', gu: 'લાલ આંખો', es: 'Ojos rojos', fr: 'Yeux rouges' },
    'Eye Pain': { hi: 'आंख में दर्द', te: 'కంటి నొప్పి', ta: 'கண் வலி', bn: 'চোখে ব্যথা', ml: 'കണ്ണ് വേദന', kn: 'ಕಣ್ಣು ನೋವು', mr: 'डोळे दुखणे', gu: 'આંખમાં દુખાવો', es: 'Dolor ocular', fr: 'Douleur oculaire' },
    'Skin Peeling': { hi: 'त्वचा का छिलना', te: 'చర్మం పొట్టు ఊడటం', ta: 'தோல் உரிதல்', bn: 'ত্বকের খোসা ওঠা', ml: 'തൊലി അടരുക', kn: 'ಚರ್ಮ ಸುಲಿಯುವುದು', mr: 'त्वचा सोलणे', gu: 'ત્વચા છોલાવી', es: 'Descamación de la piel', fr: 'Desquamation de la peau' },
    'Dry Skin': { hi: 'सूखी त्वचा', te: 'పొడి చర్మం', ta: 'வறண்ட தோல்', bn: 'শুষ্ক ত্বক', ml: 'വരണ്ട ചർമ്മം', kn: 'ಒಣ ಚರ್ಮ', mr: 'कोरडी त्वचा', gu: 'સૂકી ત્વચા', es: 'Piel seca', fr: 'Peau sèche' },
    'Chest Pain': { hi: 'छाती में दर्द', te: 'ఛాతీ నొప్పి', ta: 'நெஞ்சு வலி', bn: 'বুকে ব্যথা', ml: 'നെഞ്ചുവേദന', kn: 'ಎದೆ ನೋವು', mr: 'छातीत दुखणे', gu: 'છાતીમાં દુખાવો', es: 'Dolor en el pecho', fr: 'Douleur thoracique' },
    'Palpitations': { hi: 'धड़कन तेज होना', te: 'గుండె దడ', ta: 'படபடப்பு', bn: 'বুক ধড়ফড়ানি', ml: 'നെഞ്ചിടിപ്പ്', kn: 'ಎದೆಬಡಿತ', mr: 'धडधड', gu: 'છાતીમાં ધબકારા', es: 'Palpitaciones', fr: 'Palpitations' },
    'Cold Hands/Feet': { hi: 'ठंडे हाथ/पैर', te: 'చల్లని చేతులు/కాళ్ళు', ta: 'குளிர்ந்த கைகள்/கால்கள்', bn: 'ঠান্ডা হাত/পা', ml: 'തണുത്ത കൈകൾ/കാലുകൾ', kn: 'ತಣ್ಣನೆಯ ಕೈಗಳು/ಕಾಲುಗಳು', mr: 'थंड हात/पाय', gu: 'ઠંડા હાથ/પગ', es: 'Manos/pies fríos', fr: 'Mains/pieds froids' },
    'Rapid Heartbeat': { hi: 'तेज धड़कन', te: 'వేగవంతమైన గుండె స్పందన', ta: 'துரித இதயத்துடிப்பு', bn: 'দ্রুত হৃদস্পন্দন', ml: 'വേഗത്തിലുള്ള ഹൃദയമിടിപ്പ്', kn: 'ವೇಗದ ಹೃದಯ ಬಡಿತ', mr: 'वेगवान ठोके', gu: 'ઝડપી ધબકારા', es: 'Latidos cardíacos rápidos', fr: 'Rythme cardiaque rapide' },
    'Anxiety': { hi: 'चिंता', te: 'ఆందోళన', ta: 'கவலை', bn: 'উদ্বেग', ml: 'ഉത്കണ്ഠ', kn: 'ಆತಂಕ', mr: 'चिंता', gu: 'ચિંતા', es: 'Ansiedad', fr: 'Anxiété' },
    'Depression': { hi: 'अवसाद', te: 'విషాదం', ta: 'மனச்சோர்வு', bn: 'হতাশা', ml: 'വിഷാദം', kn: 'ಖಿನ್ನತೆ', mr: 'नैराश्य', gu: 'ડિપ્રેશન', es: 'Depresión', fr: 'Dépression' },
    'Insomnia': { hi: 'अनिद्रा', te: 'నిద్రలేమి', ta: 'தூக்கமின்மை', bn: 'অনিদ্রা', ml: 'ഉറക്കമില്ലായ്മ', kn: 'ನಿದ್ರಾಹೀನತೆ', mr: 'निद्रानाश', gu: 'અનિદ્રા', es: 'Insomnio', fr: 'Insomnie' },
    'Frequent Urination': { hi: 'बार-बार पेशाब आना', te: 'తరచుగా మూత్రవిసర్జన', ta: 'அடிக்கடி சிறுநீர் கழித்தல்', bn: 'ঘন ঘন প্রস্রাব', ml: 'ഇടയ്ക്കിടെയുള്ള മൂത്രമൊഴിക്കൽ', kn: 'ಆಗಾಗ್ಗೆ ಮೂತ್ರವಿಸರ್ಜನೆ', mr: 'वारंवार लघवी होणे', gu: 'વારંવાર પેશાબ થવો', es: 'Micción frecuente', fr: 'Miction fréquente' },
    'Painful Urination': { hi: 'पेशाब में दर्द', te: 'మూత్ర విసర్జనలో నొప్పి', ta: 'சிறுநீர் கழிக்கும் போது வலி', bn: 'প্রস্রাবের সময় ব্যথা', ml: 'മൂത്രമൊഴിക്കുമ്പോൾ വേദന', kn: 'ಮೂತ್ರವಿಸರ್ಜನೆಯಲ್ಲಿ ನೋವು', mr: 'लघवी करताना वेदना', gu: 'પેશાબ કરતી વખતે દુખાવો', es: 'Micción dolorosa', fr: 'Miction douloureuse' },
    'Difficulty Swallowing': { hi: 'निगलने में कठिनाई', te: 'మింగడంలో కష్టం', ta: 'விழுங்குவதில் சிரமம்', bn: 'গিলতে অসুবিধা', ml: 'വിഴുങ്ങാൻ ബുദ്ധിമുട്ട്', kn: 'ನುಂಗಲು ಕಷ್ಟ', mr: 'गिळताना त्रास', gu: 'ગળવામાં તકલીફ', es: 'Dificultad para tragar', fr: 'Difficulté à avaler' },
    'Ear Pain': { hi: 'कान में दर्द', te: 'చెవి నొప్పి', ta: 'காதில் வலி', bn: 'কানে ব্যথা', ml: 'ചെവി വേദന', kn: 'ಕಿವಿ ನೋವು', mr: 'कानदुखी', gu: 'કાનમાં દુખાવો', es: 'Dolor de oído', fr: 'Mal d\'oreille' }
  };
  return symptoms[symptom]?.[lang] || symptom;
};

interface SymptomCheckerProps {
  userTier: UserTier;
  onConsultAI?: (message: string) => void;
  onNavigate?: (view: any) => void;
  language: Language;
}

interface AnalysisResult {
  healthSummary: string;
  possibleCauses: string[];
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Emergency';
  recommendations: string[];
  warningSigns: string[];
  suggestedSpecialist: string;
  disclaimer: string;
  title?: string;
  type?: string;
  cause?: string;
  guidance?: string;
}

const getStep3Text = (key: string, lang: Language) => {
  const mapping: Record<string, Partial<Record<Language, string>>> = {
    readyToShowDoctor: {
      en: "Ready to show your doctor",
      hi: "अपने डॉक्टर को दिखाने के लिए तैयार",
      te: "మీ వైద్యుడికి చూపించడానికి సిద్ధంగా ఉంది",
      ta: "உங்கள் மருத்துவரிடம் காட்ட தயாராக உள்ளது",
      bn: "আপনার ডাক্তারকে দেখানোর জন্য প্রস্তুত",
      ml: "നിങ്ങളുടെ ഡോക്ടറെ കാണിക്കാൻ തയ്യാറാണ്",
      kn: "ನಿಮ್ಮ ವೈದ್ಯರಿಗೆ ತೋರಿಸಲು ಸಿದ್ಧವಾಗಿದೆ",
      mr: "Ready to show your doctor",
      gu: "Ready to show your doctor"
    },
    presentation: {
      en: "Presentation",
      hi: "प्रस्तुति",
      te: "ప్రదర్శన",
      ta: "விளக்கம்",
      bn: "উপস্থাপনা",
      ml: "അവതരണം",
      kn: "ಪ್ರಸ್ತುತಿ",
      mr: "Presentation",
      gu: "Presentation"
    },
    triageCategory: {
      en: "Triage Category",
      hi: "वर्गीकरण श्रेणी",
      te: "ట్రయాజ్ వర్గం",
      ta: "வகைப்பாடு பிரிவு",
      bn: "ট্রয়াজ বিভাগ",
      ml: "ട്രിയാജ് വിഭാഗം",
      kn: "ಟ್ರಯಾಜ್ ವರ್ಗ",
      mr: "Triage Category",
      gu: "Triage Category"
    },
    reportedSymptoms: {
      en: "Reported Symptoms",
      hi: "सूचित लक्षण",
      te: "నివేదించబడిన లక్షణాలు",
      ta: "தெரிவிக்கப்பட்ட அறிகுறிகள்",
      bn: "প্রতিবেদিত উপসর্গ",
      ml: "റിപ്പോർട്ട് ചെയ്ത ലക്ഷണങ്ങൾ",
      kn: "ವರದಿ ಮಾಡಲಾದ ರೋಗಲಕ್ಷಣಗಳು",
      mr: "Reported Symptoms",
      gu: "Reported Symptoms"
    },
    keyConcernsAnalysis: {
      en: "Key Concerns & Differential Analysis",
      hi: "मुख्य चिंताएं और अंतर विश्लेषण",
      te: "కీలక ఆందోళనలు & భేదాత్మక విశ్లేషణ",
      ta: "முக்கிய கவலைகள் மற்றும் பகுப்பாய்வு",
      bn: "মূল উদ্বেগ এবং ডিফারেনশিয়াল বিশ্লেষণ",
      ml: "പ്രധാന ആശങ്കകളും വിശകലനവും",
      kn: "ಪ್ರಮುಖ ಕಾಳಜಿಗಳು ಮತ್ತು ವಿಶ್ಲೇಷಣೆ",
      mr: "Key Concerns & Differential Analysis",
      gu: "Key Concerns & Differential Analysis"
    },
    suggestedQuestions: {
      en: "Suggested Questions for Your Doctor",
      hi: "आपके डॉक्टर के लिए सुझाए गए प्रश्न",
      te: "మీ వైద్యుని కోసం సూచించబడిన ప్రశ్నలు",
      ta: "உங்கள் மருத்துவரிடம் கேட்க பரிந்துரைக்கப்படும் கேள்விகள்",
      bn: "আপনার ডাক্তারের জন্য প্রস্তাবিত প্রশ্ন",
      ml: "നിങ്ങളുടെ ഡോക്ടറോട് ചോദിക്കാനുള്ള ചോദ്യങ്ങൾ",
      kn: "ನಿಮ್ಮ ವೈದ್ಯರಿಗಾಗಿ ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು",
      mr: "Suggested Questions for Your Doctor",
      gu: "Suggested Questions for Your Doctor"
    },
    printExportPdf: {
      en: "Print / Export PDF",
      hi: "प्रिंट / पीडीएफ निर्यात करें",
      te: "ప్రింట్ / పిడిఎఫ్ ఎగుమతి",
      ta: "பிரிண்ட் / பிடிஎஃப் ஏற்றுமதி",
      bn: "প্রিন্ট / পিডিএফ রপ্তানি",
      ml: "പ്രിന്റ് / പിഡിഎഫ് കയറ്റുമതി",
      kn: "ಪ್ರಿಂಟ್ / ಪಿಡಿಎಫ್ ರಫ್ತು",
      mr: "Print / Export PDF",
      gu: "Print / Export PDF"
    },
    close: {
      en: "Close",
      hi: "बंद करें",
      te: "మూసివేయి",
      ta: "மூடு",
      bn: "বন্ধ করুন",
      ml: "അടയ്ക്കുക",
      kn: "ಮುಚ್ಚಿ",
      mr: "Close",
      gu: "Close"
    },
    toolDisclaimer: {
      en: "Disclaimer: This tool is for informational purposes only. It does not provide medical diagnosis or replace professional advice.",
      hi: "अस्वीकरण: यह उपकरण केवल सूचनात्मक उद्देश्यों के लिए है। यह चिकित्सा निदान प्रदान नहीं करता है या पेशेवर सलाह को प्रतिस्थापित नहीं करता है।",
      te: "నిరాకరణ: ఈ సాధనం సమాచార ప్రయోజనాల కోసం మాత్రమే. ఇది వైద్య నిర్ధారణను అందించదు లేదా వృత్తిపరային సలహాను భర్తీ చేయదు.",
      ta: "பொறுப்புத் துறப்பு: இந்தக் கருவி தகவல் நோக்கங்களுக்காக மட்டுமே. இது மருத்துவ நோயறிதலை வழங்காது அல்லது தொழில்முறை ஆலோசனையை மாற்றாது.",
      bn: "দাবিত্যাগ: এই সরঞ্জামটি কেবল তথ্যগত উদ্দেশ্যে তৈরি। এটি কোনো চিকিৎসাগত রোগ নির্ণয় প্রদান করে না বা পেশাদার পরামর্শের বিকল্প নয়।",
      ml: "നിരാകരണം: ഈ ഉപകരണം വിവര ആവശ്യങ്ങൾക്കായി മാത്രമുള്ളതാണ്. ഇത് മെഡിക്കൽ രോഗനിർണ്ണയം നൽകുന്നില്ല അല്ലെങ്കിൽ പ്രൊഫഷണൽ ഉപദേശത്തിന് പകരമാകുന്നില്ല.",
      kn: "ಹಕ್ಕುತ್ಯಾಗ: ಈ ಉಪಕರಣವು ಮಾಹಿತಿ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಮಾತ್ರ. ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವನ್ನು ಒದಗಿಸುವುದಿಲ್ಲ ಅಥವಾ ವೃತ್ತಿಪರ ಸಲಹೆಯನ್ನು ಬದಲಿಸುವುದಿಲ್ಲ.",
      mr: "Disclaimer: This tool is for informational purposes only. It does not provide medical diagnosis or replace professional advice.",
      gu: "Disclaimer: This tool is for informational purposes only. It does not provide medical diagnosis or replace professional advice."
    }
  };
  return mapping[key]?.[lang] || mapping[key]?.['en'] || key;
};

export default function SymptomChecker({ userTier, onConsultAI, onNavigate, language }: SymptomCheckerProps) {
  const t = getTranslations(language);
  const { showError, showSuccess } = useToast();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [step, setStep] = useState(1);
  const [severity, setSeverity] = useState('Mild');
  const [duration, setDuration] = useState('Less than 24 hours');
  const [age, setAge] = useState('Adult (18-64)');
  const [gender, setGender] = useState('Not Specified');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentChecks, setRecentChecks] = useState<any[]>([]);

  // Premium Clinical Summary State
  const [showSummary, setShowSummary] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [clinicalSummary, setClinicalSummary] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('recent_symptom_checks');
    if (saved) {
      try {
        setRecentChecks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load recent checks");
      }
    }
  }, []);

  const saveToRecent = (result: AnalysisResult) => {
    const newCheck = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      symptoms: selectedSymptoms,
      result: result?.healthSummary || result?.title || "Clinical Analysis",
      type: (result?.riskLevel || result?.type || "moderate").toLowerCase()
    };
    const updated = [newCheck, ...recentChecks].slice(0, 5);
    setRecentChecks(updated);
    localStorage.setItem('recent_symptom_checks', JSON.stringify(updated));
  };

  const filteredSymptoms = searchTerm 
    ? COMMON_SYMPTOMS.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (searchTerm.trim() && !selectedSymptoms.includes(searchTerm.trim())) {
      const newSymptom = searchTerm.trim();
      setCustomSymptoms(prev => [...prev, newSymptom]);
      setSelectedSymptoms(prev => [...prev, newSymptom]);
      setSearchTerm('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
    setCustomSymptoms(prev => prev.filter(s => s !== symptom));
  };

  const handleConsultAI = () => {
    if (onConsultAI && analysis) {
      const message = `I've used the symptom checker. 
      Patient Info: ${age}, ${gender}.
      Symptoms: ${selectedSymptoms.join(', ')}. 
      Duration: ${duration}. 
      Severity: ${severity}. 
      The initial analysis was: "${analysis.healthSummary}: ${analysis.possibleCauses.join(', ')}". 
      Can you provide more detailed advice?`;
      onConsultAI(message);
    }
  };

  const handleGenerateSummary = async () => {
    if (!analysis) return;
    setIsGeneratingSummary(true);
    try {
      const summaryPrompt = `Generate a high-fidelity clinical summary for a healthcare professional based on these checked symptoms:
      Symptoms: ${selectedSymptoms.join(', ')}.
      Duration: ${duration}.
      Severity: ${severity}.
      Analysis: ${analysis.title} - ${analysis.cause}.`;
      
      const summary = await gemini.generateClinicalSummary([
        { id: 'symptom-summary-query', role: 'user', text: summaryPrompt, timestamp: Date.now() }
      ]);
      
      if (summary) {
        setClinicalSummary(summary);
        setShowSummary(true);
      } else {
        showError("Summary Error", "Failed to generate clinical summary.");
      }
    } catch (error) {
      console.error(error);
      showError("Summary Error", "Failed to generate clinical summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const performAnalysis = async () => {
    if (selectedSymptoms.length === 0) return;
    
    setStep(3);
    setIsAnalyzing(true);
    try {
      const context = `Patient: ${age}, ${gender}.`;
      const result = await gemini.analyzeSymptoms([...selectedSymptoms, context], severity, duration, language);
      // Defensive mapping in case the LLM returns the old format or misses fields
      const safeResult = {
        healthSummary: result?.healthSummary || result?.title || "Symptom Assessment",
        possibleCauses: result?.possibleCauses || result?.differentialDiagnosis || [result?.cause || "Unable to determine exact cause. Please consult a professional."],
        riskLevel: result?.riskLevel || (result?.type === 'emergency' ? 'Emergency' : result?.type === 'warning' ? 'High' : 'Moderate'),
        recommendations: result?.recommendations || [result?.guidance || "Please monitor your symptoms."],
        warningSigns: result?.warningSigns || ["If symptoms rapidly worsen, seek immediate medical care."],
        suggestedSpecialist: result?.suggestedSpecialist || "General Practitioner",
        disclaimer: result?.disclaimer || "I am an AI. Please consult a qualified healthcare professional for an accurate diagnosis."
      };
      
      setAnalysis(safeResult);
      saveToRecent(safeResult);
      showSuccess("Analysis Complete", "We've analyzed your symptoms against clinical patterns.");
    } catch (error: any) {
      console.error("Analysis failed:", error);
      showError("Analysis Error", "Vitalis was unable to process your symptoms. Please try again or consult a doctor.");
      setAnalysis({
        healthSummary: "Analysis Error",
        possibleCauses: ["We encountered an error while analyzing your symptoms."],
        riskLevel: 'Moderate',
        recommendations: ["Please try again or consult our AI assistant directly."],
        warningSigns: ["If symptoms worsen, seek immediate medical care."],
        suggestedSpecialist: "General Practitioner",
        disclaimer: "This is an automated fallback response."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white lg:rounded-[2.5rem] shadow-xl shadow-brand-500/5 border border-brand-100/50 overflow-hidden relative">
      {/* Progress Header */}
      <div className="px-4 sm:px-10 py-5 sm:py-8 border-b border-brand-50 bg-brand-50/30 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20 shrink-0">
            <Stethoscope size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 pr-2">
            <h2 className="font-display font-bold text-base sm:text-2xl text-slate-800 tracking-tight truncate">{t.symptomChecker}</h2>
            <p className="text-[9px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5 truncate">
              {language === 'hi' ? `चरण ${step}/3 • एआई विश्लेषण` : language === 'te' ? `దశ ${step}/3 • AI విశ్లేషణ` : language === 'ta' ? `படி ${step}/3 • எஐ பகுப்பாய்வு` : language === 'bn' ? `ধাপ ${step}/3 • এআই বিশ্লেষণ` : language === 'ml' ? `ഘട്ടം ${step}/3 • എഐ വിശകലനം` : language === 'kn' ? `ಹಂತ ${step}/3 • ಎಐ ವಿಶ್ಲೇಷಣೆ` : `Step ${step} of 3 • AI Analysis`}
            </p>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 shrink-0">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={cn(
                "w-8 sm:w-12 h-1 sm:h-1.5 rounded-full transition-all duration-500", 
                s <= step ? "bg-brand-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]" : "bg-brand-100"
              )} 
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-10 custom-scrollbar no-scrollbar">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 sm:space-y-10"
            >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800">
                      {t.whatSymptoms}
                    </h3>
                    {selectedSymptoms.length > 0 && (
                      <button 
                        onClick={() => setSelectedSymptoms([])}
                        className="text-[9px] sm:text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors shrink-0"
                      >
                        {t.clearAll}
                      </button>
                    )}
                  </div>

                  {/* Search Bar */}
                  <div className="relative group">
                    <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                      <Search size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomSymptom()}
                      placeholder={t.searchOrAdd} 
                      className="w-full pl-12 sm:pl-14 pr-14 sm:pr-16 py-4 sm:py-5 bg-white border border-slate-200 rounded-2xl sm:rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all text-sm font-medium shadow-sm"
                    />
                    {searchTerm && (
                      <button
                        onClick={addCustomSymptom}
                        className="absolute right-2 sm:right-3 top-2 sm:top-3 bottom-2 sm:bottom-3 px-3 sm:px-4 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all flex items-center justify-center shadow-lg shadow-brand-500/10"
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>

                  {/* Search Results or Groups */}
                  {searchTerm ? (
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                        {t.searchResults}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {filteredSymptoms.map((s, idx) => (
                          <button
                            key={`search-${idx}-${s}`}
                            onClick={() => toggleSymptom(s)}
                            className={cn(
                              "px-4 py-3 rounded-2xl text-xs font-bold transition-all border text-center hover-lift",
                              selectedSymptoms.includes(s)
                                ? "bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/20"
                                : "bg-white text-slate-600 border-slate-100 hover:border-brand-200"
                            )}
                          >
                            {getLocalizedSymptom(s, language)}
                          </button>
                        ))}
                        {filteredSymptoms.length === 0 && (
                          <div className="col-span-full py-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <p className="text-sm text-slate-400">
                              {t.noMatchingSymptoms.replace('{searchTerm}', searchTerm)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {Object.entries(SYMPTOM_GROUPS).map(([group, symptoms]) => (
                        <div key={group} className="space-y-4">
                          <div className="flex items-center gap-3 px-2">
                            <div className="w-1 h-4 bg-brand-500 rounded-full" />
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{getLocalizedGroup(group, language)}</label>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {symptoms.map((s, idx) => (
                              <button
                                key={`group-${group}-${idx}-${s}`}
                                onClick={() => toggleSymptom(s)}
                                className={cn(
                                  "px-4 py-3 rounded-2xl text-xs font-bold transition-all border text-center hover-lift",
                                  selectedSymptoms.includes(s)
                                    ? "bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/20"
                                    : "bg-white text-slate-600 border-slate-100 hover:border-brand-200"
                                )}
                              >
                                {getLocalizedSymptom(s, language)}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Selected Symptoms Tags */}
                  {selectedSymptoms.length > 0 && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                        {t.selectedSymptomsLabel}
                      </label>
                      <div className="flex flex-wrap gap-2 p-5 bg-brand-50/30 rounded-3xl border border-brand-100/50">
                        {selectedSymptoms.map((s, idx) => (
                          <motion.span 
                            layout
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            key={`selected-${idx}-${s}`} 
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-200 text-brand-700 rounded-2xl text-xs font-bold shadow-sm"
                          >
                            {getLocalizedSymptom(s, language)}
                            <button onClick={() => removeSymptom(s)} className="hover:text-rose-500 transition-colors">
                              <X size={14} />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Checks */}
                  {recentChecks.length > 0 && !searchTerm && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                        {t.recentAssessments}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {recentChecks.map((check) => (
                          <div key={check.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-brand-200 transition-all">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                check.type === 'emergency' ? "bg-rose-500" : 
                                check.type === 'warning' ? "bg-amber-500" : "bg-emerald-500"
                              )} />
                              <div>
                                <p className="text-xs font-bold text-slate-700">{check.result}</p>
                                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">{check.timestamp}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                setSelectedSymptoms(check.symptoms);
                                setStep(2);
                              }}
                              className="p-2 text-slate-300 group-hover:text-brand-500 transition-colors"
                            >
                              <RotateCcw size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              <button
                disabled={selectedSymptoms.length === 0}
                onClick={() => setStep(2)}
                className="w-full py-5 bg-brand-600 text-white rounded-[1.5rem] font-bold hover:bg-brand-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-brand-500/20 active:scale-95"
              >
                {t.continueAnalysis}
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-8 sm:space-y-10">
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800">
                  {t.patientInfo}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 bg-slate-50 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 text-brand-600">
                      <User size={18} />
                      <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none">
                        {t.ageGroup}
                      </label>
                    </div>
                    <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2">
                      {[
                        { key: 'Infant (0-2)', label: t.infant },
                        { key: 'Child (3-12)', label: t.child },
                        { key: 'Teen (13-17)', label: t.teen },
                        { key: 'Adult (18-64)', label: t.adult },
                        { key: 'Senior (65+)', label: t.senior }
                      ].map(a => (
                        <button
                          key={a.key}
                          onClick={() => setAge(a.key)}
                          className={cn(
                            "p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-left transition-all border leading-tight",
                            age === a.key ? "bg-white border-brand-500 text-brand-600 shadow-sm" : "bg-transparent border-transparent text-slate-500 hover:bg-white/50"
                          )}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 bg-slate-50 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 text-brand-600">
                      <Activity size={18} />
                      <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none">
                        {t.gender}
                      </label>
                    </div>
                    <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2">
                      {[
                        { key: 'Male', label: t.male },
                        { key: 'Female', label: t.female },
                        { key: 'Other', label: t.other },
                        { key: 'Not Specified', label: t.notSpecified }
                      ].map(g => (
                        <button
                          key={g.key}
                          onClick={() => setGender(g.key)}
                          className={cn(
                            "p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-left transition-all border leading-tight",
                            gender === g.key ? "bg-white border-brand-500 text-brand-600 shadow-sm" : "bg-transparent border-transparent text-slate-500 hover:bg-white/50"
                          )}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 bg-slate-50 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 text-brand-600">
                      <Clock size={18} />
                      <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none">
                        {t.duration}
                      </label>
                    </div>
                    <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2">
                      {[
                        { key: 'Less than 24 hours', label: t.lessThan24h },
                        { key: '1-3 days', label: t.oneToThreeDays },
                        { key: '1 week+', label: t.oneWeekPlus }
                      ].map(d => (
                        <button
                          key={d.key}
                          onClick={() => setDuration(d.key)}
                          className={cn(
                            "p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-left transition-all border leading-tight",
                            duration === d.key ? "bg-white border-brand-500 text-brand-600 shadow-sm" : "bg-transparent border-transparent text-slate-500 hover:bg-white/50"
                          )}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 bg-slate-50 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 text-brand-600">
                      <Thermometer size={18} />
                      <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none">
                        {t.severity}
                      </label>
                    </div>
                    <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2">
                      {[
                        { key: 'Mild', label: t.mild },
                        { key: 'Moderate', label: t.moderate },
                        { key: 'Severe', label: t.severe }
                      ].map(s => (
                        <button
                          key={s.key}
                          onClick={() => setSeverity(s.key)}
                          className={cn(
                            "p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-left transition-all border leading-tight",
                            severity === s.key ? "bg-white border-brand-500 text-brand-600 shadow-sm" : "bg-transparent border-transparent text-slate-500 hover:bg-white/50"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 sm:py-5 bg-slate-100 text-slate-600 rounded-xl sm:rounded-[1.5rem] text-sm sm:text-base font-bold hover:bg-slate-200 transition-all active:scale-95"
                >
                  {t.back}
                </button>
                <button
                  onClick={performAnalysis}
                  className="flex-[2] py-4 sm:py-5 bg-brand-600 text-white rounded-xl sm:rounded-[1.5rem] text-sm sm:text-base font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 active:scale-95"
                >
                  {t.viewResults}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-brand-100 rounded-full animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center text-brand-600">
                      <Loader2 className="animate-spin" size={32} />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-display font-bold text-xl text-slate-800">
                      {t.advancedAnalysis}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {t.advancedAnalysisDesc}
                    </p>
                  </div>
                </div>
              ) : analysis && (
                <>
                  <div className="text-center space-y-4">
                    <div className={cn(
                      "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-inner",
                      analysis.riskLevel === 'Emergency' ? "bg-rose-50 text-rose-500" : 
                      analysis.riskLevel === 'High' ? "bg-orange-50 text-orange-500" : 
                      analysis.riskLevel === 'Moderate' ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"
                    )}>
                      {analysis.riskLevel === 'Emergency' || analysis.riskLevel === 'High' ? <AlertCircle size={40} /> : 
                       analysis.riskLevel === 'Moderate' ? <Info size={40} /> : <CheckCircle2 size={40} />}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-2xl text-slate-800 tracking-tight">{analysis.healthSummary}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {t.aiDrivenAssessment}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={cn(
                      "p-8 rounded-[2rem] border space-y-4 relative overflow-hidden group",
                      analysis.riskLevel === 'Emergency' || analysis.riskLevel === 'High' ? "border-rose-100 bg-rose-50/30" : "border-brand-100 bg-brand-50/30"
                    )}>
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <Activity size={60} />
                      </div>
                      <h4 className={cn("font-display font-bold text-lg", analysis.riskLevel === 'Emergency' || analysis.riskLevel === 'High' ? "text-rose-900" : "text-brand-900")}>
                        {t.possibleCausesLabel}
                      </h4>
                      <ul className={cn("text-sm leading-relaxed list-disc list-inside", analysis.riskLevel === 'Emergency' || analysis.riskLevel === 'High' ? "text-rose-700" : "text-brand-700")}>
                        {analysis.possibleCauses.map((cause, idx) => (
                          <li key={idx}>{cause}</li>
                        ))}
                      </ul>
                      
                      {analysis.warningSigns && analysis.warningSigns.length > 0 && (
                        <div className="pt-4 space-y-3">
                          <h5 className={cn("text-xs font-bold uppercase tracking-widest", analysis.riskLevel === 'Emergency' || analysis.riskLevel === 'High' ? "text-rose-600" : "text-brand-600")}>
                            {t.warningSignsLabel}
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {analysis.warningSigns.map((sign, i) => (
                              <span key={i} className={cn(
                                "px-3 py-1.5 rounded-xl text-[10px] font-bold border",
                                analysis.riskLevel === 'Emergency' || analysis.riskLevel === 'High' ? "bg-rose-100/50 border-rose-200 text-rose-700" : "bg-brand-100/50 border-brand-200 text-brand-700"
                              )}>
                                {sign}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className={cn(
                      "p-8 rounded-[2rem] border space-y-4 relative overflow-hidden group",
                      analysis.riskLevel === 'Emergency' ? "border-rose-200 bg-rose-100/50" : 
                      analysis.riskLevel === 'High' ? "border-orange-200 bg-orange-50" : "border-emerald-100 bg-emerald-50/30"
                    )}>
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <AlertCircle size={60} />
                      </div>
                      <h4 className="font-display font-bold text-lg text-slate-800">
                        {t.recommendationsLabel}
                      </h4>
                      <ul className="text-sm text-slate-700 leading-relaxed font-medium list-disc list-inside">
                        {analysis.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                      <div className="pt-4 space-y-2">
                         <h5 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                           {t.suggestedSpecialistLabel}
                         </h5>
                         <p className="text-sm font-semibold text-slate-700">{analysis.suggestedSpecialist}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={handleConsultAI}
                        className="py-5 bg-brand-600 text-white rounded-[1.5rem] font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
                      >
                        {t.consultAIAssistant}
                        <ChevronRight size={20} />
                      </button>
                      <button
                        onClick={() => userTier === 'premium' ? handleGenerateSummary() : onNavigate?.('premium-upgrade')}
                        disabled={isGeneratingSummary}
                        className={cn(
                           "py-5 rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-3 active:scale-95 border-2 cursor-pointer",
                          userTier === 'premium' 
                            ? "bg-white border-brand-100 text-brand-600 hover:bg-brand-50" 
                            : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                        )}
                      >
                        {isGeneratingSummary ? (
                          <Loader2 className="animate-spin text-brand-600" size={20} />
                        ) : (
                          <FileText size={20} />
                        )}
                        {t.clinicalSummary}
                        {userTier === 'free' && <Crown size={14} className="text-amber-400" fill="currentColor" />}
                      </button>
                    </div>
                    <button
                      onClick={() => {setStep(1); setSelectedSymptoms([]); setAnalysis(null);}}
                      className="w-full py-5 border-2 border-brand-100 text-brand-600 rounded-[1.5rem] font-bold hover:bg-brand-50 transition-all active:scale-95 cursor-pointer"
                    >
                      {t.startNewCheck}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Clinical Summary Modal */}
        <AnimatePresence>
          {showSummary && clinicalSummary && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-brand-100"
              >
                <div className="p-8 border-b border-brand-50 flex items-center justify-between bg-brand-50/30">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-600 text-white rounded-2xl">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-slate-800">
                        {t.clinicalSummary}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {getStep3Text('readyToShowDoctor', language)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSummary(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-8 max-h-[60vh] overflow-y-auto space-y-8 no-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        {getStep3Text('presentation', language)}
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed">{clinicalSummary.presentation}</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        {getStep3Text('triageCategory', language)}
                      </p>
                      <div className="inline-block px-3 py-1 bg-brand-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                        {clinicalSummary.triageCategory}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-display font-bold text-slate-800">
                      {getStep3Text('reportedSymptoms', language)}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {clinicalSummary.symptoms.map((s: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold rounded-xl">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-display font-bold text-slate-800">
                      {getStep3Text('keyConcernsAnalysis', language)}
                    </h4>
                    <div className="space-y-2">
                      {clinicalSummary.keyConcerns.map((concern: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-rose-50/50 border border-rose-100 rounded-xl">
                          <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={16} />
                          <p className="text-xs text-rose-700 leading-relaxed font-medium">{concern}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-display font-bold text-slate-800">
                      {getStep3Text('suggestedQuestions', language)}
                    </h4>
                    <div className="space-y-2">
                      {clinicalSummary.suggestedQuestionsForDoctor.map((q: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                          <Info className="text-brand-500 shrink-0 animate-pulse" size={16} />
                          <p className="text-xs text-slate-700 font-medium">{q}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 bg-brand-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 uppercase tracking-widest hover:bg-brand-700 transition-all cursor-pointer"
                  >
                    {getStep3Text('printExportPdf', language)}
                  </button>
                  <button
                    onClick={() => setShowSummary(false)}
                    className="px-6 py-3 border border-slate-200 text-slate-500 text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    {getStep3Text('close', language)}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
          <AlertCircle size={20} />
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest font-bold">
          {analysis ? analysis.disclaimer : getStep3Text('toolDisclaimer', language)}
        </p>
      </div>
    </div>
  );
}
