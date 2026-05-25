import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { auth } from '../config/firebase';

function getFirebaseAuth() {
  if (!auth) {
    throw new Error('Firebase Authentication is not configured.');
  }

  return auth;
}

export async function registerWithEmail({ name, email, password }) {
  const firebaseAuth = getFirebaseAuth();
  await setPersistence(firebaseAuth, browserLocalPersistence);

  const userCredential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );

  if (name) {
    await updateProfile(userCredential.user, { displayName: name });
  }

  return userCredential.user;
}

export async function loginWithEmail({ email, password }) {
  const firebaseAuth = getFirebaseAuth();
  await setPersistence(firebaseAuth, browserLocalPersistence);

  const userCredential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );

  return userCredential.user;
}

export async function logoutUser() {
  return signOut(getFirebaseAuth());
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}
