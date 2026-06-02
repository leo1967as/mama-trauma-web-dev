import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { AlertCircle, MessageCircleHeart, Moon, Pencil, TrendingUp } from "lucide-react";
import {
  formatHistoryDate,
  getMoodChartData, getMoodHistory, getMoodInsights, getMoodRiskSummary,
  getMoodSummary, hasMoodChartData, subscribeToMoodHistory,
} from "../../lib/mood-data";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

// ── face data ─────────────────────────────────────────────────────────────────

const SCORE_FACE = {
  1: { word: "Rough", bg: "#EDEFF3", color: "#7E8AA0",
    svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#EDEFF3"/><circle cx="14" cy="17" r="1.8" fill="#7E8AA0"/><circle cx="26" cy="17" r="1.8" fill="#7E8AA0"/><path d="M13 27c2-3 12-3 14 0" stroke="#7E8AA0" strokeWidth="2.2" strokeLinecap="round"/></svg> },
  2: { word: "Low",   bg: "#EFE9EF", color: "#8E7E90",
    svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#EFE9EF"/><circle cx="14" cy="18" r="1.8" fill="#8E7E90"/><circle cx="26" cy="18" r="1.8" fill="#8E7E90"/><path d="M14 26c2-1.5 10-1.5 12 0" stroke="#8E7E90" strokeWidth="2.2" strokeLinecap="round"/></svg> },
  3: { word: "Okay",  bg: "#F6EBD4", color: "#B58B3C",
    svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#F6EBD4"/><circle cx="14" cy="18" r="1.9" fill="#B58B3C"/><circle cx="26" cy="18" r="1.9" fill="#B58B3C"/><path d="M14 25h12" stroke="#B58B3C" strokeWidth="2.4" strokeLinecap="round"/></svg> },
  4: { word: "Good",  bg: "#E5EEE6", color: "#5E8169",
    svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#E5EEE6"/><circle cx="14" cy="17" r="1.9" fill="#5E8169"/><circle cx="26" cy="17" r="1.9" fill="#5E8169"/><path d="M13 23c2 3 12 3 14 0" stroke="#5E8169" strokeWidth="2.3" strokeLinecap="round"/></svg> },
  5: { word: "Light", bg: "#F6E3E2", color: "#B0666D",
    svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#F6E3E2"/><circle cx="14" cy="16" r="1.9" fill="#B0666D"/><circle cx="26" cy="16" r="1.9" fill="#B0666D"/><path d="M12 22c2.5 4.5 13.5 4.5 16 0" stroke="#B0666D" strokeWidth="2.4" strokeLinecap="round"/></svg> },
};

const SLEEP_LABEL = { 2: "Hardly any", 4: "Broken", 6: "Okay", 8: "Slept well" };

const insightIconMap = { sleep: Moon, support: MessageCircleHeart, tag: AlertCircle, trend: TrendingUp };
const insightLabels = ["Pattern to notice", "Another signal", "One more thing"];

const insightColors = [
  { bg: "#F7EDD8", color: "#9A7322" },
  { bg: "#E7EFE8", color: "#577A62" },
  { bg: "#F6E2E1", color: "#AF636A" },
];

const riskStyle = {
  red:    { bg: "#FEECEC", border: "#F5C2C2", text: "#B91C1C", tag: "#FEE2E2" },
  orange: { bg: "#FEF0E7", border: "#F5D5B8", text: "#C2460A", tag: "#FDE8D0" },
  yellow: { bg: "#F7EDD8", border: "#E8D3A0", text: "#9A7322", tag: "#F2E2BE" },
  green:  { bg: "#E7EFE8", border: "#C8DFC9", text: "#577A62", tag: "#D8EDD9" },
  none:   { bg: "#fff",    border: "#EFE6DC", text: "#6C5F56", tag: "#FBF6F0" },
};

// ── shared ────────────────────────────────────────────────────────────────────

function Card({ children, style }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #EFE6DC", borderRadius: 24,
      padding: 20, boxShadow: "0 2px 12px rgba(80,56,42,.05)",
      fontFamily: F, ...style,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 0 }}>
      {children}
    </div>
  );
}

// ── today summary ─────────────────────────────────────────────────────────────

function TodaySummary({ todayEntry, onCheckIn }) {
  const face = todayEntry?.moodScore ? SCORE_FACE[todayEntry.moodScore] : null;
  const sleepLabel = todayEntry?.sleepHours != null
    ? (SLEEP_LABEL[todayEntry.sleepHours] ?? `${todayEntry.sleepHours} hrs`)
    : null;

  if (!face) {
    return (
      <Card>
        <SectionLabel>Today</SectionLabel>
        <p style={{ fontSize: 13.5, color: "#6C5F56", lineHeight: 1.55, margin: "10px 0 16px" }}>
          No check-in yet. Tap below to log how you're feeling.
        </p>
        <button onClick={onCheckIn} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
          width: "100%", padding: 15, borderRadius: 18,
          background: "#C77E83", color: "#fff",
          fontWeight: 700, fontSize: 14.5, border: 0,
          boxShadow: "0 12px 24px rgba(175,99,106,.28)",
          cursor: "pointer", fontFamily: F,
        }}>
          <svg viewBox="0 0 24 24" width="17" fill="none" stroke="currentColor" strokeWidth="2.1">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>
          </svg>
          Complete today's check-in
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <SectionLabel>Today's log</SectionLabel>
        <button onClick={onCheckIn} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 12, fontWeight: 700, color: "#AF636A",
          background: "#F6E2E1", border: "none",
          padding: "5px 12px", borderRadius: 30, cursor: "pointer", fontFamily: F,
        }}>
          <Pencil size={11} /> Edit
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: todayEntry.tags?.length ? 14 : 0 }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%", background: face.bg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg viewBox="0 0 40 40" fill="none" width="48" height="48">{face.svg.props.children}</svg>
        </div>
        <div>
          <div style={{ fontFamily: S, fontSize: 22, fontWeight: 500, color: "#3E342C" }}>{face.word}</div>
          {sleepLabel && (
            <div style={{ fontSize: 12, color: "#9C8E83", marginTop: 2 }}>Sleep · {sleepLabel}</div>
          )}
        </div>
      </div>

      {todayEntry.tags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {todayEntry.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 30,
              background: "#FBF6F0", border: "1px solid #E6DBCF", color: "#6C5F56",
              textTransform: "capitalize",
            }}>{tag}</span>
          ))}
        </div>
      )}
    </Card>
  );
}

