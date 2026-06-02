import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { getMoodHistory, getMoodSummary, subscribeToMoodHistory } from "../../lib/mood-data";
import CareTimeline from "../../components/calmmama/CareTimeline";
import RiskIndicator from "../../components/calmmama/RiskIndicator";
import DailyGoal from "../../components/calmmama/DailyGoal";

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

  useEffect(() => {
    setMoodEntries(getMoodHistory());
    const unsub = subscribeToMoodHistory(setMoodEntries);
    return unsub;
  }, []);

  const moodSummary = getMoodSummary(moodEntries);
  const todayMood = moodSummary.todayEntry?.moodScore ?? null;

  return (
    <div style={{ fontFamily: FONT_BODY }}>

      {/* ── Dawn gradient header ── */}
      <div
        className="relative px-6 pb-8 overflow-hidden"
        style={{
          background: "radial-gradient(150% 90% at 88% -20%,#F4C9A8 0%,#EEB6A4 26%,#E2A0A4 52%,#D7A0AB 74%,#FBF6F0 100%)",
        }}
      >
        {/* glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 240, height: 240, right: -60, top: -90,
            background: "radial-gradient(circle,rgba(255,240,214,.85),rgba(255,221,186,.25) 45%,transparent 70%)",
            filter: "blur(2px)",
          }}
        />

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
              <span
                className="absolute rounded-full"
                style={{ top: 8, right: 9, width: 7, height: 7, background: "#AF636A", border: "1.5px solid #fff" }}
              />
              {/* bell icon */}
              <svg viewBox="0 0 24 24" width="17" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M6 8a6 6 0 0112 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10 21a2 2 0 004 0"/>
              </svg>
            </button>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,.42)", border: "1px solid rgba(255,255,255,.6)", color: "#7A453F" }}
            >
              <Settings size={17} strokeWidth={1.9} />
            </button>
          </div>
        </div>

        {/* hello */}
        <div className="relative mt-[26px]">
          <h1
            className="font-medium leading-none tracking-[-0.015em]"
            style={{ fontFamily: FONT_SERIF, fontSize: 42, color: "#4A2F2C" }}
          >
            Good morning,
            <em className="block" style={{ fontStyle: "italic" }}>Mama.</em>
          </h1>
          <p className="mt-3.5 text-[15px] font-semibold max-w-[78%]" style={{ color: "#7A453F" }}>
            You're finding your rhythm — one gentle day at a time.
          </p>
        </div>
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

          {/* editbtn */}
          <button
            onClick={() => onCheckIn?.()}
            className="relative flex items-center justify-center gap-[9px] w-full rounded-[18px] font-bold text-[14.5px] text-white border-0 cursor-pointer"
            style={{
              background: "#C77E83",
              padding: 15,
              boxShadow: "0 12px 24px rgba(175,99,106,.3)",
              fontFamily: FONT_BODY,
            }}
          >
            <svg viewBox="0 0 24 24" width="17" fill="none" stroke="currentColor" strokeWidth="2.1">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>
            </svg>
            {moodSummary.hasTodayCheckIn ? "Edit today's check-in" : "Complete today's check-in"}
          </button>
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

        {/* qrow */}
        <div style={{ marginTop: 13 }}>
          <RiskIndicator entries={moodEntries} />
        </div>

        {/* sup-card */}
        <div
          className="rounded-[24px]"
          style={{
            marginTop: 13,
            padding: 19,
            background: "linear-gradient(150deg,#fff,#FBEDEC)",
            border: "1px solid #F0D7D6",
          }}
        >
          <div className="flex items-start justify-between" style={{ marginBottom: 5 }}>
            <h3 className="text-[16px] font-black" style={{ color: "#3E342C" }}>
              Support is here
            </h3>
            <span
              className="text-[9.5px] font-black uppercase tracking-[0.09em] rounded-full"
              style={{ color: "#AF636A", background: "#fff", padding: "5px 10px" }}
            >
              Connected care
            </span>
          </div>
          <p
            className="text-[12.5px] leading-[1.5]"
            style={{ color: "#6C5F56", marginBottom: 15 }}
          >
            If today feels too heavy, you can talk to someone instead of carrying it alone.
          </p>
          <button
            className="flex items-center w-full rounded-[18px] text-white border-0 text-left cursor-pointer"
            style={{
              gap: 13,
              background: "#C77E83",
              padding: "15px 17px",
              boxShadow: "0 12px 24px rgba(175,99,106,.28)",
              fontFamily: FONT_BODY,
            }}
          >
            <span
              className="flex items-center justify-center flex-shrink-0 rounded-full"
              style={{ width: 40, height: 40, background: "rgba(255,255,255,.2)" }}
            >
              <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>
              </svg>
            </span>
            <span>
              <span className="block text-[14.5px] font-black">Talk to a professional</span>
              <span className="block text-[11px] font-medium" style={{ opacity: 0.9, marginTop: 1 }}>
                Available whenever you need extra support
              </span>
            </span>
          </button>
        </div>

        {/* kind card */}
        <div style={{ marginTop: 13 }}>
          <DailyGoal />
        </div>

        {/* vspace */}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
