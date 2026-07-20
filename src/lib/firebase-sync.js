import {
  doc, collection, setDoc, addDoc, getDoc, onSnapshot, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { getOnboardingData, mergeFirestoreProfile } from './user-data.js';

const pendingSyncs = new Set();

// Helper: safe fire-and-forget
function quietly(fn) {
  const uid = auth.currentUser?.uid;
  if (!uid) return Promise.resolve(false);
  const pending = Promise.resolve()
    .then(() => fn(uid))
    .catch(err => console.warn('[firebase-sync]', err.message))
    .finally(() => pendingSyncs.delete(pending));
  pendingSyncs.add(pending);
  return pending;
}

export async function flushPendingSync(timeoutMs = 3000) {
  if (pendingSyncs.size === 0) return true;

  const completed = Promise.allSettled([...pendingSyncs]).then(() => true);
  const timedOut = new Promise(resolve => setTimeout(() => resolve(false), timeoutMs));
  return Promise.race([completed, timedOut]);
}

const read = (value, ...keys) => keys.map(key => value?.[key]).find(item => item !== undefined);
const has = (value, ...keys) => keys.some(key => value?.[key] !== undefined);
const snakeRecord = (value = {}) => Object.fromEntries(
  Object.entries(value).map(([key, item]) => [key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`), item]),
);

// ─── Profile ────────────────────────────────────────────────────
export function syncProfile(onboardingData) {
  quietly(async (uid) => {
    // Import inside function to avoid circular import
    const { getPostpartumDay, getCurrentStage } = await import('./user-data.js');

    const stage = getCurrentStage();
    const legalName = [onboardingData.legal_first_name, onboardingData.legal_last_name].filter(Boolean).join(' ').trim();
    const preferredName = onboardingData.preferred_name || onboardingData.mother_name || '';
    await setDoc(doc(db, 'mothers', uid), {
      name: preferredName || legalName || onboardingData.mother_name || 'Unknown',
      mother_name: preferredName,
      legal_first_name: onboardingData.legal_first_name || '',
      legal_last_name: onboardingData.legal_last_name || '',
      preferred_name: preferredName,
      phone: onboardingData.phone || '',
      baby_birth_date: onboardingData.baby_birth_date || null,
      delivery_date: onboardingData.baby_birth_date || null,
      is_first_time_mother: onboardingData.is_first_time_mother ?? null,
      preferred_checkin_time: onboardingData.preferred_checkin_time || null,
      postpartum_day: getPostpartumDay(),
      postpartum_stage: onboardingData.baby_birth_date ? (stage?.weekLabel ?? '') : '',
      health_data_consent: onboardingData.health_data_consent === true,
      consent_at: onboardingData.consent_at || null,
      status: 'active',
      assessment_state: 'unassessed',
      risk_level: null,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    }, { merge: true });
  });
}

export async function hydrateProfile() {
  const uid = auth.currentUser?.uid;
  const localProfile = getOnboardingData();
  if (!uid || localProfile.complete === true) return false;
  const snapshot = await getDoc(doc(db, 'mothers', uid));
  if (!snapshot.exists()) return false;
  localStorage.setItem('afterbloom_onboarding', JSON.stringify(mergeFirestoreProfile(snapshot.data(), localProfile)));
  return true;
}

export function subscribeToCheckins(onEntries) {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};

  return onSnapshot(
    collection(db, 'mothers', uid, 'checkins'),
    snapshot => onEntries(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))),
    error => console.warn('[firebase-sync]', error.message),
  );
}

// ─── Check-in ───────────────────────────────────────────────────
export function syncCheckin(entry) {
  quietly(async (uid) => {
    const supportLevel = read(entry, 'supportLevel', 'support_level') ?? 'steady';
    const compositeScore = read(entry, 'compositeScore', 'composite_score', 'composite');
    const problemTagClasses = read(entry, 'problemTagClasses', 'problem_tag_classes', 'problemClasses', 'problem_classes', 'classes') ?? [];
    const babyConnectionScore = read(entry, 'babyConnectionScore', 'baby_connection_score', 'baby_connection') ?? null;
    const riskLevel =
      supportLevel === 'immediate' ? 'high'
      : supportLevel === 'extra' ? 'attention'
      : supportLevel === 'gentle' ? 'attention'
      : 'low';
    // Upsert the daily check-in by dateKey
    const ref = doc(collection(db, 'mothers', uid, 'checkins'), read(entry, 'dateKey', 'date_key'));
    await setDoc(ref, {
      date_key: read(entry, 'dateKey', 'date_key'),
      mood_score: read(entry, 'moodScore', 'mood_score') ?? null,
      sleep_score: read(entry, 'sleepScore', 'sleep_score') ?? null,
      energy_score: read(entry, 'energyScore', 'energy_score') ?? null,
      worry_score: read(entry, 'worryScore', 'worry_score', 'worryScoreRaw', 'worry_score_raw') ?? null,
      composite_score: compositeScore ?? null,
      support_level: supportLevel,
      problem_tags: read(entry, 'problemTags', 'problem_tags', 'tags') ?? [],
      problem_tag_classes: problemTagClasses,
      problem_other_text: read(entry, 'problemOtherText', 'problem_other_text') ?? '',
      journal_entry: read(entry, 'journalEntry', 'journal_entry', 'journal', 'note') ?? '',
      baby_connection_score: babyConnectionScore,
      risk_level: riskLevel,
      ...(has(entry, 'selectedTinyGoal', 'selected_tiny_goal', 'selectedGoal', 'selected_goal') ? {
        selected_tiny_goal: read(entry, 'selectedTinyGoal', 'selected_tiny_goal', 'selectedGoal', 'selected_goal'),
      } : {}),
      created_at: serverTimestamp(),
    }, { merge: true });

    // Update mother doc with latest support level + timestamp
    await setDoc(doc(db, 'mothers', uid), {
      assessment_state: 'assessed',
      risk_level: riskLevel,
      support_level: supportLevel,
      last_check_in: serverTimestamp(),
      updated_at: serverTimestamp(),
    }, { merge: true });
  });
}

// ─── EPDS ───────────────────────────────────────────────────────
export function syncEpds(entry) {
  quietly(async (uid) => {
    await addDoc(collection(db, 'mothers', uid, 'epds_scores'), {
      total_score: read(entry, 'totalScore', 'total_score'),
      q10_flag: read(entry, 'q10Flag', 'q10_flag') ?? false,
      support_level: read(entry, 'supportLevel', 'support_level') ?? 'steady',
      answers: entry.answers ?? [],
      screening_date: read(entry, 'screeningDate', 'screening_date', 'dateKey', 'date_key') ?? '',
      screening_trigger: read(entry, 'screeningTrigger', 'screening_trigger') ?? 'manual',
      checkpoint_day: read(entry, 'checkpointDay', 'checkpoint_day') ?? null,
      trigger_date: read(entry, 'triggerDate', 'trigger_date') ?? null,
      episode_id: read(entry, 'episodeId', 'episode_id') ?? null,
      created_at: serverTimestamp(),
    });

    // Update mother's risk level from EPDS result
    const supportLevel = read(entry, 'supportLevel', 'support_level') ?? 'steady';
    const q10Flag = read(entry, 'q10Flag', 'q10_flag') === true;
    const riskLevel =
      supportLevel === 'immediate' ? 'high'
      : supportLevel === 'extra' ? 'attention'
      : supportLevel === 'gentle' ? 'attention'
      : 'low';

    await setDoc(doc(db, 'mothers', uid), {
      assessment_state: 'assessed',
      risk_level: riskLevel,
      support_level: supportLevel,
      epds_score: read(entry, 'totalScore', 'total_score'),
      epds_date: read(entry, 'screeningDate', 'screening_date'),
      q10_flag: q10Flag,
      updated_at: serverTimestamp(),
    }, { merge: true });
  });
}

// ─── Safety Access Log ───────────────────────────────────────────
export function syncSafetyAccess(meta = {}) {
  quietly(async (uid) => {
    if (!uid) return;
    const action = read(meta, 'action', 'path', 'source') || 'help';
    const safetyPath = String(action).toLowerCase();
    const urgent = ['urgent', 'unsafe', 'urgent_help', 'unsafe_now'].includes(safetyPath);
    await addDoc(collection(db, 'mothers', uid, 'safety_log'), {
      timestamp: serverTimestamp(),
      date_key: new Date().toISOString().slice(0, 10),
      ...snakeRecord(meta),
      action: safetyPath,
      safety_access_used: true,
      ...(urgent ? { urgent_safety: true } : {}),
      created_at: serverTimestamp(),
    });
    const motherUpdate = {
      safety_access_used: true,
      last_safety_access: serverTimestamp(),
      updated_at: serverTimestamp(),
      ...(urgent ? { urgent_safety: true } : {}),
    };
    await setDoc(doc(db, 'mothers', uid), motherUpdate, { merge: true });
  });
}

// ─── Journal Entry ───────────────────────────────────────────────
export function syncJournalEntry(entry) {
  quietly(async (uid) => {
    if (!uid) return;
    const ref = doc(collection(db, 'mothers', uid, 'journal'), entry.dateKey || entry.id || new Date().toISOString().slice(0, 10));
    await setDoc(ref, {
      ...snakeRecord(entry),
      updated_at: serverTimestamp(),
    }, { merge: true });
  });
}

export function syncTinyGoal(selectedTinyGoal, status = 'active', dateKey = new Date().toISOString().slice(0, 10)) {
  quietly(async (uid) => {
    if (!uid) return;
    await setDoc(doc(db, 'mothers', uid), {
      selected_tiny_goal: selectedTinyGoal,
      tiny_goal_status: status,
      tiny_goal_date: dateKey,
      updated_at: serverTimestamp(),
    }, { merge: true });
  });
}
