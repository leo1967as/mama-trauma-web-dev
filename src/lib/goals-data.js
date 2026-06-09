// Tiny goals — small, non-judgmental actions offered after a check-in (spec Phase 8).
const GOAL_KEY = "afterbloom_daily_goal";
const GOAL_EVENT = "afterbloom:goal-updated";

const GENERAL_GOALS = [
  "Drink a full glass of water",
  "Step outside for two minutes of fresh air",
  "Take one deep breath before feeding",
  "Eat something nourishing, even if small",
  "Stretch your shoulders and neck slowly",
  "Notice one small thing you love about your baby",
  "Let one chore wait until tomorrow",
  "Text one person back — or don't, that's okay too",
];

const RESTFUL_GOALS = [
  "Rest for 10 quiet minutes",
  "Lie down and close your eyes for five minutes",
  "Send one message to someone you trust",
  "Put a hand on your heart and say 'I'm doing my best'",
  "Ask someone to hold the baby for 15 minutes",
];

function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function seedFromKey(k) {
  let h = 0;
  for (const c of k) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

// Deterministic per-day rotation so options vary daily but stay stable within a day.
export function getSuggestedGoals(level = "steady", count = 3) {
  const pool = level === "steady" ? GENERAL_GOALS : [...RESTFUL_GOALS, ...GENERAL_GOALS];
  const start = seedFromKey(dayKey() + level) % pool.length;
  const out = [];
  const seen = new Set();
  for (let i = 0; out.length < count && i < pool.length * 2; i += 1) {
    const g = pool[(start + i) % pool.length];
    if (!seen.has(g)) { seen.add(g); out.push(g); }
  }
  return out;
}

export function getDailyGoal() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const g = JSON.parse(window.localStorage.getItem(GOAL_KEY) || "null");
    if (!g || g.dateKey !== dayKey()) return null;
    return g;
  } catch {
    return null;
  }
}

export function setDailyGoal(text, status = "chosen") {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.setItem(GOAL_KEY, JSON.stringify({ text, status, dateKey: dayKey() }));
  window.dispatchEvent(new CustomEvent(GOAL_EVENT));
}

export function setDailyGoalStatus(status) {
  const g = getDailyGoal();
  if (!g) return;
  setDailyGoal(g.text, status);
}

export function subscribeToDailyGoal(callback) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback(getDailyGoal());
  window.addEventListener(GOAL_EVENT, handler);
  return () => window.removeEventListener(GOAL_EVENT, handler);
}
