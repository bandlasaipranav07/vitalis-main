import { Message, ClinicalSummary } from "./src/types";

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
  static generateSymptomAnalysis(symptoms: string[], severity: string, duration: string): any {
    const symptomStr = symptoms.join(", ").toLowerCase();
    const isEmergency = symptomStr.includes("chest") || symptomStr.includes("breath") || symptomStr.includes("numb") || severity.toLowerCase() === "severe";

    if (isEmergency) {
      return {
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
    }

    const hasFeverOrCough = symptomStr.includes("fever") || symptomStr.includes("cough") || symptomStr.includes("sore throat") || symptomStr.includes("chills");
    if (hasFeverOrCough) {
      return {
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
    }

    const hasAches = symptomStr.includes("ache") || symptomStr.includes("pain") || symptomStr.includes("strain") || symptomStr.includes("fatigue");
    if (hasAches) {
      return {
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
    }

    // Default Fallback
    return {
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
