import { Timestamp } from 'firebase-admin/firestore';
import { deliveryKey, shouldClaimDelivery } from './dedupe.js';

export const MOTHERS_COLLECTION = 'mothers';
export const DEVICES_COLLECTION = 'devices';
export const DELIVERY_COLLECTION = 'notification_deliveries';
export const DELIVERY_LEASE_MS = 10 * 60 * 1000;

const read = (data, ...keys) => keys.map(key => data?.[key]).find(value => value !== undefined);

export function getDeviceToken(device) {
  return read(device, 'token', 'fcm_token', 'registration_token') || null;
}

export function isDeviceEnabled(device) {
  return device.enabled !== false && device.active !== false && device.revoked !== true;
}

export function dailyReminderMessage() {
  return {
    title: 'Daily check-in',
    body: 'Take a moment to check in with yourself.',
  };
}

export function caseResolutionMessage() {
  return {
    title: 'Support update',
    body: 'Your care team has updated your support case.',
  };
}

export async function getDeviceRegistrations(db, motherId) {
  const snapshot = await db
    .collection(MOTHERS_COLLECTION)
    .doc(motherId)
    .collection(DEVICES_COLLECTION)
    .get();

  return snapshot.docs
    .map(doc => ({ id: doc.id, ref: doc.ref, ...doc.data() }))
    .filter(device => isDeviceEnabled(device) && getDeviceToken(device));
}

export async function deliverOnce({ db, messaging, key, token, message, type, logger = console }) {
  const ref = db.collection(DELIVERY_COLLECTION).doc(key);
  const nowMs = Date.now();
  const claimed = await db.runTransaction(async transaction => {
    const snapshot = await transaction.get(ref);
    if (!shouldClaimDelivery(snapshot.exists ? snapshot.data() : null, nowMs, DELIVERY_LEASE_MS)) {
      return false;
    }

    transaction.set(ref, {
      type,
      status: 'sending',
      lease_until: Timestamp.fromMillis(nowMs + DELIVERY_LEASE_MS),
      updated_at: Timestamp.fromMillis(nowMs),
    }, { merge: true });
    return true;
  });

  if (!claimed) return { sent: false, deduped: true };

  // ponytail: Firestore claim and FCM send cannot be atomic; the lease blocks concurrent duplicates.
  try {
    await messaging.send({
      token,
      notification: message,
      data: { notification_type: type },
    });
    await ref.set({
      status: 'sent',
      sent_at: Timestamp.now(),
      lease_until: null,
      updated_at: Timestamp.now(),
    }, { merge: true });
    return { sent: true, deduped: false };
  } catch (error) {
    await ref.set({
      status: 'failed',
      error_code: error?.code || 'unknown',
      failed_at: Timestamp.now(),
      lease_until: null,
      updated_at: Timestamp.now(),
    }, { merge: true });
    logger.error('[notifications] delivery failed', error);
    throw error;
  }
}

function isInvalidTokenError(error) {
  return [
    'messaging/registration-token-not-registered',
    'messaging/invalid-registration-token',
  ].includes(error?.code);
}

export async function notifyDevices({ db, messaging, devices, keyPrefix, type, message, logger = console }) {
  const failures = [];
  const results = [];

  for (const device of devices) {
    const key = deliveryKey(keyPrefix, device.id);
    try {
      results.push(await deliverOnce({
        db,
        messaging,
        key,
        token: getDeviceToken(device),
        message,
        type,
        logger,
      }));
    } catch (error) {
      if (isInvalidTokenError(error)) {
        await device.ref.delete();
        results.push({ sent: false, removed: true });
      } else {
        failures.push({ deviceId: device.id, error });
      }
    }
  }

  if (failures.length > 0) {
    const error = new Error(`Failed to deliver ${failures.length} notification(s)`);
    error.failures = failures;
    throw error;
  }
  return { results, attempted: devices.length };
}
