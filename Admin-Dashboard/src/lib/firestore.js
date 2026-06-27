import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Collections ───────────────────────────────────────────────
const MOTHERS = 'mothers';
const checkins = (motherId) => collection(db, MOTHERS, motherId, 'checkins');
const epdsScores = (motherId) => collection(db, MOTHERS, motherId, 'epds_scores');
const caseNotes = (motherId) => collection(db, MOTHERS, motherId, 'case_notes');

// ─── Mothers ───────────────────────────────────────────────────

export async function getMothers(filters = {}) {
  let q = collection(db, MOTHERS);
  const constraints = [];
  if (filters.riskLevel) constraints.push(where('riskLevel', '==', filters.riskLevel));
  if (filters.status)    constraints.push(where('status', '==', filters.status));
  constraints.push(orderBy('updatedAt', 'desc'));
  if (constraints.length) q = query(q, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getMother(id) {
  const snap = await getDoc(doc(db, MOTHERS, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateMother(id, patch) {
  await updateDoc(doc(db, MOTHERS, id), { ...patch, updatedAt: serverTimestamp() });
}

// Real-time listener — returns unsubscribe fn
export function subscribeMothers(callback) {
  const q = query(collection(db, MOTHERS), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─── Case status ───────────────────────────────────────────────
// status: 'new' | 'reviewed' | 'contacted' | 'referred' | 'resolved'

export async function updateCaseStatus(motherId, status, staffName, note = '') {
  await updateDoc(doc(db, MOTHERS, motherId), {
    caseStatus: status,
    updatedAt: serverTimestamp(),
  });
  await addDoc(caseNotes(motherId), {
    action: status,
    staffName,
    note,
    createdAt: serverTimestamp(),
  });
}

// ─── Check-ins ─────────────────────────────────────────────────

export async function getCheckins(motherId, limitCount = 14) {
  const q = query(checkins(motherId), orderBy('dateKey', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addCheckin(motherId, data) {
  const ref = await addDoc(checkins(motherId), { ...data, createdAt: serverTimestamp() });
  // Update mother's risk + last check-in timestamp
  await updateDoc(doc(db, MOTHERS, motherId), {
    lastCheckIn: serverTimestamp(),
    riskLevel: data.riskLevel ?? 'low',
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── EPDS Scores ───────────────────────────────────────────────

export async function getEpdsScores(motherId) {
  const q = query(epdsScores(motherId), orderBy('createdAt', 'desc'), limit(5));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addEpdsScore(motherId, data) {
  return addDoc(epdsScores(motherId), { ...data, createdAt: serverTimestamp() });
}

// ─── Case Notes ────────────────────────────────────────────────

export async function getCaseNotes(motherId) {
  const q = query(caseNotes(motherId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addCaseNote(motherId, staffName, note) {
  return addDoc(caseNotes(motherId), {
    action: 'note',
    staffName,
    note,
    createdAt: serverTimestamp(),
  });
}

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
    checkedIn: all.filter(m => toDate(m.lastCheckIn)?.toDateString() === today).length,
    atRisk: all.filter(m => m.riskLevel === 'attention').length,
    highRisk: all.filter(m => m.riskLevel === 'high' || m.riskLevel === 'critical').length,
    needHelp: all.filter(m => m.supportRequest === true).length,
  };
}
