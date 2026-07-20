import { motion, useReducedMotion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import { FONT_BODY, COLORS, ACCENT_COLORS } from "../../lib/theme.jsx";
import { useLang } from "../../lib/i18n";

export default function TherapistCard({ therapist, index, onSelect, requestLabel }) {
  const { t: i18n, lang } = useLang();
  const isTh = lang === "th";
  const name = isTh ? therapist.nameTh ?? therapist.name : therapist.name;
  const specialty = isTh ? therapist.specialtyTh ?? therapist.specialty : therapist.specialty;
  const tag = isTh ? therapist.tagTh ?? therapist.tag : therapist.tag;
  const careFit = isTh ? therapist.careFitTh ?? therapist.careFit : therapist.careFit;
  const availability = isTh ? therapist.availabilityTh ?? therapist.availability : therapist.availability;
  const focuses = isTh ? therapist.focusesTh ?? therapist.focuses : therapist.focuses;
  const colors = ACCENT_COLORS[therapist.color] || ACCENT_COLORS.accent;
  const Icon = therapist.icon;
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : index * 0.05, duration: 0.2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      onClick={() => onSelect(therapist)}
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
        <div style={{ width: 52, height: 52, borderRadius: 14, background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
          {therapist.profile_photo ? <img src={therapist.profile_photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Icon style={{ width: 24, height: 24, color: colors.text }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: COLORS.heading }}>{name}</span>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 999, background: colors.bg, color: colors.text }}>{tag}</span>
          </div>
          <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>{specialty}</p>
          <p style={{ fontSize: 12.5, color: COLORS.text, lineHeight: 1.45, marginBottom: 9 }}>{careFit}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 9 }}>
            <span style={{ fontSize: 10, color: COLORS.green, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <Clock style={{ width: 10, height: 10 }} />{availability}
            </span>
            {therapist.rating != null && <span style={{ fontSize: 10, color: COLORS.muted, fontWeight: 700 }}>★ {therapist.rating} ({therapist.review_count})</span>}
            {therapist.hourly_rate != null && <span style={{ fontSize: 10, color: COLORS.muted, fontWeight: 700 }}>฿{therapist.hourly_rate}{isTh ? "/ชม." : "/hr"}</span>}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {focuses.map((f) => (
              <span key={f} style={{ fontSize: 10, fontWeight: 700, background: "#FBF6F0", border: `1px solid ${COLORS.border}`, color: COLORS.muted, padding: "3px 8px", borderRadius: 999 }}>
                {f}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, marginTop: 4, flexShrink: 0 }}>
          <ChevronRight style={{ width: 16, height: 16, color: COLORS.label }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: COLORS.accentInk }}>{requestLabel || i18n.therapy.requestButton}</span>
        </div>
      </div>
    </motion.button>
  );
}
