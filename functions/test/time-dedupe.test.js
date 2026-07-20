import assert from 'node:assert/strict';
import test from 'node:test';
import { deliveryKey, shouldClaimDelivery } from '../src/dedupe.js';
import { getLocalDateKey, isReminderDue, parseTime } from '../src/time.js';

test('parses valid check-in times and rejects malformed values', () => {
  assert.equal(parseTime('09:30'), 570);
  assert.equal(parseTime('23:59'), 1439);
  assert.equal(parseTime('9:30'), null);
  assert.equal(parseTime('24:00'), null);
});

test('uses the profile timezone for due checks and local date keys', () => {
  const now = new Date('2026-07-15T02:00:00.000Z');
  assert.equal(isReminderDue(now, '09:00', 'Asia/Bangkok'), true);
  assert.equal(isReminderDue(new Date(now.getTime() - 60_000), '09:00', 'Asia/Bangkok'), false);
  assert.equal(getLocalDateKey(now, 'Asia/Bangkok'), '2026-07-15');
  assert.equal(isReminderDue(now, '09:00', 'not/a-timezone'), false);
});

test('claims only unclaimed or expired deliveries', () => {
  assert.equal(shouldClaimDelivery(null, 1_000, 600_000), true);
  assert.equal(shouldClaimDelivery({ status: 'sent' }, 1_000, 600_000), false);
  assert.equal(shouldClaimDelivery({ status: 'sending', lease_until: 601_000 }, 1_000, 600_000), false);
  assert.equal(shouldClaimDelivery({ status: 'sending', lease_until: 1_000 }, 1_001, 600_000), true);
  assert.equal(deliveryKey('daily-reminder', 'mother/1', '2026-07-15'), 'daily-reminder__mother%2F1__2026-07-15');
});
