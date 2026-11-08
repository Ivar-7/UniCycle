import {
  fetchDocumentWithSeed,
  firebaseAuth,
  uploadImageToFirebaseStorage,
  upsertSingleDocument,
} from '@/shared/firebase';
import { studentProfileSchema, updateProfileInputSchema } from './profile.schema';
import type { StudentProfile, UpdateProfileInput } from './profile.types';

export const SEED_PROFILE: StudentProfile = {
  id: 'stu-001',
  fullName: 'Alex Rivera',
  universityEmail: 'a.rivera@university.ac.uk',
  universityName: 'Central Tech University',
  residenceHall: 'North Hall Residence, Block B',
  isVerifiedStudent: true,
  itemsReusedCount: 14,
  wasteDivertedKg: 38.5,
  rating: 4.9,
};

function getActiveProfileDocId(): string {
  return firebaseAuth.currentUser?.uid ?? SEED_PROFILE.id;
}

export async function fetchStudentProfile(): Promise<StudentProfile> {
  const docId = getActiveProfileDocId();
  const currentUser = firebaseAuth.currentUser;
  const seedForUser: StudentProfile = currentUser
    ? {
        ...SEED_PROFILE,
        id: currentUser.uid,
        fullName: currentUser.displayName ?? SEED_PROFILE.fullName,
        universityEmail: currentUser.email ?? SEED_PROFILE.universityEmail,
      }
    : SEED_PROFILE;

  return fetchDocumentWithSeed('users', docId, studentProfileSchema, seedForUser);
}

export async function updateStudentProfile(
  current: StudentProfile,
  input: UpdateProfileInput,
  avatarFile?: File | null,
): Promise<StudentProfile> {
  const validated = updateProfileInputSchema.parse(input);
  const docId = getActiveProfileDocId();

  let uploadedAvatarUrl = current.avatarUrl;
  if (avatarFile) {
    const uploadResult = await uploadImageToFirebaseStorage('avatars', docId, avatarFile);
    uploadedAvatarUrl = uploadResult.downloadUrl;
  }

  const updated: StudentProfile = {
    ...current,
    id: docId,
    fullName: validated.fullName,
    residenceHall: validated.residenceHall,
    ...(uploadedAvatarUrl ? { avatarUrl: uploadedAvatarUrl } : {}),
  };

  return upsertSingleDocument('users', docId, updated, studentProfileSchema);
}
