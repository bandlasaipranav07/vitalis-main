import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
import { LocalClinicalEngine } from "../_lib/local-clinical-engine.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const DEFAULT_MODEL = "gemini-2.5-flash";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { lat, lng, prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Search for top 5 hospitals near coordinates: ${lat}, ${lng}. ${prompt}`,
      config: { tools: [{ googleSearch: {} }] },
    });

    const metadata = response.candidates?.[0]?.groundingMetadata;
    const groundingChunks = metadata?.groundingChunks || [];

    const mapsLinks = groundingChunks
      .filter((c: any) => c.web?.uri?.includes("google.com/maps"))
      .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));

    return res.json({ text: response.text, mapsLinks });
  } catch (error: any) {
    console.error("Gemini Hospitals Error:", error);
    try {
      const fallback = LocalClinicalEngine.generateNearbyHospitals(lat || 28.6139, lng || 77.209);
      return res.json(fallback);
    } catch (fallbackErr) {
      return res.status(500).json({ error: error.message });
    }
  }
}
