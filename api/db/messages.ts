import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getMessages,
  addMessage,
  clearMessages,
} from "../_lib/adminDb.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
  }
  const token = authHeader.split("Bearer ")[1];

  // GET /api/db/messages?uid=xxx&limit=100
  if (req.method === "GET") {
    const uid = req.query.uid as string;
    const limitCount = parseInt((req.query.limit as string) || "100", 10);
    if (!uid) return res.status(400).json({ error: "uid query param is required" });
    try {
      const msgs = await getMessages(uid, limitCount, token);
      return res.json({ messages: msgs });
    } catch (error: any) {
      console.error("DB Get Messages Error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // POST /api/db/messages — Add message
  if (req.method === "POST") {
    const { uid, role, text, timestamp } = req.body;
    if (!uid || !role || !text || !timestamp) {
      return res.status(400).json({ error: "uid, role, text, and timestamp are required" });
    }
    if (role !== "user" && role !== "model") {
      return res.status(400).json({ error: "role must be 'user' or 'model'" });
    }
    try {
      const id = await addMessage(uid, { role, text, timestamp }, token);
      return res.json({ success: true, id });
    } catch (error: any) {
      console.error("DB Add Message Error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
