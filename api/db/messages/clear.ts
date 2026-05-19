import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clearMessages } from "../../_lib/adminDb.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
  }
  const token = authHeader.split("Bearer ")[1];
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "uid is required" });

  try {
    await clearMessages(uid, token);
    return res.json({ success: true });
  } catch (error: any) {
    console.error("DB Clear Messages Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