// ── recent history ────────────────────────────────────────────────────────────

function RecentHistory({ history }) {
  const recent = history.filter(e => e.moodScore != null).slice(0, 7);
  if (!recent.length) return null;

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 20px 12px" }}>
        <SectionLabel>Recent days</SectionLabel>
      </div>
      {recent.map((entry, i) => {
        const face = SCORE_FACE[entry.moodScore];
        if (!face) return null;
        const sleepLabel = entry.sleepHours != null
          ? (SLEEP_LABEL[entry.sleepHours] ?? `${entry.sleepHours}h`)
          : null;
        const tags = entry.tags?.slice(0, 2) || [];
        const dateLabel = formatHistoryDate(entry.dateKey);

        return (
          <div key={entry.dateKey} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "13px 20px",
            borderTop: "1px solid #F5EFE8",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%", background: face.bg,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg viewBox="0 0 40 40" fill="none" width="38" height="38">{face.svg.props.children}</svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                <span style={{ fontFamily: S, fontSize: 16, fontWeight: 500, color: "#3E342C" }}>{face.word}</span>
                {tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 11, fontWeight: 600, color: "#9C8E83",
                    background: "#FBF6F0", border: "1px solid #EFE6DC",
                    padding: "2px 8px", borderRadius: 20,
                    textTransform: "capitalize",
                  }}>{tag}</span>
                ))}
              </div>
              {sleepLabel && (
                <div style={{ fontSize: 11, color: "#9C8E83", marginTop: 2 }}>Sleep · {sleepLabel}</div>
              )}
            </div>

            <span style={{ fontSize: 11, fontWeight: 700, color: "#9C8E83", flexShrink: 0 }}>
              {dateLabel}
            </span>
          </div>
        );
      })}
    </Card>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function MoodTab({ onCheckIn }) {
  const [history, setHistory] = useState(() => getMoodHistory());

  useEffect(() => {
    const unsub = subscribeToMoodHistory(setHistory);
    return unsub;
  }, []);

  const summary = useMemo(() => getMoodSummary(history), [history]);
  const todayEntry = summary.todayEntry;
  const riskSummary = useMemo(() => getMoodRiskSummary(history), [history]);
  const insights = useMemo(() => getMoodInsights(history), [history]);

  const chartData = getMoodChartData(history, 7);
  const chartAnimKey = chartData.map(r => `${r.dateKey}:${r.mood ?? "n"}`).join("|");
  const showChart = hasMoodChartData(chartData);

  const face = todayEntry?.moodScore ? SCORE_FACE[todayEntry.moodScore] : null;
  const rs = riskStyle[riskSummary.level] ?? riskStyle.none;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ fontFamily: F }}
    >
      {/* ── Gradient header ── */}
      <div
        className="relative px-6 pb-8 overflow-hidden"
        style={{ background: "radial-gradient(140% 85% at 85% -15%,#EFE9EF 0%,#E8D5E2 25%,#E2C5D0 50%,#DCBFC8 70%,#FBF6F0 100%)" }}
      >
        <div style={{
          position: "absolute", width: 220, height: 220, borderRadius: "50%",
          right: -55, top: -80, pointerEvents: "none",
          background: "radial-gradient(circle,rgba(255,235,240,.9),rgba(240,210,220,.3) 45%,transparent 70%)",
          filter: "blur(2px)",
        }} />

        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A5060" }}>
            Mood
          </span>
          {face && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(255,255,255,.42)", border: "1px solid rgba(255,255,255,.6)",
              padding: "5px 13px 5px 8px", borderRadius: 30,
            }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: face.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 40 40" fill="none" width="22" height="22">{face.svg.props.children}</svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#5A3F3A" }}>{face.word} today</span>
            </div>
          )}
        </div>

        <div style={{ position: "relative", marginTop: 26 }}>
          <h1 style={{ fontFamily: S, fontWeight: 500, fontSize: 42, lineHeight: 1.0, letterSpacing: "-0.015em", color: "#4A2F2C" }}>
            How you've
            <em style={{ display: "block", fontStyle: "italic" }}>been feeling.</em>
          </h1>
          <p style={{ marginTop: 14, fontSize: 15, fontWeight: 600, color: "#7A453F", maxWidth: "78%" }}>
            {summary.hasTodayCheckIn
              ? "Today's check-in is saved. Here's your pattern."
              : "Your trends and patterns, all in one place."}
          </p>
        </div>
      </div>

      {/* ── Sheet ── */}
      <div style={{ background: "#FBF6F0", borderRadius: "26px 26px 0 0", marginTop: -16, padding: "24px 22px 0", display: "flex", flexDirection: "column", gap: 13 }}>

        <TodaySummary todayEntry={todayEntry} onCheckIn={onCheckIn} />

        {/* 7-day trend */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <TrendingUp size={15} color="#C77E83" />
            <SectionLabel>7-day trend</SectionLabel>
          </div>
          <div style={{ position: "relative", height: 128, margin: "0 -8px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="moodGradMT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C77E83" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#C77E83" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: "#9C8E83", fontFamily: F }} dy={8} />
                <YAxis hide domain={[0, 5]} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 12, fontSize: 12, fontFamily: F }}
                  formatter={v => [`${v}/5`, "Mood"]}
                />
                <Area key={chartAnimKey} type="monotone" dataKey="mood"
                  stroke="#C77E83" strokeWidth={2.5} fill="url(#moodGradMT)"
                  isAnimationActive animationBegin={40} animationDuration={720}
                  dot={({ cx, cy, payload }) =>
                    payload?.mood != null
                      ? <circle cx={cx} cy={cy} r={3.5} fill="#C77E83" stroke="white" strokeWidth={1.5} />
                      : null
                  }
                  connectNulls
                  activeDot={{ r: 5, fill: "#C77E83", stroke: "white", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            {!showChart && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: 11, color: "#9C8E83", textAlign: "center", fontFamily: F }}>
                  Complete a check-in to start your trend line.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* all insights */}
        {insights.slice(0, 3).map((insight, i) => {
          const Icon = insightIconMap[insight.type] || TrendingUp;
          const ic = insightColors[i] || insightColors[0];
          return (
            <Card key={insight.key}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 11,
                  background: ic.bg, color: ic.color,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={16} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9C8E83" }}>
                  {insightLabels[i]}
                </span>
              </div>
              <p style={{ fontSize: 13.5, color: "#3E342C", lineHeight: 1.55 }}>{insight.text}</p>
            </Card>
          );
        })}

        {/* risk card */}
        <div style={{
          borderRadius: 24, padding: 20,
          background: rs.bg, border: `1px solid ${rs.border}`,
          boxShadow: "0 2px 12px rgba(80,56,42,.05)", fontFamily: F,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: rs.text }}>{riskSummary.label}</span>
            <span style={{
              fontSize: 9.5, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase",
              color: rs.text, background: rs.tag, padding: "4px 10px", borderRadius: 30,
            }}>
              {riskSummary.level === "none" ? "Baseline" : riskSummary.level.charAt(0).toUpperCase() + riskSummary.level.slice(1)}
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: rs.text, opacity: 0.85, lineHeight: 1.5, marginBottom: 12 }}>{riskSummary.message}</p>
          <p style={{ fontSize: 12, fontWeight: 700, color: rs.text }}>Next step: {riskSummary.action}</p>
        </div>

        {/* recent history list */}
        <RecentHistory history={history} />

        <div style={{ height: 8 }} />
      </div>
    </motion.div>
  );
}
