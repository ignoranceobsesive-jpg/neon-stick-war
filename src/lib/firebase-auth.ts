/**
 * FIREBASE AUTH — Handles user sign-in for cloud saves
 *
 * Sign-in methods:
 *   - autoSignIn()     → Auto anonymous sign-in (no user action needed)
 *   - signInWithGoogle() → Google sign-in (popup on desktop, redirect on mobile)
 *   - signOutUser()    → Sign out
 *
 * Used by: page.tsx (auto signs in on app load)
 */

import type { User } from 'firebase/auth';

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (window.matchMedia('(hover: none) and (pointer: coarse)').matches);
}

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAnonymous: boolean;
};

type AuthListener = (state: AuthState) => void;
const listeners = new Set<AuthListener>();
let currentState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAnonymous: false,
};

let authInitialized = false;

async function ensureAuthInit() {
  if (authInitialized) return;
  const { getFirebaseAuth } = await import('./firebase');
  const auth = await getFirebaseAuth();
  const { onAuthStateChanged } = await import('firebase/auth');

  authInitialized = true;

  onAuthStateChanged(auth, (user) => {
    currentState = {
      user,
      loading: false,
      error: null,
      isAnonymous: user?.isAnonymous ?? false,
    };
    listeners.forEach(fn => fn(currentState));
  });
}

export function onAuthChange(listener: AuthListener): () => void {
  listeners.add(listener);
  listener(currentState);
  ensureAuthInit();
  return () => listeners.delete(listener);
}

export function getCurrentAuthState(): AuthState {
  return currentState;
}

let autoSignInAttempted = false;

export async function autoSignIn(): Promise<User | null> {
  if (autoSignInAttempted) return currentState.user;
  autoSignInAttempted = true;

  const { getFirebaseAuth } = await import('./firebase');
  const auth = await getFirebaseAuth();

  if (auth.currentUser) return auth.currentUser;

  try {
    const { signInAnonymously } = await import('firebase/auth');
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (err: any) {
    console.error('Auto anonymous sign-in failed:', err);
    autoSignInAttempted = false;
    return null;
  }
}

export async function signInAnon(): Promise<User | null> {
  const { getFirebaseAuth } = await import('./firebase');
  const auth = await getFirebaseAuth();
  const { signInAnonymously } = await import('firebase/auth');

  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (err: any) {
    console.error('Anonymous sign-in failed:', err);
    return null;
  }
}

export async function signInWithGoogle(): Promise<User | null> {
  const { getFirebaseAuth } = await import('./firebase');
  const auth = await getFirebaseAuth();
  const { signInWithPopup, signInWithRedirect, GoogleAuthProvider } = await import('firebase/auth');
  const googleProvider = new GoogleAuthProvider();

  try {
    if (isMobileDevice()) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    } else {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    }
  } catch (err: any) {
    if (err.code === 'auth/popup-closed-by-user') return null;
    console.error('Google sign-in failed:', err);
    return null;
  }
}

export async function handleRedirectResult(): Promise<User | null> {
  const { getFirebaseAuth } = await import('./firebase');
  const auth = await getFirebaseAuth();
  const { getRedirectResult } = await import('firebase/auth');

  try {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch (err: any) {
    console.error('Redirect sign-in failed:', err);
    return null;
  }
}

export async function signOutUser(): Promise<void> {
  const { getFirebaseAuth } = await import('./firebase');
  const auth = await getFirebaseAuth();
  const { signOut } = await import('firebase/auth');

  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign out failed:', err);
  }
}

export async function getUserInfo(): Promise<{
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
} | null> {
  const { getFirebaseAuth } = await import('./firebase');
  const auth = await getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) return null;
  return {
    uid: user.uid,
    displayName: user.displayName || 'NeonWarrior',
    email: user.email,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
  };
}
