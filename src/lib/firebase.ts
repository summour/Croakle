import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  HabitTemplate,
  MonthData,
  Project,
  NoteItem,
  TimeSession,
  AppSettings,
  PixelSceneConfig,
} from '../types';
import { HabitStoreState } from '../utils/storage';

const app = initializeApp(firebaseConfig);
export const firebaseProjectId = firebaseConfig.projectId;
export const firestoreDatabaseId = firebaseConfig.firestoreDatabaseId;
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connectivity test
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Authentication helpers
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Save profile metadata
      const profilePath = `users/${result.user.uid}/profile/info`;
      try {
        await setDoc(
          doc(db, 'users', result.user.uid, 'profile', 'info'),
          {
            userId: result.user.uid,
            displayName: result.user.displayName || 'Croakle Explorer',
            photoURL: result.user.photoURL || '',
            lastLoginAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, profilePath);
      }
      return result.user;
    }
    return null;
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      // Benign user action: closed popup window without selecting an account
      return null;
    }
    console.error('Sign in error', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export interface UserAppStatePayload {
  userId: string;
  habits: HabitStoreState;
  projects: Project[];
  notes: NoteItem[];
  sessions: TimeSession[];
  settings: AppSettings;
  pixelScene: PixelSceneConfig;
  updatedAt: string;
}

// Recursively removes undefined fields from objects/arrays so Firestore setDoc does not throw "Unsupported field value: undefined"
export function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as any;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => (item === undefined ? null : sanitizeForFirestore(item))) as any;
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleaned[key] = sanitizeForFirestore(value);
    }
  }
  return cleaned as T;
}

// Save complete app state to Firestore
export async function syncAppStateToFirestore(userId: string, payload: Omit<UserAppStatePayload, 'userId' | 'updatedAt'>) {
  if (!userId) return;
  const path = `users/${userId}/data/appState`;
  try {
    const docRef = doc(db, 'users', userId, 'data', 'appState');
    const cleanedPayload = sanitizeForFirestore({
      ...payload,
      userId,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, cleanedPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Listen to app state in Firestore
export function subscribeToAppState(
  userId: string,
  onData: (data: UserAppStatePayload) => void,
  onError?: (error: unknown) => void
) {
  const path = `users/${userId}/data/appState`;
  const docRef = doc(db, 'users', userId, 'data', 'appState');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as UserAppStatePayload);
      }
    },
    (error) => {
      console.warn('Subscription error on', path, error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Direct fetch from server to verify cloud data
export async function fetchServerAppState(userId: string): Promise<UserAppStatePayload | null> {
  if (!userId) return null;
  const path = `users/${userId}/data/appState`;
  try {
    const docRef = doc(db, 'users', userId, 'data', 'appState');
    const snapshot = await getDocFromServer(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserAppStatePayload;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    throw error;
  }
}
