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

  const { messages, language = "en", model = DEFAULT_MODEL, systemInstruction } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Content-Type-Options", "nosniff");

  try {
    const history = (messages || []).slice(0, -1).map((m: any) => ({
      role: m.role,
      parts: [{ text: m.text || "" }],
    }));
    const lastMessage = messages[messages.length - 1]?.text || "";

    const chat = ai.chats.create({
      model,
      config: { systemInstruction },
      history,
    });

    const result = await chat.sendMessageStream({
      message: lastMessage,
      config: { tools: [{ googleSearch: {} }] },
    });

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    try {
      const fallback = await LocalClinicalEngine.generateChatResponse(
        (messages || []).map((m: any) => m.text || ""),
        language
      );
      res.write(`data: ${JSON.stringify({ text: fallback })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (fallbackErr: any) {
      if (!res.headersSent) res.status(500).json({ error: error.message });
      else res.end();
    }
  }
}
