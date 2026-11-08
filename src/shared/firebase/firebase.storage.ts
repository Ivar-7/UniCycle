import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { z } from 'zod';
import { logDiagnosticError, normalizeError } from '@/shared/errors';
import { firebaseStorage } from './firebase.config';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

export const imageUploadValidationSchema = z.object({
  name: z.string().min(1),
  size: z.number().max(MAX_FILE_SIZE_BYTES, 'Image file must be under 5MB'),
  type: z.enum(ALLOWED_MIME_TYPES),
});

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export interface UploadImageResult {
  readonly downloadUrl: string;
  readonly storagePath: string;
  readonly source: 'firebase-storage' | 'local-preview';
}

export async function uploadImageToFirebaseStorage(
  folder: 'listings' | 'avatars',
  userId: string,
  file: File,
): Promise<UploadImageResult> {
  const parsed = imageUploadValidationSchema.safeParse({
    name: file.name,
    size: file.size,
    type: file.type,
  });

  if (!parsed.success) {
    const err = normalizeError(parsed.error, 'STORAGE_INVALID_FILE');
    logDiagnosticError(parsed.error, 'uploadImageToFirebaseStorage:validation');
    throw err;
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${folder}/${userId}/${Date.now()}_${sanitizedName}`;

  try {
    const storageRef = ref(firebaseStorage, storagePath);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
    });
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return {
      downloadUrl,
      storagePath,
      source: 'firebase-storage',
    };
  } catch (storageError: unknown) {
    logDiagnosticError(storageError, `FirebaseStorageUpload(${folder})`, 'STORAGE_UPLOAD_FAILED');
    const fallbackUrl = await readFileAsDataUrl(file);
    return {
      downloadUrl: fallbackUrl,
      storagePath,
      source: 'local-preview',
    };
  }
}
