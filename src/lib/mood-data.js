import { isSupportEpisodeSuppressed } from "./support-episode";
import { syncCheckin, syncSafetyAccess } from './firebase-sync';

const STORAGE_KEY = "afterbloom_mood_history";
const DIFFICULT_TAGS = new Set(["overwhelmed", "tired", "anxious", "lonely", "sad", "panic"]);
const MOOD_HISTORY_EVENT = "afterbloom:mood-history-updated";
const DEMO_HISTORY_DAYS = 14;
const DEMO_TAG_POOL = ["calm", "hopeful", "grateful", "tired", "anxious", "lonely", "proud", "overwhelmed"];

const SUPPORT_LEVELS = {
  unassessed: {
    label: "Not yet assessed",
    message: "Start your first daily check-in to see today's support guidance.",
    action: "Take your first check-in",
  },
  steady: {
    label: "Steady",
    message: "You seem steady today. Keep going at your own pace.",
    action: "Keep today's care rhythm",
  },
  gentle: {
    label: "Gentle Support",
    message: "Today might feel a little heavy. You don't have to push through everything at once.",
    action: "Choose one small goal",
  },
  extra: {
    label: "Extra Support",
    message: "Today looks heavier than usual. A little more support around you could help right now.",
    action: "Open support options",
  },
  immediate: {
    label: "Immediate Support",
    message: "You don't have to go through this alone. We'll connect you with support right away.",
    action: "Open urgent support",
  },
};

const CHECKIN_DRAFT_KEY = "afterbloom_checkin_draft";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

// --- Daily check-in draft (resume an in-progress check-in within the same day) ---
export function saveCheckinDraft(draft) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CHECKIN_DRAFT_KEY, JSON.stringify({ ...draft, dateKey: toDateKey() }));
}

export function getCheckinDraft() {
  if (!canUseStorage()) return null;
  try {
    const draft = JSON.parse(window.localStorage.getItem(CHECKIN_DRAFT_KEY) || "null");
    if (!draft || draft.dateKey !== toDateKey()) return null; // only resume today's draft
    return draft;
  } catch {
    return null;
  }
}

export function clearCheckinDraft() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(CHECKIN_DRAFT_KEY);
}

// --- I Need Help access log (spec: safety_access_used, timestamp, every use) ---
const SAFETY_LOG_KEY = "afterbloom_safety_log";

export function logSafetyAccess(meta = {}) {
  if (!canUseStorage()) return;
  try {
    const log = JSON.parse(window.localStorage.getItem(SAFETY_LOG_KEY) || "[]");
    log.push({ ts: new Date().toISOString(), dateKey: toDateKey(), ...meta });
    window.localStorage.setItem(SAFETY_LOG_KEY, JSON.stringify(log));
    syncSafetyAccess(meta);
  } catch {
    /* noop */
  }
}

export function getSafetyLog() {
  if (!canUseStorage()) return [];
  try {
    const log = JSON.parse(window.localStorage.getItem(SAFETY_LOG_KEY) || "[]");
    return Array.isArray(log) ? log : [];
  } catch {
    return [];
  }
}

function toDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function clampScore(value) {
  const parsed = parseNumber(value);
  if (parsed === null) {
    return null;
  }
  return Math.min(5, Math.max(1, parsed));
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function average(values) {
  if (!values.length) {
    return null;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sortEntriesDesc(entries) {
  return [...entries].sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

export function getSupportLevelMeta(level) {
  return SUPPORT_LEVELS[level] || SUPPORT_LEVELS.steady;
}

function getMoodSupportLevel(entry, composite) {
  if (entry.supportRequest === true) return "immediate";

  if (composite === null || composite === undefined) {
    return "steady"; // Default when incomplete
  }

  // Spec Override rule: If support_request was triggered (supportNeedPattern)
  // and baby_connection_score = 1: escalate to Level 3 regardless of composite
  if (entry.supportNeedPattern && entry.babyConnectionScore === 1) {
    return "extra";
  }

  // Spec Level 3 OR condition: mood_score <= 2 AND worry = high (score >= 4 or adjusted <= 2)
  if (entry.moodScore !== null && entry.moodScore <= 2 && entry.worryScore !== null && entry.worryScore >= 4) {
    return "extra";
  }

  if (composite >= 3.5) return "steady"; // Level 1
  if (composite >= 2.5) return "gentle"; // Level 2
  return "extra";                        // Level 3 (composite < 2.5)
}

function createDemoEntry(dateKey, offset) {
  const seed = hashString(`${dateKey}:${offset}`);
  const moodScore = (seed % 5) + 1;
  const sleepScore = ((seed + 1) % 5) + 1;
  const energyScore = ((seed + 2) % 5) + 1;
  const worryScore = ((seed + 3) % 5) + 1;
  const supportContacted = seed % 3 === 0 ? "yes" : "no";
  const tagA = DEMO_TAG_POOL[seed % DEMO_TAG_POOL.length];
  const tagB = DEMO_TAG_POOL[(seed + 3) % DEMO_TAG_POOL.length];
  const notePool = [
    "Quiet recovery day with small ups and downs.",
    "Focused on resting, feeding, and keeping things steady.",
    "A little tired, but the routine held together today.",
    "Support felt helpful and the day stayed manageable.",
  ];

  return normalizeEntry({
    id: `demo-${dateKey}`,
    dateKey,
    moodScore,
    sleepScore,
    energyScore,
    worryScore,
    tags: tagA === tagB ? [tagA] : [tagA, tagB],
    note: notePool[seed % notePool.length],
    supportContacted,
    updatedAt: new Date(`${dateKey}T12:00:00`).toISOString(),
  });
}

function backfillDemoHistory(entries) {
  const byDate = new Map(entries.map((entry) => [entry.dateKey, entry]));
  const today = new Date();
  for (let offset = DEMO_HISTORY_DAYS; offset >= 1; offset -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - offset);
    const dateKey = toDateKey(date);
    if (!byDate.has(dateKey)) {
      byDate.set(dateKey, createDemoEntry(dateKey, offset));
    }
  }
  return sortEntriesDesc([...byDate.values()]);
}

function normalizeEntry(entry) {
  const moodScore = clampScore(entry.moodScore);
  const sleepScore = clampScore(entry.sleepScore ?? entry.sleepHours);
  const energyScore = clampScore(entry.energyScore ?? entry.energyLevel);
  const worryScore = clampScore(entry.worryScoreRaw ?? entry.worryScore ?? entry.worry_score);
  const worryAdjustedScore = worryScore === null ? null : 6 - worryScore;
  const compositeValues = [moodScore, sleepScore, energyScore, worryAdjustedScore].filter((value) => value !== null);
  const composite = compositeValues.length ? average(compositeValues) : null;
  
  const supportLevel = entry.supportLevel || getMoodSupportLevel({
    supportRequest: Boolean(entry.supportRequest),
    supportNeedPattern: Boolean(entry.supportNeedPattern),
    babyConnectionScore: clampScore(entry.babyConnectionScore),
    moodScore,
    worryScore
  }, composite);
  const supportMeta = getSupportLevelMeta(supportLevel);

  return {
    id: entry.id || entry.dateKey,
    dateKey: entry.dateKey,
    moodScore,
    sleepScore,
    sleepHours: sleepScore,
    energyScore,
    energyLevel: energyScore,
    worryScore,
    worryScoreRaw: worryScore,
    worryAdjustedScore,
    composite,
    supportLevel,
    supportLabel: supportMeta.label,
    supportMessage: supportMeta.message,
    supportAction: supportMeta.action,
    followUpTriggered: Boolean(entry.followUpTriggered),
    supportNeedPattern: Boolean(entry.supportNeedPattern),
    supportRequest: Boolean(entry.supportRequest),
    supportContacted: entry.supportContacted === "yes" ? "yes" : "no",
    // Phase 6 follow-up fields (spec 3.5–3.7)
    problemTags: Array.isArray(entry.problemTags)
      ? entry.problemTags.filter(Boolean).slice(0, 2)
      : (Array.isArray(entry.tags) ? entry.tags.filter(Boolean).slice(0, 2) : []),
    problemOtherText: (entry.problemOtherText || "").slice(0, 150),
    journalEntry: (entry.journalEntry ?? entry.note ?? "").slice(0, 500),
    babyConnectionScore: clampScore(entry.babyConnectionScore),
    // legacy mirrors (kept for existing readers e.g. insights)
    tags: Array.isArray(entry.problemTags)
      ? entry.problemTags.filter(Boolean)
      : (Array.isArray(entry.tags) ? entry.tags.filter(Boolean) : []),
    note: (entry.journalEntry ?? entry.note ?? "").slice(0, 500),
    updatedAt: entry.updatedAt || new Date().toISOString(),
  };
}

function saveMoodHistory(entries) {
  if (!canUseStorage()) {
    return;
  }
  const nextEntries = sortEntriesDesc(entries);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
  window.dispatchEvent(new CustomEvent(MOOD_HISTORY_EVENT, { detail: nextEntries }));
}

function getRecentEntries(entries, limit = 7) {
  return sortEntriesDesc(entries).slice(0, limit);
}

function countConsecutiveLowMood(entries) {
  let streak = 0;
  for (const entry of sortEntriesDesc(entries)) {
    if (entry.moodScore !== null && entry.moodScore <= 2) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

// Trigger A (spec 3.9): composite < 2.5 on 3 consecutive calendar days.
function hasThreeConsecutiveLowComposite(entries) {
  const lowDateKeys = new Set(
    entries.filter((entry) => entry.composite !== null && entry.composite < 2.5).map((entry) => entry.dateKey)
  );

  for (const dateKey of lowDateKeys) {
    const day = new Date(`${dateKey}T00:00:00`);
    const dayBefore = new Date(day);
    dayBefore.setDate(day.getDate() - 1);
    const twoDaysBefore = new Date(day);
    twoDaysBefore.setDate(day.getDate() - 2);

    if (lowDateKeys.has(toDateKey(dayBefore)) && lowDateKeys.has(toDateKey(twoDaysBefore))) {
      return true;
    }
  }

  return false;
}

function shouldFlagSupportRequest(entries, currentEntry) {
  if (!currentEntry) {
    return false;
  }

  if (currentEntry.moodScore === 1 && currentEntry.worryScore === 5) {
    return true;
  }

  return hasThreeConsecutiveLowComposite(entries);
}

export function getMoodHistory() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(raw)) {
      return [];
    }
    const normalized = sortEntriesDesc(raw.filter((entry) => entry?.dateKey).map(normalizeEntry));
    const backfilled = backfillDemoHistory(normalized);
    if (backfilled.length !== normalized.length) {
      saveMoodHistory(backfilled);
    }
    return backfilled;
  } catch {
    return []; 
  }
}

export function getTodaysMoodEntry() {
  const todayKey = toDateKey();
  return getMoodHistory().find((entry) => entry.dateKey === todayKey) || null;
}

export function getMoodEntryByDateKey(dateKey) {
  return getMoodHistory().find((entry) => entry.dateKey === dateKey) || null;
}

export function upsertMoodEntry(patch) {
  const dateKey = patch.dateKey || toDateKey();
  const history = getMoodHistory();
  const index = history.findIndex((entry) => entry.dateKey === dateKey);
  const current = index >= 0 ? history[index] : { id: dateKey, dateKey };
  // Strip computed alias fields so canonical patch fields (worryScore, sleepScore, energyScore)
  // always win over the old mirror values (worryScoreRaw, sleepHours, energyLevel) on edit.
  const { worryScoreRaw: _w, sleepHours: _s, energyLevel: _e, ...currentBase } = current;
  const nextEntry = normalizeEntry({
    ...currentBase,
    ...patch,
    id: dateKey,
    dateKey,
    updatedAt: new Date().toISOString(),
  });

  if (index >= 0) {
    history[index] = nextEntry;
  } else {
    history.push(nextEntry);
  }

  const nextHistory = sortEntriesDesc(history);
  const nextEntryIndex = nextHistory.findIndex((entry) => entry.dateKey === dateKey);
  if (nextEntryIndex >= 0) {
    // Pattern only decides whether the Support Need question is shown.
    // support_request itself is the mother's own Yes/No answer (from the patch), never auto.
    const supportNeedPattern = shouldFlagSupportRequest(nextHistory, nextHistory[nextEntryIndex]);
    const followUpTriggered = Boolean(
      nextHistory[nextEntryIndex].composite !== null &&
      (nextHistory[nextEntryIndex].composite < 2.5 ||
        [nextHistory[nextEntryIndex].moodScore, nextHistory[nextEntryIndex].sleepScore, nextHistory[nextEntryIndex].energyScore, nextHistory[nextEntryIndex].worryAdjustedScore].includes(1))
    );
    const supportLevel = getMoodSupportLevel(nextHistory[nextEntryIndex], nextHistory[nextEntryIndex].composite);
    const supportMeta = getSupportLevelMeta(supportLevel);
    nextHistory[nextEntryIndex] = {
      ...nextHistory[nextEntryIndex],
      supportNeedPattern,
      supportRequest: Boolean(nextHistory[nextEntryIndex].supportRequest),
      followUpTriggered,
      supportLevel,
      supportLabel: supportMeta.label,
      supportMessage: supportMeta.message,
      supportAction: supportMeta.action,
    };
  }

  saveMoodHistory(nextHistory);

  // Sync the updated entry to Firestore (fire-and-forget)
  const savedEntry = nextHistory.find(e => e.dateKey === dateKey);
  if (savedEntry) syncCheckin(savedEntry);

  return nextHistory;
}

// Whether today's answers + history trigger the Support Need pattern
// (spec 3.9 Trigger A/B). Used to decide if the Support Need question is shown.
export function isSupportNeedTriggered(currentAnswers) {
  const preview = normalizeEntry({ dateKey: toDateKey(), ...currentAnswers });
  if (isSupportEpisodeSuppressed(preview.dateKey)) {
    return false;
  }
  const history = getMoodHistory().filter((entry) => entry.dateKey !== preview.dateKey);
  return shouldFlagSupportRequest([preview, ...history], preview);
}

export function subscribeToMoodHistory(callback) {
  if (!canUseStorage()) {
    return () => {};
  }

  const handleCustomUpdate = (event) => {
    callback(event.detail || getMoodHistory());
  };

  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY) {
      callback(getMoodHistory());
    }
  };

  window.addEventListener(MOOD_HISTORY_EVENT, handleCustomUpdate);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(MOOD_HISTORY_EVENT, handleCustomUpdate);
    window.removeEventListener("storage", handleStorage);
  };
}

