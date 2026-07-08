import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Modality } from "@google/genai";
import { LocalClinicalEngine } from "../_lib/local-clinical-engine";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const TTS_MODEL = "gemini-2.5-flash-preview-tts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { text, language = "English", voiceName = "Puck" } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: [{ parts: [{ text: `Speak this empathetically and clearly in ${language}: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } },
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (part?.data && part?.mimeType) {
      return res.json({ data: part.data, mimeType: part.mimeType });
    } else {
      return res.status(404).json({ error: "No audio generated" });
    }
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    try {
      const fallback = LocalClinicalEngine.generateTTSFallback();
      return res.json(fallback);
    } catch (fallbackErr) {
      return res.status(500).json({ error: error.message });
    }
  }
}
