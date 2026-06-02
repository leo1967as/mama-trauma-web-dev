import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, SlidersHorizontal } from "lucide-react";
import { getMoodHistory, getMoodSummary, getMoodRiskSummary, subscribeToMoodHistory } from "../../lib/mood-data";
import CareTimeline from "../../components/calmmama/CareTimeline";
import DailyGoal from "../../components/calmmama/DailyGoal";
import CheckInBtn from "../../components/calmmama/CheckInBtn";

const FONT_BODY = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_SERIF = "'Newsreader', serif";

function heroHeading(hasTodayCheckIn, todayMood) {
  if (!hasTodayCheckIn) return "How are you feeling today?";
  if (todayMood === null || todayMood === undefined) return "Check in with yourself today.";
  if (todayMood <= 2) return "Today felt like a heavier day.";
  if (todayMood === 3) return "Today felt like an okay day.";
  return "Today felt like a lighter day.";
}

function getDayLabel() {
  const d = new Date();
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  return `${weekday} · ${month} ${day} · Day 7`;
}

export default function HomeTab({ onNavigate, onCheckIn, onSecretTap }) {
  const [moodEntries, setMoodEntries] = useState([]);
  const [showSliders, setShowSliders] = useState(false);
  const [speed, setSpeed]   = useState(14);   // base duration seconds (12–60)
  const [warmth, setWarmth] = useState(90);   // blob opacity 0–100
  const [size, setSize]     = useState(60);   // blur px 40–100

  useEffect(() => {
    setMoodEntries(getMoodHistory());
    const unsub = subscribeToMoodHistory(setMoodEntries);
    return unsub;
  }, []);

  const moodSummary = getMoodSummary(moodEntries);
  const todayMood = moodSummary.todayEntry?.moodScore ?? null;
  const riskLevel = getMoodRiskSummary(moodEntries).level;
  const showSupport = ["orange", "red"].includes(riskLevel);

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
              onClick={() => setShowSliders(s => !s)}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: showSliders ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.42)", border: "1px solid rgba(255,255,255,.6)", color: "#7A453F" }}
            >
              <SlidersHorizontal size={16} strokeWidth={1.9} />
            </button>
          </div>
        </div>

        {/* slider panel */}
        <AnimatePresence>
          {showSliders && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="overflow-hidden"
            >
              <div
                className="mt-3 rounded-2xl px-4 py-3 flex flex-col gap-3"
                style={{ background: "rgba(255,255,255,.55)", backdropFilter: "blur(8px)" }}
              >
                {[
                  { label: "Speed",   value: speed,  min: 12, max: 60,  step: 2,  set: setSpeed,  fmt: v => v <= 18 ? "Fast" : v <= 36 ? "Medium" : "Slow", flip: true },
                  { label: "Warmth",  value: warmth, min: 20, max: 100, step: 5,  set: setWarmth, fmt: v => `${v}%` },
                  { label: "Softness",value: size,   min: 40, max: 100, step: 5,  set: setSize,   fmt: v => `${v}px` },
                ].map(({ label, value, min, max, step, set, fmt, flip }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#7A453F" }}>{label}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#AF636A" }}>{fmt(value)}</span>
                    </div>
                    <input
                      type="range" min={min} max={max} step={step}
                      value={flip ? max + min - value : value}
                      onChange={e => set(flip ? max + min - Number(e.target.value) : Number(e.target.value))}
                      className="dawn-slider-thumb w-full appearance-none rounded-full cursor-pointer"
                      style={{ height: 5, background: `linear-gradient(to right,#C77E83 0%,#C77E83 ${((value-min)/(max-min))*100}%,rgba(0,0,0,.12) ${((value-min)/(max-min))*100}%,rgba(0,0,0,.12) 100%)` }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* hello */}
        <div className="relative mt-[26px]">
          <h1 className="font-medium leading-none tracking-[-0.015em]" style={{ fontFamily: FONT_SERIF, fontSize: 42, color: "#4A2F2C" }}>
            Good morning,
            <em className="block" style={{ fontStyle: "italic" }}>Mama.</em>
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
          className="relative rounded-[28px] px-[22px] py-6 overflow-hidden"
          style={{ background: "#fff", boxShadow: "0 12px 32px rgba(80,56,42,.09)" }}
        >
          {/* rose circle deco */}
          <div
            className="absolute pointer-events-none"
            style={{
              right: -40, bottom: -40, width: 150, height: 150,
              borderRadius: "50%",
              background: "radial-gradient(circle,#FBEDEC,transparent 70%)",
            }}
          />

          {/* tagrow */}
          <div className="flex items-center justify-between relative" style={{ marginBottom: 16 }}>
            {moodSummary.hasTodayCheckIn ? (
              <span
                className="inline-flex items-center gap-[7px] text-[10.5px] font-black uppercase tracking-[0.1em] rounded-full"
                style={{ padding: "7px 13px", background: "#E7EFE8", color: "#577A62" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: 13, height: 13 }}>
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                Check-in saved
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-[7px] text-[10.5px] font-black uppercase tracking-[0.1em] rounded-full"
                style={{ padding: "7px 13px", background: "#F6E2E1", color: "#AF636A" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
                  <circle cx="12" cy="12" r="8"/><path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5M9 9h.01M15 9h.01"/>
                </svg>
                Check in now
              </span>
            )}
            {moodSummary.hasTodayCheckIn && (
              <span className="text-[11px] font-bold" style={{ color: "#9C8E83" }}>Logged today</span>
            )}
          </div>

          {/* h2 */}
          <h2
            className="relative font-medium leading-[1.22] tracking-[-0.01em]"
            style={{ fontFamily: FONT_SERIF, fontSize: 25, color: "#3E342C", marginBottom: 8 }}
          >
            {heroHeading(moodSummary.hasTodayCheckIn, todayMood)}
          </h2>

          {/* p */}
          <p
            className="relative text-[13.5px] leading-[1.55] max-w-[90%]"
            style={{ color: "#6C5F56", marginBottom: 20 }}
          >
            {moodSummary.hasTodayCheckIn
              ? "Thank you for being honest with yourself. You can update it anytime if something shifts."
              : "A quick mood check-in keeps support gentle, early, and easier to understand."}
          </p>

          {/* check-in button */}
          <CheckInBtn
            label={moodSummary.hasTodayCheckIn ? "Edit today's check-in" : "Complete today's check-in"}
            onCheckIn={onCheckIn}
          />
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
            <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#3E342C" }}>Support is here</span>
            <span style={{ display: "block", fontSize: 12, color: "#9C8E83", marginTop: 2 }}>Chat, resources & your care team</span>
          </span>
          <svg viewBox="0 0 24 24" width="15" fill="none" stroke="#C8BEB8" strokeWidth="2">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </motion.button>

        {/* Daily goal — main warm element */}
        <div style={{ marginTop: 13 }}>
          <DailyGoal />
        </div>

        {/* vspace */}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
