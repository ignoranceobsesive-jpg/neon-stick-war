/**
 * Auth System - Firebase Authentication integration
 * 
 * Handles user authentication including anonymous sign-in,
 * Google sign-in (popup and redirect), sign-out, and auth state listening.
 * Provides a subscribe pattern for components to react to auth state changes.
 */

/** Firebase user profile data exposed to the application */
export interface UserProfile {
  /** Firebase unique user ID */
  uid: string;
  /** Display name (defaults to "NeonWarrior" for anonymous users) */
  displayName: string;
  /** Email address (null for anonymous users) */
  email: string | null;
  /** Profile photo URL (null for anonymous users) */
  photoURL: string | null;
  /** Whether this is an anonymous account */
  isAnonymous: boolean;
}

/** Auth state snapshot */
export interface AuthState {
  /** Current Firebase user object (null if signed out) */
  user: unknown | null;
  /** Whether the auth system is still loading initial state */
  loading: boolean;
  /** Error message if auth operation failed */
  error: string | null;
  /** Whether the current session is anonymous */
  isAnonymous: boolean;
}

/** Auth state change subscriber callback */
export type AuthSubscriber = (state: AuthState) => void;

// ==========================================
// Module State
// ==========================================

/** Set of subscriber callbacks for auth state changes */
const subscribers = new Set<AuthSubscriber>();

/** Current auth state */
let authState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAnonymous: false,
};

/** Whether the auth listener has been initialized */
let authListenerInitialized = false;

/** Whether auto anonymous sign-in has been attempted */
let autoSignInAttempted = false;

/**
 * Notifies all subscribers of the current auth state.
 */
function notifySubscribers(): void {
  subscribers.forEach((callback) => callback(authState));
}

/**
 * Updates the auth state and notifies all subscribers.
 * 
 * @param updates - Partial auth state updates to apply
 */
function updateAuthState(updates: Partial<AuthState>): void {
  authState = { ...authState, ...updates };
  notifySubscribers();
}

// ==========================================
// Lazy-loaded Firebase Auth Module
// ==========================================

/**
 * Gets the Firebase Auth instance.
 * Uses dynamic imports for code splitting - Firebase is only loaded when needed.
 * 
 * @returns The Firebase Auth instance
 */
async function getAuthInstance(): Promise<unknown> {
  // In the original code, Firebase is loaded via a custom chunk loader:
  // const { getFirebaseAuth } = await e.A(76207);
  // return await getFirebaseAuth();
  //
  // This would be replaced with a standard import in a clean codebase:
  const { getAuth } = await import("firebase/auth");
  const { getFirebaseApp } = await import("@/lib/firebase/app");
  return getAuth(getFirebaseApp());
}

/**
 * Gets the Firebase auth module functions.
 * Loads firebase/auth dynamically for code splitting.
 */
async function getAuthFunctions() {
  return import("firebase/auth");
}

// ==========================================
// Public API
// ==========================================

/**
 * Initializes the Firebase auth state listener.
 * Sets up onAuthStateChanged to track sign-in/sign-out events.
 * Should be called once at app startup.
 * Safe to call multiple times - only initializes once.
 */
export async function initAuthListener(): Promise<void> {
  if (authListenerInitialized) return;

  try {
    const auth = await getAuthInstance();
    const { onAuthStateChanged } = await getAuthFunctions();

    authListenerInitialized = true;

    onAuthStateChanged(auth, (user: unknown) => {
      const firebaseUser = user as {
        isAnonymous?: boolean;
      } | null;

      authState = {
        user,
        loading: false,
        error: null,
        isAnonymous: firebaseUser?.isAnonymous ?? false,
      };

      notifySubscribers();
    });
  } catch (error) {
    console.error("[Auth] Failed to initialize auth listener:", error);
    authState = {
      user: null,
      loading: false,
      error: "Auth initialization failed",
      isAnonymous: false,
    };
    notifySubscribers();
  }
}

/**
 * Subscribes to auth state changes.
 * Immediately calls the callback with the current state.
 * Also triggers initAuthListener if not already initialized.
 * 
 * @param callback - Function called whenever auth state changes
 * @returns Unsubscribe function to remove the callback
 */
