/**
 * adminDb.ts — Server-side Supabase Database Service
 *
 * Replaces the previous Firestore REST API database backend with Supabase.
 * Maps all clinical data and user session profiles to PostgreSQL.
 *
 * Data model maps:
 *   /users/{uid}                  → users table
 *   /users/{uid}/messages/{msgId} → messages table
 */

import { createClient } from '@supabase/supabase-js';

// ── Supabase Configuration ───────────────────────────────────────────────────

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = supabaseUrl && supabaseKey;

if (!isSupabaseConfigured) {
  console.warn("⚠️  Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are missing in .env.");
  console.warn("⚠️  Falling back to in-memory session database to prevent system crashes.");
}

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  healthId?: string;
  createdAt?: number;
  lastLogin?: number;
}

export interface DBMessage {
  id?: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isEmergency?: boolean;
}

// ── Memory Fallbacks (If Supabase variables aren't provided yet) ───────────────

const memoryUsers: Map<string, UserProfile> = new Map();
const memoryMessages: Map<string, DBMessage[]> = new Map();

const generateHealthId = () =>
  'HB-' + Math.random().toString(36).substring(2, 10).toUpperCase();

// ── User Profile Operations ───────────────────────────────────────────────────

export async function upsertUserProfile(profile: UserProfile, token: string): Promise<void> {
  if (!supabase) {
    const existing = memoryUsers.get(profile.uid);
    if (!existing) {
      memoryUsers.set(profile.uid, {
        ...profile,
        healthId: generateHealthId(),
        createdAt: Date.now(),
        lastLogin: Date.now(),
      });
    } else {
      existing.lastLogin = Date.now();
      memoryUsers.set(profile.uid, existing);
    }
    return;
  }

  // 1. Check if user exists
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('uid')
    .eq('uid', profile.uid)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error("Supabase User Fetch Error:", fetchError.message);
    throw new Error(`Supabase user fetch failed: ${fetchError.message}`);
  }

  if (!user) {
    // 2. Insert new user
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        uid: profile.uid,
        email: profile.email,
        display_name: profile.displayName || null,
        photo_url: profile.photoURL || null,
        health_id: generateHealthId(),
        created_at: Date.now(),
        last_login: Date.now()
      });

    if (insertError) {
      console.error("Supabase User Insert Error:", insertError.message);
      throw new Error(`Supabase user insert failed: ${insertError.message}`);
    }
  } else {
    // 3. Update existing user's login timestamp
    const { error: updateError } = await supabase
      .from('users')
      .update({ last_login: Date.now() })
      .eq('uid', profile.uid);

    if (updateError) {
      console.error("Supabase User Update Error:", updateError.message);
      throw new Error(`Supabase user update failed: ${updateError.message}`);
    }
  }
}

export async function getUserProfile(uid: string, token: string): Promise<UserProfile | null> {
  if (!supabase) {
    return memoryUsers.get(uid) || null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('uid', uid)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // User not found
    console.error("Supabase Get User Profile Error:", error.message);
    throw new Error(`Supabase get profile failed: ${error.message}`);
  }

  return {
    uid: data.uid,
    email: data.email,
    displayName: data.display_name,
    photoURL: data.photo_url,
    healthId: data.health_id,
    createdAt: Number(data.created_at),
    lastLogin: Number(data.last_login)
  };
}

// ── Chat Messages Operations ──────────────────────────────────────────────────

export async function getMessages(uid: string, limitCount = 100, token: string): Promise<DBMessage[]> {
  if (!supabase) {
    return memoryMessages.get(uid) || [];
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', uid)
    .order('timestamp', { ascending: true })
    .limit(limitCount);

  if (error) {
    console.error("Supabase Get Messages Error:", error.message);
    throw new Error(`Supabase get messages failed: ${error.message}`);
  }

  return data.map(m => ({
    id: String(m.id),
    role: m.role as 'user' | 'model',
    text: m.text,
    timestamp: Number(m.timestamp),
    isEmergency: m.is_emergency
  }));
}

export async function addMessage(uid: string, msg: Omit<DBMessage, 'id'>, token: string): Promise<string> {
  if (!supabase) {
    const list = memoryMessages.get(uid) || [];
    const newMsg = { ...msg, id: String(Date.now()) };
    list.push(newMsg);
    memoryMessages.set(uid, list);
    return newMsg.id;
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      user_id: uid,
      role: msg.role,
      text: msg.text,
      timestamp: msg.timestamp,
      is_emergency: msg.isEmergency || false
    })
    .select('id')
    .single();

  if (error) {
    console.error("Supabase Add Message Error:", error.message);
    throw new Error(`Supabase add message failed: ${error.message}`);
  }

  return String(data.id);
}

export async function clearMessages(uid: string, token: string): Promise<void> {
  if (!supabase) {
    memoryMessages.set(uid, []);
    return;
  }

  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('user_id', uid);

  if (error) {
    console.error("Supabase Clear Messages Error:", error.message);
    throw new Error(`Supabase clear messages failed: ${error.message}`);
  }
}
