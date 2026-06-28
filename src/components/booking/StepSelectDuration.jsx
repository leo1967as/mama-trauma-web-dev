import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Video, Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import { FONT_BODY, COLORS, Card, PrimaryButton } from "../../lib/theme.jsx";

const durations = [
  { mins: 25, label: "Short support", length: "25 min", desc: "A focused check-in for one concern", popular: false },
  { mins: 50, label: "Standard care", length: "50 min", desc: "Enough time to talk through the day", popular: true },
  { mins: 80, label: "More time", length: "80 min", desc: "For layered feelings or a harder week", popular: false },
];

const modes = [
  { id: "video", icon: Video, label: "Video Call" },
  { id: "phone", icon: Phone, label: "Phone Call" },
  { id: "chat", icon: MessageCircle, label: "Live Chat" },
];

export default function StepSelectDuration({ onNext }) {
  const [selectedDuration, setSelectedDuration] = useState(durations[1]);
  const [selectedMode, setSelectedMode] = useState("video");
  const reduceMotion = useReducedMotion();

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: FONT_BODY }}>
      {/* Duration Picker */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Clock style={{ width: 16, height: 16, color: COLORS.accent }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: COLORS.heading }}>Choose the amount of support</p>
            <p style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 2 }}>You can start small. Longer is not always better.</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {durations.map((d) => {
            const active = selectedDuration.mins === d.mins;
            return (
              <motion.button
                key={d.mins}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                onClick={() => setSelectedDuration(d)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px", borderRadius: 12,
                  border: `2px solid ${active ? COLORS.accent : COLORS.border}`,
                  background: active ? COLORS.accentSoft : "#fff", cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: active ? "#fff" : COLORS.border, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Clock style={{ width: 16, height: 16, color: active ? COLORS.accent : COLORS.muted }} />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 800, color: COLORS.heading }}>{d.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: active ? COLORS.accent : COLORS.muted }}>{d.length}</span>
                      {d.popular && (
                        <span style={{ fontSize: 10, fontWeight: 700, background: COLORS.accent, color: "#fff", padding: "2px 6px", borderRadius: 6 }}>
                          Common first choice
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 11.5, color: COLORS.muted }}>{d.desc}</p>
                  </div>
                </div>
                {active && <CheckCircle2 style={{ width: 16, height: 16, color: COLORS.accent }} />}
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Mode Picker */}
      <Card>
        <p style={{ fontSize: 14, fontWeight: 800, color: COLORS.heading, marginBottom: 4 }}>How would you like to connect?</p>
        <p style={{ fontSize: 11.5, color: COLORS.muted, marginBottom: 12 }}>Choose the format that feels easiest to show up for.</p>
        <div style={{ display: "flex", gap: 8 }}>
          {modes.map((m) => {
            const Icon = m.icon;
            const active = selectedMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  padding: "14px 0", borderRadius: 12,
                  border: `2px solid ${active ? COLORS.accent : COLORS.border}`,
                  background: active ? COLORS.accentSoft : "#fff", cursor: "pointer",
                }}
              >
                <Icon style={{ width: 18, height: 18, color: active ? COLORS.accent : COLORS.muted }} strokeWidth={active ? 2.5 : 1.8} />
                <span style={{ fontSize: 10, fontWeight: 700, color: active ? COLORS.accent : COLORS.muted }}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <PrimaryButton
        onClick={() => onNext({ duration: selectedDuration, mode: modes.find((m) => m.id === selectedMode) })}
        style={{ padding: 15, fontWeight: 700, fontSize: 14.5, boxShadow: `0 12px 24px ${COLORS.ctaShadow}` }}
      >
        Continue
      </PrimaryButton>
    </motion.div>
  );
}
