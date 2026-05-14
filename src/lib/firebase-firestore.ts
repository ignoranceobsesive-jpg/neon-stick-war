/**
 * FIREBASE FIRESTORE — Cloud save system
 *
 * Functions:
 *   - uploadSaveToCloud()    → Save game progress to Firestore
 *   - downloadSaveFromCloud() → Load game progress from Firestore
 *   - mergeSaves()           → Intelligently merge local + cloud saves
 *                               (higher level wins, max coins from both)
 *
 * Saves are stored under: gameSaves/{userId}
 * Used by: page.tsx (handles neon-cloud-save / neon-cloud-load messages)
 */

export interface SaveData {
  [key: string]: any;
}

const SAVES_COLLECTION = 'gameSaves';

// Upload local save data to Firestore
export async function uploadSaveToCloud(saveData: SaveData): Promise<boolean> {
  const { getFirebaseAuth, getFirebaseDb } = await import('./firebase');
  const auth = await getFirebaseAuth();
  const db = await getFirebaseDb();
  const { doc, setDoc, getDoc, serverTimestamp } = await import('firebase/firestore');

  const user = auth.currentUser;
  if (!user) return false;

  try {
    const saveRef = doc(db, SAVES_COLLECTION, user.uid);
    let isNewDoc = false;
    try {
      const existingSnap = await getDoc(saveRef);
      isNewDoc = !existingSnap.exists();
    } catch {}

    await setDoc(saveRef, {
      ...saveData,
      userId: user.uid,
      ...(isNewDoc ? { createdAt: serverTimestamp() } : {}),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Failed to upload save to cloud:', err);
    return false;
  }
}

// Download save data from Firestore
export async function downloadSaveFromCloud(): Promise<SaveData | null> {
  const { getFirebaseAuth, getFirebaseDb } = await import('./firebase');
  const auth = await getFirebaseAuth();
  const db = await getFirebaseDb();
  const { doc, getDoc } = await import('firebase/firestore');

  const user = auth.currentUser;
  if (!user) return null;

  try {
    const saveRef = doc(db, SAVES_COLLECTION, user.uid);
    const snapshot = await getDoc(saveRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      const { userId, updatedAt, createdAt, ...saveData } = data as any;
      return saveData as SaveData;
    }
    return null;
  } catch (err) {
    console.error('Failed to download save from cloud:', err);
    return null;
  }
}

// Merge local and cloud saves (cloud wins if higher level, but takes max coins)
export function mergeSaves(localSave: SaveData, cloudSave: SaveData): SaveData {
  const localScore = localSave.totalScore || 0;
  const cloudScore = cloudSave.totalScore || 0;
  const localLevel = localSave.highestLevel || 1;
  const cloudLevel = cloudSave.highestLevel || 1;

  if (cloudLevel > localLevel || (cloudLevel === localLevel && cloudScore > localScore)) {
    return {
      ...cloudSave,
      totalCoins: Math.max(localSave.totalCoins || 0, cloudSave.totalCoins || 0),
    };
  }
  return localSave;
}
