import { Message, Language, SUPPORTED_LANGUAGES } from "../types";
import { LocalClinicalEngine } from "../../api/_lib/local-clinical-engine";

const SYSTEM_INSTRUCTION = `You are an AI-powered healthcare assistant designed strictly for medical, wellness, symptom-analysis, healthcare education, nutrition, fitness, and mental wellness support only.

Your responsibilities:
* Answer only healthcare-related questions.
* Refuse non-medical queries politely.
* Follow WHO (World Health Organization) and NHS (National Health Service) medical guidance only.
* Avoid hallucinations, assumptions, and fabricated medical claims.
* Never provide definitive diagnoses.
* Never prescribe medications directly.
* Never provide unsafe treatment instructions.

If the user asks non-medical questions such as coding, finance, politics, entertainment, hacking, gambling, or unrelated topics, respond with:
“I am designed specifically for healthcare and medical assistance. Please ask a health-related question.”

If confidence is low or information is insufficient, or you do not know the answer, respond with:
“I am not knowledgeable in this area. Please try to consult a medical professional.”

Always prioritize:
1. Medical accuracy
2. User safety
3. Evidence-based guidance
4. Responsible AI behavior

Maintain a professional, empathetic, calm, and supportive tone in all responses.

You are the healthcare safety and hallucination prevention layer for the Health AI system.

Your job is to monitor all generated responses and ensure:
* No medical hallucinations
* No fabricated diseases
* No fake medicine information
* No dangerous treatment advice
* No definitive diagnoses
* No unsupported medical claims

Safety Rules:
* All medical guidance must align with WHO and NHS recommendations.
* All medicine-related safety must align with CDSCO guidance for India.
* Reject unsafe medical assumptions.
* Block dangerous or misleading outputs.
* Prevent panic-inducing language unless genuine emergency symptoms exist.

If confidence is low:
* Clearly express uncertainty.
* Recommend professional healthcare consultation.

Non-Medical Restriction:
Reject unrelated topics including:
* Coding
* Politics
* Finance
* Hacking
* Gambling
* Adult content
* Illegal activities
* Entertainment gossip

Approved Topics:
* Symptoms
* Wellness
* Nutrition
* Mental health
* Medicine education
* Healthcare awareness
* Preventive healthcare
* Fitness
* Medical report understanding

Emergency Override:
If emergency symptoms are detected, prioritize emergency guidance immediately.

Final Rule:
User safety, medical accuracy, and responsible AI behavior must always take priority over generating an answer.`;

/**
 * GeminiService
 * Front-end proxy that communicates with our Express backend.
 */