export function formatHistoryDate(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  const todayKey = toDateKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateKey === todayKey) {
    return "Today";
  }

  if (dateKey === toDateKey(yesterday)) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getMoodChartData(entries, days = 7, options = {}) {
  const { previewMoodScore = null } = options;
  const map = new Map(entries.map((entry) => [entry.dateKey, entry]));
  const rows = [];
  const todayKey = toDateKey();

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const dateKey = toDateKey(date);
    const entry = map.get(dateKey);
    const previewMood = dateKey === todayKey && entry?.moodScore === null ? parseNumber(previewMoodScore) : null;

    rows.push({
      dateKey,
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      mood: entry?.moodScore ?? previewMood ?? null,
      energy: entry?.energyScore ?? null,
      sleep: entry?.sleepScore ?? null,
    });
  }

  return rows;
}

export function hasMoodChartData(rows) {
  return rows.some((row) => row.mood !== null);
}

export function getMoodSupportSummary(entries) {
  const recent = getRecentEntries(entries, 7);
  const latest = recent[0] || null;
  if (!latest) {
    const meta = getSupportLevelMeta("unassessed");
    return {
      level: "unassessed",
      label: meta.label,
      message: meta.message,
      action: meta.action,
      supportRequest: false,
      followUpTriggered: false,
    };
  }

  const level = latest.supportLevel || getMoodSupportLevel(latest, latest.composite);
  const meta = getSupportLevelMeta(level);
  return {
    level,
    label: latest.supportLabel || meta.label,
    message: latest.supportMessage || meta.message,
    action: latest.supportAction || meta.action,
    supportRequest: Boolean(latest.supportRequest),
    followUpTriggered: Boolean(latest.followUpTriggered),
  };
}

