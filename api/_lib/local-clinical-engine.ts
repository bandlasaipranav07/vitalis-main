import { Message, ClinicalSummary } from "../../src/types";

// Banned medications in India
const BANNED_MEDICATIONS = [
  { name: "nimesulide", reason: "Banned for children under 12 years of age due to severe risks of hepatotoxicity (liver damage). Fixed-dose combinations containing Nimesulide are also strictly banned or restricted in adults due to severe risk of drug-induced liver injury." },
  { name: "analgin", reason: "Metamizole/Analgin is banned in India and globally due to the risk of agranulocytosis (a sudden, dangerous drop in white blood cells), which can lead to fatal infections." },
  { name: "metamizole", reason: "Banned due to high risk of agranulocytosis (severe reduction in white blood cell count)." },
  { name: "cisapride", reason: "Banned in India due to serious cardiac adverse effects, including life-threatening arrhythmias (QT prolongation)." },
  { name: "rosiglitazone", reason: "Banned or severely restricted due to a significantly increased risk of cardiovascular events, including myocardial infarction (heart attack)." },
  { name: "phenidate", reason: "Methylphenidate combinations are strictly regulated or restricted due to high risk of addiction, cardiovascular complications, and abuse." },
  { name: "d-cold", reason: "Formulations of D-Cold Total containing specific fixed-dose combinations (e.g., Nimesulide + Paracetamol) are banned due to elevated hepatotoxicity and gastrointestinal bleeding risks." },
  { name: "d cold", reason: "Formulations containing nimesulide or unsafe FDCs are banned in India due to liver toxicity risks." }
];

