import { syncEpds } from './firebase-sync';
import { getPostpartumDay, getOnboardingData } from './user-data';
import { getMoodHistory, hasUrgentSafetyAccess } from './mood-data';

const STORAGE_KEY = "afterbloom_epds_history";
const EPDS_EVENT = "afterbloom:epds-history-updated";

const REVERSE_INDICES = new Set([2, 4, 5, 6, 7, 8, 9]);
export const EPDS_CHECKPOINTS = [8, 22, 181];
const LEGACY_CHECKPOINT_ALIASES = { 14: 8, 42: 22, 270: 181 };

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function toDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function computeEpdsScore(answers) {
  return answers.reduce((sum, raw, idx) => {
    const scored = REVERSE_INDICES.has(idx) ? 3 - raw : raw;
    return sum + scored;
  }, 0);
}

export function getEpdsSupportLevel(score, q10Flag = false) {
  if (q10Flag || score >= 13) return "immediate";
  if (score >= 10) return "extra";
  if (score >= 8) return "gentle";
  return "steady";
}

export function getEpdsRiskLevel(score, q10Flag = false) {
  return getEpdsSupportLevel(score, q10Flag);
}

const read = (value, ...keys) => keys.map(key => value?.[key]).find(item => item !== undefined);

export function getEpdsCheckpoint(days = getPostpartumDay()) {
  if (!Number.isFinite(days)) return null;
  return [...EPDS_CHECKPOINTS].reverse().find(checkpoint => checkpoint <= days) ?? null;
}

function getPendingCheckpoint(history, days = getPostpartumDay()) {
  if (!Number.isFinite(days)) return null;
  const checkpoint = getEpdsCheckpoint(days);
  if (checkpoint === null) return null;
  const completed = history.some(entry => {
    const day = read(entry, 'checkpointDay', 'checkpoint_day');
    return (LEGACY_CHECKPOINT_ALIASES[day] ?? day) === checkpoint;
  });
  return completed ? null : checkpoint;
}

function getEpisodeId() {
  const data = getOnboardingData();
  return read(data, 'epdsEpisodeId', 'epds_episode_id', 'episodeId', 'episode_id') || 'default';
}

function consecutiveDays(entries, predicate, dateKey) {
  const byDate = new Map(entries.map(entry => [read(entry, 'dateKey', 'date_key'), entry]));
  const end = new Date(`${dateKey}T00:00:00`);
  for (let offset = 0; offset < 3; offset += 1) {
    const day = new Date(end);
    day.setDate(end.getDate() - offset);
    const key = toDateKey(day);
    if (!predicate(byDate.get(key))) return false;
  }
  return true;
}

export function getEpdsTrigger(dateKey = toDateKey()) {
  if (hasUrgentSafetyAccess(dateKey)) return 'urgent_unsafe';
  const entries = getMoodHistory();
  const current = entries.find(entry => read(entry, 'dateKey', 'date_key') === dateKey);
  if (!current) return null;
  const level = read(current, 'supportLevel', 'support_level');
  if (level === 'extra') return 'support_level_extra';
  if (consecutiveDays(entries, entry => read(entry, 'moodScore', 'mood_score') <= 2, dateKey)) return 'mood_low_3d';
  if (consecutiveDays(entries, entry => (read(entry, 'worryScoreRaw', 'worry_score_raw', 'worryScore', 'worry_score') ?? 0) >= 4, dateKey)) return 'worry_high_3d';
  return null;
}

function isTriggerRecorded(history, trigger, dateKey, episodeId) {
  return history.some(entry =>
    read(entry, 'screeningTrigger', 'screening_trigger') === trigger &&
    read(entry, 'triggerDate', 'trigger_date', 'dateKey', 'date_key') === dateKey &&
    (read(entry, 'episodeId', 'episode_id') || 'default') === episodeId
  );
}

const NEXT_STEPS = {
  steady: { key: "self_care", text: "Keep checking in and keep up your small daily routines." },
  gentle: { key: "monitor", text: "Notice how the next week feels, and lean on someone you trust." },
  extra: { key: "talk_provider", text: "Consider talking to your care provider this week." },
  immediate: { key: "open_help_now", text: "Open I Need Help now." },
};

export function getRecommendedNextStep(level) {
  return NEXT_STEPS[level] || NEXT_STEPS.steady;
}

function saveHistory(entries) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent(EPDS_EVENT, { detail: entries }));
}

export function saveEpdsEntry(answers, dateKey = toDateKey(), trigger = "manual") {
  if (!canUseStorage()) return;
  const totalScore = computeEpdsScore(answers);
  const q10Flag = answers[9] > 0;
  const supportLevel = getEpdsSupportLevel(totalScore, q10Flag);
  const nextStep = getRecommendedNextStep(supportLevel);
  const completedAt = new Date().toISOString();
  const history = getEpdsHistory();
  const episodeId = getEpisodeId();
  if (trigger !== 'manual' && isTriggerRecorded(history, trigger, dateKey, episodeId)) {
    return history.find(entry =>
      read(entry, 'screeningTrigger', 'screening_trigger') === trigger &&
      read(entry, 'triggerDate', 'trigger_date', 'dateKey', 'date_key') === dateKey
    );
  }
  const entry = {
    id: completedAt,
    dateKey,
    screeningDate: dateKey,
    answers: [...answers],
    totalScore,
    q10Flag,
    supportLevel,
    riskLevel: supportLevel,
    screeningResultLevel: supportLevel,
    // origin of this screening (home / mood / manual / stage), not the score band
    screeningTrigger: trigger,
    // score-band classification kept separately for analytics
    scoreBand: q10Flag ? "q10_flag" : totalScore >= 13 ? "score_threshold" : totalScore >= 10 ? "score_moderate" : "routine",
    recommendedNextStep: nextStep.key,
    recommendedNextStepText: nextStep.text,
    completedAt,
    checkpointDay: getPendingCheckpoint(history, getPostpartumDay()),
    triggerDate: dateKey,
    episodeId,
  };
  saveHistory([entry, ...history]);
  syncEpds(entry);
  return entry;
}

export function getEpdsHistory() {
  if (!canUseStorage()) return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function getLatestEpdsEntry() {
  return getEpdsHistory()[0] || null;
}

export function isEpdsDue() {
  const history = getEpdsHistory();
  const trigger = getEpdsTrigger();
  if (trigger && !isTriggerRecorded(history, trigger, toDateKey(), getEpisodeId())) return true;
  return getPendingCheckpoint(history) !== null;
}

export function getDaysUntilNextEpds() {
  if (isEpdsDue()) return 0;
  const days = getPostpartumDay();
  const next = EPDS_CHECKPOINTS.find(checkpoint => days !== null && checkpoint > days);
  return next === undefined || days === null ? null : Math.max(1, next - days);
}

export function subscribeToEpdsHistory(callback) {
  if (!canUseStorage()) return () => {};

  const handleCustom = (e) => callback(e.detail || getEpdsHistory());
  const handleStorage = (e) => { if (e.key === STORAGE_KEY) callback(getEpdsHistory()); };

  window.addEventListener(EPDS_EVENT, handleCustom);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(EPDS_EVENT, handleCustom);
    window.removeEventListener("storage", handleStorage);
  };
}
