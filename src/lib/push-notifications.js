import { getApp } from 'firebase/app';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from 'firebase/messaging';
import { auth, db, observeAuthState } from './firebase';

const SERVICE_WORKER_PATH = '/firebase-messaging-sw.js';
const DEVICE_ID_KEY = 'afterbloom_device_id';

let messagingPromise;
let serviceWorkerPromise;

function canUsePush() {
  return typeof window !== 'undefined'
    && 'Notification' in window
    && 'serviceWorker' in navigator
    && 'PushManager' in window;
}

function getDeviceId() {
  const existing = globalThis.localStorage?.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const randomId = globalThis.crypto?.randomUUID?.()
    || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const deviceId = `device-${randomId}`;
  globalThis.localStorage?.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
}

function getMetadata() {
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    language: globalThis.localStorage?.getItem('afterbloom_lang') || navigator.language || 'en',
    platform: 'web',
    permission: Notification.permission,
  };
}

function waitForAuthenticatedUid() {
  if (auth.currentUser) return Promise.resolve(auth.currentUser.uid);

  return new Promise(resolve => {
    let unsubscribe = () => {};
    unsubscribe = observeAuthState(user => {
      unsubscribe();
      resolve(user?.uid || null);
    });
  });
}

async function getMessagingInstance() {
  if (!canUsePush() || !(await isSupported())) {
    throw new Error('Push notifications are not supported in this browser');
  }

  messagingPromise ||= Promise.resolve(getMessaging(getApp()));
  return messagingPromise;
}

function registerServiceWorker() {
  serviceWorkerPromise ||= navigator.serviceWorker.register(SERVICE_WORKER_PATH);
  return serviceWorkerPromise;
}

export function getPushStatus() {
  if (!import.meta.env.VITE_FIREBASE_VAPID_KEY) {
    return { configured: false, supported: false, permission: 'unconfigured', enabled: false };
  }
  if (!canUsePush()) {
    return { configured: true, supported: false, permission: 'unsupported', enabled: false };
  }

  const permission = Notification.permission;
  return { configured: true, supported: true, permission, enabled: permission === 'granted' };
}

export async function enablePushNotifications() {
  const status = getPushStatus();
  if (!status.supported) return status;

  const uid = await waitForAuthenticatedUid();
  if (!uid) throw new Error('Push notifications require an authenticated user');

  const permission = Notification.permission === 'default'
    ? await Notification.requestPermission()
    : Notification.permission;
  if (permission !== 'granted') {
    return { supported: true, permission, enabled: false };
  }

  const [messaging, registration] = await Promise.all([
    getMessagingInstance(),
    registerServiceWorker(),
  ]);
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  const token = await getToken(messaging, {
    serviceWorkerRegistration: registration,
    ...(vapidKey ? { vapidKey } : {}),
  });
  if (!token) throw new Error('Firebase did not return a push token');

  const deviceId = getDeviceId();
  await setDoc(doc(db, 'mothers', uid, 'devices', deviceId), {
    token,
    enabled: true,
    ...getMetadata(),
    last_seen_at: serverTimestamp(),
  }, { merge: true });

  return { supported: true, permission, enabled: true, deviceId };
}

export async function subscribeToForegroundMessages(callback) {
  if (typeof callback !== 'function') throw new TypeError('callback must be a function');
  return onMessage(await getMessagingInstance(), callback);
}