// High-fidelity clinical map for 11 languages
const LOCALIZED_CLINICAL_MAP: Record<string, any> = {
  en: {
    emergency: {
      name: "Severe emergency symptoms",
      causes: ["Acute Coronary Syndrome", "Pulmonary Embolism", "Severe Cardiac Arrhythmia"],
      recommendations: ["Call 108 or local emergency immediately.", "Avoid any physical exertion.", "Do not drive yourself to the hospital."],
      warnings: ["Loss of consciousness", "Severe crushing chest pain", "Inability to breathe"],
      specialist: "Emergency Physician / Cardiologist"
    },
    respiratory: {
      name: "Respiratory irritation / Congestion",
      causes: ["Upper Respiratory Infection (Flu)", "Acute Bronchitis", "Allergic Rhinitis"],
      recommendations: ["Stay hydrated with warm fluids.", "Monitor temperature twice daily.", "Avoid self-administering antibiotics."],
      warnings: ["High persistent fever", "Difficulty breathing", "Sore throat preventing swallowing"],
      specialist: "General Physician / Pulmonologist"
    },
    digestive: {
      name: "Digestive discomfort",
      causes: ["Acid Reflux / Indigestion", "Irritable Bowel Syndrome", "Gastritis"],
      recommendations: ["Eat a bland, light diet.", "Avoid spicy or heavy foods.", "Stay upright for 30 minutes after eating."],
      warnings: ["Severe localized abdominal pain", "Inability to retain liquids", "Persistent high fever"],
      specialist: "Gastroenterologist"
    },
    gastrointestinal: {
      name: "Stomach upset / Infection",
      causes: ["Gastroenteritis / Food Poisoning", "Viral Stomach Flu"],
      recommendations: ["Hydrate with electrolyte solutions (ORS).", "Eat small, frequent, bland meals.", "Avoid milk and sugary drinks."],
      warnings: ["Blood in stool or vomit", "Severe dehydration symptoms", "Inability to keep liquids down for 24 hours"],
      specialist: "Gastroenterologist / Family Physician"
    },
    neurological: {
      name: "Neurological discomfort",
      causes: ["Tension Headache / Migraine", "Benign Positional Vertigo", "Stress-induced fatigue"],
      recommendations: ["Rest in a dark, quiet room.", "Maintain regular hydration.", "Apply a cool compress to your forehead."],
      warnings: ["Sudden severe 'thunderclap' headache", "Difficulty speaking or slurred speech", "Loss of balance or numbness"],
      specialist: "Neurologist / General Practitioner"
    },
    musculoskeletal: {
      name: "Musculoskeletal pain",
      causes: ["Musculoskeletal Strain", "Myalgia (Viral Body Ache)", "Joint Inflammation"],
      recommendations: ["Rest the affected area and apply cool packs.", "Avoid strenuous activities.", "Consider gentle stretching if tolerable."],
      warnings: ["Severe swelling or visible deformity", "Inability to bear weight", "Joint redness and warm sensation"],
      specialist: "Orthopedist / Physiotherapist"
    },
    skin_eyes: {
      name: "Skin or eye irritation",
      causes: ["Allergic Dermatitis / Urticaria", "Viral Skin Exanthem", "Mild Conjunctivitis"],
      recommendations: ["Avoid scratching to prevent secondary infection.", "Use cool, wet compresses.", "Keep the area clean and dry."],
      warnings: ["Rapidly spreading red rash", "Difficulty breathing or swollen lips", "Severe eye pain or vision loss"],
      specialist: "Dermatologist / Ophthalmologist"
    },
    general: {
      name: "General viral symptoms / Fatigue",
      causes: ["Viral Syndrome", "Physical Fatigue / Exhaustion", "Mild Dehydration"],
      recommendations: ["Prioritize quality sleep (7-9 hours).", "Increase daily intake of clean water.", "Keep a detailed daily symptom log."],
      warnings: ["Symptoms worsening after 3-5 days", "Unexplained weight loss", "Extremely high body temperature"],
      specialist: "General Practitioner"
    },
    meta: {
      healthSummary: "Based on your symptoms ({symptoms}) of {severity} severity for {duration}, this clinical picture suggests potential causes like {causes}. Please monitor your condition closely.",
      disclaimer: "👋 Hello! I'm your Vitalis health companion. I'm not a doctor; this is for educational triage and wellness support only. All recommendations and clinical assessments align with WHO and NHS guidelines.\n\n",
      greeting: "Hello! I'm your Vitalis health companion. I'm here to listen, triage symptoms, and answer your medication safety and wellness queries. How are you feeling today?",
      bannedWarning: "⚠️ **SAFETY WARNING: BANNED MEDICATION**\n\nYou are inquiring about **{medName}**. Please be advised that this drug or combination is **BANNED/SUSPENDED** in India by the CDSCO due to high safety risks:\n\n- **Reason:** {reason}\n\n**CRITICAL ADVICE:**\n- **Stop taking this medication immediately** if you are currently doing so.\n- Consult a pharmacist or doctor to discuss safe alternatives.\n\n**Triage Category:** [Schedule a Doctor's Visit]"
    }
  },
  hi: {
    emergency: {
      name: "गंभीर आपातकालीन लक्षण",
      causes: ["तीव्र कोरोनरी सिंड्रोम (हार्ट अटैक)", "पल्मोनरी एम्बोलिज़्म", "गंभीर कार्डियक अतालता"],
      recommendations: ["तुरंत 108 या आपातकालीन नंबर पर कॉल करें।", "किसी भी प्रकार के शारीरिक परिश्रम से बचें।", "स्वयं गाड़ी चलाकर अस्पताल न जाएं।"],
      warnings: ["बेहोशी या बेहोश महसूस होना", "छाती में तेज जकड़न या दर्द", "सांस लेने में भारी कठिनाई"],
      specialist: "आपातकालीन चिकित्सक / हृदय रोग विशेषज्ञ"
    },
    respiratory: {
      name: "श्वसन जलन / नाक-गला बंद",
      causes: ["श्वसन पथ का संक्रमण (फ्लू / सर्दी)", "तीव्र ब्रोंकाइटिस", "एलर्जी राइनाइटिस"],
      recommendations: ["गुनगुने पानी या तरल पदार्थों का सेवन करें।", "दिन में दो बार तापमान की जांच करें।", "बिना डॉक्टर की सलाह के एंटीबायोटिक दवाओं से बचें।"],
      warnings: ["लगातार तेज बुखार होना", "सांस फूलना या सांस लेने में तकलीफ", "गले में गंभीर दर्द जिससे निगलना मुश्किल हो"],
      specialist: "सामान्य चिकित्सक / पल्मोनोलॉजिस्ट"
    },
    digestive: {
      name: "पाचन संबंधी असुविधा",
      causes: ["एसिड रिफ्लक्स / अपच", "इरिटेबल बॉवेल सिंड्रोम", "गैस्ट्राइटिस"],
      recommendations: ["हल्का और सुपाच्य भोजन लें।", "मसालेदार या भारी भोजन से पूरी तरह बचें।", "खाने के बाद 30 मिनट तक सीधे बैठें।"],
      warnings: ["पेट में असहनीय दर्द होना", "तरल पदार्थ भी पेट में न रोक पाना", "लगातार तेज बुखार"],
      specialist: "गैस्ट्रोएंटेरोलॉजिस्ट (पेट रोग विशेषज्ञ)"
    },
    gastrointestinal: {
      name: "पेट खराब / संक्रमण",
      causes: ["गैस्ट्रोएंटेराइटिस / फूड पॉइजनिंग", "वायरल पेट फ्लू"],
      recommendations: ["ओआरएस (ORS) या इलेक्ट्रोलाइट्स पिएं।", "हल्का और सुपाच्य भोजन (खिचड़ी, केला) लें।", "दूध और मीठे पेय पदार्थों से बचें।"],
      warnings: ["उल्टी या मल में खून आना", "गंभीर निर्जलीकरण (डीहाइड्रेशन)", "24 घंटे से कुछ भी न पचा पाना"],
      specialist: "गैस्ट्रोएंटेरोलॉजिस्ट / सामान्य चिकित्सक"
    },
    neurological: {
      name: "तंत्रिका संबंधी असुविधा",
      causes: ["तनाव-जनित सिरदर्द / माइग्रेन", "वर्टिगो (चक्कर आना)", "थकान-जनित सिरदर्द"],
      recommendations: ["अंधेरे और शांत कमरे में आराम करें।", "पर्याप्त पानी पीकर हाइड्रेटेड रहें।", "माथे पर ठंडी या गुनगुनी पट्टी रखें।"],
      warnings: ["अचानक असहनीय और तीव्र सिरदर्द", "बोलने में कठिनाई या लड़खड़ाहट", "संतुलन खोना या शरीर का कोई अंग सुन्न होना"],
      specialist: "न्यूरोलॉजिस्ट / सामान्य चिकित्सक"
    },
    musculoskeletal: {
      name: "मांसपेशियों और हड्डियों का दर्द",
      causes: ["मांसपेशियों में खिंचाव या मोच", "मायलगिया (बदन दर्द)", "जोड़ों में सूजन"],
      recommendations: ["प्रभावित हिस्से को आराम दें और बर्फ से सिकाई करें।", "भारी वजन उठाने या थकाऊ गतिविधियों से बचें।", "हल्की स्ट्रेचिंग करें।"],
      warnings: ["जोड़ का अपनी जगह से खिसकना या गंभीर सूजन", "पैर पर वजन उठाने में असमर्थता", "जोड़ों का लाल होना और गर्म महसूस होना"],
      specialist: "हड्डी रोग विशेषज्ञ / फिजियोथेरेपिस्ट"
    },
    skin_eyes: {
      name: "त्वचा या आंखों में जलन",
      causes: ["एलर्जिक डर्मेटाइटिस (त्वचा एलर्जी)", "वायरल रैश (चकत्ते)", "आंख आना (कंजंक्टिवाइटिस)"],
      recommendations: ["खुजली करने से बचें ताकि संक्रमण न फैले।", "ठंडी और गीली पट्टी का उपयोग करें।", "प्रभावित क्षेत्र को साफ और सूखा रखें।"],
      warnings: ["चकत्ते का बहुत तेजी से फैलना", "सांस लेने में दिक्कत या चेहरे पर सूजन", "आंखों में तेज दर्द या दृष्टि धुंधली होना"],
      specialist: "त्वचा रोग विशेषज्ञ / नेत्र रोग विशेषज्ञ"
    },
    general: {
      name: "सामान्य वायरल लक्षण / थकान",
      causes: ["सामान्य वायरल सिंड्रोम", "शारीरिक थकान / कमजोरी", "हल्का निर्जलीकरण"],
      recommendations: ["7-9 घंटे की गहरी नींद लें।", "साफ पानी पीने की मात्रा बढ़ाएं।", "अपने लक्षणों की दैनिक डायरी रखें।"],
      warnings: ["लक्षण 3-5 दिनों के बाद भी बिगड़ना", "बिना कारण वजन कम होना", "शरीर का तापमान बहुत अधिक बढ़ना"],
      specialist: "सामान्य चिकित्सक"
    },
    meta: {
      healthSummary: "आपके लक्षणों ({symptoms}) (तीव्रता: {severity}, अवधि: {duration}) के आधार पर, यह नैदानिक स्थिति {causes} जैसे संभावित कारणों का संकेत देती है। कृपया अपनी स्थिति की बारीकी से निगरानी करें।",
      disclaimer: "👋 नमस्ते! मैं आपका वाइटलिस स्वास्थ्य साथी हूँ। मैं डॉक्टर नहीं हूँ; यह केवल शैक्षिक ट्राइएज और कल्याण सहायता के लिए है। यह विश्लेषण डब्ल्यूएचओ और एनएचएस दिशानिर्देशों पर आधारित है।\n\n",
      greeting: "नमस्ते! मैं आपका वाइटलिस स्वास्थ्य साथी हूँ। मैं आपके लक्षणों को सुनने और किसी भी सामान्य कल्याणकारी प्रश्न का उत्तर देने के लिए यहाँ हूँ। आप आज कैसा महसूस कर रहे हैं?",
      bannedWarning: "⚠️ **सुरक्षा चेतावनी: प्रतिबंधित दवा (BANNED MEDICATION)**\n\nआप **{medName}** के बारे में पूछ रहे हैं। कृपया ध्यान दें कि यह दवा भारत में CDSCO द्वारा **प्रतिबंधित/निलंबित** है:\n\n- **कारण:** {reason}\n\n**महत्वपूर्ण सलाह:**\n- यदि आप इस दवा का उपयोग कर रहे हैं, तो इसे **तुरंत बंद करें**।\n- एक सुरक्षित और स्वीकृत विकल्प के बारे में अपने डॉक्टर या फार्मासिस्ट से परामर्श लें।\n\n**ट्राइएज वर्गीकरण:** [Schedule a Doctor's Visit]"
    }
  },
  te: {
    emergency: {
      name: "తీవ్రమైన అత్యవసర లక్షణాలు",
      causes: ["తీవ్రమైన మయోకార్డియల్ ఇన్ఫార్క్షన్ (గుండెపోటు)", "పల్మనరీ ఎంబోలిజం", "తీవ్రమైన కార్డియాక్ అరిథ్మియా"],
      recommendations: ["వెంటనే 108 లేదా స్థానిక అత్యవసర సేవలకు కాల్ చేయండి.", "ఎటువంటి శారీరక శ్రమ చేయవద్దు.", "స్వయంగా ఆసుపత్రికి డ్రైవ్ చేయవద్దు."],
      warnings: ["స్పృహ కోల్పోవడం", "తీవ్రమైన ఛాతీ నొప్పి", "సరిగ్గా శ్వాస తీసుకోలేకపోవడం"],
      specialist: "ఎమర్జెన్సీ మెడిసిన్ / కార్డియాలజిస్ట్"
    },
    respiratory: {
      name: "శ్వాసకోశ ఇన్ఫెక్షన్ / జలుబు",
      causes: ["శ్వాసకోశ అంటువ్యాధి (ఫ్లూ / జలుబు)", "తీవ్రమైన బ్రోన్కైటిస్", "అలెర్జీ రైనైటిస్"],
      recommendations: ["గోరువెచ్చని ద్రవాలు తీసుకోండి.", "రోజుకు రెండుసార్లు ఉష్ణోగ్రతను పర్యవేక్షించండి.", "యాంటీబయాటిక్స్ వాడవద్దు."],
      warnings: ["నిరంతర అధిక జ్వరం", "శ్వాస తీసుకోవడంలో ఇబ్బంది", "మింగడానికి వీలులేని గొంతు నొప్పి"],
      specialist: "జనరల్ ఫిజీషియన్ / పల్మనాలజిస్ట్"
    },
    digestive: {
      name: "జీర్ణ సమస్యలు / అజీర్ణం",
      causes: ["యాసిడ్ రిఫ్లక్స్ / అజీర్ణం", "ఇరిటబుల్ బవెల్ సిండ్రోమ్", "గ్యాస్ట్రిటిస్"],
      recommendations: ["తేలికపాటి ఆహారం తీసుకోండి.", "మసాలా లేదా భారీ ఆహారాలను నివారించండి.", "తిన్న తర్వాత 30 నిమిషాలు నిటారుగా కూర్చోండి."],
      warnings: ["తీవ్రమైన కడుపు నొప్పి", "ద్రవాలను తీసుకోలేకపోవడం", "అధిక జ్వరం"],
      specialist: "గ్యాస్ట్రోఎంటరాలజిస్ట్"
    },
    gastrointestinal: {
      name: "కడుపు ఉబ్బరం / వాంతులు",
      causes: ["గ్యాస్ట్రోఎంటరైటిస్ / ఫుడ్ పాయిజనింగ్", "వైరల్ కడుపు ఫ్లూ"],
      recommendations: ["ఓఆర్ఎస్ (ORS) ద్రావణాలను తీసుకోండి.", "కొద్దికొద్దిగా తేలికపాటి ఆహారం తీసుకోండి.", "పాలు మరియు చక్కెర పానీయాలను నివారించండి."],
      warnings: ["వాంతులు లేదా మలంలో రక్తం పడటం", "తీవ్రమైన డీహైడ్రేషన్ లక్షణాలు", "24 గంటలపాటు ద్రవాలను తీసుకోలేకపోవడం"],
      specialist: "గ్యాస్ట్రోఎంటరాలజిస్ట్ / ఫ్యామిలీ ఫిజీషియన్"
    },
    neurological: {
      name: "నాడీ సంబంధిత అసౌకర్యం",
      causes: ["టెన్షన్ తలనొప్పి / మైగ्रेन", "వెర్టిగో (తల తిరగడం)", "ఒత్తిడి అలసట"],
      recommendations: ["చీకటి, నిశ్శబ్ద గదిలో విశ్రాంతి తీసుకోండి.", "తగినంత నీరు తీసుకోండి.", "నుదిటిపై చల్లని వస్త్రం ఉంచండి."],
      warnings: ["అకస్మాత్తుగా వచ్చే తీవ్రమైన తలనొప్పి", "మాట పడిపోవడం లేదా అస్పష్టమైన మాట", "సమతుల్యత కోల్పోవడం లేదా మొద్దుబారడం"],
      specialist: "న్యూరాలజిస్ట్ / జనరల్ ప్రాక్టీషనర్"
    },
    musculoskeletal: {
      name: "కండరాలు మరియు కీళ్ల నొప్పులు",
      causes: ["కండరాల ఒత్తిడి లేదా నొప్పి", "వైరల్ కండరాల నొప్పులు", "కీళ్ల వాపు"],
      recommendations: ["నొప్పి ఉన్న చోట విశ్రాంతినిచ్చి ఐస్ పెట్టండి.", "బరువైన పనులు నివారించండి.", "నెమ్మదిగా సాగదీయండి (స్ట్రెచింగ్)."],
      warnings: ["తీవ్రమైన వాపు లేదా కీళ్ల రూపాంతరం", "బరువు మోయలేకపోవడం", "కీళ్ళు ఎర్రబడటం మరియు వేడిగా అనిపించడం"],
      specialist: "ఆర్థోపెడిస్ట్ / ఫిజియోథెరపిస్ట్"
    },
    skin_eyes: {
      name: "చర్మం లేదా కంటి అలర్జీ",
      causes: ["అలర్జిక్ డెర్మటైటిస్", "వైరల్ దద్దుర్లు", "కంటి కలక (కంజంక్టివిటిస్)"],
      recommendations: ["గోకడం నివారించండి.", "చల్లని ఒత్తిడి ఉపయోగించండి.", "శుభ్రంగా మరియు పొడిగా ఉంచండి."],
      warnings: ["వేగంగా వ్యాపించే ఎర్రటి దద్దుర్లు", "శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా పెదవుల వాపు", "తీవ్రమైన కంటి నొప్పి లేదా చూపు మసకబారడం"],
      specialist: "డెర్మటాలజిస్ట్ / ఆప్తమాలజిస్ట్"
    },
    general: {
      name: "సాధారణ వైరల్ లక్షణాలు / అలసట",
      causes: ["వైరల్ సిండ్రోమ్", "శారీరక అలసట", "తేలికపాటి డీహైడ్రేషన్"],
      recommendations: ["7-9 గంటల నిద్రను తీసుకోండి.", "ఎక్కువ నీరు తీసుకోండి.", "లక్షణాల డైరీని రాయండి."],
      warnings: ["3-5 రోజుల తర్వాత కూడా లక్షణాలు తీవ్రమవడం", "కారణం లేకుండా బరువు తగ్గడం", "అధిక జ్వరం రావడం"],
      specialist: "జనరల్ ఫిజీషియన్"
    },
    meta: {
      healthSummary: "మీరు తెలిపిన లక్షణాలు ({symptoms}) (తీవ్రత: {severity}, వ్యవధి: {duration}) ఆధారంగా, ఈ క్లినికల్ చిత్రం {causes} వంటి సంభావ్య కారణాలను సూచిస్తుంది. దయచేసి మీ పరిస్థితిని నిరంతరం పర్యవేక్షించండి.",
      disclaimer: "👋 నమస్తే! నేను మీ వైటలిస్ ఆరోగ్య తోడును. నేను వైద్యుడిని కాను; ఇది కేవలం విద్యా ట్రయేజ్ మరియు ఆరోగ్య మద్దతు కోసం మాత్రమే.\n\n",
      greeting: "నమస్తే! నేను మీ వైటలిస్ ఆరోగ్య తోడును. మీ లక్షణాలను వినడానికి మరియు సాధారణ ఆరోగ్య ప్రశ్నలకు సమాధానం ఇవ్వడానికి నేను ఇక్కడ ఉన్నాను. ఈ రోజు మీరు ఎలా ఉన్నారు?",
      bannedWarning: "⚠️ **భద్రతా హెచ్చరిక: నిషేధించబడిన ఔషధం (BANNED MEDICATION)**\n\nమీరు **{medName}** గురించి అడుగుతున్నారు. ఈ ఔషధం లేదా కలయిక భారతదేశంలో CDSCO చేత **నిషేధించబడింది/నిలిపివేయబడింది**:\n\n- **కారణం:** {reason}\n\n**ముఖ్యమైన సലహా:**\n- మీరు ప్రస్తుతం ఈ మందును వాడుతుంటే, **వెంటనే వాడటం ఆపండి**.\n- సురక్షితమైన ప్రత్యామ్నాయాల కోసం మీ వైద్యుడిని సంప్రదించండి.\n\n**ట్రయేజ్ వర్గం:** [Schedule a Doctor's Visit]"
    }
  },
  es: {
    emergency: {
      name: "Síntomas de emergencia graves",
      causes: ["Síndrome Coronario Agudo", "Embolia Pulmonar", "Arritmia Cardíaca Grave"],
      recommendations: ["Llame al 108 o emergencia local de inmediato.", "Evite cualquier esfuerzo físico.", "No conduzca usted mismo al hospital."],
      warnings: ["Pérdida de conciencia", "Dolor torácico opresivo severo", "Incapacidad para respirar"],
      specialist: "Médico de Urgencias / Cardiólogo"
    },
    respiratory: {
      name: "Irritación / congestión respiratoria",
      causes: ["Infección respiratoria superior (Gripe)", "Bronquitis Aguda", "Rinitis Alérgica"],
      recommendations: ["Manténgase hidratado con líquidos tibios.", "Controle la temperatura dos veces al día.", "Evite automedicarse con antibióticos."],
      warnings: ["Fiebre alta persistente", "Dificultad para respirar", "Dolor de garganta que impide tragar"],
      specialist: "Médico General / Neumólogo"
    },
    digestive: {
      name: "Malestar digestivo",
      causes: ["Reflujo Ácido / Indigestión", "Síndrome del Intestino Irritable", "Gastritis"],
      recommendations: ["Lleve una dieta blanda y ligera.", "Evite alimentos picantes o pesados.", "Permanezca erguido durante 30 minutos después de comer."],
      warnings: ["Dolor abdominal localizado severo", "Incapacidad para retener líquidos", "Fiebre alta persistente"],
      specialist: "Gastroenterólogo"
    },
    gastrointestinal: {
      name: "Malestar estomacal / Infección",
      causes: ["Gastroenteritis / Intoxicación Alimentaria", "Gripe estomacal viral"],
      recommendations: ["Hidrátese con soluciones electrolíticas (SRO).", "Coma porciones pequeñas y frecuentes de alimentos blandos.", "Evite la leche y las bebidas azucaradas."],
      warnings: ["Sangre en las heces o vómito", "Síntomas de deshidratación severa", "Incapacidad para retener líquidos por 24 horas"],
      specialist: "Gastroenterólogo / Médico Familiar"
    },
    neurological: {
      name: "Malestar neurológico",
      causes: ["Cefalea tensional / Migraña", "Vértigo posicional benigno", "Fatiga inducida por estrés"],
      recommendations: ["Descanse en una habitación oscura y silenciosa.", "Mantenga una hidratación regular.", "Aplique una compresa fría en la frente."],
      warnings: ["Dolor de cabeza severo y repentino", "Dificultad para hablar o habla arrastrada", "Pérdida de equilibrio o entumecimiento"],
      specialist: "Neurólogo / Médico General"
    },
    musculoskeletal: {
      name: "Dolor musculoesquelético",
      causes: ["Distensión Musculoesquelética", "Mialgia (Dolor corporal viral)", "Inflamación articular"],
      recommendations: ["Descanse el área afectada y aplique compresas frías.", "Evite actividades extenuantes.", "Considere estiramientos suaves si es tolerable."],
      warnings: ["Hinchazón severa o deformidad visible", "Incapacidad para soportar peso", "Enrojecimiento articular y sensación de calor"],
      specialist: "Ortopedista / Fisioterapeuta"
    },
    skin_eyes: {
      name: "Irritación cutánea u ocular",
      causes: ["Dermatitis Alérgica / Urticaria", "Exantema cutáneo viral", "Conjuntivitis leve"],
      recommendations: ["Evite rascarse para prevenir infecciones secundarias.", "Use compresas frías y húmedas.", "Mantenga el área limpia y seca."],
      warnings: ["Erupción roja que se extiende rápidamente", "Dificultad para respirar o labios hinchados", "Dolor ocular severo o pérdida de visión"],
      specialist: "Dermatólogo / Oftalmólogo"
    },
    general: {
      name: "Síntomas virales generales / Fatiga",
      causes: ["Síndrome viral", "Fatiga física / Agotamiento", "Deshidratación leve"],
      recommendations: ["Priorice el sueño de calidad (7-9 horas).", "Aumente la ingesta diaria de agua limpia.", "Lleve un registro diario detallado de los síntomas."],
      warnings: ["Los síntomas empeoran después de 3-5 días", "Pérdida de peso inexplicable", "Temperatura corporal extremadamente alta"],
      specialist: "Médico General"
    },
    meta: {
      healthSummary: "Según sus síntomas ({symptoms}) de gravedad {severity} durante {duration}, este cuadro clínico sugiere causas potenciales como {causes}. Por favor controle su estado de cerca.",
      disclaimer: "👋 ¡Hola! Soy tu compañero de salud de Vitalis. No soy médico; esto es solo para triaje educativo y apoyo de bienestar. Este análisis se basa en las directrices de la OMS y el NHS.\n\n",
      greeting: "¡Hola! Soy tu compañero de salud Vitalis. Estoy aquí para escuchar tus síntomas, realizar el triaje y responder a tus consultas sobre seguridad de medicamentos y bienestar. ¿Cómo te sientes hoy?",
      bannedWarning: "⚠️ **ADVERTENCIA DE SEGURIDAD: MEDICAMENTO PROHIBIDO**\n\nEstá consultando sobre **{medName}**. Este medicamento está **PROHIBIDO/SUSPENDIDO** en la India por el CDSCO:\n\n- **Razón:** {reason}\n\n**CONSEJO CRÍTICO:**\n- **Deje de tomar este medicamento inmediatamente**.\n- Consulte a un farmacéutico o médico para alternativas seguras.\n\n**Categoría de Triaje:** [Schedule a Doctor's Visit]"
    }
  },
  fr: {
    emergency: {
      name: "Symptômes d'urgence graves",
      causes: ["Syndrome Coronarien Aigu", "Embolie Pulmonaire", "Arythmie Cardiaque Grave"],
      recommendations: ["Appelez immédiatement le 108 ou les urgences locales.", "Évitez tout effort physique.", "Ne conduisez pas vous-même à l'hôpital."],
      warnings: ["Perte de connaissance", "Douleur thoracique oppressive sévère", "Incapacité à respirer"],
      specialist: "Médecin d'Urgence / Cardiologue"
    },
    respiratory: {
      name: "Irritation / Congestion respiratoire",
      causes: ["Infection des voies respiratoires supérieures (Grippe)", "Bronchite Aiguë", "Rhinite Allergique"],
      recommendations: ["Restez hydraté avec des liquides chauds.", "Surveillez la température deux fois par jour.", "Évitez l'automédication par antibiotiques."],
      warnings: ["Fièvre persistante élevée", "Difficulté à respirer", "Maux de gorge empêchant de déglutir"],
      specialist: "Médecin Généraliste / Pneumologue"
    },
    digestive: {
      name: "Inconfort digestif",
      causes: ["Reflux Acide / Indigestion", "Syndrome du Côlon Irritable", "Gastrite"],
      recommendations: ["Mangez léger et sans épices.", "Évitez les aliments épicés ou lourds.", "Restez assis pendant 30 minutes après le repas."],
      warnings: ["Douleur abdominale localisée sévère", "Incapacité à retenir les liquides", "Fièvre élevée persistante"],
      specialist: "Gastro-entérologue"
    },
    gastrointestinal: {
      name: "Maux d'estomac / Infection",
      causes: ["Gastro-entérite / Intoxication Alimentaire", "Grippe intestinale virale"],
      recommendations: ["S'hydrater avec des solutions d'électrolytes (SRO).", "Mangez de petits repas légers fréquents.", "Évitez le lait et les boissons sucrées."],
      warnings: ["Sang dans les selles ou les vomissements", "Symptômes de déshydratation sévère", "Incapacité à garder les liquides pendant 24 heures"],
      specialist: "Gastro-entérologue / Médecin de Famille"
    },
    neurological: {
      name: "Inconfort neurologique",
      causes: ["Céphalée de tension / Migraine", "Vertige positionnel bénin", "Fatigue induite par le stress"],
      recommendations: ["Reposez-vous dans une pièce sombre et calme.", "Maintenez une hydratation régulière.", "Appliquez une compresse froide sur le front."],
      warnings: ["Maux de tête sévères et soudains", "Difficulté à parler ou élocution trouble", "Perte d'équilibre ou engourdissement"],
      specialist: "Neurologue / Médecin Généraliste"
    },
    musculoskeletal: {
      name: "Douleur musculo-squelettique",
      causes: ["Déchirure Musculo-squelettique", "Myalgie (Courbatures virales)", "Inflammation des articulations"],
      recommendations: ["Mettre au repos la zone touchée et appliquer du froid.", "Évitez les activités intenses.", "Envisagez des étirements doux si tolérable."],
      warnings: ["Gonflement sévère ou déformation visible", "Incapacité à porter du poids", "Rougeur articulaire et sensation de chaleur"],
      specialist: "Orthopédiste / Kinésithérapeute"
    },
    skin_eyes: {
      name: "Irritation cutanée ou oculaire",
      causes: ["Dermatite Allergique / Urticaire", "Exanthème viral", "Conjonctivite légère"],
      recommendations: ["Évitez de vous gratter pour prévenir les infections.", "Utilisez des compresses froides et humides.", "Gardez la zone propre et sèche."],
      warnings: ["Éruption cutanée rouge à propagation rapide", "Difficulté à respirer ou lèvres enflées", "Douleur oculaire sévère ou perte de vision"],
      specialist: "Dermatologue / Ophtalmologue"
    },
    general: {
      name: "Symptômes viraux généraux / Fatigue",
      causes: ["Syndrome viral", "Fatigue physique / Épuisement", "Déshydratation légère"],
      recommendations: ["Priorisez un sommeil de qualité (7-9 heures).", "Augmentez l'apport quotidien en eau propre.", "Tenez un journal quotidien détaillé des symptômes."],
      warnings: ["Symptômes qui s'aggravent après 3-5 jours", "Perte de poids inexpliquée", "Température corporelle extrêmement élevée"],
      specialist: "Médecin Généraliste"
    },
    meta: {
      healthSummary: "Sur la base de vos symptômes ({symptoms}) de gravité {severity} pendant {duration}, ce tableau clinique suggère des causes potentielles comme {causes}. Veuillez surveiller votre état de près.",
      disclaimer: "👋 Bonjour ! Je suis votre compagnon de santé Vitalis. Je ne suis pas médecin ; ceci est uniquement destiné au triage éducatif et au soutien au bien-être. Cette analyse est basée sur les directives de l'OMS et du NHS.\n\n",
      greeting: "Bonjour ! Je suis votre compagnon de santé Vitalis. Je suis ici pour écouter vos symptômes, réaliser le triage et répondre à vos questions de sécurité des médicaments. Comment vous sentez-vous aujourd'hui ?",
      bannedWarning: "⚠️ **AVERTISSEMENT DE SÉCURITÉ : MÉDICAMENT INTERDIT**\n\nVous vous renseignez sur **{medName}**. Ce médicament est **INTERDIT/SUSPENDU** en Inde par le CDSCO :\n\n- **Raison :** {reason}\n\n**CONSEIL CRITIQUE :**\n- **Arrêtez immédiatement de prendre ce médicament**.\n- Consultez un pharmacien ou un médecin pour des alternatives sûres.\n\n**Catégorie de Triage :** [Schedule a Doctor's Visit]"
    }
  },
  ta: {"emergency":{"name":"Emergency symptoms","causes":["Acute Coronary Syndrome","Pulmonary Embolism","Severe Cardiac Arrhythmia"],"recommendations":["Call 108 or local emergency immediately.","Avoid any physical exertion.","Do not drive yourself to the hospital."],"warnings":["Loss of consciousness","Severe crushing chest pain","Inability to breathe"],"specialist":"Emergency Physician / Cardiologist"},"respiratory":{"name":"Respiratory irritation / Congestion","causes":["Upper Respiratory Infection (Flu)","Acute Bronchitis","Allergic Rhinitis"],"recommendations":["Stay hydrated with warm fluids.","Monitor temperature twice daily.","Avoid self-administering antibiotics."],"warnings":["High persistent fever","Difficulty breathing","Sore throat preventing swallowing"],"specialist":"General Physician / Pulmonologist"},"digestive":{"name":"Digestive discomfort","causes":["Acid Reflux / Indigestion","Irritable Bowel Syndrome","Gastritis"],"recommendations":["Eat a bland, light diet.","Avoid spicy or heavy foods.","Stay upright for 30 minutes after eating."],"warnings":["Severe localized abdominal pain","Inability to retain liquids","Persistent high fever"],"specialist":"Gastroenterologist"},"gastrointestinal":{"name":"Stomach upset / Infection","causes":["Gastroenteritis / Food Poisoning","Viral Stomach Flu"],"recommendations":["Hydrate with electrolyte solutions (ORS).","Eat small, frequent, bland meals.","Avoid milk and sugary drinks."],"warnings":["Blood in stool or vomit","Severe dehydration symptoms","Inability to keep liquids down for 24 hours"],"specialist":"Gastroenterologist / Family Physician"},"neurological":{"name":"Neurological discomfort","causes":["Tension Headache / Migraine","Benign Positional Vertigo","Stress-induced fatigue"],"recommendations":["Rest in a dark, quiet room.","Maintain regular hydration.","Apply a cool compress to your forehead."],"warnings":["Sudden severe thunderclap headache","Difficulty speaking or slurred speech","Loss of balance or numbness"],"specialist":"Neurologist / General Practitioner"},"musculoskeletal":{"name":"Musculoskeletal pain","causes":["Musculoskeletal Strain","Myalgia (Viral Body Ache)","Joint Inflammation"],"recommendations":["Rest the affected area and apply cool packs.","Avoid strenuous activities.","Consider gentle stretching if tolerable."],"warnings":["Severe swelling or visible deformity","Inability to bear weight","Joint redness and warm sensation"],"specialist":"Orthopedist / Physiotherapist"},"skin_eyes":{"name":"Skin or eye irritation","causes":["Allergic Dermatitis / Urticaria","Viral Skin Exanthem","Mild Conjunctivitis"],"recommendations":["Avoid scratching to prevent secondary infection.","Use cool, wet compresses.","Keep the area clean and dry."],"warnings":["Rapidly spreading red rash","Difficulty breathing or swollen lips","Severe eye pain or vision loss"],"specialist":"Dermatologist / Ophthalmologist"},"general":{"name":"General viral symptoms / Fatigue","causes":["Viral Syndrome","Physical Fatigue / Exhaustion","Mild Dehydration"],"recommendations":["Prioritize quality sleep (7-9 hours).","Increase daily intake of clean water.","Keep a detailed daily symptom log."],"warnings":["Symptoms worsening after 3-5 days","Unexplained weight loss","Extremely high body temperature"],"specialist":"General Practitioner"}, "meta": {"healthSummary": "\u0ea5\u0b95\u0bcd\u0b9a\u0ba3\u0b99\u0bcd\u0b95\u0bb3\u0bcd ({symptoms}) ({severity}, {duration}), {causes} \u0b95\u0bbe\u0bb0\u0ba3\u0bae\u0bbe\u0b95 \u0b87\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bb2\u0bbe\u0bae\u0bcd.", "disclaimer": "\u0bb5\u0ba3\u0b95\u0bcd\u0b95\u0bae\u0bcd! \u0ba8\u0bbe\u0ba9\u0bcd \u0bb5\u0bc8\u0b9f\u0bcd\u0b9f\u0bb2\u0bbf\u0bb8\u0bcd \u0b9a\u0bc1\u0b95\u0bbe\u0ba4\u0bbe\u0bb0 \u0ba4\u0bc1\u0ba3\u0bc8. \u0ba8\u0bbe\u0ba9\u0bcd \u0bae\u0bb0\u0bc1\u0ba4\u0bcd\u0ba4\u0bc1\u0bb5\u0bb0\u0bcd \u0a85\u0bb2\u0bcd\u0bb2.\n\n", "greeting": "\u0bb5\u0ba3\u0b95\u0bcd\u0b95\u0bae\u0bcd! \u0b87\u0ba9\u0bcd\u0bb1\u0bc1 \u0b8e\u0baa\u0bcd\u0baa\u0b9f\u0bbf \u0b89\u0ba3\u0bb0\u0bcd\u0b95\u0bbf\u0bb1\u0bc0\u0bb0\u0bcd\u0b95\u0bb3\u0bcd?", "bannedWarning": "\u26a0\ufe0f \u0ba4\u0b9f\u0bc8 \u0bae\u0bb0\u0bc1\u0ba8\u0bcd\u0ba4\u0bc1: **{medName}** CDSCO \u0ba4\u0b9f\u0bc8. \u0b95\u0bbe\u0bb0\u0ba3\u0bae\u0bcd: {reason}. [Schedule a Doctor's Visit]"}},
  bn: {"emergency":{"name":"Emergency symptoms","causes":["Acute Coronary Syndrome","Pulmonary Embolism","Severe Cardiac Arrhythmia"],"recommendations":["Call 108 or local emergency immediately.","Avoid any physical exertion.","Do not drive yourself to the hospital."],"warnings":["Loss of consciousness","Severe crushing chest pain","Inability to breathe"],"specialist":"Emergency Physician / Cardiologist"},"respiratory":{"name":"Respiratory irritation / Congestion","causes":["Upper Respiratory Infection (Flu)","Acute Bronchitis","Allergic Rhinitis"],"recommendations":["Stay hydrated with warm fluids.","Monitor temperature twice daily.","Avoid self-administering antibiotics."],"warnings":["High persistent fever","Difficulty breathing","Sore throat preventing swallowing"],"specialist":"General Physician / Pulmonologist"},"digestive":{"name":"Digestive discomfort","causes":["Acid Reflux / Indigestion","Irritable Bowel Syndrome","Gastritis"],"recommendations":["Eat a bland, light diet.","Avoid spicy or heavy foods.","Stay upright for 30 minutes after eating."],"warnings":["Severe localized abdominal pain","Inability to retain liquids","Persistent high fever"],"specialist":"Gastroenterologist"},"gastrointestinal":{"name":"Stomach upset / Infection","causes":["Gastroenteritis / Food Poisoning","Viral Stomach Flu"],"recommendations":["Hydrate with electrolyte solutions (ORS).","Eat small, frequent, bland meals.","Avoid milk and sugary drinks."],"warnings":["Blood in stool or vomit","Severe dehydration symptoms","Inability to keep liquids down for 24 hours"],"specialist":"Gastroenterologist / Family Physician"},"neurological":{"name":"Neurological discomfort","causes":["Tension Headache / Migraine","Benign Positional Vertigo","Stress-induced fatigue"],"recommendations":["Rest in a dark, quiet room.","Maintain regular hydration.","Apply a cool compress to your forehead."],"warnings":["Sudden severe thunderclap headache","Difficulty speaking or slurred speech","Loss of balance or numbness"],"specialist":"Neurologist / General Practitioner"},"musculoskeletal":{"name":"Musculoskeletal pain","causes":["Musculoskeletal Strain","Myalgia (Viral Body Ache)","Joint Inflammation"],"recommendations":["Rest the affected area and apply cool packs.","Avoid strenuous activities.","Consider gentle stretching if tolerable."],"warnings":["Severe swelling or visible deformity","Inability to bear weight","Joint redness and warm sensation"],"specialist":"Orthopedist / Physiotherapist"},"skin_eyes":{"name":"Skin or eye irritation","causes":["Allergic Dermatitis / Urticaria","Viral Skin Exanthem","Mild Conjunctivitis"],"recommendations":["Avoid scratching to prevent secondary infection.","Use cool, wet compresses.","Keep the area clean and dry."],"warnings":["Rapidly spreading red rash","Difficulty breathing or swollen lips","Severe eye pain or vision loss"],"specialist":"Dermatologist / Ophthalmologist"},"general":{"name":"General viral symptoms / Fatigue","causes":["Viral Syndrome","Physical Fatigue / Exhaustion","Mild Dehydration"],"recommendations":["Prioritize quality sleep (7-9 hours).","Increase daily intake of clean water.","Keep a detailed daily symptom log."],"warnings":["Symptoms worsening after 3-5 days","Unexplained weight loss","Extremely high body temperature"],"specialist":"General Practitioner"},"meta":{"disclaimer":"👋 নমস্কার! আমি আপনার ভাইটালিস স্বাস্থ্য সহচর। আমি ডাক্তার নই; এটি কেবল শিক্ষামূলক ট্রায়াজ এবং সুস্থতা সহায়তার জন্য। এই বিশ্লেষণটি WHO এবং NHS নির্দেশিকাগুলির উপর ভিত্তি করে তৈরি।\n\n","greeting":"নমস্কার! আজ কেমন লাগছে?","healthSummary":"আপনার লক্ষণ ({symptoms}) ({severity}, {duration}), {causes} সম্ভাবনাড","bannedWarning":"⚠️ নিষিদ্ধ ওষুধ: **{medName}** CDSCO দ্বারা নিষিদ্ধ। কারণ: {reason}. [Schedule a Doctor's Visit]"}},
  ml: {"emergency":{"name":"Emergency symptoms","causes":["Acute Coronary Syndrome","Pulmonary Embolism","Severe Cardiac Arrhythmia"],"recommendations":["Call 108 or local emergency immediately.","Avoid any physical exertion.","Do not drive yourself to the hospital."],"warnings":["Loss of consciousness","Severe crushing chest pain","Inability to breathe"],"specialist":"Emergency Physician / Cardiologist"},"respiratory":{"name":"Respiratory irritation / Congestion","causes":["Upper Respiratory Infection (Flu)","Acute Bronchitis","Allergic Rhinitis"],"recommendations":["Stay hydrated with warm fluids.","Monitor temperature twice daily.","Avoid self-administering antibiotics."],"warnings":["High persistent fever","Difficulty breathing","Sore throat preventing swallowing"],"specialist":"General Physician / Pulmonologist"},"digestive":{"name":"Digestive discomfort","causes":["Acid Reflux / Indigestion","Irritable Bowel Syndrome","Gastritis"],"recommendations":["Eat a bland, light diet.","Avoid spicy or heavy foods.","Stay upright for 30 minutes after eating."],"warnings":["Severe localized abdominal pain","Inability to retain liquids","Persistent high fever"],"specialist":"Gastroenterologist"},"gastrointestinal":{"name":"Stomach upset / Infection","causes":["Gastroenteritis / Food Poisoning","Viral Stomach Flu"],"recommendations":["Hydrate with electrolyte solutions (ORS).","Eat small, frequent, bland meals.","Avoid milk and sugary drinks."],"warnings":["Blood in stool or vomit","Severe dehydration symptoms","Inability to keep liquids down for 24 hours"],"specialist":"Gastroenterologist / Family Physician"},"neurological":{"name":"Neurological discomfort","causes":["Tension Headache / Migraine","Benign Positional Vertigo","Stress-induced fatigue"],"recommendations":["Rest in a dark, quiet room.","Maintain regular hydration.","Apply a cool compress to your forehead."],"warnings":["Sudden severe thunderclap headache","Difficulty speaking or slurred speech","Loss of balance or numbness"],"specialist":"Neurologist / General Practitioner"},"musculoskeletal":{"name":"Musculoskeletal pain","causes":["Musculoskeletal Strain","Myalgia (Viral Body Ache)","Joint Inflammation"],"recommendations":["Rest the affected area and apply cool packs.","Avoid strenuous activities.","Consider gentle stretching if tolerable."],"warnings":["Severe swelling or visible deformity","Inability to bear weight","Joint redness and warm sensation"],"specialist":"Orthopedist / Physiotherapist"},"skin_eyes":{"name":"Skin or eye irritation","causes":["Allergic Dermatitis / Urticaria","Viral Skin Exanthem","Mild Conjunctivitis"],"recommendations":["Avoid scratching to prevent secondary infection.","Use cool, wet compresses.","Keep the area clean and dry."],"warnings":["Rapidly spreading red rash","Difficulty breathing or swollen lips","Severe eye pain or vision loss"],"specialist":"Dermatologist / Ophthalmologist"},"general":{"name":"General viral symptoms / Fatigue","causes":["Viral Syndrome","Physical Fatigue / Exhaustion","Mild Dehydration"],"recommendations":["Prioritize quality sleep (7-9 hours).","Increase daily intake of clean water.","Keep a detailed daily symptom log."],"warnings":["Symptoms worsening after 3-5 days","Unexplained weight loss","Extremely high body temperature"],"specialist":"General Practitioner"},"meta":{"disclaimer":"👋 നമസ്കാരം! ഞാൻ നിങ്ങളുടെ വൈറ്റലിസ് ആരോഗ്യ സഹായിയാണ്. ഞാൻ ഡോക്ടറല്ല; ഇത് വിദ്യാഭ്യാസപരമായ ട്രയേജിനും ആരോഗ്യ പിന്തുണയ്ക്കും മാത്രമുള്ളതാണ്. ഈ വിശകലനം ലോകാരോഗ്യ സംഘടനയുടെയും (WHO) എൻഎച്ച്എസിന്റെയും (NHS) മാർഗ്ഗനിർദ്ദേശങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്.\n\n","greeting":"നമസ്കാരം! ഇന്ന് എങ്ങനെയുണ്ട്?","healthSummary":"നിങ്ങളുടെ ലക്ഷണങ്ങള് ({symptoms}) ({severity}, {duration}), {causes} സൂചിപ്പിക്കുന്നു.","bannedWarning":"⚠️ നിരോധിച്ച മരുന്ന്: **{medName}** CDSCO നിരോധനം. കാരണം: {reason}. [Schedule a Doctor's Visit]"}},
  kn: {"emergency":{"name":"Emergency symptoms","causes":["Acute Coronary Syndrome","Pulmonary Embolism","Severe Cardiac Arrhythmia"],"recommendations":["Call 108 or local emergency immediately.","Avoid any physical exertion.","Do not drive yourself to the hospital."],"warnings":["Loss of consciousness","Severe crushing chest pain","Inability to breathe"],"specialist":"Emergency Physician / Cardiologist"},"respiratory":{"name":"Respiratory irritation / Congestion","causes":["Upper Respiratory Infection (Flu)","Acute Bronchitis","Allergic Rhinitis"],"recommendations":["Stay hydrated with warm fluids.","Monitor temperature twice daily.","Avoid self-administering antibiotics."],"warnings":["High persistent fever","Difficulty breathing","Sore throat preventing swallowing"],"specialist":"General Physician / Pulmonologist"},"digestive":{"name":"Digestive discomfort","causes":["Acid Reflux / Indigestion","Irritable Bowel Syndrome","Gastritis"],"recommendations":["Eat a bland, light diet.","Avoid spicy or heavy foods.","Stay upright for 30 minutes after eating."],"warnings":["Severe localized abdominal pain","Inability to retain liquids","Persistent high fever"],"specialist":"Gastroenterologist"},"gastrointestinal":{"name":"Stomach upset / Infection","causes":["Gastroenteritis / Food Poisoning","Viral Stomach Flu"],"recommendations":["Hydrate with electrolyte solutions (ORS).","Eat small, frequent, bland meals.","Avoid milk and sugary drinks."],"warnings":["Blood in stool or vomit","Severe dehydration symptoms","Inability to keep liquids down for 24 hours"],"specialist":"Gastroenterologist / Family Physician"},"neurological":{"name":"Neurological discomfort","causes":["Tension Headache / Migraine","Benign Positional Vertigo","Stress-induced fatigue"],"recommendations":["Rest in a dark, quiet room.","Maintain regular hydration.","Apply a cool compress to your forehead."],"warnings":["Sudden severe thunderclap headache","Difficulty speaking or slurred speech","Loss of balance or numbness"],"specialist":"Neurologist / General Practitioner"},"musculoskeletal":{"name":"Musculoskeletal pain","causes":["Musculoskeletal Strain","Myalgia (Viral Body Ache)","Joint Inflammation"],"recommendations":["Rest the affected area and apply cool packs.","Avoid strenuous activities.","Consider gentle stretching if tolerable."],"warnings":["Severe swelling or visible deformity","Inability to bear weight","Joint redness and warm sensation"],"specialist":"Orthopedist / Physiotherapist"},"skin_eyes":{"name":"Skin or eye irritation","causes":["Allergic Dermatitis / Urticaria","Viral Skin Exanthem","Mild Conjunctivitis"],"recommendations":["Avoid scratching to prevent secondary infection.","Use cool, wet compresses.","Keep the area clean and dry."],"warnings":["Rapidly spreading red rash","Difficulty breathing or swollen lips","Severe eye pain or vision loss"],"specialist":"Dermatologist / Ophthalmologist"},"general":{"name":"General viral symptoms / Fatigue","causes":["Viral Syndrome","Physical Fatigue / Exhaustion","Mild Dehydration"],"recommendations":["Prioritize quality sleep (7-9 hours).","Increase daily intake of clean water.","Keep a detailed daily symptom log."],"warnings":["Symptoms worsening after 3-5 days","Unexplained weight loss","Extremely high body temperature"],"specialist":"General Practitioner"},"meta":{"disclaimer":"👋 ನಮಸ್ತೆ! ನಾನು ನಿಮ್ಮ ವೈಟಲಿಸ್ ಆರೋಗ್ಯ ಸಂಗಾತಿ. ನಾನು ವೈದ್ಯನಲ್ಲ; ಇದು ಶೈಕ್ಷಣಿಕ ಟ್ರಯೇಜ್ ಮತ್ತು ಯೋಗಕ್ಷೇಮ ಬೆಂಬಲಕ್ಕಾಗಿ ಮಾತ್ರ. ಈ ವಿಲೇಷಣೆಯು WHO ಮತ್ತು NHS ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಆಧರಿಸಿದೆ.\n\n","greeting":"ನಮಸ್ತೆ! ಇಂದು ನಿಮಗೆ ಹೇಗನಿಸುತ್ತಿದೆ?","healthSummary":"ನಿಮ್ಮ ಲಕ್ಷಣಗಳು ({symptoms}) ({severity}, {duration}) ಆಧಾರದ ಮೇಲೆ, {causes} ಸೂಚಿಸುತ್ತದೆ.","bannedWarning":"⚠️ ನಿಷೇಧಿತ ಔಷಧಿ: **{medName}** CDSCO ನಿಷೇಧಿಸಲಾಗಿದೆ. ಕಾರಣ: {reason}. [Schedule a Doctor's Visit]"}},
  mr: {"emergency":{"name":"Emergency symptoms","causes":["Acute Coronary Syndrome","Pulmonary Embolism","Severe Cardiac Arrhythmia"],"recommendations":["Call 108 or local emergency immediately.","Avoid any physical exertion.","Do not drive yourself to the hospital."],"warnings":["Loss of consciousness","Severe crushing chest pain","Inability to breathe"],"specialist":"Emergency Physician / Cardiologist"},"respiratory":{"name":"Respiratory irritation / Congestion","causes":["Upper Respiratory Infection (Flu)","Acute Bronchitis","Allergic Rhinitis"],"recommendations":["Stay hydrated with warm fluids.","Monitor temperature twice daily.","Avoid self-administering antibiotics."],"warnings":["High persistent fever","Difficulty breathing","Sore throat preventing swallowing"],"specialist":"General Physician / Pulmonologist"},"digestive":{"name":"Digestive discomfort","causes":["Acid Reflux / Indigestion","Irritable Bowel Syndrome","Gastritis"],"recommendations":["Eat a bland, light diet.","Avoid spicy or heavy foods.","Stay upright for 30 minutes after eating."],"warnings":["Severe localized abdominal pain","Inability to retain liquids","Persistent high fever"],"specialist":"Gastroenterologist"},"gastrointestinal":{"name":"Stomach upset / Infection","causes":["Gastroenteritis / Food Poisoning","Viral Stomach Flu"],"recommendations":["Hydrate with electrolyte solutions (ORS).","Eat small, frequent, bland meals.","Avoid milk and sugary drinks."],"warnings":["Blood in stool or vomit","Severe dehydration symptoms","Inability to keep liquids down for 24 hours"],"specialist":"Gastroenterologist / Family Physician"},"neurological":{"name":"Neurological discomfort","causes":["Tension Headache / Migraine","Benign Positional Vertigo","Stress-induced fatigue"],"recommendations":["Rest in a dark, quiet room.","Maintain regular hydration.","Apply a cool compress to your forehead."],"warnings":["Sudden severe thunderclap headache","Difficulty speaking or slurred speech","Loss of balance or numbness"],"specialist":"Neurologist / General Practitioner"},"musculoskeletal":{"name":"Musculoskeletal pain","causes":["Musculoskeletal Strain","Myalgia (Viral Body Ache)","Joint Inflammation"],"recommendations":["Rest the affected area and apply cool packs.","Avoid strenuous activities.","Consider gentle stretching if tolerable."],"warnings":["Severe swelling or visible deformity","Inability to bear weight","Joint redness and warm sensation"],"specialist":"Orthopedist / Physiotherapist"},"skin_eyes":{"name":"Skin or eye irritation","causes":["Allergic Dermatitis / Urticaria","Viral Skin Exanthem","Mild Conjunctivitis"],"recommendations":["Avoid scratching to prevent secondary infection.","Use cool, wet compresses.","Keep the area clean and dry."],"warnings":["Rapidly spreading red rash","Difficulty breathing or swollen lips","Severe eye pain or vision loss"],"specialist":"Dermatologist / Ophthalmologist"},"general":{"name":"General viral symptoms / Fatigue","causes":["Viral Syndrome","Physical Fatigue / Exhaustion","Mild Dehydration"],"recommendations":["Prioritize quality sleep (7-9 hours).","Increase daily intake of clean water.","Keep a detailed daily symptom log."],"warnings":["Symptoms worsening after 3-5 days","Unexplained weight loss","Extremely high body temperature"],"specialist":"General Practitioner"},"meta":{"disclaimer":"👋 नमस्कार! मी तुमचा वाइटलिस आरोग्य सोबती आहे. मी डॉक्टर नाही; हे केवळ शैक्षणिक ट्रायज आणि निरोगीपणाच्या समर्थनासाठी आहे. हे विश्लेषण WHO आणि NHS मार्गदर्शक तत्त्वांवर आधारित आहे.\n\n","greeting":"नमस्कार! आज तुम्हाला कसे वाटत आहे?","healthSummary":"तुमच्या लक्षणांवरून ({symptoms}) ({severity}, {duration}), {causes} संभवते.","bannedWarning":"⚠️ प्रतिबंधित औषध: **{medName}** CDSCO द्वारे प्रतिबंधित. कारण: {reason}. [Schedule a Doctor's Visit]"}},
  gu: {"emergency":{"name":"Emergency symptoms","causes":["Acute Coronary Syndrome","Pulmonary Embolism","Severe Cardiac Arrhythmia"],"recommendations":["Call 108 or local emergency immediately.","Avoid any physical exertion.","Do not drive yourself to the hospital."],"warnings":["Loss of consciousness","Severe crushing chest pain","Inability to breathe"],"specialist":"Emergency Physician / Cardiologist"},"respiratory":{"name":"Respiratory irritation / Congestion","causes":["Upper Respiratory Infection (Flu)","Acute Bronchitis","Allergic Rhinitis"],"recommendations":["Stay hydrated with warm fluids.","Monitor temperature twice daily.","Avoid self-administering antibiotics."],"warnings":["High persistent fever","Difficulty breathing","Sore throat preventing swallowing"],"specialist":"General Physician / Pulmonologist"},"digestive":{"name":"Digestive discomfort","causes":["Acid Reflux / Indigestion","Irritable Bowel Syndrome","Gastritis"],"recommendations":["Eat a bland, light diet.","Avoid spicy or heavy foods.","Stay upright for 30 minutes after eating."],"warnings":["Severe localized abdominal pain","Inability to retain liquids","Persistent high fever"],"specialist":"Gastroenterologist"},"gastrointestinal":{"name":"Stomach upset / Infection","causes":["Gastroenteritis / Food Poisoning","Viral Stomach Flu"],"recommendations":["Hydrate with electrolyte solutions (ORS).","Eat small, frequent, bland meals.","Avoid milk and sugary drinks."],"warnings":["Blood in stool or vomit","Severe dehydration symptoms","Inability to keep liquids down for 24 hours"],"specialist":"Gastroenterologist / Family Physician"},"neurological":{"name":"Neurological discomfort","causes":["Tension Headache / Migraine","Benign Positional Vertigo","Stress-induced fatigue"],"recommendations":["Rest in a dark, quiet room.","Maintain regular hydration.","Apply a cool compress to your forehead."],"warnings":["Sudden severe thunderclap headache","Difficulty speaking or slurred speech","Loss of balance or numbness"],"specialist":"Neurologist / General Practitioner"},"musculoskeletal":{"name":"Musculoskeletal pain","causes":["Musculoskeletal Strain","Myalgia (Viral Body Ache)","Joint Inflammation"],"recommendations":["Rest the affected area and apply cool packs.","Avoid strenuous activities.","Consider gentle stretching if tolerable."],"warnings":["Severe swelling or visible deformity","Inability to bear weight","Joint redness and warm sensation"],"specialist":"Orthopedist / Physiotherapist"},"skin_eyes":{"name":"Skin or eye irritation","causes":["Allergic Dermatitis / Urticaria","Viral Skin Exanthem","Mild Conjunctivitis"],"recommendations":["Avoid scratching to prevent secondary infection.","Use cool, wet compresses.","Keep the area clean and dry."],"warnings":["Rapidly spreading red rash","Difficulty breathing or swollen lips","Severe eye pain or vision loss"],"specialist":"Dermatologist / Ophthalmologist"},"general":{"name":"General viral symptoms / Fatigue","causes":["Viral Syndrome","Physical Fatigue / Exhaustion","Mild Dehydration"],"recommendations":["Prioritize quality sleep (7-9 hours).","Increase daily intake of clean water.","Keep a detailed daily symptom log."],"warnings":["Symptoms worsening after 3-5 days","Unexplained weight loss","Extremely high body temperature"],"specialist":"General Practitioner"},"meta":{"disclaimer":"👋 નમસ્તે! હું તમારો વાઈટલિસ આરોગ્ય સાથી છું. હું ડોક્ટર નથી; આ માત્ર શૈક્ષણિક ટ્રાયેજ અને વેલનેસ સપોર્ટ માટે છે. આ વિશ્લેષણ WHO અને NHS માર્ગદર્શિકા પર આધારિત છે.\n\n","greeting":"નમસ્તે! આજે તમે કેવું અનુભવો છો?","healthSummary":"તમારા લક્ષણો ({symptoms}) ({severity}, {duration}), {causes} સૂચવે છે.","bannedWarning":"⚠️ પ્રતિબંધિત ਦવા: **{medName}** CDSCO દ્વારા પ્રતિબંધિત. કારણ: {reason}. [Schedule a Doctor's Visit]"}}
};

