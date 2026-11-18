export { firebaseAuth, firebaseStorage, firestoreDb } from './firebase.config';
export {
  clearLocalSeedCache,
  deleteUserDocument,
  fetchCollectionWithSeed,
  fetchDocumentWithSeed,
  fetchUserCollection,
  fetchUserDocument,
  upsertUserDocument,
  type UserCollectionQueryOptions,
} from './firebase.seed';
export {
  imageUploadValidationSchema,
  uploadImageToFirebaseStorage,
  type UploadImageResult,
} from './firebase.storage';
