import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FONT_BODY, COLORS, ACCENT_COLORS, Card } from "../../lib/theme.jsx";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

// Local sample slots until a care-provider schedule is connected.
const SLOTS_BY_DOW = {
  1: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
  2: ["10:00 AM", "1:00 PM", "3:30 PM", "5:00 PM"],
  3: ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"],
  4: ["9:30 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
  5: ["10:00 AM", "12:00 PM", "2:30 PM"],
};

const navBtnStyle = {
  width: 44, height: 44, borderRadius: 12, background: COLORS.border,
  border: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
};

export default function StepSelectTime({ therapist, onNext }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const reduceMotion = useReducedMotion();

  const cells = buildCalendarDays(viewYear, viewMonth);
  const colors = ACCENT_COLORS[therapist.color] || ACCENT_COLORS.accent;
  const Icon = therapist.icon;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const isToday = (d) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isPast = (d) => {
    const cellDate = new Date(viewYear, viewMonth, d);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return cellDate < t;
  };

  const slots = selectedDate
    ? SLOTS_BY_DOW[new Date(viewYear, viewMonth, selectedDate).getDay()] || []
    : [];

  const canContinue = selectedDate && selectedSlot;

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: FONT_BODY }}>
      {/* Therapist mini banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: colors.bg, borderRadius: 12, padding: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon style={{ width: 18, height: 18, color: colors.text }} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.heading }}>{therapist.name}</p>
          <p style={{ fontSize: 11, color: COLORS.muted }}>{therapist.specialty}</p>
        </div>
      </div>

      <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 14 }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: COLORS.heading }}>Soonest available: {therapist.nextSlot}</p>
        <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.45, marginTop: 4 }}>
          Pick a time you can actually protect. You can change this before confirming.
        </p>
      </div>

      {/* Calendar */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button type="button" onClick={prevMonth} style={navBtnStyle} aria-label="Show previous month">
            <ChevronLeft style={{ width: 16, height: 16, color: COLORS.heading }} />
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.heading }}>{MONTHS[viewMonth]} {viewYear}</span>
          <button type="button" onClick={nextMonth} style={navBtnStyle} aria-label="Show next month">
            <ChevronRight style={{ width: 16, height: 16, color: COLORS.heading }} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 8 }}>
          {DAYS.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: COLORS.muted, padding: "4px 0" }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const past = isPast(d);
            const isSelected = selectedDate === d;
            const hasSlots = !!SLOTS_BY_DOW[new Date(viewYear, viewMonth, d).getDay()];
            const disabled = past || !hasSlots;
            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                aria-label={`${MONTHS[viewMonth]} ${d}, ${viewYear}${disabled ? " unavailable" : " available"}`}
                aria-pressed={isSelected}
                style={{
                  position: "relative",
                  margin: "0 auto",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: isToday(d) && !isSelected ? `2px solid ${COLORS.accent}` : "2px solid transparent",
                  background: isSelected ? COLORS.accent : "transparent",
                  color: isSelected ? "#fff" : disabled ? COLORS.label : COLORS.text,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              >
                {d}
                {!disabled && !isSelected && (
                  <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: COLORS.accent }} />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Time Slots */}
      {selectedDate && (
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.heading, marginBottom: 12 }}>
              Available times — {MONTHS[viewMonth]} {selectedDate}
            </p>
            {slots.length === 0 ? (
              <p style={{ fontSize: 12, color: COLORS.muted, textAlign: "center", padding: "16px 0" }}>No slots available this day</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {slots.map((slot) => {
                  const active = selectedSlot === slot;
                  return (
                    <motion.button
                      key={slot}
                      type="button"
                      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                      onClick={() => setSelectedSlot(slot)}
                      aria-pressed={active}
                      style={{
                        minHeight: 44, padding: "10px 0", borderRadius: 10, fontSize: 12, fontWeight: 700, border: 0, cursor: "pointer",
                        background: active ? COLORS.accent : COLORS.accentSoft,
                        color: active ? "#fff" : COLORS.text,
                      }}
                    >
                      {slot}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Next Button */}
      <motion.button
        type="button"
        whileTap={canContinue && !reduceMotion ? { scale: 0.97 } : {}}
        disabled={!canContinue}
        onClick={() => onNext({ date: `${MONTHS[viewMonth]} ${selectedDate}, ${viewYear}`, time: selectedSlot })}
        style={{
          width: "100%", padding: 15, borderRadius: 12, fontSize: 14.5, fontWeight: 700, border: 0,
          cursor: canContinue ? "pointer" : "not-allowed",
          background: canContinue ? COLORS.cta : COLORS.border,
          color: canContinue ? "#fff" : COLORS.label,
          boxShadow: canContinue ? `0 12px 24px ${COLORS.ctaShadow}` : "none",
        }}
      >
        Continue
      </motion.button>
    </motion.div>
  );
}