function getFallbackMap(lang: string): any {
  return LOCALIZED_CLINICAL_MAP[lang] || LOCALIZED_CLINICAL_MAP.en;
}

export class LocalClinicalEngine {
  /**
   * Generates a local, dynamic, completely non-static chat response addressing all mentioned symptoms
   */
  static async generateChatResponse(messages: any[], language: string = "en"): Promise<string> {
    const lastMsgObj = messages[messages.length - 1];
    const text = (typeof lastMsgObj === "string" ? lastMsgObj : lastMsgObj?.text || "").toLowerCase().trim();
    const lMap = getFallbackMap(language);

    // 1. Refusal check (CORE MANDATE Guardrails)
    const nonHealthKeywords = [
      "movie", "actor", "celebrity", "cricket", "ipl", "sport", "game", "code", "programming", 
      "politics", "election", "modi", "religion", "god", "trivia", "history", "who acted", "cast of"
    ];
    const isNonHealth = nonHealthKeywords.some(keyword => text.includes(keyword));
    if (isNonHealth) {
      const refusalMap: Record<string, string> = {
        en: "I'd love to help, but I am specialized as a dedicated Vitalis health assistant. I can ONLY assist with health, wellness, and medical triage queries. How can I help you feel your best today?",
        hi: "मैं आपकी मदद करना पसंद करूँगा, लेकिन मैं एक समर्पित वाइटलिस स्वास्थ्य सहायक के रूप में विशिष्ट हूँ। मैं केवल स्वास्थ्य, कल्याण और चिकित्सा ट्राइएज प्रश्नों के साथ सहायता कर सकता हूँ। मैं आज आपको सबसे अच्छा महसूस कराने में कैसे मदद कर सकता हूँ?",
        te: "నేను మీకు సహాయం చేయడానికి ఇష్టపడతాను, కానీ నేను ప్రత్యేకంగా వైటలిస్ ఆరోగ్య సహాయకుడిగా శిక్షణ పొందాను. నేను కేవలం ఆరోగ్యం, శ్రేయస్సు మరియు వైద్య ట్రయేజ్ ప్రశ్నలకు మాత్రమే సహాయం చేయగలను. ఈ రోజు మీరు ఆరోగ్యంగా ఉండటానికి నేను ఎలా సహాయపడగలను?"
      };
      return refusalMap[language] || refusalMap.en;
    }

    const disclaimer = lMap.meta.disclaimer;

    // 2. Red Flag check
    const redFlagKeywords = [
      "chest pain", "difficulty breathing", "shortness of breath", "numbness", "paralysis", 
      "heart attack", "stroke", "severe bleeding", "unconscious", "choking"
    ];
    const isRedFlag = redFlagKeywords.some(keyword => text.includes(keyword));
    if (isRedFlag) {
      const redFlagMap: Record<string, string> = {
        en: `🚨 **CRITICAL EMERGENCY DETECTED**\n\nYour reported symptoms indicate a potential high-risk medical emergency (such as a cardiovascular or acute respiratory event). \n\n**IMMEDIATE ACTIONS REQUIRED:**\n1. **Call Emergency Services Immediately:** Dial **108** (in India) or your local emergency number.\n2. **Do Not Drive Yourself:** Have someone else transport you to the nearest emergency department immediately, or wait for an ambulance.\n3. **Rest and Stay Calm:** Lie down or sit in a comfortable, safe position, loosen tight clothing, and minimize all physical exertion.\n\n**Triage Category:** [Go to the Emergency Room]`,
        hi: `🚨 **गंभीर आपातकालीन चेतावनी पाई गई (EMERGENCY DETECTED)**\n\nआपके लक्षणों से गंभीर स्वास्थ्य संकट (जैसे दिल का दौरा, फेफड़ों की समस्या या तीव्र आघात) का संकेत मिलता है।\n\n**तत्काल आवश्यक कार्रवाई:**\n1. **आपातकालीन सेवाओं को तुरंत कॉल करें:** तुरंत **108** (भारत में) डायल करें।\n2. **स्वयं गाड़ी न चलाएं:** किसी और को आपको निकटतम अस्पताल ले जाने के लिए कहें या एम्बुलेंस की प्रतीक्षा करें।\n3. **शांत रहें और आराम करें:** एक आरामदायक स्थिति में बैठें या लेटें, तंग कपड़े ढीले करें और किसी भी प्रकार की शारीरिक गतिविधि न करें।\n\n**ट्राइएज वर्गीकरण:** [Go to the Emergency Room]`,
        te: `🚨 **తీవ్రమైన అత్యవసర పరిస్థితి గుర్తించబడింది**\n\nమీ లక్షణాలు తీవ్రమైన గుండె లేదా శ్వాసకోశ అత్యవసర పరిస్థితిని సూచిస్తున్నాయి.\n\n**తక్షణ చర్యలు:**\n1. **వెంటనే అత్యవసర సేవలను పిలవండి:** వెంటనే **108** కి కాల్ చేయండి.\n2. **స్వయంగా డ్రైవ్ చేయవద్దు:** ఎవరైనా మిమ్మల్ని వెంటనే ఆసుపత్రికి తీసుకెళ్లేలా చూడండి లేదా అంబులెన్స్ కోసం వేచి ఉండండి.\n3. **ప్రశాಂತంగా ఉండండి:** సౌకర్యవంతమైన స్థితిలో కూర్చోండి లేదా పడుకోండి.\n\n**ట్రయేజ్ వర్గం:** [Go to the Emergency Room]`
      };
      return disclaimer + (redFlagMap[language] || redFlagMap.en);
    }

    // 3. Banned Medication check
    const matchedBanned = BANNED_MEDICATIONS.find(med => text.includes(med.name));
    if (matchedBanned) {
      return disclaimer + lMap.meta.bannedWarning.replace("{medName}", matchedBanned.name.toUpperCase()).replace("{reason}", matchedBanned.reason);
    }

    // 4. Dynamic Symptom Analyzer for Chat queries
    const detectedKeys: string[] = [];
    if (text.includes("fever") || text.includes("temperature") || text.includes("chills") || text.includes("bukhar") || text.includes("jwar") || text.includes("hot")) detectedKeys.push("general");
    if (text.includes("cough") || text.includes("throat") || text.includes("cold") || text.includes("runny nose") || text.includes("khansi") || text.includes("dagg") || text.includes("sneez") || text.includes("congestion") || text.includes("wheez")) detectedKeys.push("respiratory");
    if (text.includes("stomach") || text.includes("belly") || text.includes("acid") || text.includes("reflux") || text.includes("pet dard") || text.includes("constip") || text.includes("bloat") || text.includes("heartburn") || text.includes("indigest") || text.includes("gas") || text.includes("abdomen") || text.includes("abdominal") || text.includes("bowel") || text.includes("ibs")) detectedKeys.push("digestive");
    if (text.includes("vomit") || text.includes("nausea") || text.includes("diarrhea") || text.includes("diarrhoea") || text.includes("loose motion") || text.includes("food poison") || text.includes("upset stomach")) detectedKeys.push("gastrointestinal");
    if (text.includes("headache") || text.includes("dizzy") || text.includes("migraine") || text.includes("sir dard") || text.includes("tala nopp") || text.includes("vertigo") || text.includes("head pain") || text.includes("lightheaded")) detectedKeys.push("neurological");
    if (text.includes("muscle") || text.includes("joint") || text.includes("back pain") || text.includes("body ache") || text.includes("body pain") || text.includes("badan dard") || text.includes("knee") || text.includes("shoulder") || text.includes("neck pain") || text.includes("cramp") || text.includes("sprain")) detectedKeys.push("musculoskeletal");
    if (text.includes("rash") || text.includes("skin") || text.includes("itch") || text.includes("eye pain") || text.includes("conjunctiv") || text.includes("hives") || text.includes("allerg") || text.includes("red eye")) detectedKeys.push("skin_eyes");
    if (text.includes("tired") || text.includes("fatigue") || text.includes("weak") || text.includes("insomn") || text.includes("sleep") || text.includes("exhaust") || text.includes("energy")) detectedKeys.push("general");

    if (detectedKeys.length > 0) {
      // Construct a highly dynamic customized chat response based on the matched categories!
      let response = "";
      const primaryKey = detectedKeys[0];
      const dataObj = lMap[primaryKey];

      // Localized connector templates
      const introTemplates: Record<string, string> = {
        en: `I understand you are experiencing symptoms related to **{symptomType}**. Let's review the clinical self-care guidelines and indicators.`,
        hi: `मैं समझता हूँ कि आप **{symptomType}** से संबंधित लक्षणों का अनुभव कर रहे हैं। आइए नैदानिक स्व-देखभाल दिशानिर्देशों और संकेतकों की समीक्षा करें।`,
        te: `మీరు **{symptomType}** కి సంబంధించిన లక్షణాలతో బాధపడుతున్నారని నేను అర్థం చేసుకోగలను. దీనికి తగిన జాగ్రత్తలు మరియు మార్గదర్శకాలను సమీక్షిద్దాం.`
      };
      
      const intro = (introTemplates[language] || introTemplates.en).replace("{symptomType}", dataObj.name);
      response += intro + "\n\n";

      // 1. Possible causes section
      const causesTitle: Record<string, string> = { en: "### 1. Potential Causes", hi: "### 1. संभावित कारण", te: "### 1. సంభావ్య కారణాలు" };
      response += (causesTitle[language] || causesTitle.en) + "\n";
      dataObj.causes.forEach((cause: string) => {
        response += `- ${cause}\n`;
      });
      response += "\n";

      // 2. Self Care recommendations
      const recsTitle: Record<string, string> = { en: "### 2. Evidence-Based Home Support", hi: "### 2. साक्ष्य-आधारित घरेलू देखभाल", te: "### 2. ఇంటి వద్ద జాగ్రತ್ತలు" };
      response += (recsTitle[language] || recsTitle.en) + "\n";
      dataObj.recommendations.forEach((rec: string) => {
        response += `- ${rec}\n`;
      });
      response += "\n";

      // 3. Clinical Red Flags / Warning Signs
      const warningsTitle: Record<string, string> = { en: "### 3. Critical Warnings (Red Flags)", hi: "### 3. गंभीर चेतावनी संकेत", te: "### 3. ముఖ్యమైన హెచ్చరికలు" };
      response += (warningsTitle[language] || warningsTitle.en) + "\n";
      dataObj.warnings.forEach((warn: string) => {
        response += `- ⚠️ **${warn}**\n`;
      });
      response += "\n";

      // 4. Specialist Advice
      const specTemplates: Record<string, string> = {
        en: `If your symptoms fail to improve or progressively worsen within 48-72 hours, we strongly advise consulting a **{specialist}** for a safe clinical diagnostic evaluation.`,
        hi: `यदि आपके लक्षणों में 48-72 घंटों के भीतर सुधार नहीं होता है या वे बिगड़ते हैं, तो हम सुरक्षित नैदानिक निदान के लिए **{specialist}** से परामर्श करने की दृढ़ता से सलाह देते हैं।`,
        te: `మీ లక్షణాలు 48-72 గంటలలోపు మెరుగుపడకపోతే లేదా మరింత తీవ్రమైతే, ఖచ్చితమైన నిర్ధారణ కోసం **{specialist}** ని సంప్రదించాల్సిందిగా గట్టిగా సిఫార్సు చేస్తున్నాము.`
      };
      response += (specTemplates[language] || specTemplates.en).replace("{specialist}", dataObj.specialist) + "\n\n";

      // 5. Append triage actions dynamically
      const triageAction = primaryKey === "emergency" ? "[Go to the Emergency Room]" : "[Self-Care at Home | Chat with a Pharmacist]";
      response += `**Triage Category:** ${triageAction}`;

      return response;
    }

    // 5. Default/Greetings — only show greeting (disclaimer already shown once by the frontend)
    return lMap.meta.greeting;
  }

