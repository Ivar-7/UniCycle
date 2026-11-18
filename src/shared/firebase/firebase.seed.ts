import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import type { z } from 'zod';
import { logDiagnosticError, normalizeError } from '@/shared/errors';
import { readJsonStorage, writeJsonStorage } from '@/shared/utils/storage';
import { firestoreDb } from './firebase.config';

const LOCAL_CACHE_PREFIX = 'unicycle_cache_v5_';

function readLocalCache<T>(key: string, schema: z.ZodType<T>): T | null {
  return readJsonStorage(`${LOCAL_CACHE_PREFIX}${key}`, schema);
}

function writeLocalCache(key: string, data: unknown): void {
  writeJsonStorage(`${LOCAL_CACHE_PREFIX}${key}`, data);
}

function parseSnapshotDocs<T>(
  docs: readonly { readonly id: string; data(): object }[],
  itemSchema: z.ZodType<T>,
): T[] {
  const results: T[] = [];
  for (const docSnap of docs) {
    const parsed = itemSchema.safeParse({ id: docSnap.id, ...docSnap.data() });
    if (parsed.success) {
      results.push(parsed.data);
    }
  }
  return results;
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
      const validDocs = parseSnapshotDocs(snapshot.docs, itemSchema);

      if (validDocs.length > 0) {
        // Merge user-published documents with curated baseline catalogue items
        const byId = new Map<string, T>();
        for (const base of validatedSeed) {
          byId.set(base.id, base);
        }
        for (const remote of validDocs) {
          byId.set(remote.id, remote);
        }
        const merged = Array.from(byId.values());
        writeLocalCache(collectionName, merged);
        return merged;
      }
    }

    return readLocalCache(collectionName, listSchema) ?? validatedSeed;
  } catch (err: unknown) {
    logDiagnosticError(err, `fetchCollectionWithSeed(${collectionName})`, 'FIREBASE_ERROR');
    return readLocalCache(collectionName, listSchema) ?? validatedSeed;
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

    return readLocalCache(cacheKey, schema) ?? validatedSeed;
  } catch (err: unknown) {
    logDiagnosticError(err, `fetchDocumentWithSeed(${collectionName}/${docId})`, 'FIREBASE_ERROR');
    return readLocalCache(cacheKey, schema) ?? validatedSeed;
  }
}

export interface UserCollectionQueryOptions {
  readonly filterField: string;
  readonly filterOp: '==' | 'array-contains';
  readonly userId: string;
  readonly orderByField: string;
}

export async function fetchUserCollection<T extends { readonly id: string }>(
  collectionName: string,
  itemSchema: z.ZodType<T>,
  options: UserCollectionQueryOptions,
): Promise<T[]> {
  try {
    const colRef = collection(firestoreDb, collectionName);
    const q = query(
      colRef,
      where(options.filterField, options.filterOp, options.userId),
      orderBy(options.orderByField, 'desc'),
    );
    const snapshot = await getDocs(q);
    return parseSnapshotDocs(snapshot.docs, itemSchema);
  } catch (err: unknown) {
    logDiagnosticError(err, `fetchUserCollection(${collectionName})`, 'FIREBASE_ERROR');
    throw normalizeError(err, 'FIREBASE_ERROR');
  }
}

export async function upsertUserDocument<T extends object>(
  collectionName: string,
  docId: string,
  data: T,
  schema: z.ZodType<T>,
): Promise<T> {
  const validated = schema.parse(data);
  try {
    const docRef = doc(firestoreDb, collectionName, docId);
    await setDoc(docRef, validated, { merge: true });
    return validated;
  } catch (err: unknown) {
    logDiagnosticError(err, `upsertUserDocument(${collectionName}/${docId})`, 'FIREBASE_ERROR');
    throw normalizeError(err, 'FIREBASE_ERROR');
  }
}

export async function fetchUserDocument<T extends object>(
  collectionName: string,
  docId: string,
  schema: z.ZodType<T>,
): Promise<T | null> {
  try {
    const docRef = doc(firestoreDb, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    const rawData: unknown = { id: docSnap.id, ...docSnap.data() };
    const parsed = schema.safeParse(rawData);
    return parsed.success ? parsed.data : null;
  } catch (err: unknown) {
    logDiagnosticError(err, `fetchUserDocument(${collectionName}/${docId})`, 'FIREBASE_ERROR');
    throw normalizeError(err, 'FIREBASE_ERROR');
  }
}

export async function deleteUserDocument(collectionName: string, docId: string): Promise<void> {
  try {
    const docRef = doc(firestoreDb, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err: unknown) {
    logDiagnosticError(err, `deleteUserDocument(${collectionName}/${docId})`, 'FIREBASE_ERROR');
    throw normalizeError(err, 'FIREBASE_ERROR');
  }
}

export function clearLocalSeedCache(): void {
  if (typeof window === 'undefined') {
    return;
  }
  const keysToRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const k = window.localStorage.key(i);
    if (k && (k.startsWith(LOCAL_CACHE_PREFIX) || k.startsWith('unicycle_firestore_seed_v2_'))) {
      keysToRemove.push(k);
    }
  }
  for (const k of keysToRemove) {
    window.localStorage.removeItem(k);
  }
}
