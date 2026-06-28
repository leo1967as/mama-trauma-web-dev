import {
  doc, collection, setDoc, addDoc, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { db, getUid } from './firebase';

// Helper: safe fire-and-forget
function quietly(fn) {
  fn().catch(err => console.warn('[firebase-sync]', err.message));
}

// ─── Profile ────────────────────────────────────────────────────
export function syncProfile(onboardingData) {
  quietly(async () => {
    // Import inside function to avoid circular import
    const { getDaysSinceBirth, getCurrentStage } = await import('./user-data.js');

    const uid = await getUid();
    const stage = getCurrentStage();
    const legalName = [onboardingData.legal_first_name, onboardingData.legal_last_name].filter(Boolean).join(' ').trim();
    const preferredName = onboardingData.preferred_name || onboardingData.mother_name || '';
    await setDoc(doc(db, 'mothers', uid), {
      name: preferredName || legalName || onboardingData.mother_name || 'Unknown',
      legalFirstName: onboardingData.legal_first_name || '',
      legalLastName: onboardingData.legal_last_name || '',
      preferredName,
      phone: onboardingData.phone || '',
      deliveryDate: onboardingData.baby_birth_date || null,
      postpartumDay: getDaysSinceBirth(),
      postpartumStage: onboardingData.baby_birth_date ? (stage?.weekLabel ?? '') : '',
      status: 'active',
      assessmentState: 'unassessed',
      caseStatus: 'none',
      caseSource: 'none',
      riskLevel: null,
      supportRequest: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });
}

// ─── Check-in ───────────────────────────────────────────────────
export function syncCheckin(entry) {
  quietly(async () => {
    const uid = await getUid();
    const riskLevel =
      entry.supportLevel === 'immediate' ? 'high'
      : entry.supportLevel === 'extra' ? 'attention'
      : 'low';
    const needsReview = riskLevel !== 'low' || entry.supportRequest === true;

    // Upsert the daily check-in by dateKey
    const ref = doc(collection(db, 'mothers', uid, 'checkins'), entry.dateKey);
    await setDoc(ref, {
      dateKey: entry.dateKey,
      moodScore: entry.moodScore ?? null,
      sleepScore: entry.sleepScore ?? null,
      energyScore: entry.energyScore ?? null,
      worryScore: entry.worryScore ?? null,
      composite: entry.composite ?? null,
      supportLevel: entry.supportLevel ?? 'steady',
      supportRequest: entry.supportRequest ?? false,
      problemTags: entry.problemTags ?? [],
      journalEntry: entry.journalEntry ?? '',
      babyConnectionScore: entry.babyConnectionScore ?? null,
      riskLevel,
      createdAt: serverTimestamp(),
    }, { merge: true });

    // Update mother doc with latest risk + timestamp
    await setDoc(doc(db, 'mothers', uid), {
      assessmentState: 'assessed',
      riskLevel,
      lastCheckIn: serverTimestamp(),
      supportRequest: entry.supportRequest ?? false,
      ...(needsReview ? {
        caseStatus: 'new',
        caseSource: 'clinical',
        alertReason: entry.supportRequest === true ? 'support_request' : 'checkin_support_level',
        alertOpenedAt: serverTimestamp(),
      } : {}),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });
}

// ─── EPDS ───────────────────────────────────────────────────────
export function syncEpds(entry) {
  quietly(async () => {
    const uid = await getUid();
    await addDoc(collection(db, 'mothers', uid, 'epds_scores'), {
      totalScore: entry.totalScore,
      q10Flag: entry.q10Flag ?? false,
      supportLevel: entry.supportLevel ?? 'steady',
      answers: entry.answers ?? [],
      screeningDate: entry.screeningDate ?? entry.dateKey ?? '',
      screeningTrigger: entry.screeningTrigger ?? 'manual',
      createdAt: serverTimestamp(),
    });

    // Update mother's risk level from EPDS result
    const riskLevel =
      entry.supportLevel === 'immediate' ? 'high'
      : entry.supportLevel === 'extra' ? 'attention'
      : entry.supportLevel === 'gentle' ? 'attention'
      : 'low';

    await setDoc(doc(db, 'mothers', uid), {
      assessmentState: 'assessed',
      riskLevel,
      epdsScore: entry.totalScore,
      epdsDate: entry.screeningDate,
      q10Flag: entry.q10Flag ?? false,
      ...(riskLevel !== 'low' || entry.q10Flag === true ? {
        caseStatus: 'new',
        caseSource: 'clinical',
        alertReason: entry.q10Flag === true ? 'epds_q10' : 'epds_score',
        alertOpenedAt: serverTimestamp(),
      } : {}),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });
}

// ─── Safety Access Log ───────────────────────────────────────────
export function syncSafetyAccess(meta = {}) {
  quietly(async () => {
    const uid = await getUid();
    if (!uid) return;
    const safetyPath = meta.path || meta.action || meta.source || 'help';
    await addDoc(collection(db, 'mothers', uid, 'safety_log'), {
      ts: new Date().toISOString(),
      dateKey: new Date().toISOString().slice(0, 10),
      ...meta,
      path: safetyPath,
      createdAt: serverTimestamp(),
    });
    // Flag on mother document
    await setDoc(doc(db, 'mothers', uid), {
      assessmentState: 'assessed',
      supportRequest: true,
      caseStatus: 'new',
      caseSource: 'clinical',
      alertReason: safetyPath === 'urgent' ? 'urgent_safety_access' : 'safety_access',
      alertOpenedAt: serverTimestamp(),
      lastSafetyAccess: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });
}

// ─── Journal Entry ───────────────────────────────────────────────
export function syncJournalEntry(entry) {
  quietly(async () => {
    const uid = await getUid();
    if (!uid) return;
    const ref = doc(collection(db, 'mothers', uid, 'journal'), entry.dateKey || entry.id || new Date().toISOString().slice(0, 10));
    await setDoc(ref, {
      ...entry,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });
}
