import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarHeart, CheckCircle2, Clock } from "lucide-react";
import { FONT_BODY, FONT_SERIF, COLORS, ACCENT_COLORS, PrimaryButton } from "../../lib/theme.jsx";
import { saveBookingState } from "../../lib/therapy-data";
import { useLang } from "../../lib/i18n";

export default function StepConfirm({ therapist, dateTime, onConfirm }) {
  const { lang } = useLang();
  const copy = lang === "th"
    ? { title: "ส่งคำขอนัดหมาย", request: "ส่งคำขอนัดหมาย", date: "วันที่", time: "ช่วงเวลา", saving: "กำลังส่งคำขอ...", success: "ส่งคำขอนัดหมายเรียบร้อยแล้ว", sentTo: "คำขอของคุณถูกส่งไปยัง", wait: "กรุณารอการตอบกลับจากผู้ให้บริการ", home: "กลับหน้า Care Circle" }
    : { title: "Send appointment request", request: "Send appointment request", date: "Date", time: "Time of day", saving: "Sending request…", success: "Request sent successfully", sentTo: "Your request was sent to", wait: "Please wait for the provider to reply.", home: "Back to Care Circle" };
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const reduceMotion = useReducedMotion();
  const colors = ACCENT_COLORS[therapist.color] || ACCENT_COLORS.accent;
  const ProviderIcon = therapist.icon;

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    saveBookingState({ therapistId: therapist.id, name: therapist.name, color: therapist.color, date: dateTime.date, time: dateTime.time });
    setLoading(false);
    setConfirmed(true);
  };

  if (confirmed) return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, padding: "48px 0", fontFamily: FONT_BODY }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: COLORS.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle2 style={{ width: 36, height: 36, color: COLORS.green }} /></div>
      <div><p style={{ fontSize: 18, fontWeight: 500, color: COLORS.heading, fontFamily: FONT_SERIF }}>{copy.success}</p><p style={{ fontSize: 13, color: COLORS.muted, marginTop: 5 }}>{copy.sentTo} {therapist.name}</p></div>
      <div style={{ background: COLORS.accentSoft, borderRadius: 12, padding: "12px 20px", fontSize: 12, color: COLORS.text }}><p>{dateTime.date} · {dateTime.time}</p></div>
      <p style={{ maxWidth: 260, fontSize: 12, color: COLORS.muted, lineHeight: 1.55 }}>{copy.wait}</p>
      <PrimaryButton type="button" onClick={onConfirm} style={{ minHeight: 46, fontSize: 13 }}>{copy.home}</PrimaryButton>
    </motion.div>
  );

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: FONT_BODY }}>
      <div style={{ background: colors.bg, borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: COLORS.heading }}>{copy.title}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 48, height: 48, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><ProviderIcon style={{ width: 22, height: 22, color: colors.text }} /></div><p style={{ fontSize: 14, fontWeight: 800, color: COLORS.heading }}>{therapist.name}</p></div>
        <div style={{ borderTop: "1px solid rgba(175,99,106,.15)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 9 }}><div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: COLORS.text }}><CalendarHeart style={{ width: 14, height: 14, color: COLORS.accent }} />{copy.date}: <strong>{dateTime.date}</strong></div><div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: COLORS.text }}><Clock style={{ width: 14, height: 14, color: COLORS.accent }} />{copy.time}: <strong>{dateTime.time}</strong></div></div>
      </div>
      <PrimaryButton type="button" onClick={handleConfirm} disabled={loading} aria-busy={loading} style={{ padding: 15, fontWeight: 700, fontSize: 14.5 }}>{loading ? copy.saving : copy.request}</PrimaryButton>
    </motion.div>
  );
}