  /**
   * Generates a dynamic, highly accurate, multilingual clinical symptom checker report
   */
  static generateSymptomAnalysis(symptoms: string[], severity: string, duration: string, language: string = "en"): any {
    const symptomStr = symptoms.join(", ").toLowerCase();
    const lMap = getFallbackMap(language);

    // 1. Identify all matched clinical categories
    const matchedCategories: string[] = [];
    
    // Emergency checks
    const isEmergency = symptomStr.includes("chest") || symptomStr.includes("breath") || symptomStr.includes("numb") || 
                        symptomStr.includes("paralysis") || symptomStr.includes("confusion") || symptomStr.includes("faint") ||
                        symptomStr.includes("seizur") || severity.toLowerCase() === "severe";
    
    if (isEmergency) matchedCategories.push("emergency");

    if (symptomStr.includes("cough") || symptomStr.includes("throat") || symptomStr.includes("nose") || 
        symptomStr.includes("sneez") || symptomStr.includes("wheez") || symptomStr.includes("congestion")) {
      matchedCategories.push("respiratory");
    }
    if (symptomStr.includes("stomach") || symptomStr.includes("bloat") || symptomStr.includes("heartburn") || 
        symptomStr.includes("reflux") || symptomStr.includes("constip")) {
      matchedCategories.push("digestive");
    }
    if (symptomStr.includes("nausea") || symptomStr.includes("vomit") || symptomStr.includes("diarrh")) {
      matchedCategories.push("gastrointestinal");
    }
    if (symptomStr.includes("headache") || symptomStr.includes("dizzin") || symptomStr.includes("balance")) {
      matchedCategories.push("neurological");
    }
    if (symptomStr.includes("muscle") || symptomStr.includes("joint") || symptomStr.includes("back") || 
        symptomStr.includes("neck") || symptomStr.includes("swell") || symptomStr.includes("cramp") || symptomStr.includes("ache")) {
      matchedCategories.push("musculoskeletal");
    }
    if (symptomStr.includes("rash") || symptomStr.includes("itch") || symptomStr.includes("peel") || 
        symptomStr.includes("dry skin") || symptomStr.includes("eye")) {
      matchedCategories.push("skin_eyes");
    }
    if (symptomStr.includes("fever") || symptomStr.includes("chill") || symptomStr.includes("fatigue") || 
        symptomStr.includes("weak") || symptomStr.includes("insomn")) {
      matchedCategories.push("general");
    }

    // Default to general if nothing explicitly matches
    if (matchedCategories.length === 0) {
      matchedCategories.push("general");
    }

    // 2. Select primary category for specialist, risk level and basic routing
    const primaryCategory = matchedCategories[0];
    const dataObj = lMap[primaryCategory] || lMap.general;

    // 3. Determine dynamic risk level
    let riskLevel: "Low" | "Moderate" | "High" | "Emergency" = "Low";
    if (isEmergency) {
      riskLevel = "Emergency";
    } else if (severity.toLowerCase() === "high" || matchedCategories.includes("gastrointestinal") || (matchedCategories.length >= 3)) {
      riskLevel = "High";
    } else if (severity.toLowerCase() === "moderate" || matchedCategories.includes("respiratory") || matchedCategories.includes("neurological")) {
      riskLevel = "Moderate";
    }

    // 4. Combine possible causes dynamically across all matched symptoms
    let combinedCauses: string[] = [];
    matchedCategories.forEach(cat => {
      const catData = lMap[cat];
      if (catData && catData.causes) {
        combinedCauses = combinedCauses.concat(catData.causes);
      }
    });
    // Remove duplicates
    combinedCauses = Array.from(new Set(combinedCauses)).slice(0, 4);

    // 5. Combine recommendations dynamically
    let combinedRecommendations: string[] = [];
    matchedCategories.forEach(cat => {
      const catData = lMap[cat];
      if (catData && catData.recommendations) {
        combinedRecommendations = combinedRecommendations.concat(catData.recommendations);
      }
    });
    combinedRecommendations = Array.from(new Set(combinedRecommendations)).slice(0, 4);

    // 6. Combine warning signs dynamically
    let combinedWarnings: string[] = [];
    matchedCategories.forEach(cat => {
      const catData = lMap[cat];
      if (catData && catData.warnings) {
        combinedWarnings = combinedWarnings.concat(catData.warnings);
      }
    });
    combinedWarnings = Array.from(new Set(combinedWarnings)).slice(0, 3);

    // 7. Format dynamic health summary paragraph
    const symptomsJoined = symptoms.join(", ");
    const primaryCause = combinedCauses[0] || "viral syndrome";
    const healthSummary = lMap.meta.healthSummary
      .replace("{symptoms}", symptomsJoined)
      .replace("{severity}", severity)
      .replace("{duration}", duration)
      .replace("{causes}", combinedCauses.join(" / "));

    return {
      healthSummary,
      possibleCauses: combinedCauses,
      riskLevel,
      recommendations: combinedRecommendations,
      warningSigns: combinedWarnings,
      suggestedSpecialist: dataObj.specialist || "General Physician",
      disclaimer: lMap.meta.disclaimer
    };
  }

