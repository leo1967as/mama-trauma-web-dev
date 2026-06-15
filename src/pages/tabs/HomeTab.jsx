import { lazy, Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

const MoodTrendChart = lazy(() => import("../../components/afterbloom/MoodTrendChart"));
import { getMoodHistory, getMoodSummary, getMoodSupportSummary, getMoodChartData, hasMoodChartData, subscribeToMoodHistory, getSafetyLog } from "../../lib/mood-data";
import { getDisplayName, getDayLabel, consumeJustOnboarded, getOnboardingData, saveOnboarding, getPreferredCheckinTime } from "../../lib/user-data";
import { isEpdsDue, getDaysUntilNextEpds, getEpdsHistory } from "../../lib/epds-data";
import { syncAlerts, getOpenAlerts, resolveAlert } from "../../lib/alert-service";
import DatePicker from "../../components/afterbloom/DatePicker";
import CareTimeline from "../../components/afterbloom/CareTimeline";
import DailyGoal from "../../components/afterbloom/DailyGoal";
import CheckInBtn from "../../components/afterbloom/CheckInBtn";

const FONT_BODY = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_SERIF = "'Newsreader', serif";

function heroHeading(hasTodayCheckIn, todayMood) {
  if (!hasTodayCheckIn) return "How are you feeling today?";
  if (todayMood === null || todayMood === undefined) return "Check in with yourself today.";
  if (todayMood <= 2) return "Today felt like a heavier day.";
  if (todayMood === 3) return "Today felt like an okay day.";
  return "Today felt like a lighter day.";
}

const ALERT_LABELS = {
  support_request: "Support Need request",
  low_trend_3day: "3-day low mood trend",
  safety_access: "Safety resources accessed",
  epds_immediate: "EPDS immediate-risk flag",
};

// "08:00" -> "8:00 AM" (mock reminder copy only; no real notification)
function formatReminderTime(t) {
  if (!t || !/^\d{1,2}:\d{2}$/.test(t)) return null;
  const [h, m] = t.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}


export default function HomeTab({ onNavigate, onCheckIn, onEpds, onSecretTap }) {
  const [moodEntries, setMoodEntries] = useState([]);
  const [showSliders, setShowSliders] = useState(false);
  const [justOnboarded] = useState(() => consumeJustOnboarded());
  const [speed, setSpeed]   = useState(14);
  const [warmth, setWarmth] = useState(90);
  const [size, setSize]     = useState(60);
  // settings panel
  const [showSettings, setShowSettings] = useState(false);
  const [settingsName, setSettingsName] = useState(() => getOnboardingData().mother_name || "");
  const [settingsBirthDate, setSettingsBirthDate] = useState(() => getOnboardingData().baby_birth_date || "");
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsShowDate, setSettingsShowDate] = useState(false);
  const [openAlerts, setOpenAlerts] = useState([]);

  useEffect(() => {
    setMoodEntries(getMoodHistory());
    const unsub = subscribeToMoodHistory(setMoodEntries);
    return unsub;
  }, []);

  const handleResolveAlert = (id) => {
    resolveAlert(id);
    setOpenAlerts(getOpenAlerts());
  };

  const moodSummary = getMoodSummary(moodEntries);
  const todayMood = moodSummary.todayEntry?.moodScore ?? null;
  const supportSummary = getMoodSupportSummary(moodEntries);
  const trendData = getMoodChartData(moodEntries, 7);
  const showTrend = hasMoodChartData(trendData);
  const reminderTime = formatReminderTime(getPreferredCheckinTime());

  // blob params from sliders
  const blur   = size;                        // size slider reused as blur (40–100px)
  const alpha  = (warmth / 100 * 0.82 + 0.08).toFixed(2); // 0.08–0.90
  const sp1 = speed * 1.0, sp2 = speed * 1.3, sp3 = speed * 0.8, sp4 = speed * 1.5;

  return (
    <div style={{ fontFamily: FONT_BODY }}>

      {/* ── Dawn header — cream base + slow blobs ── */}
      <div
        className="relative px-6 pb-8 overflow-hidden"
        style={{
          background: "#FBF2EC",
          "--blob-speed-1": `${sp1}s`,
          "--blob-speed-2": `${sp2}s`,
          "--blob-speed-3": `${sp3}s`,
          "--blob-speed-4": `${sp4}s`,
        }}
      >
        {/* blob 1 — peach, top-right, biggest */}
        <div className="dawn-blob dawn-blob-1" style={{ width: 360, height: 360, top: -120, right: -80,  background: `radial-gradient(circle, rgba(244,201,168,${alpha}), transparent 68%)`, filter: `blur(${blur}px)` }} />
        {/* blob 2 — rose, left side */}
        <div className="dawn-blob dawn-blob-2" style={{ width: 300, height: 300, top:   10, left: -90,  background: `radial-gradient(circle, rgba(226,160,164,${alpha}), transparent 68%)`, filter: `blur(${blur * 0.9}px)` }} />
        {/* blob 3 — dusty rose, bottom-center */}
        <div className="dawn-blob dawn-blob-3" style={{ width: 280, height: 280, bottom: -60, left: "30%", background: `radial-gradient(circle, rgba(215,160,171,${alpha}), transparent 68%)`, filter: `blur(${blur * 0.85}px)` }} />
        {/* blob 4 — salmon, top-center, smaller accent */}
        <div className="dawn-blob dawn-blob-4" style={{ width: 220, height: 220, top:  30, left: "45%", background: `radial-gradient(circle, rgba(238,182,164,${alpha * 0.9}), transparent 68%)`, filter: `blur(${blur * 0.75}px)` }} />
        {/* dbar */}
        <div className="relative flex items-center justify-between pt-3.5">
          <span
            className="text-[11px] font-black uppercase tracking-[0.18em] cursor-default select-none"
            style={{ color: "#8A4F4C" }}
            onClick={onSecretTap}
          >
            {getDayLabel()}
          </span>
          <div className="flex gap-2">
            <button
              className="relative w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,.42)", border: "1px solid rgba(255,255,255,.6)", color: "#7A453F" }}
            >
              <span className="absolute rounded-full" style={{ top: 8, right: 9, width: 7, height: 7, background: "#AF636A", border: "1.5px solid #fff" }} />
              <svg viewBox="0 0 24 24" width="17" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M6 8a6 6 0 0112 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10 21a2 2 0 004 0"/>
              </svg>
            </button>
            <button
              onClick={() => {
                setShowSettings(s => {
                  const next = !s;
                  if (next) {
                    syncAlerts(getMoodHistory(), getEpdsHistory(), getSafetyLog());
                    setOpenAlerts(getOpenAlerts());
                  }
                  return next;
                });
                setSettingsShowDate(false);
                setSettingsSaved(false);
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: showSettings ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.42)", border: "1px solid rgba(255,255,255,.6)", color: "#7A453F" }}
            >
              <SlidersHorizontal size={16} strokeWidth={1.9} />
            </button>
          </div>
        </div>

        {/* settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-2xl flex flex-col gap-3" style={{ background: "rgba(255,255,255,.62)", backdropFilter: "blur(12px)", padding: "16px 16px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8A4F4C" }}>My Profile</div>

                {/* name field */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#7A453F", marginBottom: 5 }}>Name</div>
                  <input
                    type="text" placeholder="Your name" maxLength={30}
                    value={settingsName}
                    onChange={e => { setSettingsName(e.target.value); setSettingsSaved(false); }}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13.5, fontFamily: FONT_BODY, background: "rgba(255,255,255,.8)", border: "1px solid rgba(239,230,220,.8)", borderRadius: 12, color: "#3E342C", outline: "none" }}
                  />
                </div>

                {/* birth date field */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#7A453F", marginBottom: 5 }}>Baby's arrival date</div>
                  <button
                    onClick={() => setSettingsShowDate(s => !s)}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13.5, fontFamily: FONT_BODY, background: "rgba(255,255,255,.8)", border: "1px solid rgba(239,230,220,.8)", borderRadius: 12, color: settingsBirthDate ? "#3E342C" : "#9C8E83", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <span>{settingsBirthDate ? new Date(settingsBirthDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Not set"}</span>
                    <span style={{ fontSize: 11, color: "#AF636A", fontWeight: 700 }}>{settingsShowDate ? "Close" : "Change"}</span>
                  </button>
                  <AnimatePresence>
                    {settingsShowDate && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden" style={{ marginTop: 8 }}>
                        <DatePicker value={settingsBirthDate} onChange={v => { setSettingsBirthDate(v); setSettingsSaved(false); }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* save button */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => {
                    saveOnboarding({ mother_name: settingsName || "", baby_birth_date: settingsBirthDate || null });
                    setSettingsSaved(true);
                    setSettingsShowDate(false);
                    setTimeout(() => { setSettingsSaved(false); setShowSettings(false); }, 1200);
                  }}
                  style={{ padding: "11px 0", borderRadius: 12, background: settingsSaved ? "#83A48B" : "#C77E83", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: FONT_BODY, border: 0, cursor: "pointer", transition: "background 0.2s" }}
                >
                  {settingsSaved ? "Saved ✓" : "Save changes"}
                </motion.button>

                {/* Care Team (Demo) — mock hospital dashboard, resolves alerts so suppressed Support Need prompts can re-show */}
                <div style={{ borderTop: "1px solid rgba(239,230,220,.8)", paddingTop: 12, marginTop: 4 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8A4F4C", marginBottom: 8 }}>
                    Care Team (Demo)
                  </div>
                  {openAlerts.length === 0 ? (
                    <p style={{ fontSize: 12, color: "#9C8E83" }}>No open alerts.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {openAlerts.map((alert) => (
                        <div key={alert.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "9px 12px", background: "rgba(255,255,255,.8)", border: "1px solid rgba(239,230,220,.8)", borderRadius: 12 }}>
                          <div>
                            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#3E342C" }}>{ALERT_LABELS[alert.type] || alert.type}</div>
                            <div style={{ fontSize: 11, color: "#9C8E83" }}>{alert.dateKey}</div>
                          </div>
                          <button
                            onClick={() => handleResolveAlert(alert.id)}
                            style={{ fontSize: 11.5, fontWeight: 700, color: "#5E8169", background: "#EAF1EC", border: 0, borderRadius: 10, padding: "7px 12px", cursor: "pointer" }}
                          >
                            Mark resolved
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* hello */}
        <div className="relative mt-[26px]">
          <h1 className="font-medium leading-none tracking-[-0.015em]" style={{ fontFamily: FONT_SERIF, fontSize: 42, color: "#4A2F2C" }}>
            Good morning,
            <em className="block" style={{ fontStyle: "italic" }}>{getDisplayName()}.</em>
          </h1>
          <p className="mt-3.5 text-[15px] font-semibold max-w-[78%]" style={{ color: "#7A453F" }}>
            You're finding your rhythm — one gentle day at a time.
          </p>
        </div>

        {/* bottom fade — always blends into sheet no matter where gradient animates */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: 64,
            background: "linear-gradient(to bottom, transparent 0%, #FBF6F0 100%)",
          }}
        />
      </div>

      {/* ── Sheet ── */}
      <div
        className="px-[22px] pt-6"
        style={{ background: "#FBF6F0", borderRadius: "26px 26px 0 0", marginTop: -16 }}
      >

        {/* Hero check-in card */}
        <div
          className="relative rounded-[28px] px-[22px] py-7 overflow-hidden"
          style={{ background: "#fff", boxShadow: "0 12px 32px rgba(80,56,42,.09)" }}
        >
          <div className="absolute pointer-events-none" style={{ right: -40, bottom: -40, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle,#FBEDEC,transparent 70%)" }} />

          {justOnboarded ? (
            /* ── Welcome state (first open after onboarding) ── */
            <>
              <span className="inline-flex items-center gap-[7px] text-[10.5px] font-black uppercase tracking-[0.1em] rounded-full relative" style={{ padding: "7px 13px", background: "#E7EFE8", color: "#577A62", marginBottom: 16 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: 13, height: 13 }}><path d="M5 13l4 4L19 7"/></svg>
                Journey started
              </span>
              <h2 className="relative font-medium leading-[1.22] tracking-[-0.01em]" style={{ fontFamily: FONT_SERIF, fontSize: 25, color: "#3E342C", marginBottom: 10, marginTop: 12 }}>
                Your first check-in<br />starts your baseline.
              </h2>
              <p className="relative text-[13.5px] leading-[1.6] max-w-[90%]" style={{ color: "#6C5F56", marginBottom: 22 }}>
                Just 30 seconds — mood, sleep, and how you feel today. That's all we need.
              </p>
              <CheckInBtn label="Take your first check-in" onCheckIn={onCheckIn} />
            </>
          ) : (
            /* ── Normal check-in state ── */
            <>
              <div className="flex items-center justify-between relative" style={{ marginBottom: 16 }}>
                {moodSummary.hasTodayCheckIn ? (
                  <span className="inline-flex items-center gap-[7px] text-[10.5px] font-black uppercase tracking-[0.1em] rounded-full" style={{ padding: "7px 13px", background: "#E7EFE8", color: "#577A62" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: 13, height: 13 }}><path d="M5 13l4 4L19 7"/></svg>
                    Check-in saved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-[7px] text-[10.5px] font-black uppercase tracking-[0.1em] rounded-full" style={{ padding: "7px 13px", background: "#F6E2E1", color: "#AF636A" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}><circle cx="12" cy="12" r="8"/><path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5M9 9h.01M15 9h.01"/></svg>
                    Check in now
                  </span>
                )}
                {moodSummary.hasTodayCheckIn && <span className="text-[11px] font-bold" style={{ color: "#9C8E83" }}>Logged today</span>}
              </div>
              <h2 className="relative font-medium leading-[1.22] tracking-[-0.01em]" style={{ fontFamily: FONT_SERIF, fontSize: 25, color: "#3E342C", marginBottom: 10 }}>
                {heroHeading(moodSummary.hasTodayCheckIn, todayMood)}
              </h2>
              <p className="relative text-[13.5px] leading-[1.6] max-w-[90%]" style={{ color: "#6C5F56", marginBottom: 22 }}>
                {moodSummary.hasTodayCheckIn
                  ? "Thank you for being honest with yourself. You can update it anytime if something shifts."
                  : "A quick mood check-in keeps support gentle, early, and easier to understand."}
              </p>
              <CheckInBtn
                label={moodSummary.hasTodayCheckIn ? "Edit today's check-in" : "Complete today's check-in"}
                onCheckIn={onCheckIn}
              />
              {!moodSummary.hasTodayCheckIn && reminderTime && (
                <p className="relative text-[12px] mt-3 flex items-center gap-1.5" style={{ color: "#9C8E83" }}>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                  We'll gently nudge you around {reminderTime}.
                </p>
              )}
            </>
          )}
        </div>

        {/* slabel: Care journey */}
        <div
          className="flex items-center justify-between mx-1"
          style={{ marginTop: 24, marginBottom: 11 }}
        >
          <span
            className="text-[11px] font-black uppercase tracking-[0.15em]"
            style={{ color: "#9C8E83" }}
          >
            Care journey
          </span>
          <a
            className="inline-flex items-center gap-1 text-[12px] font-bold cursor-pointer"
            style={{ color: "#AF636A" }}
          >
            View full →
          </a>
        </div>

        {/* ribbon */}
        <CareTimeline />

        {/* Support card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          style={{
            marginTop: 13,
            display: "flex", alignItems: "center", gap: 14,
            width: "100%", padding: "16px 18px",
            background: "#fff", border: "1px solid #EFE6DC",
            borderRadius: 22, cursor: "pointer", textAlign: "left",
            fontFamily: FONT_BODY,
            boxShadow: "0 2px 10px rgba(80,56,42,.05)",
          }}
        >
          {/* blush icon tile */}
          <span style={{
            width: 42, height: 42, borderRadius: 14,
            background: "#F6E2E1", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" width="18" fill="none" stroke="#C77E83" strokeWidth="1.9">
              <path d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>
            </svg>
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: "block", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 4 }}>Today's Support Level</span>
            <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#3E342C" }}>{supportSummary.label}</span>
            <span style={{ display: "block", fontSize: 12, color: "#9C8E83", marginTop: 2 }}>{supportSummary.message}</span>
          </span>
          <svg viewBox="0 0 24 24" width="15" fill="none" stroke="#C8BEB8" strokeWidth="2">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </motion.button>

        {/* 7-day mood trend */}
        <div style={{ marginTop: 13, background: "#fff", border: "1px solid #EFE6DC", borderRadius: 22, padding: "18px 18px 12px", boxShadow: "0 2px 10px rgba(80,56,42,.05)", fontFamily: FONT_BODY }}>
          <span style={{ display: "block", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 10 }}>7-day mood trend</span>
          {showTrend ? (
            <Suspense fallback={<div style={{ height: 96 }} />}>
              <MoodTrendChart data={trendData} height={96} />
            </Suspense>
          ) : (
            <p style={{ fontSize: 12.5, color: "#9C8E83", lineHeight: 1.55, padding: "8px 2px 12px" }}>
              Your trend will appear here once you check in a few times.
            </p>
          )}
        </div>

        {/* Emotional Check (EPDS) entry */}
        <motion.button
          onClick={() => onEpds?.()}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          style={{ marginTop: 13, display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px 18px", background: "#fff", border: "1px solid #EFE6DC", borderRadius: 22, cursor: "pointer", textAlign: "left", fontFamily: FONT_BODY, boxShadow: "0 2px 10px rgba(80,56,42,.05)" }}
        >
          <span style={{ width: 42, height: 42, borderRadius: 14, background: "#EAF1EC", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width="18" fill="none" stroke="#5E8169" strokeWidth="1.9"><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z"/></svg>
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: "block", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 4 }}>Emotional Check</span>
            <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#3E342C" }}>{isEpdsDue() ? "A gentle 10-question check-in" : "You're up to date 💛"}</span>
            <span style={{ display: "block", fontSize: 12, color: "#9C8E83", marginTop: 2 }}>{isEpdsDue() ? "Takes about 2 minutes, just for you." : `Next suggested in ${getDaysUntilNextEpds()} days.`}</span>
          </span>
          <svg viewBox="0 0 24 24" width="15" fill="none" stroke="#C8BEB8" strokeWidth="2"><path d="M9 6l6 6-6 6"/></svg>
        </motion.button>

        {/* Daily goal — main warm element */}
        <div style={{ marginTop: 13 }}>
          <DailyGoal level={supportSummary.level} />
        </div>

        {/* vspace */}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}