export class GeminiService {
  /**
   * Helper to process SSE stream from backend
   */
  private async processStream(response: Response, onChunk: (chunk: string) => void): Promise<string> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    if (!reader) throw new Error("Failed to read stream");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullText += parsed.text;
              onChunk(parsed.text);
            }
          } catch (e) {
            console.error("Error parsing SSE data:", e);
          }
        }
      }
    }
    return fullText;
  }

  /**
   * Standard text-based chat with streaming support
   */
  async chatStream(
    messages: Message[], 
    language: Language = 'en',
    onChunk: (chunk: string) => void
  ): Promise<string | undefined> {
    try {
      const langName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || 'English';
      const systemInstruction = SYSTEM_INSTRUCTION + `\n\nCRITICAL: You MUST respond in ${langName}. If the user is vague, ask for more details instead of assuming a condition. You MUST strictly follow WHO/NHS clinical guidelines.`;

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, language, systemInstruction })
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      return await this.processStream(response, onChunk);
    } catch (error: any) {
      console.warn("Express backend API unavailable. Falling back to local client-side clinical engine.", error);
      try {
        const textMsgs = messages.map(m => m.text || "");
        const fallbackText = await LocalClinicalEngine.generateChatResponse(textMsgs, language);
        
        // Simulate premium dynamic word-by-word streaming
        const words = fallbackText.split(" ");
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i === words.length - 1 ? "" : " ");
          onChunk(word);
          await new Promise(r => setTimeout(r, 15));
        }
        return fallbackText;
      } catch (fallbackErr) {
        this.handleError("Chat Stream", error);
      }
    }
  }

  /**
   * Multimodal audio-based chat for symptoms with streaming support
   */
  async chatWithAudioStream(
    messages: Message[], 
    base64Audio: string, 
    audioMimeType: string, 
    language: Language = 'en',
    onChunk: (chunk: string) => void,
    base64Image?: string,
    imageMimeType?: string
  ): Promise<string | undefined> {
    try {
      const langName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || 'English';
      const systemInstruction = SYSTEM_INSTRUCTION + `\n\nCRITICAL: Respond in ${langName}. Strictly follow WHO/NHS guidelines.`;

      const history = messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.text || "" }]
      }));

      const lastUserText = messages[messages.length - 1]?.text || "";
      const normalizedMimeType = audioMimeType.includes('webm') ? 'audio/webm' : 
                                audioMimeType.includes('mp4') ? 'audio/mp4' : 
                                audioMimeType.includes('ogg') ? 'audio/ogg' : audioMimeType;

      const parts: any[] = [
        { inlineData: { data: base64Audio, mimeType: normalizedMimeType } }
      ];

      if (base64Image && imageMimeType) {
        parts.push({ inlineData: { data: base64Image, mimeType: imageMimeType } });
      }

      parts.push({ text: `Listen to this health query and context: "${lastUserText}". ${base64Image ? "Also analyze the provided image." : ""} First, transcribe exactly what you heard in ${langName} inside a block labeled [TRANSCRIPTION]. Then, provide a professional and empathetic medical response in ${langName}. If the input is vague, ask clarifying questions instead of assuming symptoms.` });

      const response = await fetch("/api/gemini/multimodal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, parts, systemInstruction })
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      return await this.processStream(response, onChunk);
    } catch (error: any) {
      console.warn("Express backend API unavailable. Falling back to local client-side clinical engine.", error);
      try {
        const lastUserText = messages[messages.length - 1]?.text || "Audio consultation query";
        const fallbackText = `[TRANSCRIPTION]: ${lastUserText}\n\n` + await LocalClinicalEngine.generateChatResponse([lastUserText], language);
        
        // Simulate premium dynamic word-by-word streaming
        const words = fallbackText.split(" ");
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i === words.length - 1 ? "" : " ");
          onChunk(word);
          await new Promise(r => setTimeout(r, 15));
        }
        return fallbackText;
      } catch (fallbackErr) {
        this.handleError("Audio Chat Stream", error);
      }
    }
  }

  /**
   * Structured symptom analysis
   */
  async analyzeSymptoms(symptoms: string[], severity: string, duration: string, language: Language = 'en') {
    try {
      const langName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || 'English';
      const prompt = `You are an advanced AI symptom analysis assistant.

Your task is to analyze user symptoms safely and accurately using WHO and NHS medical guidance.

Collect and analyze:
* Symptoms: ${symptoms.join(", ")}
* Severity: ${severity}
* Duration: ${duration}

CRITICAL: All textual values in the output JSON schema MUST be written in the ${langName} language.

Behavior Rules:
* Provide structured and precise responses when data is clear.
* Never provide definitive diagnoses.
* Never hallucinate diseases or symptoms.
* Never exaggerate risks unnecessarily.

Response Structure Requirements (Map to JSON keys):
- healthSummary
- possibleCauses
- riskLevel (Low, Moderate, High, Emergency)
- recommendations
- warningSigns
- suggestedSpecialist
- disclaimer

Emergency Detection:
If symptoms include:
* Chest pain + shortness of breath
* Seizures
* Paralysis
* Severe bleeding
* Loss of consciousness
* Blue lips
* Stroke symptoms
* Suicidal thoughts
Immediately advise emergency medical care.

Fallback Rule:
If uncertain or you do not know the answer, say:
“I am not knowledgeable in this area. Please try to consult a medical professional.”`;

      const systemInstruction = SYSTEM_INSTRUCTION + `\n\nOutput strictly JSON for the structured report. All text fields MUST be in ${langName}.`;
      
      const responseSchema = {
        type: "OBJECT",
        properties: {
          healthSummary: { type: "STRING" },
          possibleCauses: { type: "ARRAY", items: { type: "STRING" } },
          riskLevel: { type: "STRING", enum: ["Low", "Moderate", "High", "Emergency"] },
          recommendations: { type: "ARRAY", items: { type: "STRING" } },
          warningSigns: { type: "ARRAY", items: { type: "STRING" } },
          suggestedSpecialist: { type: "STRING" },
          disclaimer: { type: "STRING" }
        },
        required: ["healthSummary", "possibleCauses", "riskLevel", "recommendations", "warningSigns", "suggestedSpecialist", "disclaimer"]
      };

      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction, responseSchema, language, severity, duration })
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Analysis Error:", error);
      return this.getFallbackAnalysis(language, symptoms, severity, duration);
    }
  }

  /**
   * Multimodal chat with image and text with streaming support
   */
  async chatWithImageStream(
    messages: Message[], 
    base64Image: string, 
    mimeType: string, 
    text: string, 
    language: Language = 'en',
    onChunk: (chunk: string) => void
  ): Promise<string | undefined> {
    try {
      const langName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || 'English';
      const systemInstruction = SYSTEM_INSTRUCTION + `\n\nCRITICAL: Respond in ${langName}. Focus on visual triage.
      
If analyzing a prescription or medicine:
You are a medicine safety and prescription analysis AI assistant.
Your role:
* Analyze uploaded prescriptions and medicines safely.
* Explain medicine usage in simple language.
* Provide educational medicine information only.
* Follow CDSCO (Central Drugs Standard Control Organization) guidance for medicine safety in India.
* Detect banned, unsafe, unauthorized, or restricted medicines if possible.

Important Rules:
* Never prescribe medicines directly.
* Never provide dangerous dosage instructions.
* Never recommend illegal or banned medications.
* Never hallucinate medicine details.

If medicine information is unclear or unverified, respond with:
“I cannot confidently verify this medicine information. Please consult a licensed healthcare professional or pharmacist.”

For uploaded prescriptions:
* Extract medicine names
* Explain common uses
* Mention possible precautions
* Suggest professional consultation when needed

If handwriting or image quality is unclear, say:
“I cannot clearly analyze this prescription/image. Please upload a clearer image or consult your doctor.”

If analyzing a medical report, PDF, or scan (OCR):
You are an AI medical report analysis assistant designed to explain medical reports in simple and safe language.

Your responsibilities:
* Analyze uploaded PDFs, scans, and medical reports.
* Explain abnormal values simply.
* Summarize possible health concerns safely.
* Use WHO and NHS-aligned medical guidance.
* Avoid generating fake interpretations or unsupported claims.

Important Rules:
* Never provide definitive diagnoses.
* Never hallucinate report values.
* Never modify extracted OCR content falsely.
* Clearly distinguish between detected data and AI interpretation.

Response Structure:
1. Report Summary
2. Key Findings
3. Abnormal Values
4. Possible Concerns
5. Recommended Next Steps
6. Suggested Specialist
7. Disclaimer

If the uploaded report is blurry, corrupted, incomplete, or unreadable, respond with:
“I cannot confidently analyze this medical report. Please upload a clearer document or consult a healthcare professional.”`;

      const history = messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.text || "" }]
      }));

      const parts = [
        { inlineData: { data: base64Image, mimeType } },
        { text: `Analyze this image in the context of the user's query: "${text}". Provide triage guidance in ${langName} based on WHO/NHS standards. Be as precise as possible.` }
      ];

      const response = await fetch("/api/gemini/multimodal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, parts, systemInstruction })
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      return await this.processStream(response, onChunk);
    } catch (error: any) {
      this.handleError("Image Chat Stream", error);
    }
  }

  /**
   * Generates a structured summary for a real doctor
   */
  async generateClinicalSummary(messages: Message[]): Promise<any> {
    try {
      const chatLog = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n");
      const prompt = `Generate a high-fidelity clinical summary for a healthcare professional. Focus on objective facts, symptoms, and duration.\n\nInteraction History:\n${chatLog}`;
      const systemInstruction = "You are a professional clinical scribe. Output a structured JSON summary representing the case presentation.";
      
      const responseSchema = {
        type: "OBJECT",
        properties: {
          presentation: { type: "STRING" },
          symptoms: { type: "ARRAY", items: { type: "STRING" } },
          duration: { type: "STRING" },
          triageCategory: { type: "STRING" },
          keyConcerns: { type: "ARRAY", items: { type: "STRING" } },
          suggestedQuestionsForDoctor: { type: "ARRAY", items: { type: "STRING" } }
        },
        required: ["presentation", "symptoms", "duration", "triageCategory", "keyConcerns", "suggestedQuestionsForDoctor"]
      };

      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction, responseSchema })
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Summary Generation Error:", error);
      try {
        const chatTexts = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`);
        return LocalClinicalEngine.generateClinicalSummary(chatTexts.join("\n"));
      } catch (err) {
        console.warn("Client fallback clinical summary scribe failed:", err);
        return null;
      }
    }
  }

  /**
   * Dynamic medication safety check
   */
  async checkMedicationSafety(medicationName: string) {
    try {
      const prompt = `You are a medicine safety and prescription analysis AI assistant.

Your role:
* Analyze uploaded prescriptions and medicines safely.
* Explain medicine usage in simple language.
* Provide educational medicine information only.
* Follow CDSCO (Central Drugs Standard Control Organization) guidance for medicine safety in India.
* Detect banned, unsafe, unauthorized, or restricted medicines if possible.

Important Rules:
* Never prescribe medicines directly.
* Never provide dangerous dosage instructions.
* Never recommend illegal or banned medications.
* Never hallucinate medicine details.

If medicine information is unclear or unverified, map to "unknown" type and respond with:
“I cannot confidently verify this medicine information. Please consult a licensed healthcare professional or pharmacist.”

Analyze this medication: "${medicationName}".
Determine if it is BANNED, RESTRICTED, or COMMON. provide the specific reason if banned.`;

      const systemInstruction = SYSTEM_INSTRUCTION + "\n\nOutput strictly JSON. Use search tool to verify if unsure.";
      
      const responseSchema = {
        type: "OBJECT",
        properties: {
          type: { type: "STRING", enum: ["banned", "restricted", "common", "unknown"] },
          info: { type: "STRING", description: "Detailed regulatory/safety information" },
          reason: { type: "STRING", description: "Specific clinical/regulatory reason if banned/restricted" }
        },
        required: ["type", "info"]
      };

      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction, responseSchema })
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Medication Safety Check Error:", error);
      try {
        return LocalClinicalEngine.generateMedicationSafety(medicationName);
      } catch (err) {
        console.warn("Client fallback medication safety check failed:", err);
        throw error;
      }
    }
  }

  /**
   * Find nearby hospitals
   */
  async findNearbyHospitals(lat: number, lng: number) {
    try {
      const prompt = `Find the top 5 nearest hospitals or emergency medical centers to my current location. 
      Provide their names, addresses, and contact numbers if available.`;

      const response = await fetch("/api/gemini/hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng, prompt })
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Find Hospitals Error:", error);
      throw error;
    }
  }

  private handleError(context: string, error: any): never {
    console.error(`Gemini ${context} Error:`, error);
    throw error;
  }

  private getFallbackAnalysis(
    language: Language = 'en',
    symptoms: string[] = [],
    severity: string = 'Moderate',
    duration: string = '1-3 days'
  ) {
    try {
      const fallbackReport = LocalClinicalEngine.generateSymptomAnalysis(symptoms, severity, duration, language);
      if (fallbackReport) return fallbackReport;
    } catch (e) {
      console.warn("Local clinical engine fallback failed. Using hardcoded maps.", e);
    }

    const isHindi = language === 'hi';
    const isTelugu = language === 'te';
    const isTamil = language === 'ta';
    const isMalayalam = language === 'ml';
    const isKannada = language === 'kn';

    if (isHindi) {
      return {
        healthSummary: "परामर्श की सिफारिश की जाती है",
        possibleCauses: ["मुझे इस क्षेत्र में जानकारी नहीं है। कृपया किसी चिकित्सा पेशेवर से परामर्श करने का प्रयास करें।"],
        riskLevel: "Moderate",
        recommendations: ["सटीक निदान के लिए कृपया किसी स्वास्थ्य पेशेवर से परामर्श लें।"],
        warningSigns: [],
        suggestedSpecialist: "सामान्य चिकित्सक",
        disclaimer: "यह एक फ़ॉलबैक प्रतिक्रिया है। कृपया डॉक्टर से परामर्श लें।"
      };
    }
    if (isTelugu) {
      return {
        healthSummary: "సంప్రదింపులు సిఫార్సు చేయబడింది",
        possibleCauses: ["నాకు ఈ రంగంలో పరిజ్ఞానం లేదు. దయచేసి వైద్య నిపుణుడిని సంప్రదించడానికి ప్రయత్నించండి."],
        riskLevel: "Moderate",
        recommendations: ["ఖచ్చితమైన నిర్ధారణ కోసం దయచేసి ఆరోగ్య నిపుణుడిని సంప్రదించండి."],
        warningSigns: [],
        suggestedSpecialist: "జనరల్ ఫిజీషియన్",
        disclaimer: "ఇది ప్రత్యామ్నాయ సమాధానం. దయచేసి వైద్యుడిని సంప్రదించండి."
      };
    }
    if (isTamil) {
      return {
        healthSummary: "ஆலோசனை பரிந்துரைக்கப்படுகிறது",
        possibleCauses: ["எனக்கு இந்தத் துறையில் போதிய அறிவு இல்லை. தயவுசெய்து ஒரு மருத்துவ நிபுணரை அணுக முயற்சிக்கவும்."],
        riskLevel: "Moderate",
        recommendations: ["துல்லியமான நோயறிதலுக்கு ஒரு தகுதி வாய்ந்த மருத்துவரை அணுகவும்."],
        warningSigns: [],
        suggestedSpecialist: "பொது மருத்துவர்",
        disclaimer: "இது ஒரு மாற்று பதில். தயவுசெய்து மருத்துவரை அணுகவும்."
      };
    }
    if (isMalayalam) {
      return {
        healthSummary: "ആലോചന നിർദ്ദേശിക്കുന്നു",
        possibleCauses: ["ക്ഷമിക്കുക, എനിക്ക് ഈ ഭാഗത്ത് മതിയായ അറിവില്ല. ദയവായി ഒരു ഡോക്ടറെ സമീപിക്കുക."],
        riskLevel: "Moderate",
        recommendations: ["കൃത്യമായ രോഗനിർണ്ണയത്തിന് ദയവായി ഒരു ഡോക്ടറെ സമീപിക്കുക."],
        warningSigns: [],
        suggestedSpecialist: "ജനറൽ ഫിസിഷ്യൻ",
        disclaimer: "ഇതൊരു ബദൽ പ്രതികരണമാണ്. ദയവായി ഒരു ഡോക്ടറെ സമീപിക്കുക."
      };
    }
    if (isKannada) {
      return {
        healthSummary: "ಸಮಾಲೋಚನೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
        possibleCauses: ["ನನಗೆ ಈ ಕ್ಷೇತ್ರದಲ್ಲಿ ಜ್ಞಾನವಿಲ್ಲ. ದಯವಿಟ್ಟು ವೈದ್ಯಕೀಯ ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಲು ಪ್ರಯತ್ನಿಸಿ."],
        riskLevel: "Moderate",
        recommendations: ["ನಿಖರವಾದ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ದಯವಿಟ್ಟು ಆರೋಗ್ಯ ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಿ."],
        warningSigns: [],
        suggestedSpecialist: "ಸಾಮಾನ್ಯ ವೈದ್ಯರು",
        disclaimer: "ಇದು ಪರ್ಯಾಯ ಪ್ರತಿಕ್ರಿಯೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."
      };
    }

    return {
      healthSummary: "Consultation Recommended",
      possibleCauses: ["I am not knowledgeable in this area. Please try to consult a medical professional."],
      riskLevel: "Moderate",
      recommendations: ["Please consult a healthcare professional for an accurate diagnosis."],
      warningSigns: [],
      suggestedSpecialist: "General Practitioner",
      disclaimer: "This is a fallback response. Please consult a doctor."
    };
  }
}

export const gemini = new GeminiService();
