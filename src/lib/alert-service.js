// Hospital dashboard alerts — PROTOTYPE / MOCK only (no backend).
// Builds a minimal, PDPA-conscious alert payload from local history and
// persists a mock "sent" log with a resolution stub. Schema is the single
// source of truth for a future real integration.
//
// Alert types (spec Phase 10):
//   A: support_request === true                  -> "support_request"
//   B: composite < 2.5 for 3 consecutive days    -> "low_trend_3day"
//   C: safety_access_used (I Need Help opened)   -> "safety_access"
//   (+ EPDS immediate result                     -> "epds_immediate")

const ALERTS_KEY = "afterbloom_alerts";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function makeAlert(type, severity, dateKey, payload = {}) {
  // id is stable per (type,dateKey) so re-builds don't duplicate and resolution sticks.
  return { id: `${type}:${dateKey}`, type, severity, dateKey, payload, resolved: false };
}

// 3 entries on consecutive calendar days, all composite < 2.5.
function fmtLocal(dt) {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}
function hasThreeConsecutiveLow(moodHistory) {
  const low = new Set(
    moodHistory.filter((e) => e.composite != null && e.composite < 2.5).map((e) => e.dateKey)
  );
  for (const key of low) {
    const d = new Date(key + "T00:00:00"); // local midnight
    const prev1 = new Date(d); prev1.setDate(d.getDate() - 1);
    const prev2 = new Date(d); prev2.setDate(d.getDate() - 2);
    const k1 = fmtLocal(prev1);
    const k2 = fmtLocal(prev2);
    if (low.has(k1) && low.has(k2)) return { anchor: key, days: [k2, k1, key] };
  }
  return null;
}

// Pure: derive alerts from history (no storage side-effects).
export function buildAlerts(moodHistory = [], epdsHistory = [], safetyLog = []) {
  const alerts = [];

  // A — mother explicitly requested the care team reach out
  for (const e of moodHistory) {
    if (e.supportRequest) {
      alerts.push(makeAlert("support_request", "high", e.dateKey, { source: "daily_checkin" }));
    }
  }

  // B — sustained low composite across 3 consecutive days
  const low = hasThreeConsecutiveLow(moodHistory);
  if (low) {
    alerts.push(makeAlert("low_trend_3day", "medium", low.anchor, { days: low.days }));
  }

  // C — crisis/help surface was opened
  for (const s of safetyLog) {
    const dateKey = s.dateKey || (s.ts ? String(s.ts).slice(0, 10) : "unknown");
    alerts.push(makeAlert("safety_access", "high", dateKey, { accessSource: s.source || null, action: s.action || null }));
  }

  // EPDS immediate-level screening result
  for (const e of epdsHistory) {
    if (e.screeningResultLevel === "immediate" || e.supportLevel === "immediate") {
      alerts.push(makeAlert("epds_immediate", "high", e.screeningDate || e.dateKey, { totalScore: e.totalScore, q10Flag: !!e.q10Flag }));
    }
  }

  return alerts;
}

function readStored() {
  if (!canUseStorage()) return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(ALERTS_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function getAlerts() {
  return readStored();
}

// Build from current history, preserve resolution state of known alerts, persist (mock sink).
export function syncAlerts(moodHistory = [], epdsHistory = [], safetyLog = []) {
  const built = buildAlerts(moodHistory, epdsHistory, safetyLog);
  const resolvedById = new Map(readStored().map((a) => [a.id, a.resolved]));
  const merged = built.map((a) => ({ ...a, resolved: resolvedById.get(a.id) || false }));
  if (canUseStorage()) window.localStorage.setItem(ALERTS_KEY, JSON.stringify(merged));
  return merged;
}

// Resolution stub: staff marks an alert resolved. For a support_request alert this
// "closes the loop" — a later low pattern will naturally raise a fresh alert.
export function resolveAlert(id) {
  if (!canUseStorage()) return [];
  const next = readStored().map((a) => (a.id === id ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a));
  window.localStorage.setItem(ALERTS_KEY, JSON.stringify(next));
  return next;
}

export function getOpenAlerts() {
  return readStored().filter((a) => !a.resolved);
}
