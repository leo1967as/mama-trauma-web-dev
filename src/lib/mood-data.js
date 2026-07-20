import { syncCheckin, syncSafetyAccess } from './firebase-sync';

const STORAGE_KEY = "afterbloom_mood_history";
const DIFFICULT_TAGS = new Set(["overwhelmed", "tired", "anxious", "lonely", "sad", "panic"]);
const MOOD_HISTORY_EVENT = "afterbloom:mood-history-updated";
const DEMO_HISTORY_DAYS = 14;
const DEMO_TAG_POOL = ["calm", "hopeful", "grateful", "tired", "anxious", "lonely", "proud", "overwhelmed"];

export const CANONICAL_PROBLEM_TAGS = [
  ["exhaustion", "ความเหนื่อยล้าหมดแรง", "Exhaustion and lack of energy", "monitoring"],
  ["sleep_deprivation", "การอดนอน / นอนไม่พอ", "Sleep deprivation / not enough sleep", "monitoring"],
  ["body_image_worry", "ความกังวลภาพลักษณ์ร่างกายหลังคลอด", "Postpartum body image worry", "monitoring"],
  ["body_pain", "ความเจ็บปวดทางร่างกาย", "Physical pain", "monitoring"],
  ["recovery_after_birth", "การฟื้นตัวหลังคลอด", "Recovery after birth", "monitoring"],
  ["baby_crying", "ลูกร้องไห้", "Baby crying", "monitoring"],
  ["feeding", "การให้นม", "Feeding", "monitoring"],
  ["baby_health_worry", "ความกังวลเกี่ยวกับสุขภาพของลูก", "Worry about baby's health", "monitoring"],
  ["lonely", "ความรู้สึกโดดเดี่ยว", "Feeling lonely", "critical"],
  ["overwhelmed", "รู้สึกกังวลหรือคิดวนไปมาจนหยุดไม่ได้", "Feeling overwhelmed and unable to cope", "critical"],
  ["irritable_angry", "ความรู้สึกหงุดหงิดหรือโมโห", "Feeling irritable or angry", "high"],
  ["not_good_enough_mother", "รู้สึกว่าตัวเองทำหน้าที่แม่ได้ไม่ดีพอ", "Feeling like not a good enough mother", "critical"],
  ["adapting_to_motherhood", "การปรับตัวต่อบทบาทการเป็นแม่", "Adapting to motherhood", "high"],
  ["unresolved_grief", "ความเศร้าหรือความสูญเสียที่ยังไม่ได้รับการจัดการ", "Unresolved grief or loss", "critical"],
  ["partner_relationship", "ความสัมพันธ์กับคู่ชีวิต", "Partner relationship", "high"],
  ["partner_support", "การสนับสนุนจากคู่ชีวิต", "Partner support", "high"],
  ["family_stress", "ความเครียดจากครอบครัว", "Family stress", "monitoring"],
  ["privacy_personal_space", "ความเป็นส่วนตัวและพื้นที่ส่วนตัว", "Privacy and personal space", "monitoring"],
  ["household_responsibilities", "ภาระงานบ้าน", "Household responsibilities", "monitoring"],
  ["financial_worry", "ความกังวลด้านการเงิน", "Financial worry", "high"],
  ["return_to_work_stress", "ความเครียดจากการกลับไปทำงาน", "Return-to-work stress", "monitoring"],
  ["unsure", "ไม่แน่ใจ", "Not sure", "monitoring"],
  ["other", "อื่น ๆ", "Other", "monitoring"],
].map(([id, th, en, severity]) => ({ id, th, en, severity }));

const PROBLEM_TAG_BY_ID = new Map(CANONICAL_PROBLEM_TAGS.map((tag) => [tag.id, tag]));
const PROBLEM_TAG_BY_LABEL = new Map(CANONICAL_PROBLEM_TAGS.flatMap((tag) => [[tag.th, tag.id], [tag.en, tag.id]]));
const SAFETY_CRITICAL_TAGS = new Set(["overwhelmed", "not_good_enough_mother", "lonely", "unresolved_grief"]);

export function classifyProblemTag(tag) {
  return PROBLEM_TAG_BY_ID.get(tag)?.severity ?? "monitoring";
}

