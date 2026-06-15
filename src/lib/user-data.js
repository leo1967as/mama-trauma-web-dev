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
  return getOnboardingData()?.mother_name || "there";
}

export function getIsFirstTimeMother() {
  return getOnboardingData()?.is_first_time_mother ?? null;
}

export function getPreferredCheckinTime() {
  return getOnboardingData()?.preferred_checkin_time || null;
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

// Ordered postpartum journey stages. Anchors per spec: day14=Week2, day42=Week6, day90=Month3.
export const STAGES = [
  { label: "Day 1",    weekLabel: "Week 1 · Day 1", phase: "Baby Blues Zone",        desc: "Hormones shifting — tears are normal",            pct: 5,   maxDay: 2 },
  { label: "Day 3",    weekLabel: "Week 1 · Day 3", phase: "Peak Adjustment",        desc: "Milk may come in — emotions intensify",           pct: 15,  maxDay: 6 },
  { label: "Day 7",    weekLabel: "Week 1 · Day 7", phase: "Finding Rhythm",         desc: "Building small routines, some relief",            pct: 25,  maxDay: 13 },
  { label: "Week 2",   weekLabel: "Week 2",         phase: "Settling In",            desc: "Baby blues should start to ease",                 pct: 35,  maxDay: 20 },
  { label: "Week 3",   weekLabel: "Week 3",         phase: "Growing Confidence",     desc: "Trust your instincts",                            pct: 45,  maxDay: 27 },
  { label: "Week 4",   weekLabel: "Week 4",         phase: "Hitting Your Stride",    desc: "Routines feel more familiar now",                 pct: 55,  maxDay: 34 },
  { label: "Week 5",   weekLabel: "Week 5",         phase: "Steadier Days",          desc: "Energy may slowly start returning",               pct: 65,  maxDay: 41 },
  { label: "Week 6",   weekLabel: "Week 6",         phase: "Six-Week Milestone",     desc: "A good time to check in with your doctor",        pct: 75,  maxDay: 48 },
  { label: "Month 2",  weekLabel: "Month 2",        phase: "New Normal",             desc: "If sadness persists, reach out",                  pct: 88,  maxDay: 78 },
  { label: "Month 3",  weekLabel: "Month 3",        phase: "Finding Your Footing",   desc: "Many mothers feel more like themselves",          pct: 100, maxDay: 90 },
  { label: "Month 4+", weekLabel: "Month 4+",       phase: "Continuing the Journey", desc: "Keep checking in — you're doing great",           pct: 100, maxDay: Infinity },
];

export function getCurrentStage() {
  const days = getDaysSinceBirth();
  const d = days === null ? 7 : days;
  const stageIndex = STAGES.findIndex((stage) => d <= stage.maxDay);
  return { ...STAGES[stageIndex], stageIndex, days: d };
}


