import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import type { z } from 'zod';
import { logDiagnosticError } from '@/shared/errors';
import { firestoreDb } from './firebase.config';

const LOCAL_SEED_CACHE_PREFIX = 'unicycle_firestore_seed_v2_';

function readLocalCache<T>(key: string, schema: z.ZodType<T>): T | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(`${LOCAL_SEED_CACHE_PREFIX}${key}`);
    if (!raw) {
      return null;
    }
    const parsedJson: unknown = JSON.parse(raw);
    const validated = schema.safeParse(parsedJson);
    return validated.success ? validated.data : null;
  } catch (err: unknown) {
    logDiagnosticError(err, `readLocalCache(${key})`);
    return null;
  }
}

function writeLocalCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(`${LOCAL_SEED_CACHE_PREFIX}${key}`, JSON.stringify(data));
  } catch (err: unknown) {
    logDiagnosticError(err, `writeLocalCache(${key})`);
  }
}

export async function fetchCollectionWithSeed<T extends { readonly id: string }>(
  collectionName: string,
  itemSchema: z.ZodType<T>,
  listSchema: z.ZodType<T[]>,
  seedItems: readonly T[],
): Promise<T[]> {
  const validatedSeed = listSchema.parse(seedItems);

  try {
    const colRef = collection(firestoreDb, collectionName);
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
      const validDocs: T[] = [];
      for (const docSnap of snapshot.docs) {
        const rawData: unknown = { id: docSnap.id, ...docSnap.data() };
        const parsed = itemSchema.safeParse(rawData);
        if (parsed.success) {
          validDocs.push(parsed.data);
        }
      }
      if (validDocs.length > 0) {
        writeLocalCache(collectionName, validDocs);
        return validDocs;
      }
    }

    // Firestore collection is empty — seed it with initial seed data
    const cached = readLocalCache(collectionName, listSchema);
    const initialData = cached && cached.length > 0 ? cached : validatedSeed;
    writeLocalCache(collectionName, initialData);

    try {
      const batch = writeBatch(firestoreDb);
      for (const item of initialData) {
        const docRef = doc(firestoreDb, collectionName, item.id);
        batch.set(docRef, item);
      }
      await batch.commit();
    } catch (seedErr: unknown) {
      logDiagnosticError(seedErr, `FirestoreAutoSeed(${collectionName})`, 'FIREBASE_ERROR');
    }

    return initialData;
  } catch (err: unknown) {
    logDiagnosticError(err, `fetchCollectionWithSeed(${collectionName})`, 'FIREBASE_ERROR');
    const cached = readLocalCache(collectionName, listSchema);
    if (cached && cached.length > 0) {
      return cached;
    }
    writeLocalCache(collectionName, validatedSeed);
    return validatedSeed;
  }
}

export async function fetchDocumentWithSeed<T extends object>(
  collectionName: string,
  docId: string,
  schema: z.ZodType<T>,
  seedData: T,
): Promise<T> {
  const cacheKey = `${collectionName}_${docId}`;
  const validatedSeed = schema.parse(seedData);

  try {
    const docRef = doc(firestoreDb, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const rawData: unknown = { id: docSnap.id, ...docSnap.data() };
      const parsed = schema.safeParse(rawData);
      if (parsed.success) {
        writeLocalCache(cacheKey, parsed.data);
        return parsed.data;
      }
    }

    const cached = readLocalCache(cacheKey, schema);
    const initialDoc = cached ?? validatedSeed;
    writeLocalCache(cacheKey, initialDoc);

    try {
      await setDoc(docRef, initialDoc);
    } catch (seedErr: unknown) {
      logDiagnosticError(seedErr, `FirestoreAutoSeedDoc(${collectionName}/${docId})`);
    }

    return initialDoc;
  } catch (err: unknown) {
    logDiagnosticError(err, `fetchDocumentWithSeed(${collectionName}/${docId})`, 'FIREBASE_ERROR');
    const cached = readLocalCache(cacheKey, schema);
    if (cached) {
      return cached;
    }
    writeLocalCache(cacheKey, validatedSeed);
    return validatedSeed;
  }
}

export async function upsertCollectionDocument<T extends { readonly id: string }>(
  collectionName: string,
  item: T,
  itemSchema: z.ZodType<T>,
  listSchema: z.ZodType<T[]>,
  fallbackSeed: readonly T[],
): Promise<T> {
  const validatedItem = itemSchema.parse(item);
  const currentList = readLocalCache(collectionName, listSchema) ?? [...fallbackSeed];
  const exists = currentList.some((existing) => existing.id === validatedItem.id);
  const updatedList = exists
    ? currentList.map((existing) => (existing.id === validatedItem.id ? validatedItem : existing))
    : [validatedItem, ...currentList];

  writeLocalCache(collectionName, updatedList);

  try {
    const docRef = doc(firestoreDb, collectionName, validatedItem.id);
    await setDoc(docRef, validatedItem, { merge: true });
  } catch (err: unknown) {
    logDiagnosticError(err, `upsertCollectionDocument(${collectionName}/${validatedItem.id})`);
  }

  return validatedItem;
}

export async function removeCollectionDocument<T extends { readonly id: string }>(
  collectionName: string,
  docId: string,
  listSchema: z.ZodType<T[]>,
  fallbackSeed: readonly T[],
): Promise<void> {
  const currentList = readLocalCache(collectionName, listSchema) ?? [...fallbackSeed];
  const updatedList = currentList.filter((item) => item.id !== docId);
  writeLocalCache(collectionName, updatedList);

  try {
    const docRef = doc(firestoreDb, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err: unknown) {
    logDiagnosticError(err, `removeCollectionDocument(${collectionName}/${docId})`);
  }
}

export async function upsertSingleDocument<T extends object>(
  collectionName: string,
  docId: string,
  data: T,
  schema: z.ZodType<T>,
): Promise<T> {
  const validated = schema.parse(data);
  const cacheKey = `${collectionName}_${docId}`;
  writeLocalCache(cacheKey, validated);

  try {
    const docRef = doc(firestoreDb, collectionName, docId);
    await setDoc(docRef, validated, { merge: true });
  } catch (err: unknown) {
    logDiagnosticError(err, `upsertSingleDocument(${collectionName}/${docId})`);
  }

  return validated;
}

export function clearLocalSeedCache(): void {
  if (typeof window === 'undefined') {
    return;
  }
  const keysToRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(LOCAL_SEED_CACHE_PREFIX)) {
      keysToRemove.push(k);
    }
  }
  for (const k of keysToRemove) {
    window.localStorage.removeItem(k);
  }
}
