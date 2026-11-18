import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { z } from 'zod';
import { logDiagnosticError, normalizeError } from '@/shared/errors';
import { firebaseStorage } from './firebase.config';

const LISTING_MAX_BYTES = 5 * 1024 * 1024;
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

export const imageUploadValidationSchema = z.object({
  name: z.string().min(1),
  size: z.number().max(LISTING_MAX_BYTES, 'Image file must be under 5MB'),
  type: z.enum(ALLOWED_MIME_TYPES),
});

export interface UploadImageResult {
  readonly downloadUrl: string;
  readonly storagePath: string;
  readonly source: 'firebase-storage';
}

export async function uploadImageToFirebaseStorage(
  folder: 'listings' | 'avatars',
  userId: string,
  file: File,
): Promise<UploadImageResult> {
  const maxBytes = folder === 'avatars' ? AVATAR_MAX_BYTES : LISTING_MAX_BYTES;
  const parsed = imageUploadValidationSchema.safeParse({
    name: file.name,
    size: file.size,
    type: file.type,
  });

  if (!parsed.success || file.size >= maxBytes) {
    const err = normalizeError(
      parsed.success ? new Error('Image file exceeds maximum allowed size') : parsed.error,
      'STORAGE_INVALID_FILE',
    );
    logDiagnosticError(err, 'uploadImageToFirebaseStorage:validation');
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
    const normalized = normalizeError(storageError, 'STORAGE_UPLOAD_FAILED');
    logDiagnosticError(storageError, `FirebaseStorageUpload(${folder})`, 'STORAGE_UPLOAD_FAILED');
    throw normalized;
  }
}
