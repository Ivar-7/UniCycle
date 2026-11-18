import type { User } from 'firebase/auth';
import {
  fetchUserDocument,
  uploadImageToFirebaseStorage,
  upsertUserDocument,
} from '@/shared/firebase';
import { isCampusEmail, resolveDisplayName } from '@/shared/utils/user';
import { studentProfileSchema, updateProfileInputSchema } from './profile.schema';
import type { StudentProfile, UpdateProfileInput } from './profile.types';

export async function fetchStudentProfile(user: User): Promise<StudentProfile> {
  const existing = await fetchUserDocument('users', user.uid, studentProfileSchema);
  if (existing) {
    return existing;
  }

  const email = user.email ?? 'student@university.edu';
  const initialProfile: StudentProfile = {
    id: user.uid,
    fullName: resolveDisplayName({ displayName: user.displayName, email }, 'Campus Student'),
    universityEmail: email,
    universityName: 'Verified Campus Member',
    residenceHall: 'North Hall Residence, Block B',
    isVerifiedStudent: isCampusEmail(email),
    itemsReusedCount: 0,
    wasteDivertedKg: 0,
    rating: 5.0,
    ...(user.photoURL ? { avatarUrl: user.photoURL } : {}),
  };

  return upsertUserDocument('users', user.uid, initialProfile, studentProfileSchema);
}

export async function updateStudentProfile(
  current: StudentProfile,
  userId: string,
  input: UpdateProfileInput,
  avatarFile?: File | null,
): Promise<StudentProfile> {
  const validated = updateProfileInputSchema.parse(input);

  let uploadedAvatarUrl = current.avatarUrl;
  if (avatarFile) {
    const uploadResult = await uploadImageToFirebaseStorage('avatars', userId, avatarFile);
    uploadedAvatarUrl = uploadResult.downloadUrl;
  }

  const updated: StudentProfile = {
    ...current,
    id: userId,
    fullName: validated.fullName,
    residenceHall: validated.residenceHall,
    ...(uploadedAvatarUrl ? { avatarUrl: uploadedAvatarUrl } : {}),
  };

  return upsertUserDocument('users', userId, updated, studentProfileSchema);
}
