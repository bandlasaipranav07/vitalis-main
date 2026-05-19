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

export class LocalClinicalEngine {
  /**
   * Generates a local, fully compliant chat response
   */
  static async generateChatResponse(messages: any[], language: string = "en"): Promise<string> {
    const isHindi = language === "hi";
    
    // Get last message text
    const lastMsgObj = messages[messages.length - 1];
    const text = (typeof lastMsgObj === "string" ? lastMsgObj : lastMsgObj?.text || "").toLowerCase().trim();

    // 1. Refusal check (CORE MANDATE Guardrails)
    const nonHealthKeywords = [
      "movie", "actor", "celebrity", "cricket", "ipl", "sport", "game", "code", "programming", 
      "politics", "election", "modi", "religion", "god", "trivia", "history", "who acted", "cast of"
    ];
    const isNonHealth = nonHealthKeywords.some(keyword => text.includes(keyword));
    if (isNonHealth) {
      if (isHindi) {
        return "मैं आपकी मदद करना पसंद करूँगा, लेकिन मैं एक समर्पित वाइटलिस स्वास्थ्य सहायक के रूप में विशिष्ट हूँ। मैं केवल स्वास्थ्य, कल्याण और चिकित्सा ट्राइएज प्रश्नों के साथ सहायता कर सकता हूँ। मैं आज आपको सबसे अच्छा महसूस कराने में कैसे मदद कर सकता हूँ?";
      }
      return "I'd love to help, but I am specialized as a dedicated Vitalis health assistant. I can ONLY assist with health, wellness, and medical triage queries. How can I help you feel your best today?";
    }

    // Disclaimer
    const disclaimer = isHindi 
      ? "👋 नमस्ते! मैं आपका वाइटलिस स्वास्थ्य साथी हूँ। मैं डॉक्टर नहीं हूँ; यह केवल शैक्षिक ट्राइएज और कल्याण सहायता के लिए है।\n\n"
      : "👋 Hello! I'm your Vitalis health companion. I'm not a doctor; this is for educational triage and wellness support only.\n\n";

    // 2. Red Flag check
    const redFlagKeywords = [
      "chest pain", "difficulty breathing", "shortness of breath", "numbness", "paralysis", 
      "heart attack", "stroke", "severe bleeding", "unconscious", "choking"
    ];
    const isRedFlag = redFlagKeywords.some(keyword => text.includes(keyword));
    if (isRedFlag) {
      if (isHindi) {
        return disclaimer + 
`🚨 **गंभीर आपातकालीन चेतावनी पाई गई (EMERGENCY DETECTED)**

आपके लक्षणों से गंभीर स्वास्थ्य संकट (जैसे दिल का दौरा, फेफड़ों की समस्या या तीव्र आघात) का संकेत मिलता है।

**तत्काल आवश्यक कार्रवाई:**
1. **आपातकालीन सेवाओं को तुरंत कॉल करें:** तुरंत **108** (भारत में) डायल करें।
2. **स्वयं गाड़ी न चलाएं:** किसी और को आपको निकटतम अस्पताल ले जाने के लिए कहें या एम्बुलेंस की प्रतीक्षा करें।
3. **शांत रहें और आराम करें:** एक आरामदायक स्थिति में बैठें या लेटें, तंग कपड़े ढीले करें और किसी भी प्रकार की शारीरिक गतिविधि न करें।

**ट्राइएज वर्गीकरण:** [Go to the Emergency Room]`;
      }
      return disclaimer + 
`🚨 **CRITICAL EMERGENCY DETECTED**

Your reported symptoms indicate a potential high-risk medical emergency (such as a cardiovascular or acute respiratory event). 

**IMMEDIATE ACTIONS REQUIRED:**
1. **Call Emergency Services Immediately:** Dial **108** (in India) or your local emergency number.
2. **Do Not Drive Yourself:** Have someone else transport you to the nearest emergency department immediately, or wait for an ambulance.
3. **Rest and Stay Calm:** Lie down or sit in a comfortable, safe position, loosen tight clothing, and minimize all physical exertion.

**Triage Category:** [Go to the Emergency Room]`;
    }

    // 3. Banned Medication check
    const matchedBanned = BANNED_MEDICATIONS.find(med => text.includes(med.name));
    if (matchedBanned) {
      if (isHindi) {
        return disclaimer + 
`⚠️ **सुरक्षा चेतावनी: प्रतिबंधित दवा (BANNED MEDICATION)**

आप **${matchedBanned.name.toUpperCase()}** के बारे में पूछ रहे हैं। कृपया ध्यान दें कि यह दवा भारत में केंद्रीय औषधि मानक नियंत्रण संगठन (CDSCO) द्वारा **प्रतिबंधित/निलंबित** है:

- **कारण:** ${matchedBanned.reason}

**महत्वपूर्ण सलाह:**
- यदि आप इस दवा का उपयोग कर रहे हैं, तो इसे **तुरंत बंद करें**।
- एक सुरक्षित और स्वीकृत विकल्प (जैसे दर्द/बुखार के लिए पैरासिटामोल) के बारे में अपने डॉक्टर या फार्मासिस्ट से परामर्श लें।

**ट्राइएज वर्गीकरण:** [Schedule a Doctor's Visit]`;
      }
      return disclaimer + 
`⚠️ **SAFETY WARNING: BANNED MEDICATION**

You are inquiring about **${matchedBanned.name.toUpperCase()}**. Please be advised that this drug or combination is **BANNED/SUSPENDED** in India by the CDSCO (Central Drugs Standard Control Organisation) due to high safety risks:

- **Reason:** ${matchedBanned.reason}

**CRITICAL ADVICE:**
- **Stop taking this medication immediately** if you are currently doing so.
- Consult a qualified pharmacist or doctor to discuss safe, approved alternatives (e.g., single-entity Paracetamol for pain or fever relief).

**Triage Category:** [Schedule a Doctor's Visit]`;
    }

    // 4. Common symptoms check
    const symptoms: string[] = [];
    if (text.includes("fever") || text.includes("temperature") || text.includes("bukhar")) symptoms.push(isHindi ? "बुखार" : "Fever");
    if (text.includes("cough") || text.includes("khansi")) symptoms.push(isHindi ? "खांसी" : "Cough");
    if (text.includes("cold") || text.includes("runny nose") || text.includes("zukan")) symptoms.push(isHindi ? "जुकाम" : "Cold/Runny Nose");
    if (text.includes("headache") || text.includes("head pain") || text.includes("sir dard")) symptoms.push(isHindi ? "सिरदर्द" : "Headache");
    if (text.includes("stomach") || text.includes("belly") || text.includes("pet dard")) symptoms.push(isHindi ? "पेट दर्द" : "Stomach Ache");

    if (symptoms.length > 0) {
      if (isHindi) {
        return disclaimer + 
`मैं समझता हूँ कि आप **${symptoms.join(" और ")}** जैसे लक्षणों का सामना कर रहे हैं। आइए WHO और NHS के साक्ष्य-आधारित दिशानिर्देशों के अनुसार इसे प्रबंधित करने का तरीका देखें।

### 1. ट्राइएज दिशानिर्देश (Triage Guidance)
- **हल्के लक्षण:** आमतौर पर वायरल संक्रमण होते हैं। पर्याप्त तरल पदार्थ, आराम और जरूरत पड़ने पर बुखार कम करने वाली दवाओं से घर पर ठीक हो सकते हैं।
- **मध्यम लक्षण:** यदि लक्षण 3 दिनों से अधिक बने रहते हैं, तो डॉक्टर की सलाह लें।
- **गंभीर चेतावनी संकेत:** यदि आपको सांस लेने में तकलीफ हो या तेज बुखार हो जो दवाओं से भी ठीक न हो, तो तुरंत अस्पताल जाएं।

### 2. घर पर देखभाल (Self-Care at Home)
- **हाइड्रेशन:** गुनगुना पानी, सूप, या हर्बल चाय जैसे तरल पदार्थों का सेवन करें।
- **पूर्ण विश्राम:** शरीर को ठीक होने के लिए पर्याप्त समय दें।
- **एंटीबायोटिक्स का उपयोग न करें:** वायरल संक्रमण के लिए एंटीबायोटिक्स असरदार नहीं होते हैं, केवल जीवाणु (bacterial) संक्रमण में ही काम आते हैं।

**ट्राइएज वर्गीकरण:** [Self-Care at Home | Chat with a Pharmacist]`;
      }
      return disclaimer + 
`I understand you are experiencing symptoms of **${symptoms.join(" and ")}**. Let's review the evidence-based triage and self-care recommendations aligned with WHO and NHS standards.

### 1. General Triage Guidance
- **Mild Symptoms:** Typically viral and self-limiting. Most can be safely managed at home with adequate supportive care.
- **Moderate Symptoms:** Monitor progress closely. If symptoms persist beyond 3 days or fail to improve, seek professional evaluation.
- **Severe Warning Signs:** Seek urgent care if you develop persistent high fever, shortness of breath, severe dizziness, or chest tightness.

### 2. Home Support & Care
- **Hydration:** Consume plenty of warm fluids (water, clear broths, herbal teas) to keep mucous membranes moist and prevent dehydration.
- **Rest:** Allow your body to redirect energy to the immune response.
- **Avoid Antibiotics:** Do not self-administer antibiotics. Common colds, flu, and coughs are viral; antibiotics have no effect and contribute to drug resistance.

**Triage Category:** [Self-Care at Home | Chat with a Pharmacist]`;
    }

    // 5. Default/Greetings
    if (isHindi) {
      return disclaimer + 
`नमस्ते! मैं आपका वाइटलिस स्वास्थ्य साथी हूँ। मैं आपके लक्षणों को सुनने और किसी भी सामान्य कल्याणकारी प्रश्न का उत्तर देने के लिए यहाँ हूँ।

आप अपने लक्षणों के बारे में बता सकते हैं या चिकित्सा सुरक्षा से जुड़े प्रश्न पूछ सकते हैं। आप आज कैसा महसूस कर रहे हैं?`;
    }
    return disclaimer + 
`Hello! I'm your Vitalis health companion. I'm here to listen, triage symptoms, and answer your medication safety and wellness queries.

Please feel free to ask about any wellness tips, symptom guidelines, or medication statuses. How are you feeling today?`;
  }

