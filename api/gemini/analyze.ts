import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
import { LocalClinicalEngine } from "../_lib/local-clinical-engine";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const DEFAULT_MODEL = "gemini-2.5-flash";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt, systemInstruction, responseSchema, language = "en" } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    let rawText = response.text || "{}";
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    }
    return res.json(JSON.parse(rawText));
  } catch (error: any) {
    console.error("Gemini Analyze Error:", error);
    try {
      const lowerPrompt = (prompt || "").toLowerCase();
      if (lowerPrompt.includes("clinical summary") || lowerPrompt.includes("summary")) {
        const fallback = LocalClinicalEngine.generateClinicalSummary(prompt);
        return res.json(fallback);
      } else if (lowerPrompt.includes("medication") || lowerPrompt.includes("regulatory")) {
        const medMatch =
          prompt.match(/"([^"]+)"/) ||
          prompt.match(/medication:\s*"([^"]+)"/) ||
          prompt.match(/medication:\s*([a-zA-Z0-9\s-]+)/i);
        const medName = medMatch ? medMatch[1] : "Unknown medication";
        const fallback = LocalClinicalEngine.generateMedicationSafety(medName, language);
        return res.json(fallback);
      } else {
        const severity = req.body.severity || "Moderate";
        const duration = req.body.duration || "1-3 days";
        const symptomsMatch = prompt.match(/symptoms:\s*([^,]+(?:,\s*[^,]+)*)/i);
        const symptoms = symptomsMatch
          ? symptomsMatch[1].split(",").map((s: string) => s.trim())
          : ["Fever", "Cough"];
        const fallback = LocalClinicalEngine.generateSymptomAnalysis(symptoms, severity, duration, language);
        return res.json(fallback);
      }
    } catch (fallbackErr: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
