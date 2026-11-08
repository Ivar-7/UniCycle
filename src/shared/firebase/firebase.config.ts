import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
  type Analytics,
} from 'firebase/analytics';
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { logDiagnosticError } from '@/shared/errors';
import { firebaseConfigSchema, type FirebaseConfig } from './firebase.schema';

const rawFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseConfig: FirebaseConfig = firebaseConfigSchema.parse(rawFirebaseConfig);

export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);

export const firebaseAuth: Auth = getAuth(firebaseApp);
export const firestoreDb: Firestore = getFirestore(firebaseApp);
export const realtimeDb: Database = getDatabase(firebaseApp);
export const firebaseStorage: FirebaseStorage = getStorage(firebaseApp);

export let firebaseAnalytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  void isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        firebaseAnalytics = getAnalytics(firebaseApp);
      }
    })
    .catch((err: unknown) => {
      logDiagnosticError(err, 'FirebaseAnalyticsInit');
    });
}
