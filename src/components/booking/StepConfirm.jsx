import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CalendarHeart, Clock, Video, Phone, MessageCircle, Shield, CheckCircle2 } from "lucide-react";
import { FONT_BODY, FONT_SERIF, COLORS, Card, ACCENT_COLORS, PrimaryButton } from "../../lib/theme.jsx";
import { saveBookingState } from "../../lib/therapy-data";

const modeIcons = { video: Video, phone: Phone, chat: MessageCircle };

function Row({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, color: COLORS.muted }}>
        <Icon style={{ width: 13, height: 13 }} />
        <span>{label}</span>
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.heading }}>{value}</span>
    </div>
  );
}

export default function StepConfirm({ therapist, dateTime, duration, mode, onConfirm }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const reduceMotion = useReducedMotion();

  const ModeIcon = modeIcons[mode?.id] || Video;
  const colors = ACCENT_COLORS[therapist.color] || ACCENT_COLORS.accent;
  const TherapistIcon = therapist.icon;

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setConfirmed(true);
    saveBookingState({
      therapistId: therapist.id,
      name: therapist.name,
      color: therapist.color,
      date: dateTime.date,
      time: dateTime.time,
      durationLabel: `${duration.label} (${duration.length})`,
      mode: mode?.label,
      note,
    });
    setTimeout(() => onConfirm(), 2200);
  };

  if (confirmed) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        role="status"
        aria-live="polite"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", textAlign: "center", gap: 16, fontFamily: FONT_BODY }}
      >
        <motion.div
          initial={reduceMotion ? false : { scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={reduceMotion ? { duration: 0.15 } : { type: "spring", bounce: 0.25, delay: 0.1 }}
          style={{ width: 72, height: 72, borderRadius: "50%", background: COLORS.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <CheckCircle2 style={{ width: 36, height: 36, color: COLORS.green }} />
        </motion.div>
        <div>
          <p style={{ fontSize: 18, fontWeight: 500, color: COLORS.heading, fontFamily: FONT_SERIF }}>Your request is saved.</p>
          <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>Keep these details here until care booking is connected.</p>
        </div>
        <div style={{ background: COLORS.accentSoft, borderRadius: 12, padding: "12px 20px", fontSize: 12, color: COLORS.text, display: "flex", flexDirection: "column", gap: 4 }}>
          <p style={{ fontWeight: 700, color: COLORS.heading }}>{therapist.name}</p>
          <p>{dateTime.date} · {dateTime.time}</p>
          <p>{duration.label} ({duration.length}) · {mode?.label}</p>
        </div>
        <p style={{ maxWidth: 260, fontSize: 12, color: COLORS.muted, lineHeight: 1.55 }}>
          This does not contact a clinic yet. Use your care team or urgent support if you need help now.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: FONT_BODY }}>
      {/* Summary Card */}
      <div style={{ background: COLORS.accentSoft, borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ fontSize: 12.5, fontWeight: 800, color: COLORS.accentInk }}>Private care request</p>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <TherapistIcon style={{ width: 22, height: 22, color: colors.text }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.heading }}>{therapist.name}</p>
            <p style={{ fontSize: 11.5, color: COLORS.muted }}>{therapist.specialty}</p>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(175,99,106,.15)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <Row icon={CalendarHeart} label="Date & Time" value={`${dateTime.date} · ${dateTime.time}`} />
          <Row icon={Clock} label="Support" value={`${duration.label} · ${duration.length}`} />
          <Row icon={ModeIcon} label="Session type" value={mode?.label} />
        </div>
      </div>

      {/* Note for therapist */}
      <Card>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.heading, marginBottom: 2 }}>
          Add a note <span style={{ color: COLORS.muted, fontWeight: 400 }}>(optional)</span>
        </p>
        <p style={{ fontSize: 11.5, color: COLORS.muted, marginBottom: 10 }}>Only share what feels useful. You can leave this blank.</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          aria-label="Optional note for therapist"
          placeholder="e.g. Sleep has been hard, and I want help staying steady."
          rows={3}
          style={{ width: "100%", background: "#FBF6F0", borderRadius: 12, padding: 12, fontSize: 13, color: COLORS.text, resize: "none", outline: "none", lineHeight: 1.5, border: "2px solid transparent", fontFamily: FONT_BODY }}
        />
      </Card>

      {/* Privacy */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#FBF6F0", borderRadius: 12, padding: 14 }}>
        <Shield style={{ width: 15, height: 15, color: COLORS.muted, marginTop: 2, flexShrink: 0 }} />
        <p style={{ fontSize: 11.5, color: COLORS.muted, lineHeight: 1.6 }}>
          Private by default. Your note stays on this device until a real booking connection is added.
        </p>
      </div>

      {/* Confirm Button */}
      <PrimaryButton
        onClick={handleConfirm}
        disabled={loading}
        aria-busy={loading}
        style={{ padding: 15, fontWeight: 700, fontSize: 14.5, boxShadow: `0 12px 24px ${COLORS.ctaShadow}`, opacity: loading ? 0.8 : 1 }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <motion.div
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff" }}
              />
              Saving your request...
            </motion.div>
          ) : (
            <motion.span key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Save request
            </motion.span>
          )}
        </AnimatePresence>
      </PrimaryButton>
    </motion.div>
  );
}
