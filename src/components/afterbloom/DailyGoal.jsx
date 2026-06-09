import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDailyGoal, setDailyGoal, setDailyGoalStatus, getSuggestedGoals, subscribeToDailyGoal } from "../../lib/goals-data";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";

export default function DailyGoal({ level = "steady" }) {
  const [goal, setGoal] = useState(() => getDailyGoal());
  const [suggestion] = useState(() => getSuggestedGoals(level, 1)[0]);

  useEffect(() => subscribeToDailyGoal(setGoal), []);

  const wrap = (children) => (
    <div style={{ background: "#F6FAF7", border: "1px solid #E8F0EA", borderRadius: 22, padding: "16px 18px", fontFamily: F }}>
      {children}
    </div>
  );

  // Skipped today
  if (goal && goal.status === "skipped") {
    return wrap(
      <div>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ABBA3", marginBottom: 4 }}>Just for you today</div>
        <div style={{ fontSize: 13.5, color: "#5A7A64", lineHeight: 1.5 }}>Resting today — that counts too. 💛</div>
      </div>
    );
  }

  const text = (goal && goal.text) || suggestion;
  const done = goal && goal.status === "done";

  return wrap(
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ABBA3", marginBottom: 4 }}>Just for you today</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: done ? "#B0C4B6" : "#5A7A64", textDecoration: done ? "line-through" : "none", marginBottom: 2 }}>{text}</div>
        <div style={{ fontSize: 11.5, color: "#A8C0AD", lineHeight: 1.4 }}>No pressure — even a small step counts.</div>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
            <motion.button
              onClick={() => { if (!goal || !goal.text) setDailyGoal(text, "done"); else setDailyGoalStatus("done"); }}
              whileTap={{ scale: 0.93 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}
              style={{ padding: "8px 16px", borderRadius: 30, background: "#6B9E78", color: "#fff", fontSize: 12, fontWeight: 700, border: 0, cursor: "pointer", fontFamily: F, whiteSpace: "nowrap", boxShadow: "0 3px 10px rgba(83,140,100,.25)" }}>
              Mark done
            </motion.button>
            <button
              onClick={() => setDailyGoal("", "skipped")}
              style={{ padding: "0 4px", background: "none", border: 0, fontSize: 11, fontWeight: 600, color: "#9ABBA3", cursor: "pointer", fontFamily: F, whiteSpace: "nowrap" }}>
              Maybe later
            </button>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            style={{ width: 28, height: 28, borderRadius: "50%", background: "#A8C4AE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="13" height="13"><path d="M5 13l4 4L19 7"/></svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