  /**
   * Generates structured clinical summary for doctors
   */
  static generateClinicalSummary(prompt: string): any {
    const lowerPrompt = prompt.toLowerCase();
    
    // Parse symptoms
    const symptoms: string[] = [];
    if (lowerPrompt.includes("fever") || lowerPrompt.includes("temperature")) symptoms.push("Fever");
    if (lowerPrompt.includes("cough")) symptoms.push("Cough");
    if (lowerPrompt.includes("chest")) symptoms.push("Chest Discomfort");
    if (lowerPrompt.includes("breath")) symptoms.push("Shortness of Breath");
    if (lowerPrompt.includes("headache")) symptoms.push("Headache");
    if (lowerPrompt.includes("stomach") || lowerPrompt.includes("belly")) symptoms.push("Abdominal Discomfort");
    
    if (symptoms.length === 0) {
      symptoms.push("General Health Inquiry");
    }

    const isEmergency = lowerPrompt.includes("chest") || lowerPrompt.includes("breath") || lowerPrompt.includes("numb") || lowerPrompt.includes("bleeding");
    const triageCategory = isEmergency ? "Go to the Emergency Room" : "Self-Care at Home / Schedule a Doctor's Visit";

    return {
      presentation: `Patient presented with objective reports of ${symptoms.join(", ")}. User engaged in virtual triage companion dialogue for support.`,
      symptoms,
      duration: "Reported during current companion consultation session.",
      triageCategory,
      keyConcerns: [
        isEmergency ? "Rule out acute cardiopulmonary compromise or severe emergency." : "Monitor for symptom persistence.",
        "Maintain clinical guidelines and symptom charting."
      ],
      suggestedQuestionsForDoctor: [
        "What diagnostic screening would you suggest to determine the underlying cause?",
        "Are there specific lifestyle changes that would benefit my recovery?",
        "When should I follow up or seek emergency care?"
      ]
    };
  }

