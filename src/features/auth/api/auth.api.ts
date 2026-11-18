import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { studentProfileSchema } from '@/features/profile/api/profile.schema';
import type { StudentProfile } from '@/features/profile/api/profile.types';
import { logDiagnosticError, normalizeError } from '@/shared/errors';
import { firebaseAuth, upsertUserDocument } from '@/shared/firebase';
import { isCampusEmail, resolveDisplayName } from '@/shared/utils/user';
import {
  authSessionSummarySchema,
  studentRegisterSchema,
  studentSignInSchema,
} from './auth.schema';
import type {
  AuthSessionSummary,
  StudentRegisterCredentials,
  StudentSignInCredentials,
} from './auth.types';

export function buildSessionSummary(user: User): AuthSessionSummary | null {
  if (!user.email) {
    return null;
  }
  const email = user.email.toLowerCase();
  return {
    uid: user.uid,
    email,
    fullName: resolveDisplayName({ displayName: user.displayName, email }, 'Verified Student'),
    verifiedCampusDomain: isCampusEmail(email),
  };
}

export async function signInStudentWithFirebase(
  credentials: StudentSignInCredentials,
): Promise<AuthSessionSummary> {
  const validated = studentSignInSchema.parse(credentials);

  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      validated.email,
      validated.password,
    );
    const summary = buildSessionSummary(userCredential.user);
    if (!summary) {
      throw new Error('Account email missing from authenticated session');
    }
    return authSessionSummarySchema.parse(summary);
  } catch (err: unknown) {
    logDiagnosticError(err, 'auth.api.signInStudentWithFirebase');
    throw normalizeError(err, 'AUTH_INVALID_CREDENTIALS');
  }
}

export async function registerStudentWithFirebase(
  credentials: StudentRegisterCredentials,
): Promise<AuthSessionSummary> {
  const validated = studentRegisterSchema.parse(credentials);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      validated.email,
      validated.password,
    );
    const user = userCredential.user;
    await updateProfile(user, { displayName: validated.fullName });

    const hasCampusDomain = isCampusEmail(validated.email);
    const newProfile: StudentProfile = {
      id: user.uid,
      fullName: validated.fullName,
      universityEmail: validated.email,
      universityName: hasCampusDomain ? 'Verified Campus Member' : 'Campus Community Member',
      residenceHall: 'Student Center · Main Entrance',
      isVerifiedStudent: hasCampusDomain,
      itemsReusedCount: 0,
      wasteDivertedKg: 0,
      rating: 5.0,
    };

    await upsertUserDocument('users', user.uid, newProfile, studentProfileSchema);

    return authSessionSummarySchema.parse({
      uid: user.uid,
      email: validated.email,
      fullName: validated.fullName,
      verifiedCampusDomain: hasCampusDomain,
    });
  } catch (err: unknown) {
    logDiagnosticError(err, 'auth.api.registerStudentWithFirebase');
    throw normalizeError(err, 'AUTH_INVALID_CREDENTIALS');
  }
}

export async function sendStudentPasswordReset(email: string): Promise<void> {
  const validEmail = studentSignInSchema.shape.email.parse(email);
  try {
    await sendPasswordResetEmail(firebaseAuth, validEmail);
  } catch (err: unknown) {
    logDiagnosticError(err, 'auth.api.sendStudentPasswordReset');
    throw normalizeError(err, 'AUTH_INVALID_CREDENTIALS');
  }
}

export async function signOutStudentFromFirebase(): Promise<void> {
  try {
    if (firebaseAuth.currentUser) {
      await signOut(firebaseAuth);
    }
  } catch (err: unknown) {
    logDiagnosticError(err, 'auth.api.signOutStudentFromFirebase');
    throw normalizeError(err, 'AUTH_UNAUTHORIZED');
  }
}
