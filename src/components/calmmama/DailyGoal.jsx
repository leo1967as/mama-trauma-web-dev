import { useState } from "react";

const FONT_BODY = "'Plus Jakarta Sans', system-ui, sans-serif";

export default function DailyGoal() {
  const [completed, setCompleted] = useState(false);

  return (
    /* .kind */
    <div
      style={{
        background: "linear-gradient(150deg,#fff,#E7EFE8)",
        border: "1px solid #D8E6DB",
        borderRadius: 24,
        padding: 18,
        boxShadow: "0 2px 12px rgba(80,56,42,.05)",
        transition: "0.25s",
        fontFamily: FONT_BODY,
      }}
    >
      {/* .krow */}
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>

        {/* .kbox */}
        <button
          onClick={() => setCompleted(!completed)}
          aria-label="Mark as done"
          style={{
            width: 34, height: 34,
            borderRadius: "50%",
            border: `2px solid #83A48B`,
            background: completed ? "#83A48B" : "#fff",
            flexShrink: 0,
            cursor: "pointer",
            transition: "0.18s",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 0,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            style={{
              width: 17, height: 17,
              color: "#fff",
              opacity: completed ? 1 : 0,
              transform: completed ? "scale(1)" : "scale(.5)",
              transition: "0.18s",
            }}
          >
            <path d="M5 13l4 4L19 7"/>
          </svg>
        </button>

        {/* .kx */}
        <div style={{ flex: 1 }}>
          {/* .kk */}
          <div
            style={{
              fontSize: 10, fontWeight: 800,
              letterSpacing: "0.13em", textTransform: "uppercase",
              color: "#577A62", marginBottom: 4,
            }}
          >
            Just for you today
          </div>
          {/* .kt */}
          <div
            style={{
              fontSize: 15, fontWeight: 700,
              letterSpacing: "-0.01em",
              textDecoration: completed ? "line-through" : "none",
              color: completed ? "#9C8E83" : "#3E342C",
            }}
          >
            Rest for 10 quiet minutes
          </div>
          {/* .ks */}
          <div style={{ fontSize: 11.5, color: "#6C5F56", marginTop: 2, lineHeight: 1.4 }}>
            No pressure — even closing your eyes counts.
          </div>
        </div>

        {/* .klater */}
        {!completed && (
          <span
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: 11, fontWeight: 700,
              color: "#9C8E83",
              flexShrink: 0,
              cursor: "pointer",
              whiteSpace: "nowrap",
              alignSelf: "center",
            }}
          >
            Maybe later
          </span>
        )}
      </div>
    </div>
  );
}
