import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarHeart, Clock } from "lucide-react";
import { FONT_BODY, COLORS, Card, ACCENT_COLORS } from "../../lib/theme.jsx";
import { useLang } from "../../lib/i18n";

function formatDate(value, lang) {
  return new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-US", { day: "numeric", month: "short", year: "numeric" }).format(value);
}

export default function StepSelectTime({ therapist, onNext }) {
  const { lang } = useLang();
  const copy = lang === "th"
    ? { title: "เลือกวันที่", today: "วันนี้", tomorrow: "พรุ่งนี้", other: "เลือกวันอื่น", period: "ช่วงเวลา", morning: "เช้า", afternoon: "บ่าย", evening: "เย็น", next: "ไปต่อ", available: "ช่วงเวลาที่เลือกได้" }
    : { title: "Choose a date", today: "Today", tomorrow: "Tomorrow", other: "Choose another day", period: "Time of day", morning: "Morning", afternoon: "Afternoon", evening: "Evening", next: "Continue", available: "Available time" };
  const today = new Date();
  const [dateChoice, setDateChoice] = useState("today");
  const [otherDate, setOtherDate] = useState("");
  const [period, setPeriod] = useState(null);
  const reduceMotion = useReducedMotion();
  const colors = ACCENT_COLORS[therapist.color] || ACCENT_COLORS.accent;
  const selectedDate = dateChoice === "today" ? today : dateChoice === "tomorrow" ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) : otherDate ? new Date(`${otherDate}T12:00:00`) : null;
  const canContinue = !!selectedDate && !!period;
  const dateLabel = selectedDate ? formatDate(selectedDate, lang) : copy.other;
  const choices = [
    { id: "today", label: copy.today, value: formatDate(today, lang) },
    { id: "tomorrow", label: copy.tomorrow, value: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), lang) },
    { id: "other", label: copy.other, value: "" },
  ];
  const periods = [copy.morning, copy.afternoon, copy.evening];

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: FONT_BODY }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: colors.bg, borderRadius: 12, padding: 14 }}>
        <CalendarHeart style={{ width: 20, height: 20, color: colors.text }} />
        <div><p style={{ fontSize: 13, fontWeight: 800, color: COLORS.heading }}>{therapist.name}</p><p style={{ fontSize: 11, color: COLORS.muted }}>{therapist.specialty}</p></div>
      </div>
      <Card>
        <p style={{ fontSize: 14, fontWeight: 800, color: COLORS.heading, marginBottom: 12 }}>{copy.title}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {choices.map((choice) => {
            const active = dateChoice === choice.id;
            return <button key={choice.id} type="button" onClick={() => setDateChoice(choice.id)} aria-pressed={active} style={{ width: "100%", textAlign: "left", padding: 13, borderRadius: 11, border: `2px solid ${active ? COLORS.accent : COLORS.border}`, background: active ? COLORS.accentSoft : "#fff", color: COLORS.heading, fontFamily: FONT_BODY, cursor: "pointer" }}><span style={{ display: "block", fontSize: 13, fontWeight: 800 }}>{choice.label}</span>{choice.value && <span style={{ display: "block", fontSize: 11, color: COLORS.muted, marginTop: 3 }}>{choice.value}</span>}</button>;
          })}
        </div>
        {dateChoice === "other" && <input type="date" value={otherDate} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setOtherDate(event.target.value)} aria-label={copy.other} style={{ width: "100%", marginTop: 10, padding: 12, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontFamily: FONT_BODY, fontSize: 13 }} />}
      </Card>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}><Clock style={{ width: 16, height: 16, color: COLORS.accent }} /><p style={{ fontSize: 14, fontWeight: 800, color: COLORS.heading }}>{copy.period}</p></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>{periods.map((item) => <button key={item} type="button" onClick={() => setPeriod(item)} aria-pressed={period === item} style={{ minHeight: 48, borderRadius: 10, border: `2px solid ${period === item ? COLORS.accent : COLORS.border}`, background: period === item ? COLORS.accent : "#fff", color: period === item ? "#fff" : COLORS.text, fontFamily: FONT_BODY, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>{item}</button>)}</div>
      </Card>
      <button type="button" disabled={!canContinue} onClick={() => onNext({ date: dateLabel, time: period })} style={{ width: "100%", padding: 15, borderRadius: 12, fontSize: 14.5, fontWeight: 700, border: 0, cursor: canContinue ? "pointer" : "not-allowed", background: canContinue ? COLORS.cta : COLORS.border, color: canContinue ? "#fff" : COLORS.label }}>{copy.next}</button>
      <p style={{ fontSize: 11, color: COLORS.muted, textAlign: "center" }}>{copy.available}</p>
    </motion.div>
  );
}
