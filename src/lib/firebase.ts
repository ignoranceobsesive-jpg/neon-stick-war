/**
 * FIREBASE CONFIG — Connects to the "neon-stickman-stickwar" Firebase project
 *
 * Provides:
 *   - getFirebaseAuth() → Firebase Authentication instance
 *   - getFirebaseDb()   → Firestore database instance
 *   - logAnalyticsEvent() → Track events (app_open, level_complete, ad_rewarded)
 *
 * Lazy-loads Firebase modules to keep initial page load fast.
 * Used by: firebase-auth.ts, firebase-firestore.ts, page.tsx
 */

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD7qhVVSmi6wc9wFTG8_mpbE42OkOzGpPk",
  authDomain: "neon-stickman-stickwar.firebaseapp.com",
  projectId: "neon-stickman-stickwar",
  storageBucket: "neon-stickman-stickwar.firebasestorage.app",
  messagingSenderId: "551814219382",
  appId: "1:551814219382:web:a62a5cfe71571b90a74157",
  measurementId: "G-X9CGN5FDGL"
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let initPromise: Promise<void> | null = null;

function initFirebase(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (typeof window === 'undefined') return;

    const { initializeApp, getApps } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');
    const { getFirestore } = await import('firebase/firestore');

    if (!getApps().length) {
      _app = initializeApp(firebaseConfig);
    } else {
      _app = getApps()[0];
    }
    _auth = getAuth(_app);
    _db = getFirestore(_app);
  })();

  return initPromise;
}

export async function getFirebaseAuth(): Promise<Auth> {
  await initFirebase();
  return _auth!;
}

export async function getFirebaseDb(): Promise<Firestore> {
  await initFirebase();
  return _db!;
}

export function getApp(): FirebaseApp | null {
  return _app;
}

export async function logAnalyticsEvent(eventName: string, params?: Record<string, any>) {
  if (!_app) return;
  try {
    const { getAnalytics, logEvent } = await import('firebase/analytics');
    const analytics = getAnalytics(_app);
    logEvent(analytics, eventName, params);
  } catch {
    // Analytics not available in all environments
  }
}

export { firebaseConfig };