export function subscribeToAuth(callback: AuthSubscriber): () => void {
  subscribers.add(callback);

  // Immediately provide current state
  callback(authState);

  // Ensure auth listener is running
  initAuthListener();

  // Return unsubscribe function
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Signs in the user anonymously with Firebase.
 * If a user is already signed in, returns the current user.
 * 
 * @returns The Firebase user object, or null on failure
 */
export async function anonymousSignIn(): Promise<unknown> {
  if (autoSignInAttempted) return authState.user;
  autoSignInAttempted = true;

  try {
    const auth = await getAuthInstance();
    const firebaseAuth = auth as { currentUser: unknown };

    // If already signed in, return current user
    if (firebaseAuth.currentUser) return firebaseAuth.currentUser;

    const { signInAnonymously } = await getAuthFunctions();
    const result = await signInAnonymously(auth as Parameters<typeof signInAnonymously>[0]);
    return result.user;
  } catch (error) {
    console.error("[Auth] Auto anonymous sign-in failed:", error);
    autoSignInAttempted = false;
    return null;
  }
}

/**
 * Signs in the user with a fresh anonymous account.
 * Unlike anonymousSignIn(), this always creates a new anonymous session.
 * 
 * @returns The Firebase user object, or null on failure
 */
export async function createAnonymousSession(): Promise<unknown> {
  try {
    const auth = await getAuthInstance();
    const { signInAnonymously } = await getAuthFunctions();
    const result = await signInAnonymously(auth as Parameters<typeof signInAnonymously>[0]);
    return result.user;
  } catch (error) {
    console.error("[Auth] Anonymous sign-in failed:", error);
    return null;
  }
}

/**
 * Signs in the user with their Google account.
 * Uses popup sign-in on desktop and redirect sign-in on mobile devices.
 * 
 * On mobile devices (detected via user agent and pointer capabilities),
 * this uses signInWithRedirect() instead of signInWithPopup()
 * for better compatibility. In that case, the result is handled by
 * getRedirectResult() on page load.
 * 
 * @returns The Firebase user object, or null if cancelled/failed
 */
export async function googleSignIn(): Promise<unknown> {
  try {
    const auth = await getAuthInstance();
    const { signInWithPopup, signInWithRedirect, GoogleAuthProvider } =
      await getAuthFunctions();

    const provider = new GoogleAuthProvider();

    // Use redirect on mobile for better UX
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (isMobile) {
      await signInWithRedirect(
        auth as Parameters<typeof signInWithRedirect>[0],
        provider
      );
      return null; // Result handled by getRedirectResult on return
    }

    const result = await signInWithPopup(
      auth as Parameters<typeof signInWithPopup>[0],
      provider
    );
    return result.user;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError.code === "auth/popup-closed-by-user") {
      return null;
    }
    console.error("[Auth] Google sign-in failed:", error);
    return null;
  }
}

/**
 * Gets the result of a redirect sign-in.
 * Should be called on page load to handle the redirect callback
 * after a mobile Google sign-in.
 * 
 * @returns The Firebase user from the redirect result, or null
 */
export async function getRedirectResult(): Promise<unknown> {
  try {
    const auth = await getAuthInstance();
    const { getRedirectResult: firebaseGetRedirectResult } =
      await getAuthFunctions();
    const result = await firebaseGetRedirectResult(
      auth as Parameters<typeof firebaseGetRedirectResult>[0]
    );
    return result?.user ?? null;
  } catch (error) {
    console.error("[Auth] Redirect sign-in failed:", error);
    return null;
  }
}

/**
 * Signs the current user out.
 * 
 * @returns Promise that resolves when sign-out is complete
 */
export async function signOut(): Promise<void> {
  try {
    const auth = await getAuthInstance();
    const { signOut: firebaseSignOut } = await getAuthFunctions();
    await firebaseSignOut(auth as Parameters<typeof firebaseSignOut>[0]);
  } catch (error) {
    console.error("[Auth] Sign out failed:", error);
  }
}

/**
 * Gets the current user's profile data.
 * Returns a clean profile object with default values for missing fields.
 * 
 * @returns The user profile, or null if no user is signed in
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const auth = await getAuthInstance();
    const firebaseAuth = auth as {
      currentUser: {
        uid: string;
        displayName: string | null;
        email: string | null;
        photoURL: string | null;
        isAnonymous: boolean;
      } | null;
    };

    const user = firebaseAuth.currentUser;
    if (!user) return null;

    return {
      uid: user.uid,
      displayName: user.displayName || "NeonWarrior",
      email: user.email,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous,
    };
  } catch {
    return null;
  }
}

/**
 * Gets the current auth state synchronously.
 * Useful for components that don't need reactive updates.
 * 
 * @returns Current auth state snapshot
 */
export function getAuthState(): AuthState {
  return { ...authState };
}

export default {
  initAuthListener,
  subscribeToAuth,
  anonymousSignIn,
  createAnonymousSession,
  googleSignIn,
  getRedirectResult,
  signOut,
  getCurrentUserProfile,
  getAuthState,
};
