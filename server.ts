import "dotenv/config";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { LocalClinicalEngine } from "./api/_lib/local-clinical-engine";
import {
  upsertUserProfile,
  getUserProfile,
  getMessages,
  addMessage,
  clearMessages,
} from "./api/_lib/adminDb";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const DEFAULT_MODEL = "gemini-flash-latest";
const TTS_MODEL = "gemini-3.1-flash-tts-preview";

// API Routes
app.post("/api/gemini/chat", async (req, res) => {
  const { messages, language, model = DEFAULT_MODEL, systemInstruction } = req.body;
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role,
      parts: [{ text: m.text || "" }]
    }));

    const lastMessage = messages[messages.length - 1].text;

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction
      },
      history
    });

    const result = await chat.sendMessageStream({ 
      message: lastMessage,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    try {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }
      const fallbackResponse = await LocalClinicalEngine.generateChatResponse(messages, language);
      res.write(`data: ${JSON.stringify({ text: fallbackResponse })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (fallbackErr: any) {
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      } else {
        res.end();
      }
    }
  }
});

app.post("/api/gemini/analyze", async (req, res) => {
  const { prompt, systemInstruction, responseSchema } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    let rawText = response.text || "{}";
    if (rawText.startsWith("\`\`\`json")) {
      rawText = rawText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    }
    res.json(JSON.parse(rawText));
  } catch (error: any) {
    console.error("Gemini Analyze Error:", error);
    try {
      const lowerPrompt = (prompt || "").toLowerCase();
      if (lowerPrompt.includes("clinical summary") || lowerPrompt.includes("summary")) {
        const fallback = LocalClinicalEngine.generateClinicalSummary(prompt);
        res.json(fallback);
      } else if (lowerPrompt.includes("regulatory and safety") || lowerPrompt.includes("medication")) {
        // Extract medication name
        const medMatch = prompt.match(/"([^"]+)"/) || prompt.match(/medication:\s*"([^"]+)"/) || prompt.match(/medication:\s*([a-zA-Z0-9\s-]+)/i);
        const medName = medMatch ? medMatch[1] : "Unknown medication";
        const fallback = LocalClinicalEngine.generateMedicationSafety(medName);
        res.json(fallback);
      } else {
        // Assume symptom checker
        const severity = req.body.severity || "Moderate";
        const duration = req.body.duration || "1-3 days";
        const language = req.body.language || "en";
        // Extract symptoms list
        const symptomsMatch = prompt.match(/symptoms:\s*([^,]+(?:,\s*[^,]+)*)/);
        const symptoms = symptomsMatch ? symptomsMatch[1].split(",").map((s: string) => s.trim()) : ["Fever", "Cough"];
        const fallback = LocalClinicalEngine.generateSymptomAnalysis(symptoms, severity, duration, language);
        res.json(fallback);
      }
    } catch (fallbackErr: any) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post("/api/gemini/multimodal", async (req, res) => {
  const { history, parts, systemInstruction, model = DEFAULT_MODEL } = req.body;
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const response = await ai.models.generateContentStream({
      model,
      contents: [
        ...history,
        { role: 'user', parts }
      ],
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error("Gemini Multimodal Error:", error);
    try {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }
      
      // Get the last text instruction from parts or fallback to messages
      let promptText = "General wellness consultation";
      if (parts && Array.isArray(parts)) {
        const textPart = parts.find((p: any) => p.text);
        if (textPart) promptText = textPart.text;
      }
      
      const fallbackResponse = await LocalClinicalEngine.generateChatResponse([promptText], "en");
      res.write(`data: ${JSON.stringify({ text: fallbackResponse })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (fallbackErr: any) {
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      } else {
        res.end();
      }
    }
  }
});

app.post("/api/gemini/tts", async (req, res) => {
  try {
    const { text, language = 'English', voiceName = 'Puck' } = req.body;
    
    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: [{ parts: [{ text: `Speak this empathetically and clearly in ${language}: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (part?.data && part?.mimeType) {
      res.json({ data: part.data, mimeType: part.mimeType });
    } else {
      res.status(404).json({ error: "No audio generated" });
    }
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    try {
      const fallback = LocalClinicalEngine.generateTTSFallback();
      res.json(fallback);
    } catch (fallbackErr) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post("/api/gemini/hospitals", async (req, res) => {
  try {
    const { lat, lng, prompt } = req.body;
    
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL, 
      contents: `Search for top 5 hospitals near coordinates: ${lat}, ${lng}. ${prompt}`,
      config: {
        tools: [{ googleSearch: {} }]
      },
    });

    const metadata = response.candidates?.[0]?.groundingMetadata;
    const groundingChunks = metadata?.groundingChunks || [];
    
    const mapsLinks = groundingChunks
      .filter((c: any) => c.web && c.web.uri && c.web.uri.includes('google.com/maps'))
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri
      }));

    res.json({
      text: response.text,
      mapsLinks
    });
  } catch (error: any) {
    console.error("Gemini Hospitals Error:", error);
    try {
      const fallback = LocalClinicalEngine.generateNearbyHospitals(req.body.lat || 28.6139, req.body.lng || 77.2090);
      res.json(fallback);
    } catch (fallbackErr) {
      res.status(500).json({ error: error.message });
    }
  }
});

// ── Database API Routes (Firebase Admin — no browser permission issues) ──────

/**
 * POST /api/db/profile
 * Body: { uid, email, displayName?, photoURL? }
 * Upserts a user profile document in Firestore and returns the full profile.
 */
app.post("/api/db/profile", async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
    }
    const token = authHeader.split('Bearer ')[1];
    if (!uid || !email) {
      return res.status(400).json({ error: "uid and email are required" });
    }
    await upsertUserProfile({ uid, email, displayName, photoURL }, token);
    const profile = await getUserProfile(uid, token);
    res.json({ success: true, profile });
  } catch (error: any) {
    console.error("DB Profile Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/db/messages?uid=xxx&limit=100
 * Returns an ordered list of messages for the given user.
 */
app.get("/api/db/messages", async (req, res) => {
  try {
    const uid = req.query.uid as string;
    const limitCount = parseInt((req.query.limit as string) || "100", 10);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
    }
    const token = authHeader.split('Bearer ')[1];
    if (!uid) return res.status(400).json({ error: "uid query param is required" });
    const msgs = await getMessages(uid, limitCount, token);
    res.json({ messages: msgs });
  } catch (error: any) {
    console.error("DB Get Messages Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/db/messages
 * Body: { uid, role, text, timestamp }
 * Adds a new message document under the user's messages sub-collection.
 */
app.post("/api/db/messages", async (req, res) => {
  try {
    const { uid, role, text, timestamp } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
    }
    const token = authHeader.split('Bearer ')[1];
    if (!uid || !role || !text || !timestamp) {
      return res.status(400).json({ error: "uid, role, text, and timestamp are required" });
    }
    if (role !== 'user' && role !== 'model') {
      return res.status(400).json({ error: "role must be 'user' or 'model'" });
    }
    const id = await addMessage(uid, { role, text, timestamp }, token);
    res.json({ success: true, id });
  } catch (error: any) {
    console.error("DB Add Message Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/db/messages/clear
 * Body: { uid }
 * Deletes all messages in the user's messages sub-collection.
 */
app.post("/api/db/messages/clear", async (req, res) => {
  try {
    const { uid } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
    }
    const token = authHeader.split('Bearer ')[1];
    if (!uid) return res.status(400).json({ error: "uid is required" });
    await clearMessages(uid, token);
    res.json({ success: true });
  } catch (error: any) {
    console.error("DB Clear Messages Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
