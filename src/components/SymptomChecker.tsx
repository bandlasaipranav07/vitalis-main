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
                            {s}
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
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group}</label>
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
                                {s}
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
                            {s}
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
