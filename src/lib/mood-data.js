const STORAGE_KEY = "moji_mood_history";
const DIFFICULT_TAGS = new Set(["overwhelmed", "tired", "anxious", "lonely", "sad", "panic"]);
const MOOD_HISTORY_EVENT = "moji:mood-history-updated";
const DEMO_HISTORY_DAYS = 14;
const DEMO_TAG_POOL = ["calm", "hopeful", "grateful", "tired", "anxious", "lonely", "proud", "overwhelmed"];

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

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function createDemoEntry(dateKey, offset) {
  const seed = hashString(`${dateKey}:${offset}`);
  const moodScore = (seed % 5) + 1;
  const energyLevel = 38 + (seed % 48);
  const sleepHours = 3 + (seed % 6);
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
    energyLevel,
    sleepHours,
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
  return {
    id: entry.id || entry.dateKey,
    dateKey: entry.dateKey,
    moodScore: parseNumber(entry.moodScore),
    energyLevel: parseNumber(entry.energyLevel),
    sleepHours: parseNumber(entry.sleepHours),
    tags: Array.isArray(entry.tags) ? entry.tags.filter(Boolean) : [],
    note: entry.note || "",
    supportContacted: entry.supportContacted === "yes" ? "yes" : "no",
    updatedAt: entry.updatedAt || new Date().toISOString(),
  };
}

function sortEntriesDesc(entries) {
  return [...entries].sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

function saveMoodHistory(entries) {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sortEntriesDesc(entries)));
  window.dispatchEvent(new CustomEvent(MOOD_HISTORY_EVENT, { detail: sortEntriesDesc(entries) }));
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
      energy: entry?.energyLevel ?? null,
      sleep: entry?.sleepHours ?? null,
    });
  }

  return rows;
}

export function hasMoodChartData(rows) {
  return rows.some((row) => row.mood !== null);
}

function average(values) {
  if (!values.length) {
    return null;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
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

export function getMoodRiskSummary(entries) {
  const recent = getRecentEntries(entries, 7).filter((entry) => entry.moodScore !== null);
  if (!recent.length) {
    return {
      level: "none",
      label: "No Check-ins Yet",
      message: "Start daily check-ins to unlock trend analysis, pattern detection, and risk monitoring.",
      action: "Complete today’s check-in to start your support baseline.",
    };
  }

  const moods = recent.map((entry) => entry.moodScore);
  const sleeps = recent.map((entry) => entry.sleepHours).filter((value) => value !== null);
  const avgMood = average(moods);
  const avgSleep = average(sleeps);
  const lowMoodDays = moods.filter((value) => value <= 2).length;
  const difficultTagHits = recent.flatMap((entry) => entry.tags).filter((tag) => DIFFICULT_TAGS.has(tag)).length;
  const lowMoodStreak = countConsecutiveLowMood(recent);

  let score = 0;
  if (avgMood !== null && avgMood <= 2.2) score += 2;
  else if (avgMood !== null && avgMood <= 3) score += 1;
  if (lowMoodDays >= 3) score += 2;
  else if (lowMoodDays >= 2) score += 1;
  if (avgSleep !== null && avgSleep < 4.5) score += 1;
  if (difficultTagHits >= 4) score += 1;
  if (lowMoodStreak >= 3) score += 2;

  if (score >= 5) {
    return {
      level: "red",
      label: "Please Reach Out",
      message: `Your recent check-ins show sustained low mood${avgSleep !== null ? ` and average sleep around ${avgSleep.toFixed(1)} hours` : ""}. Please prompt support outreach and professional follow-up.`,
      action: "Talk to a professional or crisis support now.",
    };
  }

  if (score >= 3) {
    return {
      level: "orange",
      label: "Needs Support",
      message: `Recent entries show a tougher stretch${lowMoodDays ? ` with ${lowMoodDays} low-mood days` : ""}. This is a good point to surface extra support and monitor closely.`,
      action: "Reach out to one trusted person today and consider professional support.",
    };
  }

  if (score >= 1) {
    return {
      level: "yellow",
      label: "Gentle Attention",
      message: `There are early signs to watch${avgSleep !== null ? `, especially sleep averaging ${avgSleep.toFixed(1)} hours` : ""}. Keep daily check-ins consistent and review patterns weekly.`,
      action: "Keep tomorrow’s check-in simple and ask for one small support task.",
    };
  }

  return {
    level: "green",
    label: "Looking Good",
    message: "Recent check-ins are stable overall. Keep the routine going so trend changes are easier to catch early.",
    action: "Stay with one tiny goal and keep the daily check-in habit going.",
  };
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
  const sleepEntries = chronological.filter((entry) => entry.sleepHours !== null && entry.moodScore !== null);
  const sleepAvg = average(sleepEntries.map((entry) => entry.sleepHours));
  if (sleepAvg !== null) {
    if (sleepAvg < 5) {
      insights.push({
        key: "sleep-low",
        type: "sleep",
        text: `Sleep has been running low at about ${sleepAvg.toFixed(1)} hours. Short sleep may be making the next day feel heavier.`,
      });
    } else {
      insights.push({
        key: "sleep-stable",
        type: "sleep",
        text: `Sleep has been steadier lately at about ${sleepAvg.toFixed(1)} hours. It is not the biggest stress signal right now.`,
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
    hasTodayCheckIn: Boolean(todayEntry?.moodScore),
    todayEntry,
    averageMoodLast7: avgMood,
  };
}
