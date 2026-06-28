// Tracks the lifecycle of a Support Need (spec 3.9) prompt so it doesn't
// re-show every check-in (habituation) once answered.
import { getAlerts } from "./alert-service";
import { doc, getDoc } from "firebase/firestore";
import { db, getUid } from "./firebase";

const KEY = "afterbloom_support_episode";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read() {
  if (!canUseStorage()) return null;
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

function write(episode) {
  if (!canUseStorage()) return;
  if (episode === null) {
    window.localStorage.removeItem(KEY);
    return;
  }
  window.localStorage.setItem(KEY, JSON.stringify(episode));
}

function addDays(dateKey, days) {
  const d = new Date(`${dateKey}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Called when the Care Team has resolved the episode (e.g. via deep link).
export function clearSupportEpisode() {
  write(null);
}

// Poll the patient's own Firestore doc for care-team resolution.
// Fire-and-forget: call on app mount; clears episode silently if resolved.
export async function checkAndClearIfResolved() {
  const episode = read();
  if (!episode || episode.status !== "pending_resolution") return;
  try {
    const uid = await getUid();
    const snap = await getDoc(doc(db, "mothers", uid));
    if (snap.exists() && snap.data().caseStatus === "resolved") {
      write(null);
    }
  } catch {
    // offline or permission error — ignore, will retry next load
  }
}

// Record the mother's answer to the Support Need prompt.
// "Yes, please" -> suppress until the linked alert is resolved by Care Team.
// "Not right now" -> suppress for a 3-day cooldown.
export function recordSupportAnswer(answer, dateKey, alertId) {
  if (answer === true) {
    write({ status: "pending_resolution", alertId, answeredDateKey: dateKey });
  } else {
    write({ status: "snoozed", snoozeUntilDateKey: addDays(dateKey, 3), answeredDateKey: dateKey });
  }
}

// Whether the Support Need prompt should stay hidden today.
export function isSupportEpisodeSuppressed(todayDateKey) {
  const episode = read();
  if (!episode) return false;

  if (episode.status === "pending_resolution") {
    const alert = getAlerts().find((a) => a.id === episode.alertId);
    if (alert?.resolved) {
      write(null);
      return false;
    }
    return true;
  }

  if (episode.status === "snoozed") {
    if (todayDateKey < episode.snoozeUntilDateKey) return true;
    write(null);
    return false;
  }

  return false;
}
