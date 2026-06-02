import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

export default function DailyGoal() {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div style={{
      background: "#F6FAF7", border: "1px solid #E8F0EA",
      borderRadius: 22, padding: "16px 18px", fontFamily: F,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1 }}>
          {/* label */}
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ABBA3", marginBottom: 4 }}>
            Just for you today
          </div>
          {/* task */}
          <div style={{ fontSize: 14, fontWeight: 600, color: done ? "#B0C4B6" : "#5A7A64", textDecoration: done ? "line-through" : "none", marginBottom: 2 }}>
            Rest for 10 quiet minutes
          </div>
          {/* desc */}
          <div style={{ fontSize: 11.5, color: "#A8C0AD", lineHeight: 1.4 }}>
            No pressure — even closing your eyes counts.
          </div>
        </div>

        {/* actions — compact */}
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key="btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
              <motion.button
                onClick={() => setDone(true)}
                whileTap={{ scale: 0.93 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                style={{
                  padding: "8px 16px", borderRadius: 30,
                  background: "#6B9E78", color: "#fff",
                  fontSize: 12, fontWeight: 700, border: 0,
                  cursor: "pointer", fontFamily: F, whiteSpace: "nowrap",
                  boxShadow: "0 3px 10px rgba(83,140,100,.25)",
                }}
              >
                {started ? "Mark done" : "Start now"}
              </motion.button>
              <button
                onClick={() => setStarted(true)}
                style={{
                  padding: "0 4px", background: "none", border: 0,
                  fontSize: 11, fontWeight: 600, color: "#9ABBA3",
                  cursor: "pointer", fontFamily: F, whiteSpace: "nowrap",
                }}
              >
                Maybe later
              </button>
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              style={{ width: 28, height: 28, borderRadius: "50%", background: "#A8C4AE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="13" height="13">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