export function normalizeProblemTags(tags) {
  return [...new Set((Array.isArray(tags) ? tags : []).map((tag) => PROBLEM_TAG_BY_LABEL.get(tag) ?? tag).filter((tag) => PROBLEM_TAG_BY_ID.has(tag)))].slice(0, 2);
}

export function classifyProblemTags(tags) {
  return [...new Set(normalizeProblemTags(tags).map(classifyProblemTag))];
}

export function calculateComposite({ moodScore, sleepScore, energyScore, worryScore }) {
  const scores = [moodScore, sleepScore, energyScore, worryScore].map(parseNumber);
  if (scores.some((score) => score === null)) return null;
  return (scores[0] * 2 + scores[1] + scores[2] + (6 - scores[3])) / 5;
}

export function isPhase2Triggered(answers) {
  const composite = calculateComposite(answers);
  const core = [answers.moodScore, answers.sleepScore, answers.energyScore, answers.worryScore].map(parseNumber);
  return Boolean(composite !== null && (composite < 2.5 || core.slice(0, 3).includes(1) || core[3] === 5));
}

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

export function hasUrgentSafetyAccess(dateKey = toDateKey()) {
  if (!canUseStorage()) return false;
  try {
    const log = JSON.parse(window.localStorage.getItem(SAFETY_LOG_KEY) || "[]");
    return log.some((entry) => {
      const action = String(entry.action || entry.path || "").toLowerCase();
      return entry.dateKey === dateKey && ["urgent", "unsafe", "urgent_help", "unsafe_now"].includes(action);
    });
  } catch {
    return false;
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

export function getMoodSupportLevel(entry, composite = calculateComposite(entry)) {
  if (composite === null || composite === undefined) {
    return "steady"; // Default when incomplete
  }

  if (entry.babyConnectionScore === 1 && composite < 2.5) {
    return "immediate";
  }

  if ((entry.problemTags || entry.tags || []).some((tag) => SAFETY_CRITICAL_TAGS.has(tag)) && composite < 1.5) {
    return "immediate";
  }

  if (composite < 2.5 || (entry.moodScore !== null && entry.moodScore <= 2 && entry.worryScore !== null && entry.worryScore >= 4)) {
    return "extra";
  }

  if (composite >= 3.5) return "steady"; // Level 1
  return "gentle"; // Level 2
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
  const moodScore = clampScore(entry.moodScore ?? entry.mood_score);
  const sleepScore = clampScore(entry.sleepScore ?? entry.sleep_score ?? entry.sleepHours);
  const energyScore = clampScore(entry.energyScore ?? entry.energy_score ?? entry.energyLevel);
  const worryScore = clampScore(entry.worryScoreRaw ?? entry.worryScore ?? entry.worry_score);
  const composite = calculateComposite({ moodScore, sleepScore, energyScore, worryScore });
  const problemTags = normalizeProblemTags(entry.problemTags ?? entry.problem_tags ?? entry.tags);
  const babyConnectionScore = clampScore(entry.babyConnectionScore ?? entry.baby_connection_score);
  
  const supportLevel = getMoodSupportLevel({
    babyConnectionScore,
    moodScore,
    worryScore,
    problemTags,
  }, composite);
  const supportMeta = getSupportLevelMeta(supportLevel);

  return {
    id: entry.id || entry.dateKey || entry.date_key,
    dateKey: entry.dateKey || entry.date_key,
    moodScore,
    sleepScore,
    sleepHours: sleepScore,
    energyScore,
    energyLevel: energyScore,
    worryScore,
    worryScoreRaw: worryScore,
    composite,
    supportLevel,
    supportLabel: supportMeta.label,
    supportMessage: supportMeta.message,
    supportAction: supportMeta.action,
    followUpTriggered: Boolean(entry.followUpTriggered ?? entry.follow_up_triggered),
    supportContacted: (entry.supportContacted ?? entry.support_contacted) === "yes" ? "yes" : "no",
    // Phase 6 follow-up fields (spec 3.5–3.7)
    problemTags,
    problemTagClasses: classifyProblemTags(problemTags),
    problemOtherText: (entry.problemOtherText ?? entry.problem_other_text ?? "").slice(0, 150),
    journalEntry: (entry.journalEntry ?? entry.journal_entry ?? entry.note ?? "").slice(0, 500),
    babyConnectionScore,
    // legacy mirrors (kept for existing readers e.g. insights)
    tags: problemTags,
    note: (entry.journalEntry ?? entry.journal_entry ?? entry.note ?? "").slice(0, 500),
    updatedAt: entry.updatedAt ?? entry.updated_at ?? new Date().toISOString(),
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

export function mergeRemoteMoodHistory(remoteEntries) {
  const byDate = new Map(getMoodHistory().map((entry) => [entry.dateKey, entry]));
  for (const remoteEntry of remoteEntries) {
    const entry = normalizeEntry(remoteEntry);
    if (entry.dateKey) byDate.set(entry.dateKey, entry);
  }
  const merged = sortEntriesDesc([...byDate.values()]);
  saveMoodHistory(merged);
  return merged;
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
    const followUpTriggered = isPhase2Triggered(nextHistory[nextEntryIndex]);
    const supportLevel = getMoodSupportLevel(nextHistory[nextEntryIndex], nextHistory[nextEntryIndex].composite);
    const supportMeta = getSupportLevelMeta(supportLevel);
    nextHistory[nextEntryIndex] = {
      ...nextHistory[nextEntryIndex],
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

export function formatHistoryDate(dateKey, t) {
  const date = new Date(`${dateKey}T00:00:00`);
  const todayKey = toDateKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateKey === todayKey) {
    return t?.mood?.dateToday ?? "Today";
  }

  if (dateKey === toDateKey(yesterday)) {
    return t?.mood?.dateYesterday ?? "Yesterday";
  }

  return date.toLocaleDateString(t ? "th-TH" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getMoodChartData(entries, days = 7, options = {}) {
  const { previewMoodScore = null, locale = "en-US" } = options;
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
      day: date.toLocaleDateString(locale, { weekday: "short" }),
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
    followUpTriggered: Boolean(latest.followUpTriggered),
  };
}

export function getMoodRiskSummary(entries) {
  return getMoodSupportSummary(entries);
}

export function getMoodInsights(entries, t) {
  const T = t?.mood?.insights;
  const moodTagLabel = (tag) => t?.moodTags?.[tag] ?? tag;
  const recent = getRecentEntries(entries, 14);
  if (!recent.length) {
    return [
      { key: "start", type: "trend", text: T?.start ?? "No pattern yet. Once daily check-ins start, this area can gently show what has been helping or making days harder." },
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
        text: (T?.sleepLow ?? "Sleep has been running low at about {{avg}} / 5. Short sleep may be making the next day feel heavier.").replace("{{avg}}", sleepAvg.toFixed(1)),
      });
    } else {
      insights.push({
        key: "sleep-stable",
        type: "sleep",
        text: (T?.sleepStable ?? "Sleep has been steadier lately at about {{avg}} / 5. It is not the biggest stress signal right now.").replace("{{avg}}", sleepAvg.toFixed(1)),
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
      text: T?.support ?? "Days with support tend to feel a bit lighter. Reaching out seems to help.",
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
    const joiner = T?.tagsJoiner ?? " and ";
    insights.push({
      key: "tags",
      type: "tag",
      text: (T?.tags ?? "The themes showing up most often are {{tags}}. These may be the areas needing the most care right now.").replace("{{tags}}", recurringTags.map(moodTagLabel).join(joiner)),
    });
  }

  const recentMoodAvg = average(chronological.slice(-3).map((entry) => entry.moodScore).filter((value) => value !== null));
  const priorMoodAvg = average(chronological.slice(0, -3).map((entry) => entry.moodScore).filter((value) => value !== null));
  if (recentMoodAvg !== null && priorMoodAvg !== null) {
    if (recentMoodAvg >= priorMoodAvg + 0.5) {
      insights.push({
        key: "up",
        type: "trend",
        text: T?.up ?? "The last few check-ins look a little lighter than the earlier part of the week.",
      });
    } else if (recentMoodAvg <= priorMoodAvg - 0.5) {
      insights.push({
        key: "down",
        type: "trend",
        text: T?.down ?? "The last few check-ins look heavier than earlier in the week. Sleep, support, or stress may have shifted.",
      });
    }
  }

  if (!insights.length) {
    insights.push({
      key: "steady",
      type: "trend",
      text: T?.steady ?? "Patterns are still forming. A few more daily check-ins will make the picture clearer.",
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
