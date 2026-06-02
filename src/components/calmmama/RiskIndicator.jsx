import { useState } from "react";
import { getMoodRiskSummary } from "../../lib/mood-data";

const FONT_BODY = "'Plus Jakarta Sans', system-ui, sans-serif";

/* Heart SVG matching prototype .ricon.amber */
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

const configs = {
  none:   { iconBg: "#E7EFE8", iconColor: "#577A62", tagBg: "#E7EFE8", tagColor: "#577A62", tagLabel: "All clear",        Icon: ShieldIcon },
  green:  { iconBg: "#E7EFE8", iconColor: "#577A62", tagBg: "#E7EFE8", tagColor: "#577A62", tagLabel: "All clear",        Icon: ShieldIcon },
  yellow: { iconBg: "#F7EDD8", iconColor: "#9A7322", tagBg: "#F2E2BE", tagColor: "#9A7322", tagLabel: "Gentle note",      Icon: HeartIcon  },
  orange: { iconBg: "#FEF0E7", iconColor: "#C2460A", tagBg: "#FDE8D0", tagColor: "#C2460A", tagLabel: "Heads up",         Icon: AlertIcon  },
  red:    { iconBg: "#FEECEC", iconColor: "#B91C1C", tagBg: "#FEE2E2", tagColor: "#B91C1C", tagLabel: "Please reach out", Icon: AlertIcon  },
};

export default function RiskIndicator({ entries = [] }) {
  const summary = getMoodRiskSummary(entries);
  const cfg = configs[summary.level] ?? configs.none;
  const { Icon } = cfg;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #EFE6DC",
        borderRadius: 20,
        boxShadow: "0 2px 12px rgba(80,56,42,.05)",
        overflow: "hidden",
        fontFamily: FONT_BODY,
      }}
    >
      {/* .qrow .row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", cursor: "pointer" }}>

        {/* .ricon.amber */}
        <div
          style={{
            width: 42, height: 42,
            borderRadius: 14,
            flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: cfg.iconBg,
            color: cfg.iconColor,
          }}
        >
          <Icon />
        </div>

        {/* .rtx */}
        <div style={{ flex: 1 }}>
          {/* .t */}
          <div style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 7, color: "#3E342C" }}>
            {summary.label}
            {/* .rtag */}
            <span
              style={{
                fontSize: 9.5, fontWeight: 800,
                letterSpacing: "0.08em", textTransform: "uppercase",
                background: cfg.tagBg, color: cfg.tagColor,
                padding: "3px 8px", borderRadius: 30,
              }}
            >
              {cfg.tagLabel}
            </span>
          </div>
          {/* .s */}
          <div style={{ fontSize: 12, color: "#6C5F56", marginTop: 2, lineHeight: 1.4 }}>
            {summary.message}
          </div>
        </div>

        {/* .rarr */}
        <span style={{ color: "#9C8E83", flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" width="17" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </span>
      </div>
    </div>
  );
}
