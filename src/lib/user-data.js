const KEY = "afterbloom_onboarding";

export function getOnboardingData() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

export function saveOnboarding(data) {
  localStorage.setItem(KEY, JSON.stringify({ ...getOnboardingData(), ...data, complete: true }));
}

export function isOnboarded() {
  return getOnboardingData()?.complete === true;
}

export function getDisplayName() {
  const data = getOnboardingData();
  return data?.preferred_name || data?.mother_name || data?.legal_first_name || "there";
}

export function getLegalFullName() {
  const data = getOnboardingData();
  return [data?.legal_first_name, data?.legal_last_name].filter(Boolean).join(" ").trim();
}

export function getProfilePhone() {
  return getOnboardingData()?.phone || "";
}

export function getIsFirstTimeMother() {
  return getOnboardingData()?.is_first_time_mother ?? null;
}

export function getPreferredCheckinTime() {
  return getOnboardingData()?.preferred_checkin_time || null;
}

export function getHeaderMotion() {
  return getOnboardingData()?.header_motion || "blobs";
}

export function getDaysSinceBirth() {
  const bd = getOnboardingData()?.baby_birth_date;
  if (!bd) return null;
  const diff = Math.floor((Date.now() - new Date(bd)) / 86400000);
  return Math.max(0, diff);
}

export function getDayLabel() {
  const days = getDaysSinceBirth();
  const d = new Date();
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  const dayNum = days !== null ? `Day ${days + 1}` : "Day 1";
  return `${weekday} · ${month} ${day} · ${dayNum}`;
}

export function setJustOnboarded() {
  localStorage.setItem("afterbloom_just_onboarded", "1");
}

export function consumeJustOnboarded() {
  const v = localStorage.getItem("afterbloom_just_onboarded") === "1";
  localStorage.removeItem("afterbloom_just_onboarded");
  return v;
}

// Ordered postpartum journey stages as per Afterbloom_DailyCheckin_Spec.
export const STAGES = [
  { label: "First Days", weekLabel: "First Days", phase: "First Days", desc: "Hormones shifting — tears are normal", pct: 5, maxDay: 3 },
  { label: "Early Adj.", weekLabel: "Early Adjustment", phase: "Early Adjustment", desc: "Milk may come in — emotions start to adjust", pct: 15, maxDay: 13 },
  { label: "Week 2", weekLabel: "Week 2 Checkpoint", phase: "Week 2 Checkpoint", desc: "Many mothers feel emotionally sensitive during this period.", pct: 25, maxDay: 21 },
  { label: "First 6 Weeks", weekLabel: "First 6 Weeks", phase: "First 6 Weeks", desc: "A good time to check in with your doctor", pct: 40, maxDay: 42 },
  { label: "Month 2-3", weekLabel: "Settling Phase", phase: "Settling Phase", desc: "Many mothers feel more like themselves", pct: 60, maxDay: 90 },
  { label: "Month 4-6", weekLabel: "Returning Rhythm", phase: "Returning Rhythm", desc: "Routines feel more familiar now", pct: 75, maxDay: 180 },
  { label: "Month 7-9", weekLabel: "Late Emotional Check", phase: "Late Emotional Check", desc: "Keep checking in — you're doing great", pct: 90, maxDay: 270 },
  { label: "Month 10-12", weekLabel: "First Year Reflection", phase: "First Year Reflection", desc: "Reflecting on your journey", pct: 100, maxDay: 365 },
  { label: "Year 1+", weekLabel: "Continuing the Journey", phase: "Continuing the Journey", desc: "Keep checking in — you're doing great", pct: 100, maxDay: Infinity },
];

export function getCurrentStage() {
  const days = getDaysSinceBirth();
  const d = days === null ? 7 : days;
  const stageIndex = STAGES.findIndex((stage) => d <= stage.maxDay);
  return { ...STAGES[stageIndex], stageIndex, days: d };
}

