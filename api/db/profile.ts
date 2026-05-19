import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  upsertUserProfile,
  getUserProfile,
} from "../_lib/adminDb.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { uid, email, displayName, photoURL } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
    }
    const token = authHeader.split("Bearer ")[1];
    if (!uid || !email) {
      return res.status(400).json({ error: "uid and email are required" });
    }
    await upsertUserProfile({ uid, email, displayName, photoURL }, token);
    const profile = await getUserProfile(uid, token);
    return res.json({ success: true, profile });
  } catch (error: any) {
    console.error("DB Profile Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