export function getMoodRiskSummary(entries) {
  return getMoodSupportSummary(entries);
}

export function getMoodInsights(entries) {
  const recent = getRecentEntries(entries, 14);
  if (!recent.length) {
    return [
      { key: "start", type: "trend", text: "No pattern yet. Once daily check-ins start, this area can gently show what has been helping or making days harder." },
    ];
  }

  const insights = [];
  const chronological = [...recent].reverse();
  const sleepEntries = chronological.filter((entry) => entry.sleepScore !== null && entry.moodScore !== null);
  const sleepAvg = average(sleepEntries.map((entry) => entry.sleepScore));
  if (sleepAvg !== null) {
    if (sleepAvg < 3) {
      insights.push({
        key: "sleep-low",
        type: "sleep",
        text: `Sleep has been running low at about ${sleepAvg.toFixed(1)} / 5. Short sleep may be making the next day feel heavier.`,
      });
    } else {
      insights.push({
        key: "sleep-stable",
        type: "sleep",
        text: `Sleep has been steadier lately at about ${sleepAvg.toFixed(1)} / 5. It is not the biggest stress signal right now.`,
      });
    }
  }

  const supportYes = recent.filter((entry) => entry.supportContacted === "yes" && entry.moodScore !== null).map((entry) => entry.moodScore);
  const supportNo = recent.filter((entry) => entry.supportContacted === "no" && entry.moodScore !== null).map((entry) => entry.moodScore);
  const supportYesAvg = average(supportYes);
  const supportNoAvg = average(supportNo);
  if (supportYesAvg !== null && supportNoAvg !== null && supportYesAvg >= supportNoAvg + 0.5) {
    insights.push({
      key: "support",
      type: "support",
      text: "Days with support tend to feel a bit lighter. Reaching out seems to help.",
    });
  }

  const tagCounts = {};
  for (const tag of recent.flatMap((entry) => entry.tags)) {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  }
  const recurringTags = Object.entries(tagCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([tag]) => tag);
  if (recurringTags.length) {
    insights.push({
      key: "tags",
      type: "tag",
      text: `The themes showing up most often are ${recurringTags.join(" and ")}. These may be the areas needing the most care right now.`,
    });
  }

  const recentMoodAvg = average(chronological.slice(-3).map((entry) => entry.moodScore).filter((value) => value !== null));
  const priorMoodAvg = average(chronological.slice(0, -3).map((entry) => entry.moodScore).filter((value) => value !== null));
  if (recentMoodAvg !== null && priorMoodAvg !== null) {
    if (recentMoodAvg >= priorMoodAvg + 0.5) {
      insights.push({
        key: "up",
        type: "trend",
        text: "The last few check-ins look a little lighter than the earlier part of the week.",
      });
    } else if (recentMoodAvg <= priorMoodAvg - 0.5) {
      insights.push({
        key: "down",
        type: "trend",
        text: "The last few check-ins look heavier than earlier in the week. Sleep, support, or stress may have shifted.",
      });
    }
  }

  if (!insights.length) {
    insights.push({
      key: "steady",
      type: "trend",
      text: "Patterns are still forming. A few more daily check-ins will make the picture clearer.",
    });
  }

  return insights.slice(0, 3);
}

export function getMoodSummary(entries) {
  const todayKey = toDateKey();
  const todayEntry = entries.find((entry) => entry.dateKey === todayKey) || null;
  const recent = getRecentEntries(entries, 7).filter((entry) => entry.moodScore !== null);
  const avgMood = average(recent.map((entry) => entry.moodScore));

  return {
    totalEntries: entries.length,
    hasTodayCheckIn: Boolean(todayEntry),
    todayEntry,
    averageMoodLast7: avgMood,
  };
}
