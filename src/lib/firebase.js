import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDFYjRw5IyRHE5XS7EmMRo_jHhfKKNKGNY',
  authDomain: 'afterbloom-18d15.firebaseapp.com',
  projectId: 'afterbloom-18d15',
  storageBucket: 'afterbloom-18d15.firebasestorage.app',
  messagingSenderId: '442426425962',
  appId: '1:442426425962:web:4782a5c31e31798d654013',
  measurementId: 'G-D84WF565GJ',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

const DEVICE_ID_KEY = 'afterbloom_device_id';

function getDeviceId() {
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;
  const randomId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const deviceId = `device-${randomId}`;
  localStorage.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
}

function waitForRestoredUser() {
  return new Promise((resolve) => {
    let unsubscribe = () => {};
    unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      () => {
        unsubscribe();
        resolve(null);
      },
    );
  });
}

// Prefer a restored/Google account. Guests use a stable prototype device ID;
// do not call anonymous signup because that provider is intentionally disabled.
export async function getUid() {
  const restoredUser = auth.currentUser || await waitForRestoredUser();
  if (restoredUser) return restoredUser.uid;
  return getDeviceId();
}
