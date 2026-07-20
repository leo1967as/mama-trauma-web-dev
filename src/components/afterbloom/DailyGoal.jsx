import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDailyGoal, setDailyGoal, setDailyGoalStatus, getSuggestedGoals, subscribeToDailyGoal } from "../../lib/goals-data";
import { useLang } from "../../lib/i18n";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";

export default function DailyGoal({ level = "steady" }) {
  const { t } = useLang();
  const [goal, setGoal] = useState(() => getDailyGoal());
  const [suggestions] = useState(() => getSuggestedGoals(level));
  const goalOptions = t.checkin.tinyGoal.options || suggestions;

  useEffect(() => subscribeToDailyGoal(setGoal), []);

  const wrap = (children) => (
    <div style={{ background: "#F8F4EF", border: "1px solid #EFE6DC", borderRadius: 14, padding: "16px 18px", fontFamily: F }}>
      {children}
    </div>
  );

  // Skipped today
  if (goal && goal.status === "skipped") {
    return wrap(
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: "#9A4C53", marginBottom: 4 }}>{t.checkin.tinyGoal.activeHeader}</div>
        <div style={{ fontSize: 13.5, color: "#786A5C", lineHeight: 1.5 }}>{t.checkin.tinyGoal.skipSubtitle}</div>
      </div>
    );
  }

  const text = goal?.text;
  const done = goal && goal.status === "done";

  if (!goal) return wrap(
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: "#9A4C53", marginBottom: 8 }}>{t.checkin.tinyGoal.activeHeader}</div>
      <div style={{ display: "grid", gap: 8 }}>
        {suggestions.map((item, index) => {
          const label = goalOptions[index] || item;
          return <button key={item} onClick={() => setDailyGoal(label)} className="afterbloom-focus"
            style={{ minHeight: 44, padding: "10px 12px", textAlign: "left", border: "1px solid #EFE6DC", borderRadius: 10, background: "#fff", color: "#3E342C", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F }}>
            {index + 1}. {label}
          </button>;
        })}
        <button onClick={() => setDailyGoal("", "skipped")} className="afterbloom-focus daily-goal-skip"
          style={{ minHeight: 44, padding: "8px 12px", background: "none", border: 0, borderRadius: 10, fontSize: 12, fontWeight: 700, color: "#786A5C", cursor: "pointer", fontFamily: F }}>
          {t.checkin.tinyGoal.maybeLater}
        </button>
      </div>
    </div>
  );

  return wrap(
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: "#9A4C53", marginBottom: 4 }}>{t.checkin.tinyGoal.activeHeader}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: done ? "#D4A0A8" : "#3E342C", textDecoration: done ? "line-through" : "none", marginBottom: 2 }}>{text}</div>
        <div style={{ fontSize: 11.5, color: "#786A5C", lineHeight: 1.4 }}>{t.checkin.tinyGoal.subtitle}</div>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <motion.button
              onClick={() => { if (!goal || !goal.text) setDailyGoal(text, "done"); else setDailyGoalStatus("done"); }}
              whileTap={{ scale: 0.93 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="afterbloom-focus daily-goal-primary"
              style={{ minHeight: 44, padding: "10px 18px", borderRadius: 12, background: "#C77E83", color: "#fff", fontSize: 12, fontWeight: 700, border: 0, cursor: "pointer", fontFamily: F, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M5 13l4 4L19 7"/></svg>
              {t.checkin.tinyGoal.markDone}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            style={{ width: 28, height: 28, borderRadius: "50%", background: "#D4A0A8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="13" height="13"><path d="M5 13l4 4L19 7"/></svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
