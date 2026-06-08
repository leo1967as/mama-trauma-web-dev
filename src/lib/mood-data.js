const STORAGE_KEY = "afterbloom_mood_history";
const DIFFICULT_TAGS = new Set(["overwhelmed", "tired", "anxious", "lonely", "sad", "panic"]);
const MOOD_HISTORY_EVENT = "afterbloom:mood-history-updated";
const DEMO_HISTORY_DAYS = 14;
const DEMO_TAG_POOL = ["calm", "hopeful", "grateful", "tired", "anxious", "lonely", "proud", "overwhelmed"];

const SUPPORT_LEVELS = {
  steady: {
    label: "Steady",
    message: "Your recent check-ins look stable. Keep the rhythm going so changes stay easy to spot.",
    action: "Keep one tiny routine going today.",
  },
  gentle: {
    label: "Gentle Support",
    message: "There are early signs worth watching. Gentle support and a simple plan can help.",
    action: "Reach out to one trusted person and keep today's check-in simple.",
  },
  extra: {
    label: "Extra Support Recommended",
    message: "Your recent check-ins suggest this is a harder stretch. Extra support would be a good next step.",
    action: "Ask for support today and consider talking to a care provider.",
  },
  immediate: {
    label: "Immediate Support",
    message: "Your recent check-ins point to a high-need moment. Please reach out for immediate support now.",
    action: "Open I Need Help and contact support right now.",
  },
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
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

function getMoodSupportLevelFromComposite(composite) {
  if (composite === null || composite === undefined) {
    return "steady";
  }
  if (composite >= 4.25) return "steady";
  if (composite >= 3.5) return "gentle";
  if (composite >= 2.5) return "extra";
  return "immediate";
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
  const supportLevel = entry.supportLevel || getMoodSupportLevelFromComposite(composite);
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
    supportRequest: Boolean(entry.supportRequest),
    supportContacted: entry.supportContacted === "yes" ? "yes" : "no",
    tags: Array.isArray(entry.tags) ? entry.tags.filter(Boolean) : [],
    note: entry.note || "",
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

function shouldFlagSupportRequest(entries, currentEntry) {
  if (!currentEntry) {
    return false;
  }

  if (currentEntry.moodScore === 1 && currentEntry.worryScore === 5) {
    return true;
  }

  const recent = getRecentEntries(entries, 3).filter((entry) => entry.composite !== null);
  return recent.length === 3 && recent.every((entry) => entry.composite < 2.5);
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
  const nextEntry = normalizeEntry({
    ...current,
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
    const supportRequest = shouldFlagSupportRequest(nextHistory, nextHistory[nextEntryIndex]);
    const followUpTriggered = Boolean(
      nextHistory[nextEntryIndex].composite !== null &&
      (nextHistory[nextEntryIndex].composite < 2.5 ||
        [nextHistory[nextEntryIndex].moodScore, nextHistory[nextEntryIndex].sleepScore, nextHistory[nextEntryIndex].energyScore, nextHistory[nextEntryIndex].worryScore].includes(1))
    );
    const supportLevel = getMoodSupportLevelFromComposite(nextHistory[nextEntryIndex].composite);
    const supportMeta = getSupportLevelMeta(supportLevel);
    nextHistory[nextEntryIndex] = {
      ...nextHistory[nextEntryIndex],
      supportRequest,
      followUpTriggered,
      supportLevel,
      supportLabel: supportMeta.label,
      supportMessage: supportMeta.message,
      supportAction: supportMeta.action,
    };
  }

  saveMoodHistory(nextHistory);
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
    const meta = getSupportLevelMeta("steady");
    return {
      level: "steady",
      label: meta.label,
      message: meta.message,
      action: meta.action,
      supportRequest: false,
      followUpTriggered: false,
    };
  }

  const level = latest.supportLevel || getMoodSupportLevelFromComposite(latest.composite);
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