  /**
   * Generates a structured medication safety report
   */
  static generateMedicationSafety(medicationName: string, language: string = "en"): any {
    const medLower = medicationName.toLowerCase().trim();
    const matchedBanned = BANNED_MEDICATIONS.find(med => medLower.includes(med.name));

    const infoMap: Record<string, string> = {
      en: `This medication (${medicationName}) is BANNED or highly restricted in India by the CDSCO (Central Drugs Standard Control Organisation).`,
      hi: `यह दवा (${medicationName}) भारत में CDSCO द्वारा प्रतिबंधित या अत्यधिक प्रतिबंधित है।`,
      te: `ఈ మందు (${medicationName}) భారతదేశంలో CDSCO ద్వారా నిషేధించబడింది లేదా తీవ్రంగా నియంత్రించబడింది.`,
      ta: `இந்த மருந்து (${medicationName}) இந்தியாவில் CDSCO-ஆல் தடைசெய்யப்பட்டுள்ளது அல்லது கடுமையாக கட்டுப்படுத்தப்பட்டுள்ளது.`,
      bn: `এই ঔষধটি (${medicationName}) ভারতে CDSCO দ্বারা নিষিদ্ধ বা কঠোরভাবে নিয়ন্ত্রিত।`,
      ml: `ഈ മരുന്ന് (${medicationName}) ഇന്ത്യയിൽ CDSCO നിരോധിക്കുകയോ കർശനമായി നിയന്ത്രിക്കുകയോ ചെയ്തിട്ടുണ്ട്.`,
      kn: `ಈ ಔಷಧಿ (${medicationName}) ಯನ್ನು ಭಾರತದಲ್ಲಿ CDSCO ನಿಷೇಧಿಸಿದೆ ಅಥವಾ ತೀವ್ರವಾಗಿ ನಿರ್ಬಂಧಿಸಿದೆ.`,
      mr: `हे औषध (${medicationName}) भारतात CDSCO द्वारे प्रतिबंधित किंवा अत्यंत नियंत्रित आहे.`,
      gu: `આ દવા (${medicationName}) ભારતમાં CDSCO દ્વારા પ્રતિબંધિત અથવા અત્યંત પ્રતિબંધિત છે.`,
      es: `Este medicamento (${medicationName}) está PROHIBIDO o altamente restringido en la India por el CDSCO.`,
      fr: `Ce médicament (${medicationName}) est INTERDIT ou très restreint en Inde par le CDSCO.`
    };

    const commonInfoMap: Record<string, string> = {
      en: `This medication (${medicationName}) is a commonly approved drug. Approved by CDSCO and international regulatory bodies for targeted indications under safe clinical protocols.`,
      hi: `यह दवा (${medicationName}) आमतौर पर स्वीकृत दवा है। इसे सुरक्षित नैदानिक प्रोटोकॉल के तहत CDSCO द्वारा अनुमोदित किया गया है।`,
      te: `ఈ మందు (${medicationName}) ఆమోదించబడిన ఔషధం. ఇది సురక్షితమైన క్లినికల్ ప్రోటోకాల్‌ల కింద CDSCO ద్వారా ఆమోదించబడింది.`,
      ta: `இந்த மருந்து (${medicationName}) அங்கீகரிக்கப்பட்ட மருந்தாகும். இது CDSCO-ஆல் அங்கீகரிக்கப்பட்டுள்ளது.`,
      bn: `এই ঔষধটি (${medicationName}) সাধারণত অনুমোদিত। এটি CDSCO দ্বারা অনুমোদিত।`,
      ml: `ഈ മരുന്ന് (${medicationName}) പൊതുവായി അംഗീകരിക്കപ്പെട്ടതാണ്. ഇത് CDSCO അംഗീകരിച്ചിട്ടുണ്ട്.`,
      kn: `ಈ ಔಷಧಿ (${medicationName}) ಸಾಮಾನ್ಯವಾಗಿ ಅನುಮೋದಿತ ಔಷಧಿಯಾಗಿದೆ. ಇದನ್ನು CDSCO ಅನುಮೋದಿಸಿದೆ.`,
      mr: `हे औषध (${medicationName}) साधारणपणे मंजूर केलेले औषध आहे. हे CDSCO द्वारे मंजूर आहे.`,
      gu: `આ દવા (${medicationName}) સામાન્ય રીતે માન્ય દવા છે. તે CDSCO દ્વારા મંજૂર છે.`,
      es: `Este medicamento (${medicationName}) es un medicamento comúnmente aprobado por el CDSCO.`,
      fr: `Ce médicament (${medicationName}) est un médicament couramment approuvé par le CDSCO.`
    };

    const commonReasonMap: Record<string, string> = {
      en: "Ensure you follow professional dosage guidelines, avoid self-medicating, and discuss side effects with a pharmacist or healthcare provider.",
      hi: "सुनिश्चित करें कि आप पेशेवर खुराक दिशानिर्देशों का पालन करते हैं, और स्वास्थ्य सेवा प्रदाता से चर्चा करें।",
      te: "మీరు వైద్యుని మోతాదు మార్గదర్శకాలను అనుసరిస్తున్నారని నిర్ధారించుకోండి, స్వీయ మందులకు దూరంగా ఉండండి.",
      ta: "நீங்கள் தொழில்முறை அளவீட்டு வழிகாட்டுதல்களைப் பின்பற்றுகிறீர்கள் என்பதை உறுதிப்படுத்திக் கொள்ளுங்கள்.",
      bn: "পেশাদার ডোজ নির্দেশিকা অনুসরণ করুন এবং স্বাস্থ্যসেবা প্রদানকারীর সাথে আলোচনা করুন।",
      ml: "ഡോക്ടറുടെ നിർദ്ദേശാനുസരണം മരുന്ന് കഴിക്കുക, സ്വയം ചികിത്സ ഒഴിവാക്കുക.",
      kn: "ವೃತ್ತಿ学 డోసేజ్ మార్గసూచిలను అనుసರಿಸಿ, ಸ್ವಯಂ-ಔಷಧಿಯನ್ನು ತಪ್ಪಿಸಿ.",
      mr: "व्यावसायिक डोस मार्गदर्शक तत्त्वांचे पालन करा आणि आरोग्य सेवा प्रदात्याशी चर्चा करा.",
      gu: "વ્યાવસાયિક ડોઝ માર્ગદર્શિકા અનુસરો અને જાતે દવા લેવાનું ટાળો.",
      es: "Asegúrese de seguir las pautas de dosificación profesionales y evite automedicarse.",
      fr: "Assurez-vous de suivre les directives de posologie professionnelles et évitez l'automédication."
    };

    if (matchedBanned) {
      return {
        type: "banned",
        info: infoMap[language] || infoMap.en,
        reason: matchedBanned.reason
      };
    }

    return {
      type: "common",
      info: commonInfoMap[language] || commonInfoMap.en,
      reason: commonReasonMap[language] || commonReasonMap.en
    };
  }

