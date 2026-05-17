import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { getFirestore, getDocFromServer, doc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence to local to ensure sessions persist in the iframe
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.error("Auth persistence error:", err);
});

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();
// Removing custom parameters that might interfere with some iframe/popup flows
// googleProvider.setCustomParameters({ prompt: 'select_account' });

// Test connection to Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
    // Skip logging for other errors, as this is simply a connection test.
  }
}
testConnection();

// Function to generate a unique Health ID
const generateHealthId = () => {
  return 'HB-' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const syncUserProfile = async (user: User) => {
  // Track login history locally for the Trust & Privacy dashboard
  try {
    const loginEntry = {
      timestamp: new Date().toLocaleString(),
      method: user.providerData[0]?.providerId === 'google.com' ? 'Google Auth' : 'Email Auth',
      device: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Browser'
    };
    const savedHistory = localStorage.getItem('vitalis_login_history');
    let history = savedHistory ? JSON.parse(savedHistory) : [];
    history = [loginEntry, ...history].slice(0, 10);
    localStorage.setItem('vitalis_login_history', JSON.stringify(history));
  } catch {
    // localStorage may not be available in all environments
  }

  // Sync profile via backend (uses firebase-admin — no browser permission issues)
  try {
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
      console.warn('Profile sync via backend returned:', res.statusText);
    }
  } catch (error) {
    console.error('Error syncing user profile via backend:', error);
    // Non-fatal — user can still use the app
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.warn("Sign-in popup was closed by the user.");
      const wrappedError = new Error("Sign-in was cancelled. Please try again or continue as a guest.");
      (wrappedError as any).code = error.code;
      throw wrappedError;
    }
    console.error("Error signing in with Google:", error.code, error.message);
    throw error;
  }
};

export const logout = () => signOut(auth);

export const loginWithEmail = async (email: string, pass: string) => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  await syncUserProfile(result.user);
  return result.user;
};

export const registerWithEmail = async (email: string, pass: string, name: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(result.user, { displayName: name });
  await syncUserProfile({ ...result.user, displayName: name } as User);
  return result.user;
};

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export { onAuthStateChanged };
export type { User };
