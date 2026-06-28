import { motion, useReducedMotion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import { FONT_BODY, COLORS, ACCENT_COLORS } from "../../lib/theme.jsx";

export default function TherapistCard({ therapist, index, onSelect }) {
  const t = therapist;
  const colors = ACCENT_COLORS[t.color] || ACCENT_COLORS.accent;
  const Icon = t.icon;
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : index * 0.05, duration: 0.2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      onClick={() => onSelect(t)}
      style={{
        width: "100%",
        textAlign: "left",
        background: "#fff",
        borderRadius: 16,
        padding: 16,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "none",
        fontFamily: FONT_BODY,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon style={{ width: 24, height: 24, color: colors.text }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: COLORS.heading }}>{t.name}</span>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 999, background: colors.bg, color: colors.text }}>{t.tag}</span>
          </div>
          <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>{t.specialty}</p>
          <p style={{ fontSize: 12.5, color: COLORS.text, lineHeight: 1.45, marginBottom: 9 }}>{t.careFit}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 9 }}>
            <span style={{ fontSize: 10, color: COLORS.green, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <Clock style={{ width: 10, height: 10 }} />{t.availability}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {t.focuses.map((f) => (
              <span key={f} style={{ fontSize: 10, fontWeight: 700, background: "#FBF6F0", border: `1px solid ${COLORS.border}`, color: COLORS.muted, padding: "3px 8px", borderRadius: 999 }}>
                {f}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, marginTop: 4, flexShrink: 0 }}>
          <ChevronRight style={{ width: 16, height: 16, color: COLORS.label }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: COLORS.accentInk }}>Request</span>
        </div>
      </div>
    </motion.button>
  );
}
