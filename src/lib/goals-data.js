import { saveOnboarding } from "./user-data";
import { syncTinyGoal } from "./firebase-sync";

const GOAL_KEY = "afterbloom_daily_goal";
const GOAL_EVENT = "afterbloom:goal-updated";

const TINY_GOALS = [
  "Drink one glass of water",
  "Message someone you trust",
  "Close your eyes and breathe deeply for 30 seconds",
  "Put a hand on your chest and tell yourself, 'I'm trying'",
];

function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getSuggestedGoals() {
  return TINY_GOALS;
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
  saveOnboarding({ selected_tiny_goal: text || "skip" });
  syncTinyGoal(text || "skip", status, dayKey());
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
