import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { deliveryKey } from './dedupe.js';
import { getLocalDateKey, isReminderDue } from './time.js';
import {
  getDeviceRegistrations,
  notifyDevices,
  dailyReminderMessage,
  caseResolutionMessage,
  MOTHERS_COLLECTION,
} from './notifications.js';

initializeApp();
const db = getFirestore();
const messaging = getMessaging();

const read = (data, ...keys) => keys.map(key => data?.[key]).find(value => value !== undefined);

export const dailyCheckinReminders = onSchedule({
  schedule: 'every 5 minutes',
  timeZone: 'UTC',
  retryCount: 3,
  maxInstances: 1,
}, async () => {
  const now = new Date();
  const mothers = await db.collection(MOTHERS_COLLECTION).get();

  for (const mother of mothers.docs) {
    const profile = mother.data();
    const preferredTime = read(profile, 'preferred_checkin_time', 'preferredCheckinTime');
    const devices = await getDeviceRegistrations(db, mother.id);
    const dueDevices = devices.filter(device => {
      const timeZone = device.timezone || profile.timezone;
      return isReminderDue(now, device.preferred_checkin_time || preferredTime, timeZone);
    });

    for (const device of dueDevices) {
      const timeZone = device.timezone || profile.timezone;
      const dateKey = getLocalDateKey(now, timeZone);
      await notifyDevices({
        db,
        messaging,
        devices: [device],
        keyPrefix: deliveryKey('daily-reminder', mother.id, dateKey),
        type: 'daily-checkin-reminder',
        message: dailyReminderMessage(),
      });
    }
  }
});

export const caseResolutionNotification = onDocumentUpdated({
  document: `${MOTHERS_COLLECTION}/{motherId}`,
  retry: true,
}, async event => {
  const before = event.data?.before?.data();
  const after = event.data?.after?.data();
  if (!after) return;

  const wasResolved = read(before, 'case_status', 'caseStatus') === 'resolved';
  const isResolved = read(after, 'case_status', 'caseStatus') === 'resolved';
  if (wasResolved || !isResolved) return;

  const devices = await getDeviceRegistrations(db, event.params.motherId);
  if (devices.length === 0) return;

  await notifyDevices({
    db,
    messaging,
    devices,
    keyPrefix: deliveryKey('case-resolution', event.params.motherId, event.id || read(after, 'case_closed_at', 'caseClosedAt') || event.time),
    type: 'case-resolution',
    message: caseResolutionMessage(),
  });
});