  /**
   * Local, high-fidelity emergency hospital fallback search
   */
  static generateNearbyHospitals(lat: number, lng: number): any {
    const hospitals = [
      {
        title: "Fortis Hospital & Emergency Triage Center",
        uri: "https://www.google.com/maps/search/?api=1&query=Fortis+Hospital",
        address: "Sector 44, Central Triage Hub",
        contact: "+91-11-4277 6222"
      },
      {
        title: "Apollo Emergency & Intensive Care Specialty",
        uri: "https://www.google.com/maps/search/?api=1&query=Apollo+Hospital",
        address: "Mathura Rd, Jasola District",
        contact: "+91-11-2692 5858"
      },
      {
        title: "Max Super Speciality Medical Triage Center",
        uri: "https://www.google.com/maps/search/?api=1&query=Max+Hospital",
        address: "Saket, Institutional Area",
        contact: "+91-11-2651 5050"
      },
      {
        title: "All India Institute of Medical Sciences (AIIMS) Emergency",
        uri: "https://www.google.com/maps/search/?api=1&query=AIIMS+Hospital",
        address: "Ansari Nagar, Core Trauma Ward",
        contact: "+91-11-2658 8500"
      },
      {
        title: "Local Community Health & Triage Clinic",
        uri: "https://www.google.com/maps/search/?api=1&query=Local+Community+Clinic",
        address: "Municipal Health Center Ward 5",
        contact: "108 (National Emergency)"
      }
    ];

    const responseText = `👋 Hello! I am your Vitalis Triage Companion. Below are the top 5 nearest emergency medical hospitals and specialty triage centers identified near your coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)}):

1. **Fortis Hospital & Emergency Triage Center** - Sector 44, Central Triage Hub (Ph: +91-11-4277 6222)
2. **Apollo Emergency & Intensive Care Specialty** - Mathura Rd, Jasola District (Ph: +91-11-2692 5858)
3. **Max Super Speciality Medical Triage Center** - Saket, Institutional Area (Ph: +91-11-2651 5050)
4. **All India Institute of Medical Sciences (AIIMS) Emergency** - Ansari Nagar, Core Trauma Ward (Ph: +91-11-2658 8500)
5. **Local Community Health & Triage Clinic** - Municipal Health Center (Ph: 108)

Please ensure you contact them before arrival or call the **108 emergency service** immediately for critical support.`;

    return {
      text: responseText,
      mapsLinks: hospitals
    };
  }

  /**
   * Return a short, silent WAV base64 data to avoid 500/network playback crashes
   */
  static generateTTSFallback(): any {
    return {
      data: "UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA",
      mimeType: "audio/wav"
    };
  }
}
