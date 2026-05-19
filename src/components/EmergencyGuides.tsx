import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Heart, Activity, Info, ChevronRight, PhoneCall, Scale, Flame, Droplets, Wind, CheckCircle2, AlertCircle, MapPin, Loader2, ExternalLink, Siren, Zap } from 'lucide-react';
import { gemini } from '../services/gemini';
import Markdown from 'react-markdown';
import InfiniteCarousel from './InfiniteCarousel';
import { Language } from '../types';

const getEmergencyTranslation = (key: string, lang: Language) => {
  const mapping: Record<string, Partial<Record<Language, string>>> = {
    stayCalm: { en: "Stay calm and speak clearly.", hi: "शांत रहें और स्पष्ट रूप से बोलें।", te: "శాంతంగా ఉండి స్పష్టంగా మాట్లాడండి.", ta: "அமைதியாக இருந்து தெளிவாகப் பேசுங்கள்.", bn: "শান্ত থাকুন এবং স্পষ্টভাবে কথা বলুন।", ml: "ശാന്തമായിരിക്കുക, വ്യക്തമായി സംസാരിക്കുക.", kn: "ಶಾಂತವಾಗಿರಿ ಮತ್ತು ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ.", mr: "शांत राहा आणि स्पष्टपणे बोला.", gu: "શાંત રહો અને સ્પષ્ટ રીતે બોલો.", es: "Mantén la calma y habla con claridad.", fr: "Restez calme et parlez clairement." },
    provideLocation: { en: "Provide your exact location.", hi: "अपना सटीक स्थान प्रदान करें।", te: "మీ ఖచ్చితమైన స్థానాన్ని అందించండి.", ta: "உங்கள் சரியான இருப்பிடத்தை வழங்கவும்.", bn: "আপনার সঠিক অবস্থান প্রদান করুন।", ml: "നിങ്ങളുടെ കൃത്യമായ സ്ഥാനം നൽകുക.", kn: "ನಿಮ್ಮ ನಿಖರವಾದ ಸ್ಥಳವನ್ನು ಒದಗಿಸಿ.", mr: "तुमचे अचूक स्थान द्या.", gu: "તમારું ચોક્કસ સ્થાન પ્રદાન કરો.", es: "Proporciona tu ubicación exacta.", fr: "Fournissez votre emplacement exact." },
    checkPulse: { en: "Check for pulse and breathing.", hi: "नाड़ी और सांस की जांच करें।", te: "పల్స్ మరియు శ్వాస కోసం తనిఖీ చేయండి.", ta: "நாடி மற்றும் சுவாசத்தை சரிபார்க்கவும்.", bn: "নাড়ি এবং শ্বাস প্রশ্বাস পরীক্ষা করুন।", ml: "പൾസും ശ്വസനവും പരിശോധിക്കുക.", kn: "ನಾಡಿ ಮತ್ತು ಉಸಿರಾಟವನ್ನು ಪರಿಶೀಲಿಸಿ.", mr: "नाडी आणि श्वासोच्छ्वास तपासा.", gu: "નાડી અને શ્વાસ માટે તપાસો.", es: "Revisa el pulso y la respiración.", fr: "Vérifiez le pouls et la respiration." },
    doNotMove: { en: "Do not move victims unless necessary.", hi: "जब तक आवश्यक न हो पीड़ितों को न हिलाएं।", te: "అవసరమైతే తప్ప బాధితులను కదిలించవద్దు.", ta: "அவசியமில்லாமல் பாதிக்கப்பட்டவர்களை நகர்த்த வேண்டாம்.", bn: "প্রয়োজন না হলে ক্ষতিগ্রস্থদের সরাবেন না।", ml: "ആവശ്യമില്ലാതെ ഇരകളെ മാറ്റരുത്.", kn: "ಅಗತ್ಯವಿಲ್ಲದಿದ್ದರೆ ಬಲಿಪಶುಗಳನ್ನು ಸರಿಸಬೇಡಿ.", mr: "गरज असल्याशिवाय बळींना हलवू नका.", gu: "જરૂર ન હોય ત્યાં સુધી પીડિતોને હલાવશો નહીં.", es: "No muevas a las víctimas a menos que sea necesario.", fr: "Ne déplacez pas les victimes sauf si nécessaire." },
    
    // UI Elements
    emergencyAction: { en: "Emergency Action", hi: "आपातकालीन कार्रवाई", te: "అత్యవసర చర్య", ta: "அவசரகால நடவடிக்கை", bn: "জরুরী পদক্ষেপ", ml: "അടിയന്തര നടപടി", kn: "ತುರ್ತು ಕ್ರಮ", mr: "आणीबाणी कारवाई", gu: "કટોકટી પગલાં", es: "Acción de Emergencia", fr: "Action d'urgence" },
    stayCalmSaveLife: { en: "Stay calm. Save a life.", hi: "शांत रहें। जान बचाएं।", te: "శాంతంగా ఉండండి. ప్రాణాన్ని కాపాడండి.", ta: "அமைதியாக இருங்கள். உயிரைக் காப்பாற்றுங்கள்.", bn: "শান্ত থাকুন। জীবন বাঁচান।", ml: "ശാന്തമായിരിക്കുക. ജീവൻ രക്ഷിക്കുക.", kn: "ಶಾಂತವಾಗಿರಿ. ಜೀವ ಉಳಿಸಿ.", mr: "शांत राहा. जीव वाचवा.", gu: "શાંત રહો. જીવ બચાવો.", es: "Mantén la calma. Salva una vida.", fr: "Restez calme. Sauvez une vie." },
    call108: { en: "Call 108", hi: "108 पर कॉल करें", te: "108 కు కాల్ చేయండి", ta: "108 ஐ அழைக்கவும்", bn: "১০৮ এ কল করুন", ml: "108 ൽ വിളിക്കുക", kn: "108 ಗೆ ಕರೆ ಮಾಡಿ", mr: "108 वर कॉल करा", gu: "108 પર કૉલ કરો", es: "Llama al 108", fr: "Appelez le 108" },
    dial108Now: { en: "Dial 108 Now", hi: "अभी 108 डायल करें", te: "ఇప్పుడే 108 డయల్ చేయండి", ta: "இப்போதே 108 ஐ அழைக்கவும்", bn: "এখনই ১০৮ ডায়াল করুন", ml: "ഇപ്പോൾ 108 ഡയൽ ചെയ്യുക", kn: "ಈಗ 108 ಡಯಲ್ ಮಾಡಿ", mr: "आता 108 डायल करा", gu: "હવે 108 ડાયલ કરો", es: "Marca el 108 Ahora", fr: "Composez le 108 Maintenant" },
    ambulanceMedical: { en: "Ambulance • Medical • Accident", hi: "एम्बुलेंस • चिकित्सा • दुर्घटना", te: "అంబులెన్స్ • వైద్యం • ప్రమాదం", ta: "ஆம்புலன்ஸ் • மருத்துவம் • விபத்து", bn: "অ্যাম্বুলেন্স • চিকিৎসা • দুর্ঘটনা", ml: "ആംബുലൻസ് • മെഡിക്കൽ • അപകടം", kn: "ಆಂಬ್ಯುಲೆನ್ಸ್ • ವೈದ್ಯಕೀಯ • ಅಪಘಾತ", mr: "रुग्णवाहिका • वैद्यकीय • अपघात", gu: "એમ્બ્યુલન્સ • તબીબી • અકસ્માત", es: "Ambulancia • Médico • Accidente", fr: "Ambulance • Médical • Accident" },
    callImmediately: { en: "Call immediately for any life-threatening situation. Provide your location clearly and stay on the line.", hi: "किसी भी जानलेवा स्थिति के लिए तुरंत कॉल करें। अपना स्थान स्पष्ट रूप से बताएं और लाइन पर बने रहें।", te: "ఏదైనా ప్రాణాంతక పరిస్థితికి వెంటనే కాల్ చేయండి. మీ స్థానాన్ని స్పష్టంగా అందించండి మరియు లైన్‌లో ఉండండి.", ta: "உயிருக்கு ஆபத்தான எந்தவொரு சூழ்நிலைக்கும் உடனடியாக அழைக்கவும். உங்கள் இருப்பிடத்தை தெளிவாக வழங்கி, இணைப்பில் இருக்கவும்.", bn: "যেকোনো জীবন-ঝুঁকিপূর্ণ পরিস্থিতির জন্য অবিলম্বে কল করুন। আপনার অবস্থান স্পষ্টভাবে প্রদান করুন এবং লাইনে থাকুন।", ml: "ജീവന് ഭീഷണിയുള്ള ഏതൊരു സാഹചര്യത്തിനും ഉടൻ വിളിക്കുക. നിങ്ങളുടെ സ്ഥാനം വ്യക്തമായി നൽകുകയും ലൈനിൽ തുടരുകയും ചെയ്യുക.", kn: "ಯಾವುದೇ ಜೀವಕ್ಕೆ ಅಪಾಯಕಾರಿ ಪರಿಸ್ಥಿತಿಗೆ ತಕ್ಷಣ ಕರೆ ಮಾಡಿ. ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಒದಗಿಸಿ ಮತ್ತು ಲೈನ್‌ನಲ್ಲಿರಿ.", mr: "कोणत्याही जीवघेण्या परिस्थितीसाठी त्वरित कॉल करा. तुमचे स्थान स्पष्टपणे द्या आणि लाईनवर राहा.", gu: "કોઈપણ જીવલેણ પરિસ્થિતિ માટે તાત્કાલિક કૉલ કરો. તમારું સ્થાન સ્પષ્ટ રીતે પ્રદાન કરો અને લાઇન પર રહો.", es: "Llama de inmediato ante cualquier situación que ponga en riesgo la vida.", fr: "Appelez immédiatement pour toute situation potentiellement mortelle." },
    nearbyHospitals: { en: "Nearby Hospitals", hi: "निकटवर्ती अस्पताल", te: "సమీప ఆసుపత్రులు", ta: "அருகிலுள்ள மருத்துவமனைகள்", bn: "কাছাকাছি হাসপাতাল", ml: "സമീപമുള്ള ആശുപത്രികൾ", kn: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು", mr: "जवळची रुग्णालये", gu: "નજીકની હોસ્પિટલો", es: "Hospitales cercanos", fr: "Hôpitaux à proximité" },
    findClosest: { en: "Find the closest emergency care centers", hi: "निकटतम आपातकालीन देखभाल केंद्र खोजें", te: "సమీప అత్యవసర సంరక్షణ కేంద్రాలను కనుగొనండి", ta: "அருகிலுள்ள அவசரகால பராமரிப்பு மையங்களைக் கண்டறியவும்", bn: "নিকটতম জরুরী পরিচর্যা কেন্দ্রগুলি খুঁজুন", ml: "ഏറ്റവും അടുത്തുള്ള എമർജൻസി കെയർ സെൻ്ററുകൾ കണ്ടെത്തുക", kn: "ಹತ್ತಿರದ ತುರ್ತು ಆರೈಕೆ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಿ", mr: "सर्वाधिक जवळची आणीबाणी सेवा केंद्रे शोधा", gu: "નજીકના કટોકટી સંભાળ કેન્દ્રો શોધો", es: "Encuentra los centros de emergencia más cercanos", fr: "Trouvez les centres de soins d'urgence les plus proches" },
    findNearMe: { en: "Find Near Me", hi: "मेरे आस-पास खोजें", te: "నా సమీపంలో కనుగొనండి", ta: "எனக்கு அருகில் கண்டறியவும்", bn: "আমার কাছাকাছি খুঁজুন", ml: "എൻ്റെ അടുത്ത് കണ്ടെത്തുക", kn: "ನನ್ನ ಹತ್ತಿರ ಹುಡುಕಿ", mr: "माझ्या जवळ शोधा", gu: "મારી નજીક શોધો", es: "Buscar cerca de mí", fr: "Trouver à proximité" },
    locating: { en: "Locating...", hi: "खोजा जा रहा है...", te: "వెతుకుతోంది...", ta: "கண்டறியப்படுகிறது...", bn: "খোঁজা হচ্ছে...", ml: "കണ്ടെത്തുന്നു...", kn: "ಹುಡುಕಲಾಗುತ್ತಿದೆ...", mr: "शोधत आहे...", gu: "શોધી રહ્યું છે...", es: "Localizando...", fr: "Localisation..." },
    
    // Fits section
    seizures: { en: "Seizures (Fits)", hi: "दौरे (मिर्गी)", te: "మూర్ఛలు (ఫిట్స్)", ta: "வலிப்பு (பிட்ஸ்)", bn: "খিঁচুনি (ফিট)", ml: "ഫിറ്റ്സ് (അപസ്മാരം)", kn: "ಮೂರ್ಛೆ ರೋಗ (ಫಿಟ್ಸ್)", mr: "फेफरे (फिट्स)", gu: "આંચકી (ફિટ્સ)", es: "Convulsiones (Ataques)", fr: "Convulsions (Crises)" },
    doThis: { en: "DO THIS", hi: "यह करें", te: "ఇలా చేయండి", ta: "இதைச் செய்யுங்கள்", bn: "এটি করুন", ml: "ഇത് ചെയ്യുക", kn: "ಇದನ್ನು ಮಾಡಿ", mr: "हे करा", gu: "આ કરો", es: "HAZ ESTO", fr: "FAITES CECI" },
    neverDoThis: { en: "NEVER DO THIS", hi: "यह कभी न करें", te: "ఇది ఎప్పుడూ చేయకండి", ta: "இதை ஒருபோதும் செய்யாதீர்கள்", bn: "কখনও এটি করবেন মোহর", ml: "ഇതൊരിക്കലും ചെയ്യരുത്", kn: "ಇದನ್ನು ಎಂದಿಗೂ ಮಾಡಬೇಡಿ", mr: "हे कधीही करू नका", gu: "આ ક્યારેય કરશો નહીં", es: "NUNCA HAGAS ESTO", fr: "NE FAITES JAMAIS CELA" },
    actionSteps: { en: "Action Steps", hi: "कार्रवाई के कदम", te: "చర్య దశలు", ta: "செயல் படிகள்", bn: "কার্যপ্রণালী", ml: "നടപടിക്രമങ്ങൾ", kn: "ಕ್ರಿಯಾ ಹಂತಗಳು", mr: "कृतीचे टप्पे", gu: "ક્રિયાનાં પગલાં", es: "Pasos a seguir", fr: "Étapes d'action" },
    criticalNotToDo: { en: "Critical: What NOT to do", hi: "महत्वपूर्ण: क्या नहीं करना है", te: "క్లిష్టమైనది: ఏమి చేయకూడదు", ta: "முக்கியமானது: என்ன செய்யக்கூடாது", bn: "গুরুত্বপূর্ণ: কী করবেন না", ml: "പ്രധാനപ്പെട്ടത്: എന്ത് ചെയ്യരുത്", kn: "ನಿರ್ಣಾಯಕ: ಏನು ಮಾಡಬಾರದು", mr: "महत्त्वाचे: काय करू नये", gu: "મહત્વપૂર્ણ: શું ન કરવું", es: "Crítico: Lo que NO se debe hacer", fr: "Critique : Ce qu'il ne faut PAS faire" },
    goodSamaritanTitle: { en: "The Good Samaritan Law (India)", hi: "गुड समैरिटन लॉ (भारत)", te: "గుడ్ సమారిటన్ చట్టం (భారతదేశం)", ta: "நல்ல சமாரியன் சட்டம் (இந்தியா)", bn: "গুড সামারিটান আইন (ভারত)", ml: "നല്ല ശമര്യക്കാരൻ നിയമം (ഇന്ത്യ)", kn: "ಗುಡ್ ಸಮರಿಟನ್ ಕಾನೂನು (ಭಾರತ)", mr: "द गुड समरिटन लॉ (भारत)", gu: "ધ ગુડ સમરિટન લૉ (ભારત)", es: "Ley del Buen Samaritano (India)", fr: "Loi du Bon Samaritain (Inde)" },
    goodSamaritanSub: { en: "The Supreme Court of India has established guidelines to protect bystanders who help road accident victims.", hi: "भारत के सर्वोच्च न्यायालय ने सड़क दुर्घटना पीड़ितों की मदद करने वाले दर्शकों की सुरक्षा के लिए दिशानिर्देश स्थापित किए हैं।", te: "రోడ్డు ప్రమాద బాధితులకు సహాయం చేసే వారిని రక్షించడానికి భారత సుప్రీంకోర్టు మార్గదర్శకాలను ఏర్పాటు చేసింది.", ta: "சாலை விபத்தில் பாதிக்கப்பட்டவர்களுக்கு உதவுபவர்களைப் பாதுகாக்க உச்ச நீதிமன்றம் வழிகாட்டுதல்களை அமைத்துள்ளது.", bn: "সড়ক দুর্ঘটনা ক্ষতিগ্রস্থদের সাহায্যকারী পথচারীদের সুরক্ষার জন্য ভারতের সুপ্রিম কোর্ট নির্দেশিকা প্রতিষ্ঠা করেছে।", ml: "റോഡപകടത്തിൽപ്പെട്ടവരെ സഹായിക്കുന്നവർക്കായി ഇന്ത്യയുടെ സുപ്രീം കോടതി മാർഗ്ഗനിർദ്ദേശങ്ങൾ രൂപീകരിച്ചിട്ടുണ്ട്.", kn: "ರಸ್ತೆ ಅಪಘಾತದ ಸಂತ್ರಸ್ತರಿಗೆ ಸಹಾಯ ಮಾಡುವವರನ್ನು ರಕ್ಷಿಸಲು ಭಾರತದ ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಸ್ಥಾಪಿಸಿದೆ.", mr: "रस्ते अपघातग्रस्तांना मदत करणाऱ्यांना संरक्षण देण्यासाठी भारताच्या सर्वोच्च न्यायालयाने मार्गदर्शक तत्त्वे स्थापित केली आहेत.", gu: "રસ્તા અકસ્માત પીડિતોને મદદ કરનારાઓને સુરક્ષિત કરવા માટે ભારતની સર્વોચ્ચ અદાલતે માર્ગદર્શિકા સ્થાપિત કરી છે.", es: "El Tribunal Supremo ha establecido directrices para proteger a quienes ayudan a las víctimas.", fr: "La Cour suprême a établi des directives pour protéger ceux qui aident les victimes." },

    // CPR
    cprTitle: { en: 'Cardiac Arrest (CPR)', hi: 'कार्डियक अरेस्ट (सीपीआर)', te: 'కార్డియాక్ అరెస్ట్ (CPR)', ta: 'மாரடைப்பு (CPR)', bn: 'কার্ডিয়াক অ্যারেস্ট (CPR)' },
    cprStep1: { en: 'Check Response: Tap and shout "Are you okay?"', hi: 'प्रतिक्रिया जांचें: थपथपाएं और चिल्लाएं "क्या आप ठीक हैं?"', te: 'ప్రతిస్పందన తనిఖీ: తట్టి, "మీరు బాగున్నారా?" అని గట్టిగా అడగండి.', ta: 'பதிலை சரிபார்க்கவும்: தட்டி "நீங்கள் நலமா?" என்று கேட்கவும்.', bn: 'প্রতিক্রিয়া পরীক্ষা করুন: আলতো চাপুন এবং চিৎকার করুন "আপনি কি ঠিক আছেন?"' },
    cprStep2: { en: 'Call 108: If no response, call for help immediately.', hi: '108 कॉल करें: यदि कोई प्रतिक्रिया नहीं है, तो तुरंत मदद के लिए कॉल करें।', te: '108 కు కాల్ చేయండి: ప్రతిస్పందన లేకపోతే వెంటనే కాల్ చేయండి.', ta: '108 ஐ அழைக்கவும்: பதில் இல்லையென்றால் உடனடியாக அழைக்கவும்.', bn: '১০৮ এ কল করুন: কোন সাড়া না দিলে অবিলম্বে সাহায্যের জন্য কল করুন।' },
    cprStep3: { en: 'Check Breathing: Look for chest movement for 10 seconds.', hi: 'सांस की जांच: 10 सेकंड के लिए छाती की गति देखें।', te: 'శ్వాసను తనిఖీ చేయండి: 10 సెకన్ల పాటు ఛాతీ కదలిక కోసం చూడండి.', ta: 'சுவாசத்தை சரிபார்க்கவும்: 10 விநாடிகளுக்கு மார்பு இயக்கத்தை கவனிக்கவும்.', bn: 'শ্বাস প্রশ্বাস পরীক্ষা করুন: 10 সেকেন্ডের জন্য বুকের নড়াচড়া লক্ষ্য করুন।' },
    cprStep4: { en: 'Start Compressions: Push HARD and FAST in the center of the chest.', hi: 'कम्प्रेशन शुरू करें: छाती के केंद्र में ज़ोर से और तेज़ी से धकेलें।', te: 'కుదింపులు ప్రారంభించండి: ఛాతీ మధ్యలో బలంగా మరియు వేగంగా నెట్టండి.', ta: 'அழுத்தங்களை தொடங்கவும்: மார்பின் மையத்தில் கடினமாகவும் வேகமாகவும் அழுத்தவும்.', bn: 'কম্প্রেশন শুরু করুন: বুকের কেন্দ্রে শক্ত এবং দ্রুত চাপ দিন।' },
    cprStep5: { en: 'Rate: 100-120 compressions per minute.', hi: 'दर: 100-120 कम्प्रेशन प्रति मिनट।', te: 'రేటు: నిమిషానికి 100-120 కుదింపులు.', ta: 'வீதம்: நிமிடத்திற்கு 100-120 அழுத்தங்கள்.', bn: 'হার: প্রতি মিনিটে 100-120 কম্প্রেশন।' },
    cprDont1: { en: 'Do not stop until help arrives or the person wakes up.', hi: 'जब तक मदद न आ जाए या व्यक्ति जाग न जाए, तब तक न रुकें।', te: 'సహాయం వచ్చే వరకు లేదా మేల్కొనే వరకు ఆపకండి.', ta: 'உதவி வரும் வரை அல்லது நபர் விழிக்கும் வரை நிறுத்த வேண்டாம்.', bn: 'সাহায্য না আসা পর্যন্ত বা ব্যক্তিটি জেগে না ওঠা পর্যন্ত থামবেন না।' },
    cprDont2: { en: 'Do not worry about breaking ribs; saving a life is the priority.', hi: 'पसलियों के टूटने की चिंता न करें; जान बचाना प्राथमिकता है।', te: 'పక్కటెముకలు విరగడం గురించి చింతించకండి; ప్రాణం కాపాడటమే ముఖ్యం.', ta: 'விலா எலும்புகள் உடைவதைப் பற்றி கவலைப்பட வேண்டாம்; உயிரைக் காப்பாற்றுவதே முன்னுரிமை.', bn: 'পাঁজর ভাঙার চিন্তা করবেন না; জীবন বাঁচানোই অগ্রাধিকার।' },

    // Choking
    chokeTitle: { en: 'Choking (Heimlich)', hi: 'गले में फंदा (हेमलिच)', te: 'ఉక్కిరిబిక్కిరి (హీమ్లిచ్)', ta: 'மூச்சுத் திணறல் (ஹெய்ம்லிச்)', bn: 'দম বন্ধ হওয়া (হেইমলিচ)' },
    chokeStep1: { en: 'Stand Behind: Wrap your arms around their waist.', hi: 'पीछे खड़े हों: अपनी भुजाओं को उनकी कमर के चारों ओर लपेटें।', te: 'వెనుక నిలబడండి: వారి నడుము చుట్టూ మీ చేతులను చుట్టండి.', ta: 'பின்னால் நில்லுங்கள்: அவர்களின் இடுப்பை சுற்றி கைகளை வளைக்கவும்.', bn: 'পিছনে দাঁড়ান: তাদের কোমরে আপনার বাহু জড়িয়ে ধরুন।' },
    chokeStep2: { en: 'Make a Fist: Place it just above their navel (belly button).', hi: 'मुट्ठी बनाएं: इसे उनकी नाभि के ठीक ऊपर रखें।', te: 'పిడికిలి చేయండి: నాభికి కొద్దిగా పైన ఉంచండి.', ta: 'முஷ்டி அமையுங்கள்: தொப்புளுக்கு மேலே வைக்கவும்.', bn: 'একটি মুষ্টি তৈরি করুন: এটি তাদের নাভির ঠিক উপরে রাখুন।' },
    chokeStep3: { en: 'Thrust: Pull inward and upward sharply (like an "J" shape).', hi: 'धक्का: अंदर और ऊपर की ओर तेजी से खींचें ("J" आकार की तरह)।', te: 'థ్రస్ట్: వేగంగా లోపలికి మరియు పైకి లాగండి ("J" ఆకారంలా).', ta: 'உந்துதல்: ("J" வடிவம் போல) கூர்மையாக உள்நோக்கியும் மேல்நோக்கியும் இழுக்கவும்.', bn: 'জোর দিন: ভিতরের দিকে এবং উপরের দিকে জোরে টানুন ("J" আকৃতির মতো)।' },
    chokeStep4: { en: 'Repeat: Continue until the object is forced out or they pass out.', hi: 'दोहराएं: तब तक जारी रखें जब तक वस्तु बाहर न निकल जाए या वे बेहोश न हो जाएं।', te: 'పునరావృతం చేయండి: వస్తువు బయటకు వచ్చే వరకు లేదా వారు అపస్మారక స్థితికి వెళ్లే వరకు కొనసాగించండి.', ta: 'மீண்டும் செய்யவும்: பொருள் வெளியே வரும் வரை அல்லது அவர்கள் மயக்கமடையும் வரை தொடரவும்.', bn: 'পুনরাবৃত্তি করুন: বস্তুটি বের না হওয়া পর্যন্ত বা তারা জ্ঞান না হারানো পর্যন্ত চালিয়ে যান।' },
    chokeStep5: { en: 'If Unconscious: Start CPR immediately.', hi: 'यदि बेहोश हो जाएं: तुरंत सीपीआर शुरू करें।', te: 'అపస్మారక స్థితికి వెళితే: వెంటనే CPR ప్రారంభించండి.', ta: 'மயக்கமடைந்தால்: உடனடியாக CPR ஐத் தொடங்கவும்.', bn: 'অচেতন হলে: অবিলম্বে CPR শুরু করুন।' },
    chokeDont1: { en: 'Do not try to reach for the object unless you can clearly see it.', hi: 'जब तक आप वस्तु को स्पष्ट रूप से नहीं देख सकते, तब तक उसे निकालने का प्रयास न करें।', te: 'మీరు వస్తువును స్పష్టంగా చూడగలిగితే తప్ప దాన్ని తీయడానికి ప్రయత్నించకండి.', ta: 'பொருளைத் தெளிவாகப் பார்க்க முடியாவிட்டால் அதை எடுக்க முயற்சிக்க வேண்டாம்.', bn: 'বস্তুটি স্পষ্টভাবে না দেখলে তা বের করার চেষ্টা করবেন না।' },
    chokeDont2: { en: 'Do not give them water while they are choking.', hi: 'उनके गले में कुछ फंसा होने पर उन्हें पानी न दें।', te: 'వారు ఉక్కిరిబిక్కిరి అవుతున్నప్పుడు వారికి నీరు ఇవ్వకండి.', ta: 'அவர்களுக்கு மூச்சுத் திணறல் ஏற்படும் போது தண்ணீர் கொடுக்க வேண்டாம்.', bn: 'তারা দম বন্ধ হওয়ার সময় তাদের জল দেবেন না।' },

    // Bleeding
    bleedTitle: { en: 'Severe Bleeding', hi: 'गंभीर रक्तस्राव', te: 'తీవ్రమైన రక్తస్రావం', ta: 'கடுமையான இரத்தப்போக்கு', bn: 'মারাত্মক রক্তপাত' },
    bleedStep1: { en: 'Apply Pressure: Use a clean cloth or your hands to press hard on the wound.', hi: 'दबाव डालें: घाव पर ज़ोर से दबाने के लिए साफ कपड़े या अपने हाथों का उपयोग करें।', te: 'ఒత్తిడిని వర్తింపజేయండి: గాయంపై గట్టిగా నొక్కడానికి శుభ్రమైన వస్త్రాన్ని లేదా మీ చేతులను ఉపయోగించండి.', ta: 'அழுத்தத்தைப் பயன்படுத்துங்கள்: காயத்தில் கடினமாக அழுத்த சுத்தமான துணி அல்லது கைகளைப் பயன்படுத்தவும்.', bn: 'চাপ প্রয়োগ করুন: ক্ষতে শক্তভাবে চাপ দিতে একটি পরিষ্কার কাপড় বা আপনার হাত ব্যবহার করুন।' },
    bleedStep2: { en: 'Maintain Pressure: Do not lift the cloth to check if it stopped.', hi: 'दबाव बनाए रखें: यह जांचने के लिए कि रक्तस्राव रुका है या नहीं, कपड़ा न उठाएं।', te: 'ఒత్తిడిని కొనసాగించండి: రక్తం ఆగిందో లేదో తనిఖీ చేయడానికి వస్త్రాన్ని పైకి ఎత్తకండి.', ta: 'அழுத்தத்தை பராமரிக்கவும்: இரத்தம் நின்றதா என சரிபார்க்க துணியை உயர்த்த வேண்டாம்.', bn: 'চাপ বজায় রাখুন: রক্তপাত বন্ধ হয়েছে কিনা তা দেখতে কাপড় তুলবেন না।' },
    bleedStep3: { en: 'Add Layers: If blood soaks through, add more cloth on top.', hi: 'परतें जोड़ें: यदि खून रिसता है, तो ऊपर से और कपड़ा डालें।', te: 'పొరలను జోడించండి: రక్తం బయటకు వస్తే, పైన మరింత వస్త్రాన్ని జోడించండి.', ta: 'அடுக்குகளைச் சேர்க்கவும்: இரத்தம் கசிந்தால், மேலே மேலும் துணியைச் சேர்க்கவும்.', bn: 'স্তর যোগ করুন: যদি রক্ত ভিজে যায়, তবে উপরে আরও কাপড় যোগ করুন।' },
    bleedStep4: { en: 'Elevate: Keep the wounded area above the level of the heart if possible.', hi: 'ऊपर उठाएं: यदि संभव हो तो घायल हिस्से को हृदय के स्तर से ऊपर रखें।', te: 'పైకి ఎత్తండి: వీలైతే గాయపడిన ప్రాంతాన్ని గుండె స్థాయి కంటే పైన ఉంచండి.', ta: 'உயர்த்தவும்: முடிந்தால் காயமடைந்த பகுதியை இதயத்தின் மட்டத்திற்கு மேலே வைக்கவும்.', bn: 'উঁচু করুন: সম্ভব হলে আহত স্থানটি হৃৎপিণ্ডের স্তরের উপরে রাখুন।' },
    bleedStep5: { en: 'Tourniquet: Only use as a last resort for life-threatening limb bleeding.', hi: 'टूर्निकेट: केवल जीवन-धमकाने वाले अंग के रक्तस्राव के लिए अंतिम उपाय के रूप में उपयोग करें।', te: 'టూర్నికెట్: ప్రాణాపాయక అవయవ రక్తస్రావం కోసం చివరి ప్రయత్నంగా మాత్రమే ఉపయోగించండి.', ta: 'டூர்னிக்கெட்: உயிருக்கு ஆபத்தான மூட்டு இரத்தப்போக்குக்கு மட்டுமே கடைசி வழியாக பயன்படுத்தவும்.', bn: 'টুর্নিকেট: শুধুমাত্র জীবন-হুমকিপূর্ণ অঙ্গ রক্তপাতের জন্য শেষ অবলম্বন হিসাবে ব্যবহার করুন।' },
    bleedDont1: { en: 'Do not remove the original cloth; it helps clotting.', hi: 'मूल कपड़े को न हटाएं; यह थक्का जमने में मदद करता है।', te: 'అసలు వస్త్రాన్ని తొలగించవద్దు; ఇది రక్తం గడ్డకట్టడానికి సహాయపడుతుంది.', ta: 'அசல் துணியை அகற்ற வேண்டாம்; இது உறைவதற்கு உதவுகிறது.', bn: 'মূল কাপড়টি সরিয়ে ফেলবেন না; এটি জমাট বাঁধতে সাহায্য করে।' },
    bleedDont2: { en: 'Do not wash a severely bleeding wound with water.', hi: 'गंभीर रूप से बहने वाले घाव को पानी से न धोएं।', te: 'తీవ్రంగా రక్తస్రావం అవుతున్న గాయాన్ని నీటితో కడగవద్దు.', ta: 'கடுமையாக இரத்தம் கசியும் காயத்தை தண்ணீரில் கழுவ வேண்டாம்.', bn: 'মারাত্মক রক্তপাতের ক্ষত জল দিয়ে ধোবেন না।' },

    // Burns
    burnTitle: { en: 'Burns & Scalds', hi: 'जलना', te: 'కాలిన గాయాలు', ta: 'தீக்காயங்கள்', bn: 'পোড়া' },
    burnStep1: { en: 'Cool Down: Run cool (not cold) tap water over the burn for 20 minutes.', hi: 'ठंडा करें: 20 मिनट के लिए जले हुए स्थान पर ठंडा (बर्फ जैसा नहीं) नल का पानी डालें।', te: 'చల్లబరచండి: 20 నిమిషాల పాటు కాలిన గాయంపై చల్లని కుళాయి నీరు (చాలా చల్లగా కాదు) పోయండి.', ta: 'குளிரூட்டவும்: 20 நிமிடங்களுக்கு தீக்காயத்தின் மேல் குளிர்ந்த (மிகக் குளிர்ந்த அல்ல) குழாய் தண்ணீரை ஓட விடவும்.', bn: 'ঠান্ডা করুন: 20 মিনিটের জন্য পোড়ার উপরে ঠান্ডা (খুব ঠান্ডা নয়) কলের জল ঢালুন।' },
    burnStep2: { en: 'Remove Jewelry: Take off rings or watches before the area swells.', hi: 'आभूषण हटाएं: सूजन आने से पहले अंगूठियां या घड़ियां उतार लें।', te: 'ఆభరణాలను తొలగించండి: వాపు రాకముందే ఉంగరాలు లేదా గడియారాలను తీయండి.', ta: 'நகைளை அகற்றவும்: வீக்கம் ஏற்படுவதற்கு முன் மோதிரங்கள் அல்லது கடிகாரங்களை கழற்றவும்.', bn: 'গহনা খুলে ফেলুন: জায়গাটি ফুলে যাওয়ার আগে আংটি বা ঘড়ি খুলে ফেলুন।' },
    burnStep3: { en: 'Cover Loosely: Use plastic wrap or a clean, non-stick bandage.', hi: 'हल्के से ढकें: प्लास्टिक रैप या साफ, नॉन-स्टिक पट्टी का उपयोग करें।', te: 'వదులుగా కప్పండి: ప్లాస్టిక్ ర్యాప్ లేదా శుభ్రమైన, అంటుకోని బ్యాండేజీని ఉపయోగించండి.', ta: 'தளர்வாக மூடு: பிளாஸ்டிக் உறை அல்லது சுத்தமான, ஒட்டாத பேண்டேஜைப் பயன்படுத்தவும்.', bn: 'হালকাভাবে ঢেকে রাখুন: প্লাস্টিকের র‍্যাপ বা একটি পরিষ্কার, নন-স্টিক ব্যান্ডেজ ব্যবহার করুন।' },
    burnStep4: { en: 'Pain Relief: Take paracetamol if needed (follow dosage).', hi: 'दर्द निवारक: यदि आवश्यक हो तो पैरासिटामोल लें (खुराक का पालन करें)।', te: 'నొప్పి నివారణ: అవసరమైతే పారాసెటమాల్ తీసుకోండి (మోతాదును అనుసరించండి).', ta: 'வலி நிவாரணம்: தேவைப்பட்டால் பாராசிட்டமால் எடுத்துக் கொள்ளுங்கள் (அளவைப் பின்பற்றவும்).', bn: 'ব্যথা উপশম: প্রয়োজনে প্যারাসিটামল নিন (ডোজ অনুসরণ করুন)।' },
    burnStep5: { en: 'Seek Help: If the burn is larger than your hand or on the face.', hi: 'मदद लें: यदि जला हुआ हिस्सा आपके हाथ से बड़ा है या चेहरे पर है।', te: 'సహాయం పొందండి: కాలిన గాయం మీ చేతి కంటే పెద్దదిగా లేదా ముఖంపై ఉంటే.', ta: 'உதவி தேடுங்கள்: தீக்காயம் உங்கள் கையை விட பெரிதாக இருந்தாலோ அல்லது முகத்தில் இருந்தாலோ.', bn: 'সাহায্য নিন: যদি পোড়া আপনার হাতের চেয়ে বড় হয় বা মুখে হয়।' },
    burnDont1: { en: 'Do not use ice, butter, or toothpaste on the burn.', hi: 'जले हुए स्थान पर बर्फ, मक्खन, या टूथपेस्ट का उपयोग न करें।', te: 'కాలిన గాయంపై మంచు, వెన్న లేదా టూత్‌పేస్ట్‌ను ఉపయోగించవద్దు.', ta: 'தீக்காயத்தில் பனி, வெண்ணெய் அல்லது பற்பசையைப் பயன்படுத்த வேண்டாம்.', bn: 'পোড়া জায়গায় বরফ, মাখন বা টুথপেস্ট ব্যবহার করবেন না।' },
    burnDont2: { en: 'Do not pop any blisters that form.', hi: 'बनने वाले किसी भी छाले को न फोड़ें।', te: 'ఏర్పడే పొక్కులను పగలగొట్టవద్దు.', ta: 'உருவாகும் கொப்புளங்களை உடைக்க வேண்டாம்.', bn: 'যে কোনো ফোস্কা তৈরি হলে তা ফাটাবেন না।' }
  };
  return mapping[key]?.[lang] || mapping[key]?.['en'] || key;
};

export default function EmergencyGuides({ language = 'en' }: { language?: Language }) {
  const [hospitals, setHospitals] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const EMERGENCY_TIPS = [
    { icon: <Siren size={14} />, text: "Ambulance: 108" },
    { icon: <PhoneCall size={14} />, text: "Police: 100" },
    { icon: <Flame size={14} />, text: "Fire: 101" },
    { icon: <Zap size={14} />, text: getEmergencyTranslation("stayCalm", language) },
    { icon: <MapPin size={14} />, text: getEmergencyTranslation("provideLocation", language) },
    { icon: <Activity size={14} />, text: getEmergencyTranslation("checkPulse", language) },
    { icon: <ShieldAlert size={14} />, text: getEmergencyTranslation("doNotMove", language) },
  ];

  const handleEmergencyCall = () => {
    window.location.href = 'tel:108';
  };

  const findHospitals = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await gemini.findNearbyHospitals(
            position.coords.latitude,
            position.coords.longitude
          );
          setHospitals(result);
        } catch (err) {
          setError("Failed to find nearby hospitals. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Location access denied. Please enable location to find nearby hospitals.");
        setLoading(false);
      }
    );
  };

  const EMERGENCY_STEPS = [
    {
      id: 'cpr',
      title: getEmergencyTranslation("cprTitle", language),
      icon: <Heart className="text-rose-600" />,
      color: 'rose',
      steps: [
        getEmergencyTranslation("cprStep1", language),
        getEmergencyTranslation("cprStep2", language),
        getEmergencyTranslation("cprStep3", language),
        getEmergencyTranslation("cprStep4", language),
        getEmergencyTranslation("cprStep5", language)
      ],
      donts: [getEmergencyTranslation("cprDont1", language), getEmergencyTranslation("cprDont2", language)]
    },
    {
      id: 'choking',
      title: getEmergencyTranslation("chokeTitle", language),
      icon: <Wind className="text-amber-600" />,
      color: 'amber',
      steps: [
        getEmergencyTranslation("chokeStep1", language),
        getEmergencyTranslation("chokeStep2", language),
        getEmergencyTranslation("chokeStep3", language),
        getEmergencyTranslation("chokeStep4", language),
        getEmergencyTranslation("chokeStep5", language)
      ],
      donts: [getEmergencyTranslation("chokeDont1", language), getEmergencyTranslation("chokeDont2", language)]
    },
    {
      id: 'bleeding',
      title: getEmergencyTranslation("bleedTitle", language),
      icon: <Droplets className="text-rose-700" />,
      color: 'rose',
      steps: [
        getEmergencyTranslation("bleedStep1", language),
        getEmergencyTranslation("bleedStep2", language),
        getEmergencyTranslation("bleedStep3", language),
        getEmergencyTranslation("bleedStep4", language),
        getEmergencyTranslation("bleedStep5", language)
      ],
      donts: [getEmergencyTranslation("bleedDont1", language), getEmergencyTranslation("bleedDont2", language)]
    },
    {
      id: 'burns',
      title: getEmergencyTranslation("burnTitle", language),
      icon: <Flame className="text-orange-600" />,
      color: 'orange',
      steps: [
        getEmergencyTranslation("burnStep1", language),
        getEmergencyTranslation("burnStep2", language),
        getEmergencyTranslation("burnStep3", language),
        getEmergencyTranslation("burnStep4", language),
        getEmergencyTranslation("burnStep5", language)
      ],
      donts: [getEmergencyTranslation("burnDont1", language), getEmergencyTranslation("burnDont2", language)]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white lg:rounded-[2.5rem] shadow-xl shadow-brand-500/5 border border-brand-100/50 overflow-hidden relative">
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-brand-50 bg-rose-50/30 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="min-w-0 pr-4">
          <h2 className="font-display font-bold text-lg sm:text-2xl text-slate-800 flex items-center gap-2 sm:gap-3">
            <ShieldAlert className="text-rose-600 shrink-0" size={20} />
            <span className="truncate">{getEmergencyTranslation("emergencyAction", language)}</span>
          </h2>
          <p className="text-[10px] sm:text-sm text-slate-500 mt-0.5 sm:mt-1 truncate">{getEmergencyTranslation("stayCalmSaveLife", language)}</p>
        </div>
        <button 
          onClick={handleEmergencyCall}
          className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-rose-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/30 animate-pulse shrink-0"
        >
          <PhoneCall size={16} className="sm:w-[18px] sm:h-[18px]" />
          {getEmergencyTranslation("call108", language)}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 sm:space-y-12 custom-scrollbar no-scrollbar">
        {/* Emergency Tips Carousel */}
        <div className="py-2.5 sm:py-3 bg-rose-50/50 border-y border-rose-100 -mx-4 sm:-mx-8 px-4 sm:px-8">
          <InfiniteCarousel 
            speed={40}
            items={EMERGENCY_TIPS.map((tip, i) => (
              <div key={`emergency-tip-${i}`} className="flex items-center gap-2 px-4 py-1 bg-white border border-rose-100 rounded-full shadow-sm">
                <div className="text-rose-600">{tip.icon}</div>
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest whitespace-nowrap">{tip.text}</span>
              </div>
            ))}
          />
        </div>

        {/* Emergency Contact Card */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-rose-600 text-white relative overflow-hidden shadow-2xl shadow-rose-500/20"
        >
          <div className="relative z-10 space-y-6 sm:space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0">
                <PhoneCall size={24} className="sm:w-[32px] sm:h-[32px]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-3xl font-bold tracking-tight">Emergency: 108</h3>
                <p className="text-rose-100 text-xs sm:text-base font-medium">{getEmergencyTranslation("ambulanceMedical", language)}</p>
              </div>
            </div>
            <p className="text-rose-50 text-sm sm:text-lg leading-relaxed max-w-xl">
              {getEmergencyTranslation("callImmediately", language)}
            </p>
            <button 
              onClick={handleEmergencyCall}
              className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-white text-rose-600 rounded-xl sm:rounded-[1.5rem] text-sm sm:text-lg font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
            >
              <PhoneCall size={20} className="sm:w-[24px] sm:h-[24px]" />
              {getEmergencyTranslation("dial108Now", language)}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />
        </motion.section>

        {/* Nearby Hospitals Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] bg-white border border-slate-100 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-brand-600 shrink-0">
                <MapPin size={20} className="sm:w-[24px] sm:h-[24px]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800 tracking-tight">{getEmergencyTranslation("nearbyHospitals", language)}</h3>
                <p className="text-[10px] sm:text-xs text-slate-500">{getEmergencyTranslation("findClosest", language)}</p>
              </div>
            </div>
            <button 
              onClick={findHospitals}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
              {loading ? getEmergencyTranslation("locating", language) : getEmergencyTranslation("findNearMe", language)}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm flex items-center gap-3"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            {hospitals && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="prose prose-sm max-w-none text-slate-600 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <Markdown>{hospitals.text}</Markdown>
                </div>

                {hospitals.mapsLinks.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hospitals.mapsLinks.map((link: any, i: number) => (
                      <a 
                        key={`hospital-link-${i}`}
                        href={link.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-brand-500 hover:bg-brand-50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
                            <MapPin size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-brand-700">{link.title}</span>
                        </div>
                        <ExternalLink size={16} className="text-slate-400 group-hover:text-brand-500" />
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Dynamic Emergency Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {EMERGENCY_STEPS.map((emergency, idx) => (
            <motion.section 
              key={emergency.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 bg-white hover:border-brand-100 hover:shadow-xl hover:shadow-brand-500/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0 ${
                  emergency.color === 'rose' ? "bg-rose-50 text-rose-600" : 
                  emergency.color === 'amber' ? "bg-amber-50 text-amber-600" : "bg-orange-50 text-orange-600"
                }`}>
                  {emergency.icon}
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-800 tracking-tight">{emergency.title}</h3>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{getEmergencyTranslation("actionSteps", language)}</h4>
                <div className="space-y-3">
                  {emergency.steps.map((step, i) => (
                    <div key={`step-${idx}-${i}`} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 space-y-4">
                <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{getEmergencyTranslation("criticalNotToDo", language)}</h4>
                <div className="space-y-2">
                  {emergency.donts.map((dont, i) => (
                    <div key={`dont-${idx}-${i}`} className="flex gap-3 items-start text-rose-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <p className="text-xs font-medium leading-relaxed">{dont}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Fits/Seizures Section - Simplified */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity size={28} />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-800">{getEmergencyTranslation("seizures", language)}</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100">
              <h4 className="font-bold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 size={18} />
                {getEmergencyTranslation("doThis", language)}
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3"><span>•</span> <span>Ease them to the floor gently.</span></li>
                <li className="flex gap-3"><span>•</span> <span>Turn them onto their side to help breathing.</span></li>
                <li className="flex gap-3"><span>•</span> <span>Clear away hard or sharp objects.</span></li>
                <li className="flex gap-3"><span>•</span> <span>Put something soft under their head.</span></li>
              </ul>
            </div>

            <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100">
              <h4 className="font-bold text-rose-600 flex items-center gap-2">
                <AlertCircle size={18} />
                {getEmergencyTranslation("neverDoThis", language)}
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3"><span>•</span> <span>Do NOT hold them down or stop movements.</span></li>
                <li className="flex gap-3"><span>•</span> <span>Do NOT put anything in their mouth.</span></li>
                <li className="flex gap-3"><span>•</span> <span>Do NOT give water until they are fully alert.</span></li>
              </ul>
            </div>
          </div>
        </motion.section>
        
        {/* Good Samaritan Law */}
        <section className="p-8 rounded-[2.5rem] bg-indigo-900 text-white space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Scale size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Scale size={20} />
              </div>
              <h3 className="text-xl font-bold">{getEmergencyTranslation("goodSamaritanTitle", language)}</h3>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              {getEmergencyTranslation("goodSamaritanSub", language)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'You cannot be forced to reveal your identity or contact details.',
                'You are not liable for any civil or criminal action for helping.',
                'Hospitals cannot demand payment before starting treatment.',
                'You can leave the hospital immediately after admitting the victim.'
              ].map((point, i) => (
                <div key={`samaritan-${i}`} className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <p className="text-xs font-medium text-indigo-50">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100 flex gap-4 items-start">
          <Info className="text-brand-600 shrink-0 mt-0.5" size={20} />
          <p className="text-xs text-brand-800 leading-relaxed">
            This guide is for educational purposes. In any real emergency, prioritize contacting professional medical services immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
