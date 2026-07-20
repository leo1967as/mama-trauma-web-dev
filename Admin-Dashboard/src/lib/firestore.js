import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Support level (dual-read: old docs only have riskLevel) ──
export const RISK_TO_SUPPORT_LEVEL = { low: 'steady', attention: 'extra', high: 'immediate', critical: 'immediate' };
export function resolveSupportLevel(data) {
  return data?.supportLevel ?? data?.support_level ?? RISK_TO_SUPPORT_LEVEL[data?.riskLevel ?? data?.risk_level] ?? 'steady';
}

const read = (data, camel, snake) => data?.[camel] ?? data?.[snake];
const timestampMs = value => toDate(value)?.getTime() || 0;
const sortByTime = (items, camel, snake) => items.sort((a, b) => timestampMs(read(b, camel, snake)) - timestampMs(read(a, camel, snake)));

// ─── Collections ───────────────────────────────────────────────
const MOTHERS = 'mothers';
const checkins = (motherId) => collection(db, MOTHERS, motherId, 'checkins');
const epdsScores = (motherId) => collection(db, MOTHERS, motherId, 'epds_scores');
const caseNotes = (motherId) => collection(db, MOTHERS, motherId, 'case_notes');
const safetyEvents = (motherId) => collection(db, MOTHERS, motherId, 'safety_log');
const READ_ONLY_ERROR = 'Admin Dashboard is read-only; mutations are disabled.';
const readOnlyMutation = () => { throw new Error(READ_ONLY_ERROR); };

// ─── Mothers ───────────────────────────────────────────────────

export async function getMothers(filters = {}) {
  const snap = await getDocs(collection(db, MOTHERS));
  return sortByTime(snap.docs.map(d => ({ id: d.id, ...d.data() })), 'updatedAt', 'updated_at')
    .filter(mother => !filters.supportLevel || resolveSupportLevel(mother) === filters.supportLevel)
    .filter(mother => !filters.status || mother.status === filters.status);
}

export async function getMother(id) {
  const snap = await getDoc(doc(db, MOTHERS, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateMother() { readOnlyMutation(); }

// Real-time listener — returns unsubscribe fn
export function subscribeMothers(callback) {
  return onSnapshot(collection(db, MOTHERS), snap => {
    callback(sortByTime(snap.docs.map(d => ({ id: d.id, ...d.data() })), 'updatedAt', 'updated_at'));
  });
}

// ─── Case status ───────────────────────────────────────────────
// status: 'none' | 'new' | 'reviewed' | 'contacted' | 'referred' | 'resolved'

export async function updateCaseStatus() { readOnlyMutation(); }

export async function scheduleFollowUp() { readOnlyMutation(); }

// ─── Check-ins ─────────────────────────────────────────────────

export async function getCheckins(motherId, limitCount = 14) {
  const snap = await getDocs(checkins(motherId));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => String(read(b, 'dateKey', 'date_key') || '').localeCompare(String(read(a, 'dateKey', 'date_key') || '')))
    .slice(0, limitCount);
}

export async function addCheckin() { readOnlyMutation(); }

// ─── EPDS Scores ───────────────────────────────────────────────

export async function getEpdsScores(motherId) {
  const snap = await getDocs(epdsScores(motherId));
  return sortByTime(snap.docs.map(d => ({ id: d.id, ...d.data() })), 'createdAt', 'created_at').slice(0, 5);
}

export async function getSafetyEvents(motherId) {
  const snap = await getDocs(safetyEvents(motherId));
  return sortByTime(snap.docs.map(d => ({ id: d.id, ...d.data() })), 'createdAt', 'created_at').slice(0, 10);
}

export async function addEpdsScore() { readOnlyMutation(); }

// ─── Case Notes ────────────────────────────────────────────────

export async function getCaseNotes(motherId) {
  const q = query(caseNotes(motherId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeCaseNotes(motherId, callback) {
  const q = query(caseNotes(motherId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function addCaseNote() { readOnlyMutation(); }

// ─── Dashboard stats (derived) ────────────────────────────────

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === 'function') return value.toDate(); // Firestore Timestamp
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export async function getDashboardStats() {
  const snap = await getDocs(collection(db, MOTHERS));
  const all = snap.docs.map(d => d.data());
  const today = new Date().toDateString();
  return {
    totalMothers: all.length,
    checkedIn: all.filter(m => toDate(read(m, 'lastCheckIn', 'last_check_in'))?.toDateString() === today).length,
    atRisk: all.filter(m => resolveSupportLevel(m) === 'extra').length,
    highRisk: all.filter(m => resolveSupportLevel(m) === 'immediate').length,
  };
}
