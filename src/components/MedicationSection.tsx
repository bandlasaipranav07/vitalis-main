import React, { useState } from 'react';
import { Search, AlertTriangle, ShieldCheck, Info, ChevronRight, Pill, Ban, HeartPulse, Baby, X, Scale, Loader2, Thermometer, Droplets, Clock, Zap, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { gemini } from '../services/gemini';
import InfiniteCarousel from './InfiniteCarousel';
import { UserTier, Language } from '../types';
import { useToast } from '../contexts/ToastContext';

const getMedTranslation = (key: string, lang: Language) => {
  const mapping: Record<string, Partial<Record<Language, string>>> = {
    takeMeds: { en: "Take meds at the same time daily.", hi: "दवाएं रोजाना एक ही समय पर लें।", te: "రోజూ ఒకే సమయానికి మందులు వేసుకోండి.", ta: "தினமும் ஒரே நேரத்தில் மருந்துகளை எடுத்துக் கொள்ளுங்கள்.", bn: "প্রতিদিন একই সময়ে ওষুধ খান।", ml: "എല്ലാ ദിവസവും ഒരേ സമയത്ത് മരുന്നുകൾ കഴിക്കുക.", kn: "ಪ್ರತಿದಿನ ಒಂದೇ ಸಮಯದಲ್ಲಿ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.", mr: "रोज एकाच वेळी औषधे घ्या.", gu: "દરરોજ એક જ સમયે દવાઓ લો.", es: "Tome los medicamentos a la misma hora todos los días.", fr: "Prenez les médicaments à la même heure tous les jours." },
    drinkWater: { en: "Drink water with oral medications.", hi: "मौखिक दवाओं के साथ पानी पिएं।", te: "మౌఖిక మందులతో నీరు త్రాగండి.", ta: "வாய்வழி மருந்துகளுடன் தண்ணீர் குடிக்கவும்.", bn: "মৌখিক ওষুধের সাথে জল পান করুন।", ml: "മരുന്നുകൾക്കൊപ്പം വെള്ളം കുടിക്കുക.", kn: "ಔಷಧಿಗಳೊಂದಿಗೆ ನೀರು ಕುಡಿಯಿರಿ.", mr: "तोंडी औषधांसोबत पाणी प्या.", gu: "દવાઓ સાથે પાણી પીવો.", es: "Beba agua con los medicamentos orales.", fr: "Buvez de l'eau avec les médicaments par voie orale." },
    checkExpiry: { en: "Check expiry dates before use.", hi: "उपयोग करने से पहले समाप्ति तिथि जांचें।", te: "ఉపయోగించే ముందు గడువు తేదీని తనిఖీ చేయండి.", ta: "பயன்படுத்துவதற்கு முன் காலாவதி தேதியை சரிபார்க்கவும்.", bn: "ব্যবহারের আগে মেয়াদোত্তীর্ণের তারিখ পরীক্ষা করুন।", ml: "ഉപയോഗിക്കുന്നതിന് മുമ്പ് കാലാവധി തീരുന്ന തീയതി പരിശോധിക്കുക.", kn: "ಬಳಸುವ ಮುನ್ನ ಮುಕ್ತಾಯ ದಿನಾಂಕವನ್ನು ಪರಿಶೀಲಿಸಿ.", mr: "वापरण्यापूर्वी एक्सपायरी डेट तपासा.", gu: "ઉપયોગ કરતા પહેલા સમાપ્તિ તારીખ તપાસો.", es: "Verifique las fechas de caducidad antes de usar.", fr: "Vérifiez les dates de péremption avant utilisation." },
    keepPrescriptions: { en: "Keep prescriptions handy.", hi: "पर्चे संभाल कर रखें।", te: "ప్రిస్క్రిప్షన్లను అందుబాటులో ఉంచండి.", ta: "மருந்து சீட்டுகளை கைவசம் வைத்திருக்கவும்.", bn: "প্রেসক্রিপশন হাতের কাছে রাখুন।", ml: "കുറിപ്പടികൾ കൈവശം വയ്ക്കുക.", kn: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳನ್ನು ಕೈಯಲ್ಲಿಡಿ.", mr: "प्रिस्क्रिप्शन जवळ ठेवा.", gu: "પ્રિસ્ક્રિપ્શન હાથમાં રાખો.", es: "Tenga a mano las recetas.", fr: "Gardez les ordonnances à portée de main." },
    storeCool: { en: "Store in a cool, dry place.", hi: "ठंडी, सूखी जगह पर रखें।", te: "చల్లని, పొడి ప్రదేశంలో నిల్వ చేయండి.", ta: "குளிர்ந்த, உலர்வான இடத்தில் சேமிக்கவும்.", bn: "ঠান্ডা, শুষ্ক স্থানে সংরক্ষণ করুন।", ml: "തണുത്തതും ഉണങ്ങിയതുമായ സ്ഥലത്ത് സൂക്ഷിക്കുക.", kn: "ತಂಪಾದ, ಒಣ ಸ್ಥಳದಲ್ಲಿ ಶೇಖರಿಸಿಡಿ.", mr: "थंड, कोरड्या जागी साठवा.", gu: "ઠંડી, સૂકી જગ્યાએ સંગ્રહ કરો.", es: "Guarde en un lugar fresco y seco.", fr: "Conservez dans un endroit frais et sec." },
    keepChildren: { en: "Keep away from children.", hi: "बच्चों से दूर रखें।", te: "పిల్లలకు దూరంగా ఉంచండి.", ta: "குழந்தைகளிடமிருந்து விலக்கி வைக்கவும்.", bn: "শিশুদের থেকে দূরে রাখুন।", ml: "കുട്ടികളിൽ നിന്ന് അകറ്റി നിർത്തുക.", kn: "ಮಕ್ಕಳಿಂದ ದೂರವಿಡಿ.", mr: "मुलांपासून दूर ठेवा.", gu: "બાળકોથી દૂર રાખો.", es: "Mantener fuera del alcance de los niños.", fr: "Tenir hors de portée des enfants." },
    neverShare: { en: "Never share your prescriptions.", hi: "अपने पर्चे कभी साझा न करें।", te: "మీ ప్రిస్క్రిప్షన్లను ఎప్పుడూ పంచుకోవద్దు.", ta: "உங்கள் மருந்து சீட்டுகளை ஒருபோதும் பகிர வேண்டாம்.", bn: "কখনই আপনার প্রেসক্রিপশন শেয়ার করবেন না।", ml: "നിങ്ങളുടെ കുറിപ്പടികൾ ഒരിക്കലും പങ്കിടരുത്.", kn: "ನಿಮ್ಮ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳನ್ನು ಎಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.", mr: "तुमची प्रिस्क्रिप्शन कधीही शेअर करू नका.", gu: "તમારી પ્રિસ્ક્રિપ્શન ક્યારેય શેર કરશો નહીં.", es: "Nunca comparta sus recetas.", fr: "Ne partagez jamais vos ordonnances." },
    
    // Adult safety
    followDosage: { en: "Follow prescribed dosage", hi: "निर्धारित खुराक का पालन करें", te: "సూచించిన మోతాదును అనుసరించండి", ta: "பரிந்துரைக்கப்பட்ட அளவை பின்பற்றவும்", bn: "নির্ধারিত ডোজ অনুসরণ করুন", ml: "നിർദ്ദേശിച്ച ഡോസ് പിന്തുടരുക", kn: "ಸೂಚಿಸಲಾದ ಡೋಸೇಜ್ ಅನುಸರಿಸಿ", mr: "विहित डोसचे पालन करा", gu: "નિર્ધારિત ડોઝને અનુસરો", es: "Siga la dosis prescrita", fr: "Suivre la posologie prescrite" },
    checkInteractions: { en: "Check for drug interactions", hi: "दवाओं के इंटरैक्शन की जांच करें", te: "ఔషధ పరస్పర చర్యల కోసం తనిఖీ చేయండి", ta: "மருந்து இடைவினைகளை சரிபார்க்கவும்", bn: "ওষুধের মিথস্ক্রিয়া পরীক্ষা করুন", ml: "മരുന്നുകളുടെ ഇടപെടലുകൾ പരിശോധിക്കുക", kn: "ಔಷಧದ ಪರಸ್ಪರ ಕ್ರಿಯೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ", mr: "औषधांच्या परस्परसंवादासाठी तपासा", gu: "દવાની ક્રિયાપ્રતિક્રિયાઓ માટે તપાસો", es: "Verifique las interacciones entre medicamentos", fr: "Vérifier les interactions médicamenteuses" },
    avoidAlcohol: { en: "Avoid alcohol with meds", hi: "दवाओं के साथ शराब से बचें", te: "మందులతో మద్యపానం మానుకోండి", ta: "மருந்துகளுடன் மது அருந்துவதைத் தவிர்க்கவும்", bn: "ওষুধের সাথে অ্যালকোহল এড়িয়ে চলুন", ml: "മരുന്നുകൾക്കൊപ്പം മദ്യം ഒഴിവാക്കുക", kn: "ಔಷಧಿಗಳೊಂದಿಗೆ ಮದ್ಯಪಾನವನ್ನು ತಪ್ಪಿಸಿ", mr: "औषधांसोबत मद्यपान टाळा", gu: "દવાઓ સાથે આલ્કોહોલ ટાળો", es: "Evite el alcohol con los medicamentos", fr: "Éviter l'alcool avec les médicaments" },

    // Pediatric Care
    weightBased: { en: "Use weight-based dosing", hi: "वजन आधारित खुराक का प्रयोग करें", te: "బరువు ఆధారిత మోతాదును ఉపయోగించండి", ta: "எடை அடிப்படையிலான அளவை பயன்படுத்தவும்", bn: "ওজন ভিত্তিক ডোজিং ব্যবহার করুন", ml: "ഭാരം അടിസ്ഥാനമാക്കിയുള്ള ഡോസ് ഉപയോഗിക്കുക", kn: "ತೂಕ ಆಧಾರಿತ ಡೋಸಿಂಗ್ ಬಳಸಿ", mr: "वजन-आधारित डोस वापरा", gu: "વજન-આધારિત ડોઝિંગનો ઉપયોગ કરો", es: "Use dosis basadas en el peso", fr: "Utiliser une posologie basée sur le poids" },
    measuringTools: { en: "Use provided measuring tools", hi: "प्रदान किए गए मापने वाले उपकरणों का उपयोग करें", te: "అందించిన కొలిచే సాధనాలను ఉపయోగించండి", ta: "வழங்கப்பட்ட அளவீட்டு கருவிகளைப் பயன்படுத்தவும்", bn: "প্রদত্ত পরিমাপ সরঞ্জাম ব্যবহার করুন", ml: "നൽകിയിട്ടുള്ള അളക്കുന്ന ഉപകരണങ്ങൾ ഉപയോഗിക്കുക", kn: "ಒದಗಿಸಿದ ಅಳತೆ ಸಾಧನಗಳನ್ನು ಬಳಸಿ", mr: "प्रदान केलेली मोजमाप साधने वापरा", gu: "પૂરા પાડવામાં આવેલ માપન સાધનોનો ઉપયોગ કરો", es: "Use las herramientas de medición provistas", fr: "Utiliser les outils de mesure fournis" },
    keepOutReach: { en: "Keep out of reach", hi: "पहुंच से दूर रखें", te: "అందుబాటులో లేకుండా ఉంచండి", ta: "எட்டாதவாறு வைக்கவும்", bn: "নাগালের বাইরে রাখুন", ml: "കൈയെത്താത്ത ദൂരത്ത് സൂക്ഷിക്കുക", kn: "ಕೈಗೆಟುಕದಂತೆ ಇಡಿ", mr: "आवाक्याबाहेर ठेवा", gu: "પહોંચથી દૂર રાખો", es: "Mantener fuera del alcance", fr: "Tenir hors de portée" }
  };
  return mapping[key]?.[lang] || mapping[key]?.['en'] || key;
};


interface MedicationSectionProps {
  userTier: UserTier;
  onConsultAI?: (message: string) => void;
  onNavigate?: (view: any) => void;
  language?: Language;
}

export default function MedicationSection({ userTier, onConsultAI, onNavigate, language = 'en' }: MedicationSectionProps) {
  const { showError, showSuccess } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('recent_med_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load recent searches");
      }
    }
  }, []);

  const saveToRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_med_searches', JSON.stringify(updated));
  };

  const SAFETY_TIPS = [
    { icon: <Clock size={14} />, text: getMedTranslation("takeMeds", language) },
    { icon: <Droplets size={14} />, text: getMedTranslation("drinkWater", language) },
    { icon: <AlertTriangle size={14} />, text: getMedTranslation("checkExpiry", language) },
    { icon: <ShieldCheck size={14} />, text: getMedTranslation("keepPrescriptions", language) },
    { icon: <Thermometer size={14} />, text: getMedTranslation("storeCool", language) },
    { icon: <Baby size={14} />, text: getMedTranslation("keepChildren", language) },
    { icon: <Ban size={14} />, text: getMedTranslation("neverShare", language) },
  ];

  const handleSearch = async () => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return;

    saveToRecent(searchTerm);

    // Dynamic check using AI
    setSearchResult({ name: searchTerm, type: 'analyzing', info: 'Analyzing safety data...' });
      try {
        const aiResult = await gemini.checkMedicationSafety(searchTerm);
        if (aiResult && (aiResult.info || aiResult.reason)) {
          setSearchResult({ ...aiResult, name: searchTerm });
          showSuccess("AI Analysis Ready", `Safety report generated for ${searchTerm}.`);
        } else {
          throw new Error("Invalid AI response");
        }
      } catch (error: any) {
        console.error("Medication AI Error:", error);
        showError("Search Error", `Failed to retrieve safety data for ${searchTerm}.`);
        setSearchResult({ 
          name: searchTerm, 
          type: 'unknown', 
          info: 'Unable to retrieve specific safety data at this moment. Please consult a healthcare professional or try the AI Chat for a general report.' 
        });
      }
  };

  const handleConsultAI = (medName: string) => {
    if (onConsultAI) {
      let message = '';
      if (language === 'hi') {
        message = `मैं ${medName} की सुरक्षा और दुष्प्रभावों के बारे में जानना चाहता हूँ। क्या इसका भारत में उपयोग करना सुरक्षित है?`;
      } else if (language === 'te') {
        message = `నేను ${medName} యొక్క భద్రత మరియు దుష్ప్రభావాల గురించి తెలుసుకోవాలనుకుంటున్నాను. భారతదేశంలో దీనిని ఉపయోగించడం సురక్షితమేనా?`;
      } else if (language === 'ta') {
        message = `நான் ${medName} இன் பாதுகாப்பு மற்றும் பக்கவிளைவுகள் பற்றி அறிய விரும்புகிறேன். இந்தியாவில் இதைப் பயன்படுத்துவது பாதுகாப்பானதா?`;
      } else if (language === 'bn') {
        message = `আমি ${medName}-এর নিরাপত্তা এবং পার্শ্বপ্রতিক্রিয়া সম্পর্কে জানতে চাই। ভারতে কি এটি ব্যবহার করা নিরাপদ?`;
      } else if (language === 'ml') {
        message = `${medName}-ന്റെ സുരക്ഷയെക്കുറിച്ചും പാർശ്വഫലങ്ങളെക്കുറിച്ചും അറിയാൻ ഞാൻ ആഗ്രഹിക്കുന്നു. ഇന്ത്യയിൽ ഇത് ഉപയോഗിക്കുന്നത് സുരക്ഷിതമാണോ?`;
      } else if (language === 'kn') {
        message = `ನಾನು ${medName} ನ ಸುರಕ್ಷತೆ ಮತ್ತು ಅಡ್ಡಪರಿಣಾಮಗಳ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೇನೆ. ಭಾರತದಲ್ಲಿ ಇದನ್ನು ಬಳಸುವುದು ಸುರಕ್ಷಿತವೇ?`;
      } else if (language === 'mr') {
        message = `मला ${medName} च्या सुरक्षिततेबद्दल आणि दुष्परिणामांबद्दल जाणून घ्यायचे आहे. भारतात याचा वापर करणे सुरक्षित आहे का?`;
      } else if (language === 'gu') {
        message = `હું ${medName} ની સુરક્ષા અને આડઅસરો વિશે જાણવા માંગુ છું. શું ભારતમાં તેનો ઉપયોગ કરવો સુરક્ષિત છે?`;
      } else if (language === 'es') {
        message = `Quiero saber sobre la seguridad y los efectos secundarios de ${medName}. ¿Es seguro usarlo?`;
      } else if (language === 'fr') {
        message = `Je souhaite en savoir plus sur la sécurité et les effets secondaires de ${medName}. Est-il sûr de l'utiliser ?`;
      } else {
        message = `I want to know about the safety and side effects of ${medName}. Is it safe to use in India?`;
      }
      onConsultAI(message);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Safety Tips Carousel */}
      <div className="py-2.5 sm:py-4 bg-white border-y border-slate-100 -mx-4 sm:-mx-8 px-4 sm:px-8">
        <InfiniteCarousel 
          speed={45}
          items={SAFETY_TIPS.map((tip, i) => (
            <div key={`safety-tip-${i}`} className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-1.5 sm:py-2 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl">
              <div className="text-brand-600">{tip.icon}</div>
              <span className="text-[9px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest whitespace-nowrap">{tip.text}</span>
            </div>
          ))}
        />
      </div>

      {/* Header Section */}
      <div className="relative p-6 sm:p-8 lg:p-12 rounded-[2rem] sm:rounded-[3rem] bg-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-400 text-[9px] sm:text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            CDSCO Compliance Verified
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            Medication Safety & <span className="text-brand-400">Compliance</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-lg leading-relaxed">
            Search for medications to check their safety status and banned lists in India.
          </p>
          
          <div className="relative pt-2">
            <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} className="sm:w-[24px] sm:h-[24px]" />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Medication name..." 
              className="w-full pl-12 sm:pl-16 pr-32 sm:pr-40 py-4 sm:py-6 bg-white/5 border border-white/10 rounded-2xl sm:rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-white text-base sm:text-lg font-medium placeholder:text-slate-500"
            />
            <button 
              onClick={handleSearch}
              disabled={!searchTerm}
              className="absolute right-2 sm:right-3 top-2 sm:top-3 bottom-2 sm:bottom-3 px-4 sm:px-8 bg-brand-600 text-white rounded-xl sm:rounded-[1.5rem] text-xs sm:text-base font-bold hover:bg-brand-700 disabled:opacity-30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 shadow-sm"
            >
              Check
              <ChevronRight size={18} className="sm:w-[20px] sm:h-[20px]" />
            </button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchResult && (
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest self-center mr-2">Recent:</span>
              {recentSearches.map((s, i) => (
                <button
                  key={`recent-med-${i}`}
                  onClick={() => {
                    setSearchTerm(s);
                    handleSearch();
                  }}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold text-white hover:bg-white/20 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Search Result Overlay */}
          <AnimatePresence>
            {searchResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-white border border-slate-100 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      searchResult.type === 'banned' ? "bg-rose-50 text-rose-500" : 
                      searchResult.type === 'restricted' ? "bg-orange-50 text-orange-500" :
                      searchResult.type === 'unknown' ? "bg-amber-50 text-amber-500" : "bg-brand-50 text-brand-500"
                    )}>
                      {searchResult.type === 'banned' ? <Ban size={20} /> : 
                       searchResult.type === 'restricted' || searchResult.type === 'unknown' ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                    </div>
                    <h4 className="font-display font-bold text-lg sm:text-xl text-slate-800 truncate">{searchResult.name}</h4>
                  </div>
                  <button onClick={() => setSearchResult(null)} className="text-slate-400 hover:text-slate-600 shrink-0">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
                  {searchResult.type === 'analyzing' ? (
                    <div className="flex items-center gap-3 text-brand-600">
                      <Loader2 className="animate-spin" size={16} />
                      <span className="text-[10px] sm:text-sm font-bold animate-pulse uppercase tracking-widest">AI analysis in progress...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {searchResult.type === 'banned' ? (
                          <span className="text-rose-600 font-bold uppercase tracking-tight">BANNED IN INDIA</span>
                        ) : searchResult.type === 'restricted' ? (
                          <span className="text-orange-600 font-bold uppercase tracking-tight">RESTRICTED MEDICATION</span>
                        ) : searchResult.type === 'unknown' ? (
                          <span className="text-amber-600 font-bold uppercase tracking-tight">UNVERIFIED DATA</span>
                        ) : null}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {searchResult.type === 'banned' || searchResult.type === 'restricted' ? searchResult.reason : searchResult.info}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleConsultAI(searchResult.name)}
                    className="flex-1 py-3.5 sm:py-4 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    Deep AI Report
                    <ChevronRight size={16} />
                  </button>
                  <button 
                    onClick={() => userTier === 'premium' ? {} : onNavigate?.('premium-upgrade')}
                    className={cn(
                      "flex-1 py-3.5 sm:py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border-2",
                      userTier === 'premium' 
                        ? "bg-white border-brand-100 text-brand-600 hover:bg-brand-50" 
                        : "bg-slate-50 border-slate-100 text-slate-400"
                    )}
                  >
                    <Zap size={16} className={userTier === 'premium' ? "text-amber-500" : "text-slate-300"} />
                    Interactions Check
                    {userTier === 'free' && <Crown size={12} className="text-amber-400" fill="currentColor" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[2rem] bg-brand-50 border border-brand-100 flex items-start gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shrink-0 shadow-sm">
              <Search size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-brand-900">Dynamic AI Verification</h4>
              <p className="text-sm text-brand-700 leading-relaxed">
                Enter any medication in the search bar above. Vitalis AI will instantly cross-reference it against the latest medical guidelines, compliance standards, and regulatory alerts to generate a customized safety report for you.
              </p>
            </div>
          </div>
        </div>

        {/* Guidelines Sidebar */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
              <Info size={20} />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-800">Usage Guidelines</h3>
          </div>

          <div className="space-y-4">
            <div className="p-8 rounded-[2.5rem] bg-brand-600 text-white space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <HeartPulse size={80} />
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={24} />
                <h4 className="font-bold text-lg">Adult Safety</h4>
              </div>
              <ul className="space-y-3">
                {[getMedTranslation("followDosage", language), getMedTranslation("checkInteractions", language), getMedTranslation("avoidAlcohol", language)].map((item, index) => (
                  <li key={`adult-safety-${item}`} className="flex items-center gap-3 text-sm font-medium text-brand-50">
                    <div className="w-1.5 h-1.5 bg-brand-200 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-slate-100 text-slate-800 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Baby size={80} />
              </div>
              <div className="flex items-center gap-3 text-brand-600">
                <AlertTriangle size={24} />
                <h4 className="font-bold text-lg">Pediatric Care</h4>
              </div>
              <ul className="space-y-3">
                {[getMedTranslation("weightBased", language), getMedTranslation("measuringTools", language), getMedTranslation("keepOutReach", language)].map((item, index) => (
                  <li key={`pediatric-care-${item}`} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-start gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-amber-900">Medical Disclaimer</h4>
            <p className="text-sm text-amber-700 leading-relaxed">
              The information provided here is for educational purposes only. **Vitalis** does not provide medical prescriptions. Always consult a qualified healthcare professional.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-brand-50 border border-brand-100 flex items-start gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shrink-0 shadow-sm">
            <Scale size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-brand-900">CDSCO Regulatory Notice</h4>
            <p className="text-sm text-brand-700 leading-relaxed">
              All medication data is referenced against the **Central Drugs Standard Control Organisation (CDSCO)** guidelines. Selling or distributing banned Fixed Dose Combinations (FDCs) is a punishable offense under the Drugs and Cosmetics Act.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
