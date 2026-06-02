import { useState } from "react";
import { motion } from "framer-motion";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";

export default function DailyGoal() {
  const [completed, setCompleted] = useState(false);

  return (
    <div style={{
      background: "#F0F5F1",
      border: "1px solid #DDE8DF",
      borderRadius: 22,
      padding: "18px 18px 18px 16px",
      fontFamily: F,
      transition: "opacity 0.25s",
      opacity: completed ? 0.7 : 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>

        {/* circle checkbox */}
        <motion.button
          onClick={() => setCompleted(!completed)}
          whileTap={{ scale: 0.82 }}
          animate={{ scale: completed ? 1.06 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          aria-label="Mark as done"
          style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            border: `2px solid ${completed ? "#83A48B" : "#A8C4AE"}`,
            background: completed ? "#83A48B" : "transparent",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            padding: 0,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
            style={{ width: 16, height: 16, opacity: completed ? 1 : 0, transition: "opacity 0.18s, transform 0.18s", transform: completed ? "scale(1)" : "scale(0.5)" }}>
            <path d="M5 13l4 4L19 7"/>
          </svg>
        </motion.button>

        {/* text */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.13em", textTransform: "uppercase", color: "#577A62", marginBottom: 5 }}>
            Just for you today
          </div>
          <div style={{
            fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3,
            color: completed ? "#9C8E83" : "#3E342C",
            textDecoration: completed ? "line-through" : "none",
          }}>
            Rest for 10 quiet minutes
          </div>
          <div style={{ fontSize: 12, color: "#7A9082", marginTop: 3, lineHeight: 1.4 }}>
            No pressure — even closing your eyes counts.
          </div>
        </div>

        {/* maybe later */}
        {!completed && (
          <span
            onClick={e => e.stopPropagation()}
            style={{
              fontSize: 11.5, fontWeight: 600, color: "#9C8E83",
              flexShrink: 0, cursor: "pointer", whiteSpace: "nowrap", alignSelf: "center",
            }}
          >
            Maybe later
          </span>
        )}
      </div>
    </div>
  );
}
