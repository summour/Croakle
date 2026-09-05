import { useState, useEffect, useRef, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  signInWithGoogle,
  logOut,
  syncAppStateToFirestore,
  subscribeToAppState,
  UserAppStatePayload,
} from '../lib/firebase';
import { HabitStoreState } from '../utils/storage';
import {
  Project,
  NoteItem,
  TimeSession,
  AppSettings,
  PixelSceneConfig,
} from '../types';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'unauthenticated' | 'error';

interface UseFirebaseAuthProps {
  habitStore: HabitStoreState;
  projects: Project[];
  notes: NoteItem[];
  sessions: TimeSession[];
  settings: AppSettings;
  pixelScene: PixelSceneConfig;
  onCloudStateLoaded: (data: UserAppStatePayload) => void;
}

export function useFirebaseAuth({
  habitStore,
  projects,
  notes,
  sessions,
  settings,
  pixelScene,
  onCloudStateLoaded,
}: UseFirebaseAuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('unauthenticated');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Flags to prevent infinite save loops when incoming remote data arrives
  const isRemoteUpdateRef = useRef(false);
  const initialLoadDoneRef = useRef(false);
  const debounceTimerRef = useRef<any>(null);

  // Listen for Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) {
        setSyncStatus('unauthenticated');
        initialLoadDoneRef.current = false;
      }
    });
    return () => unsubscribe();
  }, []);

  // When user is authenticated, subscribe to Firestore real-time doc
  useEffect(() => {
    if (!user) return;

    setSyncStatus('syncing');
    const unsubscribe = subscribeToAppState(
      user.uid,
      (cloudData) => {
        if (cloudData) {
          isRemoteUpdateRef.current = true;
          onCloudStateLoaded(cloudData);
          setSyncStatus('synced');
          setLastSyncedAt(new Date());
          initialLoadDoneRef.current = true;
          setTimeout(() => {
            isRemoteUpdateRef.current = false;
          }, 300);
        }
      },
      (error) => {
        console.warn('Firestore sync error:', error);
        setSyncStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Sync timeout or network error');
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user, onCloudStateLoaded]);

  // Push local changes to Firestore with debounce when user is logged in
  useEffect(() => {
    if (!user) return;
    if (isRemoteUpdateRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setSyncStatus('syncing');
    debounceTimerRef.current = setTimeout(async () => {
      try {
        await syncAppStateToFirestore(user.uid, {
          habits: habitStore,
          projects,
          notes,
          sessions,
          settings,
          pixelScene,
        });
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
        setErrorMessage(null);
      } catch (err: any) {
        console.warn('Sync failed:', err);
        setSyncStatus('error');
        setErrorMessage(err?.message || 'Failed to sync to cloud');
      }
    }, 1200);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [user, habitStore, projects, notes, sessions, settings, pixelScene]);

  // Manual Trigger to force sync current data
  const handleSyncNow = useCallback(async () => {
    if (!user) {
      setErrorMessage('Please sign in with Google first.');
      return;
    }
    setSyncStatus('syncing');
    try {
      await syncAppStateToFirestore(user.uid, {
        habits: habitStore,
        projects,
        notes,
        sessions,
        settings,
        pixelScene,
      });
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
      setErrorMessage(null);
    } catch (err: any) {
      setSyncStatus('error');
      setErrorMessage(err?.message || 'Sync failed');
    }
  }, [user, habitStore, projects, notes, sessions, settings, pixelScene]);

  const handleSignIn = useCallback(async () => {
    setErrorMessage(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-domain') {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'summour.github.io';
        setErrorMessage(
          `Unauthorized Domain: "${currentDomain}" needs to be authorized in Firebase Console (Authentication > Settings > Authorized domains).`
        );
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in popup was closed before completing.');
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMessage('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setErrorMessage(err?.message || 'Sign in cancelled or failed');
      }
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await logOut();
      setUser(null);
      setSyncStatus('unauthenticated');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Sign out failed');
    }
  }, []);

  return {
    user,
    authLoading,
    syncStatus,
    lastSyncedAt,
    errorMessage,
    signIn: handleSignIn,
    signOut: handleSignOut,
    syncNow: handleSyncNow,
  };
}
