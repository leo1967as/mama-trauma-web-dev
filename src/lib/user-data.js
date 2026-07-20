const KEY = "afterbloom_onboarding";

export function mergeFirestoreProfile(profile = {}, existing = {}) {
  const pick = (...keys) => keys.map((key) => profile[key]).find((value) => value !== undefined);
  const mapped = Object.fromEntries([
    ["mother_name", pick("mother_name", "motherName", "name")],
    ["legal_first_name", pick("legal_first_name", "legalFirstName")],
    ["legal_last_name", pick("legal_last_name", "legalLastName")],
    ["preferred_name", pick("preferred_name", "preferredName")],
    ["phone", profile.phone],
    ["baby_birth_date", pick("baby_birth_date", "delivery_date", "deliveryDate")],
    ["is_first_time_mother", pick("is_first_time_mother", "isFirstTimeMother")],
    ["preferred_checkin_time", pick("preferred_checkin_time", "preferredCheckinTime")],
    ["health_data_consent", pick("health_data_consent", "healthDataConsent")],
    ["consent_at", pick("consent_at", "consentAt")],
  ].filter(([, value]) => value !== undefined));
  return { ...mapped, ...existing, complete: existing.complete === true || Object.keys(mapped).length > 0 };
}

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
  return data?.preferred_name || data?.mother_name || data?.legal_first_name || "คุณแม่";
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

export function getSelectedTinyGoal() {
  return getOnboardingData()?.selected_tiny_goal || null;
}

export function getPostpartumDay(today = new Date()) {
  const bd = getOnboardingData()?.baby_birth_date;
  if (!bd) return null;
  const [year, month, day] = bd.slice(0, 10).split("-").map(Number);
  const birthDay = Date.UTC(year, month - 1, day);
  if (!year || !month || !day || Number.isNaN(birthDay)) return null;
  const currentDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(1, Math.floor((currentDay - birthDay) / 86400000) + 1);
}

export function getDayLabel(lang = "en") {
  const postpartumDay = getPostpartumDay();
  const d = new Date();
  const locale = lang === "th" ? "th-TH" : "en-US";
  const weekday = d.toLocaleDateString(locale, { weekday: "long" });
  const month = d.toLocaleDateString(locale, { month: "short" });
  const day = d.getDate();
  const dayNum = lang === "th"
    ? `วันที่ ${postpartumDay ?? 1}`
    : `Day ${postpartumDay ?? 1}`;
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
  { label: "Day 1-3", weekLabel: "First Days", phase: "First Days", desc: "Hormones shifting — tears are normal", pct: 1, maxDay: 3 },
  { label: "Day 4-7", weekLabel: "Early Adjustment", phase: "Early Adjustment", desc: "Milk may come in — emotions start to adjust", pct: 2, maxDay: 7 },
  { label: "Week 2-3", weekLabel: "Week 2-3", phase: "Week 2-3", desc: "Many mothers feel emotionally sensitive during this period.", pct: 6, maxDay: 21 },
  { label: "Week 4-6", weekLabel: "Week 4-6", phase: "Week 4-6", desc: "A good time to check in with your doctor", pct: 12, maxDay: 42 },
  { label: "Month 2-3", weekLabel: "Month 2-3", phase: "Month 2-3", desc: "Many mothers feel more like themselves", pct: 25, maxDay: 90 },
  { label: "Month 4-5", weekLabel: "Month 4-5", phase: "Month 4-5", desc: "Routines may shift again", pct: 41, maxDay: 150 },
  { label: "Month 6", weekLabel: "Month 6", phase: "Month 6", desc: "Another period of change", pct: 49, maxDay: 180 },
  { label: "Month 7-9", weekLabel: "Month 7-9", phase: "Month 7-9", desc: "Keep checking in with yourself", pct: 74, maxDay: 270 },
  { label: "Month 10-12", weekLabel: "Month 10-12", phase: "Month 10-12", desc: "Reflecting on your first year", pct: 100, maxDay: 365 },
];

export function getCurrentStage(postpartumDay = getPostpartumDay()) {
  const d = postpartumDay ?? 1;
  const foundIndex = STAGES.findIndex((stage) => d <= stage.maxDay);
  // ponytail: clamp after Day 365 until a year-two clinical spec exists.
  const stageIndex = foundIndex === -1 ? STAGES.length - 1 : foundIndex;
  return { ...STAGES[stageIndex], stageIndex, days: d };
}
