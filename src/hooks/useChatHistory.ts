/**
 * useChatHistory.ts
 *
 * Strategy:
 *   • Authenticated users  → backend API routes (/api/db/messages) backed by
 *     firebase-admin, so no browser Firestore permission issues.
 *   • Guest users          → browser localStorage (no auth required).
 *
 * The hook also listens for Firebase Auth state changes so that when a user
 * signs in mid-session their history automatically upgrades from localStorage
 * to Firestore via the backend.
 */

import { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Message } from '../types';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'model',
  text: "👋 Hello! I'm your Vitalis Companion. I'm here to listen and help you with any health or wellness questions you might have. \n\nWhether you're feeling unwell, need a quick symptom check, or just want some wellness tips, I'm ready to support you! How are you feeling today?",
  timestamp: Date.now(),
};

const GUEST_KEY = 'vitalis_guest_messages';

// ── Backend API helpers ───────────────────────────────────────────────────────

async function apiGetMessages(user: User): Promise<Message[]> {
  const token = await user.getIdToken();
  const res = await fetch(`/api/db/messages?uid=${encodeURIComponent(user.uid)}&limit=100`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`GET /api/db/messages failed: ${res.statusText}`);
  const data = await res.json();
  return data.messages as Message[];
}

async function apiAddMessage(user: User, role: 'user' | 'model', text: string): Promise<string> {
  const token = await user.getIdToken();
  const res = await fetch('/api/db/messages', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ uid: user.uid, role, text, timestamp: Date.now() }),
  });
  if (!res.ok) throw new Error(`POST /api/db/messages failed: ${res.statusText}`);
  const data = await res.json();
  return data.id as string;
}

async function apiClearMessages(user: User): Promise<void> {
  const token = await user.getIdToken();
  const res = await fetch('/api/db/messages/clear', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ uid: user.uid }),
  });
  if (!res.ok) throw new Error(`POST /api/db/messages/clear failed: ${res.statusText}`);
}

async function apiUpsertProfile(user: User): Promise<void> {
  const token = await user.getIdToken();
  const res = await fetch('/api/db/profile', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }),
  });
  if (!res.ok) {
    console.error('Profile upsert failed:', res.statusText);
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useChatHistory() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  // Keep a ref to the current user so callbacks don't close over stale values
  const currentUserRef = useRef<User | null>(auth.currentUser);

  useEffect(() => {
    let cancelled = false;

    const loadHistory = async (user: User | null) => {
      currentUserRef.current = user;
      setIsHistoryLoading(true);

      if (!user) {
        // ── Guest path ──────────────────────────────────────────────────────
        try {
          const saved = localStorage.getItem(GUEST_KEY);
          const parsed: Message[] = saved ? JSON.parse(saved) : [];
          if (!cancelled) {
            setMessages(parsed.length > 0 ? parsed : [WELCOME_MESSAGE]);
          }
        } catch {
          if (!cancelled) setMessages([WELCOME_MESSAGE]);
        }
        if (!cancelled) setIsHistoryLoading(false);
        return;
      }

      // ── Authenticated path ────────────────────────────────────────────────
      try {
        // Fire-and-forget profile upsert (keeps lastLogin up to date)
        apiUpsertProfile(user).catch(e =>
          console.warn('Profile sync skipped:', e.message)
        );

        const msgs = await apiGetMessages(user);
        if (!cancelled) {
          setMessages(msgs.length > 0 ? msgs : [WELCOME_MESSAGE]);
        }
      } catch (err) {
        console.error('Failed to load message history from backend:', err);
        if (!cancelled) setMessages([WELCOME_MESSAGE]);
      } finally {
        if (!cancelled) setIsHistoryLoading(false);
      }
    };

    // Subscribe to auth state; re-load history whenever user changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      loadHistory(user);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  // ── saveMessage ─────────────────────────────────────────────────────────────

  const saveMessage = async (role: 'user' | 'model', text: string) => {
    const user = currentUserRef.current;

    const newMsg: Message = {
      id: Date.now().toString(),
      role,
      text,
      timestamp: Date.now(),
    };

    // Optimistic local update
    setMessages(prev => [...prev.filter(m => m.id !== 'welcome'), newMsg]);

    if (!user) {
      // Persist to localStorage for guests
      setMessages(prev => {
        const updated = [...prev];
        localStorage.setItem(GUEST_KEY, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // Persist to Firestore via backend
    try {
      const serverId = await apiAddMessage(user, role, text);
      // Update the optimistic message ID with the real Firestore doc ID
      setMessages(prev =>
        prev.map(m => (m.id === newMsg.id ? { ...m, id: serverId } : m))
      );
    } catch (err) {
      console.error('Failed to persist message to backend:', err);
      // Keep the optimistic message in state — user can still chat
    }
  };

  // ── clearHistory ────────────────────────────────────────────────────────────

  const clearHistory = async () => {
    const user = currentUserRef.current;

    // Immediate UI reset
    setMessages([WELCOME_MESSAGE]);

    if (!user) {
      localStorage.removeItem(GUEST_KEY);
      return;
    }

    try {
      await apiClearMessages(user);
    } catch (err) {
      console.error('Failed to clear history on backend:', err);
    }
  };

  return { messages, saveMessage, clearHistory, isHistoryLoading };
}
