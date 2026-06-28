// Persists the generated care plan + habit checkmarks for the current day
// (same dayKey pattern as goals-data.js). A new day clears the saved plan
// so CarePlansTab shows the "Generate" CTA again.

const PLAN_KEY = "afterbloom_care_plan";

function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getCarePlanState() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const state = JSON.parse(window.localStorage.getItem(PLAN_KEY) || "null");
    if (!state || state.dateKey !== dayKey()) return null;
    return state;
  } catch {
    return null;
  }
}

export function saveCarePlanState(plan, completedHabitKeys) {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.setItem(
    PLAN_KEY,
    JSON.stringify({ plan, completedHabitKeys, dateKey: dayKey() })
  );
}

export function clearCarePlanState() {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.removeItem(PLAN_KEY);
}
