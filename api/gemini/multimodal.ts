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

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Content-Type-Options", "nosniff");

  const { history = [], parts, systemInstruction, model = DEFAULT_MODEL } = req.body;

  try {
    const response = await ai.models.generateContentStream({
      model,
      contents: [...history, { role: "user", parts }],
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Gemini Multimodal Error:", error);
    try {
      let promptText = "General wellness consultation";
      if (parts && Array.isArray(parts)) {
        const textPart = parts.find((p: any) => p.text);
        if (textPart) promptText = textPart.text;
      }
      const fallback = await LocalClinicalEngine.generateChatResponse([promptText], "en");
      res.write(`data: ${JSON.stringify({ text: fallback })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (fallbackErr: any) {
      if (!res.headersSent) res.status(500).json({ error: error.message });
      else res.end();
    }
  }
}
