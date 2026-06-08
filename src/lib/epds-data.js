const STORAGE_KEY = "afterbloom_epds_history";
const EPDS_EVENT = "afterbloom:epds-history-updated";

const REVERSE_INDICES = new Set([2, 4, 5, 6, 7, 8, 9]);

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

function saveHistory(entries) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent(EPDS_EVENT, { detail: entries }));
}

export function saveEpdsEntry(answers, dateKey = toDateKey()) {
  if (!canUseStorage()) return;
  const totalScore = computeEpdsScore(answers);
  const q10Flag = answers[9] > 0;
  const supportLevel = getEpdsSupportLevel(totalScore, q10Flag);
  const completedAt = new Date().toISOString();
  const entry = {
    id: completedAt,
    dateKey,
    answers: [...answers],
    totalScore,
    q10Flag,
    supportLevel,
    riskLevel: supportLevel,
    screeningResultLevel: supportLevel,
    screeningTrigger: q10Flag ? "q10_flag" : totalScore >= 13 ? "score_threshold" : totalScore >= 10 ? "score_moderate" : "routine",
    completedAt,
  };
  const history = getEpdsHistory();
  saveHistory([entry, ...history]);
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
  const latest = getLatestEpdsEntry();
  if (!latest) return true;
  const ms14days = 14 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(latest.completedAt).getTime() >= ms14days;
}

export function getDaysUntilNextEpds() {
  const latest = getLatestEpdsEntry();
  if (!latest) return 0;
  const ms14days = 14 * 24 * 60 * 60 * 1000;
  const elapsed = Date.now() - new Date(latest.completedAt).getTime();
  const remaining = ms14days - elapsed;
  return remaining <= 0 ? 0 : Math.ceil(remaining / (24 * 60 * 60 * 1000));
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



