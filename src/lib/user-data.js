const KEY = "moji_onboarding";

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
  return getOnboardingData()?.displayName || "Mama";
}

export function getDaysSinceBirth() {
  const bd = getOnboardingData()?.birthDate;
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
  localStorage.setItem("moji_just_onboarded", "1");
}

export function consumeJustOnboarded() {
  const v = localStorage.getItem("moji_just_onboarded") === "1";
  localStorage.removeItem("moji_just_onboarded");
  return v;
}

export function getCurrentStage() {
  const days = getDaysSinceBirth();
  if (days === null) return { label: "Day 7", weekLabel: "Week 1 · Day 7", phase: "Finding Rhythm", desc: "Building small routines, some relief", pct: 25, nodeIndex: 2 };
  if (days <= 2)  return { label: "Day 1",   weekLabel: "Week 1 · Day 1",  phase: "Baby Blues Zone",    desc: "Hormones shifting — tears are normal",        pct: 5,  nodeIndex: 0 };
  if (days <= 6)  return { label: "Day 3",   weekLabel: "Week 1 · Day 3",  phase: "Peak Adjustment",    desc: "Milk may come in — emotions intensify",       pct: 15, nodeIndex: 1 };
  if (days <= 13) return { label: "Day 7",   weekLabel: "Week 1 · Day 7",  phase: "Finding Rhythm",     desc: "Building small routines, some relief",        pct: 25, nodeIndex: 2 };
  if (days <= 20) return { label: "Week 2",  weekLabel: "Week 2",          phase: "Settling In",        desc: "Baby blues should start to ease",             pct: 45, nodeIndex: 3 };
  if (days <= 29) return { label: "Week 3",  weekLabel: "Week 3",          phase: "Growing Confidence", desc: "Trust your instincts, mama",                  pct: 65, nodeIndex: 4 };
  return              { label: "Month 1", weekLabel: "Month 1",         phase: "New Normal",         desc: "If sadness persists, reach out",              pct: 90, nodeIndex: 5 };
}
