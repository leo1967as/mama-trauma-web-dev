import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

const stages = [
  { day: 1,  label: "Day 1",   phase: "Baby Blues Zone",    desc: "Hormones shifting — tears are normal",      bg: "#EFE9EF", color: "#8E7E90" },
  { day: 3,  label: "Day 3",   phase: "Peak Adjustment",    desc: "Milk may come in — emotions intensify",     bg: "#F6E3E2", color: "#B0666D" },
  { day: 7,  label: "Day 7",   phase: "Finding Rhythm",     desc: "Building small routines, some relief",      bg: "#F6EBD4", color: "#B58B3C", active: true },
  { day: 14, label: "Week 2",  phase: "Settling In",        desc: "Baby blues should start to ease",           bg: "#E5EEE6", color: "#5E8169" },
  { day: 21, label: "Week 3",  phase: "Growing Confidence", desc: "Trust your instincts, mama",                bg: "#EDE8F0", color: "#9080A0" },
  { day: 30, label: "Month 1", phase: "New Normal",         desc: "If sadness persists, reach out",            bg: "#F6E3E2", color: "#B0666D" },
];

const tabs = ["Day", "Week", "Month"];

export default function CareTimeline() {
  const [activeTab, setActiveTab] = useState("Day");
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef({});
  const scrollRef = useRef(null);
  const activeStage = stages.find(s => s.active);

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) setPillStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  // scroll active card into view on mount
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeCard = container.querySelector("[data-active='true']");
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, []);

  return (
    <div
      style={{
        background: "#fff", border: "1px solid #EFE6DC", borderRadius: 24,
        padding: 20, boxShadow: "0 2px 12px rgba(80,56,42,.05)", fontFamily: F,
      }}
    >
      {/* header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#3E342C" }}>Care Journey</div>
          <div style={{ fontSize: 11, color: "#9C8E83", marginTop: 2 }}>Your postpartum timeline</div>
        </div>

        {/* tab switcher */}
        <div style={{ position: "relative", display: "flex", background: "#F5EFE8", borderRadius: 30, padding: 3 }}>
          <div style={{
            position: "absolute", top: 3, bottom: 3,
            left: pillStyle.left, width: pillStyle.width,
            background: "#fff", borderRadius: 30,
            boxShadow: "0 1px 4px rgba(80,56,42,.1)",
            transition: "left 0.25s cubic-bezier(.4,.1,.2,1), width 0.25s",
          }} />
          {tabs.map(tab => (
            <button
              key={tab}
              ref={el => { if (el) tabRefs.current[tab] = el; }}
              onClick={() => setActiveTab(tab)}
              style={{
                position: "relative", zIndex: 1,
                padding: "5px 12px", border: 0, background: "none",
                fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: F,
                color: activeTab === tab ? "#3E342C" : "#9C8E83",
                transition: "color 0.2s",
                borderRadius: 30,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* active stage highlight */}
      {activeStage && (
        <div style={{
          background: "#FBF6F0", border: "1px solid #EFE6DC", borderRadius: 16,
          padding: "12px 14px", marginBottom: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C77E83", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#AF636A" }}>
              Now — Day 7
            </span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#3E342C", marginBottom: 2 }}>
            {activeStage.phase}
          </div>
          <div style={{ fontSize: 12, color: "#9C8E83" }}>{activeStage.desc}</div>
        </div>
      )}

      {/* scrollable cards */}
      <div
        ref={scrollRef}
        style={{
          display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4,
          scrollbarWidth: "none", msOverflowStyle: "none",
          margin: "0 -4px", padding: "0 4px 4px",
        }}
      >
        {stages.map(stage => (
          <div
            key={stage.day}
            data-active={stage.active ? "true" : "false"}
            style={{
              flexShrink: 0, width: 76, borderRadius: 16,
              padding: "10px 8px", textAlign: "center", cursor: "pointer",
              background: stage.active ? "#fff" : "#F8F4F0",
              border: stage.active ? "1.5px solid #EFE6DC" : "1.5px solid transparent",
              boxShadow: stage.active ? "0 2px 12px rgba(80,56,42,.1)" : "none",
              transition: "all 0.2s",
            }}
          >
            {/* circle with day number */}
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: stage.bg, margin: "0 auto 6px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: stage.day >= 10 ? 10 : 12, fontWeight: 800, color: stage.color }}>
                {stage.day}
              </span>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#3E342C", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {stage.label}
            </div>
            <div style={{ fontSize: 9, color: "#9C8E83", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {stage.phase}
            </div>
          </div>
        ))}
      </div>

      {/* view full */}
      <button style={{
        display: "flex", alignItems: "center", gap: 3,
        marginTop: 12, border: 0, background: "none",
        fontSize: 12, fontWeight: 700, color: "#AF636A",
        cursor: "pointer", fontFamily: F, padding: 0,
      }}>
        View full journey <ChevronRight size={14} />
      </button>
    </div>
  );
}