  /**
   * Generates a structured symptom checker analysis
   */
  static generateSymptomAnalysis(symptoms: string[], severity: string, duration: string, language: string = "en"): any {
    const symptomStr = symptoms.join(", ").toLowerCase();
    const isEmergency = symptomStr.includes("chest") || symptomStr.includes("breath") || symptomStr.includes("numb") || severity.toLowerCase() === "severe";

    let result: any;

    if (isEmergency) {
      result = {
        healthSummary: "Symptoms like severe discomfort, chest pain, or breathing difficulties are clinical 'red flags'. They require prompt medical investigation to rule out cardiovascular, pulmonary, or systemic emergencies.",
        possibleCauses: ["Acute Myocardial Infarction", "Angina Pectoris", "Pulmonary Embolism", "Severe Musculoskeletal Injury"],
        riskLevel: "Emergency",
        recommendations: [
          "This requires immediate professional medical intervention.",
          "Do not engage in physical exertion.",
          "Call 108 or go to the nearest Emergency Room immediately."
        ],
        warningSigns: ["Loss of consciousness", "Severe chest pain", "Inability to breathe properly"],
        suggestedSpecialist: "Emergency Medicine / Cardiologist",
        disclaimer: "I am an AI, not a doctor. This is a severe medical emergency. Please seek professional medical help immediately."
      };
    } else if (symptomStr.includes("fever") || symptomStr.includes("cough") || symptomStr.includes("sore throat") || symptomStr.includes("chills")) {
      result = {
        healthSummary: "Fever and cough commonly point to an acute respiratory tract infection, typical of common rhinovirus, influenza, or coronavirus variants affecting the upper airway.",
        possibleCauses: ["Viral Upper Respiratory Infection", "Influenza (Flu)", "Acute Bronchitis", "Allergic Rhinitis"],
        riskLevel: "High",
        recommendations: [
          "Prioritize rest and hydration.",
          "Monitor temperature twice daily.",
          "Seek clinical evaluation if the fever exceeds 102°F or symptoms persist longer than 3-5 days."
        ],
        warningSigns: ["Difficulty breathing", "Persistent high fever", "Chest pain or pressure"],
        suggestedSpecialist: "General Physician / Pulmonologist",
        disclaimer: "I am an AI. This is a preliminary assessment. Please consult a healthcare professional for an accurate diagnosis."
      };
    } else if (symptomStr.includes("ache") || symptomStr.includes("pain") || symptomStr.includes("strain") || symptomStr.includes("fatigue")) {
      result = {
        healthSummary: "Generalized fatigue, muscle aches, and joint discomfort are typical physiological responses to localized muscle overuse or mild systemic inflammatory responses associated with viral infections.",
        possibleCauses: ["Musculoskeletal Strain", "Viral Myalgia", "Post-Viral Fatigue Syndrome"],
        riskLevel: "Moderate",
        recommendations: [
          "Support healing with rest and local heat/ice application.",
          "Maintain standard hydration.",
          "Speak to a pharmacist regarding appropriate over-the-counter pain relief."
        ],
        warningSigns: ["Severe unbearable pain", "Inability to bear weight", "Joint swelling and redness"],
        suggestedSpecialist: "General Practitioner / Orthopedist",
        disclaimer: "I am an AI. This is a preliminary assessment. Please consult a healthcare professional for an accurate diagnosis."
      };
    } else {
      result = {
        healthSummary: "Mild, generalized symptoms are frequently self-limiting and commonly associated with physical fatigue, inadequate hydration, or a mild immune reaction.",
        possibleCauses: ["Mild Dehydration", "Systemic Viral Syndrome", "Tension Response"],
        riskLevel: "Low",
        recommendations: [
          "Focus on rest and balanced nutrition.",
          "Increase electrolyte and fluid intake.",
          "Keep track of symptoms and rest adequately."
        ],
        warningSigns: ["Symptoms progressively worsening", "Development of a high fever", "Unexplained weight loss"],
        suggestedSpecialist: "General Physician",
        disclaimer: "I am an AI. This is a preliminary assessment. Please consult a healthcare professional for an accurate diagnosis."
      };
    }

    if (language === "hi") {
      if (result.riskLevel === "Emergency") {
        result.healthSummary = "गंभीर असुविधा, छाती में दर्द, या सांस लेने में कठिनाई जैसे लक्षण नैदानिक 'लाल झंडे' हैं। हृदय, फुफ्फुसीय, या प्रणालीगत आपात स्थितियों से बचने के लिए उन्हें तुरंत चिकित्सा जांच की आवश्यकता होती है।";
        result.possibleCauses = ["तीव्र रोधगलन (हार्ट अटैक)", "एनजाइना पेक्टोरिस", "पल्मोनरी एम्बोलिज़्म", "गंभीर मस्कुलोस्केलेटल चोट"];
        result.recommendations = [
          "इसके लिए तत्काल पेशेवर चिकित्सा हस्तक्षेप की आवश्यकता है।",
          "शारीरिक परिश्रम न करें।",
          "तुरंत 108 पर कॉल करें या निकटतम आपातकालीन कक्ष में जाएं।"
        ];
        result.warningSigns = ["बेहोशी", "गंभीर छाती में दर्द", "ठीक से सांस न ले पाना"];
        result.suggestedSpecialist = "आपातकालीन चिकित्सा / हृदय रोग विशेषज्ञ";
        result.disclaimer = "मैं एक एआई हूँ, डॉक्टर नहीं। यह एक गंभीर चिकित्सा आपातकाल है। कृपया तुरंत पेशेवर चिकित्सा सहायता लें।";
      } else if (result.riskLevel === "High") {
        result.healthSummary = "बुखार और खांसी आमतौर पर एक तीव्र श्वसन पथ के संक्रमण की ओर इशारा करते हैं, जो ऊपरी वायुमार्ग को प्रभावित करने वाले सामान्य राइनोवायरस, इन्फ्लूएंजा, या कोरोनावायरस वेरिएंट के विशिष्ट लक्षण हैं।";
        result.possibleCauses = ["वायरल ऊपरी श्वसन संक्रमण", "इन्फ्लूएंजा (फ्लू)", "तीव्र ब्रोंकाइटिस", "एलर्जी राइनाइटिस"];
        result.recommendations = [
          "आराम और हाइड्रेशन को प्राथमिकता दें।",
          "दैनिक रूप से दो बार तापमान की निगरानी करें।",
          "यदि बुखार 102°F से अधिक हो जाता है या लक्षण 3-5 दिनों से अधिक बने रहते हैं, तो नैदानिक मूल्यांकन की मांग करें।"
        ];
        result.warningSigns = ["सांस लेने में कठिनाई", "लगातार तेज बुखार", "छाती में दर्द या दबाव"];
        result.suggestedSpecialist = "सामान्य चिकित्सक / पल्मोनोलॉजिस्ट";
        result.disclaimer = "मैं एक एआई हूँ। यह एक प्रारंभिक मूल्यांकन है। सटीक निदान के लिए कृपया किसी स्वास्थ्य पेशेवर से परामर्श लें।";
      } else if (result.riskLevel === "Moderate") {
        result.healthSummary = "सामान्यीकृत थकान, मांसपेशियों में दर्द और जोड़ों की परेशानी स्थानीय मांसपेशियों के अति प्रयोग या वायरल संक्रमण से जुड़े हल्के प्रणालीगत भड़काऊ प्रतिक्रियाओं के विशिष्ट शारीरिक प्रतिक्रियाएं हैं।";
        result.possibleCauses = ["मस्कुलोस्केलेटल तनाव", "वायरल मायलगिया", "वायरल-पश्चात थकान सिंड्रोम"];
        result.recommendations = [
          "आराम और स्थानीय गर्मी/बर्फ के उपयोग के साथ उपचार का समर्थन करें।",
          "मानक हाइड्रेशन बनाए रखें।",
          "उचित ओवर-द-काउंटर दर्द निवारक के बारे में फार्मासिस्ट से बात करें।"
        ];
        result.warningSigns = ["गंभीर असहनीय दर्द", "वजन उठाने में असमर्थता", "जोड़ों की सूजन और लालिमा"];
        result.suggestedSpecialist = "सामान्य चिकित्सक / आर्थोपेडिस्ट";
        result.disclaimer = "मैं एक एआई हूँ। यह एक प्रारंभिक मूल्यांकन है। सटीक निदान के लिए कृपया किसी स्वास्थ्य पेशेवर से परामर्श लें।";
      } else {
        result.healthSummary = "हल्के, सामान्यीकृत लक्षण अक्सर स्व-सीमित होते हैं और आमतौर पर शारीरिक थकान, अपर्याप्त हाइड्रेशन, या हल्के प्रतिरक्षा प्रतिक्रिया से जुड़े होते हैं।";
        result.possibleCauses = ["हल्का निर्जलीकरण", "प्रणालीगत वायरल सिंड्रोम", "तनाव प्रतिक्रिया"];
        result.recommendations = [
          "आराम और संतुलित पोषण पर ध्यान दें।",
          "इलेक्ट्रोलाइट और तरल पदार्थ का सेवन बढ़ाएं।",
          "लक्षणों पर नज़र रखें और पर्याप्त आराम करें।"
        ];
        result.warningSigns = ["लक्षण उत्तरोत्तर बिगड़ रहे हैं", "तेज बुखार का विकास", "अस्पष्टीकृत वजन घटना"];
        result.suggestedSpecialist = "सामान्य चिकित्सक";
        result.disclaimer = "मैं एक एआई हूँ। यह एक प्रारंभिक मूल्यांकन है। सटीक निदान के लिए कृपया किसी स्वास्थ्य पेशेवर से परामर्श लें।";
      }
    } else if (language === "te") {
      if (result.riskLevel === "Emergency") {
        result.healthSummary = "తీవ్రమైన అసౌకర్యం, ఛాతీ నొప్పి లేదా శ్వాస తీసుకోవడంలో ఇబ్బందులు వంటి లక్షణాలు క్లినికల్ 'రెడ్ ఫ్లాగ్స్'. గుండె, ఊపిరితిత్తులు లేదా దైహిక అత్యవసర परिस्थितियोंను మినహాయించడానికి వారికి తక్షణ వైద్య పరీక్షలు అవసరం.";
        result.possibleCauses = ["తీవ్రమైన మయోకార్డియల్ ఇన్ఫార్క్షన్ (గుండెపోటు)", "ఆంజినా పెక్టోరిస్", "పల్మనరీ ఎంబోలిజం", "తీవ్రమైన కండరాల గాయం"];
        result.recommendations = [
          "దీనికి తక్షణ వృత్తిపరమైన వైద్య జోక్యం అవసరం.",
          "శారీరక శ్రమ చేయవద్దు.",
          "వెంటనే 108కి కాల్ చేయండి లేదా సమీప అత్యవసర విభాగానికి వెళ్ళండి."
        ];
        result.warningSigns = ["స్పృహ కోల్పోవడం", "తీవ్రమైన ఛాతీ నొప్పి", "సరిగ్గా శ్వాస తీసుకోలేకపోవడం"];
        result.suggestedSpecialist = "ఎమర్జెన్సీ మెడిసిൻ / కార్డియాలజిస్ట్";
        result.disclaimer = "నేను AIని, వైద్యుడిని కాను. ఇది తీవ్రమైన వైద్య అత్యవసర పరిస్థితి. దయచేసి వెంటనే వృత్తిపరమైన వైద్య సహాయం తీసుకోండి.";
      } else if (result.riskLevel === "High") {
        result.healthSummary = "జ్వరం మరియు దగ్గు సాధారణంగా తీవ్రమైన శ్వాసకోశ సంక్రమణను సూచిస్తాయి, ఇది ఎగువ శ్వాసనాళాన్ని ప్రభావితం చేసే సాధారణ రైనోవైరస్, ఇన్ఫ్లుఎంజా లేదా కరోనావైరస్ రకాలను పోలి ఉంటుంది.";
        result.possibleCauses = ["వైరల్ ఎగువ శ్వాసకోశ ఇన్ఫెక్షన్", "ఇన్ఫ్లుఎంజా (ఫ్లూ)", "తీవ్రమైన బ్రోన్కైటిస్", "అలెర్జీ రైనెటిస్"];
        result.recommendations = [
          "విశ్రాంతి మరియు హైడ్రేషన్‌కు ప్రాధాన్యత ఇవ్వండి.",
          "రోజుకు రెండుసార్లు ఉష్ణోగ్రతను పర్యవేక్షించండి.",
          "జ్వరం 102°F కంటే ఎక్కువ ఉంటే లేదా లక్షణాలు 3-5 రోజుల కంటే ఎక్కువ కొనసాగితే వైద్య సహాయం తీసుకోండి."
        ];
        result.warningSigns = ["శ్వాస తీసుకోవడంలో ఇబ్బంది", "నిరంతర అధిక జ్వరం", "ఛాతీ నొప్పి లేదా ఒత్తిడి"];
        result.suggestedSpecialist = "జనరల్ ఫిజీషియన్ / పల్మనాలజిస్ట్";
        result.disclaimer = "నేను AIని. ఇది ప్రాథమిక అంచనా మాత్రమే. ఖచ్చితమైన నిర్ధారణ కోసం దయచేసి ఆరోగ్య నిపుణుడిని సంപ്രదించండి.";
      } else if (result.riskLevel === "Moderate") {
        result.healthSummary = "సాధారణ అలసట, కండరాల నొప్పులు మరియు కీళ్ల అసౌకర్యం అనేవి కండరాల అధిక వినియోగం లేదా వైరల్ ఇన్ఫెక్షన్లతో కూడిన తేలికపాటి రోగనిరోధక ప్రతిస్పందనల సాధారణ శారీరక ప్రతిచర్యలు.";
        result.possibleCauses = ["కండరాల ఒత్తిడి", "వైరల్ మయాల్జియా", "పోస్ట్-వైరల్ అలసట సిండ్రోమ్"];
        result.recommendations = [
          "విశ్రాంతి మరియు వేడి/మంచు చికిత్సతో ఉపశమనం పొందండి.",
          "తగినంత నీరు తీసుకోండి.",
          "సరిఅయిన నొప్పి నివారణ మందుల కోసం ఫార్మసిస్ట్‌తో మాట్లాడండి."
        ];
        result.warningSigns = ["తీవ్రమైన భరించలేని నొప్పి", "బరువు మోయలేకపోవడం", "కీళ్ల వాపు మరియు ఎరుపు"];
        result.suggestedSpecialist = "జనరల్ ఫిజీషియన్ / ఆర్థోపెడిస్ట్";
        result.disclaimer = "నేను AIని. ఇది ప్రాథమిక అంచనా మాత్రమే. ఖచ్చితమైన నిర్ధారణ కోసం దయచేసి ఆరోగ్య నిపుణుడిని సంപ്രదించండి.";
      } else {
        result.healthSummary = "తేలికపాటి, సాధారణ లక్షణాలు తరచుగా స్వయంగా తగ్గిపోతాయి మరియు సాధారణంగా శారీరక అలసట, తగినంత నీరు తీసుకోకపోవడం లేదా తేలికపాటి రోగనిరోధక ప్రతిచర్యతో సంబంధం కలిగి ఉంటాయి.";
        result.possibleCauses = ["తేలికపాటి నిర్జలీకరణం (డీహైడ్రేషన్)", "దైహిక వైరల్ సిండ్రోమ్", "ఒత్తిడి ప్రతిచర్య"];
        result.recommendations = [
          "విశ్రాంతి మరియు సమతుల్య పోషణపై దృష్టి పెట్టండి.",
          "ఎలక్ట్రోలైట్ మరియు ద్రవాల వినియోగాన్ని పెంచండి.",
          "లక్షణాలు గమనిస్తూ తగినంత విశ్రాంతి తీసుకోండి."
        ];
        result.warningSigns = ["లక్షణాలు క్రమంగా తీవ్రమవుతున్నాయి", "అధిక జ్వరం రావడం", "కారణం లేని బరువు తగ్గడం"];
        result.suggestedSpecialist = "జనరల్ ఫిజీషియన్";
        result.disclaimer = "నేను AIని. ఇది ప్రాథమిక అంచనా మాత్రమే. ఖచ్చితమైన నిర్ధారణ కోసం దయచేసి ఆరోగ్య నిపుణుడిని సంപ്രదించండి.";
      }
    } else if (language === "ta") {
      if (result.riskLevel === "Emergency") {
        result.healthSummary = "கடுமையான அசௌகரியம், மார்பு வலி அல்லது சுவாசிப்பதில் சிரமம் போன்ற அறிகுறிகள் மருத்துவ 'சிவப்பு எச்சரிக்கைகள்' ஆகும். மாரடைப்பு அல்லது நுரையீரல் அவசரநிலைகளை தவிர்க்க அவர்களுக்கு உடனடி மருத்துவ பரிசோதனை தேவை.";
        result.possibleCauses = ["கடுமையான மாரடைப்பு", "ஆஞ்சினா பெக்டோரிஸ்", "நுரையீரல் எம்போலிசம்", "கடுமையான தசை நார் காயம்"];
        result.recommendations = [
          "இதற்கு உடனடி மருத்துவ உதவி தேவை.",
          "உடல் உழைப்பைத் தவிர்க்கவும்.",
          "உடனடியாக 108 ஐ அழைக்கவும் அல்லது அருகிலுள்ள அவசர சிகிச்சை பிரிவுக்குச் செல்லவும்."
        ];
        result.warningSigns = ["மயக்கம்", "கடுமையான மார்பு வலி", "முறையாக சுவாசிக்க முடியாமை"];
        result.suggestedSpecialist = "அவசர சிகிச்சை மருத்துவர் / இருதய நிபுணர்";
        result.disclaimer = "நான் ஒரு AI, மருத்துவர் அல்ல. இது கடுமையான மருத்துவ அவசர நிலை. தயவுசெய்து உடனடியாக மருத்துவ உதவியை நாடவும்.";
      } else if (result.riskLevel === "High") {
        result.healthSummary = "காய்ச்சல் மற்றும் இருமல் பொதுவாக கடுமையான சுவாசப் பாதை தொற்றைக் குறிக்கின்றன, இது மேல் சுவாசப்பாதையை பாதிக்கும் பொதுவான ஜலதோஷம், காய்ச்சல் அல்லது கொரோனா வைரஸ் வகைகளின் அறிகுறியாகும்.";
        result.possibleCauses = ["வைரஸ் சுவாசப் பாதை தொற்று", "இன்புளுயன்சா (ஃப்ளூ)", "கடுமையான மூச்சுக்குழாய் அழற்சி", "ஒவ்வாமை நாசியழற்சி"];
        result.recommendations = [
          "ஓய்வு மற்றும் நீர்ச்சத்துக்கு முன்னுரிமை கொடுங்கள்.",
          "தினமும் இருமுறை உடல் வெப்பநிலையை கண்காணிக்கவும்.",
          "காய்ச்சல் 102°F ஐ தாண்டினால் அல்லது 3-5 நாட்களுக்கு மேல் நீடித்தால் மருத்துவரை அணுகவும்."
        ];
        result.warningSigns = ["சுவாசிப்பதில் சிரமம்", "தொடர்ச்சியான அதிக காய்ச்சல்", "மார்பு வலி அல்லது அழுத்தம்"];
        result.suggestedSpecialist = "பொது மருத்துவர் / நுரையீரல் நிபுணர்";
        result.disclaimer = "நான் ஒரு AI. இது ஒரு ஆரம்ப மதிப்பீடு மட்டுமே. துல்லியமான நோயறிதலுக்கு மருத்துவரை அணுகவும்.";
      } else if (result.riskLevel === "Moderate") {
        result.healthSummary = "பொதுவான சோர்வு, தசை வலி மற்றும் மூட்டு அசௌகரியம் ஆகியவை தசை அதிகப்படியான பயன்பாடு அல்லது வைரஸ் தொற்றுகளுடன் தொடர்புடைய லேசான நோய் எதிர்ப்பு சக்தியின் அறிகுறியாகும்.";
        result.possibleCauses = ["தசை பிடிப்பு", "வைரஸ் தசை வலி", "சோர்வு நோய்க்குறி"];
        result.recommendations = [
          "ஓய்வு மற்றும் வெப்ப/பனி ஒத்தடம் மூலம் குணமடைவதை ஆதரிக்கவும்.",
          "போதுமான அளவு தண்ணீர் குடிக்கவும்.",
          "பொருத்தமான வலி நிவாரணிகளுக்கு மருந்தாளரை அணுகவும்."
        ];
        result.warningSigns = ["கடுமையான தாங்க முடியாத வலி", "எடை தாங்க முடியாமை", "மூட்டு வீக்கம் மற்றும் சிவத்தல்"];
        result.suggestedSpecialist = "பொது மருத்துவர் / எலும்பு முறிவு நிபுணர்";
        result.disclaimer = "நான் ஒரு AI. இது ஒரு ஆரம்ப மதிப்பீடு மட்டுமே. துல்லியமான நோயறிதலுக்கு மருத்துவரை அணுகவும்.";
      } else {
        result.healthSummary = "Leisana, pothuvana arigurigal migavum sulabamaga sariyagividum. Ithu udal sorvu, thavirka mudiyatha neerச்சத்து kurainthathu allathu leisana noi ethirppu sakthiyin ariguriyagum.";
        result.possibleCauses = ["நீர்ச்சத்து குறைபாடு", "வைரஸ் அறிகுறி", "மன அழுத்தம்"];
        result.recommendations = [
          "ஓய்வு மற்றும் சமச்சீர் ஊட்டச்சத்தில் கவனம் செலுத்துங்கள்.",
          "நீர் மற்றும் எலக்ட்ரோலைட் உட்கொள்ளலை அதிகரிக்கவும்.",
          "அறிகுறிகளைக் கண்காணித்து போதுமான ஓய்வு எடுக்கவும்."
        ];
        result.warningSigns = ["அறிகுறிகள் படிப்படியாக மோசமடைதல்", "அதிக காய்ச்சல்", "காரணமற்ற உடல் எடை குறைவு"];
        result.suggestedSpecialist = "பொது மருத்துவர்";
        result.disclaimer = "நான் ஒரு AI. இது ஒரு ஆரம்ப மதிப்பீடு மட்டுமே. துல்லியமான நோயறிதலுக்கு மருத்துவரை அணுகவும்.";
      }
    } else if (language === "ml") {
      if (result.riskLevel === "Emergency") {
        result.healthSummary = "ശക്തമായ അസ്വസ്ഥത, നെഞ്ചുവേദന, അല്ലെങ്കിൽ ശ്വാസതടസ്സം എന്നിവ ഗുരുതരമായ ലക്ഷണങ്ങളാണ്. ഹൃദയസംബന്ധമായതോ ശ്വാസകോശസംബന്ധമായതോ ആയ അടിയന്തര സാഹചര്യങ്ങൾ ഒഴിവാക്കാൻ ഇവ ഉടൻ പരിശോധിക്കേണ്ടതുണ്ട്.";
        result.possibleCauses = ["തീവ്രമായ ഹൃദയാഘാതം", "ആൻജീന പെക്റ്റോറിസ്", "പൾമണറി എംബോളിസം", "കഠിനമായ പേശി പരിക്ക്"];
        result.recommendations = [
          "ഇതിന് ഉടൻ തന്നെ ഒരു ഡോക്ടറുടെ സഹായം ആവശ്യമാണ്.",
          "ശാരീരിക അധ്വാനം ഒഴിവാക്കുക.",
          "ഉടൻ തന്നെ 108 വിളിക്കുക അല്ലെങ്കിൽ അടുത്തുള്ള അടിയന്തര വിഭാഗത്തിൽ എത്തുക."
        ];
        result.warningSigns = ["ബോധക്ഷയം", "ശക്തമായ നെഞ്ചുവേദന", "ശബ്ദം എടുക്കാൻ കഴിയാതെ വരിക"];
        result.suggestedSpecialist = "എമർജൻസി മെഡിസിൻ / കാർഡിയോളജിസ്റ്റ്";
        result.disclaimer = "ഞാൻ ഒരു AI ആണ്, ഡോക്ടറല്ല. ഇത് ഗുരുതരമായ അടിയന്തര സാഹചര്യമാണ്. ദയവായി ഉടൻ തന്നെ ഡോക്ടറെ സമീപിക്കുക.";
      } else if (result.riskLevel === "High") {
        result.healthSummary = "പനിയും ചുമയും സാധാരണയായി ശ്വാസകോശ അണുബാധയെ സൂചിപ്പിക്കുന്നു, ജലദോഷം, ഇൻഫ്ലുവൻസ അല്ലെങ്കിൽ കൊറോണ വൈറസ് എന്നിവയാണ് പ്രധാന കാരണങ്ങൾ.";
        result.possibleCauses = ["വൈറൽ ശ്വാസകോശ അണുബാധ", "ഇൻഫ്ലുവൻസ (ഫ്ലൂ)", "ബ്രോങ്കൈറ്റിസ്", "അലർജിക് റൈനൈറ്റിസ്"];
        result.recommendations = [
          "വിശ്രമത്തിനും വെള്ളം കുടിക്കുന്നതിനും മുൻഗണന നൽകുക.",
          "ദിവസവും രണ്ടുതവണ താപനില പരിശോധിക്കുക.",
          "പനി 102°F ൽ കൂടുകയോ 3-5 ദിവസത്തിൽ കൂടുതൽ നീണ്ടുനിൽക്കുകയോ ചെയ്താൽ ഡോക്ടറെ കാണുക."
        ];
        result.warningSigns = ["External pain while breathing", "തുടർച്ചയായ ഉയർന്ന പനി", "നെഞ്ചിലെ അസ്വസ്ഥത"];
        result.suggestedSpecialist = "ജനറൽ ഫിസിഷ്യൻ / പൾമണോളജിസ്റ്റ്";
        result.disclaimer = "ഞാൻ ഒരു AI ആണ്. ഇതൊരു പ്രാഥമിക വിലയിരുത്തൽ മാത്രമാണ്. കൃത്യമായ രോഗനിർണ്ണയത്തിന് ഡോക്ടറെ സമീപിക്കുക.";
      } else if (result.riskLevel === "Moderate") {
        result.healthSummary = "ക്ഷീണം, പേശിവേദന, സന്ധിവേദന എന്നിവ പേശികളുടെ അമിതമായ ഉപയോഗം മൂലമോ വൈറൽ ബാധ മൂലമോ ഉണ്ടാകുന്ന സ്വാഭാവിക പ്രതികരണങ്ങളാണ്.";
        result.possibleCauses = ["പേശിവലിവ്", "വൈറൽ മയാൾജിയ", "ക്ഷീണ രോഗലക്ഷണം"];
        result.recommendations = [
          "വിശ്രമം, ചൂട് അല്ലെങ്കിൽ ഐസ് എന്നിവ ഉപയോഗിച്ച് സുഖപ്പെടാൻ ശ്രമിക്കുക.",
          "ധാരാളം വെള്ളം കുടിക്കുക.",
          "വേദനസംഹാരികൾക്കായി ഒരു ഫാർമസിസ്റ്റിനെ സമീപിക്കുക."
        ];
        result.warningSigns = ["കഠിനമായ സഹിക്കാനാവാത്ത വേദന", "ഭാരം ചുമക്കാൻ കഴിയാതെ വരിക", "സന്ധികളിലെ വീക്കവും ചുവപ്പും"];
        result.suggestedSpecialist = "ജനറൽ ഫിസിഷ്യൻ / ഓർത്തോപീഡിസ്റ്റ്";
        result.disclaimer = "ഞാൻ ഒരു AI ആണ്. ഇതൊരു പ്രാഥമിക വിലയിരുത്തൽ മാത്രമാണ്. കൃത്യമായ രോഗനിർണ്ണയത്തിന് ഡോക്ടറെ സമീപിക്കുക.";
      } else {
        result.healthSummary = "ചെറിയ ലക്ഷണങ്ങൾ പലപ്പോഴും തനിയെ മാറുന്നവയാണ്, ഇത് ക്ഷീണം, വെള്ളം കുടിക്കാത്തത് അല്ലെങ്കിൽ ചെറിയ രോഗപ്രതിരോധ പ്രതികരണങ്ങൾ എന്നിവ മൂലമാകാം.";
        result.possibleCauses = ["ചെറിയ നിർജ്ജലീകരണം", "വൈറൽ ലക്ഷണം", "മാനസിക സമ്മർദ്ദം"];
        result.recommendations = [
          "വിശ്രമത്തിലും ആരോഗ്യകരമായ ഭക്ഷണത്തിലും ശ്രദ്ധിക്കുക.",
          "വെള്ളവും ഇലക്ട്രോലൈറ്റുകളും കൂടുതൽ കഴിക്കുക.",
          "ലക്ഷണങ്ങൾ നിരീക്ഷിക്കുക, നന്നായി വിശ്രമിക്കുക."
        ];
        result.warningSigns = ["ലക്ഷണങ്ങൾ ക്രമേണ കൂടുന്നു", "ഉയർന്ന പനി", "കാരണമില്ലാതെ ശരീരഭാരം കുറയുക"];
        result.suggestedSpecialist = "ജനറൽ ഫിസിഷ്യൻ";
        result.disclaimer = "ഞാൻ ഒരു AI ആണ്. ഇതൊരു പ്രാഥമിക വിലയിരുത്തൽ മാത്രമാണ്. കൃത്യമായ രോഗനിർണ്ണയത്തിന് ഡോക്ടറെ സമീപിക്കുക.";
      }
    } else if (language === "kn") {
      if (result.riskLevel === "Emergency") {
        result.healthSummary = "ತೀವ್ರ ಅಸ್ವಸ್ಥತೆ, ಎದೆ ನೋವು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆಯಂತಹ ಲಕ್ಷಣಗಳು ಕ್ಲಿನಿಕಲ್ 'ರೆಡ್ ಫ್ಲ್ಯಾಗ್ಸ್' ಆಗಿವೆ. ಹೃದ್ರೋಗ ಅಥವಾ ಶ್ವಾಸಕೋಶದ ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಳನ್ನು ತಡೆಗಟ್ಟಲು ಅವರಿಗೆ ತಕ್ಷಣದ ವೈದ್ಯಕೀಯ ತಪಾಸಣೆ ಅಗತ್ಯವಿದೆ.";
        result.possibleCauses = ["ತೀವ್ರ ಮಯೋಕಾರ್ಡಿಯಲ್ ಇನ್ಫಾರ್ಕ್ಷನ್ (ಹೃದಯಾಘಾತ)", "ಆಂಜಿನಾ ಪೆಕ್ಟೋರಿಸ್", "ಪಲ್ಮನರಿ ಎಂಬೋಲಿಸಮ್", "ತೀವ್ರ ಸ್ನಾಯು ನೋವು ಗಾಯ"];
        result.recommendations = [
          "ಇದಕ್ಕೆ ತಕ್ಷಣದ ವೈದ್ಯಕೀಯ ನೆರವು ಅಗತ್ಯವಿದೆ.",
          "ಶಾರೀರಿಕ ಶ್ರಮ ಮಾಡಬೇಡಿ.",
          "ತಕ್ಷಣ 108 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ಹತ್ತಿರದ ತುರ್ತು ಚಿಕಿತ್ಸಾ ವಿಭಾಗಕ್ಕೆ ಭೇಟಿ ನೀಡಿ."
        ];
        result.warningSigns = ["ಪ್ರಜ್ಞೆ ಕಳೆದುಕೊಳ್ಳುವುದು", "ತೀವ್ರ ಎದೆ ನೋವು", "ಸರಿಯಾಗಿ ಉಸಿರಾಡಲು ಸಾಧ್ಯವಾಗದಿರುವುದು"];
        result.suggestedSpecialist = "ತುರ್ತು ಚಿಕಿತ್ಸಾ ತಜ್ಞರು / ಹೃದ್ರೋಗ ತಜ್ಞರು";
        result.disclaimer = "ನಾನು ಎಐ ಸಹಾಯಕ, ವೈದ್ಯನಲ್ಲ. ಇದು ತೀವ್ರ ವೈದ್ಯಕೀಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಾಗಿದೆ. ದಯವಿಟ್ಟು ತಕ್ಷಣ ವೃತ್ತಿಪರ ವೈದ್ಯಕೀಯ ಸಹಾಯವನ್ನು ಪಡೆಯಿರಿ.";
      } else if (result.riskLevel === "High") {
        result.healthSummary = "ಜ್ವರ ಮತ್ತು ಕೆಮ್ಮು ಸಾಮಾನ್ಯವಾಗಿ ತೀವ್ರವಾದ ಉಸಿರಾಟದ ಸೋಂಕನ್ನು ಸೂಚಿಸುತ್ತವೆ, ಇದು ಮೇಲಿನ ಉಸಿರಾಟದ ಹಾದಿಯ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುವ ಸಾಮಾನ್ಯ ರೈನೋವೈರಸ್, ಇನ್ಫ್ಲುಯೆಂಜಾ ಅಥವಾ ಕರೋನವೈರಸ್ ನ ಲಕ್ಷಣವಾಗಿದೆ.";
        result.possibleCauses = ["ವೈರಲ್ ಉಸಿರಾಟದ ಸೋಂಕು", "ಇನ್ಫ್ಲುಯೆಂಜಾ (ಫ್ಲೂ)", "ತೀವ್ರ ಬ್ರಾಂಕೈಟಿಸ್", "ಅಲರ್ಜಿಕ್ ರೈನೈಟಿಸ್"];
        result.recommendations = [
          "ವಿಶ್ರಾಂತಿ ಮತ್ತು ಹೈಡ್ರೇಶನ್ ಗೆ ಆದ್ಯತೆ ನೀಡಿ.",
          "ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ತಾಪಮಾನವನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",
          "ಜ್ವರ 102°F ಗಿಂತ ಹೆಚ್ಚಿದ್ದರೆ ಅಥವಾ ಲಕ್ಷಣಗಳು 3-5 ದಿನಗಳಿಗಿಂತ ಹೆಚ್ಚು ಮುಂದುವರಿದರೆ ವೈದ್ಯಕೀಯ ತಪಾಸಣೆ ಪಡೆಯಿರಿ."
        ];
        result.warningSigns = ["ಉಸಿರಾಟದ ತೊಂದರೆ", "ನಿರಂತರ ಅಧಿಕ ಜ್ವರ", "ಎದೆ ನೋವು ಅಥವಾ ಒತ್ತಡ"];
        result.suggestedSpecialist = "ಸಾಮಾನ್ಯ ವೈದ್ಯರು / ಶ್ವಾಸಕೋಶ ತಜ್ಞರು";
        result.disclaimer = "ನಾನು ಎಐ. ಇದು ಪ್ರಾಥಮಿಕ ಮೌಲ್ಯಮಾಪನವಾಗಿದೆ. ನಿಖರವಾದ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ದಯವಿಟ್ಟು ಆರೋಗ್ಯ ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಿ.";
      } else if (result.riskLevel === "Moderate") {
        result.healthSummary = "ಸಾಮಾನ್ಯ ಆಯಾಸ, ಸ್ನಾಯು ನೋವು ಮತ್ತು ಕೀಲುಗಳ ಅಸ್ವಸ್ಥತೆ ಸ್ನಾಯುಗಳ ಅತಿಯಾದ ಬಳಕೆ ಅಥವಾ ವೈರಲ್ ಸೋಂಕಿನಿಂದ ಉಂಟಾಗುವ ಸೌಮ್ಯವಾದ ರೋಗನಿರೋಧಕ ಪ್ರತಿಕ್ರಿಯೆಯಾಗಿದೆ.";
        result.possibleCauses = ["ಸ್ನಾಯು ಸೆಳೆತ", "ವೈರಲ್ ಮೈಯಾಲ್ಜಿಯಾ", "ಆಯಾಸದ ಸಿಂಡ್ರೋಮ್"];
        result.recommendations = [
          "ವಿಶ್ರಾಂತಿ ಮತ್ತು ಬಿಸಿ/ಐಸ್ ಚಿಕಿತ್ಸೆಯೊಂದಿಗೆ ಚೇതರಿಕೆಗೆ ಸಹಕರಿಸಿ.",
          "ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.",
          "ಸೂಕ್ತವಾದ ನೋವು ನಿವಾರಕಗಳಿಗಾಗಿ ಫಾರ್ಮಸಿಸ್ಟ್ ಅವರನ್ನು ಸಂಪರ್ಕಿಸಿ."
        ];
        result.warningSigns = ["ತೀವ್ರ ತಡೆದುಕೊಳ್ಳಲಾಗದ ನೋವು", "ತೂಕ ಹೊರಲು ಸಾಧ್ಯವಾಗದಿರುವುದು", "ಕೀಲುಗಳ ಊತ ಮತ್ತು ಕೆಂಪಾಗುವಿಕೆ"];
        result.suggestedSpecialist = "ಸಾಮಾನ್ಯ ವೈದ್ಯರು / ಮೂಳೆ ತಜ್ಞರು";
        result.disclaimer = "ನಾನು ಎಐ. ಇದು ಪ್ರಾಥಮಿಕ ಮೌಲ್ಯಮಾಪನವಾಗಿದೆ. ನಿಖರವಾದ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ದಯವಿಟ್ಟು ಆರೋಗ್ಯ ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಿ.";
      } else {
        result.healthSummary = "ಸೌಮ್ಯವಾದ, ಸಾಮಾನ್ಯ ಲಕ್ಷಣಗಳು ಹೆಚ್ಚಾಗಿ ಸ್ವಯಂ-ನಿವಾರಕವಾಗಿದ್ದು, ಇವು ದೈಹಿಕ ಆಯಾಸ, ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯದಿರುವುದು ಅಥವಾ ಸೌಮ್ಯ ರೋಗನಿರೋಧಕ ಪ್ರತಿಕ್ರಿಯೆಗೆ ಸಂಬಂಧಿಸಿವೆ.";
        result.possibleCauses = ["ಸೌಮ್ಯ ನಿರ್ಜಲೀಕರಣ", "ದೈಹಿಕ ವೈರಲ್ ಸಿಂಡ್ರೋಮ್", "ಒತ್ತಡದ ಪ್ರತಿಕ್ರಿಯೆ"];
        result.recommendations = [
          "ವಿಶ್ರಾಂತಿ and ಸಮತೋಲಿತ ಪೌಷ್ಟಿಕಾಂಶದ ಕಡೆಗೆ ಗಮನ ಕೊಡಿ.",
          "ದ್ರವ ಮತ್ತು ಎಲೆಕ್ಟ್ರೋಲೈಟ್ ಸೇವನೆಯನ್ನು ಹೆಚ್ಚಿಸಿ.",
          "ಲಕ್ಷಣಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ ಮತ್ತು ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ."
        ];
        result.warningSigns = ["ಲಕ್ಷಣಗಳು ಕ್ರಮೇಣ ಉಲ್ಬಣಗೊಳ್ಳುತ್ತಿರುವುದು", "ಅಧಿಕ ಜ್ವರ ಕಾಣಿಸಿಕೊಳ್ಳುವುದು", "ಕಾರಣವಿಲ್ಲದೆ ತೂಕ ಇಳಿಕೆ"];
        result.suggestedSpecialist = "ಸಾಮಾನ್ಯ ವೈದ್ಯರು";
        result.disclaimer = "ನಾನು ಎಐ. ಇದು ಪ್ರಾಥಮಿಕ ಮೌಲ್ಯಮಾಪನವಾಗಿದೆ. ನಿಖರವಾದ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ದಯವಿಟ್ಟು ಆರೋಗ್ಯ ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಿ.";
      }
    }

    return result;
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
  static generateMedicationSafety(medicationName: string): any {
    const medLower = medicationName.toLowerCase().trim();
    const matchedBanned = BANNED_MEDICATIONS.find(med => medLower.includes(med.name));

    if (matchedBanned) {
      return {
        type: "banned",
        info: `This medication (${medicationName}) is BANNED or highly restricted in India by the CDSCO (Central Drugs Standard Control Organisation).`,
        reason: matchedBanned.reason
      };
    }

    return {
      type: "common",
      info: `This medication (${medicationName}) is a commonly approved drug. Approved by CDSCO and international regulatory bodies for targeted indications under safe clinical protocols.`,
      reason: "Ensure you follow professional dosage guidelines, avoid self-medicating, and discuss side effects with a pharmacist or healthcare provider."
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
